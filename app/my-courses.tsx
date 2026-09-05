'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Clock3, GraduationCap, History, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import TrainingApp from '@/app/training-app';
import AiTrainingApp from '@/app/ai-training-app';
import { COURSE_CATALOG } from '@/lib/course-catalog';

export { COURSE_CATALOG } from '@/lib/course-catalog';

type CourseStatus = 'Completed' | 'In Progress' | 'Not Started';
type SafeguardingState = { status?: string; responses?: unknown[]; progress?: { completed?: number; percentage?: number } | null; attempt?: { completedAt?: number | null } };

function aiState(): SafeguardingState { try { return JSON.parse(localStorage.getItem('my-courses-ai-progress-v1') || '{}') as SafeguardingState; } catch { return {}; } }
function teamsState(): SafeguardingState { try { return JSON.parse(localStorage.getItem('my-courses-teams-progress-v1') || '{}') as SafeguardingState; } catch { return {}; } }
function mtssState(): SafeguardingState { try { return JSON.parse(localStorage.getItem('my-courses-mtss-progress-v1') || '{}') as SafeguardingState; } catch { return {}; } }
function courseState(course: string): SafeguardingState { try { return JSON.parse(localStorage.getItem(`my-courses-${course}-progress-v1`) || '{}') as SafeguardingState; } catch { return {}; } }
function statusFor(state: SafeguardingState, _total: number): CourseStatus { const responseCount = Array.isArray(state.responses) ? state.responses.length : Object.keys((state.responses || {}) as object).length; if (state.status === 'PASSED' || state.attempt?.completedAt || (state as { completedAt?: number }).completedAt) return 'Completed'; if (responseCount > 0 || (state.progress?.completed || 0) > 0 || ((state as { completedSections?: unknown[] }).completedSections?.length || 0) > 0) return 'In Progress'; return 'Not Started'; }

