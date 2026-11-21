import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, BookOpen, BookOpenCheck, Check, CheckCircle2, ChevronRight, FileText, LockKeyhole, RotateCcw, ShieldCheck, UploadCloud, X } from 'lucide-react';
import { chapters, questionsFor, validateBank, type Division, type Question } from './safeguarding-v2-data';
import './safeguarding-v2.css';

type Stage = 'reading' | 'checking' | 'review' | 'finished';
type SavedProgress = { completed: number[]; lastChapter: number; tries: Record<number, number> };
type Review = { score: number; pass: boolean; questions: { question: Question; correct: boolean; answer: number[] }[] };
type Handbook = { name: string; url: string; source: 'bundled' | 'approved-link' | 'device' };
const titles: Record<Division, string> = { elementary: 'Elementary', secondary: 'Secondary' };
const saveKey = (division: Division) => 'aisg-safeguarding-v2-review-' + division;
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
    return { completed, lastChapter: Number(parsed.lastChapter) || 1, tries: parsed.tries || {} };
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
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [review, setReview] = useState<Review | null>(null);
  const [handbook, setHandbook] = useState<Handbook | null>(null);
  const [bookSourceChecked, setBookSourceChecked] = useState(false);
  const [handbookOpen, setHandbookOpen] = useState(false);
  const [handbookPage, setHandbookPage] = useState(4);
  const fileInput = useRef<HTMLInputElement>(null);
  const contentTop = useRef<HTMLElement>(null);
  const current = chapters[chapter - 1];
  const checks = useMemo(() => division ? questionsFor(division, chapter) : [], [division, chapter]);
  const attempt = (saved.tries[chapter] || 0) + 1;
  const answered = checks.filter((q) => (answers[q.id] || []).length > 0).length;
  const count = saved.completed.length;
  const reading = division ? current.context[division] : null;
  const qualityIssues = validateBank();
  const persist = useCallback((next: SavedProgress, who: Division) => {
    setSaved(next);
    try { localStorage.setItem(saveKey(who), JSON.stringify(next)); } catch { /* Private browser windows can block saving. */ }
  }, []);
  const goTop = () => contentTop.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });

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
      setStage('reading'); setAnswers({}); setReview(null); setAcknowledged(false);
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
    setAcknowledged(false); setAnswers({}); setReview(null);
    const url = new URL(window.location.href);
    url.searchParams.set('division', next);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function switchDivision() {
    setDivision(null); setStage('reading'); setAnswers({}); setReview(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('division');
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function selectChapter(next: number) {
    if (!division) return;
    const earliestIncomplete = chapters.find((item) => !saved.completed.includes(item.id))?.id || 6;
    if (next > earliestIncomplete) return;
    const nextSaved = { ...saved, lastChapter: next };
    persist(nextSaved, division);
    setChapter(next); setStage('reading'); setAcknowledged(false);
    setAnswers({}); setReview(null); goTop();
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
    persist({ completed, tries, lastChapter: chapter }, division);
    setReview({ score, pass, questions: graded });
    setStage('review'); goTop();
  }
  function nextChapter() {
    if (!division) return;
    if (chapter === 6) { setStage('finished'); goTop(); return; }
    const next = chapter + 1;
    persist({ ...saved, lastChapter: next }, division);
    setChapter(next); setStage('reading'); setAcknowledged(false); setAnswers({}); setReview(null); goTop();
  }
  function retryChapter() {
    setAnswers({}); setReview(null); setAcknowledged(false); setStage('reading'); goTop();
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
    </main> : <main id="sg-main" className="sg-course" ref={contentTop}>
      <aside className="sg-side" aria-label="Course chapters">
        <p className="sg-side-eyebrow">{titles[division]} pathway</p>
        <h2>Your learning journey</h2>
        <div className="sg-overall"><div><strong>{count} of 6</strong><span>chapters mastered</span></div><div className="sg-progress-track"><span style={{ width: (count / 6 * 100) + '%' }}/></div></div>
        <div className="sg-chapter-list">
          {chapters.map((item) => {
            const done = saved.completed.includes(item.id);
            const earliest = chapters.find((x) => !saved.completed.includes(x.id))?.id || 6;
            const locked = item.id > earliest;
            return <button type="button" key={item.id} className={'sg-chapter-nav' + (item.id === chapter ? ' active' : '') + (done ? ' done' : '')}
              disabled={locked} aria-current={item.id === chapter ? 'step' : undefined} onClick={() => selectChapter(item.id)}>
              <span className="sg-chapter-num">{done ? <Check size={15}/> : String(item.id).padStart(2, '0')}</span>
              <span><b>{item.title}</b><small>{locked ? 'Complete earlier chapters' : done ? 'Mastered' : item.subtitle}</small></span>
              {locked && <LockKeyhole size={13}/>}
            </button>;
          })}
        </div>
        <div className="sg-local-note"><LockKeyhole size={15}/><span>Your practice progress stays in this browser. This review is not a formal staff training record.</span></div>
      </aside>

      <section className="sg-mainpanel">
        {stage !== 'finished' ? <>
          <div className="sg-chapter-kicker"><span>Chapter {String(chapter).padStart(2,'0')} / 06</span><span className="sg-small-divider">·</span><span>{current.subtitle}</span></div>
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
          <div className="sg-actions"><button type="button" className="sg-primary" disabled={!acknowledged || !handbook} onClick={() => { setStage('checking'); goTop(); }}>Check my understanding <ArrowRight size={18}/></button></div>
        </div>}

        {stage === 'checking' && <div className="sg-section-block">
          <div className="sg-section-title"><span className="sg-idx">03</span><div><h2>Apply the handbook</h2><p>Five decisions. No answer feedback until you finish. Use the official handbook when you need it.</p></div></div>
          <div className="sg-assessment-head"><span>{answered} / {checks.length} answered</span><span>Attempt {attempt} · Open handbook assessment</span></div>
          <div className="sg-assessment-track"><span style={{width:(answered/checks.length*100)+'%'}} /></div>
          {checks.map((question,i) => <QuestionCard key={question.id} question={question} number={i+1} attempt={attempt}
            answer={answers[question.id] || []} onChoose={(idx) => selectOption(question,idx)} onClear={() => setAnswers((a) => ({...a,[question.id]:[]}))}
            onReference={() => openPage(question.page)}/>)}
          <div className="sg-assessment-submit"><p>Answers are checked together. You need at least 4/5 correct and all critical safeguarding decisions correct to master this chapter.</p><button type="button" className="sg-primary" disabled={answered!==checks.length} onClick={submitChapter}>Check this chapter <ArrowRight size={18}/></button></div>
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
          <div className="sg-finish-mark"><ShieldCheck size={35}/></div>
          <p className="sg-finish-kicker">{titles[division]} pathway · Review complete</p>
          <h1>Safeguarding begins with what we do next.</h1>
          <p>You&apos;ve reviewed six chapters and completed thirty handbook-grounded checks. Keep the handbook available and use AISG&apos;s current safeguarding reporting procedures whenever a real concern arises.</p>
          <div className="sg-finish-stats"><span><b>06</b><small>Chapters</small></span><span><b>30</b><small>Checks</small></span><span><b>100%</b><small>Chapters mastered</small></span></div>
          <p className="sg-note-strong">This is a browser-based review, not an authorised completion certificate or an official employee record. The Safeguarding Team must approve final content and assessment settings.</p>
          <button className="sg-secondary" type="button" onClick={()=>selectChapter(1)}>Revisit the handbook and course <ArrowLeft size={16}/></button>
        </div>}
      </section>

      <aside className="sg-resources" aria-label="Handbook support">
        <div className="sg-resource-card">
          <div className="sg-resource-icon"><BookOpen size={24}/></div>
          <div className="sg-resource-eyebrow">Your source of truth</div><h2>AISG Student Safeguarding Handbook</h2>
          <p>May 2026 revision · 39 pages. The questions reference the handbook&apos;s printed page numbers.</p>
          <button type="button" className="sg-book-button" onClick={() => openPage(current.refs[0].page)}>{handbook ? 'Read handbook · open PDF' : bookSourceChecked ? 'Connect official handbook' : 'Checking handbook…'} <ArrowRight size={16}/></button>
          <p className="sg-private"><LockKeyhole size={14}/>{handbook?.source === 'device' ? 'Your PDF is saved only in this browser for future visits.' : handbook ? 'Access to the handbook follows the hosting source permissions.' : 'The handbook is not uploaded to this public site.'}</p>
        </div>
        {stage !== 'finished' && <div className="sg-tip"><span>READING FOCUS</span><p>{current.reading}</p><button type="button" className="sg-inline-link" onClick={() => openPage(current.refs[0].page)}>Open starting page <ArrowRight size={14}/></button></div>}
        <div className="sg-safety"><ShieldCheck size={18}/><p>This learning activity does not receive confidential safeguarding reports. For a real concern, stop and follow AISG&apos;s current procedures.</p></div>
      </aside>
    </main>}

    <footer className="sg-footer"><span>American International School of Guangzhou</span><span>Draft for internal review · Not an authorised safeguarding certification</span></footer>

    {handbookOpen && <div className="sg-modal-wrap" role="presentation">
      <button type="button" className="sg-modal-backdrop" aria-label="Close handbook viewer" onClick={() => setHandbookOpen(false)}/>
      <aside className="sg-handbook-drawer" aria-label="Handbook viewer">
        <div className="sg-drawer-header"><div><span>OFFICIAL SOURCE</span><h2>Student Safeguarding Handbook</h2></div><button className="sg-icon-button" type="button" aria-label="Close handbook" onClick={() => setHandbookOpen(false)}><X size={22}/></button></div>
        <div className="sg-drawer-tools"><label htmlFor="sg-page">Page</label><select id="sg-page" value={handbookPage} onChange={(e) => setHandbookPage(Number(e.target.value))}>{Array.from({length:39},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select><button type="button" className="sg-secondary small" onClick={() => fileInput.current?.click()}><UploadCloud size={15}/> {handbook ? 'Replace PDF':'Choose PDF'}</button></div>
        {handbook ? <><iframe key={handbook.url + '#' + handbookPage} className="sg-pdf-frame" title="AISG Student Safeguarding Handbook PDF viewer" src={handbook.url + '#page=' + handbookPage + '&view=FitH'}/><p className="sg-pdf-note">Source: {handbook.name}. Use the page selector above to jump to a handbook reference. If your organisation blocks embedding, <a target="_blank" rel="noreferrer" href={handbook.url + '#page=' + handbookPage}>open the PDF in a new tab</a>.</p></>
          : <div className="sg-empty-pdf"><BookOpen size={42}/><h3>Official handbook not connected</h3><p>The site is ready to display the PDF automatically, but an approved hosted copy must be linked before it can be offered to everyone. In the meantime, choose the handbook once on this device; it will be remembered here for subsequent visits.</p><button type="button" className="sg-primary" onClick={() => fileInput.current?.click()}><UploadCloud size={17}/> Choose official PDF once</button><small>This does not publish the handbook or upload it to the public site.</small></div>}
      </aside>
    </div>}
  </div>;
}

function QuestionCard({question,number,attempt,answer,onChoose,onClear,onReference}:{
  question:Question;number:number;attempt:number;answer:number[];onChoose:(idx:number)=>void;onClear:()=>void;onReference:()=>void;
}) {
  const order = optionSequence(question,attempt);
  const typeLabel = question.kind==='multi'?'Choose all that apply':question.kind==='order'?'Select actions in the correct order':'Choose one response';
  return <article className="sg-question">
    <div className="sg-question-top"><span>CHECK {String(number).padStart(2,'0')}</span><span>{typeLabel}</span>{question.critical && <span className="sg-critical"><ShieldCheck size={13}/> Critical</span>}</div>
    <p className="sg-scenario">{question.scenario}</p><h3>{question.prompt}</h3>
    {question.lookUp && <div className="sg-evidence-note"><BookOpenCheck size={16}/> Handbook lookup · Find the rule before choosing.</div>}
    <div className="sg-options">{order.map((idx,displayIndex)=>{
      const selected=answer.includes(idx);
      return <button key={idx} type="button" className={'sg-option'+(selected?' selected':'')} aria-pressed={selected} onClick={()=>onChoose(idx)}>
        <span className="sg-option-marker">{question.kind==='order'?(selected?String(answer.indexOf(idx)+1):'—'):(question.kind==='multi'?(selected?<Check size={15}/>:null):String.fromCharCode(65+displayIndex))}</span>
        <span>{question.options[idx]}</span>
      </button>;
    })}</div>
    <div className="sg-question-foot"><button type="button" className="sg-inline-link" onClick={onReference}><BookOpen size={14}/> Refer to {question.section}, p. {question.page}</button>
      {question.kind==='order'&&answer.length>0&&<button type="button" className="sg-inline-link" onClick={onClear}><RotateCcw size={13}/> Reset order</button>}</div>
  </article>;
}

createRoot(document.getElementById('root')!).render(<App/>);
