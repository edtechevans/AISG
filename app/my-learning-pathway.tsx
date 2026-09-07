'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle2, Compass, RotateCcw, Star, X } from 'lucide-react';
import CourseConnections from '@/app/course-connections';
import CourseMark from '@/app/course-mark';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { COURSE_BY_ID, type CourseId } from '@/lib/course-catalog';
import { pathwayFromFocus, readFocusResult, syncPathwayWithFocus, writeLearningPathway, type LearningPathway } from '@/lib/learning-pathway';

type PathwayCourse = {
  id: CourseId;
  status: 'Completed' | 'In Progress' | 'Not Started';
  progress: number;
};

function announcePathway(pathway: LearningPathway | null) {
  window.dispatchEvent(new CustomEvent('my-courses-pathway-updated', { detail: pathway?.courseIds || [] }));
}

export default function MyLearningPathway({ courses, favourites, onToggleFavourite, onOpenCourse }: {
  courses: PathwayCourse[];
  favourites: CourseId[];
  onToggleFavourite: (course: CourseId) => void;
  onOpenCourse: (course: CourseId) => void;
}) {
  const [pathway, setPathway] = useState<LearningPathway | null>(null);
  const courseState = useMemo(() => new Map(courses.map((course) => [course.id, course])), [courses]);

  useEffect(() => {
    const load = () => {
      const next = syncPathwayWithFocus(readFocusResult());
      setPathway((current) => {
        const currentKey = current ? `${current.sourceFocusCompletedAt}:${current.courseIds.join(',')}` : '';
        const nextKey = next ? `${next.sourceFocusCompletedAt}:${next.courseIds.join(',')}` : '';
        if (currentKey !== nextKey) announcePathway(next);
        return currentKey === nextKey ? current : next;
      });
    };
    load();
    const timer = window.setInterval(load, 900);
    window.addEventListener('storage', load);
    window.addEventListener('my-courses-focus-updated', load);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('storage', load);
      window.removeEventListener('my-courses-focus-updated', load);
    };
  }, []);

  if (!pathway) return null;

  const completedCount = pathway.courseIds.filter((id) => courseState.get(id)?.status === 'Completed').length;
  const connectionCourse = pathway.courseIds.find((id) => courseState.get(id)?.status !== 'Completed') || pathway.courseIds[0];

  function persist(ids: CourseId[]) {
    const next = writeLearningPathway(ids, pathway!.sourceFocusCompletedAt);
    setPathway(next);
    announcePathway(next);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= pathway!.courseIds.length) return;
    const next = [...pathway!.courseIds];
    const currentId = next[index];
    const targetId = next[target];
    if (!currentId || !targetId) return;
    next[index] = targetId;
    next[target] = currentId;
    persist(next);
  }

  function remove(course: CourseId) {
    persist(pathway!.courseIds.filter((id) => id !== course));
  }

  function reset() {
    const focus = readFocusResult();
    if (!focus) return;
    const next = pathwayFromFocus(focus);
    setPathway(next);
    announcePathway(next);
  }

  return <section id="pathway" className="learning-system-section pathway-section" aria-labelledby="pathway-title">
    <div className="learning-system-heading">
      <div>
        <p className="tiny-eyebrow">My learning pathway</p>
        <h2 id="pathway-title">Turn your current focus into a learning journey</h2>
        <p>Find Your Focus suggested a starting sequence. Keep it, reorder it, remove a course or star something for later. The pathway is guidance, not an assignment.</p>
      </div>
      <div className="pathway-summary" aria-label={`${completedCount} of ${pathway.courseIds.length} pathway courses completed`}>
        <strong>{completedCount}/{pathway.courseIds.length}</strong><span>completed</span>
      </div>
    </div>

    <div className="pathway-list">
      {pathway.courseIds.map((courseId, index) => {
        const catalog = COURSE_BY_ID[courseId];
        const state = courseState.get(courseId) ?? { id: courseId, status: 'Not Started' as const, progress: 0 };
        const starred = favourites.includes(courseId);
        return <article key={courseId} className={`pathway-item pathway-${state.status.toLowerCase().replaceAll(' ', '-')}`}>
          <div className="pathway-rank"><span>{index + 1}</span><div className="pathway-order-actions"><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${catalog.title} earlier`}><ArrowUp aria-hidden="true" /></button><button type="button" onClick={() => move(index, 1)} disabled={index === pathway.courseIds.length - 1} aria-label={`Move ${catalog.title} later`}><ArrowDown aria-hidden="true" /></button></div></div>
          <CourseMark course={courseId} size="record" />
          <div className="pathway-copy">
            <p>{catalog.category}</p>
            <h3>{catalog.title}</h3>
            <span>{catalog.description}</span>
            {state.status === 'In Progress' && <div className="pathway-progress"><Progress value={state.progress} aria-label={`${catalog.title}: ${state.progress}% complete`} /><small>{state.progress}% complete</small></div>}
          </div>
          <div className="pathway-actions">
            <span className={`pathway-status status-${state.status.toLowerCase().replaceAll(' ', '-')}`}>{state.status === 'Completed' && <CheckCircle2 aria-hidden="true" />}{state.status}</span>
            <div><button type="button" className={`pathway-star ${starred ? 'is-starred' : ''}`} aria-pressed={starred} onClick={() => onToggleFavourite(courseId)} title={starred ? 'Remove star' : 'Star course'}><Star aria-hidden="true" /></button><Button className="primary-pill" onClick={() => onOpenCourse(courseId)}>{state.status === 'Completed' ? 'Review' : state.status === 'In Progress' ? 'Continue' : 'Start'} <ArrowRight aria-hidden="true" /></Button><button type="button" className="pathway-remove" onClick={() => remove(courseId)} aria-label={`Remove ${catalog.title} from pathway`}><X aria-hidden="true" /></button></div>
          </div>
        </article>;
      })}
    </div>

    {connectionCourse && <CourseConnections course={connectionCourse} onOpenCourse={onOpenCourse} compact />}

    <div className="pathway-footer">
      <Button variant="outline" onClick={reset}><RotateCcw aria-hidden="true" /> Reset to Find Your Focus</Button>
      <Button variant="ghost" onClick={() => document.getElementById('find-your-focus')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><Compass aria-hidden="true" /> Refine my focus</Button>
    </div>
  </section>;
}
