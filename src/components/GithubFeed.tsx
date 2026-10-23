import { useEffect, useState } from 'react';
import './GithubFeed.css';
import ExpandableButton from './ExpandableButton';
import StatusLine from './StatusLine';
import TerminalLink from './TerminalLink';
import { PR_SNAPSHOT, SNAPSHOT_CAPTURED_AT } from '../data/prSnapshot';
import {
  GITHUB_PROFILE, fetchPullRequests, readCache, toFeed, writeCache,
} from '../lib/github';
import type { Feed, PullRequest } from '../lib/github';

const SNAPSHOT_FEED = () =>
  toFeed(PR_SNAPSHOT as unknown as PullRequest[], 'snapshot', SNAPSHOT_CAPTURED_AT);

const STATE_LABEL = { merged: '[MERGED]', open: '[ OPEN ]', closed: '[CLOSED]' } as const;

function SourceNote({ feed, syncing }: { feed: Feed; syncing: boolean }) {
  if (syncing) return <StatusLine>SYNCING_WITH_GITHUB...</StatusLine>;

  if (feed.source === 'snapshot') {
    return (
      <StatusLine>
        LAST_SYNC: {feed.fetchedAt} [ OFFLINE_CACHE ]. Live data unavailable, showing a
        stored snapshot.
      </StatusLine>
    );
  }

  const stamp = new Date(feed.fetchedAt).toISOString().replace('T', ' ').slice(0, 16);
  return (
    <StatusLine>
      LAST_SYNC: {stamp}Z [ {feed.source === 'live' ? 'LIVE' : 'CACHED'} ]
    </StatusLine>
  );
}

/**
 * Resolved synchronously, before first paint:
 *   fresh cache -> use it, and skip the network entirely
 *   otherwise   -> the baked-in snapshot, and fetch in the background
 *
 * Seeding state from the snapshot rather than an empty array is what
 * guarantees this section can never render blank. It's structural, not
 * delegated to an error handler that might have a hole in it.
 */
function initialFeed(): Feed {
  const cached = readCache();
  // A fresh cache means no request at all, which is what actually protects a
  // 10-requests-per-minute budget when someone clicks around the site.
  return cached ? toFeed(cached.prs, 'cache', cached.fetchedAt) : SNAPSHOT_FEED();
}

export default function GithubFeed() {
  const [feed, setFeed] = useState<Feed>(initialFeed);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Only hit the network when we fell back to the snapshot.
    if (feed.source !== 'snapshot') return;

    const controller = new AbortController();
    setSyncing(true);

    fetchPullRequests(controller.signal)
      .then((prs) => {
        if (controller.signal.aborted) return;
        const now = new Date().toISOString();
        writeCache(prs, now);
        setFeed(toFeed(prs, 'live', now));
      })
      .catch(() => {
        // Keep whatever is already on screen (the snapshot) and say so.
      })
      .finally(() => {
        if (!controller.signal.aborted) setSyncing(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount; feed.source is the seed decision, not a trigger
  }, []);

  return (
    <div className="GithubFeed">
      <SourceNote feed={feed} syncing={syncing} />

      <p className="FeedTotals">
        {feed.totalMerged} MERGED / {feed.totalOpen} OPEN across {feed.groups.length}{' '}
        {feed.groups.length === 1 ? 'repository' : 'repositories'}
      </p>

      {feed.groups.map((group, i) => (
        <div className="RepoGroup" key={group.repo}>
          <div className="RepoHead">
            <a href={group.url} target="_blank" rel="noopener noreferrer" className="RepoName">
              {group.repo}
            </a>
            <span className="RepoCounts">
              {group.merged} MERGED{group.open > 0 && ` / ${group.open} OPEN`}
            </span>
          </div>

          <ExpandableButton
            name={`${group.prs.length} pull request${group.prs.length === 1 ? '' : 's'}`}
            defaultOpen={i === 0}
          >
            <ul className="PrList">
              {group.prs.map((pr) => (
                <li key={pr.id}>
                  <span className={`PrState PrState--${pr.state}`}>{STATE_LABEL[pr.state]}</span>
                  <a href={pr.url} target="_blank" rel="noopener noreferrer" className="PrLink">
                    #{pr.number} {pr.title}
                  </a>
                </li>
              ))}
            </ul>
          </ExpandableButton>
        </div>
      ))}

      <div className="LinkRow">
        <TerminalLink label="ALL_ACTIVITY_ON_GITHUB" href={GITHUB_PROFILE} />
      </div>
    </div>
  );
}
