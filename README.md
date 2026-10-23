# cnel.info

Personal site for Neil Ketteringham. Games, graphics and systems work.
React 19 + TypeScript + Vite, with a Firestore-backed blog.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build && prerender (needs .env)
npm run lint
npm run check:routes   # mounts the real route table, asserts no page 404s
npm run check:layout   # headless Chrome, asserts no horizontal overflow (needs dev running)
npm run prerender      # re-writes the share cards over an existing dist/
```

Do not use `npm run preview` to check share cards. Its dev server has its own
SPA fallback and answers every path with the root `index.html`, so every page
looks like it has the home page's tags even when `dist/` is correct. Serve the
folder statically instead - `cd dist && python3 -m http.server` behaves the way
Pages does.

`check:layout` sets real device metrics over the DevTools Protocol. Note that
`chrome --headless --window-size=390,1200 --screenshot` does *not* lay a page
out at 390px; it crops a wider render, so text looks sliced mid-word and you go
hunting for an overflow bug that isn't there.

## Environment

The blog needs a `.env` (gitignored) with the Firebase web config:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

These are not secrets. Google publishes the web config as public identifying
data and it ships in the bundle either way. What actually authorizes reads and
writes is `firestore.rules`.

## Deploying

```bash
npm run deploy
```

The live site is **https://cnel.info/**, served by GitHub Pages from the
*separate* `Neilk1021.github.io` repo (user sites must come from that repo).
This repo holds the source; that one holds only build output. `npm run deploy`
builds here and pushes `dist/` there.

Things that are the way they are on purpose:

- **`base` stays `/`**, because the site is served at a domain root, not a subpath.
- **Real paths, not `#/` routes** - see "Share cards" below for why. Classic
  Pages has no SPA rewrite, so the build emits a real file per URL plus a
  `404.html` for anything it missed, and `main.tsx` rewrites an incoming
  `/#/blog/x` to `/blog/x` so links shared under the old scheme still land.
- **`public/CNAME`** is what keeps `cnel.info` pointed here. It used to exist
  only in the Pages repo, where any deploy that replaced the published files
  would silently delete it and drop the custom domain. Emitting it from the
  build makes that impossible.
- **No CI build**, so no `VITE_FIREBASE_*` secrets on GitHub. The deploy uses
  your local `.env`. The script refuses to run without one, because a build with
  an undefined Firebase config looks fine and breaks the blog.

## Where things live

| | |
|---|---|
| `src/content/` | All page content as typed data. Projects, games, roles, skills. |
| `src/Pages/ProjectTemplate.tsx` | The one project page, rendered from a `FeaturedProject`. |
| `src/lib/github.ts` | Live PR feed (unauthenticated GitHub search). |
| `src/data/prSnapshot.ts` | Static fallback for that feed. |
| `firestore.rules` | The real authorization for the blog. |
| `scripts/prerender.ts` | Writes one HTML file per URL, each with its own share card. |
| `src/lib/excerpt.ts` | Post markdown to one line of prose. Shared by the index and the prerender. |
| `public/og-default.jpg` | Fallback card, 1200x630. Swap the file to change it. |
| `src/routes.tsx` | The route table, exported so `check:routes` can mount the real thing. |
| `src/index.css` | Design tokens. Breakpoints are literals: 900px and 560px. |

### Adding a project

Add a `FeaturedProject` to `src/content/games.ts` or `software.ts`. The route,
the home menu entry and the index page listing are all derived from it, so there
is no route table to update. If you rename a `slug` that has been shared
publicly, add the old one to `legacyRedirects` in `src/content/index.ts`.

### Refreshing the open-source feed snapshot

```bash
node scripts/refresh-pr-snapshot.mjs
```

The feed fetches live, caches in `localStorage` for 6 hours, and falls back to
this snapshot when the request fails or the rate limit is hit. Deliberately
unauthenticated: a token in a `VITE_*` variable would be published in the bundle
on every deploy and revoked by GitHub's secret scanning. Raising the limit
properly needs a server-side proxy.

### Blog admin

`/blog/admin`, gated by Firebase Auth. A post has two required fields, `TITLE`
and `CONTENT` (markdown), and two optional ones, `DESCRIPTION` and
`SHARE_IMAGE_URL`, both documented under "Share cards". Leaving an optional
field blank removes the key from the document rather than storing an empty
string, because the rules require a non-empty value whenever the key is there.

