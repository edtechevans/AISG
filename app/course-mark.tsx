import type { CourseId } from '@/lib/course-catalog';

export const COURSE_MARK_COLORS: Record<CourseId, string> = {
  safeguarding: '#a91429',
  elementary: '#315f66',
  secondary: '#0b294b',
  teams: '#506178',
  ai: '#684f70',
  assessment: '#7a5f32',
  data: '#456b7a',
  udl: '#596d91',
  engagement: '#304f77',
  mtss: '#51645d',
  technology: '#3f6574',
  'growth-domain1': '#173d68',
  'growth-domain2': '#b51f32',
  'growth-domain3': '#9d2639',
  'growth-domain4': '#234d74',
};

type CourseMarkSize = 'nav' | 'card' | 'hero' | 'record' | 'certificate';
type CourseMarkTone = 'accent' | 'navy' | 'inverse';

const sizes: Record<CourseMarkSize, number> = {
  nav: 21,
  card: 42,
  hero: 56,
  record: 30,
  certificate: 28,
};

export default function CourseMark({
  course,
  size = 'card',
  tone = 'accent',
  className = '',
  label,
}: {
  course: CourseId;
  size?: CourseMarkSize;
  tone?: CourseMarkTone;
  className?: string;
  label?: string;
}) {
  const dimension = sizes[size];
  const color = tone === 'inverse' ? '#ffffff' : tone === 'navy' ? '#0b294b' : COURSE_MARK_COLORS[course];

  return <svg
    className={`course-mark course-mark-${size} ${className}`.trim()}
    viewBox="0 0 36 36"
    width={dimension}
    height={dimension}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ color }}
    aria-hidden={label ? undefined : true}
    role={label ? 'img' : undefined}
    focusable="false"
  >
    {label && <title>{label}</title>}
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <CourseMarkGlyph course={course} />
    </g>
  </svg>;
}

