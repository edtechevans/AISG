export type CourseId = 'safeguarding' | 'engagement' | 'mtss' | 'ai' | 'teams';

export type CourseCatalogItem = {
  id: CourseId;
  title: string;
  description: string;
  category: string;
  designation: 'Required' | 'Foundation' | 'Recommended';
  duration: string;
  sectionCount: number;
  checkCount: number;
  storageKey?: string;
};

export const COURSE_CATALOG: readonly CourseCatalogItem[] = [
  {
    id: 'safeguarding',
    title: 'Safeguarding at AISG',
    description: 'Essential knowledge, responsibilities and professional judgement to help keep students safe at AISG.',
    category: 'Student Safety & Wellbeing',
    designation: 'Required',
    duration: '35–45 minutes',
    sectionCount: 6,
    checkCount: 30,
  },
  {
    id: 'engagement',
    title: 'Engagement for All: The AISG Learning Framework',
    description: 'A practical gateway to AISG’s shared language for designing, noticing and improving learning experiences.',
    category: 'AISG Learning Framework',
    designation: 'Foundation',
    duration: '20–25 minutes',
    sectionCount: 5,
    checkCount: 10,
    storageKey: 'my-courses-engagement-progress-v1',
  },
  {
    id: 'mtss',
    title: 'Multi-Tiered System of Supports (MTSS)',
    description: 'A systems-focused course on proactive support, evidence-informed decisions and continuous improvement.',
    category: 'Instructional Practice',
    designation: 'Recommended',
    duration: '45–60 minutes',
    sectionCount: 8,
    checkCount: 16,
    storageKey: 'my-courses-mtss-progress-v1',
  },
  {
    id: 'ai',
    title: 'AI in Education',
    description: 'Practical guidance for using AI responsibly, thoughtfully and effectively as an educator.',
    category: 'Digital Practice',
    designation: 'Recommended',
    duration: '20–30 minutes',
    sectionCount: 5,
    checkCount: 10,
    storageKey: 'my-courses-ai-progress-v1',
  },
  {
    id: 'teams',
    title: 'Microsoft Teams for Communication',
    description: 'Practical guidance for clear, purposeful and professional internal communication at AISG.',
    category: 'Professional Practice',
    designation: 'Recommended',
    duration: '15–20 minutes',
    sectionCount: 5,
    checkCount: 10,
    storageKey: 'my-courses-teams-progress-v1',
  },
];

export const COURSE_BY_ID = Object.fromEntries(
  COURSE_CATALOG.map((course) => [course.id, course]),
) as Record<CourseId, CourseCatalogItem>;

export function isCourseId(value: string): value is CourseId {
  return COURSE_CATALOG.some((course) => course.id === value);
}

export type CourseCatalogId = CourseId;
