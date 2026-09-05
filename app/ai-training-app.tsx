'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { aiQuestions, aiSections, AI_COURSE_VERSION } from '@/lib/ai-course';
import { teamsQuestions, teamsSections, TEAMS_COURSE_VERSION } from '@/lib/teams-course';
import { mtssQuestions, mtssSections, MTSS_COURSE_VERSION } from '@/lib/mtss-course';

type CourseProgress = {
  position: number;
  completedSections: string[];
  responses: Record<string, { answer: string; correct: boolean }>;
  completedAt?: number;
  practice?: string;
  commitment?: string;
};

type LearningStage = 'course-home' | 'learn' | 'question' | 'practice' | 'complete';
type CourseKey = 'ai' | 'teams' | 'mtss';

const emptyProgress: CourseProgress = { position: 0, completedSections: [], responses: {} };

const courses = {
  ai: {
    storageKey: 'my-courses-ai-progress-v1',
    title: 'AI in Education',
    description: 'Practical guidance for using AI responsibly, thoughtfully and effectively as an educator.',
    version: AI_COURSE_VERSION,
    sections: aiSections,
    questions: aiQuestions,
    practiceOptions: [
      'Be more deliberate about what student information I share with AI.',
      'Keep the human in the loop when using AI for feedback.',
      'Verify AI-generated information before using it.',
      'Consider bias and representation more carefully.',
      'Redesign an assessment to make student thinking more visible.',
      'Something else',
    ],
  },
  teams: {
    storageKey: 'my-courses-teams-progress-v1',
    title: 'Microsoft Teams for Communication',
    description: 'Practical guidance for clear, purposeful and professional internal communication at AISG.',
    version: TEAMS_COURSE_VERSION,
    sections: teamsSections,
    questions: teamsQuestions,
    practiceOptions: [
      'Choose the right audience for student communication.',
      'Share only necessary support information.',
      'Describe observations rather than labels.',
      'Keep confidential records out of Teams.',
      'Write as though messages may be reviewed.',
      'Something else',
    ],
  },
  mtss: {
    storageKey: 'my-courses-mtss-progress-v1',
    title: 'Multi-Tiered System of Supports (MTSS)',
    description: 'A systems-focused course on proactive support, evidence-informed decisions and continuous improvement.',
    version: MTSS_COURSE_VERSION,
    sections: mtssSections,
    questions: mtssQuestions,
    practiceOptions: [
      'Use the complete MTSS decision cycle.',
      'Bring multiple evidence sources to decisions.',
      'Check Tier 1 before intensifying support.',
      'Set measurable goals and decision rules.',
      'Monitor fidelity and equity.',
      'Invite learner and family perspectives.',
      'Something else',
    ],
  },
} as const;

function readProgress(storageKey: string): CourseProgress {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    return saved && typeof saved === 'object' ? { ...emptyProgress, ...saved } : emptyProgress;
  } catch {
    return emptyProgress;
  }
}

function saveProgress(storageKey: string, progress: CourseProgress) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // The course remains usable if browser storage is unavailable.
  }
}

