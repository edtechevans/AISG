'use client';

import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { ArrowRight, BookOpen, Bot, Compass, Lightbulb, Link2, MessageCircle, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import CourseMark from '@/app/course-mark';
import { Button } from '@/components/ui/button';
import { COURSE_BY_ID, isCourseId, type CourseId } from '@/lib/course-catalog';
import { COURSE_CONNECTIONS } from '@/lib/course-connections';
import { COMPANION_KNOWLEDGE } from '@/lib/learning-companion-knowledge';
import { FEATURE_FLAGS } from '@/lib/feature-flags';

type CompanionStage = 'course-home' | 'learn' | 'check' | 'practice' | 'result';
type CompanionContext = {
  course: CourseId;
  stage: CompanionStage;
  sectionTitle: string;
  summary: string;
  body: string;
  takeaways: string[];
};

type CompanionMode = 'ai' | 'browser' | 'safety' | 'locked';

type Message = {
  id: number;
  course: CourseId;
  role: 'user' | 'assistant';
  text: string;
  sources?: string[];
  mode?: CompanionMode;
};

type QuickAction = 'explain' | 'tlf' | 'challenge' | 'apply' | 'culture' | 'connect';

const QUICK_ACTIONS: { id: QuickAction; label: string; icon: typeof Lightbulb }[] = [
  { id: 'explain', label: 'Explain differently', icon: BookOpen },
  { id: 'tlf', label: 'Connect to TLF', icon: Compass },
  { id: 'challenge', label: 'Challenge my thinking', icon: Sparkles },
  { id: 'apply', label: 'Apply this tomorrow', icon: ArrowRight },
  { id: 'culture', label: 'Cultural lens', icon: ShieldCheck },
  { id: 'connect', label: 'Connect another course', icon: Link2 },
];

function textOf(selector: string, root: Document | Element = document) {
  return root.querySelector(selector)?.textContent?.trim() || '';
}

function inferContext(): CompanionContext | null {
  if (typeof window === 'undefined') return null;
  const courseParam = new URLSearchParams(window.location.search).get('course');
  if (!courseParam || !isCourseId(courseParam)) return null;

  const catalog = COURSE_BY_ID[courseParam];
  const lesson = document.querySelector('.lesson-card');
  if (lesson) {
    return {
      course: courseParam,
      stage: 'learn',
      sectionTitle: textOf('h1', lesson) || catalog.title,
      summary: textOf('.intro-summary', lesson) || catalog.description,
      body: textOf('.lesson-copy', lesson),
      takeaways: [...lesson.querySelectorAll('.takeaway-list span')].map((item) => item.textContent?.trim() || '').filter(Boolean),
    };
  }

  if (document.querySelector('.question-card')) {
    return {
      course: courseParam,
      stage: 'check',
      sectionTitle: catalog.title,
      summary: 'This is a formal learning check. The companion will not choose or reveal an answer.',
      body: '',
      takeaways: [],
    };
  }

  if (document.querySelector('.practice-options')) {
    return {
      course: courseParam,
      stage: 'practice',
      sectionTitle: 'Take it into practice',
      summary: 'Use the learning to choose a realistic professional next move.',
      body: '',
      takeaways: [],
    };
  }

  if (document.querySelector('.results-card')) {
    return {
      course: courseParam,
      stage: 'result',
      sectionTitle: 'Course reflection',
      summary: 'Review what you learned and what you want to carry into practice.',
      body: '',
      takeaways: [],
    };
  }

  return {
    course: courseParam,
    stage: 'course-home',
    sectionTitle: catalog.title,
    summary: catalog.intro || catalog.description,
    body: '',
    takeaways: [],
  };
}

function browserSources(context: CompanionContext) {
  return context.stage === 'learn'
    ? [`Current course page · ${COURSE_BY_ID[context.course].title}`, ...COMPANION_KNOWLEDGE[context.course].sources.slice(0, 2)]
    : COMPANION_KNOWLEDGE[context.course].sources.slice(0, 3);
}

function browserAnswer(action: QuickAction | undefined, prompt: string, context: CompanionContext) {
  const knowledge = COMPANION_KNOWLEDGE[context.course];
  const normalized = prompt.toLowerCase();
  const sensitive = /(real student|student name|named student|disclos|abuse|self-harm|safeguard|report a concern|child protection|cpoms|student id|date of birth)/i.test(prompt);
  if (sensitive) {
    return 'Please do not enter student names or identifying information. If this concerns a real student, rewrite it as a de-identified professional-learning scenario. If there is a safeguarding concern, follow current AISG safeguarding and reporting procedures rather than using the Learning Companion for case advice.';
  }
  if (action === 'tlf' || /(tlf|personalisation|personalization|agency|authentic|creativ|collabor|taking action)/.test(normalized)) return knowledge.tlf;
  if (action === 'culture' || /(china|guangzhou|culture|cultural|language|multilingual|mandarin|cantonese|local context)/.test(normalized)) return knowledge.culture;
  if (action === 'connect') {
    const links = COURSE_CONNECTIONS[context.course].slice(0, 2).map((connection) => `${COURSE_BY_ID[connection.course].title}: ${connection.reason}`);
    return `Two useful connections are:\n\n${links.join('\n\n')}\n\nUse the connection only if it helps you see the current professional question from a genuinely different angle.`;
  }
  if (action === 'challenge' || /(challenge|assumption|blind spot|another lens|alternative)/.test(normalized)) {
    return 'Test your current interpretation against the learner evidence. What are you assuming that the evidence does not yet establish? What is one plausible alternative explanation? Then ask what you would need to see in learner talk, choices, work, relationships or action before becoming more confident in your judgement.';
  }
  if (action === 'apply' || /(apply|tomorrow|try|next move|lesson|practice)/.test(normalized)) {
    return 'Take one principle from this section and make the next move deliberately small. Preserve the worthwhile learning, change one feature of the design or interaction, and decide in advance what learner evidence you will notice. The strongest follow-up question is not “Did I use the strategy?” but “What changed for learners, for whom, and what should I adjust next?”';
  }
  const core = context.summary || context.body || COURSE_BY_ID[context.course].description;
  if (action === 'explain') return `Put simply: ${core} The important distinction is between the presence of a strategy and evidence that it improved the learner experience. Ask what students would say, do, choose, create, revise or transfer if the principle were genuinely stronger.`;
  return `I would test your question against this section’s central idea: ${core} Stay with the learner evidence. What would students say, do, choose, create or revise if the principle were genuinely stronger — and what evidence might point you toward a different interpretation?`;
}

export default function LearningCompanion() {
  const [context, setContext] = useState<CompanionContext | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [serviceMode, setServiceMode] = useState<'unknown' | 'ai' | 'browser'>('unknown');
  const messageId = useRef(0);

  useEffect(() => {
    if (!FEATURE_FLAGS.learningCompanion) return;
    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = inferContext();
        setContext((current) => {
          const currentKey = current ? `${current.course}:${current.stage}:${current.sectionTitle}:${current.body}` : '';
          const nextKey = next ? `${next.course}:${next.stage}:${next.sectionTitle}:${next.body}` : '';
          return currentKey === nextKey ? current : next;
        });
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener('popstate', sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('popstate', sync);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const locked = context?.stage === 'check';
  const courseTitle = context ? COURSE_BY_ID[context.course].title : '';
  const intro = useMemo(() => {
    if (!context) return '';
    if (context.stage === 'check') return 'This is a learning check. I will not choose or reveal an answer. Finish the check using your own judgement; then return to the learning if you want help unpacking the principle.';
    if (context.stage === 'practice') return 'Use me to test or sharpen the professional move you want to take into practice.';
    return 'Understand it, question it, connect it and apply it. The companion stays grounded in the current course and AISG learning context.';
  }, [context]);

  if (!FEATURE_FLAGS.learningCompanion || !context) return null;
  const currentContext = context;
  const visibleMessages = messages.filter((message) => message.course === currentContext.course);

  function addMessage(message: Omit<Message, 'id' | 'course'>) {
    const id = ++messageId.current;
    setMessages((current) => [...current, { ...message, id, course: currentContext.course }]);
  }

  async function ask(prompt: string, action?: QuickAction) {
    if (locked || thinking || !prompt.trim()) return;
    const userText = prompt.trim();
    addMessage({ role: 'user', text: userText });
    setThinking(true);

    try {
      const response = await fetch('/api/learning-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentContext,
          prompt: userText,
          action,
          messages: visibleMessages.slice(-6).map((message) => ({ role: message.role, text: message.text })),
        }),
      });
      const data = await response.json().catch(() => null) as { answer?: string; sources?: string[]; mode?: CompanionMode; error?: string } | null;
      if (response.ok && data?.answer) {
        setServiceMode(data.mode === 'ai' ? 'ai' : 'browser');
        addMessage({ role: 'assistant', text: data.answer, sources: data.sources || browserSources(currentContext), mode: data.mode || 'ai' });
        setThinking(false);
        return;
      }
    } catch {
      // The public GitHub Pages build intentionally has no secure server-side AI route.
    }

    setServiceMode('browser');
    addMessage({ role: 'assistant', text: browserAnswer(action, userText, currentContext), sources: browserSources(currentContext), mode: 'browser' });
    setThinking(false);
  }

  function handleAction(action: QuickAction, label: string) {
    void ask(label, action);
  }

  function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || locked || thinking) return;
    setInput('');
    void ask(prompt);
  }

  return <>
    <button type="button" className={`learning-companion-trigger ${open ? 'is-open' : ''}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="learning-companion-panel">
      <span className="learning-companion-trigger-icon"><MessageCircle aria-hidden="true" /></span>
      <span><strong>Learning Companion</strong><small>{serviceMode === 'ai' ? 'AI · AISG grounded' : serviceMode === 'browser' ? 'Browser-grounded mode' : 'Think with the course'}</small></span>
    </button>

    {open && <dialog id="learning-companion-panel" className="learning-companion-panel" open aria-label={`Learning Companion for ${courseTitle}`}>
      <header className="learning-companion-header">
        <div className="learning-companion-course"><CourseMark course={currentContext.course} size="record" /><div><p className="tiny-eyebrow">Learning Companion</p><strong>{courseTitle}</strong></div></div>
        <div className="learning-companion-header-actions"><span className={`companion-mode-badge mode-${serviceMode}`}>{serviceMode === 'ai' ? 'Secure AI' : serviceMode === 'browser' ? 'Browser mode' : 'AISG grounded'}</span><button type="button" className="learning-companion-close" onClick={() => setOpen(false)} aria-label="Close Learning Companion"><X aria-hidden="true" /></button></div>
      </header>

      <div className="learning-companion-context">
        <div className="learning-companion-context-icon"><Bot aria-hidden="true" /></div>
        <div><strong>{currentContext.sectionTitle}</strong><p>{intro}</p></div>
      </div>

      <div className="learning-companion-privacy"><ShieldCheck aria-hidden="true" /><span>Never enter student names or identifying information. The public Pages preview falls back to browser-grounded guidance; the authenticated deployment can use secure generative AI when an AISG server key is configured.</span></div>

      <div className="learning-companion-messages" aria-live="polite">
        {visibleMessages.length === 0 ? <div className="learning-companion-empty">
          {locked ? <><BookOpen aria-hidden="true" /><strong>Your judgement comes first.</strong><p>The companion is intentionally paused during formal checks so it cannot give away the answer.</p></> : <><Sparkles aria-hidden="true" /><strong>Think with the course, not around it.</strong><p>Ask for another explanation, test an assumption, connect the idea to AISG’s TLF or another course, or turn it into a small next move.</p></>}
        </div> : visibleMessages.map((message) => <div key={message.id} className={`learning-companion-message message-${message.role}`}>
          <p>{message.text}</p>
          {message.sources && message.sources.length > 0 && <div className="companion-sources"><span>{message.mode === 'ai' ? 'Grounded in' : 'Using'}</span>{message.sources.map((source) => <small key={source}>{source}</small>)}</div>}
        </div>)}
        {thinking && <div className="learning-companion-thinking"><Sparkles aria-hidden="true" /><span>Thinking with the course context…</span></div>}
      </div>

      {!locked && <div className="learning-companion-actions" aria-label="Suggested prompts">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return <button key={action.id} type="button" disabled={thinking} onClick={() => handleAction(action.id, action.label)}><Icon aria-hidden="true" /><span>{action.label}</span></button>;
        })}
      </div>}

      <form className="learning-companion-form" onSubmit={submit}>
        <label htmlFor="learning-companion-input" className="sr-only">Ask the Learning Companion</label>
        <textarea id="learning-companion-input" value={input} onChange={(event) => setInput(event.target.value)} rows={2} disabled={locked || thinking} placeholder={locked ? 'Available again after the learning check' : 'Ask a professional-learning question…'} />
        <Button type="submit" className="learning-companion-send" disabled={locked || thinking || !input.trim()} aria-label="Send question"><Send aria-hidden="true" /></Button>
      </form>
      <footer className="learning-companion-footer"><Lightbulb aria-hidden="true" /><span>Designed to deepen understanding and professional judgement, not replace it. Answers stay anchored to the current course, approved AISG framing and explicit cross-course connections.</span></footer>
    </dialog>}
  </>;
}
