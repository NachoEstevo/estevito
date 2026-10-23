import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const USERNAME = 'NachoEstevo';
const DAY = 86_400_000;
const OUTPUT = fileURLToPath(new URL('../data/activity.json', import.meta.url));
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function dateKey(value) {
  if (typeof value !== 'string' || !DATE.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value
    ? value
    : null;
}

export function periodFor(now = new Date()) {
  const end = now.toISOString().slice(0, 10);
  // A Sunday-first, 53-week calendar, including today's partial week.
  // A successfully fetched GitHub calendar takes precedence over this fallback.
  const first = new Date(Date.parse(`${end}T00:00:00Z`) - 364 * DAY);
  first.setUTCDate(first.getUTCDate() - first.getUTCDay());
  const start = first.toISOString().slice(0, 10);
  return {
    start,
    end,
    days: (Date.parse(`${end}T00:00:00Z`) - first.valueOf()) / DAY + 1,
  };
}

function daySeries(period, values) {
  const days = [];
  for (
    let time = Date.parse(`${period.start}T00:00:00Z`);
    time <= Date.parse(`${period.end}T00:00:00Z`);
    time += DAY
  ) {
    const date = new Date(time).toISOString().slice(0, 10);
    days.push({ date, count: values.get(date) || 0 });
  }
  return days;
}

function integer(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Invalid ${name}`);
  return value;
}

// GitHub publishes this calendar as HTML, not as a supported JSON embed API.
// Parse only the known aggregate fields; never render or retain upstream HTML.
export function normalizeGithub(html, fetchedAt, username = USERNAME) {
  if (typeof html !== 'string' || html.length > 1_000_000)
    throw new Error('Invalid GitHub calendar');
  const attrs = tag =>
    Object.fromEntries(
      [...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]])
    );
  const calendarTag = [...html.matchAll(/<div\b[^>]*>/g)]
    .map(match => attrs(match[0]))
    .find(tag => tag['data-graph-url'] === '/users/' + username + '/contributions');
  if (!calendarTag) throw new Error('Wrong GitHub calendar profile');
  const start = dateKey(calendarTag['data-from']?.slice(0, 10));
  const end = dateKey(calendarTag['data-to']?.slice(0, 10));
  const length =
    (Date.parse(end + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / DAY + 1;
  if (
    !start ||
    !end ||
    length < 365 ||
    length > 371 ||
    new Date(start + 'T00:00:00Z').getUTCDay() !== 0
  )
    throw new Error('Invalid GitHub calendar period');
  const heading = html.match(
    /<h2\b[^>]*id="js-contribution-activity-description"[^>]*>([\s\S]*?)<\/h2>/
  )?.[1];
  const headerTotal = heading
    ?.replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .match(/^([\d,]+) contributions? in the last year$/)?.[1];
  if (!headerTotal) throw new Error('Missing GitHub calendar total');
  const total = integer(
    Number(headerTotal.replaceAll(',', '')),
    'GitHub contribution total'
  );
  const tips = new Map();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const target = attrs(match[1]).for;
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const count = text.match(/^(No|[\d,]+) contributions? on /)?.[1];
    if (target && count)
      tips.set(
        target,
        count === 'No'
          ? 0
          : integer(Number(count.replaceAll(',', '')), 'GitHub daily contributions')
      );
  }
  const counts = new Map();
  for (const match of html.matchAll(/<td\b[^>]*>/g)) {
    const tag = attrs(match[0]);
    if (!tag.class?.split(' ').includes('ContributionCalendar-day')) continue;
    const date = dateKey(tag['data-date']);
    const level = Number(tag['data-level']);
    const count = tips.get(tag.id);
    if (
      !date ||
      date < start ||
      date > end ||
      counts.has(date) ||
      !Number.isInteger(level) ||
      level < 0 ||
      level > 4 ||
      !Number.isSafeInteger(count) ||
      (count === 0) !== (level === 0)
    )
      throw new Error('Invalid GitHub calendar day');
    counts.set(date, { date, count, level });
  }
  const days = [...counts.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (
    days.length !== length ||
    days.some(
      (day, i) =>
        day.date !==
        new Date(Date.parse(start + 'T00:00:00Z') + i * DAY).toISOString().slice(0, 10)
    ) ||
    days.reduce((sum, day) => sum + day.count, 0) !== total
  )
    throw new Error('Incomplete GitHub calendar');
  return {
    status: 'ready',
    metric: 'contributions',
    username,
    profileUrl: 'https://github.com/' + username,
    sourceUrl: 'https://github.com/users/' + username + '/contributions',
    fetchedAt,
    period: { start, end, days: length },
    total,
    days,
    basis:
      'Calendario público de contribuciones de GitHub. Conteos y niveles diarios del gráfico oficial; sin información de repositorios ni commits.',
  };
}

export function normalizeTokscale(payload, period, fetchedAt, username = USERNAME) {
  if (
    payload?.user?.username?.toLowerCase() !== username.toLowerCase() ||
    !Array.isArray(payload.contributions)
  )
    throw new Error('Invalid Tokscale profile');
  const start = dateKey(period?.start);
  const end = dateKey(period?.end);
  const length =
    (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY + 1;
  if (
    !start ||
    !end ||
    length < 365 ||
    length > 371 ||
    period.days !== length ||
    new Date(`${start}T00:00:00Z`).getUTCDay() !== 0
  )
    throw new Error('Invalid Tokscale annual period');
  const counts = new Map();
  const levels = new Map();
  const seen = new Set();
  let cacheTokens = 0;
  let historicalSum = 0;
  for (const contribution of payload.contributions) {
    const date = dateKey(contribution.date);
    if (!date) throw new Error('Invalid Tokscale date');
    if (seen.has(date)) throw new Error('Duplicate Tokscale day');
    seen.add(date);
    const tokens = integer(contribution.totals?.tokens, 'token count');
    const read = integer(contribution.tokenBreakdown?.cacheRead, 'cache reads');
    const write = integer(contribution.tokenBreakdown?.cacheWrite, 'cache writes');
    const level = integer(contribution.intensity, 'token intensity');
    if (read + write > tokens || level > 4 || (tokens === 0) !== (level === 0))
      throw new Error('Invalid Tokscale daily breakdown');
    historicalSum += tokens;
    if (date < period.start || date > period.end) continue;
    cacheTokens += read + write;
    counts.set(date, tokens);
    levels.set(date, level);
  }
  const lifetimeTotal = integer(payload.stats?.totalTokens, 'historical token total');
  if (integer(historicalSum, 'historical daily total') !== lifetimeTotal)
    throw new Error('Incomplete Tokscale history');
  const days = daySeries(period, counts).map(day => ({
    ...day,
    level: levels.get(day.date) || 0,
  }));
  const total = integer(
    days.reduce((sum, day) => sum + day.count, 0),
    'token total'
  );
  if (cacheTokens > total || total > lifetimeTotal)
    throw new Error('Invalid Tokscale totals');
  const publishedAt = new Date(payload.updatedAt);
  if (!Number.isFinite(publishedAt.valueOf()))
    throw new Error('Missing Tokscale update date');
  return {
    status: 'ready',
    metric: 'tokens',
    username,
    profileUrl: `https://tokscale.ai/u/${username}`,
    fetchedAt,
    publishedAt: publishedAt.toISOString(),
    period,
    total,
    lifetimeTotal,
    cacheTokens: integer(cacheTokens, 'cache total'),
    activeDays: days.filter(day => day.count > 0).length,
    days,
    basis:
      'Calendario anual de tokens publicados en Tokscale, alineado con GitHub. Incluye lectura y escritura de caché. lifetimeTotal es el total histórico publicado del perfil.',
  };
}

