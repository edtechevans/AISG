'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, GraduationCap, History } from 'lucide-react';
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
  progress?: { completed?: number; percentage?: number } | null;
  attempt?: { completedAt?: number | null };
};

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

function statusFor(state: CourseState): CourseStatus {
  if (state.status === 'PASSED' || state.attempt?.completedAt || state.completedAt) return 'Completed';
  if (responseCount(state) > 0 || (state.progress?.completed || 0) > 0 || (state.completedSections?.length || 0) > 0) return 'In Progress';
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
  const [route, setRoute] = useState(() => typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('course') || '');
  const [states, setStates] = useState<Record<CourseId, CourseState>>(() => shortCourseStates());
  const [browserMode, setBrowserMode] = useState(staticMode);

  useEffect(() => {
    const title = isCourseId(route) ? `${COURSE_BY_ID[route].title} | My Courses` : 'My Courses | AISG';
    document.title = title;
  }, [route]);

  useEffect(() => {
    const onPop = () => setRoute(new URLSearchParams(window.location.search).get('course') || '');
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

  const courses = COURSE_CATALOG.map((course) => ({
    ...course,
    status: statusFor(states[course.id]),
    progress: progressFor(course, states[course.id]),
  }));

  if (route === 'safeguarding') return <TrainingApp staticMode={browserMode} />;
  if (route === 'elementary') return <><PlatformHeader onPlatformHome={home} activeCourse="elementary" onCourse={open} /><AiTrainingApp key="elementary" onExit={home} course="elementary" /></>;
  if (route === 'secondary') return <><PlatformHeader onPlatformHome={home} activeCourse="secondary" onCourse={open} /><AiTrainingApp key="secondary" onExit={home} course="secondary" /></>;
  if (route === 'engagement') return <><PlatformHeader onPlatformHome={home} activeCourse="engagement" onCourse={open} /><AiTrainingApp key="engagement" onExit={home} course="engagement" /></>;
  if (route === 'mtss') return <><PlatformHeader onPlatformHome={home} activeCourse="mtss" onCourse={open} /><AiTrainingApp key="mtss" onExit={home} course="mtss" /></>;
  if (route === 'ai') return <><PlatformHeader onPlatformHome={home} activeCourse="ai" onCourse={open} /><AiTrainingApp key="ai" onExit={home} /></>;
  if (route === 'teams') return <><PlatformHeader onPlatformHome={home} activeCourse="teams" onCourse={open} /><AiTrainingApp key="teams" onExit={home} course="teams" /></>;

  const inProgress = courses.find((course) => course.status === 'In Progress');
  const completed = courses.filter((course) => course.status === 'Completed').length;

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return <>
    <PlatformHeader onPlatformHome={home} onCourse={open} onCourses={() => scrollTo('courses')} onProgress={() => scrollTo('progress')} />
    <main id="main-content" className="my-courses-shell">
      <section className="my-courses-hero">
        <div>
          <p className="eyebrow"><GraduationCap aria-hidden="true" /> AISG professional learning</p>
          <h1>Professional learning,<br />all in one place.</h1>
          <p>Build shared understanding, apply it to authentic AISG decisions, and return whenever your practice is ready for the next step.</p>
        </div>
        <p className="learning-rhythm" aria-label="Learning rhythm">Learn <span>→</span> Check <span>→</span> Apply <span>→</span> Reflect</p>
      </section>

      <section id="progress" className="progress-summary" aria-labelledby="progress-title">
        <div className="progress-summary-heading">
          <div><p className="tiny-eyebrow">Your progress</p><h2 id="progress-title">Your learning at a glance</h2></div>
          <Button variant="outline" onClick={() => scrollTo('record')}><History aria-hidden="true" /> View course record</Button>
        </div>
        <div className="progress-stats" aria-live="polite">
          <Stat label="Completed" value={String(completed)} />
          <Stat label="In progress" value={String(courses.filter((course) => course.status === 'In Progress').length)} />
          <Stat label="Available" value={String(courses.filter((course) => course.status === 'Not Started').length)} />
        </div>
      </section>

      {inProgress && <section className="continue-card" aria-labelledby="continue-title">
        <div><p className="tiny-eyebrow">Continue learning</p><h2 id="continue-title">{inProgress.title}</h2><p>{inProgress.progress}% complete · Resume from your saved place.</p></div>
        <Button className="primary-pill" size="lg" onClick={() => open(inProgress.id)}>Continue course <ArrowRight aria-hidden="true" /></Button>
      </section>}

      <section id="courses" className="course-library" aria-labelledby="courses-title">
        <div className="section-heading"><div><p className="tiny-eyebrow">Courses</p><h2 id="courses-title">Learning for your AISG practice</h2></div><p>{courses.length} courses · Self-paced</p></div>
        <div className="course-grid">
          {courses.map((course) => <article className="course-card" key={course.id} aria-labelledby={`course-${course.id}`}>
            <div className="course-card-top"><span className="course-category">{course.category}{course.audience ? ` · ${course.audience}` : ''}</span><span className="course-designation">{course.designation}</span></div>
            <h3 id={`course-${course.id}`}>{course.title}</h3>
            <p>{course.description}</p>
            <div className="course-meta"><span><Clock3 aria-hidden="true" /> {course.duration}</span><span>{course.sectionCount} sections · {course.checkCount} learning checks</span></div>
            {course.status !== 'Not Started' && <div className="course-card-progress"><Progress value={course.progress} aria-label={`${course.title}: ${course.progress}% complete`} /><span>{course.progress}%</span></div>}
            <div className="course-card-footer">
              <span className={`course-status status-${course.status.toLowerCase().replaceAll(' ', '-')}`}><CheckCircle2 aria-hidden="true" /> {course.status}</span>
              <Button className="primary-pill" onClick={() => open(course.id)}>{course.status === 'Completed' ? 'Review course' : course.status === 'In Progress' ? 'Continue course' : 'Start course'} <ArrowRight aria-hidden="true" /></Button>
            </div>
          </article>)}
        </div>
      </section>

      <section id="record" className="record-card" aria-labelledby="record-title">
        <div><p className="tiny-eyebrow">Course record</p><h2 id="record-title">Your professional learning history</h2><p>Course progress and reflections are saved in this browser for this test environment.</p></div>
        {courses.filter((course) => course.status === 'Completed').map((course) => <div className="record-row" key={course.id}><strong>{course.title}</strong><span>SY2026–27 · Completed</span></div>)}
        {completed === 0 && <p className="record-empty">Completed courses will appear here.</p>}
      </section>
    </main>
  </>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><strong>{value}</strong><span>{label}</span></div>;
}
