'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Bot, Compass, Lightbulb, MessageCircle, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import CourseMark from '@/app/course-mark';
import { Button } from '@/components/ui/button';
import { COURSE_BY_ID, isCourseId, type CourseId } from '@/lib/course-catalog';
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

type Message = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  source?: string;
};

type QuickAction = 'explain' | 'tlf' | 'challenge' | 'apply' | 'culture';

type CompanionLens = {
  tlf: string;
  culture: string;
  application: string;
  challenge: string;
};

const LENSES: Record<CourseId, CompanionLens> = {
  safeguarding: {
    tlf: 'The TLF is secondary here. Safeguarding policy, reporting requirements and the welfare of the child govern professional decisions.',
    culture: 'Use cultural humility, but never let cultural interpretation delay a safeguarding response. Describe what was observed or disclosed and follow the current AISG reporting pathway.',
    application: 'Use this learning to recognise concerns, respond calmly, record accurately and report through the required AISG process rather than investigating the matter yourself.',
    challenge: 'Where might a desire to explain, reassure or solve the situation tempt you to move beyond your safeguarding role?',
  },
  elementary: {
    tlf: 'Use the TLF selectively to notice Personalisation, Agency, Authenticity, Collaboration and Taking Action through the learner experience rather than through the presence of a particular activity.',
    culture: 'AISG elementary learners bring different languages, identities, family experiences and prior-school expectations. Treat these as resources for learning without assuming that one background predicts one way of participating.',
    application: 'Choose one routine or learning decision from this section and identify what learners would say, do, choose or create if it were working well.',
    challenge: 'Which part of this expectation could become procedural compliance rather than a better learner experience if the purpose is not kept visible?',
  },
  secondary: {
    tlf: 'Use the TLF where it illuminates the learner experience, especially Personalisation, Agency, Authenticity, Collaboration and Taking Action, without forcing every routine into a facet.',
    culture: 'Secondary learners move among languages, cultures, programmes and future pathways. Ask what the learner evidence shows before treating one communication style, prior-school norm or English-language convention as the default.',
    application: 'Select one upcoming secondary learning decision and define the student evidence that would show the expectation is supporting learning rather than simply being completed.',
    challenge: 'Where could consistency be useful, and where could applying the same routine to everyone unintentionally obscure learner variability?',
  },
  teams: {
    tlf: 'The TLF is secondary in communication decisions. Respectful, evidence-based communication can support belonging and Collaboration, but confidentiality and professional communication expectations remain the governing requirements.',
    culture: 'Eye contact, silence, directness, public disagreement, family communication and English fluency can be interpreted differently across cultures. Describe observable evidence before assigning motive or character.',
    application: 'Before sending your next message, check purpose, audience, minimum necessary information, observable evidence, language, confidentiality and professionalism.',
    challenge: 'What are you assuming about intent, motivation or character that the observable evidence does not actually establish?',
  },
  ai: {
    tlf: 'AI may amplify Personalisation, Agency, Authenticity, Creativity, Collaboration or Taking Action, but the presence of AI is never evidence of a TLF facet by itself.',
    culture: 'AI output can reproduce dominant, English-language or globally generic assumptions. Verify whether examples, services, policies, histories and recommendations actually fit learners and communities in Guangzhou and southern China.',
    application: 'Take one planned AI use and identify the learning purpose, the human judgement that must remain visible, and the evidence that would show the tool improved learning.',
    challenge: 'If the AI disappeared, what important thinking would still need to belong to the learner or professional?',
  },
  assessment: {
    tlf: 'Assessment for learning connects naturally with Personalisation and Agency because evidence should help teachers respond and learners understand and act on their own progress.',
    culture: 'Check whether language load, unfamiliar response conventions, speed, examples or interaction norms are distorting what a multilingual or internationally mobile learner actually knows and can do.',
    application: 'Identify one upcoming learning intention, the evidence you need, and the specific teaching or learner action that would change if the evidence shows something unexpected.',
    challenge: 'Are you collecting evidence because it is easy to collect, or because it will genuinely change a next move?',
  },
  data: {
    tlf: 'Use TLF language when the evidence concerns learner experience: whose strengths and needs are visible, where learners have Agency, and what talk, choices, work, relationships or action reveal about the design.',
    culture: 'Data is produced in a context. Examine language demands, opportunity to learn, cultural familiarity, access and response conventions before attributing a pattern to motivation or ability.',
    application: 'State the current pattern, the desired state, the gap, one proportionate action, and the evidence you will review to decide whether to continue, adapt or stop.',
    challenge: 'What alternative explanation for this pattern would you need to rule out before acting with confidence?',
  },
  udl: {
    tlf: 'UDL aligns most directly with Personalisation and Agency and can create conditions for other TLF facets when barriers are reduced without lowering worthwhile challenge.',
    culture: 'Variability exists within as well as between cultural and linguistic groups. Broaden representation and access without turning identity into a prediction about how an individual learner will prefer to participate.',
    application: 'Start with the learning goal, identify one unnecessary barrier, and redesign that barrier while preserving the knowledge, skill or thinking students are meant to develop.',
    challenge: 'Which support is widening access to the goal, and which support might accidentally change or lower the goal itself?',
  },
  engagement: {
    tlf: 'This course is grounded directly in the TLF. Use the six facets as a lens, not a checklist: select a few relevant indicators and notice learner talk, choices, work, relationships and action.',
    culture: 'Cultural Responsiveness runs through the framework in whose identities, languages, histories, perspectives and communities shape the learning. A local Guangzhou context can be as authentic as a global one when the purpose and consequences are meaningful.',
    application: 'Choose one TLF facet that matters for an upcoming learning experience, then define the learner evidence you would expect to see if that facet were genuinely stronger.',
    challenge: 'Are you naming a feature of the activity, or describing something learners are actually experiencing?',
  },
  mtss: {
    tlf: 'Natural connections include Personalisation, Agency and belonging: support should increase access and independence rather than turning a tier or service into a permanent learner identity.',
    culture: 'Interpret screening and progress evidence through a cultural and linguistic lens. Language development and learning difference are distinct possibilities that can overlap; neither should be inferred from one score or from English proficiency alone.',
    application: 'Clarify the concern, check the strength of Tier 1 access, use multiple evidence sources, define a measurable response, and set a review point before intensifying support.',
    challenge: 'What evidence would show that the problem sits partly in the learning environment or assessment rather than only within the learner?',
  },
  multilingual: {
    tlf: 'Personalisation is visible when learning responds to linguistic and cultural strengths and needs; Agency grows as learners choose strategies and advocate for access; Collaboration and Authenticity deepen when diverse languages and perspectives contribute to shared learning.',
    culture: 'A learner may draw on English, Mandarin, Cantonese and other home languages in different ways. Treat the full linguistic repertoire as a learning asset without asking any learner to represent a whole culture or language group.',
    application: 'Choose one upcoming task, name the content goal and language demands, then add a temporary scaffold that improves access to the thinking without reducing the cognitive demand.',
    challenge: 'Is English proficiency masking what the learner knows, or is the language itself part of what must be demonstrated in this task?',
  },
  technology: {
    tlf: 'Technology is not a seventh TLF facet. Select the learner experience first, then ask whether the tool meaningfully amplifies Personalisation, Agency, Authenticity, Creativity, Collaboration or Taking Action.',
    culture: 'In Guangzhou, practical fitness includes language accessibility, privacy, data protection, compatibility, network reliability, support capacity and equitable access as well as pedagogy.',
    application: 'Take one planned tool use and name the student-learning need, the intended model of use, the accessibility and safety considerations, and the evidence that would show the tool added value.',
    challenge: 'What becomes possible because of this technology that would otherwise be meaningfully harder, weaker or less authentic?',
  },
  'growth-domain1': {
    tlf: 'Strong connections include Personalisation, Agency and Authenticity. The evidence remains learner experience: clarity of purpose, equitable access, deep thinking, useful assessment, transfer and increasing independence.',
    culture: 'Understanding learners includes language profiles, identities, strengths, cultures, interests and access needs. Use this knowledge as a resource while avoiding assumptions based on group membership.',
    application: 'Use the continuum to identify one strand where learner evidence suggests a realistic next move, then define what stronger practice would look like in student experience.',
    challenge: 'Which part of your judgement is based on what learners are actually experiencing, and which part is based mainly on teacher intention?',
  },
  'growth-domain2': {
    tlf: 'Personalisation and Agency are especially visible in Domain 2, with Collaboration becoming stronger as learners help sustain inclusive routines, relationships and shared learning conditions.',
    culture: 'Psychological safety does not require every learner to communicate, disagree or participate in one preferred way. Design multiple legitimate routes into contribution while sustaining dignity, equity and belonging.',
    application: 'Choose one routine affecting belonging, voice or autonomy and redesign it so responsibility gradually shifts toward learners while access remains strong.',
    challenge: 'Does the routine create genuine learner voice and autonomy, or only invite participation within decisions that are still entirely teacher-controlled?',
  },
  'growth-domain3': {
    tlf: 'Domain 3 naturally intersects with Authenticity, Creativity, Collaboration and Taking Action, while Agency is visible in learner-led inquiry. Use those connections only when student evidence supports them.',
    culture: 'Cultural responsiveness is part of rigorous thinking. Ask whose knowledge shapes inquiry, whether Guangzhou and southern China are treated as sources of knowledge, and whether learners can challenge a single dominant account.',
    application: 'Select one task and strengthen either cognitive demand, student-to-student knowledge building, meaningful inquiry choice, authentic purpose or transfer to an unfamiliar context.',
    challenge: 'Is the learning merely active and engaging, or are learners doing more demanding intellectual work, making consequential decisions or transferring ideas?',
  },
  'growth-domain4': {
    tlf: 'Agency is strengthened when learners use feedback and evidence to own growth; Collaboration and Authenticity become relevant as professional and community partnerships improve learner experience across contexts.',
    culture: 'Professional impact includes reciprocal partnership. Make room for multilingual family and community knowledge rather than treating school expertise as the only valid perspective.',
    application: 'Choose one cycle of feedback, evidence, reflection or collaboration and make the impact on student learning visible before deciding how to extend it across a team or community.',
    challenge: 'Are you measuring professional activity, or can you trace how the activity changed learner experience, shared practice or subsequent decisions?',
  },
};

