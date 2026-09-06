'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { aiQuestions, aiSections, AI_COURSE_VERSION } from '@/lib/ai-course';
import { teamsQuestions, teamsSections, TEAMS_COURSE_VERSION } from '@/lib/teams-course';
import { mtssQuestions, mtssSections, MTSS_COURSE_VERSION } from '@/lib/mtss-course';
import { tlfQuestions, tlfSections, TLF_COURSE_VERSION } from '@/lib/tlf-course';
import { elementaryQuestions, elementarySections, secondaryQuestions, secondarySections, FACULTY_COURSE_VERSION } from '@/lib/faculty-courses';
import { cognitiveLevelFor } from '@/lib/assessment-progression';
import { COURSE_BY_ID, type CourseId } from '@/lib/course-catalog';

type CourseProgress = {
  position: number;
  learnPage?: number;
  learningStage?: 'learn' | 'question';
  completedSections: string[];
  responses: Record<string, { answer: string; correct: boolean }>;
  completedAt?: number;
  practice?: string;
  commitment?: string;
  attempts?: { score: number; completedAt: number; passed: boolean }[];
  lastAttempt?: { score: number; completedAt: number; passed: boolean };
  updatedAt?: number;
};

type LearningStage = 'course-home' | 'learn' | 'question' | 'practice' | 'complete' | 'result';
type CourseKey = Exclude<CourseId, 'safeguarding'>;

type RoadmapSection = { id: string; number: number; title: string };

const emptyProgress: CourseProgress = { position: 0, completedSections: [], responses: {} };
const learningLenses = ['Why this matters', 'Know this', 'In practice', 'Watch for'] as const;

const courses = {
  elementary: { storageKey: 'my-courses-elementary-faculty-progress-sy2627-v2', catalog: COURSE_BY_ID.elementary, version: FACULTY_COURSE_VERSION, passingScore: 80, sections: elementarySections, questions: elementaryQuestions, practiceOptions: ['Elementary routines and responsibilities', 'Assessment and reporting', 'Student support and wellbeing', 'Communication and collaboration', 'Professional growth', 'Something else'] },
  secondary: { storageKey: 'my-courses-secondary-faculty-progress-sy2627-v2', catalog: COURSE_BY_ID.secondary, version: FACULTY_COURSE_VERSION, passingScore: 80, sections: secondarySections, questions: secondaryQuestions, practiceOptions: ['Secondary routines and responsibilities', 'Assessment and grading', 'Student support and advisory', 'Academic integrity and AI', 'Student behaviour and safety', 'Something else'] },
  engagement: {
    storageKey: 'my-courses-engagement-progress-v1', catalog: COURSE_BY_ID.engagement, version: TLF_COURSE_VERSION, sections: tlfSections, questions: tlfQuestions, passingScore: 0,
    practiceOptions: ['Use the framework as a lens in an upcoming learning design.', 'Select a small set of indicators for a coaching or reflection conversation.', 'Notice student experience through talk, choices, work, relationships and action.', 'Invite students to describe what deepens their engagement.', 'Something else'],
  },
  ai: {
    storageKey: 'my-courses-ai-progress-v1', catalog: COURSE_BY_ID.ai, version: AI_COURSE_VERSION, sections: aiSections, questions: aiQuestions, passingScore: 0,
    practiceOptions: ['Be more deliberate about what student information I share with AI.', 'Keep the human in the loop when using AI for feedback.', 'Verify AI-generated information before using it.', 'Consider bias and representation more carefully.', 'Redesign an assessment to make student thinking more visible.', 'Something else'],
  },
  teams: {
    storageKey: 'my-courses-communication-progress-v2', catalog: COURSE_BY_ID.teams, version: TEAMS_COURSE_VERSION, sections: teamsSections, questions: teamsQuestions, passingScore: 0,
    practiceOptions: ['Be more intentional about who actually needs information.', 'Share only what colleagues need to support the student.', 'Describe observable behaviour rather than label students.', 'Ask colleagues more specific questions.', 'Turn frustration into factual, useful communication.', 'Keep confidential student records out of Teams.', 'Use the Purpose / Audience / Information / Evidence / Language / Confidentiality / Professionalism check.', 'Something else'],
  },
  mtss: {
    storageKey: 'my-courses-mtss-progress-v1', catalog: COURSE_BY_ID.mtss, version: MTSS_COURSE_VERSION, sections: mtssSections, questions: mtssQuestions, passingScore: 0,
    practiceOptions: ['Use the complete MTSS decision cycle.', 'Bring multiple evidence sources to decisions.', 'Check Tier 1 before intensifying support.', 'Set measurable goals and decision rules.', 'Monitor fidelity and equity.', 'Invite learner and family perspectives.', 'Something else'],
  },
} as const;

