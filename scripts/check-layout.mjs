/**
 * Layout check.  Run: npm run check:layout   (needs `npm run dev` running)
 *
 * Drives headless Chrome over the DevTools Protocol and asserts no page
 * overflows its viewport horizontally, at phone / tablet / desktop widths.
 *
 * Why this exists rather than eyeballing screenshots: `chrome --headless
 * --window-size=390,1200 --screenshot` does NOT lay the page out at 390px. It
 * crops a wider render, so text appears sliced mid-word and you go hunting for
 * an overflow bug that isn't there. Real device metrics have to be set through
 * Emulation.setDeviceMetricsOverride, which is what this does.
 */
import { spawn } from 'node:child_process';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const PORT = 9223;
const ROUTES = ['', 'experience', 'open_source', 'games', 'software', 'about',
                'contact', 'resume', 'blog', 'japanese_salaryman',
                'dope_game_simulator', 'ultra_cult', 'vulkan_renderer'];
const WIDTHS = [390, 768, 1440];

const CHROME = process.env.CHROME_PATH
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

try {
  const res = await fetch(BASE, { signal: AbortSignal.timeout(2000) });
  if (!res.ok) throw new Error();
} catch {
  console.error(`Cannot reach ${BASE}. Start the dev server first: npm run dev`);
  process.exit(1);
}

const chrome = spawn(CHROME, [
  '--headless', '--disable-gpu', '--no-first-run',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=/tmp/cnel-layout-check`,
  'about:blank',
], { stdio: 'ignore' });

const cleanup = () => { try { chrome.kill(); } catch { /* already gone */ } };
process.on('exit', cleanup);

// Wait for the debugging endpoint to come up.
let target;
for (let i = 0; i < 40 && !target; i++) {
  await new Promise((r) => setTimeout(r, 250));
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === 'page');
  } catch { /* not listening yet */ }
}
if (!target) { console.error('Chrome never exposed a debug target.'); process.exit(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
await new Promise((r) => ws.addEventListener('open', r));
const send = (method, params = {}) => new Promise((res) => {
  const i = ++id; pending.set(i, res);
  ws.send(JSON.stringify({ id: i, method, params }));
});
await send('Page.enable');
await send('Runtime.enable');

const PROBE = `(() => {
  const docW = document.documentElement.clientWidth;
  const worst = [];
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    if (r.right > docW + 0.5) {
      worst.push((el.tagName.toLowerCase() + (el.className ? '.' + el.className : ''))
        .slice(0, 44) + ' right=' + Math.round(r.right));
    }
  }
  return JSON.stringify({ docW, bodyW: document.body.scrollWidth, worst: worst.slice(0, 5) });
})()`;

let failures = 0;
for (const route of ROUTES) {
  for (const width of WIDTHS) {
    await send('Emulation.setDeviceMetricsOverride',
      { width, height: 1000, deviceScaleFactor: 1, mobile: width < 700 });
    await send('Page.navigate', { url: `${BASE}/${route}` });
    await new Promise((r) => setTimeout(r, 900));
    const resp = await send('Runtime.evaluate', { expression: PROBE, returnByValue: true });
    const d = JSON.parse(resp.result.result.value);
    const ok = d.bodyW <= d.docW;
    if (!ok) failures++;
    const label = `/${route || ''}`.padEnd(22);
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${label} ${String(width).padStart(5)}px  body=${d.bodyW} viewport=${d.docW}`);
    if (!ok) d.worst.forEach((w) => console.log(`       overflowing: ${w}`));
  }
}

ws.close();
console.log(`\n${failures === 0 ? 'NO HORIZONTAL OVERFLOW ANYWHERE' : failures + ' FAILURES'}`);
process.exit(failures === 0 ? 0 : 1);
