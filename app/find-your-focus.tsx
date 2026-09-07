'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Compass, RotateCcw, Star } from 'lucide-react';
import CourseMark from '@/app/course-mark';
import { Button } from '@/components/ui/button';
import { COURSE_BY_ID, type CourseId } from '@/lib/course-catalog';

type FocusCourseId = Exclude<CourseId, 'safeguarding' | 'elementary' | 'secondary' | 'teams'>;
type WeightMap = Partial<Record<FocusCourseId, number>>;

type FocusChoice = {
  id: string;
  label: string;
  signal: string;
  weights: WeightMap;
};

type FocusQuestion = {
  id: string;
  prompt: string;
  help: string;
  choices: FocusChoice[];
};

type FocusResult = {
  answers: Record<string, string>;
  recommendations: FocusCourseId[];
  completedAt: number;
};

const FOCUS_STORAGE_KEY = 'my-courses-find-your-focus-v1';

const questions: FocusQuestion[] = [
  {
    id: 'challenge',
    prompt: 'Which challenge feels most relevant to your practice right now?',
    help: 'Choose the one that would make the biggest difference if it became clearer or stronger.',
    choices: [
      { id: 'access', label: 'More learners need meaningful access to worthwhile learning.', signal: 'equitable access', weights: { udl: 4, multilingual: 3, 'growth-domain1': 2 } },
      { id: 'evidence', label: 'I want clearer evidence of what learners actually understand.', signal: 'stronger evidence of learning', weights: { assessment: 4, data: 3, 'growth-domain4': 2 } },
      { id: 'ownership', label: 'I want learners to take greater ownership of their learning.', signal: 'learner ownership', weights: { 'growth-domain2': 4, assessment: 3, engagement: 2 } },
      { id: 'language', label: 'I want to support multilingual learners more effectively without lowering challenge.', signal: 'language-conscious access', weights: { multilingual: 5, udl: 3, 'growth-domain1': 2 } },
      { id: 'depth', label: 'I want learning to be more intellectually demanding, authentic or consequential.', signal: 'deeper and more authentic learning', weights: { 'growth-domain3': 5, engagement: 3, technology: 2 } },
      { id: 'support', label: 'I am trying to understand a recurring learner-support need.', signal: 'proactive learner support', weights: { mtss: 5, data: 3, multilingual: 2 } },
      { id: 'digital', label: 'I want to use technology or AI more purposefully.', signal: 'purposeful digital practice', weights: { technology: 5, ai: 4, engagement: 2 } },
    ],
  },
  {
    id: 'notice',
    prompt: 'What are you noticing most often in learning?',
    help: 'Choose the pattern that best matches what you are seeing, even if you are still unsure why it is happening.',
    choices: [
      { id: 'voices', label: 'A few voices dominate while others participate less visibly.', signal: 'broader participation', weights: { 'growth-domain3': 4, 'growth-domain2': 3, multilingual: 2 } },
      { id: 'understanding', label: 'Students complete tasks, but I am not always sure what they understand.', signal: 'visible learner thinking', weights: { assessment: 5, data: 3, 'growth-domain1': 2 } },
      { id: 'dependence', label: 'Learners rely heavily on teacher direction, prompts or decisions.', signal: 'greater independence', weights: { 'growth-domain2': 4, udl: 3, assessment: 2 } },
      { id: 'language-mask', label: 'Language sometimes masks what a learner knows or can do.', signal: 'valid evidence across languages', weights: { multilingual: 5, assessment: 4, udl: 3 } },
      { id: 'transfer', label: 'Learners can do the taught task but struggle to transfer learning to a new context.', signal: 'transfer of learning', weights: { 'growth-domain3': 5, engagement: 3, technology: 2 } },
      { id: 'reactive', label: 'Support often begins only after a learner has already struggled.', signal: 'earlier and more responsive support', weights: { mtss: 5, data: 3, udl: 2 } },
      { id: 'tech-value', label: 'Technology is being used, but its learning value is not always clear.', signal: 'learning-first technology decisions', weights: { technology: 5, ai: 3, engagement: 2 } },
    ],
  },
  {
    id: 'experience',
    prompt: 'What would you most like learners to experience more strongly?',
    help: 'The language below echoes AISG’s Transformative Learning Framework, but you do not need to know the framework to choose.',
    choices: [
      { id: 'personalisation', label: 'Personalisation — learning responds more meaningfully to strengths and needs.', signal: 'Personalisation', weights: { udl: 4, multilingual: 4, 'growth-domain1': 3 } },
      { id: 'agency', label: 'Agency — learners make meaningful decisions and increasingly manage learning.', signal: 'Agency', weights: { 'growth-domain2': 4, assessment: 3, engagement: 3 } },
      { id: 'authenticity', label: 'Authenticity — learning connects with meaningful contexts, perspectives and audiences.', signal: 'Authenticity', weights: { 'growth-domain3': 4, engagement: 3, technology: 2 } },
      { id: 'creativity', label: 'Creativity — learners generate, test, refine and communicate original ideas.', signal: 'Creativity', weights: { 'growth-domain3': 4, technology: 3, ai: 2 } },
      { id: 'collaboration', label: 'Collaboration — learners build knowledge with and through others.', signal: 'Collaboration', weights: { 'growth-domain3': 4, 'growth-domain2': 3, technology: 2 } },
      { id: 'action', label: 'Taking Action — learning leads to meaningful application or contribution.', signal: 'Taking Action', weights: { 'growth-domain3': 4, engagement: 3, technology: 2 } },
      { id: 'unsure', label: 'I am not sure yet — I want a stronger shared lens for learning first.', signal: 'a clearer shared learning lens', weights: { engagement: 5, 'growth-domain1': 2, data: 1 } },
    ],
  },
  {
    id: 'location',
    prompt: 'Where would a change make the biggest difference?',
    help: 'Think about the part of professional practice where you most want a useful next move.',
    choices: [
      { id: 'design', label: 'Planning and designing learning before students encounter it.', signal: 'learning design', weights: { 'growth-domain1': 4, udl: 4, engagement: 2 } },
      { id: 'culture', label: 'Classroom culture, participation, belonging and learner voice.', signal: 'inclusive learning culture', weights: { 'growth-domain2': 5, multilingual: 3, 'growth-domain3': 2 } },
      { id: 'assessment', label: 'Assessment, feedback and deciding what to do next.', signal: 'responsive assessment', weights: { assessment: 5, data: 4, 'growth-domain4': 2 } },
      { id: 'support', label: 'Coordinating support when learner needs are persistent or complex.', signal: 'coherent student support', weights: { mtss: 5, multilingual: 3, data: 2 } },
      { id: 'digital', label: 'Choosing or using digital tools and AI for learning.', signal: 'responsible digital learning', weights: { technology: 5, ai: 5, engagement: 1 } },
      { id: 'collective', label: 'Team reflection, shared evidence and collective professional practice.', signal: 'collective professional learning', weights: { 'growth-domain4': 5, data: 3, mtss: 2 } },
    ],
  },
  {
    id: 'decision',
    prompt: 'Which professional decision do you most want to strengthen?',
    help: 'Choose the question you would most value being able to answer with greater confidence.',
    choices: [
      { id: 'barrier', label: 'Is the learner struggling, or is the design creating an unnecessary barrier?', signal: 'barrier-aware design', weights: { udl: 5, multilingual: 3, 'growth-domain1': 2 } },
      { id: 'evidence-next', label: 'What does this evidence actually tell me, and what should I change next?', signal: 'evidence-informed adjustment', weights: { data: 5, assessment: 4, 'growth-domain4': 2 } },
      { id: 'challenge', label: 'How do I increase ownership without reducing intellectual challenge?', signal: 'agency with challenge', weights: { 'growth-domain3': 4, 'growth-domain2': 4, engagement: 3 } },
      { id: 'language-learning', label: 'Is this primarily language development, a learning need, the design, or more than one factor?', signal: 'a dual language-and-learning lens', weights: { multilingual: 5, mtss: 4, data: 2 } },
      { id: 'tool', label: 'Does this technology or AI tool meaningfully improve the learner experience?', signal: 'purposeful technology judgement', weights: { technology: 5, ai: 4, engagement: 2 } },
      { id: 'team', label: 'How can evidence, reflection and collaboration improve practice beyond one classroom?', signal: 'professional impact beyond one classroom', weights: { 'growth-domain4': 5, data: 3, mtss: 2 } },
    ],
  },
  {
    id: 'useful',
    prompt: 'What would make professional learning most useful to you right now?',
    help: 'There is no better choice here. This final question helps us balance the recommendations.',
    choices: [
      { id: 'tomorrow', label: 'A practical move I can try in learning tomorrow.', signal: 'an immediately usable next move', weights: { assessment: 3, multilingual: 3, data: 2, udl: 2 } },
      { id: 'framework', label: 'A strong framework that helps me see learning differently.', signal: 'a stronger conceptual framework', weights: { engagement: 4, udl: 3, mtss: 2 } },
      { id: 'continuum', label: 'A developmental lens for reflecting on how my practice can deepen.', signal: 'developmental reflection', weights: { 'growth-domain1': 3, 'growth-domain2': 3, 'growth-domain3': 3, 'growth-domain4': 3 } },
      { id: 'digital', label: 'A clearer approach to purposeful and responsible digital practice.', signal: 'digital confidence and judgement', weights: { technology: 4, ai: 4 } },
      { id: 'support-system', label: 'A more coherent way to understand and respond to learner support needs.', signal: 'a coherent support system', weights: { mtss: 4, multilingual: 3, data: 2 } },
      { id: 'unsure', label: 'I am still exploring — show me the strongest place to begin.', signal: 'a strong place to begin', weights: { engagement: 4, assessment: 2, 'growth-domain1': 2 } },
    ],
  },
];

