import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TrainingApp from '../../app/training-app';
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
import './safeguarding-review.css';
import { installStaticApi } from './static-api';

if (typeof window !== 'undefined') {
  installStaticApi();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="safeguarding-review-site">
        <aside className="review-notice" role="status">
          <strong>Safeguarding Team Review · Draft</strong>
          <span>Check policy accuracy, scenarios, wording and assessment feedback. This version is not approved for staff training. Do not enter real student information.</span>
        </aside>
        <TrainingApp staticMode />
      </div>
    </StrictMode>,
  );
}
