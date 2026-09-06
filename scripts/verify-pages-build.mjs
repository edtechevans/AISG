import fs from 'node:fs';
import path from 'node:path';

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
const css = fs.readFileSync(path.join(outputDir, cssRelativePath), 'utf8');

for (const selector of ['.premium-course-card', '.roadmap-desktop', '.mobile-nav', '.course-favourite-button', '#favourites', '.course-mark']) {
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

for (const marker of ['course-mark', 'growth-domain4', 'Safeguarding at AISG']) {
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

console.log(`Verified GitHub Pages artifact at ${outputDir} with base path ${basePath}; ${jsFiles.length} JavaScript chunks checked.`);
