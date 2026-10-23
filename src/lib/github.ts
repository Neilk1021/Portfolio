/**
 * Live "open source contributions" feed.
 *
 * Reads PRs authored by the user from GitHub's search API, UNAUTHENTICATED.
 *
 * There is deliberately no token here. Anything in a VITE_* variable is inlined
 * into the JS bundle in plaintext, so a PAT would be published on every deploy
 * and GitHub's secret scanning would revoke it. Raising the limit properly means
 * a server-side proxy holding the token, which this site doesn't have. Do not
 * "fix" this by adding an Authorization header.
 *
 * Consequences of being unauthenticated, both handled below:
 *   - the search resource allows only 10 requests/minute per IP
 *   - private repositories are invisible, so the public result set is smaller
 *     than what the author sees when signed in
 */

export type PrState = 'merged' | 'open' | 'closed';

export interface PullRequest {
  id: number;
  /** "apache/texera" */
  repo: string;
  number: number;
  title: string;
  url: string;
  state: PrState;
  createdAt: string;
  mergedAt: string | null;
}

export interface RepoGroup {
  repo: string;
  url: string;
  merged: number;
  open: number;
  prs: PullRequest[];
}

export type FeedSource = 'live' | 'cache' | 'snapshot';

export interface Feed {
  groups: RepoGroup[];
  totalMerged: number;
  totalOpen: number;
  source: FeedSource;
  fetchedAt: string;
}

/** Only the fields we read. `body` is excluded on purpose - it is ~97% of a
 *  159 KB response and we never render it. */
interface RawItem {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  draft?: boolean;
  created_at: string;
  repository_url: string;
  pull_request?: { merged_at: string | null };
}

interface RawResponse {
  total_count: number;
  items?: RawItem[];
}

export const GITHUB_USER = 'Neilk1021';
export const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;

const SEARCH_URL =
  `https://api.github.com/search/issues` +
  `?q=author:${GITHUB_USER}+type:pr&per_page=100`;

/** The author's own repos, including their texera fork. The point of this
 *  section is upstream contribution, not self-authored pushes. */
const EXCLUDED_OWNERS = ['neilk1021'];

const CACHE_KEY = 'cnel.prs.v1';
const TTL_MS = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 8000;

interface CacheEnvelope {
  v: 1;
  fetchedAt: string;
  prs: PullRequest[];
}

function stateOf(item: RawItem): PrState {
  if (item.pull_request?.merged_at) return 'merged';
  return item.state === 'open' ? 'open' : 'closed';
}

export function normalize(raw: RawResponse): PullRequest[] {
  return (raw.items ?? [])
    .filter((i) => !i.draft)
    .map((i) => ({
      id: i.id,
      repo: i.repository_url.replace(/^.*\/repos\//, ''),
      number: i.number,
      title: i.title,
      url: i.html_url,
      state: stateOf(i),
      createdAt: i.created_at,
      mergedAt: i.pull_request?.merged_at ?? null,
    }))
    .filter((p) => !EXCLUDED_OWNERS.includes(p.repo.split('/')[0].toLowerCase()))
    // Closed-unmerged PRs here are all supersedes of the author's own later
    // merged work, so showing them next to the merged duplicate reads worse
    // than omitting them.
    .filter((p) => p.state !== 'closed');
}

export function groupByRepo(prs: PullRequest[]): RepoGroup[] {
  const byRepo = new Map<string, PullRequest[]>();
  for (const pr of prs) {
    const list = byRepo.get(pr.repo);
    if (list) list.push(pr);
    else byRepo.set(pr.repo, [pr]);
  }

  return [...byRepo.entries()]
    .map(([repo, list]) => ({
      repo,
      url: `https://github.com/${repo}`,
      merged: list.filter((p) => p.state === 'merged').length,
      open: list.filter((p) => p.state === 'open').length,
      prs: [...list].sort((a, b) => b.number - a.number),
    }))
    .sort((a, b) => b.merged - a.merged || b.prs.length - a.prs.length);
}

// --- cache -----------------------------------------------------------------
// Every access is wrapped: Safari private mode throws on setItem, and a stale
// shape from an older deploy must read as a miss rather than crash the page.

function readCache(): CacheEnvelope | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEnvelope;
    if (parsed?.v !== 1 || !Array.isArray(parsed.prs)) return null;
    if (Date.now() - new Date(parsed.fetchedAt).getTime() > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(prs: PullRequest[], fetchedAt: string): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ v: 1, fetchedAt, prs } satisfies CacheEnvelope));
  } catch {
    /* storage unavailable or full - the feed still works, just uncached */
  }
}

export async function fetchPullRequests(signal?: AbortSignal): Promise<PullRequest[]> {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  const res = await fetch(SEARCH_URL, {
    signal: combined,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  // 403/429 is the rate limit. Treat it as terminal for this page view -
  // retrying is what deepens the block.
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);

  return normalize((await res.json()) as RawResponse);
}

export function toFeed(prs: PullRequest[], source: FeedSource, fetchedAt: string): Feed {
  return {
    groups: groupByRepo(prs),
    totalMerged: prs.filter((p) => p.state === 'merged').length,
    totalOpen: prs.filter((p) => p.state === 'open').length,
    source,
    fetchedAt,
  };
}

export { readCache, writeCache };
