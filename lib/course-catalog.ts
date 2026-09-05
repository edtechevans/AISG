export const COURSE_CATALOG = [
  { id: 'safeguarding', title: 'Safeguarding at AISG' },
  { id: 'ai', title: 'AI in Education' },
  { id: 'teams', title: 'Microsoft Teams for Communication' },
  { id: 'mtss', title: 'Multi-Tiered System of Supports (MTSS)' },
] as const;

export type CourseCatalogId = typeof COURSE_CATALOG[number]['id'];
