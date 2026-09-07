'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Clock3, Search, X } from 'lucide-react';
import CourseMark from '@/app/course-mark';
import { COURSE_CATALOG, type CourseId } from '@/lib/course-catalog';

function searchableText(course: (typeof COURSE_CATALOG)[number]) {
  return [course.title, course.description, course.intro, course.category, course.audience, course.designation, course.duration, ...course.capabilities]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function searchScore(course: (typeof COURSE_CATALOG)[number], terms: string[]) {
  const title = course.title.toLowerCase();
  const capabilities = course.capabilities.join(' ').toLowerCase();
  const category = `${course.category} ${course.audience || ''}`.toLowerCase();
  return terms.reduce((score, term) => {
    if (title === term) return score + 12;
    if (title.startsWith(term)) return score + 8;
    if (title.includes(term)) return score + 6;
    if (capabilities.includes(term)) return score + 4;
    if (category.includes(term)) return score + 3;
    return score + 1;
  }, 0);
}

export default function CourseSearch({ onCourse }: { onCourse: (course: CourseId) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return COURSE_CATALOG
      .filter((course) => {
        if (terms.length === 0) return true;
        const haystack = searchableText(course);
        return terms.every((term) => haystack.includes(term));
      })
      .sort((a, b) => {
        if (terms.length > 0) {
          const scoreDifference = searchScore(b, terms) - searchScore(a, terms);
          if (scoreDifference !== 0) return scoreDifference;
        }
        return a.title.localeCompare(b.title);
      });
  }, [query]);

  function openSearch() {
    setOpen(true);
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
    const onShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        return;
      }
      if (!typing && event.key === '/') {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => inputRef.current?.focus());

    const onDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hasAttribute('hidden'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener('keydown', onDialogKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onDialogKeyDown);
      requestAnimationFrame(() => triggerRef.current?.focus());
    };
  }, [open]);

  const searchLayer = open && typeof document !== 'undefined' ? createPortal(<>
    <button type="button" tabIndex={-1} className="course-search-scrim" aria-label="Close course search" onClick={closeSearch} />
    <dialog ref={dialogRef} open className="course-search-dialog" aria-modal="true" aria-labelledby="course-search-title">
      <div className="course-search-heading">
        <div><p className="tiny-eyebrow">Explore learning</p><h2 id="course-search-title">Find the learning you need</h2></div>
        <button type="button" className="course-search-close" onClick={closeSearch} aria-label="Close course search"><X aria-hidden="true" /></button>
      </div>
      <label className="course-search-input-wrap" htmlFor="course-search-input">
        <Search aria-hidden="true" />
        <input ref={inputRef} id="course-search-input" role="searchbox" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by course, capability or topic…" autoComplete="off" />
        <span aria-live="polite">{results.length} {results.length === 1 ? 'course' : 'courses'}</span>
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
        </li>) : <li className="course-search-empty"><strong>No matching course yet.</strong><span>Try fewer or broader terms such as assessment, multilingual, agency, data, AI or support.</span></li>}
      </ul>
      <p className="course-search-tip">Tip: press <kbd>/</kbd> anywhere on the platform to search.</p>
    </dialog>
  </>, document.body) : null;

  return <>
    <button ref={triggerRef} id="course-search-trigger" type="button" className="header-search-button" onClick={openSearch} aria-haspopup="dialog" aria-expanded={open} aria-controls="course-search-dialog">
      <Search aria-hidden="true" />
      <span className="header-search-copy"><strong>Explore learning</strong><small>Search courses</small></span>
      <kbd>⌘K</kbd>
    </button>
    {searchLayer && <span id="course-search-dialog" className="contents">{searchLayer}</span>}
  </>;
}
