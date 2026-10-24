/**
 * Static fallback for the open-source feed.
 *
 * This lives in a .ts module rather than public/*.json on purpose: a fallback
 * that itself needs a network request is not a fallback. Being a module also
 * means `satisfies` type-checks it, so it cannot silently rot when PullRequest
 * changes shape.
 *
 * Captured from the UNAUTHENTICATED search API, so it matches what a visitor
 * actually sees - two private-repo PRs the author sees when signed in are
 * absent here by design.
 *
 * To refresh: node scripts/refresh-pr-snapshot.mjs
 */
import type { PullRequest } from '../lib/github';

export const SNAPSHOT_CAPTURED_AT = '2026-10-23';

export const PR_SNAPSHOT = [
  {"id":1995784466,"repo":"JetBrains/swot","number":19344,"title":"Add Foothill High School","url":"https://github.com/JetBrains/swot/pull/19344","state":"merged","createdAt":"2023-11-16T00:03:26Z","mergedAt":"2023-11-20T12:46:19Z"},
  {"id":5316045886,"repo":"apache/texera","number":8314,"title":"feat(auth): add Sign in with Apple","url":"https://github.com/apache/texera/pull/8314","state":"merged","createdAt":"2026-09-01T19:40:08Z","mergedAt":"2026-09-15T05:23:06Z"},
  {"id":5260750450,"repo":"apache/texera","number":7999,"title":"fix(test, frontend): bound the workflow-snapshot render's cost under jsdom","url":"https://github.com/apache/texera/pull/7999","state":"merged","createdAt":"2026-08-26T19:32:56Z","mergedAt":"2026-08-27T20:30:46Z"},
  {"id":5250780279,"repo":"apache/texera","number":7978,"title":"feat(auth): Add email verification to user registration to verify email ownership.","url":"https://github.com/apache/texera/pull/7978","state":"merged","createdAt":"2026-08-25T21:19:21Z","mergedAt":"2026-08-31T19:32:22Z"},
  {"id":5185308220,"repo":"apache/texera","number":7758,"title":"feat(frontend): ask an account with no email address for one at sign-in","url":"https://github.com/apache/texera/pull/7758","state":"merged","createdAt":"2026-08-18T19:04:55Z","mergedAt":"2026-08-21T20:40:48Z"},
  {"id":5154714588,"repo":"apache/texera","number":7664,"title":"feat(auth): add ORCID login","url":"https://github.com/apache/texera/pull/7664","state":"merged","createdAt":"2026-08-14T18:47:25Z","mergedAt":"2026-09-03T02:52:08Z"},
  {"id":5123829441,"repo":"apache/texera","number":7563,"title":"refactor(auth): store the identity provider's full avatar URL","url":"https://github.com/apache/texera/pull/7563","state":"merged","createdAt":"2026-08-11T19:28:38Z","mergedAt":"2026-08-12T04:51:22Z"},
  {"id":5094108339,"repo":"apache/texera","number":7391,"title":"fix(amber): skip statistics queries to workers of a terminating region","url":"https://github.com/apache/texera/pull/7391","state":"open","createdAt":"2026-08-07T21:29:31Z","mergedAt":null},
  {"id":5074733319,"repo":"apache/texera","number":7339,"title":"feat(frontend): consolidate login onto a dedicated /login page","url":"https://github.com/apache/texera/pull/7339","state":"merged","createdAt":"2026-08-05T20:00:31Z","mergedAt":"2026-08-10T22:01:19Z"},
  {"id":5032308054,"repo":"apache/texera","number":7173,"title":"fix(pyamber): Invalidate cache while loading executor_def.","url":"https://github.com/apache/texera/pull/7173","state":"merged","createdAt":"2026-07-31T18:24:58Z","mergedAt":"2026-07-31T18:52:44Z"},
  {"id":5013630238,"repo":"apache/texera","number":7057,"title":"refactor(auth): construct User via .tap instead of positional constructor","url":"https://github.com/apache/texera/pull/7057","state":"merged","createdAt":"2026-07-29T21:11:47Z","mergedAt":"2026-07-30T19:41:17Z"},
  {"id":5013435219,"repo":"apache/texera","number":7055,"title":"refactor(common/auth): move login credentials to auth_provider","url":"https://github.com/apache/texera/pull/7055","state":"merged","createdAt":"2026-07-29T20:39:54Z","mergedAt":"2026-08-10T22:03:28Z"},
  {"id":4953432162,"repo":"apache/texera","number":6804,"title":"chore(operators): Add proper descriptions to text source fields","url":"https://github.com/apache/texera/pull/6804","state":"merged","createdAt":"2026-07-22T21:45:37Z","mergedAt":"2026-07-27T21:56:46Z"},
  {"id":4850141587,"repo":"apache/texera","number":6297,"title":"test(frontend): cover AdminSettingService","url":"https://github.com/apache/texera/pull/6297","state":"merged","createdAt":"2026-07-09T21:48:24Z","mergedAt":"2026-07-10T01:05:23Z"},
  {"id":4849313904,"repo":"apache/texera","number":6296,"title":"test(frontend): cover ShareAccessService","url":"https://github.com/apache/texera/pull/6296","state":"merged","createdAt":"2026-07-09T19:33:15Z","mergedAt":"2026-07-09T22:07:57Z"},
  {"id":4832428614,"repo":"apache/texera","number":6238,"title":"refactor: Refactor MockTexeraDB into a JVM singleton","url":"https://github.com/apache/texera/pull/6238","state":"merged","createdAt":"2026-07-07T21:38:37Z","mergedAt":"2026-07-27T21:40:46Z"},
  {"id":4617826946,"repo":"apache/texera","number":5580,"title":"test(frontend): add unit tests for RowModalComponent","url":"https://github.com/apache/texera/pull/5580","state":"merged","createdAt":"2026-06-09T01:00:59Z","mergedAt":"2026-06-09T22:47:36Z"},
  {"id":4617649585,"repo":"apache/texera","number":5578,"title":"test: add unit tests for SortButtonComponent","url":"https://github.com/apache/texera/pull/5578","state":"merged","createdAt":"2026-06-09T00:23:18Z","mergedAt":"2026-06-09T22:13:12Z"},
] satisfies readonly PullRequest[];