export default function AiTrainingApp({ onExit, course = 'ai' }: { onExit: () => void; course?: CourseKey }) {
  const config = courses[course];
  const initialProgress = readProgress(config.storageKey);
  const initialQuestion = Math.min(config.questions.length - 1, initialProgress.position);
  const [progress, setProgress] = useState<CourseProgress>(initialProgress);
  const [stage, setStage] = useState<LearningStage>(initialProgress.completedAt ? 'complete' : 'course-home');
  const [questionIndex, setQuestionIndex] = useState(initialQuestion);
  const [sectionIndex, setSectionIndex] = useState(Math.min(config.sections.length - 1, Math.floor(initialQuestion / 2)));
  const [learnPage, setLearnPage] = useState(0);
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [practice, setPractice] = useState(initialProgress.practice || '');
  const [commitment, setCommitment] = useState(initialProgress.commitment || '');

  const section = config.sections[sectionIndex];
  const question = config.questions[questionIndex];
  const answered = useMemo(() => progress.responses[question.id], [progress.responses, question.id]);
  const completedChecks = Object.keys(progress.responses).length;
  const totalSteps = config.questions.length + config.sections.length;
  const completionPercent = Math.round((completedChecks + progress.completedSections.length) / totalSteps * 100);
  const hasProgress = completedChecks > 0 || progress.completedSections.length > 0;

  useEffect(() => {
    document.title = `${config.title} | My Courses`;
  }, [config.title]);

  function updateProgress(next: CourseProgress) {
    setProgress(next);
    saveProgress(config.storageKey, next);
  }

  function startOrResume() {
    setLearnPage(0);
    setSelected('');
    setFeedback(null);
    setIsCorrect(null);
    setStage(progress.completedSections.includes(section.id) ? 'question' : 'learn');
  }

  function continueLearning() {
    if (learnPage < section.learn.length - 1) {
      setLearnPage((page) => page + 1);
      return;
    }
    const completedSections = progress.completedSections.includes(section.id)
      ? progress.completedSections
      : [...progress.completedSections, section.id];
    updateProgress({ ...progress, completedSections, position: Math.max(progress.position, questionIndex) });
    setStage('question');
  }

  function submitResponse() {
    if (!selected || answered) return;
    const correct = selected === question.answer;
    updateProgress({
      ...progress,
      responses: { ...progress.responses, [question.id]: { answer: selected, correct } },
      position: Math.max(progress.position, questionIndex + 1),
    });
    setIsCorrect(correct);
    setFeedback(correct ? question.correctFeedback : question.incorrectFeedback);
  }

  function continueAfterFeedback() {
    if (questionIndex === config.questions.length - 1) {
      setStage('practice');
      return;
    }
    const nextQuestion = questionIndex + 1;
    const nextSection = Math.floor(nextQuestion / 2);
    setQuestionIndex(nextQuestion);
    setSelected('');
    setFeedback(null);
    setIsCorrect(null);
    if (nextSection !== sectionIndex) {
      setSectionIndex(nextSection);
      setLearnPage(0);
      setStage('learn');
    }
  }

  function completeCourse() {
    updateProgress({ ...progress, practice, commitment, completedAt: Date.now() });
    setStage('complete');
  }

  if (stage === 'complete') {
    return <main className="learning-shell"><section className="results-card">
      <p className="tiny-eyebrow">My Courses · {config.title}</p><h1>Course complete</h1>
      <p className="results-lead">You completed the learning and applied the principles to realistic professional decisions.</p>
      <div className="score-grid"><div><span>Score</span><strong>{Object.values(progress.responses).filter((response) => response.correct).length}/{config.questions.length}</strong></div><div><span>Version</span><strong>{config.version}</strong></div><div><span>Status</span><strong>Completed</strong></div></div>
      <div className="principle-card"><CheckCircle2 aria-hidden="true" /><div><strong>Take it into practice</strong><p>{practice || 'No practice idea selected.'}</p>{commitment && <p className="mt-2"><strong>My commitment:</strong> {commitment}</p>}</div></div>
      <Button className="primary-pill mt-8" size="lg" onClick={onExit}><ArrowLeft /> Back to My Courses</Button>
    </section></main>;
  }

  if (stage === 'course-home') {
    const nextLabel = hasProgress ? 'Continue learning' : 'Start course';
    return <main className="learning-shell"><section className="intro-card course-home-card">
      <p className="tiny-eyebrow">Course home</p><h1>{config.title}</h1><p className="intro-summary">{config.description}</p>
      <div className="course-home-progress"><Progress value={completionPercent} aria-label={`${config.title}: ${completionPercent}% complete`} /><span>{completionPercent}% complete · {completedChecks} of {config.questions.length} checks completed</span></div>
      <div className="course-home-sections" aria-label="Course sections">{config.sections.map((item) => <div key={item.id}><span className={progress.completedSections.includes(item.id) ? 'section-complete-dot' : 'section-pending-dot'}>{progress.completedSections.includes(item.id) ? '✓' : item.number}</span><span>{item.title}</span></div>)}</div>
      <div className="mt-8 flex flex-wrap gap-3"><Button className="primary-pill" size="lg" onClick={startOrResume}>{nextLabel} <ArrowRight /></Button><Button variant="outline" onClick={onExit}><ArrowLeft /> All courses</Button></div>
    </section></main>;
  }

  if (stage === 'practice') {
    return <main className="learning-shell"><section className="intro-card"><p className="tiny-eyebrow">Apply · Take it into practice</p><h1>What is one practice from this course that you want to strengthen?</h1>
      <div className="answers practice-options">{config.practiceOptions.map((option) => <label key={option} className={`answer-option ${practice === option ? 'answer-selected' : ''}`}><input type="radio" name="practice" checked={practice === option} onChange={() => setPractice(option)} /><span>{option}</span></label>)}</div>
      {practice && <label className="mt-6 block"><span className="meta-label">My commitment (optional)</span><textarea className="mt-2 w-full rounded-xl border border-navy/15 p-3" value={commitment} onChange={(event) => setCommitment(event.target.value)} placeholder="What is one thing you could try?" rows={3} /></label>}
      <Button className="primary-pill mt-8" size="lg" disabled={!practice} onClick={completeCourse}>Save and complete <ArrowRight /></Button>
    </section></main>;
  }

  if (stage === 'learn') {
    const lastPage = learnPage === section.learn.length - 1;
    return <main className="learning-shell"><div className="learning-top"><Button variant="ghost" onClick={() => setStage('course-home')}><ArrowLeft /> Course home</Button><span className="section-position">Section {section.number} of {config.sections.length}</span></div>
      <div className="dual-progress"><Progress value={completionPercent} aria-label={`Overall course: ${completionPercent}%`} /><span className="text-sm text-muted-foreground">{completionPercent}% overall</span></div>
      <section className="intro-card lesson-card"><div className="module-orbit">{String(section.number).padStart(2, '0')}</div><p className="tiny-eyebrow">Learn · {section.title} · Part {learnPage + 1} of {section.learn.length}</p><h1>{section.title}</h1><p className="intro-summary">{section.summary}</p><p className="lesson-copy">{section.learn[learnPage]}</p>
        {lastPage && <div className="takeaway-list mt-6"><p className="meta-label">Key takeaways</p>{section.takeaways.map((item) => <div className="flex items-start gap-3" key={item}><CheckCircle2 className="mt-1 text-red" /><span>{item}</span></div>)}</div>}
        <Button className="primary-pill mt-8" size="lg" onClick={continueLearning}>{lastPage ? 'Check your understanding' : 'Continue learning'} <ArrowRight /></Button>
      </section>
    </main>;
  }

  const checkInSection = questionIndex % 2 + 1;
  return <main className="learning-shell"><div className="learning-top"><Button variant="ghost" onClick={() => setStage('course-home')}><ArrowLeft /> Course home</Button><span className="text-sm text-muted-foreground">Check {checkInSection} of 2</span></div>
    <div className="dual-progress"><Progress value={completionPercent} aria-label={`Overall course: ${completionPercent}%`} /><span className="text-sm text-muted-foreground">Section {section.number} of {config.sections.length} · {completionPercent}% overall</span></div>
    <section className="question-layout"><div className="question-number">{String(questionIndex + 1).padStart(2, '0')}</div><article className="question-card"><span className="question-kind">Check your understanding · Choose one</span><h1>{question.question}</h1><div className="scenario"><span>Scenario</span><p>{question.scenario}</p></div>
      <div className="answers">{question.options.map((option) => <label key={option.id} className={`answer-option ${selected === option.id ? 'answer-selected' : ''} ${answered && answered.answer === option.id && !answered.correct ? 'answer-wrong' : ''}`}><input type="radio" name={question.id} value={option.id} checked={selected === option.id} disabled={Boolean(answered)} onChange={() => setSelected(option.id)} /><span><b>{option.id.toUpperCase()}</b>{option.text}</span></label>)}</div>
      {feedback && <output className={`feedback-card ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`} aria-live="polite"><div><Lightbulb /></div><div><strong>{isCorrect ? 'Correct — apply the principle' : 'Not quite — review the principle'}</strong><p>{feedback}</p></div></output>}
      <div className="question-actions"><span className="autosave"><Save /> Progress saved in this browser</span>{feedback ? <Button className="primary-pill" size="lg" onClick={continueAfterFeedback}>{questionIndex === config.questions.length - 1 ? 'Take it into practice' : checkInSection === 2 ? 'Next section' : 'Continue'} <ArrowRight /></Button> : <Button className="primary-pill" size="lg" disabled={!selected} onClick={submitResponse}>Check response</Button>}</div>
    </article></section>
  </main>;
}
