export const COURSE_CATALOG = [
  { id: 'safeguarding', title: 'Safeguarding at AISG' },
  { id: 'engagement', title: 'Engagement for All: The AISG Learning Framework' },
  { id: 'mtss', title: 'Multi-Tiered System of Supports (MTSS)' },
  { id: 'ai', title: 'AI in Education' },
  { id: 'teams', title: 'Microsoft Teams for Communication' },
] as const;

export type CourseCatalogId = typeof COURSE_CATALOG[number]['id'];
