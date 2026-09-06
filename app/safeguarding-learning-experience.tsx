'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, MessageCircle, RotateCcw, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ExperienceProps = {
  moduleId: string;
  stage: number;
};

type Choice = {
  id: string;
  text: string;
  strongest?: boolean;
  feedback: string;
};

type DecisionStep = {
  prompt: string;
  learnerWords?: string;
  choices: Choice[];
};

const surface = 'mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6';
const option = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b294b] focus-visible:ring-offset-2 disabled:cursor-default';

export default function SafeguardingLearningExperience({ moduleId, stage }: ExperienceProps) {
  const key = `${moduleId}-${stage}`;
  if (key === 'M1-1') return <ReasonableCauseCheck />;
  if (key === 'M2-3') return <DigitalHarmSort />;
  if (key === 'M3-4') return <DisclosureDecisionLab />;
  if (key === 'M4-3') return <ConstructAndCompare />;
  if (key === 'M5-4') return <AdultConductDecisionTree />;
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
  return <div role="status" aria-live="polite" className={`mt-4 flex gap-3 rounded-xl border p-4 ${strong ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
    {strong ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /> : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
    <div className="text-sm leading-6"><strong>{strong ? 'Strong safeguarding judgement' : 'Reconsider this move'}</strong><p className="mt-1">{children}</p></div>
  </div>;
}

function ReasonableCauseCheck() {
  const [selected, setSelected] = useState<string | null>(null);
  const choices: Choice[] = [
    { id: 'agree', text: 'Agree — I should wait until I have enough evidence to be confident abuse occurred.', feedback: 'AISG does not require proof before a concern is reported. Waiting for certainty can delay protection.' },
    { id: 'disagree', text: 'Disagree — reasonable cause to believe a student has suffered, or is at risk of suffering, harm is enough to report.', strongest: true, feedback: 'Yes. The employee’s role is to notice and report reasonable cause, not to prove or investigate what happened.' },
  ];
  const chosen = choices.find((choice) => choice.id === selected);

  return <section className={surface} aria-labelledby="reasonable-cause-title">
    <ExperienceHeader kind="Quick judgement" title="Would you wait for proof?" description="Make the decision before the course tells you whether your instinct matches the AISG reporting threshold." />
    <p id="reasonable-cause-title" className="rounded-xl bg-white p-4 text-base font-semibold leading-7 text-[#0b294b]">“I am concerned, but I cannot prove that abuse occurred. I should keep watching until I am more certain.”</p>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">{choices.map((choice) => <button key={choice.id} type="button" className={`${option} ${selected === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setSelected(choice.id)}>{choice.text}</button>)}</div>
    {chosen && <Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Handbook connection: 4.1 Reporting Requirements.</p>
  </section>;
}

