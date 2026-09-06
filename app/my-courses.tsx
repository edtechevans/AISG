'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Compass, GraduationCap, History, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import TrainingApp from '@/app/training-app';
import AiTrainingApp from '@/app/ai-training-app';
import PlatformHeader from '@/app/platform-header';
import CourseMark from '@/app/course-mark';
import { COURSE_BY_ID, COURSE_CATALOG, isCourseId, type CourseCatalogItem, type CourseId } from '@/lib/course-catalog';
import { installStaticApi } from '@/pages/src/static-api';

export { COURSE_CATALOG } from '@/lib/course-catalog';

const FAVOURITES_STORAGE_KEY = 'my-courses-favourites-v1';

type CourseStatus = 'Completed' | 'In Progress' | 'Not Started';
type CourseState = {
  status?: string;
  responses?: unknown[] | Record<string, unknown>;
  completedSections?: unknown[];
  completedAt?: number;
  updatedAt?: number;
  learnPage?: number;
  learningStage?: 'learn' | 'question';
  progress?: { completed?: number; percentage?: number } | null;
  attempt?: { completedAt?: number | null };
};

type DisplayCourse = CourseCatalogItem & { status: CourseStatus; progress: number };

function readCourseState(course: CourseCatalogItem): CourseState {
  if (!course.storageKey || typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(course.storageKey) || '{}') as CourseState;
  } catch {
    return {};
  }
}

function readFavourites(): CourseId[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVOURITES_STORAGE_KEY) || '[]') as unknown;
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((value): value is CourseId => typeof value === 'string' && isCourseId(value)))];
  } catch {
    return [];
  }
}

function writeFavourites(favourites: CourseId[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
  } catch {
    // Favourites still work for the current session if browser storage is unavailable.
  }
}

function responseCount(state: CourseState) {
  if (Array.isArray(state.responses)) return state.responses.length;
  return Object.keys(state.responses || {}).length;
}

function correctResponseCount(state: CourseState) {
  if (!state.responses || Array.isArray(state.responses)) return undefined;
  return Object.values(state.responses).filter((response) => Boolean(response && typeof response === 'object' && 'correct' in response && response.correct)).length;
}