const QUICK_ACTIONS: { id: QuickAction; label: string; icon: typeof Lightbulb }[] = [
  { id: 'explain', label: 'Explain differently', icon: BookOpen },
  { id: 'tlf', label: 'Connect to TLF', icon: Compass },
  { id: 'challenge', label: 'Challenge my thinking', icon: Sparkles },
  { id: 'apply', label: 'Apply this tomorrow', icon: ArrowRight },
  { id: 'culture', label: 'Cultural lens', icon: ShieldCheck },
];

function textOf(selector: string, root: ParentNode = document) {
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

function sourceLabel(context: CompanionContext) {
  return context.stage === 'learn'
    ? `Current course page · ${COURSE_BY_ID[context.course].title}`
    : `AISG course lens · ${COURSE_BY_ID[context.course].title}`;
}

function answerFor(action: QuickAction, context: CompanionContext) {
  const lens = LENSES[context.course];
  const takeaways = context.takeaways.slice(0, 2);

  if (action === 'tlf') return lens.tlf;
  if (action === 'culture') return lens.culture;
  if (action === 'apply') return `${lens.application} Keep the move small enough to try, and decide in advance what learner evidence you will look for before judging whether it helped.`;
  if (action === 'challenge') return `${lens.challenge} A second question: what evidence from learner talk, choices, work, relationships or action would change your current judgement?`;

  const core = context.summary || context.body || COURSE_BY_ID[context.course].description;
  if (takeaways.length > 0) return `Put simply: ${core} Keep these ideas in view: ${takeaways.join(' · ')}`;
  return `Put simply: ${core} The useful question is not only “Do I understand the idea?” but “What would I notice in learners if this were working well?”`;
}

function answerForPrompt(prompt: string, context: CompanionContext) {
  const normalized = prompt.toLowerCase();
  const sensitive = /(real student|student name|named student|disclos|abuse|self-harm|safeguard|report a concern|child protection)/i.test(prompt);
  if (sensitive) {
    return 'If this concerns a real student or safeguarding issue, stop using the Learning Companion for case advice. Do not enter identifying information. Follow current AISG safeguarding and reporting procedures, and use the appropriate designated staff or reporting system for the concern.';
  }
  if (/(tlf|personalisation|personalization|agency|authentic|creativ|collabor|taking action)/.test(normalized)) return answerFor('tlf', context);
  if (/(china|guangzhou|culture|cultural|language|multilingual|mandarin|cantonese|local context)/.test(normalized)) return answerFor('culture', context);
  if (/(challenge|push my thinking|blind spot|assumption|counter)/.test(normalized)) return answerFor('challenge', context);
  if (/(tomorrow|apply|try|lesson|next class|practice|what could i do|how could i use)/.test(normalized)) return answerFor('apply', context);
  if (/(explain|simpler|plain language|what does|mean|summar|understand)/.test(normalized)) return answerFor('explain', context);

  const anchor = context.summary || COURSE_BY_ID[context.course].description;
  return `I would test your question against this section’s central idea: ${anchor} Stay with the learner evidence. What would students say, do, choose, create or revise if the principle were genuinely stronger — and what evidence might point you toward a different interpretation?`;
}

export default function LearningCompanion() {
  const [context, setContext] = useState<CompanionContext | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messageId = useRef(0);
  const lastCourse = useRef<CourseId | null>(null);

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
    if (!context) {
      setOpen(false);
      return;
    }
    if (lastCourse.current !== context.course) {
      lastCourse.current = context.course;
      setMessages([]);
      setInput('');
    }
  }, [context]);

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
    if (locked) return 'This is a learning check. I will not choose or reveal an answer. Finish the check using your own judgement; then return to the course learning if you want help unpacking the principle.';
    if (context.stage === 'practice') return 'Use me to turn the course into a small, realistic next move. I stay grounded in the course and AISG learning lens.';
    return 'Ask about the learning on this page, connect it to AISG’s TLF, test an assumption or turn the idea into something you could try.';
  }, [context, locked]);

  if (!FEATURE_FLAGS.learningCompanion || !context) return null;

  function addExchange(userText: string, assistantText: string) {
    const id = ++messageId.current;
    setMessages((current) => [
      ...current,
      { id: id * 2, role: 'user', text: userText },
      { id: id * 2 + 1, role: 'assistant', text: assistantText, source: sourceLabel(context) },
    ]);
  }

  function useAction(action: QuickAction, label: string) {
    if (locked) return;
    addExchange(label, answerFor(action, context));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || locked) return;
    addExchange(prompt, answerForPrompt(prompt, context));
    setInput('');
  }

  return <>
    <button type="button" className={`learning-companion-trigger ${open ? 'is-open' : ''}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="learning-companion-panel">
      <span className="learning-companion-trigger-icon"><MessageCircle aria-hidden="true" /></span>
      <span><strong>Learning Companion</strong><small>Course-grounded preview</small></span>
    </button>

    {open && <aside id="learning-companion-panel" className="learning-companion-panel" role="dialog" aria-label={`Learning Companion for ${courseTitle}`}>
      <header className="learning-companion-header">
        <div className="learning-companion-course"><CourseMark course={context.course} size="record" /><div><p className="tiny-eyebrow">Learning Companion · Preview</p><strong>{courseTitle}</strong></div></div>
        <button type="button" className="learning-companion-close" onClick={() => setOpen(false)} aria-label="Close Learning Companion"><X aria-hidden="true" /></button>
      </header>

      <div className="learning-companion-context">
        <div className="learning-companion-context-icon"><Bot aria-hidden="true" /></div>
        <div><strong>{context.sectionTitle}</strong><p>{intro}</p></div>
      </div>

      <div className="learning-companion-privacy"><ShieldCheck aria-hidden="true" /><span>This public preview runs in your browser. Your text is not sent to an AI model. Do not enter student names or identifying information.</span></div>

      <div className="learning-companion-messages" aria-live="polite">
        {messages.length === 0 ? <div className="learning-companion-empty">
          {locked ? <><BookOpen aria-hidden="true" /><strong>Your judgement comes first.</strong><p>The companion is intentionally paused during formal checks so it cannot give away the answer.</p></> : <><Sparkles aria-hidden="true" /><strong>Think with the course, not around it.</strong><p>Choose a grounded prompt below or ask a short professional question.</p></>}
        </div> : messages.map((message) => <div key={message.id} className={`learning-companion-message message-${message.role}`}>
          <p>{message.text}</p>
          {message.source && <span>{message.source}</span>}
        </div>)}
      </div>

      {!locked && <div className="learning-companion-actions" aria-label="Suggested prompts">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return <button key={action.id} type="button" onClick={() => useAction(action.id, action.label)}><Icon aria-hidden="true" /><span>{action.label}</span></button>;
        })}
      </div>}

      <form className="learning-companion-form" onSubmit={submit}>
        <label htmlFor="learning-companion-input" className="sr-only">Ask the Learning Companion</label>
        <textarea id="learning-companion-input" value={input} onChange={(event) => setInput(event.target.value)} rows={2} disabled={locked} placeholder={locked ? 'Available again after the learning check' : 'Ask about this learning…'} />
        <Button type="submit" className="learning-companion-send" disabled={locked || !input.trim()} aria-label="Send question"><Send aria-hidden="true" /></Button>
      </form>
      <footer className="learning-companion-footer"><Lightbulb aria-hidden="true" /><span>Grounded in the current course page and AISG course lens. A secure server-backed version can later add true generative conversation and source citations.</span></footer>
    </aside>}
  </>;
}
