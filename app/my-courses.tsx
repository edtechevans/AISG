'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Compass, GraduationCap, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import TrainingApp from '@/app/training-app';
import AiTrainingApp from '@/app/ai-training-app';
import PlatformHeader from '@/app/platform-header';
import { COURSE_BY_ID, COURSE_CATALOG, isCourseId, type CourseCatalogItem, type CourseId } from '@/lib/course-catalog';
import { installStaticApi } from '@/pages/src/static-api';

export { COURSE_CATALOG } from '@/lib/course-catalog';

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

  useEffect(() => {
    const title = isCourseId(route) ? `${COURSE_BY_ID[route].title} | AISG My Courses` : 'AISG My Courses';
    document.title = title;
  }, [route]);

  useEffect(() => {
    const syncBrowserState = () => {
      setRoute(new URLSearchParams(window.location.search).get('course') || '');
      setStates((current) => ({ ...current, ...shortCourseStates() }));
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
  }

  const courses: DisplayCourse[] = COURSE_CATALOG.map((course) => ({
    ...course,
    status: statusFor(states[course.id]),
    progress: progressFor(course, states[course.id]),
  }));

  if (route === 'safeguarding') return <TrainingApp staticMode={browserMode} />;
  if (route === 'elementary') return <><PlatformHeader onPlatformHome={home} activeCourse="elementary" onCourse={open} onCourses={home} /><AiTrainingApp key="elementary" onExit={home} course="elementary" /></>;
  if (route === 'secondary') return <><PlatformHeader onPlatformHome={home} activeCourse="secondary" onCourse={open} onCourses={home} /><AiTrainingApp key="secondary" onExit={home} course="secondary" /></>;
  if (route === 'engagement') return <><PlatformHeader onPlatformHome={home} activeCourse="engagement" onCourse={open} onCourses={home} /><AiTrainingApp key="engagement" onExit={home} course="engagement" /></>;
  if (route === 'udl') return <><PlatformHeader onPlatformHome={home} activeCourse="udl" onCourse={open} onCourses={home} /><AiTrainingApp key="udl" onExit={home} course="udl" /></>;
  if (route === 'data') return <><PlatformHeader onPlatformHome={home} activeCourse="data" onCourse={open} onCourses={home} /><AiTrainingApp key="data" onExit={home} course="data" /></>;
  if (route === 'mtss') return <><PlatformHeader onPlatformHome={home} activeCourse="mtss" onCourse={open} onCourses={home} /><AiTrainingApp key="mtss" onExit={home} course="mtss" /></>;
  if (route === 'ai') return <><PlatformHeader onPlatformHome={home} activeCourse="ai" onCourse={open} onCourses={home} /><AiTrainingApp key="ai" onExit={home} /></>;
  if (route === 'technology') return <><PlatformHeader onPlatformHome={home} activeCourse="technology" onCourse={open} onCourses={home} /><AiTrainingApp key="technology" onExit={home} course="technology" /></>;
  if (route === 'teams') return <><PlatformHeader onPlatformHome={home} activeCourse="teams" onCourse={open} onCourses={home} /><AiTrainingApp key="teams" onExit={home} course="teams" /></>;

  const inProgress = courses
    .filter((course) => course.status === 'In Progress')
    .sort((a, b) => (states[b.id].updatedAt || 0) - (states[a.id].updatedAt || 0))[0];
  const completed = courses.filter((course) => course.status === 'Completed').length;
  const required = courses.filter((course) => course.designation === 'Required');
  const requiredCompleted = required.filter((course) => course.status === 'Completed').length;
  const hasActivity = courses.some((course) => course.status !== 'Not Started');
  const explore = courses.filter((course) => course.designation !== 'Required');

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
          <p className="tiny-eyebrow">Continue learning</p>
          <h2 id="continue-title">{inProgress.title}</h2>
          <p>{inProgress.progress}% complete · Resume exactly where you left off.</p>
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

      <CourseGroup
        title="Required learning"
        eyebrow="Core learning"
        description="The shared knowledge and expectations that underpin safe, consistent and effective practice at AISG."
        courses={required}
        onOpen={open}
      />

      <CourseGroup
        title="Explore next"
        eyebrow="Build capacity"
        description="Choose the learning that best connects with your role, goals and current practice."
        courses={explore}
        onOpen={open}
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
            <div><strong>{course.title}</strong><span>{date ? `${date} · ` : ''}{score === undefined ? '' : `${score}/${course.checkCount} · `}SY2026–27 · Completed</span></div>
            <ul aria-label={`${course.title} capabilities`}>{course.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul>
          </article>;
        })}
        {completed === 0 && <p className="record-empty">Complete a course and the capabilities you have developed will appear here.</p>}
      </section>
    </main>
  </>;
}

function CourseGroup({ title, eyebrow, description, courses, onOpen }: { title: string; eyebrow: string; description: string; courses: DisplayCourse[]; onOpen: (id: CourseId) => void }) {
  return <section id={title === 'Required learning' ? 'courses' : undefined} className="course-library course-group" aria-labelledby={`group-${title.replaceAll(' ', '-').toLowerCase()}`}>
    <div className="section-heading group-heading">
      <div><p className="tiny-eyebrow">{eyebrow}</p><h2 id={`group-${title.replaceAll(' ', '-').toLowerCase()}`}>{title}</h2><p>{description}</p></div>
      <span>{courses.length} {courses.length === 1 ? 'course' : 'courses'}</span>
    </div>
    <div className="course-grid premium-course-grid">
      {courses.map((course) => <CourseCard key={course.id} course={course} onOpen={onOpen} />)}
    </div>
  </section>;
}

function CourseCard({ course, onOpen }: { course: DisplayCourse; onOpen: (id: CourseId) => void }) {
  return <article className="course-card premium-course-card" data-course={course.id} aria-labelledby={`course-${course.id}`}>
    <div className="course-identity-mark" aria-hidden="true"><span /><span /><span /></div>
    <div className="course-card-top">
      <span className="course-category">{course.audience || course.category}</span>
      <span className="course-designation">{course.designation}</span>
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