const coursePurpose: Record<FocusCourseId, string> = {
  ai: 'Build critical AI literacy and strengthen human judgement about privacy, bias, verification and authentic learning.',
  assessment: 'Use evidence, feedback and learner self-assessment while learning is still happening so the next move becomes clearer.',
  data: 'Turn evidence into a disciplined improvement cycle: notice, question, act, monitor and adjust.',
  udl: 'Anticipate learner variability, identify design barriers and preserve worthwhile challenge while widening access and agency.',
  engagement: 'Use AISG’s shared TLF language as a lens for designing, noticing and deepening learner engagement.',
  mtss: 'Strengthen proactive, evidence-informed support and make better decisions about intensity, response and next steps.',
  multilingual: 'Use asset-based, language-conscious classroom practices that protect cognitive demand while strengthening access and participation.',
  technology: 'Decide when technology genuinely amplifies transformative learning and when a simpler tool is the better design choice.',
  'growth-domain1': 'Use learner evidence to deepen purposeful, inclusive learning design, assessment and responsive access.',
  'growth-domain2': 'Strengthen belonging, voice, autonomy and the conditions learners need to participate and self-manage.',
  'growth-domain3': 'Deepen cognitive demand, inclusive discourse, inquiry, creativity, authentic application and meaningful action.',
  'growth-domain4': 'Connect feedback, evidence, reflection and collaboration with professional impact and collective capacity.',
};

