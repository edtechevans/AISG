'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

type DecisionStep = SeriesItem;

const surface = 'mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6';
const option = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b294b] focus-visible:ring-offset-2 disabled:cursor-default';

export default function DataLearningExperience({ sectionId, learnPage }: { sectionId: string; learnPage: number }) {
  if (learnPage !== 1) return null;

  if (sectionId === 'data-gap') return <GapClassifier />;
  if (sectionId === 'data-big-small') return <BigSmallClassifier />;
  if (sectionId === 'data-inquiry') return <OnePointJudgement />;
  if (sectionId === 'data-monitor') return <MonitoringDecisionLab />;
  if (sectionId === 'data-adjust') return <NextMoveConstructCompare />;
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
    <div className="text-sm leading-6"><strong>{strong ? 'Strong professional judgement' : 'Reconsider this move'}</strong><p className="mt-1">{children}</p></div>
  </output>;
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
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: {connection}</p>
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
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: {connection}</p>
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
    <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-base font-semibold leading-7 text-[#0b294b]">{current.prompt}</p>
      {current.context && <p className="mt-2 text-sm leading-6 text-slate-600">{current.context}</p>}
      <div className="mt-5 grid gap-2">{current.choices.map((choice) => <button key={choice.id} type="button" disabled={Boolean(chosen)} className={`${option} ${choiceId === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setChoiceId(choice.id)}><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs text-[#0b294b]">{choice.id.toUpperCase()}</span>{choice.text}</button>)}</div>
      {chosen && <><Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback><div className="mt-4 flex justify-end"><Button onClick={advance} className="rounded-full bg-[#0b294b] text-white hover:bg-[#163b63]">{complete ? <><RotateCcw /> Run the lab again</> : <>Continue scenario <ArrowRight /></>}</Button></div></>}
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: {connection}</p>
  </section>;
}

function ConstructCompare({ title, description, prompt, placeholder, model, notice, connection }: { title: string; description: string; prompt: string; placeholder: string; model: string; notice: string; connection: string }) {
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const id = 'data-next-move-draft';

  return <section className={surface}>
    <ExperienceHeader kind="Construct & compare" title={title} description={description} />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Your task</strong><p className="mt-1">{prompt}</p></div>
    <label className="mt-4 block text-sm font-semibold text-[#0b294b]" htmlFor={id}>Write your response</label>
    <textarea id={id} value={draft} onChange={(event) => setDraft(event.target.value)} rows={5} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0b294b] focus:ring-2 focus:ring-[#0b294b]/20" />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">Your text stays on this page and is not submitted or scored.</span><Button variant="outline" disabled={!draft.trim()} onClick={() => setRevealed(true)}>Compare with a model</Button></div>
    {revealed && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" /> A strong response might sound like</div><p className="mt-2">{model}</p><p className="mt-2"><strong>Notice:</strong> {notice}</p></div>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: {connection}</p>
  </section>;
}

function GapClassifier() {
  return <SeriesLab
    title="Current state, desired state — or action?"
    description="Keeping these three ideas separate helps prevent solution-first thinking."
    items={[
      {
        prompt: 'In the last three common writing samples, 8 of 22 students consistently supported claims with relevant evidence.',
        choices: [
          { id: 'current', text: 'Current state', strongest: true, feedback: 'Yes. This describes what is happening now using evidence.' },
          { id: 'desired', text: 'Desired state', feedback: 'This is a description of present performance, not the future success state.' },
          { id: 'action', text: 'Action', feedback: 'No teaching move is described here. This is evidence about the current state.' },
        ],
      },
      {
        prompt: 'Students independently select relevant evidence and explain how it supports their claim in most extended responses.',
        choices: [
          { id: 'current', text: 'Current state', feedback: 'This is framed as the learner success we want to see, rather than what is happening now.' },
          { id: 'desired', text: 'Desired state', strongest: true, feedback: 'Yes. This describes meaningful future learner success.' },
          { id: 'action', text: 'Action', feedback: 'This describes learner performance, not the strategy the teacher will try.' },
        ],
      },
      {
        prompt: 'Use one worked example and one brief exit ticket during each evidence-writing lesson for the next two weeks.',
        choices: [
          { id: 'current', text: 'Current state', feedback: 'This is not evidence about what is happening now.' },
          { id: 'desired', text: 'Desired state', feedback: 'The desired state should describe learner success rather than an adult routine.' },
          { id: 'action', text: 'Action', strongest: true, feedback: 'Yes. This is a specific teaching move that can be tried and monitored.' },
        ],
      },
    ]}
    connection="Current state → desired state → gap → action. Keep the learner outcome separate from the strategy."
  />;
}

function BigSmallClassifier() {
  return <SeriesLab
    title="What kind of evidence helps here?"
    description="Big and small data answer different questions. Match the evidence to the decision."
    items={[
      {
        prompt: 'You want to know whether reading outcomes have moved across the grade over the last two assessment windows.',
        choices: [
          { id: 'big', text: 'Start with broader pattern data', strongest: true, feedback: 'Yes. Repeated common measures, report-card patterns or MAP can show broader movement over time.' },
          { id: 'small', text: 'Only collect one exit ticket', feedback: 'An exit ticket can deepen understanding, but one classroom snapshot is not enough for a grade-wide trend question.' },
        ],
      },
      {
        prompt: 'You know comprehension is weaker, but want to understand how students are approaching the task and where the breakdown occurs.',
        choices: [
          { id: 'big', text: 'Look only at the overall score again', feedback: 'The score can confirm the pattern, but it may not make the learner thinking visible.' },
          { id: 'small', text: 'Inspect work, talk with students, observe strategies and use a short diagnostic prompt', strongest: true, feedback: 'Yes. Close evidence helps reveal the learner experience behind the broader pattern.' },
        ],
      },
      {
        prompt: 'You need enough confidence to decide whether to change instruction for the next two weeks.',
        choices: [
          { id: 'one', text: 'Choose whichever single source looks clearest', feedback: 'A single source can be useful, but an instructional change is stronger when more than one relevant source points in the same direction or explains different parts of the need.' },
          { id: 'both', text: 'Connect broader pattern evidence with close classroom evidence', strongest: true, feedback: 'Yes. One helps locate the pattern; the other helps you understand and respond to it.' },
        ],
      },
    ]}
    connection="Big data helps reveal patterns over time; small data helps reveal learner experience now. Together they support better teaching decisions."
  />;
}

function OnePointJudgement() {
  return <SingleChoiceLab
    title="One data point is not a conclusion"
    description="Decide how far the evidence allows you to go before you act."
    situation="After introducing a new concept, 70% of the class misses the same item on one exit ticket. You need to decide what to do tomorrow."
    choices={[
      { id: 'a', text: 'Conclude that students lack the prerequisite knowledge and restart the whole unit.', feedback: 'That conclusion goes beyond the evidence. The exit ticket signals a problem, but not yet its cause or scale.' },
      { id: 'b', text: 'Inspect the responses for the specific misconception, check another quick source of evidence, then respond to the pattern you can actually see.', strongest: true, feedback: 'Yes. This keeps the response timely without turning one signal into a fixed story about learners.' },
      { id: 'c', text: 'Ignore the exit ticket because one data point is never useful.', feedback: 'One data point can be very useful as a signal. The key is to avoid treating it as the whole explanation.' },
    ]}
    connection="Notice → question → connect → act. Evidence should sharpen the next question before it hardens into a judgement."
  />;
}

function MonitoringDecisionLab() {
  return <DecisionLab
    title="Build a monitoring plan that teaches you something"
    description="A classroom action is more useful when you decide in advance what change would count as progress."
    steps={[
      {
        prompt: 'You introduce structured peer feedback because students are making surface-level revisions. What should you monitor?',
        choices: [
          { id: 'a', text: 'How many peer-feedback forms are completed.', feedback: 'That tells you whether the routine happened, not whether revision quality improved.' },
          { id: 'b', text: 'The quality of revisions students make and how they explain the changes they chose.', strongest: true, feedback: 'Yes. The evidence is tied to the learner outcome rather than the activity itself.' },
        ],
      },
      {
        prompt: 'What is a proportionate way to collect that evidence?',
        context: 'You want information soon enough to adjust instruction without turning the improvement cycle into constant testing.',
        choices: [
          { id: 'a', text: 'Use one common before/after writing sample, a brief revision-quality check, and a few student explanations across two weeks.', strongest: true, feedback: 'Yes. This is light enough for classroom use while still creating comparable evidence.' },
          { id: 'b', text: 'Run a full 45-minute assessment every day.', feedback: 'That creates more measurement burden than the decision requires.' },
        ],
      },
      {
        prompt: 'After two weeks, overall revision quality improves but several students say the feedback language is hard to use. What next?',
        choices: [
          { id: 'a', text: 'Keep the routine exactly the same because the average improved.', feedback: 'The overall gain matters, but the small-data signal shows an access barrier worth addressing.' },
          { id: 'b', text: 'Keep the useful structure, simplify or model the feedback language, then continue monitoring who benefits.', strongest: true, feedback: 'Yes. Adjustment preserves what is working while responding to learner experience.' },
        ],
      },
    ]}
    connection="Action → progress monitoring → adjust. Monitor the learner change, not just whether the teacher used the strategy."
  />;
}

function NextMoveConstructCompare() {
  return <ConstructCompare
    title="Turn evidence into one next move"
    description="Keep the cycle small enough that you can actually learn from it."
    prompt="Imagine your students can complete a procedure accurately in guided practice, but independent work shows they often choose the wrong strategy. Write four short lines: (1) the gap you would investigate, (2) one teaching move you might try, (3) the evidence you would monitor, and (4) when you would review it."
    placeholder="Gap: ...\nAction: ...\nEvidence: ...\nReview: ..."
    model="Gap: Students can execute the procedure but do not yet select it appropriately when the problem format changes. Action: Use worked-example comparisons and ask students to explain why a strategy fits before solving. Evidence: Two brief transfer problems plus student explanations across three lessons. Review: At the end of next week, compare the pattern and decide whether to continue, adapt or investigate a different barrier."
    notice="The response does not try to solve everything. It connects a specific gap to one plausible action, evidence of learner change and a near-term decision point."
    connection="New evidence becomes the next starting point. The purpose of the cycle is to improve the next decision, not prove the first idea was right."
  />;
}