function DigitalHarmSort() {
  const items = [
    { text: 'A manipulated image of a student is shared to humiliate them.', concern: true, why: 'Synthetic or manipulated media can be used to harass, humiliate or misrepresent a student.' },
    { text: 'Two students respectfully disagree in a group chat and the conversation ends without intimidation or coercion.', concern: false, why: 'Disagreement alone is not the same as antagonistic behaviour or cyber harassment. Context and impact still matter.' },
    { text: 'A student is threatened and blackmailed in a private message thread.', concern: true, why: 'Threats, coercion, extortion and blackmail are safeguarding concerns even when they occur digitally or outside school.' },
    { text: 'An AI-generated sexualised image is made to look like another student and circulated.', concern: true, why: 'Manipulated or synthetic media can constitute serious technology-enabled harm and should not be dismissed because it is fabricated.' },
  ];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const item = items[index];
  const correct = answer === item.concern;

  function next() {
    if (index === items.length - 1) { setIndex(0); setAnswer(null); return; }
    setIndex((current) => current + 1);
    setAnswer(null);
  }

  return <section className={surface} aria-labelledby="digital-sort-title">
    <ExperienceHeader kind="Classify" title="Signal, conflict or safeguarding concern?" description="Digital does not mean harmless. Classify each situation, then compare your judgement with the safeguarding principle." />
    <div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span id="digital-sort-title">Situation {index + 1} of {items.length}</span><span>{Math.round(((index + 1) / items.length) * 100)}%</span></div>
    <p className="mt-3 rounded-xl bg-white p-5 text-base font-semibold leading-7 text-[#0b294b]">{item.text}</p>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      <button type="button" className={`${option} ${answer === true ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer(true)}>Potential safeguarding concern</button>
      <button type="button" className={`${option} ${answer === false ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer(false)}>Not a safeguarding concern on this information alone</button>
    </div>
    {answer !== null && <><Feedback strong={correct}>{item.why}</Feedback><div className="mt-4 flex justify-end"><Button variant="outline" onClick={next}>{index === items.length - 1 ? <><RotateCcw /> Try again</> : <>Next situation <ArrowRight /></>}</Button></div></>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Handbook connection: 3.2 Student-on-Student Abuse; 3.2.2 Antagonistic Behavior; 3.2.3 Cyber Harassment.</p>
  </section>;
}

function DisclosureDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'A student approaches you quietly and says:',
      learnerWords: '“I need to tell you something, but you have to promise not to tell anyone.”',
      choices: [
        { id: 'a', text: '“I promise. This stays between us.”', feedback: 'Promising secrecy creates an unsafe commitment you may not be able to keep. Be honest about the need to share with specific people who can help.' },
        { id: 'b', text: '“I cannot promise secrecy, but I will only share this with the people who need to help keep you safe.”', strongest: true, feedback: 'This is honest, reassuring and keeps the information on a need-to-know basis.' },
        { id: 'c', text: '“Then maybe you should not tell me.”', feedback: 'Do not close down a disclosure. Stay calm, listen and make it safe for the student to speak.' },
      ],
    },
    {
      prompt: 'The student continues:',
      learnerWords: '“They did something bad to me.” You are not sure what “bad” means.',
      choices: [
        { id: 'a', text: '“Did your caregiver hit you?”', feedback: 'This introduces an assumption and may influence the student’s account.' },
        { id: 'b', text: '“Can you tell me what you mean by the word ‘bad’?”', strongest: true, feedback: 'This is limited, neutral clarification. It helps you understand the student’s words without leading or investigating.' },
        { id: 'c', text: '“Are you sure that really happened?”', feedback: 'This can communicate disbelief and pressure the student to defend the disclosure.' },
      ],
    },
    {
      prompt: 'The student shares information that gives you a serious safeguarding concern. There is no immediate danger in this moment. What next?',
      choices: [
        { id: 'a', text: 'Interview other students so you can establish what happened before reporting.', feedback: 'Employees should not organise their own investigation or additional interviews.' },
        { id: 'b', text: 'Record the student’s words and relevant observations, then report promptly to the appropriate Division Student Safeguarding Lead.', strongest: true, feedback: 'This preserves the student’s account and moves the concern to the people responsible for coordinating the safeguarding response.' },
        { id: 'c', text: 'Contact the person alleged to be involved and ask for their explanation first.', feedback: 'Do not confront or investigate. This may increase risk and compromise the safeguarding response.' },
      ],
    },
  ];
  const [step, setStep] = useState(0);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const current = steps[step];
  const chosen = current.choices.find((choice) => choice.id === choiceId);
  const complete = step === steps.length - 1 && Boolean(chosen);

  useEffect(() => { setChoiceId(null); }, [step]);

  function advance() {
    if (step < steps.length - 1) setStep((currentStep) => currentStep + 1);
    else { setStep(0); setChoiceId(null); }
  }

  return <section className={`${surface} border-[#cbd7e2] bg-[#f5f8fb]`} aria-labelledby="decision-lab-title">
    <ExperienceHeader kind="Decision lab" title="A disclosure unfolds" description="Make one decision at a time. The scenario responds to your choice, then re-centres on the safest professional pathway before it continues." />
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.1em] text-slate-500"><GitBranch className="h-4 w-4" aria-hidden="true" /><span id="decision-lab-title">Decision {step + 1} of {steps.length}</span></div>
    <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-semibold leading-6 text-slate-600">{current.prompt}</p>
      {current.learnerWords && <blockquote className="mt-3 border-l-4 border-[#c81e35] pl-4 text-lg font-semibold leading-7 text-[#0b294b]">{current.learnerWords}</blockquote>}
      <div className="mt-5 grid gap-2">{current.choices.map((choice) => <button key={choice.id} type="button" disabled={Boolean(chosen)} className={`${option} ${choiceId === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setChoiceId(choice.id)}><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs text-[#0b294b]">{choice.id.toUpperCase()}</span>{choice.text}</button>)}</div>
      {chosen && <><Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback><div className="mt-4 flex justify-end"><Button onClick={advance} className="rounded-full bg-[#0b294b] text-white hover:bg-[#163b63]">{complete ? <><RotateCcw /> Run the lab again</> : <>Continue scenario <ArrowRight /></>}</Button></div></>}
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-500">Handbook connection: 4.1 Responding to a Disclosure; 4.2 Reporting Pathways.</p>
  </section>;
}

function ConstructAndCompare() {
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const model = '14:10 — After a phone call, the student became tearful and said, “I don’t want to go home today. Someone at home hurt me last night.”';

  return <section className={surface} aria-labelledby="construct-title">
    <ExperienceHeader kind="Construct & compare" title="Write the record, not the conclusion" description="A safeguarding record preserves what was seen and heard. Draft a factual note, then compare it with a concise model." />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong id="construct-title" className="text-[#0b294b]">Situation</strong><p className="mt-1">At 14:10, after a phone call, a student becomes tearful and says: “I don’t want to go home today. Someone at home hurt me last night.”</p></div>
    <label className="mt-4 block text-sm font-semibold text-[#0b294b]" htmlFor="safeguarding-record-draft">What would you record?</label>
    <textarea id="safeguarding-record-draft" value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder="Use the student’s words and direct observations. Avoid diagnosis or speculation." className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0b294b] focus:ring-2 focus:ring-[#0b294b]/20" />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">Your text stays on this page and is not scored or submitted.</span><Button variant="outline" disabled={!draft.trim()} onClick={() => setRevealed(true)}>Compare with a model</Button></div>
    {revealed && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" /> A factual model</div><p className="mt-2">{model}</p><p className="mt-2 text-emerald-900">Notice what is absent: no diagnosis, no assumption about who caused the harm, and no conclusion about what happened. The safeguarding pathway handles the follow-up.</p></div>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Handbook connection: 4.1 Responding to a Disclosure and recording requirements.</p>
  </section>;
}

function AdultConductDecisionTree() {
  const scenarios = [
    {
      title: 'A concern about another adult',
      text: 'You have a persistent “nagging doubt” about how a colleague interacts with one student, but you cannot say that harm has occurred.',
      choices: [
        { id: 'a', text: 'Wait until you can prove the behaviour crosses the harm threshold.', feedback: 'You do not need to decide or prove the threshold yourself. Small concerns and persistent unease should still be shared.' },
        { id: 'b', text: 'Ask several colleagues whether they have noticed the same thing before doing anything.', feedback: 'Do not turn a safeguarding concern into an informal staff discussion. Use the reporting route so patterns can be considered confidentially.' },
        { id: 'c', text: 'Share the concern with the principal so the appropriate safeguarding leaders can determine the threshold and next steps.', strongest: true, feedback: 'Yes. Sharing a concern is a neutral safeguarding act; classification and follow-up sit with the appropriate leaders.' },
      ],
    },
    {
      title: 'A concern about your own situation',
      text: 'You unexpectedly find yourself in a situation with a student that could reasonably be misinterpreted or appear compromising to others.',
      choices: [
        { id: 'a', text: 'Say nothing unless someone raises a complaint.', feedback: 'Silence removes transparency. AISG expects proactive self-reporting when a situation could reasonably be misinterpreted.' },
        { id: 'b', text: 'Proactively self-report in person to the Student Safeguarding Lead or divisional principal.', strongest: true, feedback: 'Yes. Self-reporting supports transparency, protects students and adults, and allows appropriate review of the context.' },
        { id: 'c', text: 'Ask the student to keep the situation private so it is not misunderstood.', feedback: 'Never ask a student to keep an adult-student situation secret. Use the professional safeguarding route instead.' },
      ],
    },
  ];
  const [scenario, setScenario] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const current = scenarios[scenario];
  const chosen = current.choices.find((choice) => choice.id === selected);

  function next() {
    setScenario((value) => value === scenarios.length - 1 ? 0 : value + 1);
    setSelected(null);
  }

  return <section className={surface} aria-labelledby="adult-conduct-title">
    <ExperienceHeader kind="Decision tree" title="Small concern, clear professional move" description="Safeguarding judgement is not only about obvious harm. Practice the route for a concern about another adult and for a situation involving your own conduct." />
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.1em] text-slate-500"><Scale className="h-4 w-4" aria-hidden="true" /><span>{scenario + 1} of {scenarios.length}</span></div>
    <div className="mt-3 rounded-xl bg-white p-5 ring-1 ring-slate-200"><h3 id="adult-conduct-title" className="text-base font-semibold text-[#0b294b]">{current.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{current.text}</p>
      <div className="mt-4 grid gap-2">{current.choices.map((choice) => <button key={choice.id} type="button" disabled={Boolean(chosen)} className={`${option} ${selected === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setSelected(choice.id)}>{choice.text}</button>)}</div>
      {chosen && <><Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback><div className="mt-4 flex justify-end"><Button variant="outline" onClick={next}>{scenario === scenarios.length - 1 ? <><RotateCcw /> Try both again</> : <>Next decision <ArrowRight /></>}</Button></div></>}
    </div>
    <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Handbook connection: 7.1 What is an Adult Conduct Concern?; 7.2 Self-Reporting; 7.3 Reporting Protocol.</p>
  </section>;
}
