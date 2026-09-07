'use client';

import { useRef } from 'react';
import { COURSE_BY_ID, type CourseId } from '@/lib/course-catalog';
import CourseMark from '@/app/course-mark';
import CourseSearch from '@/app/course-search';

export default function PlatformHeader({
  activeCourse,
  onPlatformHome,
  onCourse,
  onCourses,
  onProgress,
  onCourseHome,
  userName,
  adminHref,
  context = 'Professional learning',
}: {
  activeCourse?: CourseId;
  onPlatformHome: () => void;
  onCourse: (course: CourseId) => void;
  onCourses?: () => void;
  onProgress?: () => void;
  onCourseHome?: () => void;
  userName?: string;
  adminHref?: string;
  context?: string;
}) {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const initials = userName
    ? userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : '';
  const activeTitle = activeCourse ? COURSE_BY_ID[activeCourse].title : undefined;
  const homepageNavigation = !activeCourse;

  const closeMobileMenu = () => mobileMenuRef.current?.removeAttribute('open');
  const goHome = () => { closeMobileMenu(); onPlatformHome(); };
  const goCourses = () => { closeMobileMenu(); (onCourses ?? onPlatformHome)(); };
  const goProgress = () => { closeMobileMenu(); onProgress?.(); };
  const goCourseHome = () => { closeMobileMenu(); onCourseHome?.(); };
  const goSearch = () => {
    closeMobileMenu();
    document.getElementById('course-search-trigger')?.click();
  };

  const scrollToSection = (id: string, fallbackId?: string) => {
    closeMobileMenu();
    const target = document.getElementById(id) ?? (fallbackId ? document.getElementById(fallbackId) : null);
    if (!target) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return <header className="app-header print:hidden">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="app-header-inner">
      <button className="brand-button" onClick={goHome} aria-label="AISG My Courses home">
        {/* oxlint-disable-next-line next/no-img-element -- relative asset supports Sites and the GitHub Pages base path. */}
        <img className="aisg-logo aisg-logo-header" src="aisg-logo.png" alt="" />
        <span className="brand-copy"><strong>AISG My Courses</strong><small>{context}</small></span>
      </button>

      {activeTitle && activeCourse && <div className="header-course-context" aria-label="Current course">
        <CourseMark course={activeCourse} size="nav" />
        <span>My Courses</span><span aria-hidden="true">/</span><strong>{activeTitle}</strong>
      </div>}

      <nav className="platform-nav platform-nav-desktop" aria-label="Learning platform navigation">
        <button className="nav-link nav-link-home" onClick={goHome}>Home</button>
        {homepageNavigation ? <>
          <button className="nav-link nav-link-section" onClick={() => scrollToSection('pathway', 'find-your-focus')}>My Pathway</button>
          <button className="nav-link nav-link-section" onClick={() => scrollToSection('favourites', 'find-your-focus')}>Saved Learning</button>
          <button className="nav-link nav-link-section" onClick={() => scrollToSection('courses')}>Core Learning</button>
          <button className="nav-link nav-link-section" onClick={() => scrollToSection('explore')}>Build Capacity</button>
          <button className="nav-link nav-link-section" onClick={() => scrollToSection('practice')}>My Practice</button>
        </> : <>
          {onCourseHome && <button className="nav-link" onClick={goCourseHome}>Course home</button>}
          <button className="nav-link" onClick={goCourses}>Courses</button>
        </>}
        {onProgress && <button className="nav-link nav-link-learning" onClick={goProgress}>My Learning</button>}
        {adminHref && <a className="nav-link" href={adminHref}>Admin</a>}
        {userName && <><span className="user-name">{userName}</span><span className="avatar" aria-hidden="true">{initials}</span></>}
      </nav>

      <CourseSearch onCourse={onCourse} />

      <details className="mobile-nav" ref={mobileMenuRef}>
        <summary aria-label="Navigation menu" title="Navigation menu"><span className="mobile-nav-icon" aria-hidden="true" /></summary>
        <nav className="mobile-nav-panel" aria-label="Mobile learning platform navigation">
          {activeTitle && activeCourse && <div className="mobile-nav-user mobile-current-course"><CourseMark course={activeCourse} size="nav" /><span>{activeTitle}</span></div>}
          <div className="mobile-nav-section-label">Navigate</div>
          <button onClick={goHome}>Home</button>
          {homepageNavigation ? <>
            <div className="mobile-nav-divider" />
            <div className="mobile-nav-section-label">Your learning</div>
            <button onClick={() => scrollToSection('pathway', 'find-your-focus')}>My Pathway / Find Your Focus</button>
            <button onClick={() => scrollToSection('practice')}>My Practice</button>
            <button onClick={() => scrollToSection('favourites', 'find-your-focus')}>Saved Learning</button>
            <button onClick={() => scrollToSection('courses')}>Core Learning</button>
            <button onClick={() => scrollToSection('explore')}>Build Capacity</button>
            <button onClick={() => scrollToSection('record')}>My Learning / Capacity</button>
            <button onClick={goSearch}>Explore Learning / Search</button>
          </> : <>
            {onCourseHome && <button onClick={goCourseHome}>Course home</button>}
            <button onClick={goCourses}>All courses</button>
            <button onClick={goSearch}>Explore Learning / Search</button>
          </>}
          {!homepageNavigation && onProgress && <button onClick={goProgress}>My learning</button>}
          {adminHref && <a href={adminHref} onClick={closeMobileMenu}>Admin</a>}
          {userName && <div className="mobile-nav-user">Signed in as {userName}</div>}
        </nav>
      </details>
    </div>
  </header>;
}
