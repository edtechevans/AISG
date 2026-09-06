export type CourseId = 'elementary' | 'secondary' | 'teams' | 'safeguarding' | 'engagement' | 'mtss' | 'ai';

export type CourseCatalogItem = {
  id: CourseId;
  title: string;
  description: string;
  intro?: string;
  category: string;
  designation: 'Required' | 'Foundation' | 'Recommended';
  audience?: string;
  duration: string;
  sectionCount: number;
  checkCount: number;
  storageKey?: string;
};

export const COURSE_CATALOG: readonly CourseCatalogItem[] = [
  { id: 'elementary', title: 'Elementary Faculty Essentials', description: 'A practical guide to the expectations, routines and shared responsibilities that shape Elementary at AISG.', intro: 'Elementary at AISG is shaped by shared approaches to learning, relationships, assessment, student support and community life. Work through this course over one or more sittings; your progress is saved so you can return to the same place.', category: 'Elementary School', designation: 'Required', audience: 'Elementary Faculty', duration: '90–120 minutes', sectionCount: 10, checkCount: 50, storageKey: 'my-courses-elementary-faculty-progress-sy2627-v2' },
  { id: 'secondary', title: 'Secondary Faculty Essentials', description: 'A comprehensive guide to the expectations, routines, professional practices and shared responsibilities that shape Secondary at AISG.', intro: 'Secondary at AISG is shaped by more than schedules, courses and procedures. Our shared approach to learning, assessment, student support, professional growth, communication and community life creates a coherent experience across Grades 6–12. Complete this course over one or more sittings; your progress is saved so you can return to the same place.', category: 'Secondary School', designation: 'Required', audience: 'Secondary Faculty', duration: '90–120 minutes', sectionCount: 10, checkCount: 50, storageKey: 'my-courses-secondary-faculty-progress-sy2627-v2' },
  {
    id: 'teams',
    title: 'Employee Communication Guidelines',
    description: 'Practical guidance for purposeful, professional and responsible communication at AISG.',
    intro: 'Good communication helps us share information, identify patterns, coordinate support and make better decisions. The challenge is not whether we communicate. It is how we communicate well. Throughout this course, you will consider the purpose, audience, information, evidence, language and confidentiality behind everyday professional communication at AISG. This course is about professional judgement, not simply memorising rules.',
    category: 'Professional Practice', designation: 'Required', duration: '30–40 minutes', sectionCount: 6, checkCount: 14, storageKey: 'my-courses-communication-progress-v2',
  },
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
];

export const COURSE_BY_ID = Object.fromEntries(
  COURSE_CATALOG.map((course) => [course.id, course]),
) as Record<CourseId, CourseCatalogItem>;

export function isCourseId(value: string): value is CourseId {
  return COURSE_CATALOG.some((course) => course.id === value);
}

export type CourseCatalogId = CourseId;
