'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Clock3, Download, LockKeyhole, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Question } from '@/lib/course';

type Module = { id: string; number: number; title: string; eyebrow: string; summary: string; learningContent: string };
type ResponseRecord = { questionId: string; answer: string[]; isCorrect: boolean };
type Bootstrap = {
  user: { id: string; name: string; email: string; role: 'LEARNER' | 'ADMIN' };
  questions: Question[];
  modules: Module[];
  passThreshold: number;
  attempt: { attemptNumber: number; status: string; score: number | null; percentage: number | null; completedAt: number | null };
  responses: ResponseRecord[];
  progress: { currentModule: number; currentQuestion: number; completed: number; percentage: number; latestActivity: number } | null;
};
type Feedback = { isCorrect: boolean; feedback: string; correctAnswer: string[]; criticalSafeguarding: boolean };
type Result = { score: number; percentage: number; passed: boolean; threshold: number; completedAt: number; moduleScores: { module: string; correct: number; total: number }[] };
type View = 'dashboard' | 'intro' | 'question' | 'results';

export default function TrainingApp({ staticMode = false }: { staticMode?: boolean }) {
  const [data, setData] = useState<Bootstrap | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [remediationConfirmed, setRemediationConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const responseMap = useMemo(() => new Map(data?.responses.map((r) => [r.questionId, r]) ?? []), [data]);
  const completedCount = Math.max(data?.progress?.completed ?? 0, responseMap.size);
  const progressPercent = Math.round(completedCount / 30 * 100);
  const question = data?.questions[questionIndex];
  const currentModule = data?.modules[Math.floor(questionIndex / 5)];

  useEffect(() => {
    fetch('/api/bootstrap', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json() as Bootstrap & { error?: string };
        if (!response.ok) throw new Error(payload.error || 'Training could not be loaded.');
        return payload as Bootstrap;
      })
      .then((payload) => {
        setData(payload);
        const saved = Math.max(0, Math.min(29, (payload.progress?.currentQuestion ?? 1) - 1));
        setQuestionIndex(saved);
        if (payload.attempt?.status === 'PASSED' || payload.attempt?.status === 'NEEDS_ANOTHER_ATTEMPT') {
          setResult(resultFromBootstrap(payload));
          setView('results');
        }
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Training could not be loaded.'));
  }, []);

  useEffect(() => {
    const modelContext = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!modelContext?.registerTool || !data) return;
    const lifecycle = new AbortController();
    const report = () => undefined;
    try {
      void Promise.resolve(modelContext.registerTool({
        name: 'get_training_progress',
        title: 'Get training progress',
        description: 'Read the signed-in learner’s AISG safeguarding training progress and next module.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute: () => ({ completedQuestions: completedCount, totalQuestions: 30, percentage: progressPercent, nextQuestion: Math.min(30, questionIndex + 1), status: data.attempt?.status ?? 'IN_PROGRESS' }),
      }, { signal: lifecycle.signal })).catch(report);
    } catch { report(); }
    return () => lifecycle.abort();
  }, [completedCount, data, progressPercent, questionIndex]);

  if (!data && !error) return <LoadingScreen />;
  if (!data) return <ErrorScreen message={error} />;

  function beginOrResume() {
    setView(questionIndex % 5 === 0 ? 'intro' : 'question');
    setFeedback(null);
    setSelected([]);
  }

  async function submit() {
    if (!question || selected.length === 0) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/answer', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ questionId: question.id, selected }) });
      const payload = await response.json() as Feedback & { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Your answer could not be saved.');
      setFeedback(payload);
      setData((current) => current ? { ...current, responses: [...current.responses.filter((r) => r.questionId !== question.id), { questionId: question.id, answer: selected, isCorrect: payload.isCorrect }], progress: { currentModule: Math.min(6, Math.ceil((questionIndex + 2) / 5)), currentQuestion: Math.min(30, questionIndex + 2), completed: Math.max(current.responses.length + 1, questionIndex + 1), percentage: Math.round(Math.max(current.responses.length + 1, questionIndex + 1) / 30 * 100), latestActivity: Date.now() } } : current);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Your answer could not be saved.'); }
    finally { setBusy(false); }
  }

  async function continueAfterFeedback() {
    if (!question || !feedback) return;
    if (questionIndex === 29) {
      setBusy(true); setError('');
      try {
        const response = await fetch('/api/finalize', { method: 'POST' });
        const payload = await response.json() as Result & { error?: string };
        if (!response.ok) throw new Error(payload.error || 'The attempt could not be completed.');
        setResult(payload); setView('results');
      } catch (reason) { setError(reason instanceof Error ? reason.message : 'The attempt could not be completed.'); }
      finally { setBusy(false); }
      return;
    }
    const next = questionIndex + 1;
    setQuestionIndex(next); setSelected([]); setFeedback(null); setRemediationConfirmed(false);
    setView(next % 5 === 0 ? 'intro' : 'question');
  }

  async function retake() {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/retake', { method: 'POST' });
      if (!response.ok) throw new Error('A new attempt could not be started.');
      const refreshed = await fetch('/api/bootstrap', { cache: 'no-store' }).then((r) => r.json()) as Bootstrap;
      setData(refreshed); setQuestionIndex(0); setSelected([]); setFeedback(null); setResult(null); setView('intro');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'A new attempt could not be started.'); }
    finally { setBusy(false); }
  }

  const header = <AppHeader user={data.user} onHome={() => setView('dashboard')} />;
  if (view === 'results' && result) return <>{header}<ResultsScreen data={data} result={result} responses={[...responseMap.values()]} onRetake={retake} busy={busy} staticMode={staticMode} /></>;
  if (view === 'intro' && currentModule) return <>{header}<ModuleIntro module={currentModule} progress={progressPercent} onBack={() => setView('dashboard')} onStart={() => setView('question')} /></>;
  if (view === 'question' && question && currentModule) return <>{header}<QuestionScreen question={question} module={currentModule} index={questionIndex} selected={selected} setSelected={setSelected} feedback={feedback} onSubmit={submit} onContinue={continueAfterFeedback} busy={busy} error={error} remediationConfirmed={remediationConfirmed} setRemediationConfirmed={setRemediationConfirmed} /></>;
  return <>{header}<Dashboard data={data} progressPercent={progressPercent} completedCount={completedCount} onContinue={beginOrResume} staticMode={staticMode} /></>;
}

