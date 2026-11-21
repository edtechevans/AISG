import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Award, BookOpen, BookOpenCheck, Check, CheckCircle2, ChevronLeft, ChevronRight, FileText, LockKeyhole, Printer, RotateCcw, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { chapters, questionsFor, validateBank, type Division, type Question } from './safeguarding-v2-data';
import { forAttempt } from './safeguarding-v21-variants';
import './safeguarding-v2.css';

type Stage = 'reading' | 'checking' | 'review' | 'finished';
type SavedProgress = { completed: number[]; lastChapter: number; tries: Record<number, number>; completedAt?: string; learnerName?: string };
type Review = { score: number; pass: boolean; questions: { question: Question; correct: boolean; answer: number[] }[] };
type Handbook = { name: string; url: string; source: 'bundled' | 'approved-link' | 'device' };
const titles: Record<Division, string> = { elementary: 'Elementary', secondary: 'Secondary' };
const saveKey = (division: Division) => 'aisg-safeguarding-v21-review-' + division;
const draftKey = (division: Division, chapter: number) => `aisg-safeguarding-v21-draft-${division}-${chapter}`;
type Draft = { attempt: number; answers: Record<string, number[]>; cursor: number };
function readDraft(division: Division, chapter: number, attempt: number): Draft {
  try { const raw = localStorage.getItem(draftKey(division, chapter)); const d = raw ? JSON.parse(raw) as Draft : null;
    if (d && d.attempt === attempt && d.answers) return {attempt, answers: d.answers, cursor: Math.max(0, Math.min(4, d.cursor || 0))};
  } catch { /* Storage may not be available. */ }
  return {attempt, answers:{}, cursor:0};
}
function getAttempt(progress: SavedProgress, chapter: number): number { return (progress.tries[chapter] || 0) + 1; }
const handbookStorageName = 'aisg-safeguarding-handbook';
const bookFilename = 'safeguarding-handbook.pdf';