Before any of it works:

1. Enable the Email/Password provider and create your user.
2. Put your uid into `firestore.rules` (replace `REPLACE_WITH_YOUR_UID`).
3. `firebase deploy --only firestore:rules --account neilfuntube@gmail.com`
4. Turn off self-signup in the console. With the provider enabled anyone can
   register, which is why the rules key on a specific uid rather than
   `request.auth != null`.

The `--account` flag in step 3 is not optional. The `cnel-portfolio` Firebase
project belongs to **neilfuntube@gmail.com**, while the CLI's default login is
neilaketteringham@gmail.com, which cannot see the project at all. Without the
flag the deploy fails at the rules compile step with a bare
`HTTP Error: 403, The caller does not have permission`, which reads like a
broken rules file rather than the wrong identity. `firebase projects:list`
shows which projects the active account can actually reach.

## One-off scripts

`scripts/extract-pdf-images.mjs` pulled the game screenshots out of the saved
itch.io page PDFs in `for_claude/`. Kept for reference; not part of the build.

## Share cards

Discord, Slack, X, Facebook, LinkedIn and iMessage do not run JavaScript. They
make one plain request and read whatever HTML comes back. An SPA answers every
path with the same `index.html`, so before this existed every link shared from
the site unfurled with the same title and the same picture - and on a hash
router it could not have worked at all, because the `#/blog/<id>` part never
reaches the server.

So `scripts/prerender.ts` runs at the end of `npm run build` and writes
`dist/<path>/index.html` for every URL - static pages, every project, the legacy
redirects, and one per blog post - swapping the `@head` block from `index.html`
for that page's own `<title>`, description, canonical and Open Graph tags. Only
`<head>` differs between those files; the app bundle is identical, so a browser
boots the same SPA it always did.

`index.html` must keep its `<!-- @head:start -->` / `<!-- @head:end -->`
markers. The build fails loudly if they go missing rather than shipping a site
where every link unfurls as the home page.

**Writing a post's description.** `/blog/admin` has a `DESCRIPTION` field. One
or two sentences, and it is used in exactly two places: the preview card on
`/blog`, and the `og:description` in an unfurl when the link is shared. It is
not rendered on the post itself. The field is optional; when it is blank both
places fall back to the opening of the body with the markdown syntax stripped.
Write one anyway, because the fallback always reads like a truncated first
paragraph, which is what it is. The form counts toward 200 characters and turns
red past it; the hard stop in `firestore.rules` is 600.

Both consumers call `excerpt()` from `src/lib/excerpt.ts`, so the `/blog`
preview and the share card can never disagree. Before that helper existed the
index stripped only images, so a post whose body opened with `## Foreword`
displayed the literal hashes on its card.

**Setting a post's image.** `/blog/admin` has a `SHARE_IMAGE_URL` field. It is
used *only* for the card - it is never rendered in the post body. Give it an
absolute `https://` URL or a site-relative `/path`; `firestore.rules` rejects
anything else, since the value is copied verbatim into everyone's HTML. Aim for
**1200x630**. When it is empty the prerender falls back to the first inline
markdown image in the post, then to `public/og-default.jpg`. Project pages use
their first gallery image automatically.

**The one real limitation:** posts are read at *build* time. A post published
from the admin page is live immediately, but will not unfurl with its own card
until the next `npm run deploy`. Fixing that means moving off Pages onto a host
that can render per request.

**Refreshing a cached unfurl.** Nothing regenerates on a schedule: the tags are
static files written at deploy time. What goes stale is the cache held by the
app the link was pasted into. `curl -s https://cnel.info/blog/<id>/ | grep og:`
is the ground truth; if that looks right, the site is right.

Facebook and Messenger re-scrape on demand through the
[Sharing Debugger](https://developers.facebook.com/tools/debug/), and LinkedIn
through the [Post Inspector](https://www.linkedin.com/post-inspector/). X,
Discord, Slack and iMessage have no purge tool at all (X's card validator was
retired in 2022), and there the cache key is the whole URL, so appending `?v=2`
is the only reliable way to force a fresh look.

One trap worth knowing: images are cached by URL too. Replacing
`public/og-default.jpg` in place, keeping the filename, leaves every platform
that already fetched it free to keep serving the old bytes even after it
re-reads the page. Give a genuinely new default card a new filename.