function readProgress(storageKey: string): CourseProgress {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return emptyProgress;
    return {
      ...emptyProgress,
      ...saved,
      position: Number.isFinite(saved.position) ? Math.max(0, saved.position) : 0,
      completedSections: Array.isArray(saved.completedSections) ? saved.completedSections.filter((id: unknown) => typeof id === 'string') : [],
      responses: saved.responses && typeof saved.responses === 'object' && !Array.isArray(saved.responses) ? saved.responses : {},
    };
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
  const [stage, setStage] = useState<LearningStage>(initialProgress.completedAt ? 'complete' : initialProgress.lastAttempt ? 'result' : 'course-home');
  const [questionIndex, setQuestionIndex] = useState(initialQuestion);
  const [sectionIndex, setSectionIndex] = useState(() => {
    let index = 0;
    let start = 0;
    config.sections.forEach((item, itemIndex) => { if (start <= initialQuestion) index = itemIndex; start += item.questions.length; });
    return index;
  });
  const [learnPage, setLearnPage] = useState(() => Math.max(0, initialProgress.learnPage || 0));
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [practice, setPractice] = useState(initialProgress.practice || '');
  const [commitment, setCommitment] = useState(initialProgress.commitment || '');
  const [reviewMode, setReviewMode] = useState(false);
  const [remediationRead, setRemediationRead] = useState(false);

  const section = config.sections[sectionIndex];
  const question = config.questions[questionIndex];
  const answered = useMemo(() => progress.responses[question.id], [progress.responses, question.id]);
  const completedChecks = Object.keys(progress.responses).length;
  const totalSteps = config.questions.length + config.sections.length;
  const completionPercent = Math.round((completedChecks + progress.completedSections.length) / totalSteps * 100);
  const hasProgress = completedChecks > 0 || progress.completedSections.length > 0 || Boolean(progress.learningStage) || (progress.learnPage || 0) > 0;
  const sectionStarts = useMemo(() => {
    const starts: number[] = [];
    let total = 0;
    for (const item of config.sections) {
      starts.push(total);
      total += item.questions.length;
    }
    return starts;
  }, [config.sections]);
  const sectionIndexForQuestion = (index: number) => {
    let found = 0;
    sectionStarts.forEach((start, indexOfStart) => { if (start <= index) found = indexOfStart; });
    return found;
  };
  const questionIndexInSection = questionIndex - sectionStarts[sectionIndex];

  useEffect(() => {
    document.title = `${config.catalog.title} | My Courses`;
  }, [config.catalog.title]);

  function updateProgress(next: CourseProgress) {
    const saved = { ...next, updatedAt: Date.now() };
    setProgress(saved);
    saveProgress(config.storageKey, saved);
  }

  function startOrResume() {
    if (progress.completedAt) {
      beginReview();
      return;
    }
    if (Object.keys(progress.responses).length >= config.questions.length) {
      setStage('practice');
      return;
    }
    const savedLearnPage = Math.min(section.learn.length - 1, Math.max(0, progress.learnPage || 0));
    setLearnPage(savedLearnPage);
    const savedAnswer = progress.responses[question.id];
    setSelected(savedAnswer?.answer || '');
    setFeedback(savedAnswer ? (savedAnswer.correct ? question.correctFeedback : question.optionFeedback?.[savedAnswer.answer] ?? question.incorrectFeedback) : null);
    setIsCorrect(savedAnswer ? savedAnswer.correct : null);
    setRemediationRead(Boolean(savedAnswer?.correct || (savedAnswer && !question.criticalSafeguarding)));
    setStage(progress.learningStage === 'question' || progress.completedSections.includes(section.id) ? 'question' : 'learn');
  }

  function continueLearning() {
    if (learnPage < section.learn.length - 1) {
      const nextPage = learnPage + 1;
      setLearnPage(nextPage);
      if (!reviewMode) updateProgress({ ...progress, learnPage: nextPage, learningStage: 'learn' });
      return;
    }
    if (reviewMode) {
      if (sectionIndex === config.sections.length - 1) {
        setReviewMode(false);
        setStage('complete');
        return;
      }
      const nextSection = sectionIndex + 1;
      setSectionIndex(nextSection);
      setQuestionIndex(sectionStarts[nextSection]);
      setLearnPage(0);
      return;
    }
    const completedSections = progress.completedSections.includes(section.id) ? progress.completedSections : [...progress.completedSections, section.id];
    updateProgress({ ...progress, completedSections, position: Math.max(progress.position, questionIndex), learnPage: 0, learningStage: 'question' });
    setStage('question');
  }

  function submitResponse() {
    if (!selected || answered) return;
    const correct = selected === question.answer;
    updateProgress({ ...progress, responses: { ...progress.responses, [question.id]: { answer: selected, correct } }, position: questionIndex, learningStage: 'question' });
    setIsCorrect(correct);
    setFeedback(correct ? question.correctFeedback : question.optionFeedback?.[selected] ?? question.incorrectFeedback);
    setRemediationRead(correct || !question.criticalSafeguarding);
  }

  const feedbackIsCorrectAndRemediated = Boolean(feedback && (isCorrect || remediationRead));

  function continueAfterFeedback() {
    if (question.criticalSafeguarding && !feedbackIsCorrectAndRemediated) return;
    if (questionIndex === config.questions.length - 1) {
      setStage('practice');
      return;
    }
    const nextQuestion = questionIndex + 1;
    const nextSection = sectionIndexForQuestion(nextQuestion);
    setQuestionIndex(nextQuestion);
    updateProgress({ ...progress, position: nextQuestion, learnPage: 0, learningStage: nextSection !== sectionIndex ? 'learn' : 'question' });
    setSelected('');
    setFeedback(null);
    setIsCorrect(null);
    setRemediationRead(false);
    if (nextSection !== sectionIndex) {
      setSectionIndex(nextSection);
      setLearnPage(0);
      setStage('learn');
    }
  }

  function completeCourse() {
    const score = Object.values(progress.responses).filter((response) => response.correct).length;
    const passed = config.passingScore === 0 || Math.round(score / config.questions.length * 100) >= config.passingScore;
    const attempt = { score, completedAt: Date.now(), passed };
    updateProgress({ ...progress, practice, commitment, attempts: [...(progress.attempts || []), attempt], lastAttempt: attempt, completedAt: passed ? attempt.completedAt : undefined });
    setStage(passed ? 'complete' : 'result');
  }

  function retryCourse() {
    const next = { ...progress, position: 0, learnPage: 0, learningStage: 'learn' as const, completedSections: [], responses: {}, completedAt: undefined, lastAttempt: undefined };
    updateProgress(next);
    setSectionIndex(0); setQuestionIndex(0); setLearnPage(0); setSelected(''); setFeedback(null); setIsCorrect(null); setStage('course-home');
  }

  function beginReview() {
    setSectionIndex(0); setQuestionIndex(0); setLearnPage(0); setSelected(''); setFeedback(null); setIsCorrect(null); setReviewMode(true); setStage('learn');
  }

  const roadmap = <CourseRoadmap sections={config.sections} currentIndex={sectionIndex} completed={progress.completedSections} />;

  if (stage === 'complete' || stage === 'result') {
    const score = progress.lastAttempt?.score ?? Object.values(progress.responses).filter((response) => response.correct).length;
    const passed = Boolean(progress.completedAt);
    return <main id="main-content" className="learning-shell"><section className="results-card">
      <p className="tiny-eyebrow">My Courses · {config.catalog.title}</p><h1>{passed ? 'Course complete' : 'Review and try again'}</h1>
      <p className="results-lead">{passed ? 'You completed the learning and applied the principles to realistic professional decisions.' : `You completed this attempt. Review the learning before another attempt; ${config.passingScore}% is required for completion.`}</p>
      <div className="score-grid"><div><span>Score</span><strong>{score}/{config.questions.length}</strong></div><div><span>Version</span><strong>{config.version}</strong></div><div><span>Status</span><strong>{passed ? 'Completed' : 'Another attempt needed'}</strong></div></div>
      <div className="principle-card"><CheckCircle2 aria-hidden="true" /><div><strong>Take it into practice</strong><p>{practice || 'No practice idea selected.'}</p>{commitment && <p className="mt-2"><strong>My commitment:</strong> {commitment}</p>}</div></div>
      <div className="result-actions">{passed ? <Button className="primary-pill" size="lg" onClick={beginReview}>Review learning <ArrowRight /></Button> : <Button className="primary-pill" size="lg" onClick={retryCourse}>Review and try again <ArrowRight /></Button>}<Button variant="outline" size="lg" onClick={onExit}><ArrowLeft /> Back to courses</Button></div>
    </section></main>;
  }

  if (stage === 'course-home') {
    const nextLabel = hasProgress ? 'Continue learning' : 'Start course';
    return <main id="main-content" className="learning-shell"><section className="intro-card course-home-card">
      <p className="tiny-eyebrow">Course home</p><h1>{config.catalog.title}</h1><p className="intro-summary">{config.catalog.intro ?? config.catalog.description}</p>
      <dl className="course-facts"><div><dt>Time</dt><dd>{config.catalog.duration}</dd></div><div><dt>Learning path</dt><dd>{config.sections.length} sections</dd></div><div><dt>Checks</dt><dd>{config.questions.length} applied questions</dd></div></dl>
      <div className="course-home-progress"><div><strong>Your progress</strong><span>{completionPercent}% complete</span></div><Progress value={completionPercent} aria-label={`${config.catalog.title}: ${completionPercent}% complete`} /><p>{completedChecks} of {config.questions.length} checks completed · Progress saved in this browser</p></div>
      <div className="course-home-sections" aria-label="Course sections">{config.sections.map((item, index) => { const complete = progress.completedSections.includes(item.id); const current = index === sectionIndex && !progress.completedAt; return <div key={item.id} className={current ? 'section-current' : ''} aria-current={current ? 'step' : undefined}><span className={complete ? 'section-complete-dot' : 'section-pending-dot'}>{complete ? '✓' : item.number}</span><span>{item.title}</span>{current && <small>Next</small>}</div>; })}</div>
      <div className="mt-8 flex flex-wrap gap-3"><Button className="primary-pill" size="lg" onClick={startOrResume}>{nextLabel} <ArrowRight /></Button><Button variant="outline" onClick={onExit}><ArrowLeft /> All courses</Button></div>
    </section></main>;
  }

  if (stage === 'practice') {
    return <main id="main-content" className="learning-shell"><section className="intro-card"><p className="tiny-eyebrow">Apply · Take it into practice</p><h1>What is one practice from this course that you want to strengthen?</h1>
      <div className="answers practice-options">{config.practiceOptions.map((option) => <label key={option} className={`answer-option ${practice === option ? 'answer-selected' : ''}`}><input type="radio" name="practice" checked={practice === option} onChange={() => setPractice(option)} /><span>{option}</span></label>)}</div>
      {practice && <label className="mt-6 block"><span className="meta-label">{practice === 'Something else' ? 'Tell us about your focus' : 'My commitment (optional)'}</span><textarea className="mt-2 w-full rounded-xl border border-navy/15 p-3" value={commitment} onChange={(event) => setCommitment(event.target.value)} placeholder={practice === 'Something else' ? 'What practice do you want to strengthen?' : 'What is one thing you could try?'} rows={3} /></label>}
      <Button className="primary-pill mt-8" size="lg" disabled={!practice} onClick={completeCourse}>Save and complete <ArrowRight /></Button>
    </section></main>;
  }

  if (stage === 'learn') {
    const lastPage = learnPage === section.learn.length - 1;
    const learningLens = learningLenses[learnPage % learningLenses.length];
    return <main id="main-content" className="learning-shell">
      <div className="learning-top"><Button variant="ghost" onClick={() => setStage(progress.completedAt ? 'complete' : 'course-home')}><ArrowLeft /> {reviewMode ? 'Completion' : 'Course home'}</Button><span className="section-position">Section {section.number} of {config.sections.length}</span></div>
      <div className="dual-progress"><Progress value={completionPercent} aria-label={`Overall course: ${completionPercent}%`} /><span className="text-sm text-muted-foreground">{completionPercent}% overall</span></div>
      <div className="course-experience">{roadmap}<section className="intro-card lesson-card"><div className="module-orbit">{String(section.number).padStart(2, '0')}</div><p className="tiny-eyebrow">Learn · {learningLens} · Part {learnPage + 1} of {section.learn.length}</p><h1>{section.title}</h1><p className="intro-summary">{section.summary}</p><p className="lesson-copy">{section.learn[learnPage]}</p>
        {lastPage && <div className="takeaway-list mt-6"><p className="meta-label">Key takeaways</p>{section.takeaways.map((item) => <div className="flex items-start gap-3" key={item}><CheckCircle2 className="mt-1 text-red" /><span>{item}</span></div>)}</div>}
        <Button className="primary-pill mt-8" size="lg" onClick={continueLearning}>{lastPage ? reviewMode ? sectionIndex === config.sections.length - 1 ? 'Finish review' : 'Next section' : 'Check your learning' : 'Continue learning'} <ArrowRight /></Button>
      </section></div>
    </main>;
  }

  const checkInSection = questionIndexInSection + 1;
  const checksInCurrentSection = section.questions.length;
  return <main id="main-content" className="learning-shell">
    <div className="learning-top"><Button variant="ghost" onClick={() => setStage('course-home')}><ArrowLeft /> Course home</Button><span className="text-sm text-muted-foreground">Check {checkInSection} of {checksInCurrentSection}</span></div>
    <div className="dual-progress"><Progress value={completionPercent} aria-label={`Overall course: ${completionPercent}%`} /><span className="text-sm text-muted-foreground">Section {section.number} of {config.sections.length} · {completionPercent}% overall</span></div>
    <div className="course-experience">{roadmap}<section className="question-layout"><div className="question-number">{String(questionIndex + 1).padStart(2, '0')}</div><article className="question-card" data-cognitive-level={cognitiveLevelFor(course, question.id)}><span className="question-kind">Check {checkInSection} of {checksInCurrentSection} · Check your understanding</span><h1>{question.question}</h1><div className="scenario"><span>Scenario</span><p>{question.scenario}</p></div>
      <fieldset className="answers"><legend className="sr-only">Choose one answer</legend>{question.options.map((option) => <label key={option.id} className={`answer-option ${selected === option.id ? 'answer-selected' : ''} ${answered && answered.answer === option.id && !answered.correct ? 'answer-wrong' : ''} ${answered && question.answer === option.id ? 'answer-correct' : ''}`}><input type="radio" name={question.id} value={option.id} checked={selected === option.id} disabled={Boolean(answered)} onChange={() => setSelected(option.id)} /><span><b>{option.id.toUpperCase()}</b>{option.text}</span>{answered && question.answer === option.id && <CheckCircle2 className="answer-icon" aria-label="Correct answer" />}</label>)}</fieldset>
      {feedback && <output className={`feedback-card ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`} aria-live="polite"><div><Lightbulb /></div><div><strong>{isCorrect ? 'Correct — why this is strong' : 'Why the stronger response matters'}</strong><p>{isCorrect ? feedback : question.correctFeedback}</p>{!isCorrect && <details className="feedback-detail"><summary>Why your choice falls short</summary><p>{feedback}</p></details>}{!isCorrect && question.criticalSafeguarding && <label className="remediation-check"><input type="checkbox" checked={remediationRead} onChange={(event) => setRemediationRead(event.target.checked)} /> <span>Stop · Understand · Continue: I understand the stronger principle before continuing.</span></label>}</div></output>}
      <div className="question-actions"><span className="autosave"><Save /> Progress saved in this browser</span>{feedback ? <Button className="primary-pill" size="lg" disabled={!feedbackIsCorrectAndRemediated} onClick={continueAfterFeedback}>{questionIndex === config.questions.length - 1 ? 'Take it into practice' : checkInSection === checksInCurrentSection ? 'Next section' : 'Continue'} <ArrowRight /></Button> : <Button className="primary-pill" size="lg" disabled={!selected} onClick={submitResponse}>Check response</Button>}</div>
    </article></section></div>
  </main>;
}

function CourseRoadmap({ sections, currentIndex, completed }: { sections: readonly RoadmapSection[]; currentIndex: number; completed: string[] }) {
  const list = <ol>{sections.map((item, index) => {
    const isComplete = completed.includes(item.id);
    const isCurrent = index === currentIndex;
    return <li key={item.id} className={`${isComplete ? 'roadmap-complete' : ''} ${isCurrent ? 'roadmap-current' : ''}`} aria-current={isCurrent ? 'step' : undefined}><span>{isComplete ? '✓' : item.number}</span><strong>{item.title}</strong></li>;
  })}</ol>;

  return <aside className="course-roadmap" aria-label="Course roadmap">
    <div className="roadmap-desktop"><p className="tiny-eyebrow">Course roadmap</p>{list}</div>
    <details className="roadmap-mobile"><summary>Section {currentIndex + 1} of {sections.length} · {sections[currentIndex]?.title}</summary>{list}</details>
  </aside>;
}
