'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Clock3, Search, X } from 'lucide-react';
import CourseMark from '@/app/course-mark';
import { COURSE_CATALOG, type CourseId } from '@/lib/course-catalog';

function searchableText(course: (typeof COURSE_CATALOG)[number]) {
  return [course.title, course.description, course.intro, course.category, course.audience, course.designation, course.duration, ...course.capabilities]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export default function CourseSearch({ onCourse }: { onCourse: (course: CourseId) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return COURSE_CATALOG
      .filter((course) => !term || searchableText(course).includes(term))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [query]);

  function openSearch() {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeSearch() {
    setOpen(false);
    setQuery('');
  }

  function chooseCourse(course: CourseId) {
    closeSearch();
    onCourse(course);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }
      if (!typing && event.key === '/') {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return <>
    <button id="course-search-trigger" type="button" className="header-search-button" onClick={openSearch} aria-haspopup="dialog" aria-expanded={open}>
      <Search aria-hidden="true" />
      <span className="header-search-copy"><strong>Explore learning</strong><small>Search courses</small></span>
      <kbd>⌘K</kbd>
    </button>

    {open && <>
      <button type="button" className="course-search-scrim" aria-label="Close course search" onClick={closeSearch} />
      <dialog open className="course-search-dialog" aria-labelledby="course-search-title">
        <div className="course-search-heading">
          <div><p className="tiny-eyebrow">Explore learning</p><h2 id="course-search-title">Find the learning you need</h2></div>
          <button type="button" className="course-search-close" onClick={closeSearch} aria-label="Close course search"><X aria-hidden="true" /></button>
        </div>
        <label className="course-search-input-wrap" htmlFor="course-search-input">
          <Search aria-hidden="true" />
          <input ref={inputRef} id="course-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by course, capability or topic…" autoComplete="off" />
          <span>{results.length} {results.length === 1 ? 'course' : 'courses'}</span>
        </label>
        <ul className="course-search-results" aria-label="Course search results">
          {results.length > 0 ? results.map((course) => <li key={course.id}>
            <button type="button" className="course-search-result" onClick={() => chooseCourse(course.id)}>
              <CourseMark course={course.id} size="record" />
              <span className="course-search-result-copy">
                <small>{course.audience || course.category} · {course.designation}</small>
                <strong>{course.title}</strong>
                <span>{course.description}</span>
                <em><Clock3 aria-hidden="true" /> {course.duration}</em>
              </span>
              <ArrowRight className="course-search-arrow" aria-hidden="true" />
            </button>
          </li>) : <li className="course-search-empty"><strong>No matching course yet.</strong><span>Try a broader idea such as assessment, multilingual, agency, data, AI or support.</span></li>}
        </ul>
        <p className="course-search-tip">Tip: press <kbd>/</kbd> anywhere on the platform to search.</p>
      </dialog>
    </>}
  </>;
}
