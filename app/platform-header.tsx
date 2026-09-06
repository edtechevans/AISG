'use client';

import { useRef } from 'react';
import { COURSE_BY_ID, type CourseId } from '@/lib/course-catalog';

export default function PlatformHeader({
  activeCourse,
  onPlatformHome,
  onCourse: _onCourse,
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

  const closeMobileMenu = () => mobileMenuRef.current?.removeAttribute('open');
  const goHome = () => { closeMobileMenu(); onPlatformHome(); };
  const goCourses = () => { closeMobileMenu(); (onCourses ?? onPlatformHome)(); };
  const goProgress = () => { closeMobileMenu(); onProgress?.(); };
  const goCourseHome = () => { closeMobileMenu(); onCourseHome?.(); };

  return <header className="app-header print:hidden">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="app-header-inner">
      <button className="brand-button" onClick={onPlatformHome} aria-label="AISG My Courses home">
        {/* oxlint-disable-next-line next/no-img-element -- relative asset supports Sites and the GitHub Pages base path. */}
        <img className="aisg-logo aisg-logo-header" src="aisg-logo.png" alt="" />
        <span className="brand-copy"><strong>AISG My Courses</strong><small>{context}</small></span>
      </button>

      {activeTitle && <div className="header-course-context" aria-label="Current course">
        <span>My Courses</span><span aria-hidden="true">/</span><strong>{activeTitle}</strong>
      </div>}

      <nav className="platform-nav platform-nav-desktop" aria-label="Learning platform navigation">
        <button className="nav-link" onClick={onPlatformHome}>Home</button>
        {onCourseHome && <button className="nav-link" onClick={onCourseHome}>Course home</button>}
        <button className="nav-link" onClick={onCourses ?? onPlatformHome}>Courses</button>
        {onProgress && <button className="nav-link nav-link-secondary" onClick={onProgress}>My learning</button>}
        {adminHref && <a className="nav-link" href={adminHref}>Admin</a>}
        {userName && <><span className="user-name">{userName}</span><span className="avatar" aria-hidden="true">{initials}</span></>}
      </nav>

      <details className="mobile-nav" ref={mobileMenuRef}>
        <summary aria-label="Open navigation menu"><span className="mobile-nav-icon" aria-hidden="true" /></summary>
        <nav className="mobile-nav-panel" aria-label="Mobile learning platform navigation">
          {activeTitle && <div className="mobile-nav-user">{activeTitle}</div>}
          <button onClick={goHome}>Home</button>
          {onCourseHome && <button onClick={goCourseHome}>Course home</button>}
          <button onClick={goCourses}>Courses</button>
          {onProgress && <button onClick={goProgress}>My learning</button>}
          {adminHref && <a href={adminHref} onClick={closeMobileMenu}>Admin</a>}
          {userName && <div className="mobile-nav-user">Signed in as {userName}</div>}
        </nav>
      </details>
    </div>
  </header>;
}
