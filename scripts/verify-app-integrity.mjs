import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => { throw new Error(`Application integrity check failed: ${message}`); };

const catalog = read('lib/course-catalog.ts');
const header = read('app/platform-header.tsx');
const search = read('app/course-search.tsx');
const home = read('app/my-courses.tsx');
const learningSystemHome = read('app/learning-system-home.tsx');
const focus = read('app/find-your-focus.tsx');
const pathway = read('app/my-learning-pathway.tsx');
const pathwayStorage = read('lib/learning-pathway.ts');
const companion = read('app/learning-companion.tsx');
const companionRoute = read('app/api/learning-companion/route.ts');
const layout = read('app/layout.tsx');
const pagesMain = read('pages/src/main.tsx');
const routedCompanion = read('app/route-learning-companion.tsx');

const courseIds = [...catalog.matchAll(/^\s{4}id: '([^']+)'/gm)].map((match) => match[1]);
if (courseIds.length !== 16) fail(`expected 16 catalogue courses, found ${courseIds.length}.`);
if (new Set(courseIds).size !== courseIds.length) fail('catalogue course IDs are not unique.');

const storageKeys = [...catalog.matchAll(/storageKey: '([^']+)'/g)].map((match) => match[1]);
if (new Set(storageKeys).size !== storageKeys.length) fail('course progress storage keys are not unique.');

for (const label of ['Find Your Focus', 'Saved Learning', 'Core Learning', 'Build Capacity', 'My Learning']) {
  if (!header.includes(`>${label}<`)) fail(`navigation label ${label} is missing.`);
}
if (header.includes("scrollToSection('practice')") || header.includes('>My Practice<')) {
  fail('homepage navigation still points to the temporarily hidden My Practice section.');
}

if (learningSystemHome.includes("from '@/app/my-practice'") || learningSystemHome.includes('<MyPractice')) {
  fail('My Practice is still rendered by the homepage learning-system component.');
}

const explorePosition = home.indexOf('<ExploreCourseGroup');
const capacityPosition = home.indexOf('<ProfessionalCapacityMap', explorePosition);
if (explorePosition === -1 || capacityPosition === -1 || capacityPosition < explorePosition) {
  fail('Professional Capacity must remain after Explore Learning on the homepage.');
}

if (!search.includes('terms.every') || !search.includes('aria-modal="true"')) {
  fail('course search is missing multi-term matching or modal accessibility semantics.');
}

if (!focus.includes("my-courses-focus-updated")) {
  fail('Find Your Focus does not announce updated recommendations to the learning pathway.');
}
if (pathway.includes('setInterval(')) {
  fail('learning pathway still polls browser storage instead of using focus/storage events.');
}
if (!pathway.includes('Your pathway is clear for now.')) {
  fail('learning pathway is missing the intentional-empty state.');
}
if (pathwayStorage.includes('if (courseIds.length === 0) return null')) {
  fail('an intentionally empty learning pathway would be recreated after reload.');
}

const overBroadSafeguardingPattern = '|safeguard|';
if (companion.includes(overBroadSafeguardingPattern) || companionRoute.includes(overBroadSafeguardingPattern)) {
  fail('Learning Companion live-case detection blocks generic safeguarding learning too broadly.');
}
if (!companionRoute.includes('You may discuss de-identified safeguarding principles')) {
  fail('server Companion prompt does not explicitly permit de-identified safeguarding learning.');
}

if (!routedCompanion.includes('lazy(() => import') || !routedCompanion.includes('courseIsOpen')) {
  fail('Learning Companion is not route-gated and lazy loaded.');
}
if (layout.includes("import LearningCompanion from '@/app/learning-companion'")) {
  fail('server layout imports the full Learning Companion eagerly.');
}
if (pagesMain.includes("import LearningCompanion from '../../app/learning-companion'")) {
  fail('GitHub Pages entry imports the full Learning Companion eagerly.');
}

console.log(`Verified application integrity: ${courseIds.length} courses, ${storageKeys.length} independent browser progress stores, navigation, search, pathway persistence/synchronization, Companion guardrails, homepage ordering and deferred Companion loading.`);
