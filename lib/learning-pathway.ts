import { isCourseId, type CourseId } from '@/lib/course-catalog';

export const FOCUS_STORAGE_KEY = 'my-courses-find-your-focus-v1';
export const PATHWAY_STORAGE_KEY = 'my-courses-learning-pathway-v1';

export type FocusResult = {
  answers: Record<string, string>;
  recommendations: CourseId[];
  completedAt: number;
};

export type LearningPathway = {
  courseIds: CourseId[];
  sourceFocusCompletedAt: number;
  updatedAt: number;
};

function cleanCourseIds(value: unknown): CourseId[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is CourseId => typeof item === 'string' && isCourseId(item)))];
}

export function readFocusResult(): FocusResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(FOCUS_STORAGE_KEY) || 'null') as Partial<FocusResult> | null;
    if (!parsed || !Number.isFinite(parsed.completedAt)) return null;
    const recommendations = cleanCourseIds(parsed.recommendations);
    if (recommendations.length === 0) return null;
    return {
      answers: parsed.answers && typeof parsed.answers === 'object' && !Array.isArray(parsed.answers) ? parsed.answers : {},
      recommendations,
      completedAt: Number(parsed.completedAt),
    };
  } catch {
    return null;
  }
}

export function writeFocusResult(result: FocusResult) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // The reflection remains usable in the current session when browser storage is unavailable.
  }
}

export function readLearningPathway(): LearningPathway | null {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(PATHWAY_STORAGE_KEY) || 'null') as Partial<LearningPathway> | null;
    if (!parsed || !Number.isFinite(parsed.sourceFocusCompletedAt) || !Array.isArray(parsed.courseIds)) return null;
    return {
      courseIds: cleanCourseIds(parsed.courseIds),
      sourceFocusCompletedAt: Number(parsed.sourceFocusCompletedAt),
      updatedAt: Number.isFinite(parsed.updatedAt) ? Number(parsed.updatedAt) : Date.now(),
    };
  } catch {
    return null;
  }
}

export function writeLearningPathway(courseIds: CourseId[], sourceFocusCompletedAt: number): LearningPathway {
  const pathway: LearningPathway = {
    courseIds: cleanCourseIds(courseIds),
    sourceFocusCompletedAt,
    updatedAt: Date.now(),
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PATHWAY_STORAGE_KEY, JSON.stringify(pathway));
    } catch {
      // Keep the current session experience working if persistent storage is unavailable.
    }
  }
  return pathway;
}

export function pathwayFromFocus(focus: FocusResult): LearningPathway {
  return writeLearningPathway(focus.recommendations, focus.completedAt);
}

export function syncPathwayWithFocus(focus: FocusResult | null): LearningPathway | null {
  if (!focus) return null;
  const saved = readLearningPathway();
  if (!saved || saved.sourceFocusCompletedAt !== focus.completedAt) return pathwayFromFocus(focus);
  return saved;
}
