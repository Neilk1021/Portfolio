/**
 * Regenerates src/data/prSnapshot.ts from the live GitHub search API.
 *
 * Run this occasionally so the offline fallback doesn't drift far from reality.
 * Deliberately unauthenticated so the snapshot matches what a visitor sees -
 * signing in would include private repos the public feed can never show.
 *
 *   node scripts/refresh-pr-snapshot.mjs
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../src/data/prSnapshot.ts');
const USER = 'Neilk1021';

const res = await fetch(
  `https://api.github.com/search/issues?q=author:${USER}+type:pr&per_page=100`,
  { headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } },
);
if (!res.ok) {
  console.error(`GitHub API ${res.status} - ${res.status === 403 ? 'rate limited, try again in a minute' : 'failed'}`);
  process.exit(1);
}

const { items = [] } = await res.json();
const prs = items
  .filter((i) => !i.draft)
  .map((i) => ({
    id: i.id,
    repo: i.repository_url.replace(/^.*\/repos\//, ''),
    number: i.number,
    title: i.title,
    url: i.html_url,
    state: i.pull_request?.merged_at ? 'merged' : i.state === 'open' ? 'open' : 'closed',
    createdAt: i.created_at,
    mergedAt: i.pull_request?.merged_at ?? null,
  }))
  .filter((p) => p.repo.split('/')[0].toLowerCase() !== 'neilk1021')
  .filter((p) => p.state !== 'closed')
  .sort((a, b) => b.number - a.number);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  OUT,
  `/**
 * Static fallback for the open-source feed.
 *
 * This lives in a .ts module rather than public/*.json on purpose: a fallback
 * that itself needs a network request is not a fallback. Being a module also
 * means \`satisfies\` type-checks it, so it cannot silently rot when PullRequest
 * changes shape.
 *
 * Captured from the UNAUTHENTICATED search API, so it matches what a visitor
 * actually sees - two private-repo PRs the author sees when signed in are
 * absent here by design.
 *
 * To refresh: node scripts/refresh-pr-snapshot.mjs
 */
import type { PullRequest } from '../lib/github';

export const SNAPSHOT_CAPTURED_AT = '${today}';

export const PR_SNAPSHOT = [
${prs.map((p) => '  ' + JSON.stringify(p) + ',').join('\n')}
] satisfies readonly PullRequest[];
`,
);

const merged = prs.filter((p) => p.state === 'merged').length;
console.log(`wrote ${prs.length} PRs (${merged} merged, ${prs.length - merged} open) -> src/data/prSnapshot.ts`);
