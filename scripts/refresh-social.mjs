import { writeFile } from 'node:fs/promises';
const get = async url => {
  const r = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: { 'User-Agent': 'Nacho-CV' },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
};
const [events, tokens] = await Promise.all([
  get('https://api.github.com/users/NachoEstevo/events/public?per_page=30'),
  get('https://tokscale.ai/api/users/NachoEstevo'),
]);
const commits = [];
const seen = new Set();
for (const event of events.filter(e => e.public && e.type === 'PushEvent')) {
  if (seen.has(event.repo.name)) continue;
  seen.add(event.repo.name);
  const recent = await get(
    `https://api.github.com/repos/${event.repo.name}/commits?author=NachoEstevo&per_page=3`
  );
  if (!recent.length && event.payload.head)
    recent.push(
      await get(
        `https://api.github.com/repos/${event.repo.name}/commits/${event.payload.head}`
      )
    );
  for (const data of recent)
    commits.push({
      repo: event.repo.name,
      sha: data.sha,
      url: data.html_url,
      message: data.commit.message.split('\n')[0],
      date: data.commit.author.date,
    });
  if (commits.length >= 3) break;
}
commits.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
if (!Number.isFinite(tokens.stats.totalCost) || tokens.stats.totalCost < 0)
  throw new Error('Invalid Tokscale cost');
await writeFile(
  new URL('../data/social.json', import.meta.url),
  JSON.stringify(
    {
      commits,
      costUSD: tokens.stats.totalCost,
      tokenTotal: tokens.stats.totalTokens,
      dailyCosts: tokens.contributions.map(d => ({
        date: d.date,
        costUSD: d.totals.cost,
      })),
    },
    null,
    2
  )
);
console.log('Public commits and reported Tokscale cost saved');
