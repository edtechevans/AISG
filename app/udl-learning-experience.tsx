'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  sectionId: string;
  learnPage: number;
};

type Choice = {
  id: string;
  text: string;
  strongest?: boolean;
  feedback: string;
};

type SeriesItem = {
  prompt: string;
  context?: string;
  choices: Choice[];
};

const surface = 'mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6';
const option = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b294b] focus-visible:ring-offset-2 disabled:cursor-default';

export default function UdlLearningExperience({ sectionId, learnPage }: Props) {
  if (learnPage !== 1) return null;

  if (sectionId === 'udl-variability') return <BarrierOrLearnerClassifier />;
  if (sectionId === 'udl-goals-barriers') return <GoalOrMeansJudgement />;
  if (sectionId === 'udl-engagement') return <EngagementDecisionLab />;
  if (sectionId === 'udl-action-expression') return <ExpressionClassifier />;
  if (sectionId === 'udl-design-cycle') return <UdlRedesignConstructCompare />;

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
    <div className="text-sm leading-6"><strong>{strong ? 'Strong UDL judgement' : 'Reconsider the design'}</strong><p className="mt-1">{children}</p></div>
  </output>;
}

function SingleChoiceLab({ title, description, situation, choices, connection }: { title: string; description: string; situation: string; choices: Choice[]; connection: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const chosen = choices.find((choice) => choice.id === selected);

  return <section className={surface}>
    <ExperienceHeader kind="Quick judgement" title={title} description={description} />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Situation</strong><p className="mt-1">{situation}</p></div>
    <div className="mt-4 grid gap-2">{choices.map((choice) => <button key={choice.id} type="button" className={`${option} ${selected === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setSelected(choice.id)}>{choice.text}</button>)}</div>
    {chosen && <Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback>}
    <p className="mt-4 text-xs leading-5 text-slate-500">UDL connection: {connection}</p>
  </section>;
}

function SeriesLab({ title, description, items, connection }: { title: string; description: string; items: SeriesItem[]; connection: string }) {
  const [responses, setResponses] = useState<Record<number, string>>({});

  return <section className={surface}>
    <ExperienceHeader kind="Classify & compare" title={title} description={description} />
    <div className="grid gap-4">{items.map((item, index) => {
      const selected = responses[index];
      const chosen = item.choices.find((choice) => choice.id === selected);
      return <div key={item.prompt} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-semibold leading-6 text-[#0b294b]">{item.prompt}</p>
        {item.context && <p className="mt-1 text-sm leading-6 text-slate-600">{item.context}</p>}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">{item.choices.map((choice) => <button key={choice.id} type="button" className={`${option} ${selected === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setResponses((current) => ({ ...current, [index]: choice.id }))}>{choice.text}</button>)}</div>
        {chosen && <Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback>}
      </div>;
    })}</div>
    <p className="mt-4 text-xs leading-5 text-slate-500">UDL connection: {connection}</p>
  </section>;
}

