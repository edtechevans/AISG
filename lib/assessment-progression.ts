export type CourseAssessmentId = 'safeguarding' | 'engagement' | 'ai' | 'teams' | 'mtss';
export type CognitiveLevel = 2 | 3 | 4 | 5;

// This authoring map is intentionally not shown to learners. It makes the intended
// progression reviewable as courses grow, while keeping question wording clear.
export const assessmentProgression: Record<CourseAssessmentId, Record<string, CognitiveLevel>> = {
  safeguarding: {
    'aisg-sg-2627-001': 2, 'aisg-sg-2627-002': 2, 'aisg-sg-2627-003': 2, 'aisg-sg-2627-004': 3, 'aisg-sg-2627-005': 2,
    'aisg-sg-2627-006': 2, 'aisg-sg-2627-007': 3, 'aisg-sg-2627-008': 3, 'aisg-sg-2627-009': 3, 'aisg-sg-2627-010': 3,
    'aisg-sg-2627-011': 2, 'aisg-sg-2627-012': 2, 'aisg-sg-2627-013': 2, 'aisg-sg-2627-014': 3, 'aisg-sg-2627-015': 3,
    'aisg-sg-2627-016': 3, 'aisg-sg-2627-017': 4, 'aisg-sg-2627-018': 3, 'aisg-sg-2627-019': 4, 'aisg-sg-2627-020': 4,
    'aisg-sg-2627-021': 3, 'aisg-sg-2627-022': 3, 'aisg-sg-2627-023': 3, 'aisg-sg-2627-024': 4, 'aisg-sg-2627-025': 4,
    'aisg-sg-2627-026': 3, 'aisg-sg-2627-027': 3, 'aisg-sg-2627-028': 3, 'aisg-sg-2627-029': 3, 'aisg-sg-2627-030': 5,
  },
  engagement: { 'tlf-1': 2, 'tlf-2': 2, 'tlf-3': 3, 'tlf-4': 3, 'tlf-5': 3, 'tlf-6': 3, 'tlf-7': 4, 'tlf-8': 4, 'tlf-9': 4, 'tlf-10': 5 },
  ai: { 'ai-1': 2, 'ai-2': 2, 'ai-3': 2, 'ai-4': 3, 'ai-5': 3, 'ai-6': 3, 'ai-7': 4, 'ai-8': 4, 'ai-9': 4, 'ai-10': 5 },
  teams: { 'teams-1': 2, 'teams-2': 2, 'teams-3': 2, 'teams-4': 2, 'teams-5': 3, 'teams-6': 3, 'teams-7': 3, 'teams-8': 3, 'teams-9': 4, 'teams-10': 5 },
  mtss: { 'mtss-1': 2, 'mtss-2': 2, 'mtss-3': 2, 'mtss-4': 3, 'mtss-5': 3, 'mtss-6': 3, 'mtss-7': 3, 'mtss-8': 3, 'mtss-9': 4, 'mtss-10': 4, 'mtss-11': 4, 'mtss-12': 4, 'mtss-13': 4, 'mtss-14': 4, 'mtss-15': 5, 'mtss-16': 5 },
};

export function cognitiveLevelFor(course: CourseAssessmentId, questionId: string) {
  return assessmentProgression[course][questionId] ?? 2;
}
