#!/usr/bin/env bash
# Deploy to GitHub Pages.
#
# The Pages site is the USER site, so it must be served from the
# Neilk1021.github.io repo. This repo (Portfolio) holds the source; that one
# holds only build output. So: build here, sync dist/ into a checkout of there,
# commit, push. Pages is on classic branch-based publishing (main, root).
#
# Notes:
#  - base stays "/" because the site is served at a domain root.
#  - Real paths, not #/routes: crawlers never see a fragment, so hash routing
#    made every shared link unfurl with the same card. scripts/prerender.ts
#    (part of `npm run build`) emits one real HTML file per URL, plus the
#    404.html that classic Pages needs to boot the SPA on anything it missed.
#  - CNAME is emitted from public/, so a deploy can never drop cnel.info.
#  - VITE_FIREBASE_* come from your local .env at build time. There is no CI
#    build, so no secrets need to live on GitHub.
set -euo pipefail

PAGES_REPO="git@github.com:Neilk1021/Neilk1021.github.io.git"
PAGES_REPO_HTTPS="https://github.com/Neilk1021/Neilk1021.github.io.git"
CHECKOUT=".deploy/pages"
KEEP=("LICENSE")

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "!! No .env - the build would ship an undefined Firebase config (blog would break)." >&2
  exit 1
fi

echo "==> Building"
npm run build

for f in dist/index.html dist/404.html dist/CNAME dist/og-default.jpg; do
  [[ -f "$f" ]] || { echo "!! $f missing after build" >&2; exit 1; }
done
echo "    CNAME -> $(cat dist/CNAME)"

# A prerender that quietly produced nothing would ship a site where every blog
# link unfurls as the home page - the exact bug this all exists to fix.
POSTS="$(find dist/blog -mindepth 2 -name index.html 2>/dev/null | wc -l | tr -d ' ')"
[[ "$POSTS" -gt 0 ]] || { echo "!! no per-post pages in dist/blog - prerender produced nothing" >&2; exit 1; }
echo "    share cards -> $POSTS blog posts prerendered"

echo "==> Syncing the Pages checkout"
mkdir -p .deploy
if [[ ! -d "$CHECKOUT/.git" ]]; then
  git clone "$PAGES_REPO" "$CHECKOUT" 2>/dev/null \
    || git clone "$PAGES_REPO_HTTPS" "$CHECKOUT"
fi
git -C "$CHECKOUT" fetch origin
git -C "$CHECKOUT" checkout main
git -C "$CHECKOUT" reset --hard origin/main

echo "==> Replacing published files"
# Clear old content so stale hashed assets don't pile up, keeping .git and
# anything in KEEP.
keep_args=()
for k in "${KEEP[@]}"; do keep_args+=(! -name "$k"); done
find "$CHECKOUT" -mindepth 1 -maxdepth 1 ! -name '.git' "${keep_args[@]}" -exec rm -rf {} +
cp -R dist/. "$CHECKOUT"/

SRC_SHA="$(git rev-parse --short HEAD)"
SRC_DIRTY=""
git diff --quiet && git diff --cached --quiet || SRC_DIRTY=" (uncommitted changes)"

echo "==> Committing"
cd "$CHECKOUT"
git add -A
if git diff --cached --quiet; then
  echo "    Nothing changed; already up to date."
  exit 0
fi
git -c user.name="$(git -C ../.. config user.name)" \
    -c user.email="$(git -C ../.. config user.email)" \
    commit -q -m "Deploy from Portfolio@${SRC_SHA}${SRC_DIRTY}"

echo "==> Pushing"
git push origin main

echo
echo "Done. Live at https://cnel.info/ (Pages may take ~1 min to rebuild)."