function DecisionLab({ title, description, steps, connection }: { title: string; description: string; steps: SeriesItem[]; connection: string }) {
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
    <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-base font-semibold leading-7 text-[#0b294b]">{current.prompt}</p>
      {current.context && <p className="mt-2 text-sm leading-6 text-slate-600">{current.context}</p>}
      <div className="mt-5 grid gap-2">{current.choices.map((choice) => <button key={choice.id} type="button" disabled={Boolean(chosen)} className={`${option} ${choiceId === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setChoiceId(choice.id)}><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs text-[#0b294b]">{choice.id.toUpperCase()}</span>{choice.text}</button>)}</div>
      {chosen && <><Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback><div className="mt-4 flex justify-end"><Button onClick={advance} className="rounded-full bg-[#0b294b] text-white hover:bg-[#163b63]">{complete ? <><RotateCcw /> Run the lab again</> : <>Continue scenario <ArrowRight /></>}</Button></div></>}
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-500">UDL connection: {connection}</p>
  </section>;
}

function ConstructCompare({ title, description, prompt, placeholder, model, notice, connection }: { title: string; description: string; prompt: string; placeholder: string; model: string; notice: string; connection: string }) {
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);

  return <section className={surface}>
    <ExperienceHeader kind="Construct & compare" title={title} description={description} />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Your task</strong><p className="mt-1">{prompt}</p></div>
    <label className="mt-4 block text-sm font-semibold text-[#0b294b]" htmlFor={`${title.replaceAll(' ', '-').toLowerCase()}-draft`}>Write your response</label>
    <textarea id={`${title.replaceAll(' ', '-').toLowerCase()}-draft`} value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0b294b] focus:ring-2 focus:ring-[#0b294b]/20" />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">Your text stays on this page and is not submitted or scored.</span><Button variant="outline" disabled={!draft.trim()} onClick={() => setRevealed(true)}>Compare with a model</Button></div>
    {revealed && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" /> A strong redesign might sound like</div><p className="mt-2">{model}</p><p className="mt-2"><strong>Notice:</strong> {notice}</p></div>}
    <p className="mt-4 text-xs leading-5 text-slate-500">UDL connection: {connection}</p>
  </section>;
}

function BarrierOrLearnerClassifier() {
  return <SeriesLab
    title="Where is the barrier?"
    description="UDL changes the unit of analysis. Decide whether each statement locates the problem in the learner or examines the interaction between the learner and the design."
    items={[
      {
        prompt: '“She cannot learn this because she is an English learner.”',
        choices: [
          { id: 'a', text: 'Learner-deficit framing', strongest: true, feedback: 'Correct. The statement treats a learner characteristic as the problem instead of examining language, representation and access in the design.' },
          { id: 'b', text: 'Barrier-aware framing', feedback: 'Not yet. A barrier-aware statement would ask where the learning environment or materials create unnecessary language demands.' },
        ],
      },
      {
        prompt: '“The only way to access the concept is a dense text. Decoding is not the learning goal, so we should redesign access to the information.”',
        choices: [
          { id: 'a', text: 'Learner-deficit framing', feedback: 'The statement does not blame a learner. It identifies a feature of the design that may block access.' },
          { id: 'b', text: 'Barrier-aware framing', strongest: true, feedback: 'Correct. The designer is preserving the goal while examining an unnecessary access barrier.' },
        ],
      },
      {
        prompt: '“These students are not motivated, so they need easier work.”',
        choices: [
          { id: 'a', text: 'Learner-deficit framing', strongest: true, feedback: 'Correct. The statement labels the learners and jumps to lower challenge rather than examining purpose, relevance, belonging, threat, challenge or support.' },
          { id: 'b', text: 'Barrier-aware framing', feedback: 'A UDL analysis would investigate the engagement design before concluding that motivation is a fixed learner trait.' },
        ],
      },
    ]}
    connection="Learner variability is expected. Barriers emerge in the interaction between learners and goals, environments, methods, materials and assessments."
  />;
}

function GoalOrMeansJudgement() {
  return <SingleChoiceLab
    title="Protect the goal — flex the means"
    description="Decide whether the traditional task requirement is actually part of the learning goal."
    situation="Students need to compare two interpretations of a historical event using evidence. The current assessment requires every learner to give a five-minute live speech without notes."
    choices={[
      { id: 'a', text: 'Keep the live speech because UDL should never change an assessment format.', feedback: 'UDL can change non-essential means. First determine whether live public speaking is actually part of the intended learning.' },
      { id: 'b', text: 'Remove the evidence requirement so students have more freedom.', feedback: 'That changes the goal rather than reducing an unnecessary barrier.' },
      { id: 'c', text: 'Keep the comparison-and-evidence goal, then offer valid ways to communicate the reasoning if live public speaking is not itself being assessed.', strongest: true, feedback: 'Yes. UDL separates the goal from the means when possible, preserving common expectations while making the pathway more flexible.' },
    ]}
    connection="Clear goals allow educators to identify which features are essential and which can become flexible without reducing the intended challenge."
  />;
}

function EngagementDecisionLab() {
  return <DecisionLab
    title="From compliance to purposeful engagement"
    description="Work through a learning design where students are completing the task but not meaningfully engaging with it."
    steps={[
      {
        prompt: 'Students are completing a research task, but many say they do not understand why the question matters.',
        choices: [
          { id: 'a', text: 'Add a completion prize.', feedback: 'A reward may change compliance without strengthening meaning, relevance or agency.' },
          { id: 'b', text: 'Clarify the purpose, connect the question to authentic contexts and invite meaningful choices about the direction of inquiry.', strongest: true, feedback: 'Strong. Engagement begins with purpose, relevance and meaningful autonomy rather than simply making the task more entertaining.' },
          { id: 'c', text: 'Shorten the research requirement for everyone.', feedback: 'The issue described is purpose, not necessarily the amount of challenge.' },
        ],
      },
      {
        prompt: 'The inquiry is now meaningful, but some students disengage when the task becomes complex.',
        context: 'The learning goal should remain ambitious.',
        choices: [
          { id: 'a', text: 'Provide visible goals, checkpoints, graduated support, collaborative interdependence and feedback that points to an actionable next move.', strongest: true, feedback: 'Strong. This supports effort and persistence without removing productive challenge.' },
          { id: 'b', text: 'Replace the inquiry with a simpler worksheet.', feedback: 'That may remove the intended challenge rather than helping learners persist through it.' },
          { id: 'c', text: 'Tell students resilience means completing the same task without support.', feedback: 'UDL designs environments that support persistence; it does not treat challenge as a test of who can manage without scaffolding.' },
        ],
      },
      {
        prompt: 'A few students still rarely contribute during whole-class discussion but contribute deeply in writing and small groups.',
        choices: [
          { id: 'a', text: 'Treat the pattern as evidence that the students are not engaged.', feedback: 'The participation structure may be the barrier. Engagement evidence should be interpreted across multiple forms of participation.' },
          { id: 'b', text: 'Vary and value ways to prepare, contribute and collaborate, while still supporting growth in discussion skills where relevant.', strongest: true, feedback: 'Strong. UDL supports belonging and meaningful participation without assuming that one participation routine is the only evidence of engagement.' },
          { id: 'c', text: 'Remove all discussion from the course.', feedback: 'UDL does not require eliminating a mode. It asks for flexible, purposeful ways to participate.' },
        ],
      },
    ]}
    connection="Multiple Means of Engagement includes interests and identities, effort and persistence, belonging, challenge and support, collaboration, feedback and emotional capacity."
  />;
}

function ExpressionClassifier() {
  return <SeriesLab
    title="Flexible expression — or misaligned evidence?"
    description="Decide whether changing the response mode preserves the learning goal."
    items={[
      {
        prompt: 'Goal: explain a scientific relationship using evidence and reasoning. Students may respond through writing, annotated diagrams, recording or conference using the same criteria.',
        choices: [
          { id: 'a', text: 'Aligned flexibility', strongest: true, feedback: 'Correct. The reasoning is the goal, and different modes can provide valid evidence of that reasoning.' },
          { id: 'b', text: 'Misaligned flexibility', feedback: 'The varied formats do not remove the intended scientific reasoning.' },
        ],
      },
      {
        prompt: 'Goal: develop coherent academic writing. A student replaces the writing entirely with an oral recording.',
        choices: [
          { id: 'a', text: 'Aligned flexibility', feedback: 'Not if writing is the target skill. Supports can reduce barriers around planning, access and production without replacing the writing goal.' },
          { id: 'b', text: 'Misaligned flexibility', strongest: true, feedback: 'Correct. The response mode removes the very skill the assessment is intended to develop and evaluate.' },
        ],
      },
      {
        prompt: 'Goal: interpret a primary source. A learner uses text-to-speech because decoding is not part of the assessment.',
        choices: [
          { id: 'a', text: 'Aligned flexibility', strongest: true, feedback: 'Correct. The access tool removes an unnecessary decoding barrier while preserving the source interpretation goal.' },
          { id: 'b', text: 'Misaligned flexibility', feedback: 'Text-to-speech is not replacing the intended historical interpretation.' },
        ],
      },
    ]}
    connection="Multiple Means of Action & Expression should increase valid pathways for interaction and communication while keeping the intended learning evidence visible."
  />;
}

function UdlRedesignConstructCompare() {
  return <ConstructCompare
    title="Redesign one barrier, not the whole universe"
    description="Use UDL as an intentional design process rather than a checklist of features."
    prompt="Imagine an upcoming lesson where learners must understand a complex idea and then apply it. Identify one likely barrier, name the learning goal, and describe one purposeful design move using Engagement, Representation or Action & Expression."
    placeholder="Goal… Likely barrier… Design move… Evidence I would notice…"
    model="Goal: students will compare two explanations using evidence. Likely barrier: the only sources use dense unfamiliar language, even though decoding is not the goal. Design move: keep the same evidence and concepts, but provide vocabulary support, text-to-speech and a visual model of the comparison structure. Evidence: more students can identify the key ideas independently and use the evidence in their own comparison without the supports doing the reasoning for them."
    notice="The redesign starts with the goal, identifies a specific barrier, uses a targeted UDL option and names evidence that would show whether access and agency improved. It does not try to display every UDL consideration at once."
    connection="UDL is proactive and iterative: clarify the goal → anticipate variability → identify barriers → design purposeful options → notice learner evidence → redesign."
  />;
}
