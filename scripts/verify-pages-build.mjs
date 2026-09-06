import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const outputDir = path.resolve('pages-dist');
const htmlPath = path.join(outputDir, 'index.html');
const assetsDir = path.join(outputDir, 'assets');
const basePath = (process.env.PAGES_BASE_PATH || '/').replace(/\/?$/, '/');

function fail(message) {
  throw new Error(`GitHub Pages verification failed: ${message}`);
}

if (!fs.existsSync(htmlPath)) fail('pages-dist/index.html is missing.');

const html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('<title>AISG My Courses</title>')) {
  fail('the published document title is not AISG My Courses.');
}
if (!html.includes('name="robots" content="noindex, nofollow, noarchive"')) {
  fail('the public test build must remain noindex/nofollow.');
}

const assetUrls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith('/'));

for (const assetUrl of assetUrls) {
  if (basePath !== '/' && !assetUrl.startsWith(basePath)) {
    fail(`asset path ${assetUrl} does not use the Pages base path ${basePath}`);
  }
  const relativePath = assetUrl.slice(basePath === '/' ? 1 : basePath.length).split(/[?#]/)[0];
  if (relativePath && !fs.existsSync(path.join(outputDir, relativePath))) {
    fail(`referenced asset ${assetUrl} is missing from pages-dist.`);
  }
}

const cssUrl = assetUrls.find((url) => /\.css(?:[?#]|$)/.test(url));
if (!cssUrl) fail('no bundled stylesheet is referenced by index.html.');

const cssRelativePath = cssUrl.slice(basePath === '/' ? 1 : basePath.length).split(/[?#]/)[0];
const cssPath = path.join(outputDir, cssRelativePath);
const css = fs.readFileSync(cssPath, 'utf8');

for (const selector of [
  '.premium-course-card',
  '.premium-course-card .course-card-top',
  '.premium-course-card .course-designation',
  '.roadmap-desktop',
  '.mobile-nav',
  '.course-favourite-button',
  '#favourites',
  '.course-mark',
]) {
  if (!css.includes(selector)) fail(`critical stylesheet selector ${selector} is missing.`);
}

const expectedFontUrl = `${basePath}fonts/geist-latin.woff2`;
if (!css.includes(expectedFontUrl)) {
  fail(`Geist font URL ${expectedFontUrl} is not present in the bundled stylesheet.`);
}

for (const requiredFile of ['aisg-logo.png', 'favicon.svg', 'fonts/geist-latin.woff2']) {
  if (!fs.existsSync(path.join(outputDir, requiredFile))) {
    fail(`${requiredFile} is missing from the Pages artifact.`);
  }
}

const entryJsUrls = assetUrls.filter((url) => /\.js(?:[?#]|$)/.test(url));
if (entryJsUrls.length === 0) fail('no bundled JavaScript is referenced by index.html.');
if (!fs.existsSync(assetsDir)) fail('the assets directory is missing from pages-dist.');

const jsFiles = fs.readdirSync(assetsDir).filter((file) => file.endsWith('.js'));
if (jsFiles.length === 0) fail('no JavaScript chunks were emitted.');

const javascriptByFile = new Map(
  jsFiles.map((file) => [file, fs.readFileSync(path.join(assetsDir, file), 'utf8')]),
);
const javascript = [...javascriptByFile.values()].join('\n');

const courseTitles = [
  'Safeguarding at AISG',
  'Elementary Faculty Essentials',
  'Secondary Faculty Essentials',
  'Employee Communication Guidelines',
  'AI in Education',
  'Assessment for Learning at AISG',
  'Data to Action: Using Evidence to Improve Learning',
  'Designing for Learner Variability',
  'Engagement for All: The AISG Learning Framework',
  'Multi-Tiered System of Supports (MTSS)',
  'Technology for Transformative Learning',
  'Domain 1: Purposeful & Inclusive Learning Design',
  'Domain 2: Inclusive Learning Culture & Environment',
  'Domain 3: Transformative, Culturally Responsive Learning in Action',
  'Domain 4: Collaborative Planning, Reflection & Professional Impact',
];

for (const marker of ['course-mark', 'growth-domain4', ...courseTitles]) {
  if (!javascript.includes(marker)) fail(`runtime marker ${marker} is missing from the Pages bundle.`);
}

/* Lazy course runtimes are intentionally code-split. Make deployment fail if any emitted
   relative JavaScript import points to a chunk that is absent from the artifact. */
for (const [file, source] of javascriptByFile) {
  const imports = [...source.matchAll(/(?:from\s*|import\()\s*["'`](\.\/[^"'`]+\.js)["'`]/g)]
    .map((match) => match[1].replace(/^\.\//, ''));
  for (const importedFile of imports) {
    if (!javascriptByFile.has(importedFile)) {
      fail(`${file} imports missing chunk ${importedFile}.`);
    }
  }
}

/* Keep a simple production performance budget so gradual catalogue growth cannot silently
   turn the dashboard into a heavy first load. Budgets are deliberately generous and gzip-based. */
const cssGzipBytes = gzipSync(fs.readFileSync(cssPath)).length;
if (cssGzipBytes > 55 * 1024) {
  fail(`bundled CSS is ${Math.round(cssGzipBytes / 1024)} KB gzip; budget is 55 KB.`);
}

const entryJsRelativePath = entryJsUrls[0]
  .slice(basePath === '/' ? 1 : basePath.length)
  .split(/[?#]/)[0];
const entryJsGzipBytes = gzipSync(fs.readFileSync(path.join(outputDir, entryJsRelativePath))).length;
if (entryJsGzipBytes > 120 * 1024) {
  fail(`entry JavaScript is ${Math.round(entryJsGzipBytes / 1024)} KB gzip; budget is 120 KB.`);
}

for (const [file, source] of javascriptByFile) {
  const gzipBytes = gzipSync(source).length;
  if (gzipBytes > 160 * 1024) {
    fail(`${file} is ${Math.round(gzipBytes / 1024)} KB gzip; per-chunk budget is 160 KB.`);
  }
}

console.log(
  `Verified GitHub Pages artifact at ${outputDir} with base path ${basePath}; ` +
  `${courseTitles.length} courses, ${jsFiles.length} JavaScript chunks, ` +
  `${Math.round(entryJsGzipBytes / 1024)} KB entry JS gzip, ${Math.round(cssGzipBytes / 1024)} KB CSS gzip.`,
);
