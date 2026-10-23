/**
 * Per-URL share cards.  Runs automatically as part of `npm run build`.
 *
 * WHY THIS EXISTS
 * Discord, Slack, X, Facebook, LinkedIn and iMessage do not execute JavaScript.
 * They issue one plain GET and read the HTML that comes back. A single-page app
 * answers every path with the same index.html, so every link shared from the
 * site unfurled with the same title and the same picture - React 19's hoisted
 * <title> fixes the browser tab, never the unfurl.
 *
 * So each shareable URL needs its own file on disk. This walks the real route
 * table, reads the blog out of Firestore, and writes dist/<path>/index.html for
 * every one of them, swapping the @head block from index.html for that page's
 * own tags. The app bundle is untouched: a browser still boots the same SPA,
 * because the only thing that differs between these files is <head>.
 *
 * CONSEQUENCE WORTH KNOWING: posts are read at BUILD time. A post published
 * from /blog/admin is live immediately but will not unfurl with its own card
 * until the next `npm run deploy`. That is the cost of a static host; the
 * alternative was moving off GitHub Pages onto a server that can render per
 * request.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { allFeatured, legacyRedirects } from '../src/content';
import { clamp, excerpt } from '../src/lib/excerpt';

const SITE = 'https://cnel.info';
const DIST = 'dist';

/** Fallback card for anything with no image of its own. Lives in public/. */
const DEFAULT_IMAGE = {
  url: '/og-default.jpg',
  width: 1200,
  height: 630,
  alt: 'A night rooftop scene from Japanese Salaryman',
};

interface ShareImage {
  url: string;
  width?: number;
  height?: number;
  alt: string;
}

interface Page {
  /** Path with no leading slash. '' is the site root. */
  path: string;
  /** Where canonical and og:url should point, when that is not `path` itself -
   *  a legacy redirect stub should credit the page it forwards to. */
  canonicalPath?: string;
  /** Browser tab / <title>. */
  docTitle: string;
  /** og:title - no " // cnel.info" suffix, the card already shows the domain. */
  shareTitle: string;
  description: string;
  image: ShareImage;
  type: 'website' | 'article';
  /** ISO 8601, articles only. */
  published?: string;
  /** Keeps admin and legacy redirect stubs out of search results. */
  noindex?: boolean;
}

// --- text helpers -----------------------------------------------------------

const esc = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// --- asset resolution -------------------------------------------------------

/**
 * Vite renames assets to `<name>-<hash>.<ext>`, but the content records import
 * them by source path, and under vite-node an import resolves to the unhashed
 * dev URL. Map basename -> built file so a project's gallery image can be used
 * as its card. Basenames are unique inside src/assets, which is what makes this
 * safe.
 */
function buildAssetIndex(): Map<string, string> {
  const dir = join(DIST, 'assets');
  const index = new Map<string, string>();
  if (!existsSync(dir)) return index;
  for (const file of readdirSync(dir)) {
    const match = /^(.*)-[A-Za-z0-9_-]{8}\.(\w+)$/.exec(file);
    if (match) index.set(`${match[1]}.${match[2]}`, `/assets/${file}`);
  }
  return index;
}

const assets = buildAssetIndex();