function readSavedResult(): FocusResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(FOCUS_STORAGE_KEY) || 'null') as FocusResult | null;
    if (!parsed || !Array.isArray(parsed.recommendations) || !parsed.completedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveResult(result: FocusResult) {
  try {
    localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // The diagnostic still works for the current session if persistent storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent('my-courses-focus-updated', { detail: result }));
}

function recommendationDetails(answers: Record<string, string>) {
  const scores = new Map<FocusCourseId, number>();
  const signals = new Map<FocusCourseId, string[]>();

  for (const question of questions) {
    const choice = question.choices.find((item) => item.id === answers[question.id]);
    if (!choice) continue;
    for (const [course, weight] of Object.entries(choice.weights) as [FocusCourseId, number][]) {
      scores.set(course, (scores.get(course) || 0) + weight);
      const currentSignals = signals.get(course) || [];
      if (!currentSignals.includes(choice.signal)) currentSignals.push(choice.signal);
      signals.set(course, currentSignals);
    }
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || COURSE_BY_ID[a[0]].title.localeCompare(COURSE_BY_ID[b[0]].title))
    .slice(0, 3)
    .map(([course]) => ({ course, signals: (signals.get(course) || []).slice(0, 2) }));
}

function reasonFor(course: FocusCourseId, signals: string[]) {
  const focus = signals.length === 0
    ? 'Your responses point toward this area of practice.'
    : signals.length === 1
      ? `You highlighted ${signals[0]}.`
      : `You highlighted ${signals[0]} and ${signals[1]}.`;
  return `${focus} ${coursePurpose[course]}`;
}

export default function FindYourFocus({ favourites, onToggleFavourite, onOpenCourse }: { favourites: CourseId[]; onToggleFavourite: (id: CourseId) => void; onOpenCourse: (id: CourseId) => void }) {
  const [saved, setSaved] = useState<FocusResult | null>(() => readSavedResult());
  const [active, setActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = questions[step];
  const selected = current ? answers[current.id] : undefined;
  const savedDetails = useMemo(() => saved ? recommendationDetails(saved.answers) : [], [saved]);

  function begin() {
    setAnswers(saved?.answers || {});
    setStep(0);
    setExpanded(true);
    setActive(true);
  }

  function choose(id: string) {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: id }));
  }

  function next() {
    if (!selected) return;
    if (step < questions.length - 1) {
      setStep((value) => value + 1);
      return;
    }
    const details = recommendationDetails(answers);
    const result: FocusResult = {
      answers,
      recommendations: details.map((item) => item.course),
      completedAt: Date.now(),
    };
    saveResult(result);
    setSaved(result);
    setActive(false);
    setExpanded(false);
  }

  function cancel() {
    setActive(false);
    setAnswers(saved?.answers || {});
    setStep(0);
    if (saved) setExpanded(false);
  }

  if (saved && !active && !expanded) {
    return <section id="find-your-focus" className="my-6 overflow-hidden rounded-[24px] border border-[#0b294b]/10 bg-white shadow-[0_12px_34px_rgba(11,41,75,0.06)]" aria-labelledby="find-focus-title">
      <div className="grid items-stretch lg:grid-cols-[.72fr_1.28fr]">
        <div className="flex items-center gap-4 bg-[#0b294b] px-5 py-5 text-white sm:px-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"><Compass className="h-5 w-5" aria-hidden="true" /></div>
          <div><p className="text-[.65rem] font-bold uppercase tracking-[.16em] text-white/60">Professional reflection · Complete</p><h2 id="find-focus-title" className="mt-1 text-2xl font-semibold tracking-tight">Find Your Focus</h2></div>
        </div>
        <div className="flex flex-col justify-center gap-4 px-5 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.12em] text-[#8f2034]">Your current focus</p><div className="mt-2 flex flex-wrap gap-2">{savedDetails.map(({ course }, index) => <span key={course} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#334b64]"><span className="text-[#8f2034]">{index + 1}</span>{COURSE_BY_ID[course].title}</span>)}</div></div>
          <div className="flex shrink-0 flex-wrap gap-2"><Button variant="outline" onClick={begin}><RotateCcw aria-hidden="true" /> Refine</Button><Button className="primary-pill" aria-expanded="false" onClick={() => setExpanded(true)}>View recommendations <ChevronDown aria-hidden="true" /></Button></div>
        </div>
      </div>
    </section>;
  }

  return <section id="find-your-focus" className="my-8 overflow-hidden rounded-[30px] border border-[#0b294b]/10 bg-white shadow-[0_18px_48px_rgba(11,41,75,0.08)]" aria-labelledby="find-focus-title">
    <div className="grid gap-0 lg:grid-cols-[.86fr_1.14fr]">
      <div className="bg-[#0b294b] p-6 text-white sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"><Compass className="h-6 w-6" aria-hidden="true" /></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-white/65">Professional reflection</p>
        <h2 id="find-focus-title" className="mt-2 text-3xl font-semibold tracking-tight">Find Your Focus</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/76">Six reflective questions help identify professional learning that may be useful right now. This is a recommendation tool, not an evaluation or score.</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-white/70"><span className="rounded-full bg-white/10 px-3 py-1.5">6 questions</span><span className="rounded-full bg-white/10 px-3 py-1.5">About 2 minutes</span><span className="rounded-full bg-white/10 px-3 py-1.5">Private to this browser</span></div>
      </div>

      <div className="p-6 sm:p-8">
        {active && current ? <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[.13em] text-[#8f2034]">Question {step + 1} of {questions.length}</p>
            <span className="text-sm font-semibold text-slate-500">{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#8f2034] transition-[width] duration-300" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-[#0b294b]">{current.prompt}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{current.help}</p>
          <div className="mt-6 grid gap-3">
            {current.choices.map((choice) => {
              const isSelected = selected === choice.id;
              return <button key={choice.id} type="button" aria-pressed={isSelected} onClick={() => choose(choice.id)} className={`flex min-h-12 items-start gap-3 rounded-2xl border p-4 text-left text-sm leading-6 transition ${isSelected ? 'border-[#8f2034] bg-[#fff7f8] text-[#0b294b] ring-1 ring-[#8f2034]/20' : 'border-slate-200 bg-white text-slate-700 hover:border-[#0b294b]/25 hover:bg-slate-50'}`}>
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-[#8f2034] bg-[#8f2034] text-white' : 'border-slate-300'}`}>{isSelected && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}</span>
                <span>{choice.label}</span>
              </button>;
            })}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">{step > 0 && <Button variant="outline" onClick={() => setStep((value) => value - 1)}><ArrowLeft aria-hidden="true" /> Back</Button>}<Button variant="ghost" onClick={cancel}>Cancel</Button></div>
            <Button className="primary-pill" disabled={!selected} onClick={next}>{step === questions.length - 1 ? 'Show my focus' : 'Continue'} <ArrowRight aria-hidden="true" /></Button>
          </div>
        </div> : saved ? <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[.13em] text-[#8f2034]">Your current focus</p><h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0b294b]">Three places to continue your learning</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">These are suggestions, not judgements. Star anything you want to keep and it will appear with your other starred courses on the homepage.</p></div>
            <div className="flex flex-wrap gap-2"><Button variant="outline" aria-expanded="true" onClick={() => setExpanded(false)}><ChevronUp aria-hidden="true" /> Minimise</Button><Button variant="outline" onClick={begin}><RotateCcw aria-hidden="true" /> Refine my focus</Button></div>
          </div>
          <div className="mt-6 grid gap-3">
            {savedDetails.map(({ course, signals }, index) => {
              const item = COURSE_BY_ID[course];
              const starred = favourites.includes(course);
              return <article key={course} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/65 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b294b] text-xs font-bold text-white">{index + 1}</span><CourseMark course={course} size="record" /></div>
                <div><p className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">{item.category}</p><h4 className="mt-1 text-base font-semibold text-[#0b294b]">{item.title}</h4><p className="mt-1 text-sm leading-6 text-slate-600">{reasonFor(course, signals)}</p></div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Button variant="outline" aria-pressed={starred} onClick={() => onToggleFavourite(course)}><Star className={starred ? 'fill-current' : ''} aria-hidden="true" /> {starred ? 'Starred' : 'Star'}</Button>
                  <Button className="primary-pill" onClick={() => onOpenCourse(course)}>Open <ArrowRight aria-hidden="true" /></Button>
                </div>
              </article>;
            })}
          </div>
        </div> : <div className="flex h-full min-h-[250px] flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[.13em] text-[#8f2034]">Not sure where to start?</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#0b294b]">Turn a current professional question into a useful next step.</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">The diagnostic looks for patterns across access, evidence, learner ownership, multilingual learning, transformative practice, student support and digital learning. It then recommends three courses and explains why.</p>
          <div className="mt-6"><Button className="primary-pill" size="lg" onClick={begin}>Find my focus <ArrowRight aria-hidden="true" /></Button></div>
        </div>}
      </div>
    </div>
  </section>;
}
