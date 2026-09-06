export type CourseAssessmentId = 'safeguarding' | 'engagement' | 'udl' | 'data' | 'assessment' | 'growth-domain1' | 'growth-domain2' | 'ai' | 'technology' | 'teams' | 'mtss' | 'elementary' | 'secondary';
export type CognitiveLevel = 2 | 3 | 4 | 5;

// This authoring map is intentionally not shown to learners. It makes the intended
// progression reviewable as courses grow, while keeping question wording clear.
export const assessmentProgression: Record<CourseAssessmentId, Record<string, CognitiveLevel>> = {
  elementary: Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`elementary-${i + 1}`, i % 5 === 4 ? 5 : i % 5 >= 2 ? 4 : 2])) as Record<string, CognitiveLevel>,
  secondary: Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`secondary-${i + 1}`, i % 5 === 4 ? 5 : i % 5 >= 2 ? 4 : 2])) as Record<string, CognitiveLevel>,
  safeguarding: {
    'aisg-sg-2627-001': 2, 'aisg-sg-2627-002': 2, 'aisg-sg-2627-003': 2, 'aisg-sg-2627-004': 3, 'aisg-sg-2627-005': 2,
    'aisg-sg-2627-006': 2, 'aisg-sg-2627-007': 3, 'aisg-sg-2627-008': 3, 'aisg-sg-2627-009': 3, 'aisg-sg-2627-010': 3,
    'aisg-sg-2627-011': 2, 'aisg-sg-2627-012': 2, 'aisg-sg-2627-013': 2, 'aisg-sg-2627-014': 3, 'aisg-sg-2627-015': 3,
    'aisg-sg-2627-016': 3, 'aisg-sg-2627-017': 4, 'aisg-sg-2627-018': 3, 'aisg-sg-2627-019': 4, 'aisg-sg-2627-020': 4,
    'aisg-sg-2627-021': 3, 'aisg-sg-2627-022': 3, 'aisg-sg-2627-023': 3, 'aisg-sg-2627-024': 4, 'aisg-sg-2627-025': 4,
    'aisg-sg-2627-026': 3, 'aisg-sg-2627-027': 3, 'aisg-sg-2627-028': 3, 'aisg-sg-2627-029': 3, 'aisg-sg-2627-030': 5,
  },
  engagement: { 'tlf-1': 2, 'tlf-2': 2, 'tlf-3': 3, 'tlf-4': 3, 'tlf-5': 3, 'tlf-6': 3, 'tlf-7': 4, 'tlf-8': 4, 'tlf-9': 4, 'tlf-10': 5 },
  udl: {
    'udl-1': 2, 'udl-2': 2,
    'udl-3': 2, 'udl-4': 3,
    'udl-5': 3, 'udl-6': 3,
    'udl-7': 3, 'udl-8': 3,
    'udl-9': 3, 'udl-10': 4,
    'udl-11': 4, 'udl-12': 4,
    'udl-13': 4, 'udl-14': 4, 'udl-15': 4,
    'udl-16': 4, 'udl-17': 5, 'udl-18': 5,
  },
  data: {
    'data-1': 2, 'data-2': 2,
    'data-3': 3, 'data-4': 3,
    'data-5': 3, 'data-6': 4,
    'data-7': 4, 'data-8': 4,
    'data-9': 5, 'data-10': 5,
  },
  assessment: {
    'afl-1': 2, 'afl-2': 2,
    'afl-3': 2, 'afl-4': 3,
    'afl-5': 3, 'afl-6': 3, 'afl-7': 3,
    'afl-8': 3, 'afl-9': 4,
    'afl-10': 4, 'afl-11': 4, 'afl-12': 5,
  },
  'growth-domain1': {
    'growth-d1-1': 2, 'growth-d1-2': 2,
    'growth-d1-3': 2, 'growth-d1-4': 3,
    'growth-d1-5': 3, 'growth-d1-6': 4,
    'growth-d1-7': 3, 'growth-d1-8': 4,
    'growth-d1-9': 3, 'growth-d1-10': 3, 'growth-d1-11': 4, 'growth-d1-12': 5,
  },
  'growth-domain2': {
    'growth-d2-1': 2, 'growth-d2-2': 2,
    'growth-d2-3': 2, 'growth-d2-4': 4,
    'growth-d2-5': 3, 'growth-d2-6': 4,
    'growth-d2-7': 3, 'growth-d2-8': 4,
    'growth-d2-9': 3, 'growth-d2-10': 3, 'growth-d2-11': 4, 'growth-d2-12': 5,
  },
  ai: {
    'ai-1': 2, 'ai-2': 2,
    'ai-3': 2, 'ai-4': 3,
    'ai-5': 3, 'ai-6': 3,
    'ai-7': 3, 'ai-8': 4,
    'ai-9': 4, 'ai-10': 4,
    'ai-11': 4, 'ai-12': 4, 'ai-13': 4,
    'ai-14': 4, 'ai-15': 5, 'ai-16': 5,
  },
  technology: {
    'tech-tlf-1': 2, 'tech-tlf-2': 2, 'tech-tlf-3': 3,
    'tech-tlf-4': 2, 'tech-tlf-5': 3, 'tech-tlf-6': 4,
    'tech-tlf-7': 2, 'tech-tlf-8': 3, 'tech-tlf-9': 4,
    'tech-tlf-10': 3, 'tech-tlf-11': 3, 'tech-tlf-12': 4,
    'tech-tlf-13': 3, 'tech-tlf-14': 4, 'tech-tlf-15': 4,
    'tech-tlf-16': 3, 'tech-tlf-17': 4, 'tech-tlf-18': 5,
  },
  teams: { 'communication-1': 2, 'communication-2': 2, 'communication-3': 3, 'communication-4': 3, 'communication-5': 4, 'communication-6': 4, 'communication-7': 3, 'communication-8': 4, 'communication-9': 4, 'communication-10': 4, 'communication-11': 4, 'communication-12': 4, 'communication-13': 4, 'communication-14': 5 },
  mtss: { 'mtss-1': 2, 'mtss-2': 2, 'mtss-3': 2, 'mtss-4': 3, 'mtss-5': 3, 'mtss-6': 3, 'mtss-7': 3, 'mtss-8': 3, 'mtss-9': 4, 'mtss-10': 4, 'mtss-11': 4, 'mtss-12': 4, 'mtss-13': 4, 'mtss-14': 4, 'mtss-15': 5, 'mtss-16': 5 },
};

export function cognitiveLevelFor(course: CourseAssessmentId, questionId: string) {
  return assessmentProgression[course][questionId] ?? 2;
}
