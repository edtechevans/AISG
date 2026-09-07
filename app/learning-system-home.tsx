'use client';

import MyLearningPathway from '@/app/my-learning-pathway';
import MyPractice from '@/app/my-practice';
import ProfessionalCapacityMap from '@/app/professional-capacity-map';
import type { CourseId } from '@/lib/course-catalog';

type LearningSystemCourse = {
  id: CourseId;
  status: 'Completed' | 'In Progress' | 'Not Started';
  progress: number;
};

export default function LearningSystemHome({ courses, favourites, completionMeta, pathwayIds, onToggleFavourite, onOpenCourse }: {
  courses: LearningSystemCourse[];
  favourites: CourseId[];
  completionMeta: Partial<Record<CourseId, string>>;
  pathwayIds: CourseId[];
  onToggleFavourite: (course: CourseId) => void;
  onOpenCourse: (course: CourseId) => void;
}) {
  return <>
    <MyLearningPathway courses={courses} favourites={favourites} onToggleFavourite={onToggleFavourite} onOpenCourse={onOpenCourse} />
    <MyPractice onOpenCourse={onOpenCourse} />
    <ProfessionalCapacityMap courses={courses} completionMeta={completionMeta} pathwayIds={pathwayIds} onOpenCourse={onOpenCourse} />
  </>;
}
