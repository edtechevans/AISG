'use client';

import { ArrowRight, Network } from 'lucide-react';
import CourseMark from '@/app/course-mark';
import { Button } from '@/components/ui/button';
import { COURSE_BY_ID, type CourseId } from '@/lib/course-catalog';
import { COURSE_CONNECTIONS } from '@/lib/course-connections';

export default function CourseConnections({ course, onOpenCourse, compact = false }: { course: CourseId; onOpenCourse?: (course: CourseId) => void; compact?: boolean }) {
  const connections = COURSE_CONNECTIONS[course];
  if (!connections?.length) return null;

  function open(id: CourseId) {
    if (onOpenCourse) {
      onOpenCourse(id);
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('course', id);
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  return <section className={`course-connections ${compact ? 'course-connections-compact' : ''}`} aria-labelledby={`connections-${course}`}>
    <div className="course-connections-heading"><div className="course-connections-icon"><Network aria-hidden="true" /></div><div><p className="tiny-eyebrow">Connect this learning</p><h2 id={`connections-${course}`}>See the idea from another angle</h2><p>These are meaningful conceptual connections, not prerequisites. Follow one when it helps you deepen or transfer the learning.</p></div></div>
    <div className="course-connections-grid">
      {connections.map((connection) => {
        const related = COURSE_BY_ID[connection.course];
        return <article key={connection.course} className="course-connection-card">
          <CourseMark course={connection.course} size="record" />
          <div><p>{related.category}</p><h3>{related.title}</h3><span>{connection.reason}</span></div>
          <Button variant="ghost" onClick={() => open(connection.course)}>Explore connection <ArrowRight aria-hidden="true" /></Button>
        </article>;
      })}
    </div>
  </section>;
}