function AppHeader({ user, onHome }: { user: Bootstrap['user']; onHome: () => void }) {
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <header className="app-header print:hidden"><div className="app-header-inner">
    <button className="brand-button" onClick={onHome} aria-label="AISG training home"><AisgMark /><span className="brand-copy"><strong>Student Safeguarding</strong><small>Annual training • SY2026–27</small></span></button>
    <nav className="flex items-center gap-2" aria-label="Account and administration">
      {user.role === 'ADMIN' && <Link href="/admin" className="admin-link">Admin workspace</Link>}
      <span className="hidden text-sm text-muted-foreground md:inline">{user.name}</span><span className="avatar">{initials}</span>
    </nav>
  </div></header>;
}

function AisgMark() { return <span className="aisg-mark" aria-label="AISG"><span>A</span><span>I</span><span>S</span><span>G</span></span>; }

function Dashboard({ data, progressPercent, completedCount, onContinue, staticMode }: { data: Bootstrap; progressPercent: number; completedCount: number; onContinue: () => void; staticMode: boolean }) {
  const completeModules = Math.floor(completedCount / 5);
  return <main className="dashboard-shell"><section className="dashboard-main"><div className="max-w-3xl">
    <div className="eyebrow"><ShieldCheck aria-hidden="true" /> Required annual learning</div>
    <h1 className="hero-title">Safeguarding is<br />everyone’s responsibility.</h1>
    <p className="hero-copy">Build confidence to recognise, respond, record and report concerns in line with AISG procedures.</p>
    <div className="progress-card"><div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="meta-label">Your progress</p><div className="mt-1 flex flex-wrap items-baseline gap-3"><strong className="metric-number">{progressPercent}%</strong><span className="text-sm text-muted-foreground">{completeModules} of 6 sections complete</span></div></div>
      <Button onClick={onContinue} className="primary-pill" size="lg">{completedCount ? 'Continue training' : 'Begin training'} <ArrowRight aria-hidden="true" /></Button></div>
      <Progress value={progressPercent} aria-label={`Course progress: ${progressPercent} percent`} className="mt-7 [&_[data-slot=progress-track]]:h-2.5 [&_[data-slot=progress-indicator]]:bg-red" />
      <p className="autosave"><Clock3 aria-hidden="true" /> {30 - completedCount} questions remaining • {staticMode ? 'Saved in this browser' : 'Progress autosaves'}</p>
    </div>
  </div></section><CourseMap modules={data.modules} completed={completedCount} passThreshold={data.passThreshold} /></main>;
}