export default function MyCoursesApp({ staticMode = false }: { staticMode?: boolean }) {
  const [route, setRoute] = useState(() => typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('course') || '');
  const [safeguarding, setSafeguarding] = useState<SafeguardingState>({});
  const [ai, setAi] = useState<SafeguardingState>(() => typeof window === 'undefined' ? {} : aiState());
  const [engagement, setEngagement] = useState<SafeguardingState>(() => typeof window === 'undefined' ? {} : courseState('engagement'));
  const [teams, setTeams] = useState<SafeguardingState>(() => typeof window === 'undefined' ? {} : teamsState());
  const [mtss, setMtss] = useState<SafeguardingState>(() => typeof window === 'undefined' ? {} : mtssState());
  useEffect(() => { document.title = route === 'safeguarding' ? 'Safeguarding at AISG | My Courses' : route === 'ai' ? 'AI in Education | My Courses' : route === 'teams' ? 'Microsoft Teams for Communication | My Courses' : 'My Courses | AISG'; }, [route]);
  useEffect(() => { const onPop = () => setRoute(new URLSearchParams(window.location.search).get('course') || ''); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  useEffect(() => { if (route !== '') return; fetch('/api/bootstrap', { cache: 'no-store' }).then((response) => response.ok ? response.json() : null).then((data) => { if (data) setSafeguarding(data); }).catch(() => undefined); }, [route]);
  useEffect(() => { const timer = window.setInterval(() => { setAi(aiState()); setEngagement(courseState('engagement')); setTeams(teamsState()); setMtss(mtssState()); }, 1000); return () => window.clearInterval(timer); }, []);
  function open(course: string) { const url = new URL(window.location.href); url.searchParams.set('course', course); window.history.pushState({}, '', url); setRoute(course); }
  function home() {
    const url = new URL(window.location.href);
    url.searchParams.delete('course');
    window.history.pushState({}, '', url);
    setRoute('');
    setAi(aiState());
    setEngagement(courseState('engagement'));
    setTeams(teamsState());
    setMtss(mtssState());
  }
  if (route === 'safeguarding') return <TrainingApp staticMode={staticMode} />;
  if (route === 'engagement') return <><PlatformHeader onHome={home} activeCourse="engagement" onCourse={(course) => open(course)} /><AiTrainingApp key="engagement" onExit={home} course="engagement" /></>;
  if (route === 'ai') return <><PlatformHeader onHome={home} activeCourse="ai" onCourse={(course) => open(course)} /><AiTrainingApp key="ai" onExit={home} /></>;
  if (route === 'teams') return <><PlatformHeader onHome={home} activeCourse="teams" onCourse={(course) => open(course)} /><AiTrainingApp key="teams" onExit={home} course="teams" /></>;
  if (route === 'mtss') return <><PlatformHeader onHome={home} activeCourse="mtss" onCourse={(course) => open(course)} /><AiTrainingApp key="mtss" onExit={home} course="mtss" /></>;
  const safeguardingStatus = statusFor(safeguarding, 30);
  const engagementStatus = statusFor(engagement, 10);
  const aiStatus = statusFor(ai, 10);
  const teamsStatus = statusFor(teams, 10);
  const mtssStatus = statusFor(mtss, 16);
  const courses = [{ id: 'safeguarding', title: 'Safeguarding at AISG', description: 'Essential knowledge, responsibilities and professional judgement to help keep students safe at AISG.', category: 'Student Safety & Wellbeing', time: '35–45 minutes', info: '6 modules · 30 assessed questions', status: safeguardingStatus, progress: Math.round((safeguarding.progress?.percentage || 0)), designation: 'Required' }, { id: 'engagement', title: 'Engagement for All: The AISG Learning Framework', description: 'A practical gateway to AISG’s shared language for designing, noticing and improving learning experiences.', category: 'AISG Learning Framework', time: '20–25 minutes', info: '5 sections · 10 assessed questions', status: engagementStatus, progress: Math.round((Object.keys((engagement as { responses?: object }).responses || {}).length + (((engagement as { completedSections?: unknown[] }).completedSections || []).length)) / 15 * 100), designation: 'Foundation' }, { id: 'mtss', title: 'Multi-Tiered System of Supports (MTSS)', description: 'A systems-focused course on proactive support, evidence-informed decisions and continuous improvement.', category: 'Instructional Practice', time: '45–60 minutes', info: '8 sections · 16 assessed questions', status: mtssStatus, progress: Math.round((Object.keys((mtss as { responses?: object }).responses || {}).length + (((mtss as { completedSections?: unknown[] }).completedSections || []).length)) / 24 * 100), designation: 'Recommended' }, { id: 'ai', title: 'AI in Education', description: 'Practical guidance for using AI responsibly, thoughtfully and effectively as an educator.', category: 'Digital Practice', time: '20–30 minutes', info: '5 sections · 10 assessed questions', status: aiStatus, progress: Math.round((Object.keys((ai as { responses?: object }).responses || {}).length + (((ai as { completedSections?: unknown[] }).completedSections || []).length)) / 15 * 100), designation: 'Recommended' }, { id: 'teams', title: 'Microsoft Teams for Communication', description: 'Practical guidance for clear, purposeful and professional internal communication at AISG.', category: 'Professional Practice', time: '15–20 minutes', info: '5 sections · 10 assessed questions', status: teamsStatus, progress: Math.round((Object.keys((teams as { responses?: object }).responses || {}).length + (((teams as { completedSections?: unknown[] }).completedSections || []).length)) / 15 * 100), designation: 'Recommended' }];
  const inProgress = courses.find((course) => course.status === 'In Progress');
  const completed = courses.filter((course) => course.status === 'Completed').length;
  return <><PlatformHeader onHome={home} /><main className="my-courses-shell"><section className="my-courses-hero"><div><p className="eyebrow"><GraduationCap aria-hidden="true" /> AISG professional learning</p><h1>Welcome to My Courses</h1><p>Short, practical professional learning designed for the AISG context.</p></div><div className="hero-mark"><Sparkles aria-hidden="true" /><span>Learn · Check · Apply · Reflect</span></div></section><section className="progress-summary" aria-labelledby="progress-title"><div className="flex items-center justify-between"><div><p className="tiny-eyebrow">Your progress</p><h2 id="progress-title">See your learning at a glance</h2></div><Button variant="outline" onClick={() => document.getElementById('record')?.scrollIntoView({ behavior: 'smooth' })}><History /> View my course record</Button></div><div className="progress-stats"><Stat label="Completed" value={String(completed)} /><Stat label="In progress" value={String(courses.filter((course) => course.status === 'In Progress').length)} /><Stat label="Available" value={String(courses.filter((course) => course.status === 'Not Started').length)} /></div></section>{inProgress && <section className="continue-card"><div><p className="tiny-eyebrow">Continue learning</p><h2>{inProgress.title}</h2><p>{inProgress.progress}% complete · Your exact place is saved in this browser.</p></div><Button className="primary-pill" size="lg" onClick={() => open(inProgress.id)}>Continue course <ArrowRight /></Button></section>}<section className="course-library" aria-labelledby="courses-title"><div className="section-heading"><div><p className="tiny-eyebrow">Your courses</p><h2 id="courses-title">Professional learning for your practice</h2></div><BookOpen aria-hidden="true" /></div><div className="course-grid">{courses.map((course) => <article className="course-card" key={course.id}><div className="course-card-top"><span className="course-category">{course.category}</span><span className="course-designation">{course.designation}</span></div><h3>{course.title}</h3><p>{course.description}</p><div className="course-meta"><span><Clock3 /> {course.time}</span><span>{course.info}</span></div>{course.status !== 'Not Started' && <Progress value={course.progress} aria-label={`${course.title}: ${course.progress}% complete`} className="mt-5 [&_[data-slot=progress-indicator]]:bg-red" />}<div className="course-card-footer"><span className={`course-status status-${course.status.toLowerCase().replace(' ', '-')}`}><CheckCircle2 /> {course.status}</span><Button className="primary-pill" onClick={() => open(course.id)}>{course.status === 'Completed' ? 'Review course' : course.status === 'In Progress' ? 'Continue course' : 'Start course'} <ArrowRight /></Button></div></article>)}</div></section><section id="record" className="record-card"><div><p className="tiny-eyebrow">My course record</p><h2>Your professional learning history</h2><p>Completions and reflections are stored in this browser for this GitHub Pages test environment.</p></div>{courses.filter((course) => course.status === 'Completed').map((course) => <div className="record-row" key={course.id}><strong>{course.title}</strong><span>{course.id === 'safeguarding' ? 'SY2026–27' : 'SY2026–27'} · Completed</span></div>)}{completed === 0 && <p className="record-empty">Completed courses will appear here as you finish them.</p>}</section></main></>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div><strong>{value}</strong><span>{label}</span></div>; }
function PlatformHeader({ onHome, activeCourse, onCourse }: { onHome: () => void; activeCourse?: string; onCourse?: (course: string) => void }) {
  return <header className="app-header print:hidden"><div className="app-header-inner">
    <button className="brand-button" onClick={onHome} aria-label="Learning Platform home">
      {/* oxlint-disable-next-line next/no-img-element -- static asset works in the Pages subdirectory and server build. */}
      <img className="aisg-logo aisg-logo-header" src="aisg-logo.png" alt="" />
      <span className="brand-copy"><strong>AISG Learning Platform</strong><small>Professional development</small></span>
    </button>
    <nav className="platform-nav" aria-label="Platform navigation"><Button className="nav-link" variant="ghost" onClick={onHome}>Home</Button><label className="course-switcher"><span className="sr-only">Switch course</span><select aria-label="Switch course" value={activeCourse || ''} onChange={(event) => onCourse?.(event.target.value)}><option value="" disabled>Courses</option>{COURSE_CATALOG.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label></nav>
  </div></header>;
}
