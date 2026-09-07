'use client';

import { ArrowRight, CheckCircle2, Compass, Layers3 } from 'lucide-react';
import CourseMark from '@/app/course-mark';
import { Button } from '@/components/ui/button';
import { COURSE_BY_ID, type CourseId } from '@/lib/course-catalog';
import { CAPACITY_DOMAINS } from '@/lib/professional-capacity';

type CapacityCourseState = {
  id: CourseId;
  status: 'Completed' | 'In Progress' | 'Not Started';
  progress: number;
};

export default function ProfessionalCapacityMap({ courses, completionMeta, pathwayIds, onOpenCourse }: {
  courses: CapacityCourseState[];
  completionMeta: Partial<Record<CourseId, string>>;
  pathwayIds: CourseId[];
  onOpenCourse: (course: CourseId) => void;
}) {
  const stateById = new Map(courses.map((course) => [course.id, course]));
  const completed = courses.filter((course) => course.status === 'Completed');

  return <section id="record" className="learning-system-section capacity-section" aria-labelledby="capacity-title">
    <div className="learning-system-heading">
      <div><p className="tiny-eyebrow">My learning · Professional capacity</p><h2 id="capacity-title">A portrait of the capacity you are building</h2><p>This is not a competency score. It shows the areas you have explored through completed and in-progress learning, the professional capabilities those courses develop, and a possible next connection from your pathway.</p></div>
      <Compass aria-hidden="true" className="learning-system-heading-icon" />
    </div>

    <div className="capacity-grid">
      {CAPACITY_DOMAINS.map((domain) => {
        const completedIds = domain.courseIds.filter((id) => stateById.get(id)?.status === 'Completed');
        const inProgressIds = domain.courseIds.filter((id) => stateById.get(id)?.status === 'In Progress');
        const capabilities = [...new Set(completedIds.flatMap((id) => COURSE_BY_ID[id].capabilities))].slice(0, 8);
        const next = pathwayIds.find((id) => domain.courseIds.includes(id) && stateById.get(id)?.status !== 'Completed');
        return <article key={domain.id} className="capacity-card">
          <div className="capacity-card-top"><div className="capacity-domain-icon"><Layers3 aria-hidden="true" /></div><div><p>{completedIds.length > 0 ? `Explored through ${completedIds.length} ${completedIds.length === 1 ? 'course' : 'courses'}` : inProgressIds.length > 0 ? 'Currently exploring' : 'Ready to explore'}</p><h3>{domain.title}</h3></div></div>
          <p className="capacity-description">{domain.description}</p>
          {capabilities.length > 0 ? <ul className="capacity-chips" aria-label={`${domain.title} capabilities`}>{capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul> : <p className="capacity-empty">Capabilities will appear here as related learning is completed.</p>}
          {next && <div className="capacity-next"><span>Pathway connection</span><strong>{COURSE_BY_ID[next].title}</strong><Button variant="ghost" onClick={() => onOpenCourse(next)}>Explore <ArrowRight aria-hidden="true" /></Button></div>}
        </article>;
      })}
    </div>

    <div className="completed-learning-block">
      <div className="completed-learning-heading"><div><p className="tiny-eyebrow">Completed learning</p><h3>Your course record</h3></div><span>{completed.length} {completed.length === 1 ? 'course' : 'courses'}</span></div>
      {completed.length === 0 ? <p className="record-empty">Complete a course and the capabilities you have explored will begin to form your professional capacity map.</p> : <div className="completed-learning-list">{completed.map((course) => <article key={course.id} className="completed-learning-row"><div><CourseMark course={course.id} size="record" /><div><strong>{COURSE_BY_ID[course.id].title}</strong><span>{completionMeta[course.id] || 'SY2026–27 · Completed'}</span></div></div><CheckCircle2 aria-label="Completed" /></article>)}</div>}
    </div>
  </section>;
}
