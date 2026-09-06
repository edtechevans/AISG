import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MyCoursesApp from '../../app/my-courses';
import '../../app/globals.css';
import '../../app/premium.css';
import '../../app/visual-polish.css';
import '../../app/flat-learning.css';
import '../../app/udl-course.css';
import '../../app/data-course.css';
import { installStaticApi } from './static-api';

if (typeof window !== 'undefined') {
  installStaticApi();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MyCoursesApp staticMode />
    </StrictMode>,
  );
}
