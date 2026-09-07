import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MyCoursesApp from '../../app/my-courses';
import LearningCompanion from '../../app/learning-companion';
import '../../app/globals.css';
import '../../app/premium.css';
import '../../app/visual-polish.css';
import '../../app/flat-learning.css';
import '../../app/favourites.css';
import '../../app/course-marks.css';
import '../../app/home-hero.css';
import '../../app/learning-companion.css';
import '../../app/modern-nav.css';
import '../../app/learning-system.css';
import { installStaticApi } from './static-api';

if (typeof window !== 'undefined') {
  installStaticApi();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MyCoursesApp staticMode />
      <LearningCompanion />
    </StrictMode>,
  );
}
