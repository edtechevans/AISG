'use client';

import MyLearningPathway from '@/app/my-learning-pathway';
import type { CourseId } from '@/lib/course-catalog';

type LearningSystemCourse = {
  id: CourseId;
  status: 'Completed' | 'In Progress' | 'Not Started';
  progress: number;
};

export default function LearningSystemHome({ courses, favourites, onToggleFavourite, onOpenCourse }: {
  courses: LearningSystemCourse[];
  favourites: CourseId[];
  onToggleFavourite: (course: CourseId) => void;
  onOpenCourse: (course: CourseId) => void;
}) {
  return <MyLearningPathway courses={courses} favourites={favourites} onToggleFavourite={onToggleFavourite} onOpenCourse={onOpenCourse} />;
}
