import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dateKey,
  normalizeGithub,
  normalizeTokscale,
  periodFor,
  refreshActivity,
} from '../scripts/refresh-activity.mjs';

const now = new Date('2026-10-23T15:00:00Z');
const fetchedAt = now.toISOString();
const period = periodFor(now);
const calendar = (overrides = {}) => {
  const start = '2025-10-19';
  const length = 370;
  const entries = Array.from({ length }, (_, i) => {
    const date = new Date(Date.parse(start + 'T00:00:00Z') + i * 86400000)
      .toISOString()
      .slice(0, 10);
    const count = i === 1 ? 1 : i === length - 1 ? 3 : 0;
    const level = count === 0 ? 0 : count === 1 ? 1 : 4;
    return (
      '<td class="ContributionCalendar-day" id="day-' +
      i +
      '" data-date="' +
      date +
      '" data-level="' +
      level +
      '"></td><tool-tip for="day-' +
      i +
      '">' +
      (count || 'No') +
      ' contributions on some date.</tool-tip>'
    );
  });
  return (
    '<div data-graph-url="/users/' +
    (overrides.username || 'NachoEstevo') +
    '/contributions" data-from="2025-10-19 00:00:00 UTC" data-to="2026-10-23 23:59:59 UTC"><h2 id="js-contribution-activity-description">' +
    (overrides.total ?? 4) +
    ' contributions in the last year</h2>' +
    entries.slice(0, overrides.days ?? length).join('') +
    '</div>'
  );
};
const tokens = (date, value = 100, cache = 50) => ({
  date,
  intensity: value > 0 ? 1 : 0,
  totals: { tokens: value, cost: 400 },
  tokenBreakdown: { cacheRead: cache, cacheWrite: 10 },
  clients: [{ secrets: 'Not copied into snapshot' }],
});
const profile = contributions => ({
  user: { username: 'NachoEstevo', id: 'unneeded-id' },
  contributions,
  updatedAt: '2026-10-22T00:00:00Z',
  stats: {
    totalTokens: contributions.reduce((sum, day) => sum + day.totals.tokens, 0),
    totalCost: 12345,
  },
  models: ['unneeded-model-data'],
});

test('fallback period spans a Sunday-first 53-week calendar, including leap-year boundaries', () => {
  assert.deepEqual(period, { start: '2025-10-19', end: '2026-10-23', days: 370 });
  for (const date of [
    '2024-02-29T12:00:00Z',
    '2024-03-03T12:00:00Z',
    '2026-01-01T12:00:00Z',
  ]) {
    const calendar = periodFor(new Date(date));
    assert.equal(new Date(`${calendar.start}T00:00:00Z`).getUTCDay(), 0);
    assert.equal(Math.ceil(calendar.days / 7), 53);
    assert.equal(calendar.end, date.slice(0, 10));
  }
  assert.equal(dateKey('2026-02-30'), null);
  assert.equal(dateKey('invalid'), null);
});

test('GitHub keeps the official annual counts, dates and levels without upstream HTML or individual details', () => {
  const result = normalizeGithub(
    calendar() + '<script>private-looking extra content</script>',
    fetchedAt
  );
  assert.equal(result.total, 4);
  assert.equal(result.metric, 'contributions');
  assert.deepEqual(result.period, { start: '2025-10-19', end: '2026-10-23', days: 370 });
  assert.equal(result.days[1].count, 1);
  assert.equal(
    result.days.at(-1).level,
    4,
    'preserves official levels rather than recalculating intensity'
  );
  assert.equal(result.sourceUrl, 'https://github.com/users/NachoEstevo/contributions');
  const serialized = JSON.stringify(result);
  for (const omitted of ['"commits":', '"sha":', '<script>', 'private-looking'])
    assert.ok(!serialized.includes(omitted));
});

test('GitHub refuses an incomplete, inconsistent or wrong-account calendar', () => {
  assert.throws(() => normalizeGithub(calendar({ days: 369 }), fetchedAt), /Incomplete/);
  assert.throws(() => normalizeGithub(calendar({ total: 500 }), fetchedAt), /Incomplete/);
  assert.throws(
    () => normalizeGithub(calendar({ username: 'someone-else' }), fetchedAt),
    /Wrong/
  );
  assert.throws(
    () =>
      normalizeGithub(calendar().replace('data-level="4"', 'data-level="5"'), fetchedAt),
    /Invalid/
  );
  assert.throws(() => normalizeGithub('<h2>not a calendar</h2>', fetchedAt), /Wrong/);
});

test('Tokscale separates the annual calendar total from the authenticated public lifetime total', () => {
  const result = normalizeTokscale(
    profile([
      tokens('2025-10-18', 9999),
      tokens('2025-10-19', 100),
      tokens('2026-10-21', 200),
    ]),
    period,
    fetchedAt
  );
  assert.equal(result.total, 300);
  assert.equal(result.lifetimeTotal, 10299);
  assert.equal(result.metric, 'tokens');
  assert.equal(result.cacheTokens, 120);
  assert.equal(result.activeDays, 2);
  assert.equal(result.days.length, 370);
  assert.equal(result.days[0].count, 100);
  assert.equal(result.days.at(-1).count, 0);
  assert.equal(result.days[0].level, 1);
  assert.equal(result.days.at(-1).level, 0);
  const serialized = JSON.stringify(result);
  for (const omitted of [
    'totalCost',
    'cost',
    'clients',
    'unneeded-model-data',
    'unneeded-id',
  ]) {
    assert.ok(!serialized.includes(omitted));
  }
});