function completionDate(state: CourseState) {
  const timestamp = state.completedAt || state.attempt?.completedAt;
  return timestamp ? new Date(timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : undefined;
}

function statusFor(state: CourseState): CourseStatus {
  if (state.status === 'PASSED' || state.attempt?.completedAt || state.completedAt) return 'Completed';
  if (responseCount(state) > 0 || (state.progress?.completed || 0) > 0 || (state.completedSections?.length || 0) > 0 || Boolean(state.learningStage) || (state.learnPage || 0) > 0) return 'In Progress';
  return 'Not Started';
}

function progressFor(course: CourseCatalogItem, state: CourseState) {
  if (course.id === 'safeguarding') return Math.min(100, Math.max(0, Math.round(state.progress?.percentage || 0)));
  const completedSteps = responseCount(state) + (state.completedSections?.length || 0);
  return Math.min(100, Math.round(completedSteps / (course.checkCount + course.sectionCount) * 100));
}

function shortCourseStates(): Record<CourseId, CourseState> {
  return Object.fromEntries(COURSE_CATALOG.map((course) => [course.id, readCourseState(course)])) as Record<CourseId, CourseState>;
}

export default function MyCoursesApp({ staticMode = false }: { staticMode?: boolean }) {
  const [route, setRoute] = useState('');
  const [states, setStates] = useState<Record<CourseId, CourseState>>(() => Object.fromEntries(COURSE_CATALOG.map((course) => [course.id, {}])) as Record<CourseId, CourseState>);
  const [browserMode, setBrowserMode] = useState(staticMode);
  const [favourites, setFavourites] = useState<CourseId[]>([]);

  useEffect(() => {
    const title = isCourseId(route) ? `${COURSE_BY_ID[route].title} | AISG My Courses` : 'AISG My Courses';
    document.title = title;
  }, [route]);

  useEffect(() => {
    const syncBrowserState = () => {
      setRoute(new URLSearchParams(window.location.search).get('course') || '');
      setStates((current) => ({ ...current, ...shortCourseStates() }));
      setFavourites(readFavourites());
    };
    syncBrowserState();
    const onPop = () => syncBrowserState();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    if (route !== '') return;
    fetch('/api/bootstrap', { cache: 'no-store' })
      .then(async (response) => {
        if (response.status === 401) {
          installStaticApi();
          setBrowserMode(true);
          return fetch('/api/bootstrap', { cache: 'no-store' }).then((retry) => retry.json());
        }
        return response.ok ? response.json() : null;
      })
      .then((data) => { if (data) setStates((current) => ({ ...current, safeguarding: data as CourseState })); })
      .catch(() => undefined);
  }, [route]);

  useEffect(() => {
    const refresh = () => {
      setStates((current) => ({ ...current, ...shortCourseStates(), safeguarding: current.safeguarding }));
      setFavourites(readFavourites());
    };
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  function open(course: CourseId) {
    const url = new URL(window.location.href);
    url.searchParams.set('course', course);
    window.history.pushState({}, '', url);
    setRoute(course);
  }

  function home() {
    const url = new URL(window.location.href);
    url.searchParams.delete('course');
    window.history.pushState({}, '', url);
    setRoute('');
    setStates((current) => ({ ...current, ...shortCourseStates(), safeguarding: current.safeguarding }));
    setFavourites(readFavourites());
  }

  function toggleFavourite(course: CourseId) {
    setFavourites((current) => {
      const next = current.includes(course)
        ? current.filter((id) => id !== course)
        : [...current, course];
      writeFavourites(next);
      return next;
    });
  }

  const courses: DisplayCourse[] = COURSE_CATALOG.map((course) => ({
    ...course,
    status: statusFor(states[course.id]),
    progress: progressFor(course, states[course.id]),
  }));

  if (route === 'safeguarding') return <TrainingApp staticMode={browserMode} />;
  if (isCourseId(route) && route !== 'safeguarding') {
    return <><PlatformHeader onPlatformHome={home} activeCourse={route} onCourse={open} onCourses={home} /><AiTrainingApp key={route} onExit={home} course={route} /></>;
  }

  const inProgress = courses
    .filter((course) => course.status === 'In Progress')
    .sort((a, b) => (states[b.id].updatedAt || 0) - (states[a.id].updatedAt || 0))[0];
  const completed = courses.filter((course) => course.status === 'Completed').length;
  const required = courses.filter((course) => course.designation === 'Required');
  const requiredCompleted = required.filter((course) => course.status === 'Completed').length;
  const hasActivity = courses.some((course) => course.status !== 'Not Started');
  const favouriteCourses = courses.filter((course) => favourites.includes(course.id));
  const explore = courses.filter((course) => course.designation !== 'Required');
  const teacherGrowthExplore = explore.filter((course) => course.category === 'Teacher Growth & Reflection').sort((a, b) => a.title.localeCompare(b.title));
  const otherExplore = explore.filter((course) => course.category !== 'Teacher Growth & Reflection').sort((a, b) => a.title.localeCompare(b.title));

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return <>
    <PlatformHeader onPlatformHome={home} onCourse={open} onCourses={() => scrollTo('courses')} onProgress={() => scrollTo('record')} />
    <main id="main-content" className="my-courses-shell premium-learning-home">
      <section className="my-courses-hero premium-hero">
        <div>
          <p className="eyebrow"><GraduationCap aria-hidden="true" /> AISG My Courses</p>
          <h1>{hasActivity ? 'Welcome back.' : 'Welcome to My Courses.'}</h1>
          <p>Your professional learning, in one place. Build shared understanding, apply it to authentic AISG decisions, and return when your practice is ready for the next step.</p>
        </div>
        <p className="learning-rhythm" aria-label="Learning rhythm">Learn <span>→</span> Check <span>→</span> Apply <span>→</span> Reflect</p>
      </section>

      {inProgress && <section className="continue-card continue-feature" aria-labelledby="continue-title">
        <div className="continue-copy">
          <div className="continue-course-identity"><CourseMark course={inProgress.id} size="card" tone="inverse" /><div><p className="tiny-eyebrow">Continue learning</p><h2 id="continue-title">{inProgress.title}</h2><p>{inProgress.progress}% complete · Resume exactly where you left off.</p></div></div>
          <Progress value={inProgress.progress} aria-label={`${inProgress.title}: ${inProgress.progress}% complete`} />
        </div>
        <Button className="primary-pill" size="lg" onClick={() => open(inProgress.id)}>Continue learning <ArrowRight aria-hidden="true" /></Button>
      </section>}

      <section id="progress" className="progress-summary learning-summary" aria-labelledby="progress-title">
        <div className="progress-summary-heading">
          <div><p className="tiny-eyebrow">Your learning</p><h2 id="progress-title">A clear view of what matters next</h2></div>
          <Button variant="outline" onClick={() => scrollTo('record')}><History aria-hidden="true" /> My learning record</Button>
        </div>
        <div className="progress-stats" aria-live="polite">
          <Stat label="Required learning" value={`${requiredCompleted}/${required.length}`} />
          <Stat label="In progress" value={String(courses.filter((course) => course.status === 'In Progress').length)} />
          <Stat label="Completed this year" value={String(completed)} />
        </div>
      </section>

      {favouriteCourses.length > 0 && <CourseGroup
        title="Your Favourites"
        eyebrow="Saved learning"
        description="Courses you’ve saved for easy access."
        courses={favouriteCourses}
        onOpen={open}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />}

      <CourseGroup
        title="Required learning"
        eyebrow="Core learning"
        description="The shared knowledge and expectations that underpin safe, consistent and effective practice at AISG."
        courses={required}
        onOpen={open}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />

      <ExploreCourseGroup
        teacherGrowthCourses={teacherGrowthExplore}
        otherCourses={otherExplore}
        onOpen={open}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />

      <section id="record" className="record-card capability-record" aria-labelledby="record-title">
        <div className="record-heading">
          <div><p className="tiny-eyebrow">My learning record</p><h2 id="record-title">The capacity you are building</h2><p>Completed learning is more than a score. This record highlights the professional capabilities each course develops.</p></div>
          <Compass aria-hidden="true" />
        </div>
        {courses.filter((course) => course.status === 'Completed').map((course) => {
          const score = correctResponseCount(states[course.id]);
          const date = completionDate(states[course.id]);
          return <article className="record-row capability-row" key={course.id}>
            <div className="capability-row-main"><CourseMark course={course.id} size="record" /><div><strong>{course.title}</strong><span>{date ? `${date} · ` : ''}{score === undefined ? '' : `${score}/${course.checkCount} · `}SY2026–27 · Completed</span></div></div>
            <ul aria-label={`${course.title} capabilities`}>{course.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul>
          </article>;
        })}
        {completed === 0 && <p className="record-empty">Complete a course and the capabilities you have developed will appear here.</p>}
      </section>
    </main>
  </>;
}

function CourseGroup({ title, eyebrow, description, courses, onOpen, favourites, onToggleFavourite }: { title: string; eyebrow: string; description: string; courses: DisplayCourse[]; onOpen: (id: CourseId) => void; favourites: CourseId[]; onToggleFavourite: (id: CourseId) => void }) {
  const sectionId = title === 'Required learning' ? 'courses' : title === 'Your Favourites' ? 'favourites' : undefined;
  return <section id={sectionId} className="course-library course-group" aria-labelledby={`group-${title.replaceAll(' ', '-').toLowerCase()}`}>
    <div className="section-heading group-heading">
      <div><p className="tiny-eyebrow">{eyebrow}</p><h2 id={`group-${title.replaceAll(' ', '-').toLowerCase()}`}>{title}</h2><p>{description}</p></div>
      <span>{courses.length} {courses.length === 1 ? 'course' : 'courses'}</span>
    </div>
    <div className="course-grid premium-course-grid">
      {courses.map((course) => <CourseCard key={course.id} course={course} onOpen={onOpen} isFavourite={favourites.includes(course.id)} onToggleFavourite={onToggleFavourite} />)}
    </div>
  </section>;
}

function ExploreCourseGroup({ teacherGrowthCourses, otherCourses, onOpen, favourites, onToggleFavourite }: { teacherGrowthCourses: DisplayCourse[]; otherCourses: DisplayCourse[]; onOpen: (id: CourseId) => void; favourites: CourseId[]; onToggleFavourite: (id: CourseId) => void }) {
  const total = teacherGrowthCourses.length + otherCourses.length;
  return <section id="explore" className="course-library course-group" aria-labelledby="group-explore-next">
    <div className="section-heading group-heading">
      <div><p className="tiny-eyebrow">Build capacity</p><h2 id="group-explore-next">Explore next</h2><p>Choose the learning that best connects with your role, goals and current practice.</p></div>
      <span>{total} {total === 1 ? 'course' : 'courses'}</span>
    </div>

    {teacherGrowthCourses.length > 0 && <div className="mt-8 rounded-[28px] border border-navy/10 bg-white/75 p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div><p className="tiny-eyebrow">Growth pathway</p><h3 className="mt-1 text-2xl font-semibold tracking-tight text-navy">Teacher Growth & Reflection</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Four short, continuum-based courses that help you recognise learner evidence, reflect on where practice is deepening, and identify a realistic next move across all four AISG Teacher Growth domains.</p></div>
        <span className="text-sm font-semibold text-muted-foreground">{teacherGrowthCourses.length} courses</span>
      </div>
      <div className="course-grid premium-course-grid">
        {teacherGrowthCourses.map((course) => <CourseCard key={course.id} course={course} onOpen={onOpen} isFavourite={favourites.includes(course.id)} onToggleFavourite={onToggleFavourite} />)}
      </div>
    </div>}

    {otherCourses.length > 0 && <div className="mt-10">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="tiny-eyebrow">More learning</p><h3 className="mt-1 text-xl font-semibold tracking-tight text-navy">Explore all</h3></div><span className="text-sm font-semibold text-muted-foreground">Alphabetical</span></div>
      <div className="course-grid premium-course-grid">
        {otherCourses.map((course) => <CourseCard key={course.id} course={course} onOpen={onOpen} isFavourite={favourites.includes(course.id)} onToggleFavourite={onToggleFavourite} />)}
      </div>
    </div>}
  </section>;
}

function CourseCard({ course, onOpen, isFavourite, onToggleFavourite }: { course: DisplayCourse; onOpen: (id: CourseId) => void; isFavourite: boolean; onToggleFavourite: (id: CourseId) => void }) {
  const favouriteLabel = isFavourite ? `Remove ${course.title} from favourites` : `Add ${course.title} to favourites`;
  return <article className="course-card premium-course-card" data-course={course.id} aria-labelledby={`course-${course.id}`}>
    <CourseMark course={course.id} size="card" />
    <div className="course-card-top">
      <span className="course-category">{course.audience || course.category}</span>
      <div className="course-card-actions">
        <span className="course-designation">{course.designation}</span>
        <button type="button" className={`course-favourite-button ${isFavourite ? 'is-favourite' : ''}`} aria-pressed={isFavourite} aria-label={favouriteLabel} title={isFavourite ? 'Remove from favourites' : 'Add to favourites'} onClick={() => onToggleFavourite(course.id)}>
          <Star aria-hidden="true" />
        </button>
      </div>
    </div>
    <h3 id={`course-${course.id}`}>{course.title}</h3>
    <p>{course.description}</p>
    <div className="course-meta simplified-meta"><span><Clock3 aria-hidden="true" /> {course.duration}</span></div>
    {course.status !== 'Not Started' && <div className="course-card-progress"><Progress value={course.progress} aria-label={`${course.title}: ${course.progress}% complete`} /><span>{course.progress}%</span></div>}
    <div className="course-card-footer">
      <span className={`course-status status-${course.status.toLowerCase().replaceAll(' ', '-')}`}><CheckCircle2 aria-hidden="true" /> {course.status}</span>
      <Button className="primary-pill" onClick={() => onOpen(course.id)}>{course.status === 'Completed' ? 'Review' : course.status === 'In Progress' ? 'Continue' : 'Start'} <ArrowRight aria-hidden="true" /></Button>
    </div>
  </article>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><strong>{value}</strong><span>{label}</span></div>;
}
