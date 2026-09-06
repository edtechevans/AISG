'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GrowthCourse = 'growth-domain3' | 'growth-domain4';
type Choice = { id: string; text: string; strongest?: boolean; feedback: string };
type Step = { prompt: string; context?: string; choices: Choice[] };

const surface = 'mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6';
const option = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b294b] focus-visible:ring-offset-2';

export default function TeacherGrowthDomain34LearningExperience({ course, sectionId, learnPage }: { course: GrowthCourse; sectionId: string; learnPage: number }) {
  if (learnPage !== 1) return null;

  if (course === 'growth-domain3') {
    if (sectionId === 'growth-d3-continuum') return <EvidenceOfTransformationLab />;
    if (sectionId === 'growth-d3-thinking') return <CognitiveDemandLab />;
    if (sectionId === 'growth-d3-discourse') return <DiscourseLab />;
    if (sectionId === 'growth-d3-inquiry') return <ChoiceInquiryLab />;
    if (sectionId === 'growth-d3-authentic') return <AuthenticImpactLab />;
  }

  if (course === 'growth-domain4') {
    if (sectionId === 'growth-d4-feedback') return <FeedbackOwnershipLab />;
    if (sectionId === 'growth-d4-evidence') return <EvidenceActionLab />;
    if (sectionId === 'growth-d4-reflection') return <ReflectionOwnershipLab />;
    if (sectionId === 'growth-d4-collaboration') return <CollaborationImpactLab />;
    if (sectionId === 'growth-d4-partnership') return <PartnershipLab />;
  }

  return null;
}

function Header({ kind, title, description }: { kind: string; title: string; description: string }) {
  return <div className="mb-5"><div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b294b] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-white"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> {kind}</span><span className="text-xs font-semibold text-slate-500">Practice · not scored</span></div><h2 className="mt-3 text-xl font-semibold tracking-tight text-[#0b294b] sm:text-2xl">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p></div>;
}

function Feedback({ strong, text }: { strong: boolean; text: string }) {
  return <output aria-live="polite" className={`mt-4 flex gap-3 rounded-xl border p-4 ${strong ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>{strong ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}<div className="text-sm leading-6"><strong>{strong ? 'Strong continuum reading' : 'Look again at the evidence'}</strong><p className="mt-1">{text}</p></div></output>;
}

function QuickLab({ title, description, situation, choices, connection }: { title: string; description: string; situation: string; choices: Choice[]; connection: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const chosen = choices.find((choice) => choice.id === selected);
  return <section className={surface}><Header kind="Quick judgement" title={title} description={description} /><div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Situation</strong><p className="mt-1">{situation}</p></div><div className="mt-4 grid gap-2">{choices.map((choice) => <button key={choice.id} type="button" className={`${option} ${selected === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setSelected(choice.id)}>{choice.text}</button>)}</div>{chosen && <Feedback strong={Boolean(chosen.strongest)} text={chosen.feedback} />}<p className="mt-4 text-xs leading-5 text-slate-500">Continuum connection: {connection}</p></section>;
}

function DecisionLab({ title, description, steps, connection }: { title: string; description: string; steps: Step[]; connection: string }) {
  const [step, setStep] = useState(0);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const current = steps[step];
  const chosen = current.choices.find((choice) => choice.id === choiceId);
  const done = step === steps.length - 1 && Boolean(chosen);
  function next() { if (step < steps.length - 1) { setStep(step + 1); setChoiceId(null); } else { setStep(0); setChoiceId(null); } }
  return <section className={`${surface} border-[#cbd7e2] bg-[#f5f8fb]`}><Header kind="Decision lab" title={title} description={description} /><div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.1em] text-slate-500"><GitBranch className="h-4 w-4" aria-hidden="true" />Decision {step + 1} of {steps.length}</div><div className="mt-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200"><p className="text-base font-semibold leading-7 text-[#0b294b]">{current.prompt}</p>{current.context && <p className="mt-2 text-sm leading-6 text-slate-600">{current.context}</p>}<div className="mt-5 grid gap-2">{current.choices.map((choice) => <button key={choice.id} type="button" disabled={Boolean(chosen)} className={`${option} ${choiceId === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setChoiceId(choice.id)}>{choice.text}</button>)}</div>{chosen && <><Feedback strong={Boolean(chosen.strongest)} text={chosen.feedback} /><div className="mt-4 flex justify-end"><Button onClick={next} className="rounded-full bg-[#0b294b] text-white hover:bg-[#163b63]">{done ? <><RotateCcw /> Run again</> : <>Continue <ArrowRight /></>}</Button></div></>}</div><p className="mt-4 text-xs leading-5 text-slate-500">Continuum connection: {connection}</p></section>;
}

