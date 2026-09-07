'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { isCourseId } from '@/lib/course-catalog';

const LearningCompanion = lazy(() => import('@/app/learning-companion'));

function courseIsOpen() {
  if (typeof window === 'undefined') return false;
  const course = new URLSearchParams(window.location.search).get('course');
  return Boolean(course && isCourseId(course));
}

export default function RouteLearningCompanion() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(courseIsOpen()));
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('popstate', sync);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('popstate', sync);
    };
  }, []);

  if (!active) return null;
  return <Suspense fallback={null}><LearningCompanion /></Suspense>;
}
