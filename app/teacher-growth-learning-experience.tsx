'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GrowthCourse = 'growth-domain1' | 'growth-domain2';
type Choice = { id: string; text: string; strongest?: boolean; feedback: string };
type SeriesItem = { prompt: string; context?: string; choices: Choice[] };

type DecisionStep = SeriesItem;

const surface = 'mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6';
const option = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b294b] focus-visible:ring-offset-2 disabled:cursor-default';

export default function TeacherGrowthLearningExperience({ course, sectionId, learnPage }: { course: GrowthCourse; sectionId: string; learnPage: number }) {
  if (learnPage !== 1) return null;

  if (course === 'growth-domain1') {
    if (sectionId === 'growth-d1-continuum') return <Domain1EvidenceLab />;
    if (sectionId === 'growth-d1-purpose') return <PurposeContinuumLab />;
    if (sectionId === 'growth-d1-learners') return <LearnerIdentityDecisionLab />;
    if (sectionId === 'growth-d1-engagements') return <EngagementJudgementLab />;
    if (sectionId === 'growth-d1-assessment') return <AssessmentNextMoveLab />;
  }

  if (course === 'growth-domain2') {
    if (sectionId === 'growth-d2-continuum') return <Domain2ResponsibilityLab />;
    if (sectionId === 'growth-d2-belonging') return <BelongingContinuumLab />;
    if (sectionId === 'growth-d2-voice') return <VoiceInfluenceLab />;
    if (sectionId === 'growth-d2-routines') return <RoutineDecisionLab />;
    if (sectionId === 'growth-d2-environment') return <EnvironmentNextMoveLab />;
  }

  return null;
}

function ExperienceHeader({ kind, title, description }: { kind: string; title: string; description: string }) {
  return <div className="mb-5">
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b294b] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-white"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> {kind}</span>
      <span className="text-xs font-semibold text-slate-500">Practice · not scored</span>
    </div>
    <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#0b294b] sm:text-2xl">{title}</h2>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
  </div>;
}

function Feedback({ strong, children }: { strong: boolean; children: React.ReactNode }) {
  return <output aria-live="polite" className={`mt-4 flex gap-3 rounded-xl border p-4 ${strong ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
    {strong ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
    <div className="text-sm leading-6"><strong>{strong ? 'Strong continuum reading' : 'Look again at the learner evidence'}</strong><p className="mt-1">{children}</p></div>
  </output>;
}

function SeriesLab({ title, description, items, connection }: { title: string; description: string; items: SeriesItem[]; connection: string }) {
  const [responses, setResponses] = useState<Record<number, string>>({});
  return <section className={surface}>
    <ExperienceHeader kind="Classify & compare" title={title} description={description} />
    <div className="grid gap-4">{items.map((item, index) => {
      const selected = responses[index];
      const chosen = item.choices.find((choice) => choice.id === selected);
      return <div key={item.prompt} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <p className="text-sm font-semibold leading-6 text-[#0b294b]">{item.prompt}</p>
        {item.context && <p className="mt-1 text-sm leading-6 text-slate-600">{item.context}</p>}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">{item.choices.map((choice) => <button key={choice.id} type="button" className={`${option} ${selected === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setResponses((current) => ({ ...current, [index]: choice.id }))}>{choice.text}</button>)}</div>
        {chosen && <Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback>}
      </div>;
    })}</div>
    <p className="mt-4 text-xs leading-5 text-slate-500">Continuum connection: {connection}</p>
  </section>;
}