function rememberHandbook(file: File): Promise<void> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') { resolve(); return; }
    const request = indexedDB.open(handbookStorageName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('pdf');
    request.onerror = () => resolve();
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction('pdf', 'readwrite');
      transaction.objectStore('pdf').put(file, 'official');
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => { database.close(); resolve(); };
    };
  });
}
function recallHandbook(): Promise<File | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') { resolve(null); return; }
    const request = indexedDB.open(handbookStorageName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('pdf');
    request.onerror = () => resolve(null);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction('pdf', 'readonly');
      const get = transaction.objectStore('pdf').get('official');
      get.onsuccess = () => { resolve(get.result instanceof Blob ? new File([get.result], get.result instanceof File ? get.result.name : 'AISG Student Safeguarding Handbook.pdf', { type: 'application/pdf' }) : null); database.close(); };
      get.onerror = () => { resolve(null); database.close(); };
    };
  });
}
function getSaved(division: Division): SavedProgress {
  try {
    const raw = localStorage.getItem(saveKey(division));
    if (!raw) return { completed: [], lastChapter: 1, tries: {} };
    const parsed = JSON.parse(raw) as SavedProgress;
    const completed = Array.isArray(parsed.completed) ? parsed.completed.filter((x) => typeof x === 'number' && x >= 1 && x <= 6) : [];
    return { completed, lastChapter: Number(parsed.lastChapter) || 1, tries: parsed.tries || {}, completedAt: parsed.completedAt, learnerName: typeof parsed.learnerName === 'string' ? parsed.learnerName : '' };
  } catch {
    return { completed: [], lastChapter: 1, tries: {} };
  }
}
function seedNumber(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return hash >>> 0;
}
function optionSequence(question: Question, attempt: number): number[] {
  const indices = question.options.map((_, i) => i);
  let seed = seedNumber(question.id + '-' + attempt);
  for (let i = indices.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}
function sameAnswer(q: Question, choice: number[]) {
  if (q.kind === 'order') return JSON.stringify(choice) === JSON.stringify(q.correct);
  return choice.length === q.correct.length && choice.every((n) => q.correct.includes(n));
}
function initialDivision(): Division | null {
  const value = new URLSearchParams(window.location.search).get('division');
  return value === 'elementary' || value === 'secondary' ? value : null;
}

function App() {
  const [division, setDivision] = useState<Division | null>(initialDivision);
  const [saved, setSaved] = useState<SavedProgress>(() => initialDivision() ? getSaved(initialDivision()!) : { completed: [], lastChapter: 1, tries: {} });
  const [chapter, setChapter] = useState(() => initialDivision() ? getSaved(initialDivision()!).lastChapter : 1);
  const [stage, setStage] = useState<Stage>(() => initialDivision() && getSaved(initialDivision()!).completed.length === 6 ? 'finished' : 'reading');
  const [acknowledged, setAcknowledged] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number[]>>(() => {
    const div = initialDivision();
    if (!div) return {};
    const progress = getSaved(div);
    return readDraft(div, progress.lastChapter, getAttempt(progress, progress.lastChapter)).answers;
  });
  const [questionCursor, setQuestionCursor] = useState(() => {
    const div = initialDivision();
    if (!div) return 0;
    const progress = getSaved(div);
    return readDraft(div, progress.lastChapter, getAttempt(progress, progress.lastChapter)).cursor;
  });
  const [handbookWidth, setHandbookWidth] = useState(530);
  const [reportOpen, setReportOpen] = useState(false);
  const [smallScreen, setSmallScreen] = useState(() => window.matchMedia('(max-width: 1250px)').matches);
  const handbookCloseRef = useRef<HTMLButtonElement>(null);
  const reportCloseRef = useRef<HTMLButtonElement>(null);
  const focusReturnRef = useRef<HTMLElement | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [handbook, setHandbook] = useState<Handbook | null>(() => ({
    name: 'AISG Student Safeguarding Handbook · Revised May 2026',
    url: new URL('safeguarding-handbook.pdf', document.baseURI).toString(),
    source: 'bundled',
  }));
  const [bookSourceChecked, setBookSourceChecked] = useState(false);
  const [handbookOpen, setHandbookOpen] = useState(false);
  const [handbookPage, setHandbookPage] = useState(4);
  const fileInput = useRef<HTMLInputElement>(null);
  const contentTop = useRef<HTMLElement>(null);
  const current = chapters[chapter - 1];
  const attempt = getAttempt(saved, chapter);
  const checks = useMemo(() => division ? questionsFor(division, chapter).map((q) => forAttempt(q, attempt)) : [], [division, chapter, attempt]);
  const currentQuestion = checks[Math.min(questionCursor, Math.max(0, checks.length - 1))];
  const answered = checks.filter((q) => q.kind === 'order' ? (answers[q.id] || []).length === q.options.length : (answers[q.id] || []).length > 0).length;
  const count = saved.completed.length;
  const reading = division ? current.context[division] : null;
  const qualityIssues = validateBank();
  const firstUnfinished = chapters.find((item) => !saved.completed.includes(item.id))?.id || 6;
  const canAssess = chapter <= firstUnfinished || saved.completed.includes(chapter);
  const persist = useCallback((next: SavedProgress, who: Division) => {
    setSaved(next);
    try { localStorage.setItem(saveKey(who), JSON.stringify(next)); } catch { /* Private browser windows can block saving. */ }
  }, []);
  const goTop = () => contentTop.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  useEffect(() => {
    const query = window.matchMedia('(max-width: 1250px)');
    const update = () => setSmallScreen(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!division || stage !== 'checking') return;
    try { localStorage.setItem(draftKey(division, chapter), JSON.stringify({attempt, answers, cursor:questionCursor} satisfies Draft)); }
    catch { /* Local storage can be blocked in private browsing. */ }
  }, [division, chapter, stage, answers, questionCursor, attempt]);
  useEffect(() => {
    if (!handbookOpen) return;
    const previous = document.activeElement;
    focusReturnRef.current = previous instanceof HTMLElement ? previous : null;
    if (smallScreen) handbookCloseRef.current?.focus();
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setHandbookOpen(false); focusReturnRef.current?.focus(); }
      if (smallScreen && event.key === 'Tab') {
        const drawer = document.querySelector('.sg-handbook-drawer');
        if (!drawer) return;
        const focusable = Array.from(drawer.querySelectorAll<HTMLElement>('button:not(:disabled),select,a[href],input:not(:disabled)'));
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [handbookOpen, smallScreen]);
  function closeHandbook() { setHandbookOpen(false); focusReturnRef.current?.focus(); }
  useEffect(() => {
    if (!reportOpen) return;
    const previouslyFocused = document.activeElement;
    reportCloseRef.current?.focus();
    const onReportKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReportOpen(false);
    };
    document.addEventListener('keydown', onReportKey);
    return () => {
      document.removeEventListener('keydown', onReportKey);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [reportOpen]);
  function updateSavedName(value: string) {
    if (!division) return;
    persist({ ...saved, learnerName: value.slice(0, 95) }, division);
  }

  useEffect(() => {
    document.title = division ? 'Safeguarding at AISG | ' + titles[division] + ' Review' : 'Safeguarding at AISG | Review';
  }, [division]);

  useEffect(() => {
    const onPop = () => {
      const next = initialDivision();
      setDivision(next);
      if (next) {
        const progress = getSaved(next);
        setSaved(progress);
        setChapter(Math.min(6, Math.max(1, progress.lastChapter)));
      }
      setStage(next && getSaved(next).completed.length === 6 ? 'finished' : 'reading');
      setAnswers(next ? readDraft(next, getSaved(next).lastChapter, getAttempt(getSaved(next), getSaved(next).lastChapter)).answers : {});
      setQuestionCursor(next ? readDraft(next, getSaved(next).lastChapter, getAttempt(getSaved(next), getSaved(next).lastChapter)).cursor : 0);
      setReview(null); setAcknowledged(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadHandbook() {
      try {
        const configResponse = await fetch(new URL('safeguarding-handbook-source.json', document.baseURI).toString(), { cache: 'no-store' });
        if (configResponse.ok) {
          const config = await configResponse.json() as { pdfUrl?: string; title?: string };
          const address = config.pdfUrl?.trim() || '';
          if (address.startsWith('https://') && !cancelled) {
            setHandbook({ name: config.title || 'AISG Student Safeguarding Handbook', url: address, source: 'approved-link' });
            setBookSourceChecked(true);
            return;
          }
        }
      } catch { /* Hosted handbook configuration is optional. */ }
      try {
        const url = new URL(bookFilename, document.baseURI).toString();
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok && /application\/pdf/i.test(response.headers.get('content-type') || '') && !cancelled) {
          setHandbook({ name: 'AISG Student Safeguarding Handbook', url, source: 'bundled' });
          setBookSourceChecked(true);
          return;
        }
      } catch { /* A handbook has not been approved for public hosting. */ }
      const file = await recallHandbook();
      if (!cancelled && file) setHandbook({ name: file.name, url: URL.createObjectURL(file), source: 'device' });
      if (!cancelled) setBookSourceChecked(true);
    }
    void loadHandbook();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    return () => { if (handbook?.source === 'device') URL.revokeObjectURL(handbook.url); };
  }, [handbook]);

  function chooseDivision(next: Division) {
    const progress = getSaved(next);
    setDivision(next); setSaved(progress);
    const nextChapter = chapters.find((item) => !progress.completed.includes(item.id))?.id || 6;
    setChapter(nextChapter);
    setStage(progress.completed.length === 6 ? 'finished' : 'reading');
    const draft = readDraft(next, nextChapter, getAttempt(progress, nextChapter));
    setAcknowledged(false); setAnswers(draft.answers); setQuestionCursor(draft.cursor); setReview(null);
    const url = new URL(window.location.href);
    url.searchParams.set('division', next);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function switchDivision() {
    setDivision(null); setStage('reading'); setAnswers({}); setQuestionCursor(0); setReview(null); setHandbookOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('division');
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function selectChapter(next: number) {
    if (!division) return;
    const nextSaved = { ...saved, lastChapter: next };
    persist(nextSaved, division);
    const draft = readDraft(division, next, getAttempt(saved, next));
    setChapter(next); setStage('reading'); setAcknowledged(false);
    setAnswers(draft.answers); setQuestionCursor(draft.cursor); setReview(null); goTop();
  }
  function selectOption(q: Question, index: number) {
    setAnswers((old) => {
      const previous = old[q.id] || [];
      if (q.kind === 'single') return { ...old, [q.id]: [index] };
      if (q.kind === 'multi') return { ...old, [q.id]: previous.includes(index) ? previous.filter((i) => i !== index) : [...previous, index] };
      return { ...old, [q.id]: previous.includes(index) ? previous : [...previous, index] };
    });
  }
  function submitChapter() {
    if (!division || answered !== checks.length) return;
    const graded = checks.map((q) => ({ question: q, answer: answers[q.id] || [], correct: sameAnswer(q, answers[q.id] || []) }));
    const score = graded.filter((item) => item.correct).length;
    const pass = score >= 4 && graded.filter((item) => item.question.critical).every((item) => item.correct);
    const tries = { ...saved.tries, [chapter]: (saved.tries[chapter] || 0) + 1 };
    const completed = pass ? Array.from(new Set([...saved.completed, chapter])).sort((a, b) => a - b) : saved.completed;
    const completedAt = completed.length === 6 ? (saved.completedAt || new Date().toISOString()) : saved.completedAt;
    persist({ ...saved, completed, tries, lastChapter: chapter, completedAt }, division);
    try { localStorage.removeItem(draftKey(division, chapter)); } catch { /* No persistent storage. */ }
    setReview({ score, pass, questions: graded });
    setStage('review'); goTop();
  }
  function nextChapter() {
    if (!division) return;
    if (chapter === 6) { setStage('finished'); goTop(); return; }
    const next = chapter + 1;
    persist({ ...saved, lastChapter: next }, division);
    const draft = readDraft(division, next, getAttempt(saved, next));
    setChapter(next); setStage('reading'); setAcknowledged(false); setAnswers(draft.answers); setQuestionCursor(draft.cursor); setReview(null); goTop();
  }
  function retryChapter() {
    setAnswers({}); setQuestionCursor(0); setReview(null); setAcknowledged(false); setStage('reading'); goTop();
  }
  function openPage(page: number) {
    setHandbookPage(page);
    setHandbookOpen(true);
  }
  function setLocalFile(file?: File) {
    if (!file) return;
    if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return;
    setHandbook({ name: file.name, url: URL.createObjectURL(file), source: 'device' });
    void rememberHandbook(file);
    setHandbookOpen(true);
  }

  const brand = <div className="sg-brand">
    {/* oxlint-disable-next-line next/no-img-element -- The GitHub Pages build uses an AISG logo from the local public directory. */}
    <img src="aisg-logo.png" alt="AISG" />
    <div><strong>Student Safeguarding</strong><span>AISG · Handbook-led learning</span></div>
  </div>;

  return <div className="sg-app">
    <a className="sg-skip" href="#sg-main">Skip to course</a>
    <header className="sg-topbar">
      <div className="sg-topbar-content">{brand}
        <div className="sg-topright">

          <button type="button" className="sg-report-trigger" onClick={() => setReportOpen(true)}><ShieldAlert size={16}/> I have a concern</button>
          <span className="sg-draft">Safeguarding Team review · Draft</span>
          {division && <button type="button" className="sg-switch" onClick={switchDivision}>Switch division</button>}
        </div>
      </div>
    </header>

    <input ref={fileInput} type="file" accept="application/pdf,.pdf" hidden aria-label="Select the official AISG Student Safeguarding Handbook PDF" onChange={(event) => { setLocalFile(event.target.files?.[0]); event.target.value = ''; }} />

    {qualityIssues.length > 0 && <div className="sg-quality-warning">Question-bank integrity check: {qualityIssues.join('; ')}</div>}

    {!division ? <main id="sg-main" className="sg-landing">
      <div className="sg-landing-eyebrow"><ShieldCheck size={16} /> AISG professional responsibility · SY2026–27</div>
      <h1>Know the handbook.<br /><em>Protect the student.</em></h1>
      <p className="sg-landing-copy">Safeguarding is more than completing a quiz. Read our handbook, practise making sound decisions, and check your understanding of what protecting children looks like at AISG.</p>
      <div className="sg-rule"><span>1. Read</span><ChevronRight size={16}/><span>2. Find the policy</span><ChevronRight size={16}/><span>3. Apply</span><ChevronRight size={16}/><span>4. Check</span></div>
      <div className="sg-choice-grid">
        <button type="button" className="sg-division-card" onClick={() => chooseDivision('elementary')}>
          <span className="sg-card-top"><span className="sg-number">01</span><span className="sg-arrow"><ArrowRight size={20}/></span></span>
          <span className="sg-card-label">Ersha · Elementary School</span>
          <strong>Safeguarding our younger learners</strong>
          <span className="sg-card-desc">Development, disclosures, personal care, classroom routines, caregiver partnership and excursions.</span>
          <span className="sg-card-foot"><BookOpenCheck size={16}/> Six chapters · 30 checks</span>
        </button>
        <button type="button" className="sg-division-card" onClick={() => chooseDivision('secondary')}>
          <span className="sg-card-top"><span className="sg-number">02</span><span className="sg-arrow"><ArrowRight size={20}/></span></span>
          <span className="sg-card-label">Science Park · Secondary School</span>
          <strong>Safeguarding adolescents and young adults</strong>
          <span className="sg-card-desc">Peer harm, online risks, coaching, professional boundaries, activities, China Trips and overnight stays.</span>
          <span className="sg-card-foot"><BookOpenCheck size={16}/> Six chapters · 30 checks</span>
        </button>
      </div>
      <div className="sg-landing-foot">
        <ShieldCheck size={19}/><p><strong>One AISG standard, two relevant experiences.</strong> Both pathways assess the same essential duty to recognise, respond and report. Scenarios change to reflect the division.</p>
      </div>
    </main> : <main id="sg-main" className={'sg-course' + (handbookOpen ? ' with-handbook' : '')} style={{'--sg-book-width': handbookWidth + 'px'} as CSSProperties} ref={contentTop}>
      <aside className="sg-side" aria-label="Course chapters">
        <p className="sg-side-eyebrow">{titles[division]} pathway</p>
        <h2>Your learning journey</h2>
        <div className="sg-overall"><div><strong>{count} of 6</strong><span>chapters mastered</span></div><div className="sg-progress-track"><span style={{ width: (count / 6 * 100) + '%' }}/></div></div>
        <div className="sg-chapter-list">
          {chapters.map((item) => {
            const done = saved.completed.includes(item.id);
            const assessmentLocked = item.id > firstUnfinished && !done;
            return <button type="button" key={item.id} className={'sg-chapter-nav' + (item.id === chapter ? ' active' : '') + (done ? ' done' : '')}
              aria-current={item.id === chapter ? 'step' : undefined} onClick={() => selectChapter(item.id)}>
              <span className="sg-chapter-num">{done ? <Check size={15}/> : String(item.id).padStart(2, '0')}</span>
              <span><b>{item.title}</b><small>{done ? 'Mastered · Review again' : assessmentLocked ? 'Open to read · Assessment later' : item.subtitle}</small></span>
              {assessmentLocked && <BookOpen size={13}/>}
            </button>;
          })}
        </div>
        <div className="sg-local-note"><LockKeyhole size={15}/><span>Your practice progress stays in this browser. This review is not a formal staff training record.</span></div>
      </aside>

      <section className="sg-mainpanel">
        {stage !== 'finished' ? <>
          <div className="sg-action-strip">
            <span className="sg-chapter-kicker">Chapter {String(chapter).padStart(2,'0')} / 06 · {titles[division]} classroom teachers</span>
            <button type="button" className="sg-handbook-toggle" onClick={() => handbookOpen ? closeHandbook() : openPage(current.refs[0].page)} aria-expanded={handbookOpen}>
              <BookOpen size={16}/>{handbookOpen ? 'Close handbook' : 'Read handbook alongside course'}
            </button>
          </div>
          <h1>{current.title}</h1>
          <p className="sg-chapter-intro">{current.reading}</p>
          <div className="sg-context">
            <div className="sg-context-eyebrow">At AISG · {reading?.headline}</div>
            <p>{reading?.situation}</p>
            <div className="sg-context-tags">{reading?.emphasis.map((e) => <span key={e}>{e}</span>)}</div>
          </div>
        </> : null}

        {stage === 'reading' && <div className="sg-section-block">
          <div className="sg-section-title"><span className="sg-idx">01</span><div><h2>First, read the source</h2><p>Bring the official handbook into the learning—not just its summary.</p></div></div>
          <div className="sg-reference-list">
            {current.refs.map((ref) => <button key={ref.section + ref.page} type="button" onClick={() => openPage(ref.page)} className="sg-reference">
              <span className="sg-ref-icon"><FileText size={20}/></span>
              <span className="sg-ref-copy"><b>{ref.section}</b><small>{ref.focus}</small></span>
              <span className="sg-page">p. {ref.page}</span><ChevronRight size={16}/>
            </button>)}
          </div>
          <div className="sg-section-title sg-lower"><span className="sg-idx">02</span><div><h2>Carry these ideas into practice</h2><p>These are reminders, not a substitute for the official guidance.</p></div></div>
          <div className="sg-principles">{current.principles.map((text, i) => <div key={text}><span>0{i+1}</span><p>{text}</p></div>)}</div>
          <label className="sg-acknowledge" htmlFor="sg-read-confirmation"><input id="sg-read-confirmation" type="checkbox" aria-label="I have consulted the official AISG handbook" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} /><span><b>I have consulted the relevant sections of the official handbook.</b><small>Open the official PDF at the pages above, then confirm you have read the required sections.</small></span></label>
          {!canAssess && <p className="sg-assessment-locked"><LockKeyhole size={18}/> You can read any chapter now. To complete its assessment, first master Chapter {firstUnfinished}.</p>}
          <div className="sg-actions"><button type="button" className="sg-primary" disabled={!acknowledged || !handbook || !canAssess} onClick={() => { setStage('checking'); goTop(); }}>Check my understanding <ArrowRight size={18}/></button></div>
        </div>}

        {stage === 'checking' && <div className="sg-section-block">
          <div className="sg-section-title"><span className="sg-idx">03</span><div><h2>Apply the handbook</h2><p>One decision at a time. Open the handbook whenever you need a policy. Feedback appears after you submit all five.</p></div></div>
          <div className="sg-assessment-head"><span>{answered} of {checks.length} answered · Attempt {attempt}</span><span>Answers saved on this device</span></div>
          <div className="sg-assessment-track"><span style={{width:(answered/checks.length*100)+'%'}} /></div>
          <nav className="sg-question-jump" aria-label="Assessment questions">
            {checks.map((q,i) => <button type="button" key={q.id} onClick={() => { setQuestionCursor(i); goTop(); }}
              className={'sg-question-step' + (i===questionCursor?' active':'') + ((answers[q.id]||[]).length === (q.kind==='order'?q.options.length:1) || (q.kind==='multi' && (answers[q.id]||[]).length>0)?' answered':'')}
              aria-current={i===questionCursor?'step':undefined} aria-label={`Question ${i+1}: ${(answers[q.id]||[]).length?'answered':'not answered'}`}>
              {(answers[q.id]||[]).length ? <Check size={15}/> : i+1}
            </button>)}
          </nav>
          {currentQuestion && <QuestionCard key={currentQuestion.id} question={currentQuestion} number={questionCursor+1} attempt={attempt}
            answer={answers[currentQuestion.id] || []} onChoose={(idx) => selectOption(currentQuestion,idx)}
            onClear={() => setAnswers((a) => ({...a,[currentQuestion.id]:[]}))}
            onReference={() => openPage(currentQuestion.page)}/>}
          <div className="sg-question-controls">
            <button type="button" className="sg-secondary" disabled={questionCursor===0} onClick={() => { setQuestionCursor(i=>Math.max(0,i-1)); goTop(); }}><ChevronLeft size={16}/> Previous</button>
            <span>Question {questionCursor+1} of {checks.length}</span>
            {questionCursor < checks.length-1 ?
              <button type="button" className="sg-primary" onClick={() => { setQuestionCursor(i=>Math.min(checks.length-1,i+1)); goTop(); }}>Next question <ArrowRight size={17}/></button> :
              <button type="button" className="sg-primary" disabled={answered!==checks.length} onClick={submitChapter}>Review my answers <ArrowRight size={17}/></button>}
          </div>
          {questionCursor===checks.length-1 && answered!==checks.length && <p className="sg-small-hint">Please answer every question before submitting. Use the numbered navigation above to find any you missed.</p>}
          <p className="sg-mastery-note">Mastery: at least 4 of 5 correct, including every critical safeguarding decision. If you need another attempt, you will see alternative policy scenarios.</p>
        </div>}

        {stage === 'review' && review && <div className="sg-section-block">
          <div className={'sg-score-summary ' + (review.pass ? 'is-pass':'is-review')}>
            {review.pass ? <CheckCircle2 size={27}/> : <BookOpen size={27}/>}
            <div><span>{review.pass ? 'Chapter mastered' : 'Return to the handbook'}</span><h2>{review.score} of {review.questions.length} correct</h2>
              <p>{review.pass ? 'You demonstrated the required understanding for this chapter.' : 'Review the references below. Every critical safeguarding decision needs to be correct.'}</p></div>
          </div>
          <h2 className="sg-feedback-title">Review the evidence</h2>
          {review.questions.map(({question,correct},i) => <div key={question.id} className="sg-feedback-item">
            <div className="sg-feedback-heading"><span className={correct?'sg-ok':'sg-attention'}>{correct?<CheckCircle2 size={17}/>:<BookOpen size={17}/>} {correct?'Understood':'Revisit'}</span><span>Question {i+1}</span></div>
            <h3>{question.prompt}</h3>
            <p>{question.why}</p>
            {!correct && <p className="sg-feedback-correction"><strong>Handbook-aligned response:</strong> {question.correct.map((n,i)=>String(i+1)+'. '+question.options[n]).join(' · ')}</p>}
            <button type="button" className="sg-inline-link" onClick={()=>openPage(question.page)}>Review {question.section} · p. {question.page} <ArrowRight size={14}/></button>
          </div>)}
          <div className="sg-actions">{review.pass ? <button type="button" className="sg-primary" onClick={nextChapter}>{chapter===6?'See pathway summary':'Continue to chapter '+(chapter+1)} <ArrowRight size={18}/></button> : <button type="button" className="sg-primary" onClick={retryChapter}>Revisit and attempt again <RotateCcw size={17}/></button>}</div>
        </div>}

        {stage === 'finished' && <div className="sg-finish">
          <div className="sg-finish-mark"><Award size={35}/></div>
          <p className="sg-finish-kicker">{titles[division]} pathway · All six chapters mastered</p>
          <h1>Safeguarding begins with what we do next.</h1>
          <p>You&apos;ve completed the classroom-teacher pathway and thirty handbook-grounded checks. Keep the handbook available and follow AISG&apos;s current reporting procedures if you have a real concern.</p>
          <div className="sg-finish-stats"><span><b>06</b><small>Chapters</small></span><span><b>30</b><small>Checks</small></span><span><b>100%</b><small>Chapters mastered</small></span></div>
          <div className="sg-certificate-controls">
            <div><h2>Your completion certificate</h2><p>Enter your name as it should appear. You can then print the certificate or save it as a PDF using your browser.</p></div>
            <label htmlFor="sg-certificate-name">Name on certificate</label>
            <input id="sg-certificate-name" type="text" maxLength={95} autoComplete="name"
              placeholder="Your full name" value={saved.learnerName || ''} onChange={(e) => updateSavedName(e.target.value)}/>
            <button type="button" className="sg-primary" disabled={!(saved.learnerName || '').trim()} onClick={() => window.print()}><Printer size={18}/> Print / Save as PDF</button>
            <p className="sg-cert-disclosure">This review certificate is self-generated from browser-local progress. It does not verify identity or replace AISG&apos;s official staff training records.</p>
          </div>
          <Certificate division={division} name={(saved.learnerName || '').trim()} date={saved.completedAt || new Date().toISOString()}/>
          <div className="sg-finish-actions"><button className="sg-secondary" type="button" onClick={()=>selectChapter(1)}>Revisit the learning <ArrowLeft size={16}/></button></div>
        </div>}
      </section>

      <aside className="sg-resources" aria-label="Handbook support">
        <div className="sg-resource-card">
          <div className="sg-resource-icon"><BookOpen size={24}/></div>
          <div className="sg-resource-eyebrow">Your source of truth</div><h2>AISG Student Safeguarding Handbook</h2>
          <p>May 2026 revision · 39 pages. The questions reference the handbook&apos;s printed page numbers.</p>
          <button type="button" className="sg-book-button" onClick={() => openPage(current.refs[0].page)}>{handbook ? 'Read handbook · open PDF' : bookSourceChecked ? 'Connect official handbook' : 'Checking handbook…'} <ArrowRight size={16}/></button>
          <p className="sg-private"><BookOpenCheck size={14}/> Official May 2026 handbook · Embedded directly from AISG&apos;s GitHub course.</p>
        </div>
        {stage !== 'finished' && <div className="sg-tip"><span>READING FOCUS</span><p>{current.reading}</p><button type="button" className="sg-inline-link" onClick={() => openPage(current.refs[0].page)}>Open starting page <ArrowRight size={14}/></button></div>}
        <div className="sg-safety"><ShieldCheck size={18}/><p>This learning activity does not receive confidential safeguarding reports. For a real concern, use the reporting guidance at the top of the page.</p></div>
      </aside>
      {handbookOpen && <div className={'sg-book-shell' + (smallScreen ? ' mobile' : '')}>
        {smallScreen && <button type="button" className="sg-modal-backdrop" aria-label="Close handbook viewer" onClick={closeHandbook}/>}
        <aside className="sg-handbook-drawer" role={smallScreen ? 'dialog' : 'region'} aria-modal={smallScreen ? true : undefined}
          aria-label="AISG Student Safeguarding Handbook reader">
          <div className="sg-drawer-header"><div><span>OFFICIAL HANDBOOK · 39 PAGES</span><h2>Read alongside the course</h2></div>
            <button ref={handbookCloseRef} className="sg-icon-button" type="button" aria-label="Close handbook reader" onClick={closeHandbook}><X size={22}/></button></div>
          <div className="sg-drawer-tools">
            <label htmlFor="sg-page">Handbook page</label>
            <select id="sg-page" value={handbookPage} onChange={(e) => setHandbookPage(Number(e.target.value))}>{Array.from({length:39},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select>
            {!smallScreen && <label className="sg-resize-control">Width
              <input type="range" min="410" max="760" step="10" value={handbookWidth} aria-label="Adjust handbook width"
                onChange={(e) => setHandbookWidth(Number(e.target.value))}/></label>}
            {handbook && <a className="sg-secondary small" target="_blank" rel="noreferrer" href={handbook.url + '#page=' + handbookPage}><BookOpen size={15}/> Full PDF</a>}
          </div>
          {handbook ? <><iframe key={handbook.url + '#' + handbookPage} className="sg-pdf-frame"
            title={'AISG Student Safeguarding Handbook — page '+handbookPage}
            src={handbook.url + '#page=' + handbookPage + '&view=FitH'}/>
            <p className="sg-pdf-note">Page {handbookPage} · May 2026. The course remains usable alongside this viewer on desktop. <a href={handbook.url + '#page=' + handbookPage} target="_blank" rel="noreferrer">Open the handbook in a separate tab</a>.</p></>
            : <div className="sg-empty-pdf"><BookOpen size={42}/><h3>Handbook unavailable</h3><p>Try opening the PDF in a separate tab. If it remains unavailable, contact AISG support before continuing.</p></div>}
        </aside>
      </div>}
    </main>

    <footer className="sg-footer"><span>American International School of Guangzhou</span><span>Draft for team review · Browser-based learning, not an official staff training record</span></footer>
    {reportOpen && <div className="sg-report-overlay">
      <button type="button" className="sg-modal-backdrop" aria-label="Close reporting guidance" onClick={()=>setReportOpen(false)}/>
      <section role="dialog" aria-modal="true" aria-labelledby="sg-report-title" className="sg-report-dialog">
        <div className="sg-report-dialog-top"><ShieldAlert size={25}/><button ref={reportCloseRef} type="button" className="sg-icon-button" onClick={()=>setReportOpen(false)} aria-label="Close reporting guidance"><X size={20}/></button></div>
        <p className="sg-report-eyebrow">Real safeguarding concern · AISG procedures</p>
        <h2 id="sg-report-title">A real concern? Use the reporting pathway, not this course.</h2>
        <p>All AISG employees must promptly report suspected abuse or neglect when they have reasonable cause to believe a student has experienced harm or may be at risk. You do not need to investigate or establish proof.</p>
        <div className="sg-report-steps">
          <div><b>Concern about a student</b><p>Contact the appropriate divisional Student Safeguarding Lead and follow the official reporting pathway (Handbook §§4.1–4.2, pages 11–13). If a child is in immediate danger, take the necessary immediate safety action and contact safeguarding leadership/emergency responders as applicable.</p></div>
          <div><b>Concern about an adult</b><p>Report to the divisional principal. If the concern involves the principal, refer to the Head of School / School Safeguarding Coordinator (Handbook §7.3, page 27).</p></div>
        </div>
        <p className="sg-report-warning">This website does not submit or store any safeguarding reports. Do not enter real students&apos; names or personal details here.</p>
        <div className="sg-report-links"><a target="_blank" rel="noreferrer" href={new URL(bookFilename, document.baseURI).toString()+'#page=13'}>View reporting flowchart · p. 13 <ArrowRight size={15}/></a>
          <a target="_blank" rel="noreferrer" href={new URL(bookFilename, document.baseURI).toString()+'#page=27'}>Adult conduct protocol · p. 27 <ArrowRight size={15}/></a></div>
      </section>
    </div>}


  </div>;
}

function Certificate({division,name,date}:{division:Division;name:string;date:string}) {
  const formatted = new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(new Date(date));
  return <div className="sg-certificate" aria-label="Preview of printable safeguarding completion certificate">
    <div className="sg-certificate-border">
      <div className="sg-cert-brand">
        {/* oxlint-disable-next-line next/no-img-element -- Static school logo, compatible with browser printing. */}
        <img src="aisg-logo.png" alt="AISG"/>
        <span>AMERICAN INTERNATIONAL SCHOOL OF GUANGZHOU</span>
      </div>
      <div className="sg-cert-ornament"><ShieldCheck size={31}/></div>
      <p className="sg-cert-overline">Professional Learning · School Year 2026–27</p>
      <h2>Certificate of Completion</h2>
      <p className="sg-cert-presented">Presented to</p>
      <strong className="sg-cert-name">{name || 'Your name here'}</strong>
      <p className="sg-cert-for">for completing the</p>
      <h3>AISG Student Safeguarding · {titles[division]} Pathway</h3>
      <p className="sg-cert-description">Six handbook-led chapters · Thirty understanding checks<br/>Relevant to AISG classroom teachers and student safety.</p>
      <div className="sg-cert-date">Completed {formatted} <span>•</span> Handbook revision May 2026</div>
      <div className="sg-cert-foot">Safeguarding Team review edition · Self-generated browser completion record · Not verified official staff certification</div>
    </div>
  </div>;
}


function QuestionCard({question,number,attempt,answer,onChoose,onClear,onReference}:{
  question:Question;number:number;attempt:number;answer:number[];
  onChoose:(idx:number)=>void;onClear:()=>void;onReference:()=>void;
}) {
  const order = optionSequence(question,attempt);
  const typeLabel = question.kind==='multi'?'Select all that apply':question.kind==='order'?'Select the actions in sequence':'Select one response';
  const isOrder = question.kind==='order';
  return <fieldset className="sg-question" aria-describedby={'sg-scenario-'+question.id}>
    <legend className="sg-question-top"><span>QUESTION {String(number).padStart(2,'0')}</span><span>{typeLabel}</span>
      {question.critical && <span className="sg-critical"><ShieldCheck size={13}/> Critical decision</span>}</legend>
    <p id={'sg-scenario-'+question.id} className="sg-scenario">{question.scenario}</p>
    <h3>{question.prompt}</h3>
    {question.lookUp && <p className="sg-evidence-note"><BookOpenCheck size={17}/> Handbook reference · Find the requirement before choosing.</p>}
    {isOrder && <p className="sg-order-hint">Select each action in the order it should happen. Numbers show your sequence. Use Reset order to start again.</p>}
    <div className="sg-options">{order.map((idx,displayIndex)=>{
      const selected=answer.includes(idx);
      const content=<><span className="sg-option-marker" aria-hidden="true">
          {isOrder ? (selected ? String(answer.indexOf(idx)+1) : '—') :
            question.kind==='multi' ? (selected ? <Check size={16}/> : null) : String.fromCharCode(65+displayIndex)}
        </span><span>{question.options[idx]}</span></>;
      return isOrder ?
        <button key={idx} type="button" className={'sg-option'+(selected?' selected':'')}
          aria-pressed={selected} aria-label={question.options[idx]+(selected?', position '+(answer.indexOf(idx)+1):', not yet selected')}
          onClick={()=>onChoose(idx)}>{content}</button> :
        <label key={idx} className={'sg-option'+(selected?' selected':'')}>
          <input type={question.kind==='single'?'radio':'checkbox'} name={'sg-answer-'+question.id}
            checked={selected} onChange={()=>onChoose(idx)} value={String(idx)}/>
          {content}
        </label>;
    })}</div>
    <div className="sg-question-foot">
      <button type="button" className="sg-inline-link" onClick={onReference}><BookOpen size={15}/> View {question.section} · p. {question.page}</button>
      {isOrder&&answer.length>0&&<button type="button" className="sg-inline-link" onClick={onClear}><RotateCcw size={14}/> Reset order</button>}
    </div>
  </fieldset>;
}

createRoot(document.getElementById('root')!).render(<App/>);