/** Resolves a content-record image reference to a path served by the site. */
function resolveAsset(src: string): string | null {
  if (/^https?:\/\//.test(src)) return src;
  const basename = src.split('/').pop();
  return (basename && assets.get(basename)) ?? null;
}

/** og:image must be absolute - a relative URL is dropped by most crawlers. */
const absolute = (url: string) => (/^https?:\/\//.test(url) ? url : `${SITE}${url}`);

const mimeFor = (url: string) => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  return 'image/jpeg';
};

// --- head rendering ---------------------------------------------------------

function renderHead(page: Page): string {
  const url = `${SITE}/${page.canonicalPath ?? page.path}`;
  const image = absolute(page.image.url);
  const tags: string[] = [
    `<title>${esc(page.docTitle)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
  ];

  if (page.noindex) tags.push('<meta name="robots" content="noindex" />');

  tags.push(
    `<meta property="og:type" content="${page.type}" />`,
    '<meta property="og:site_name" content="cnel.info" />',
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(page.shareTitle)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:type" content="${mimeFor(image)}" />`,
  );

  // Only when known. Facebook and LinkedIn will render the card before they
  // have fetched the image if these are present, so a wrong pair is worse
  // than an absent one.
  if (page.image.width) tags.push(`<meta property="og:image:width" content="${page.image.width}" />`);
  if (page.image.height) tags.push(`<meta property="og:image:height" content="${page.image.height}" />`);

  tags.push(
    `<meta property="og:image:alt" content="${esc(page.image.alt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(page.shareTitle)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(page.image.alt)}" />`,
  );

  if (page.published) {
    tags.push(`<meta property="article:published_time" content="${esc(page.published)}" />`);
  }

  return tags.map((tag) => `    ${tag}`).join('\n');
}

// --- the pages ---------------------------------------------------------------

const HOME_DESCRIPTION =
  'Games, graphics and systems programming. Apache Texera researcher, lead programmer at Antikat Studios.';

const staticPages: Page[] = ([
  { path: '', docTitle: 'Neil Ketteringham // cnel.info', shareTitle: 'Neil Ketteringham', description: HOME_DESCRIPTION },
  { path: 'games', docTitle: 'Games // cnel.info', shareTitle: 'Games', description: 'Shipped games and jam releases - Japanese Salaryman, Ultra Cult, Dope Game Simulator and more.' },
  { path: 'software', docTitle: 'Software // cnel.info', shareTitle: 'Systems & Software', description: 'Engine and systems work: a Vulkan renderer, an N-body simulation, procedural generation and the systems behind Japanese Salaryman.' },
  { path: 'experience', docTitle: 'Experience // cnel.info', shareTitle: 'Experience & Skills', description: 'Roles, education and the languages, engines and tools behind them.' },
  { path: 'open_source', docTitle: 'Open Source // cnel.info', shareTitle: 'Open Source', description: 'Merged contributions to Apache Texera and other public repositories.' },
  { path: 'about', docTitle: 'About // cnel.info', shareTitle: 'About', description: 'CS undergrad at UC Irvine, undergraduate researcher on Apache Texera, lead programmer at Antikat Studios.' },
  { path: 'contact', docTitle: 'Contact // cnel.info', shareTitle: 'Contact', description: 'Email, GitHub, LinkedIn and itch.io.' },
  { path: 'resume', docTitle: 'Resume // cnel.info', shareTitle: 'Resume', description: "Neil Ketteringham's resume." },
  { path: 'blog', docTitle: 'Blog // cnel.info', shareTitle: 'Blog', description: 'Notes on games, engine work and the things that broke on the way.' },
]).map((page) => ({ ...page, image: DEFAULT_IMAGE, type: 'website' as const }));

/** Each project's first gallery image is already a picked hero shot. */
const projectPages: Page[] = allFeatured.map((project) => {
  const hero = project.gallery?.[0];
  const resolved = hero ? resolveAsset(hero.src) : null;

  return {
    path: project.slug,
    docTitle: `${project.title} // cnel.info`,
    shareTitle: project.title,
    description: clamp(project.tagline),
    image: resolved
      ? { url: resolved, width: hero!.width, height: hero!.height, alt: hero!.alt }
      : DEFAULT_IMAGE,
    type: 'website',
  };
});

/**
 * A legacy URL is a client-side <Navigate>, so a crawler only ever sees the
 * stub. Give it the destination's card - otherwise every link shared before the
 * renames unfurls as nothing.
 */
const redirectPages: Page[] = Object.entries(legacyRedirects).map(([from, to]) => {
  const target =
    projectPages.find((p) => p.path === to) ?? staticPages.find((p) => p.path === to);
  if (!target) throw new Error(`legacyRedirects: "${from}" points at unknown route "${to}"`);
  return { ...target, path: from, canonicalPath: to, noindex: true };
});

const adminPage: Page = {
  path: 'blog/admin',
  docTitle: 'Admin // cnel.info',
  shareTitle: 'Admin',
  description: 'Blog admin.',
  image: DEFAULT_IMAGE,
  type: 'website',
  noindex: true,
};

// --- the blog ---------------------------------------------------------------

interface PostDoc {
  title?: string;
  content?: string;
  description?: string;
  image?: string;
  date?: Timestamp;
}

function firestoreConfig() {
  if (!existsSync('.env')) {
    throw new Error('No .env - the Firebase config would be undefined and no post pages could be written.');
  }
  process.loadEnvFile('.env');
  const config = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };
  const missing = Object.entries(config).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) throw new Error(`.env is missing: ${missing.join(', ')}`);
  return config as Record<keyof typeof config, string>;
}

