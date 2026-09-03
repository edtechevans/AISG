import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TrainingApp from '../../app/training-app';
import '../../app/globals.css';
import { installStaticApi } from './static-api';

installStaticApi();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TrainingApp staticMode />
  </StrictMode>,
);
