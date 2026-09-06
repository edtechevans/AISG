'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Choice = { id: string; text: string; strongest?: boolean; feedback: string };
type SeriesItem = { prompt: string; context?: string; choices: Choice[] };
type DecisionStep = SeriesItem;

const surface = 'mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6';
const option = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b294b] focus-visible:ring-offset-2 disabled:cursor-default';

export default function AssessmentLearningExperience({ sectionId, learnPage }: { sectionId: string; learnPage: number }) {
  if (learnPage !== 1) return null;
  if (sectionId === 'afl-purpose') return <FormativeFunctionClassifier />;
  if (sectionId === 'afl-clarity') return <CriteriaClassifier />;
  if (sectionId === 'afl-evidence') return <EvidenceJudgement />;
  if (sectionId === 'afl-feedback') return <FeedbackConstructCompare />;
  if (sectionId === 'afl-agency') return <AssessmentCycleDecisionLab />;
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
      return <div key={item.prompt} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
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

function ConstructCompare({ title, description, prompt, placeholder, model, notice, connection }: { title: string; description: string; prompt: string; placeholder: string; model: string; notice: string; connection: string }) {
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const id = 'afl-feedback-draft';
  return <section className={surface}>
    <ExperienceHeader kind="Construct & compare" title={title} description={description} />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Your task</strong><p className="mt-1">{prompt}</p></div>
    <label className="mt-4 block text-sm font-semibold text-[#0b294b]" htmlFor={id}>Write your response</label>
    <textarea id={id} value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0b294b] focus:ring-2 focus:ring-[#0b294b]/20" />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">Your text stays on this page and is not submitted or scored.</span><Button variant="outline" disabled={!draft.trim()} onClick={() => setRevealed(true)}>Compare with a model</Button></div>
    {revealed && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" /> A strong response might sound like</div><p className="mt-2">{model}</p><p className="mt-2"><strong>Notice:</strong> {notice}</p></div>}
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
    if (step < steps.length - 1) { setStep((value) => value + 1); setChoiceId(null); return; }
    setStep(0); setChoiceId(null);
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
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: {connection}</p>
  </section>;
}

function FormativeFunctionClassifier() {
  return <SeriesLab title="Formative — or just frequent?" description="Decide whether the evidence is actually changing learning." connection="Assessment becomes formative when evidence is used to decide a next move while learning can still improve." items={[
    { prompt: 'Students complete a five-question check. The teacher groups tomorrow’s mini-lessons around the misconceptions that appear.', choices: [
      { id: 'f', text: 'Formative use', strongest: true, feedback: 'Yes. The evidence directly shapes the next teaching move.' },
      { id: 'c', text: 'Collection only', feedback: 'The teacher is doing more than collecting; the response pattern changes instruction.' },
    ] },
    { prompt: 'Students complete an exit ticket every Friday. Scores are entered, but no one revisits the responses.', choices: [
      { id: 'f', text: 'Formative use', feedback: 'Frequency alone does not make a check formative.' },
      { id: 'c', text: 'Collection only', strongest: true, feedback: 'Correct. Evidence is being gathered, but there is no learning response.' },
    ] },
    { prompt: 'Students compare a draft with shared criteria, revise one paragraph, and explain what changed.', choices: [
      { id: 'f', text: 'Formative use', strongest: true, feedback: 'Yes. Learners interpret evidence and act before the work is finished.' },
      { id: 'c', text: 'Collection only', feedback: 'The evidence is being actively used for revision.' },
    ] },
  ]} />;
}

function CriteriaClassifier() {
  return <SeriesLab title="Does the criterion reveal quality?" description="Separate criteria for learning from criteria for compliance." connection="Clear learning intentions and quality-focused success criteria help learners monitor progress and strengthen Agency." items={[
    { prompt: 'Uses relevant evidence and explains how it supports the claim.', choices: [
      { id: 'quality', text: 'Learning quality', strongest: true, feedback: 'Yes. This makes the quality of reasoning visible.' },
      { id: 'compliance', text: 'Mostly compliance', feedback: 'This criterion is directly connected to the intended learning.' },
    ] },
    { prompt: 'Uses exactly six slides and three colours.', choices: [
      { id: 'quality', text: 'Learning quality', feedback: 'Unless slide design is itself the learning target, these requirements say little about the quality of understanding.' },
      { id: 'compliance', text: 'Mostly compliance', strongest: true, feedback: 'Correct. This describes format rather than the quality of learning.' },
    ] },
    { prompt: 'Compares two perspectives and explains how context may shape each one.', choices: [
      { id: 'quality', text: 'Learning quality', strongest: true, feedback: 'Yes. This gives learners a useful lens for judging the quality of their thinking.' },
      { id: 'compliance', text: 'Mostly compliance', feedback: 'This is a substantive criterion, not merely a completion requirement.' },
    ] },
  ]} />;
}

function EvidenceJudgement() {
  return <SingleChoiceLab title="Who did your check actually tell you about?" description="Choose a response that makes more learner thinking visible." situation="You ask a challenging question. Four students put their hands up immediately; two give excellent answers. You have two minutes before deciding whether to move on." choices={[
    { id: 'a', text: 'Move on because the correct answers show the class is ready.', feedback: 'The evidence is too narrow. Volunteers may not represent the distribution of understanding.' },
    { id: 'b', text: 'Ask everyone to respond briefly — for example with a selected response, mini-whiteboard, short written explanation or other quick method — then inspect the pattern.', strongest: true, feedback: 'Yes. A fast whole-class check gives you stronger evidence for the decision without turning the lesson into a test.' },
    { id: 'c', text: 'Ask the same two students a harder follow-up question.', feedback: 'That may deepen their thinking, but it still does not tell you what the rest of the class understands.' },
  ]} connection="Elicit enough evidence to make a sound next teaching decision; do not confuse confident participation with whole-class understanding." />;
}

function FeedbackConstructCompare() {
  return <ConstructCompare title="Turn a comment into a next move" description="Rewrite feedback so the learner can do something useful with it." prompt="A student’s explanation includes strong evidence but mostly repeats it rather than explaining the connection to the claim. The current teacher comment is: ‘Needs more analysis.’ Write one short piece of feedback that would better move the learning forward." placeholder="Your claim and evidence are clear. Next..." model="Your claim and evidence are clear. Choose one piece of evidence and add a sentence explaining why it supports the claim — use the phrase ‘This matters because…’ if that helps you start." notice="The model identifies what is already working, names one high-leverage next step, and gives the learner something concrete to try. It does not attempt to correct everything at once." connection="Timely, specific and actionable feedback should create learner action while there is still time to improve." />;
}

function AssessmentCycleDecisionLab() {
  return <DecisionLab title="From teacher-owned checking to learner-owned improvement" description="Work through a short Assessment for Learning cycle and decide what should happen next." connection="Where are we going? Where are we now? What is the next move? TLF Agency grows when learners increasingly use criteria, feedback and evidence to answer those questions themselves." steps={[
    {
      prompt: 'Students are learning to explain how evidence supports a scientific claim. What should be clearest before the check?',
      choices: [
        { id: 'a', text: 'The number of points the task is worth.', feedback: 'Points may matter administratively, but they do not make the learning destination clear.' },
        { id: 'b', text: 'The learning intention and what a strong explanation looks like.', strongest: true, feedback: 'Yes. Learners need a visible destination before evidence can help them judge progress.' },
        { id: 'c', text: 'Which students are usually strongest in science.', feedback: 'Past performance should not replace evidence from the current learning.' },
      ],
    },
    {
      prompt: 'A quick check shows most learners select relevant evidence but do not explain the connection. What is the strongest response?',
      choices: [
        { id: 'a', text: 'Record the result and continue to the next concept.', feedback: 'The evidence has identified a live learning gap that can still be addressed.' },
        { id: 'b', text: 'Make the reasoning gap visible, compare or model examples, then give targeted practice.', strongest: true, feedback: 'Yes. The next move responds directly to what the evidence revealed.' },
        { id: 'c', text: 'Reteach the entire unit from the beginning.', feedback: 'The evidence points to a specific gap; the response should be proportionate.' },
      ],
    },
    {
      prompt: 'After the targeted practice, what most strengthens learner Agency?',
      choices: [
        { id: 'a', text: 'The teacher fixes every response before students see it.', feedback: 'That removes the learner from the improvement process.' },
        { id: 'b', text: 'Students use the criteria to identify one place their explanation improved and one next revision, then the teacher gathers new evidence.', strongest: true, feedback: 'Yes. Learners interpret evidence, make a decision and act — while the teacher still monitors the quality of learning.' },
        { id: 'c', text: 'Students predict their final grade.', feedback: 'A predicted grade alone does not necessarily reveal what to improve or how.' },
      ],
    },
  ]} />;
}