/** First inline markdown image in the body, used when no image is set. */
function firstBodyImage(content: string): string | null {
  const match = /!\[[^\]]*\]\(\s*(\S+?)\s*(?:"[^"]*")?\s*\)/.exec(content);
  const url = match?.[1];
  if (!url || url.startsWith('data:')) return null;
  return url;
}

async function blogPages(): Promise<Page[]> {
  const db = getFirestore(initializeApp(firestoreConfig()));
  const snapshot = await getDocs(query(collection(db, 'posts'), orderBy('date', 'desc')));

  return snapshot.docs.map((doc) => {
    const post = doc.data() as PostDoc;
    const title = post.title?.trim() || 'Untitled';
    const body = post.content ?? '';

    // Explicit field wins, then whatever the post already shows, then the
    // site default. Ordered so a post is never card-less.
    const chosen = post.image?.trim() || firstBodyImage(body);
    const image: ShareImage = chosen
      ? { url: absolute(chosen), alt: title }
      : DEFAULT_IMAGE;

    return {
      path: `blog/${doc.id}`,
      docTitle: `${title} // cnel.info`,
      shareTitle: title,
      // Same helper the blog index uses, so the card and the /blog preview
      // always read identically.
      description: excerpt(post.description, body) || 'A post on cnel.info.',
      image,
      type: 'article' as const,
      published: post.date?.toDate?.().toISOString(),
    };
  });
}

// --- writing ----------------------------------------------------------------

const START = '<!-- @head:start -->';
const END = '<!-- @head:end -->';

function loadTemplate(): (head: string) => string {
  const html = readFileSync(join(DIST, 'index.html'), 'utf8');
  const from = html.indexOf(START);
  const to = html.indexOf(END);
  if (from === -1 || to === -1) {
    throw new Error(
      `dist/index.html has no ${START} / ${END} block. Either index.html lost the ` +
        'markers or the build stripped its comments; per-URL share cards cannot be written.',
    );
  }
  const before = html.slice(0, from);
  const after = html.slice(to + END.length);
  return (head) => `${before}${START}\n${head}\n    ${END}${after}`;
}

function write(path: string, html: string) {
  // '' -> dist/index.html, 'games' -> dist/games/index.html. GitHub Pages
  // serves dir/index.html for a request to /dir, so these are real 200s.
  const file = path === '' ? join(DIST, 'index.html') : join(DIST, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const render = loadTemplate();

const posts = await blogPages();
const pages = [...staticPages, ...projectPages, ...redirectPages, adminPage, ...posts];

const seen = new Set<string>();
for (const page of pages) {
  if (seen.has(page.path)) throw new Error(`Two pages both claim /${page.path}`);
  seen.add(page.path);
  write(page.path, render(renderHead(page)));
}

// Unknown paths. GitHub Pages has no rewrite rule, so this is what makes a
// deep link the SPA knows about but this script does not still boot the app
// instead of showing Pages' own 404.
writeFileSync(join(DIST, '404.html'), render(renderHead(staticPages[0])));

const withOwnImage = posts.filter((p) => p.image !== DEFAULT_IMAGE).length;
console.log(
  `prerender: ${pages.length} pages + 404.html ` +
    `(${posts.length} posts, ${withOwnImage} with their own image)`,
);
for (const post of posts) console.log(`  /${post.path}  ${post.shareTitle}`);
