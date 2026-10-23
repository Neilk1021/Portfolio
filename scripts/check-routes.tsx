/**
 * Route smoke test.  Run: npm run check:routes
 *
 * Mounts the real route table from src/routes.tsx and asserts every path
 * renders its own content rather than the 404.
 *
 * This exists because of a specific bug: project routes were registered with
 * the literal slug as the path while the component read `useParams().slug`,
 * so every project page silently rendered the 404. Rendering page components
 * directly in a test did NOT catch it - the routing layer was the broken part.
 * Anything testing pages here must go through the router.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { RouterProvider, createMemoryRouter, matchRoutes } from 'react-router-dom';
import { routes } from '../src/routes';
import { allFeatured, legacyRedirects } from '../src/content';

let failures = 0;

/** Mounts the REAL route table at `path` and returns the visible text. */
function visit(path: string): string {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const html = renderToStaticMarkup(<RouterProvider router={router} />);
  return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function check(path: string, mustContain: string, mustNotContain = 'PATH_NOT_FOUND') {
  const text = visit(path);
  const ok = text.includes(mustContain) && !text.includes(mustNotContain);
  if (!ok) failures++;
  const why = !text.includes(mustContain)
    ? `missing "${mustContain}"`
    : `unexpectedly contains "${mustNotContain}"`;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${path.padEnd(24)} ${ok ? '' : why}`);
  return text;
}

console.log('--- static routes ---');
check('/', 'Games');
check('/games', 'SMALL RELEASES');
check('/software', 'SMALLER REPOSITORIES');
check('/experience', 'EDUCATION');
check('/open_source', 'MERGED');
check('/about', 'Apache Texera');
check('/contact', 'ACADEMIC');
check('/resume', 'VIEW_RESUME.PDF');

console.log('\n--- every project route (the case that was broken) ---');
for (const p of allFeatured) check(`/${p.slug}`, p.title);

console.log('\n--- the home page must actually say who he is ---');
// It was once 51 words of menu labels and nothing else, so a visitor learned
// nothing in the time they were willing to give it.
{
  const home = visit('/');
  let broken = 0;
  for (const needle of ['whoami', 'Ketteringham', 'Apache Texera', 'Japanese Salaryman', 'ZotJam', 'UC Irvine', 'undergrad']) {
    if (!home.includes(needle)) { broken++; console.log(`FAIL  home is missing "${needle}"`); }
  }
  if (home.split(' ').length < 60) { broken++; console.log(`FAIL  home is only ${home.split(' ').length} words`); }
  failures += broken;
  if (broken === 0) console.log(`OK   home carries the identity block (${home.split(' ').length} words)`);
}

console.log('\n--- new deep-dive pages must carry real substance ---');
for (const [slug, needle] of [
  ['jsm_surveillance', 'half-edge'],
  ['jsm_days', 'SQLite'],
  ['jsm_hacking', 'procedurally generated'],
  ['jsme_scripting', 'RUN LockExit'],
] as const) {
  const text = visit(`/${slug}`);
  const ok = text.includes(needle) && text.length > 800;
  if (!ok) failures++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} /${slug.padEnd(20)} ${ok ? `${text.length} chars` : `missing "${needle}" or too thin (${text.length})`}`);
}

console.log('\n--- naming rules ---');
// Two rules, both easy to break by accident:
//   1. No title carries a description. The tagline directly beneath it does
//      that job, so "Foo - a thing that does X" duplicates it.
//   2. " - " appears only as a namespace prefix on Japanese Salaryman
//      subsystems, never as a description separator.
{
  let broken = 0;
  for (const p of allFeatured) {
    if (p.title.includes(' - ') && !p.title.startsWith('JSM - ')) {
      broken++;
      console.log(`FAIL  "${p.title}" uses " - " but is not a JSM subsystem`);
    }
    if (p.title.length > 26) {
      broken++;
      console.log(`FAIL  "${p.title}" is long enough to be smuggling a description`);
    }
  }
  failures += broken;
  if (broken === 0) console.log('OK   titles are consistent: no descriptions, " - " is a JSM prefix only');
}

console.log('\n--- legacy redirects ---');
// <Navigate> only redirects on mount, and renderToStaticMarkup runs no
// effects, so assert on the matched route config instead of rendered output.
for (const [from, to] of Object.entries(legacyRedirects)) {
  const matched = matchRoutes(routes, `/${from}`);
  const leaf = matched?.[matched.length - 1]?.route as { element?: { props?: { to?: string } } } | undefined;
  const target = leaf?.element?.props?.to;
  const routeOk = target === `/${to}`;

  // and the destination must itself render real content
  const destText = visit(`/${to}`);
  const destOk = !destText.includes('PATH_NOT_FOUND') && destText.length > 100;

  const ok = routeOk && destOk;
  if (!ok) failures++;
  console.log(
    `${ok ? 'OK  ' : 'FAIL'} /${from.padEnd(20)} -> /${to}` +
      (routeOk ? '' : `  (route points at ${target ?? 'nothing'})`) +
      (destOk ? '' : '  (destination is empty/404)'),
  );
}

console.log('\n--- 404 must still 404 ---');
const nf = visit('/no-such-page');
const nfOk = nf.includes('PATH_NOT_FOUND');
if (!nfOk) failures++;
console.log(`${nfOk ? 'OK  ' : 'FAIL'} /no-such-page           renders the 404`);

console.log(`\n${failures === 0 ? 'ALL ROUTE TESTS PASSED' : failures + ' FAILURES'}`);
process.exit(failures === 0 ? 0 : 1);
