'use client';

import { type ChangeEvent } from 'react';
import { COURSE_CATALOG, type CourseId } from '@/lib/course-catalog';

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
  const initials = userName
    ? userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : '';

  function chooseCourse(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    if (value) onCourse(value as CourseId);
  }

  return <header className="app-header print:hidden">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="app-header-inner">
      <button className="brand-button" onClick={onPlatformHome} aria-label="AISG My Courses home">
        {/* oxlint-disable-next-line next/no-img-element -- relative asset supports Sites and the GitHub Pages base path. */}
        <img className="aisg-logo aisg-logo-header" src="aisg-logo.png" alt="" />
        <span className="brand-copy"><strong>AISG My Courses</strong><small>{context}</small></span>
      </button>
      <nav className="platform-nav" aria-label="Learning platform navigation">
        {onCourseHome && <button className="nav-link" onClick={onCourseHome}>Course home</button>}
        <button className="nav-link" onClick={onCourses ?? onPlatformHome}>Courses</button>
        {onProgress && <button className="nav-link nav-link-secondary" onClick={onProgress}>My progress</button>}
        <label className="course-switcher">
          <span>Switch course</span>
          <select aria-label="Switch course" value={activeCourse ?? ''} onChange={chooseCourse}>
            <option value="" disabled>Select a course</option>
            {COURSE_CATALOG.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
        </label>
        {adminHref && <a className="nav-link" href={adminHref}>Admin workspace</a>}
        {userName && <><span className="user-name">{userName}</span><span className="avatar" aria-hidden="true">{initials}</span></>}
      </nav>
    </div>
  </header>;
}