function CourseMap({ modules, completed, passThreshold }: { modules: Module[]; completed: number; passThreshold: number }) {
  const activeModule = Math.min(6, Math.floor(completed / 5) + 1);
  return <aside className="course-map" aria-labelledby="course-map-title"><div className="flex items-center justify-between"><div><p className="tiny-eyebrow">Course map</p><h2 id="course-map-title" className="mt-1 text-2xl font-semibold tracking-tight text-navy">Six focused sections</h2></div><BookOpen className="text-navy/45" aria-hidden="true" /></div>
    <ol className="mt-8 space-y-2">{modules.map((module) => { const complete = completed >= module.number * 5; const active = module.number === activeModule; return <li key={module.id} className={`module-row ${active ? 'module-active' : ''}`}><span className={`module-number ${complete ? 'module-complete' : ''}`}>{complete ? <Check aria-hidden="true" /> : String(module.number).padStart(2, '0')}</span><span className="min-w-0 flex-1"><span className="block text-[15px] font-semibold text-navy">{module.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">5 assessed questions</span></span><span className={`status-label ${complete ? 'status-complete' : active ? 'status-continue' : 'status-locked'}`}>{complete ? 'Complete' : active ? 'Next' : <LockKeyhole className="h-3.5 w-3.5" aria-label="Locked" />}</span></li>; })}</ol>
    <p className="mt-8 border-t border-navy/10 pt-6 text-sm leading-6 text-muted-foreground">The current pass threshold is <strong className="text-navy">{passThreshold}%</strong>. It is configurable by AISG administrators.</p></aside>;
}

function ModuleIntro({ module, progress, onBack, onStart }: { module: Module; progress: number; onBack: () => void; onStart: () => void }) {
  return <main className="learning-shell"><div className="learning-top"><Button variant="ghost" onClick={onBack}><ArrowLeft /> Course home</Button><span className="text-sm font-medium text-muted-foreground">{progress}% complete</span></div><Progress value={progress} className="[&_[data-slot=progress-indicator]]:bg-red" />
    <section className="intro-card"><div className="module-orbit">{String(module.number).padStart(2, '0')}</div><p className="tiny-eyebrow">{module.eyebrow} • Section {module.number} of 6</p><h1>{module.title}</h1><p className="intro-summary">{module.summary}</p><div className="principle-card"><Sparkles aria-hidden="true" /><div><strong>Key principle</strong><p>{module.learningContent}</p></div></div><div className="mt-9 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-muted-foreground">5 assessed questions • Immediate feedback</p><Button onClick={onStart} className="primary-pill" size="lg">Start section <ArrowRight /></Button></div></section></main>;
}

function QuestionScreen({ question, module, index, selected, setSelected, feedback, onSubmit, onContinue, busy, error, remediationConfirmed, setRemediationConfirmed }: { question: Question; module: Module; index: number; selected: string[]; setSelected: (value: string[]) => void; feedback: Feedback | null; onSubmit: () => void; onContinue: () => void; busy: boolean; error: string; remediationConfirmed: boolean; setRemediationConfirmed: (value: boolean) => void }) {
  const needsRemediation = Boolean(feedback && !feedback.isCorrect && question.criticalSafeguarding);
  const toggle = (id: string) => setSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  const chooseSequence = (id: string) => { if (!selected.includes(id)) setSelected([...selected, id]); };
  return <main className="learning-shell"><div className="learning-top"><span className="text-sm font-semibold text-navy">Section {module.number}: {module.title}</span><span className="text-sm text-muted-foreground">Question {index + 1} of 30</span></div><Progress value={(index + (feedback ? 1 : 0)) / 30 * 100} aria-label={`Question ${index + 1} of 30`} className="[&_[data-slot=progress-indicator]]:bg-red" />
    <section className="question-layout"><div className="question-number">{String(index + 1).padStart(2, '0')}</div><article className="question-card"><div className="flex flex-wrap items-center gap-2"><span className="question-kind">{question.questionType === 'multiple_response' ? 'Select all that apply' : question.questionType === 'sequence' ? 'Choose in order' : 'Choose one'}</span>{question.criticalSafeguarding && <span className="critical-chip"><ShieldCheck /> Critical safeguarding</span>}</div>
      <h1>{question.question}</h1>{question.scenario && <div className="scenario"><span>Scenario</span><p>{question.scenario}</p></div>}
      <div className="answers" aria-label="Answer options">
        {question.questionType === 'single_answer' ? <RadioGroup value={selected[0] ?? ''} onValueChange={(value) => !feedback && setSelected([String(value)])}>{question.answerOptions.map((option) => <label htmlFor={`answer-${option.id}`} key={option.id} className={optionClass(option.id, selected, feedback)}><RadioGroupItem id={`answer-${option.id}`} value={option.id} disabled={Boolean(feedback)} /><span><b>{option.id.toUpperCase()}</b>{option.text}</span>{feedback && feedback.correctAnswer.includes(option.id) && <CheckCircle2 className="answer-icon" />}</label>)}</RadioGroup>
        : question.questionType === 'multiple_response' ? question.answerOptions.map((option) => <label htmlFor={`answer-${option.id}`} key={option.id} className={optionClass(option.id, selected, feedback)}><Checkbox id={`answer-${option.id}`} checked={selected.includes(option.id)} onCheckedChange={() => !feedback && toggle(option.id)} disabled={Boolean(feedback)} /><span><b>{option.id.toUpperCase()}</b>{option.text}</span>{feedback && feedback.correctAnswer.includes(option.id) && <CheckCircle2 className="answer-icon" />}</label>)
        : <div className="space-y-2">{question.answerOptions.map((option) => <button type="button" key={option.id} disabled={Boolean(feedback) || selected.includes(option.id)} onClick={() => chooseSequence(option.id)} className={optionClass(option.id, selected, feedback)}><span className="sequence-rank">{selected.includes(option.id) ? selected.indexOf(option.id) + 1 : '—'}</span><span>{option.text}</span>{feedback && feedback.correctAnswer.includes(option.id) && <CheckCircle2 className="answer-icon" />}</button>)}{!feedback && selected.length > 0 && <Button variant="ghost" size="sm" onClick={() => setSelected([])}><RotateCcw /> Reset order</Button>}</div>}
      </div>
      {feedback && <output className={`feedback-card ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}><div>{feedback.isCorrect ? <CheckCircle2 /> : <AlertCircle />}</div><div><strong>{feedback.isCorrect ? 'Correct' : 'Not quite'}</strong><p>{feedback.feedback}</p></div></output>}
      {needsRemediation && <div className="remediation"><p className="tiny-eyebrow">Pause and reinforce</p><h2>Before you continue</h2><p>When a safeguarding response is critical, choose the action that protects the student and follows AISG&apos;s reporting pathway. Do not investigate, delay, promise secrecy or handle the concern alone.</p><label htmlFor="remediation-confirmation" className="mt-4 flex items-start gap-3 font-medium"><Checkbox id="remediation-confirmation" checked={remediationConfirmed} onCheckedChange={(checked) => setRemediationConfirmed(Boolean(checked))} /><span>I understand the safeguarding action and will apply it in practice.</span></label></div>}
      {error && <p className="error-message" role="alert">{error}</p>}
      <div className="question-actions"><span className="autosave"><Clock3 /> {feedback ? 'Answer saved' : 'Autosaves after submission'}</span>{feedback ? <Button className="primary-pill" size="lg" onClick={onContinue} disabled={busy || (needsRemediation && !remediationConfirmed)}>{index === 29 ? 'Complete assessment' : 'Continue'} <ArrowRight /></Button> : <Button className="primary-pill" size="lg" onClick={onSubmit} disabled={busy || selected.length === 0}>{busy ? 'Saving…' : 'Submit answer'}</Button>}</div>
    </article><aside className="source-note"><BookOpen /><div><strong>Learning objective</strong><p>{question.learningObjective}</p><span>Handbook {question.handbookSection}, p. {question.handbookPage}</span></div></aside></section></main>;
}

function optionClass(id: string, selected: string[], feedback: Feedback | null) { const chosen = selected.includes(id); const correct = feedback?.correctAnswer.includes(id); return `answer-option ${chosen ? 'answer-selected' : ''} ${feedback && chosen && !correct ? 'answer-wrong' : ''} ${feedback && correct ? 'answer-correct' : ''}`; }

function ResultsScreen({ data, result, responses, onRetake, busy, staticMode }: { data: Bootstrap; result: Result; responses: ResponseRecord[]; onRetake: () => void; busy: boolean; staticMode: boolean }) {
  const correctByModule = data.modules.map((module) => { const ids = data.questions.filter((q) => q.module === module.id).map((q) => q.id); return { ...module, correct: responses.filter((r) => ids.includes(r.questionId) && r.isCorrect).length }; });
  const strongest = [...correctByModule].sort((a, b) => b.correct - a.correct).slice(0, 2);
  const review = correctByModule.filter((m) => m.correct < 4);
  return <main className="results-shell"><section className="results-card"><div className={`result-seal ${result.passed ? 'result-pass' : 'result-review'}`}>{result.passed ? <ShieldCheck /> : <RotateCcw />}</div><p className="tiny-eyebrow">Attempt {data.attempt?.attemptNumber ?? 1} complete</p><h1>{result.passed ? 'Training complete' : 'Review and try again'}</h1><p className="results-lead">{result.passed ? 'You have met the current AISG completion threshold.' : `Your score is below the current ${result.threshold}% threshold. Review the suggested areas before another attempt.`}</p>
    <div className="score-grid"><div><span>Score</span><strong>{result.score}/30</strong></div><div><span>Percentage</span><strong>{result.percentage}%</strong></div><div><span>Status</span><strong>{result.passed ? 'Passed' : 'Another attempt'}</strong></div></div>
    <div className="results-columns"><div><h2>Areas answered well</h2>{strongest.map((m) => <p key={m.id}><CheckCircle2 /> {m.title} <span>{m.correct}/5</span></p>)}</div><div><h2>Review next</h2>{review.length ? review.map((m) => <p key={m.id}><BookOpen /> {m.title} <span>{m.correct}/5</span></p>) : <p><CheckCircle2 /> No priority review areas</p>}</div></div>
    <div className="result-actions">{result.passed ? <Button className="primary-pill" size="lg" onClick={() => window.print()}><Download /> Print or save certificate</Button> : <Button className="primary-pill" size="lg" onClick={onRetake} disabled={busy}><RotateCcw /> {busy ? 'Starting…' : 'Start another attempt'}</Button>}</div>
  </section>{result.passed && <section className="certificate"><AisgMark /><p className="certificate-kicker">Certificate of completion</p><h2>AISG Student Safeguarding Training</h2><p>Completed by</p><strong>{data.user.name}</strong><div><span>Completion date<br /><b>{new Date(result.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</b></span><span>Score<br /><b>{result.percentage}%</b></span><span>Course version<br /><b>SY2026–27</b></span></div><small>{staticMode ? 'This test completion is saved only in this browser.' : 'Completion is recorded independently in the AISG training system.'}</small></section>}</main>;
}

function resultFromBootstrap(data: Bootstrap): Result { const responses = data.responses; return { score: Number(data.attempt?.score ?? responses.filter((r) => r.isCorrect).length), percentage: Number(data.attempt?.percentage ?? 0), passed: data.attempt?.status === 'PASSED', threshold: data.passThreshold, completedAt: Number(data.attempt?.completedAt ?? Date.now()), moduleScores: [] }; }
function LoadingScreen() { return <main className="loading-screen"><AisgMark /><div className="loading-line" /><p>Preparing your safeguarding training…</p></main>; }
function ErrorScreen({ message }: { message: string }) { return <main className="loading-screen"><AlertCircle className="h-9 w-9 text-red" /><h1 className="text-2xl font-semibold text-navy">Training is temporarily unavailable</h1><p>{message}</p><Button onClick={() => location.reload()}>Try again</Button></main>; }