test('Tokscale rejects duplicate days, invalid counts, and the wrong account', () => {
  assert.throws(
    () =>
      normalizeTokscale(
        profile([tokens('2026-10-21'), tokens('2026-10-21')]),
        period,
        fetchedAt
      ),
    /Duplicate/
  );
  assert.throws(
    () => normalizeTokscale(profile([tokens('2026-10-21', -1)]), period, fetchedAt),
    /Invalid/
  );
  assert.throws(
    () =>
      normalizeTokscale(
        {
          ...profile([]),
          user: { username: 'different-person' },
        },
        period,
        fetchedAt
      ),
    /Invalid/
  );
});

test('an unavailable source preserves its original good snapshot while the other refreshes', async () => {
  const prior = normalizeGithub(calendar(), '2026-10-20T10:00:00Z');
  prior.commits = [{ sha: 'legacy-sha', message: 'Legacy feed entry' }];
  const fetcher = async url =>
    url.includes('github.com')
      ? { ok: false, status: 403 }
      : { ok: true, json: async () => profile([tokens('2026-10-21')]) };
  const { data, failures } = await refreshActivity({ github: prior }, { fetcher, now });
  assert.equal(failures, 1);
  assert.equal(data.github.fetchedAt, prior.fetchedAt);
  assert.equal(data.github.refreshFailedAt, fetchedAt);
  assert.deepEqual(data.github.days, prior.days);
  assert.equal(
    'commits' in data.github,
    false,
    'retired feed is removed even on upstream failure'
  );
  assert.ok(!JSON.stringify(data).includes('Legacy feed entry'));
  assert.equal(data.tokscale.total, 100);
});

test('a first-run upstream failure is unavailable, never a fabricated zero', async () => {
  const { data, failures } = await refreshActivity(
    {},
    {
      now,
      fetcher: async () => {
        throw new Error('offline');
      },
    }
  );
  assert.equal(failures, 2);
  assert.equal(data.github.status, 'unavailable');
  assert.equal(data.tokscale.status, 'unavailable');
  assert.equal('total' in data.github, false);
  assert.equal('days' in data.tokscale, false);
});

test('an obsolete commit-count snapshot is never shown as annual contributions after refresh failure', async () => {
  const { data } = await refreshActivity(
    { github: { status: 'ready', total: 32, commits: ['old'] } },
    {
      now,
      fetcher: async () => {
        throw new Error('offline');
      },
    }
  );
  assert.deepEqual(data.github, { status: 'unavailable', refreshFailedAt: fetchedAt });
});

test('refresh obtains only the anonymous official calendar and public Tokscale aggregates', async () => {
  const calls = [];
  const { data, failures } = await refreshActivity(
    {},
    {
      now,
      fetcher: async (url, options) => {
        calls.push({ url, options });
        return url.includes('github.com')
          ? { ok: true, text: async () => calendar() }
          : { ok: true, json: async () => profile([tokens('2026-10-21')]) };
      },
    }
  );
  assert.equal(failures, 0);
  assert.equal(data.github.total, 4);
  assert.equal(data.github.days.length, 370);
  assert.equal(data.tokscale.days.length, 370);
  assert.deepEqual(data.tokscale.period, data.github.period);
  assert.ok(
    calls.some(call => call.url === 'https://github.com/users/NachoEstevo/contributions')
  );
  assert.ok(calls.every(call => !('Authorization' in call.options.headers)));
});

test('Tokscale refuses partial history and mismatched lifetime totals', () => {
  const payload = profile([tokens('2026-10-21')]);
  assert.throws(
    () =>
      normalizeTokscale({ ...payload, stats: { totalTokens: 99 } }, period, fetchedAt),
    /Incomplete/
  );
  assert.throws(
    () =>
      normalizeTokscale({ ...payload, stats: { totalTokens: 101 } }, period, fetchedAt),
    /Incomplete/
  );
  assert.throws(
    () =>
      normalizeTokscale(
        payload,
        { start: '2026-07-26', end: '2026-10-23', days: 90 },
        fetchedAt
      ),
    /annual period/
  );
});

test('Tokscale uses an independent annual period when GitHub has no valid snapshot', async () => {
  const { data, failures } = await refreshActivity(
    {},
    {
      now,
      fetcher: async url =>
        url.includes('github.com')
          ? { ok: false, status: 503 }
          : { ok: true, json: async () => profile([tokens('2026-10-21')]) },
    }
  );
  assert.equal(failures, 1);
  assert.deepEqual(data.tokscale.period, period);
  assert.equal(data.tokscale.lifetimeTotal, 100);
});

test('a failed Tokscale refresh preserves an annual snapshot but discards an obsolete 90-day one', async () => {
  const prior = normalizeTokscale(
    profile([tokens('2026-10-21')]),
    period,
    '2026-10-20T10:00:00Z'
  );
  const fetcher = async url =>
    url.includes('github.com')
      ? { ok: true, text: async () => calendar() }
      : { ok: false, status: 503 };
  const { data } = await refreshActivity({ tokscale: prior }, { now, fetcher });
  assert.equal(data.tokscale.fetchedAt, prior.fetchedAt);
  assert.equal(data.tokscale.lifetimeTotal, prior.lifetimeTotal);
  assert.deepEqual(data.tokscale.days, prior.days);
  const old = { ...prior, period: { start: '2026-07-26', end: '2026-10-23', days: 90 } };
  const migrated = await refreshActivity({ tokscale: old }, { now, fetcher });
  assert.equal(migrated.data.tokscale.status, 'unavailable');
});