function EvidenceOfTransformationLab() {
  return <QuickLab title="Transformative — or just active?" description="Separate visible activity from evidence of deeper learner thinking and ownership." situation="Students rotate through stations, use devices and create attractive products, but most decisions and explanations are supplied by the teacher." choices={[{id:'a',text:'Strong Transformational evidence',feedback:'Activity, choice of tools and polished products do not by themselves show deep thinking, transfer or learner ownership.'},{id:'b',text:'Active learning, but limited evidence of later-continuum practice',strongest:true,feedback:'Yes. The next question is what students are independently reasoning, questioning, deciding, transferring and applying.'}]} connection="Domain 3 strengthens through deeper thinking, learner-led discourse, inquiry, transfer and authentic application." />;
}

function CognitiveDemandLab() {
  return <DecisionLab title="Raise the thinking — not just the workload" description="Follow a redesign from recall toward reasoning and transfer." steps={[{prompt:'Students can recall the content but rarely explain why it matters. What is the strongest next move?',choices:[{id:'a',text:'Add more recall questions.',feedback:'More volume does not necessarily increase cognitive demand.'},{id:'b',text:'Ask students to analyse a new case and justify reasoning with evidence.',strongest:true,feedback:'Yes. This moves toward the analysis, problem-solving and justification described in Embedding 3a.'}]},{prompt:'Students now justify reasoning successfully. What would deepen the practice further?',choices:[{id:'a',text:'Give an unfamiliar context and ask students to adapt the thinking strategy independently.',strongest:true,feedback:'Yes. Independent transfer and adaptation are central Extending indicators.'},{id:'b',text:'Repeat the same case with different numbers.',feedback:'That may build fluency but gives limited evidence of transfer.'}]}]} connection="3a moves from recall → guided analysis → justification and problem-solving → independent transfer → original complex thinking." />;
}

function DiscourseLab() {
  return <QuickLab title="Everyone spoke — but did they build knowledge?" description="Look beyond participation counts to the quality of collaborative thinking." situation="Every student contributes once, but each response goes to the teacher. Students do not reference, challenge or extend one another’s ideas." choices={[{id:'a',text:'Discourse is already Transformational',feedback:'Broad participation is valuable, but later practice requires students to build on ideas and sustain knowledge-building.'},{id:'b',text:'Participation is widening; the next move is student-to-student sense-making',strongest:true,feedback:'Yes. Help learners listen, respond, integrate perspectives and increasingly sustain discourse themselves.'}]} connection="3b develops from teacher-led discussion toward learner-led knowledge-building that includes diverse perspectives." />;
}

function ChoiceInquiryLab() {
  return <DecisionLab title="Choice that actually changes the learning" description="Test whether learner choice influences inquiry rather than decoration." steps={[{prompt:'Students choose the colour and layout of a common product. How strong is the inquiry evidence?',choices:[{id:'a',text:'Strong Agency and inquiry',feedback:'The choice is real but largely cosmetic.'},{id:'b',text:'Limited — the learning pathway remains prescribed',strongest:true,feedback:'Yes. Later 3c practice involves questions, ideas and decisions that shape inquiry and creation.'}]},{prompt:'Students now propose questions and choose among valid methods. What would move toward Extending?',choices:[{id:'a',text:'Students independently refine and manage inquiry as new evidence changes their understanding.',strongest:true,feedback:'Yes. Extending includes independently initiating, managing and adapting inquiry.'},{id:'b',text:'The teacher provides a longer menu of fixed questions.',feedback:'More options can help, but ownership remains bounded by teacher-selected pathways.'}]}]} connection="3c moves from prescribed pathways toward meaningful choice, learner-generated inquiry, adaptation and authentic creation." />;
}

function AuthenticImpactLab() {
  return <QuickLab title="Real-world label — or authentic purpose?" description="Judge authenticity by purpose, audience, transfer and consequence." situation="A task uses a fictional community scenario, but students still complete the same worksheet and nobody beyond the teacher uses the result." choices={[{id:'a',text:'Authentic because the scenario sounds real',feedback:'A real-world story can add context, but it does not automatically create authentic application.'},{id:'b',text:'Some relevance, but limited authenticity',strongest:true,feedback:'Yes. Stronger 3d evidence includes meaningful application, authentic or simulated audiences, transfer and eventually real impact.'}]} connection="3d develops from abstract learning toward meaningful application, independent transfer and action with authentic audiences or communities." />;
}