function CourseMarkGlyph({ course }: { course: CourseId }) {
  switch (course) {
    case 'safeguarding':
      return <>
        <path d="M18 4.5 29 8.7v8.1c0 7.2-4.3 12.1-11 14.7C11.3 28.9 7 24 7 16.8V8.7L18 4.5Z" />
        <path d="m12.8 18 3.2 3.1 7.3-7.6" />
      </>;

    case 'elementary':
      return <>
        <rect x="5" y="18" width="11" height="10" rx="2.2" />
        <rect x="20" y="18" width="11" height="10" rx="2.2" />
        <rect x="12.5" y="6" width="11" height="9" rx="2.2" />
      </>;

    case 'secondary':
      return <>
        <path d="M9 26.5 17.8 18 27.5 9.2" />
        <rect x="5.5" y="23" width="7" height="7" rx="2" fill="white" />
        <rect x="14.3" y="14.5" width="7" height="7" rx="2" fill="white" />
        <rect x="24" y="5.7" width="7" height="7" rx="2" fill="white" />
      </>;

    case 'teams':
      return <>
        <path d="M6.5 7.5h16a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H15l-5.2 4v-4H6.5a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4Z" />
        <path d="M13.5 24h12.2a3.8 3.8 0 0 0 3.8-3.8v-.7" />
        <path d="M11 12.5h11M11 16h7" />
      </>;

    case 'ai':
      return <>
        <path d="M8 26 18 8.5 29 26H8Z" opacity=".42" />
        <circle cx="8" cy="26" r="3" fill="currentColor" stroke="none" />
        <circle cx="18" cy="8.5" r="3" fill="currentColor" stroke="none" opacity=".72" />
        <circle cx="29" cy="26" r="3" fill="currentColor" stroke="none" opacity=".52" />
      </>;

    case 'assessment':
      return <>
        <path d="M28.2 12.3A11.5 11.5 0 0 0 9.5 8.5" />
        <path d="m9.8 5.7-.3 2.8 2.8.3" />
        <path d="M7.8 23.7a11.5 11.5 0 0 0 18.7 3.8" />
        <path d="m26.2 30.3.3-2.8-2.8-.3" />
        <circle cx="18" cy="18" r="4" />
        <circle cx="18" cy="18" r="1.4" fill="currentColor" stroke="none" />
      </>;

    case 'data':
      return <>
        <path d="M6 28V23M12.5 28V19M19 28V15M25.5 28V10" />
        <path d="M5.5 20.5 12 15l6 2.1 9-8.6" />
        <circle cx="27" cy="8.5" r="2.2" fill="currentColor" stroke="none" />
      </>;

    case 'udl':
      return <>
        <circle cx="5.5" cy="18" r="2.4" fill="currentColor" stroke="none" />
        <path d="M8 18c6 0 5.8-9 12-9 4.6 0 5.3 4.9 8.2 7" />
        <path d="M8 18h20" />
        <path d="M8 18c6 0 5.8 9 12 9 4.6 0 5.3-4.9 8.2-7" />
        <circle cx="30.5" cy="18" r="3.2" />
      </>;

    case 'engagement':
      return <>
        <path d="M8 11v14M18 11v14M28 11v14M8 18h20" opacity=".34" />
        <circle cx="8" cy="11" r="2.5" fill="currentColor" stroke="none" opacity=".42" />
        <circle cx="8" cy="25" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="18" cy="11" r="2.5" fill="currentColor" stroke="none" opacity=".62" />
        <circle cx="18" cy="25" r="2.5" fill="currentColor" stroke="none" />
        <circle cx="28" cy="11" r="2.5" fill="currentColor" stroke="none" opacity=".82" />
        <circle cx="28" cy="25" r="2.5" fill="currentColor" stroke="none" />
      </>;

    case 'mtss':
      return <>
        <path d="M25.8 8.7A12.2 12.2 0 1 1 9.2 10" />
        <path d="m9.1 6.8.1 3.2 3.1-.3" />
        <circle cx="18" cy="18" r="4" />
        <circle cx="18" cy="5.8" r="2" fill="currentColor" stroke="none" opacity=".45" />
        <circle cx="29.4" cy="21.6" r="2.4" fill="currentColor" stroke="none" opacity=".72" />
        <circle cx="9.1" cy="27.1" r="2.8" fill="currentColor" stroke="none" />
      </>;

    case 'technology':
      return <>
        <circle cx="6.5" cy="18" r="2.8" fill="currentColor" stroke="none" />
        <path d="M12 13.3a7 7 0 0 1 0 9.4" />
        <path d="M16 9.2a12 12 0 0 1 0 17.6" opacity=".7" />
        <path d="M20.2 5.4a17 17 0 0 1 0 25.2" opacity=".4" />
      </>;

    case 'growth-domain1':
      return <>
        <circle cx="29.5" cy="18" r="4.2" />
        <circle cx="29.5" cy="18" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="5.5" cy="10.5" r="2.2" fill="currentColor" stroke="none" opacity=".55" />
        <circle cx="5.5" cy="25.5" r="2.2" fill="currentColor" stroke="none" />
        <path d="M8 10.5c7.5 0 7.5 7.5 17 7.5M8 25.5c7.5 0 7.5-7.5 17-7.5" />
      </>;

    case 'growth-domain2':
      return <>
        <circle cx="18" cy="18" r="4.4" />
        <path d="M11.5 13.4 15 16M24.5 13.4 21 16M18 25v-2.5" opacity=".55" />
        <circle cx="9.5" cy="11.5" r="3" fill="currentColor" stroke="none" opacity=".5" />
        <circle cx="26.5" cy="11.5" r="3" fill="currentColor" stroke="none" opacity=".72" />
        <circle cx="18" cy="28" r="3" fill="currentColor" stroke="none" />
      </>;

    case 'growth-domain3':
      return <>
        <path d="M9 7.5v4M9 24.5v4M2.5 18H7M11 18h17" />
        <path d="m25 14.5 4 3.5-4 3.5" />
        <path d="m4.5 12 2.8 2.8M4.5 24l2.8-2.8M13.5 12l-2.8 2.8M13.5 24l-2.8-2.8" opacity=".7" />
        <circle cx="9" cy="18" r="3.1" />
      </>;

    case 'growth-domain4':
      return <>
        <circle cx="10.5" cy="18" r="6" opacity=".5" />
        <circle cx="18" cy="18" r="7.2" opacity=".72" />
        <circle cx="25.5" cy="18" r="8.4" />
        <path d="M29 28.5h4M31 26.5l2 2-2 2" />
      </>;
  }
}