async function getJson(url, fetcher) {
  // Deliberately anonymous: no local credentials and no environment token are read.
  const response = await fetcher(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'NachoEstevo-CV-activity' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
  return response.json();
}

async function github(fetchedAt, fetcher) {
  const response = await fetcher(
    'https://github.com/users/' + USERNAME + '/contributions',
    {
      headers: {
        Accept: 'text/html',
        'Accept-Language': 'en-US',
        'User-Agent': 'NachoEstevo-CV-activity',
      },
      signal: AbortSignal.timeout(20_000),
    }
  );
  if (!response.ok) throw new Error('GitHub calendar returned HTTP ' + response.status);
  return normalizeGithub(await response.text(), fetchedAt);
}

export async function refreshActivity(
  previous = {},
  { fetcher = fetch, now = new Date() } = {}
) {
  const fetchedAt = now.toISOString();
  const result = { schemaVersion: 1 };
  let failures = 0;
  function preserve(name, metric) {
    failures++;
    const source = previous[name];
    const annual = source?.period?.days >= 365 && source?.period?.days <= 371;
    const fallback =
      source?.status === 'ready' && source.metric === metric && annual
        ? { ...source, refreshFailedAt: fetchedAt }
        : { status: 'unavailable', refreshFailedAt: fetchedAt };
    if (name === 'github') delete fallback.commits;
    return fallback;
  }
  const [calendar, tokens] = await Promise.allSettled([
    github(fetchedAt, fetcher),
    getJson('https://tokscale.ai/api/users/' + USERNAME, fetcher),
  ]);
  result.github =
    calendar.status === 'fulfilled'
      ? calendar.value
      : preserve('github', 'contributions');
  const period = result.github.status === 'ready' ? result.github.period : periodFor(now);
  try {
    if (tokens.status === 'rejected') throw tokens.reason;
    result.tokscale = normalizeTokscale(tokens.value, period, fetchedAt);
  } catch {
    result.tokscale = preserve('tokscale', 'tokens');
  }
  return { data: result, failures };
}

async function main() {
  let previous = {};
  try {
    previous = JSON.parse(await readFile(OUTPUT, 'utf8'));
  } catch {
    /* First refresh. */
  }
  const { data, failures } = await refreshActivity(previous);
  await mkdir(dirname(OUTPUT), { recursive: true });
  const pending = `${OUTPUT}.tmp`;
  await writeFile(pending, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  await rename(pending, OUTPUT);
  for (const name of ['github', 'tokscale']) {
    console.log(
      `${name}: ${data[name].status}${
        data[name].refreshFailedAt ? ' (previous snapshot preserved)' : ''
      }`
    );
  }
  if (failures) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main();