function SingleChoiceLab({ title, description, situation, choices, connection }: { title: string; description: string; situation: string; choices: Choice[]; connection: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const chosen = choices.find((choice) => choice.id === selected);
  return <section className={surface}>
    <ExperienceHeader kind="Quick judgement" title={title} description={description} />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Situation</strong><p className="mt-1">{situation}</p></div>
    <div className="mt-4 grid gap-2">{choices.map((choice) => <button key={choice.id} type="button" className={`${option} ${selected === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setSelected(choice.id)}>{choice.text}</button>)}</div>
    {chosen && <Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Continuum connection: {connection}</p>
  </section>;
}

function DecisionLab({ title, description, steps, connection }: { title: string; description: string; steps: DecisionStep[]; connection: string }) {
  const [step, setStep] = useState(0);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const current = steps[step];
  const chosen = current.choices.find((choice) => choice.id === choiceId);
  const complete = step === steps.length - 1 && Boolean(chosen);

  function advance() {
    if (step < steps.length - 1) {
      setStep((value) => value + 1);
      setChoiceId(null);
      return;
    }
    setStep(0);
    setChoiceId(null);
  }

  return <section className={`${surface} border-[#cbd7e2] bg-[#f5f8fb]`}>
    <ExperienceHeader kind="Decision lab" title={title} description={description} />
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.1em] text-slate-500"><GitBranch className="h-4 w-4" aria-hidden="true" /><span>Decision {step + 1} of {steps.length}</span></div>
    <div className="mt-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <p className="text-base font-semibold leading-7 text-[#0b294b]">{current.prompt}</p>
      {current.context && <p className="mt-2 text-sm leading-6 text-slate-600">{current.context}</p>}
      <div className="mt-5 grid gap-2">{current.choices.map((choice) => <button key={choice.id} type="button" disabled={Boolean(chosen)} className={`${option} ${choiceId === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setChoiceId(choice.id)}><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs text-[#0b294b]">{choice.id.toUpperCase()}</span>{choice.text}</button>)}</div>
      {chosen && <><Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback><div className="mt-4 flex justify-end"><Button onClick={advance} className="rounded-full bg-[#0b294b] text-white hover:bg-[#163b63]">{complete ? <><RotateCcw /> Run the lab again</> : <>Continue scenario <ArrowRight /></>}</Button></div></>}
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-500">Continuum connection: {connection}</p>
  </section>;
}

function ConstructCompare({ title, description, prompt, placeholder, model, notice, connection, id }: { title: string; description: string; prompt: string; placeholder: string; model: string; notice: string; connection: string; id: string }) {
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  return <section className={surface}>
    <ExperienceHeader kind="Construct & compare" title={title} description={description} />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Your task</strong><p className="mt-1">{prompt}</p></div>
    <label className="mt-4 block text-sm font-semibold text-[#0b294b]" htmlFor={id}>Write your next move</label>
    <textarea id={id} value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0b294b] focus:ring-2 focus:ring-[#0b294b]/20" />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">Your text stays on this page and is not submitted or scored.</span><Button variant="outline" disabled={!draft.trim()} onClick={() => setRevealed(true)}>Compare with a model</Button></div>
    {revealed && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" /> A focused next move might sound like</div><p className="mt-2">{model}</p><p className="mt-2"><strong>Notice:</strong> {notice}</p></div>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Continuum connection: {connection}</p>
  </section>;
}

function Domain1EvidenceLab() {
  return <SeriesLab title="Teacher action — or learner evidence?" description="The continuum is strongest when reflection stays anchored in what students are actually experiencing." items={[
    { prompt: '“I posted the learning intention on the board.”', choices: [
      { id: 'action', text: 'Mostly teacher action', strongest: true, feedback: 'Yes. Posting a goal tells us what the teacher did, but not yet whether students understand or use it.' },
      { id: 'evidence', text: 'Strong learner evidence', feedback: 'Not yet. We would need evidence such as students explaining the purpose, using criteria or monitoring progress.' },
    ]},
    { prompt: '“Students refer to shared criteria during the task and independently explain what they are trying to improve.”', choices: [
      { id: 'action', text: 'Mostly teacher action', feedback: 'This is directly observable in student behaviour and thinking.' },
      { id: 'evidence', text: 'Strong learner evidence', strongest: true, feedback: 'Yes. This shows what students are doing with the design, which is central to the continuum.' },
    ]},
    { prompt: '“I provided three resources and two scaffolds.”', choices: [
      { id: 'action', text: 'Mostly teacher action', strongest: true, feedback: 'Yes. The design move matters, but the continuum asks what access, engagement or independence it produced for learners.' },
      { id: 'evidence', text: 'Strong learner evidence', feedback: 'Not by itself. We still need to notice how students accessed and used those supports.' },
    ]},
  ]} connection="Domains 1–3 are primarily evidenced through student experience and outcomes, not a tally of teacher strategies." />;
}

function PurposeContinuumLab() {
  return <SeriesLab title="What deepens across 1a?" description="Read three snapshots by focusing on student clarity, monitoring and transfer." items={[
    { prompt: 'Students ask what they have to finish and cannot explain what success looks like.', choices: [
      { id: 'early', text: 'Earlier continuum evidence', strongest: true, feedback: 'Yes. This closely reflects activity focus and limited clarity at the Exploring end.' },
      { id: 'later', text: 'Later continuum evidence', feedback: 'Later descriptors show students using goals and criteria with increasing independence.' },
    ]},
    { prompt: 'Students explain the success criteria and use them to monitor progress during learning.', choices: [
      { id: 'early', text: 'Earlier continuum evidence', feedback: 'This shows stronger learner clarity and monitoring.' },
      { id: 'later', text: 'Embedding-type evidence', strongest: true, feedback: 'Yes. Students understanding purpose and monitoring progress are explicit Embedding indicators.' },
    ]},
    { prompt: 'Students independently transfer goals to a new context and revise their own goals when the situation changes.', choices: [
      { id: 'embedding', text: 'Embedding only', feedback: 'This goes beyond consistent use within the immediate learning.' },
      { id: 'later', text: 'Extending / Transformational evidence', strongest: true, feedback: 'Yes. Independent transfer, adaptation and goal ownership characterise the later continuum.' },
    ]},
  ]} connection="1a moves from activity focus → clarity and criteria → independent transfer and co-ownership of learning purpose." />;
}

function LearnerIdentityDecisionLab() {
  return <DecisionLab title="From knowing learners to designing with them" description="Follow one planning decision as learner information becomes a design resource rather than background knowledge." steps={[
    { prompt: 'You know several learners are multilingual and that some students do not see their identities represented in the current materials. What is the strongest first move?', choices: [
      { id: 'a', text: 'Keep the same design until students struggle.', feedback: 'This leaves learner information disconnected from planning.' },
      { id: 'b', text: 'Use the learner information to anticipate access and representation barriers before the task begins.', strongest: true, feedback: 'Yes. 1b deepens when learner data, identities, strengths and needs shape planning proactively.' },
    ]},
    { prompt: 'The revised task now includes relevant representation and multiple valid pathways. What evidence matters next?', context: 'You want to know whether the design is actually becoming more inclusive.', choices: [
      { id: 'a', text: 'Whether students access learning meaningfully across the class and whether barriers have reduced.', strongest: true, feedback: 'Yes. Embedding is visible in equitable access, representation and meaningful engagement.' },
      { id: 'b', text: 'Whether every student chose the same support.', feedback: 'Uniform support is not the goal; responsive access is.' },
    ]},
    { prompt: 'Students now independently choose strategies that support their learning and suggest adaptations when a barrier appears. What has changed?', choices: [
      { id: 'a', text: 'Learner ownership of access and strategy use is increasing.', strongest: true, feedback: 'Yes. Later 1b descriptors emphasise students selecting strategies, shaping pathways and advocating for inclusion.' },
      { id: 'b', text: 'The teacher no longer has responsibility for inclusive design.', feedback: 'Learner ownership grows, but teacher responsibility for purposeful design remains.' },
    ]},
  ]} connection="1b develops from awareness of differences toward responsive design, independent strategy use and learner advocacy." />;
}

function EngagementJudgementLab() {
  return <SingleChoiceLab title="Accessible — but is it cognitively engaging?" description="Avoid treating access and challenge as opposites." situation="A learning engagement includes multiple supports and accessible materials, but the student task is still almost entirely copying, recall and repetition." choices={[
    { id: 'a', text: 'The design is already Embedded because accessibility supports are visible.', feedback: 'Accessibility matters, but 1c Embedding also expects cognitive engagement, deeper thinking and multiple perspectives.' },
    { id: 'b', text: 'Keep the access supports and strengthen the task so students analyse, create, problem-solve or engage with diverse perspectives.', strongest: true, feedback: 'Yes. The continuum brings access and cognitive demand together rather than trading one for the other.' },
    { id: 'c', text: 'Remove the supports to make the learning more rigorous.', feedback: 'The continuum does not equate unnecessary barriers with rigor.' },
  ]} connection="1c Embedding combines inclusive access with cognitively engaging learning; later levels add transfer, student-driven inquiry and authentic problem-solving." />;
}

function AssessmentNextMoveLab() {
  return <ConstructCompare id="growth-d1-assessment-next" title="Name the smallest useful next move" description="Use evidence from the continuum rather than aiming immediately for Transformational." prompt="Students use teacher feedback to revise successfully, but still wait for the teacher to tell them when they are ready to move on and which strategy to try next. Write one focused next move." placeholder="For example: I will... so that students can... Evidence I will look for is..." model="Introduce a shared progress-check routine using the existing success criteria, then ask students to identify their own next strategy before a teacher conference. Look for students independently explaining where they are, what evidence supports that judgement, and what they will try next." notice="The move builds from an existing strength — students already use feedback — and targets the next visible developmental gap: independent monitoring and strategy adjustment." connection="1d moves from formative checking with guidance toward independent progress monitoring, goal-setting and adaptation." />;
}

function Domain2ResponsibilityLab() {
  return <SeriesLab title="Who is carrying the environment?" description="A calm classroom can still be highly teacher-dependent. Look for growing learner responsibility." items={[
    { prompt: 'The teacher gives every transition cue, chooses every tool and resolves every small participation issue.', choices: [
      { id: 'teacher', text: 'Mostly teacher-managed', strongest: true, feedback: 'Yes. The environment may be orderly, but student autonomy and shared responsibility remain limited.' },
      { id: 'learner', text: 'Learner-sustained', feedback: 'The evidence shows strong teacher management rather than learner ownership.' },
    ]},
    { prompt: 'Students initiate familiar routines, manage materials and time, and include peers without prompting.', choices: [
      { id: 'teacher', text: 'Mostly teacher-managed', feedback: 'The evidence is increasingly learner-owned.' },
      { id: 'learner', text: 'Learner-sustained', strongest: true, feedback: 'Yes. These are signs of autonomy, belonging and shared responsibility becoming embedded.' },
    ]},
    { prompt: 'Students notice a routine is excluding some peers, propose an adjustment and sustain the new approach.', choices: [
      { id: 'routine', text: 'Only routine compliance', feedback: 'This is more than following a routine.' },
      { id: 'later', text: 'Later continuum evidence', strongest: true, feedback: 'Yes. Students are adapting systems and supporting equity for others, which reflects Extending/Transformational practice.' },
    ]},
  ]} connection="Domain 2 develops from teacher-established structures toward students independently sustaining, adapting and improving the conditions for learning." />;
}

function BelongingContinuumLab() {
  return <SeriesLab title="Read belonging in the evidence" description="Belonging is visible in participation, risk-taking, peer support and how the group responds to exclusion." items={[
    { prompt: 'Most students participate when prompted and respectful interactions are generally evident.', choices: [
      { id: 'building', text: 'Building-type evidence', strongest: true, feedback: 'Yes. This closely matches the Building indicators in 2a.' },
      { id: 'transformational', text: 'Transformational evidence', feedback: 'Transformational 2a includes students actively protecting and promoting inclusive community practices.' },
    ]},
    { prompt: 'Students contribute without prompting, participation is broadly distributed and peers support one another respectfully.', choices: [
      { id: 'embedding', text: 'Embedding-type evidence', strongest: true, feedback: 'Yes. These are explicit Embedding indicators.' },
      { id: 'exploring', text: 'Exploring-type evidence', feedback: 'This shows considerably more consistency and inclusion than the Exploring description.' },
    ]},
    { prompt: 'Students address exclusion or bias and take responsibility for inclusive group culture.', choices: [
      { id: 'building', text: 'Building-type evidence', feedback: 'This goes beyond guided respectful participation.' },
      { id: 'transformational', text: 'Transformational-type evidence', strongest: true, feedback: 'Yes. Collective responsibility for inclusion is central to the Transformational descriptor.' },
    ]},
  ]} connection="2a moves from basic expectations → safe participation → broadly distributed contribution → learner-sustained inclusive culture." />;
}

function VoiceInfluenceLab() {
  return <SingleChoiceLab title="Voice that is heard — or voice that matters?" description="The continuum deepens when student input increasingly influences learning." situation="Students complete a reflection after each unit and regularly offer useful suggestions. The responses are collected, but learners cannot identify any way their input has influenced learning design." choices={[
    { id: 'a', text: 'Student voice is already Embedded because a reflection structure exists.', feedback: 'A structure creates an opportunity for voice, but the later continuum depends on student input influencing learning.' },
    { id: 'b', text: 'Close the loop: identify themes, act on a relevant suggestion where appropriate, and make the influence visible to students.', strongest: true, feedback: 'Yes. Embedding and Extending increasingly show student ideas shaping, adapting and improving learning.' },
    { id: 'c', text: 'Stop asking for student input because the teacher remains responsible for planning.', feedback: 'Teacher responsibility and meaningful student voice can coexist.' },
  ]} connection="2b progresses from passive participation to structured voice, authentic influence, independent advocacy and student-led impact." />;
}

function RoutineDecisionLab() {
  return <DecisionLab title="Can the routine travel?" description="Strong routines are not only efficient in one familiar context; learners increasingly understand and adapt them." steps={[
    { prompt: 'Your classroom transition works smoothly every day. What evidence would show Embedding rather than simple teacher efficiency?', choices: [
      { id: 'a', text: 'Students initiate the routine and manage time and materials consistently.', strongest: true, feedback: 'Yes. These are explicit Embedding indicators in 2c.' },
      { id: 'b', text: 'The teacher gives the cue quickly and students comply.', feedback: 'That can be efficient, but it still centres teacher direction.' },
    ]},
    { prompt: 'The class moves to a new learning space and waits for the teacher to recreate the routine step by step. What would deepen the practice?', choices: [
      { id: 'a', text: 'Help students identify the purpose of the routine and decide how to adapt it to the new context.', strongest: true, feedback: 'Yes. Extending includes independent adaptation and transfer across learning situations.' },
      { id: 'b', text: 'Avoid unfamiliar spaces so routines remain consistent.', feedback: 'That preserves the routine but does not develop transfer.' },
    ]},
    { prompt: 'Students notice the adapted routine still excludes one learner. What would most closely reflect Transformational practice?', choices: [
      { id: 'a', text: 'Students suggest and sustain a refinement that improves access for the group.', strongest: true, feedback: 'Yes. Transformational 2c includes co-creating, sustaining and refining equitable routines.' },
      { id: 'b', text: 'Wait for the teacher to redesign it next lesson.', feedback: 'Teacher support may still matter, but the continuum’s later descriptors emphasise growing learner ownership of equitable systems.' },
    ]},
  ]} connection="2c develops from teacher-directed routines toward learner-managed, transferable and co-refined systems." />;
}

function EnvironmentNextMoveLab() {
  return <ConstructCompare id="growth-d2-environment-next" title="Redesign the conditions, not the learner" description="Use Domain 2 evidence to choose a focused environmental next move." prompt="Discussion is respectful, but participation remains uneven. Several students say the room layout and fast whole-group turn-taking make it difficult to enter the conversation. Write one next move and the student evidence you would look for." placeholder="I will adjust... I will look for students..." model="Change the discussion structure and physical setup so there are clearer entry points into the conversation, then look for broader participation, more students responding to one another, and learners increasingly choosing spaces or structures that support their contribution." notice="The response changes the conditions for participation and then checks learner evidence. It avoids turning quiet participation into a fixed judgement about individual students." connection="2d asks whether space, time and tools enhance access and participation and whether students increasingly use them strategically." />;
}
