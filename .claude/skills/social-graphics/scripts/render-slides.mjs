#!/usr/bin/env node
// Render design-canvas slide files (.dc.html) to a multi-page PDF and optional PNGs
// using headless Chrome. Reads canvas.json for slide order and dimensions, strips the
// canvas-runtime wrapper, and inlines sibling images as data URIs so the page is
// self-contained (Google Fonts still load from the network).
//
// Usage:
//   node render-slides.mjs --dir <slides-dir> --pdf <out.pdf> [--png-dir <dir>]

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve, extname, basename } from 'node:path';
import { tmpdir } from 'node:os';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const dir = arg('dir');
const pdfOut = arg('pdf');
const pngDir = arg('png-dir');
if (!dir || !pdfOut) {
  console.error('Usage: render-slides.mjs --dir <slides-dir> --pdf <out.pdf> [--png-dir <dir>]');
  process.exit(1);
}

const slidesDir = resolve(dir);

// --- Chrome discovery ---------------------------------------------------------
const candidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error('No Chrome/Chromium found. Set CHROME_PATH to a browser binary.');
  process.exit(1);
}

// --- Slide order and size -----------------------------------------------------
let boards;
const canvasPath = join(slidesDir, 'canvas.json');
if (existsSync(canvasPath)) {
  const canvas = JSON.parse(readFileSync(canvasPath, 'utf8'));
  boards = canvas.artboards.map((a) => ({ file: a.file, w: a.w ?? 1080, h: a.h ?? 1350 }));
} else {
  boards = readdirSync(slidesDir)
    .filter((f) => f.endsWith('.dc.html'))
    .sort()
    .map((f) => ({ file: f, w: 1080, h: 1350 }));
}
if (boards.length === 0) {
  console.error(`No .dc.html slides found in ${slidesDir}`);
  process.exit(1);
}

// --- Image inlining -----------------------------------------------------------
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const images = {};
for (const f of readdirSync(slidesDir)) {
  const ext = extname(f).toLowerCase();
  if (mime[ext]) images[f] = `data:${mime[ext]};base64,${readFileSync(join(slidesDir, f)).toString('base64')}`;
}
function inline(html) {
  for (const [name, uri] of Object.entries(images)) {
    html = html.split(`"${name}"`).join(`"${uri}"`).split(`"./${name}"`).join(`"${uri}"`);
  }
  return html;
}

// --- Strip the canvas-runtime wrapper down to a plain slide -------------------
function parseSlide(path) {
  const src = readFileSync(path, 'utf8');
  const dc = src.match(/<x-dc>([\s\S]*?)<\/x-dc>/);
  let body = dc ? dc[1] : src;
  let head = '';
  const helmet = body.match(/<helmet>([\s\S]*?)<\/helmet>/);
  if (helmet) {
    head = helmet[1];
    body = body.replace(helmet[0], '');
  }
  // Slide bodies set body{margin:0}etc. in helmet styles; keep those, drop scripts.
  head = head.replace(/<script[\s\S]*?<\/script>/g, '');
  return { head: inline(head), body: inline(body) };
}

const slides = boards.map((b) => ({ ...b, ...parseSlide(join(slidesDir, b.file)) }));
const { w: pageW, h: pageH } = slides[0];

// --- Compose one paged document ----------------------------------------------
const heads = [...new Set(slides.map((s) => s.head.trim()))].join('\n');
const doc = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
${heads}
<style>
  @page { size: ${pageW}px ${pageH}px; margin: 0; }
  html, body { margin: 0; padding: 0; }
  .slide-page { width: ${pageW}px; height: ${pageH}px; overflow: hidden; page-break-after: always; }
  .slide-page:last-child { page-break-after: auto; }
</style>
</head>
<body>
${slides.map((s) => `<div class="slide-page">\n${s.body}\n</div>`).join('\n')}
</body>
</html>`;

const work = join(tmpdir(), `render-slides-${Date.now()}`);
mkdirSync(work, { recursive: true });
const docPath = join(work, 'deck.html');
writeFileSync(docPath, doc);

const common = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=20000', '--run-all-compositor-stages-before-draw'];

// --- PDF ----------------------------------------------------------------------
execFileSync(chrome, [...common, '--no-pdf-header-footer', `--print-to-pdf=${resolve(pdfOut)}`, `file://${docPath}`], { stdio: 'pipe' });
console.log(`pdf: ${resolve(pdfOut)} (${slides.length} pages, ${pageW}x${pageH})`);

// --- PNGs (one per slide) -----------------------------------------------------
if (pngDir) {
  mkdirSync(resolve(pngDir), { recursive: true });
  slides.forEach((s, i) => {
    const single = doc.replace(/<body>[\s\S]*<\/body>/, `<body><div class="slide-page">\n${s.body}\n</div></body>`);
    const p = join(work, `slide-${i}.html`);
    writeFileSync(p, single);
    const out = join(resolve(pngDir), `${String(i + 1).padStart(2, '0')}-${basename(s.file, '.dc.html')}.png`);
    execFileSync(chrome, [...common, `--window-size=${s.w},${s.h}`, `--screenshot=${out}`, `file://${p}`], { stdio: 'pipe' });
    console.log(`png: ${out}`);
  });
}