function FeedbackOwnershipLab() {
  return <QuickLab title="Feedback given — or feedback used?" description="Focus on what learners do with feedback." situation="A teacher writes detailed comments on final work. Students read the grade, skim the comments and move to the next unit." choices={[{id:'a',text:'Strong feedback culture',feedback:'The information may be useful, but there is little evidence that students use it to improve.'},{id:'b',text:'Feedback is present, but the growth cycle is incomplete',strongest:true,feedback:'Yes. Later 4a practice is visible when students act on feedback, seek it, give it and use it to set goals.'}]} connection="4a moves from unclear feedback toward timely use, independent revision, transfer and reciprocal feedback culture." />;
}

function EvidenceActionLab() {
  return <DecisionLab title="What changes because of the evidence?" description="Move from data collection toward responsive planning and shared action." steps={[{prompt:'A team notices the same misconception in several classes. What is the strongest first response?',choices:[{id:'a',text:'Record the pattern and keep the planned sequence unchanged.',feedback:'That leaves evidence disconnected from planning.'},{id:'b',text:'Agree a focused instructional response and define what evidence will show whether it helped.',strongest:true,feedback:'Yes. 4b strengthens when evidence produces responsive planning and a reviewable next move.'}]},{prompt:'The response helps in some classes but not others. What is the strongest next move?',choices:[{id:'a',text:'Examine implementation and learner evidence together, then adapt the shared approach to improve consistency.',strongest:true,feedback:'Yes. Extending includes aligned evidence use and more consistent responsiveness across contexts.'},{id:'b',text:'Average the results and move on.',feedback:'Averages can hide meaningful differences in learner experience and implementation.'}]}]} connection="4b moves from collecting evidence toward real-time adjustment, shared evidence practices and learner use of evidence." />;
}

function ReflectionOwnershipLab() {
  return <QuickLab title="Reflection as a form — or a learner capability?" description="Notice whether reflection actually changes learning." situation="Students complete the same reflection template after each unit but write brief comments and rarely use them again." choices={[{id:'a',text:'Reflection is embedded because it happens regularly',feedback:'Frequency alone does not show that reflection informs improvement.'},{id:'b',text:'The routine exists, but ownership is limited',strongest:true,feedback:'Yes. The next move is connecting reflection to evidence, specific goals, strategy adjustment and later reuse.'}]} connection="4c develops from prompted reflection toward independent monitoring, transfer, long-term goals and ownership of growth." />;
}

function CollaborationImpactLab() {
  return <DecisionLab title="Collaboration that changes learning" description="Judge collaboration by its impact on student experience rather than meeting activity." steps={[{prompt:'A PLC shares resources and deadlines efficiently. What evidence is still missing?',choices:[{id:'a',text:'Whether shared practice is improving student learning or consistency across classes.',strongest:true,feedback:'Yes. 4d centres the impact of collaboration on learners.'},{id:'b',text:'Whether every document uses the same template.',feedback:'Template consistency is not the core evidence of collective capacity.'}]},{prompt:'A shared approach improves outcomes. What would move toward Extending?',choices:[{id:'a',text:'Keep the successful practice within one classroom.',feedback:'That preserves local impact but does not build wider capacity.'},{id:'b',text:'Share expertise, examine evidence with colleagues and help adapt the practice across contexts.',strongest:true,feedback:'Yes. Extending includes leading collaborative practice and improving learning across teams.'}]}]} connection="4d moves from logistical collaboration toward shared practice, distributed expertise and coherent collective capacity." />;
}

function PartnershipLab() {
  return <QuickLab title="Communication sent — or partnership built?" description="Distinguish regular information sharing from reciprocal partnership." situation="Families receive clear weekly updates, but there is no meaningful route for them to share context, ask questions or influence support for learning." choices={[{id:'a',text:'Transformational partnership',feedback:'Regular communication is useful, but this remains largely one-way.'},{id:'b',text:'A strong foundation, but partnership is still developing',strongest:true,feedback:'Yes. Later 4e practice becomes two-way, responsive and increasingly reciprocal, with stakeholders co-contributing to learning.'}]} connection="4e moves from reactive communication toward responsive, reciprocal partnership that strengthens learning across settings." />;
}
