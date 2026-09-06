'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EnrichedCourse = 'teams' | 'mtss';

type Props = {
  course: EnrichedCourse;
  sectionId: string;
  learnPage: number;
};

type Choice = {
  id: string;
  text: string;
  strongest?: boolean;
  feedback: string;
};

type DecisionStep = {
  prompt: string;
  context?: string;
  choices: Choice[];
};

const surface = 'mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6';
const option = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b294b] focus-visible:ring-offset-2 disabled:cursor-default';

export default function CommunicationMtssLearningExperience({ course, sectionId, learnPage }: Props) {
  if (learnPage !== 1) return null;

  const key = `${course}:${sectionId}`;

  if (key === 'teams:communication-purpose') return <CommunicationAudienceLab />;
  if (key === 'teams:communication-minimum') return <CommunicationInformationFilter />;
  if (key === 'teams:communication-evidence') return <CommunicationConstructCompare />;
  if (key === 'teams:communication-confidentiality') return <CommunicationLocationClassifier />;
  if (key === 'teams:communication-practice') return <CommunicationDecisionLab />;

  if (key === 'mtss:mtss-system') return <MtssSystemClassifier />;
  if (key === 'mtss:mtss-components') return <MtssComponentsLab />;
  if (key === 'mtss:mtss-screening') return <MtssScreeningJudgement />;
  if (key === 'mtss:mtss-progress') return <MtssProgressLab />;
  if (key === 'mtss:mtss-cycle') return <MtssCycleDecisionLab />;

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

function SingleJudgement({ title, description, situation, choices, connection }: { title: string; description: string; situation: string; choices: Choice[]; connection: string }) {
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

function CommunicationAudienceLab() {
  return <SingleJudgement
    title="Need to know is not the same as nice to know"
    description="Choose the audience before writing the message. The strongest communication starts with purpose and the smallest appropriate group."
    situation="You want to compare a student's recent engagement pattern. Three current teachers and the counsellor directly support the student. Four other colleagues are in the same existing Teams space but have no current role."
    choices={[
      { id: 'a', text: 'Use the existing eight-person space because everyone is an AISG employee.', feedback: 'Employment at AISG does not create a need to know. A convenient audience can still be too broad.' },
      { id: 'b', text: 'Contact the current teachers and counsellor who have a legitimate role, and share only what they need to compare the pattern.', strongest: true, feedback: 'Yes. Purpose, audience and information align. The group is large enough to support the decision and no larger than necessary.' },
      { id: 'c', text: 'Use the larger space but replace the student name with initials.', feedback: 'Initials do not correct an audience problem. Privacy depends on purpose, recipients and information, not only naming.' },
    ]}
    connection="Purpose, Audience and Professionalism · right purpose + right people + right information."
  />;
}

function CommunicationInformationFilter() {
  const items = [
    { id: 'observation', text: 'The student needed four prompts to begin independent work today.', keep: true },
    { id: 'strategy', text: 'A visual checklist helped the student begin within two minutes yesterday.', keep: true },
    { id: 'family', text: 'Detailed family history that is unrelated to the support question.', keep: false },
    { id: 'request', text: 'A focused request asking which classroom strategies have been effective.', keep: true },
    { id: 'rumour', text: 'A colleague’s theory about what may be happening at home.', keep: false },
  ];
  const [decisions, setDecisions] = useState<Record<string, boolean>>({});
  const complete = items.every((item) => item.id in decisions);
  const correct = complete && items.every((item) => decisions[item.id] === item.keep);

  return <section className={surface}>
    <ExperienceHeader kind="Information filter" title="What belongs in the message?" description="For each piece of information, decide whether it helps the recipients support the learner for this purpose." />
    <div className="grid gap-3">{items.map((item) => <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm leading-6 text-slate-700">{item.text}</p><div className="mt-3 flex gap-2"><button type="button" className={`${option} max-w-[10rem] ${decisions[item.id] === true ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setDecisions((current) => ({ ...current, [item.id]: true }))}>Keep</button><button type="button" className={`${option} max-w-[10rem] ${decisions[item.id] === false ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setDecisions((current) => ({ ...current, [item.id]: false }))}>Leave out</button></div></div>)}</div>
    {complete && <Feedback strong={correct}>{correct ? 'You kept the observations, useful strategy and purposeful request while removing unrelated family detail and speculation. That is the minimum-necessary principle in practice.' : 'Review the purpose. Useful observations, strategies and a focused request belong; unrelated family detail and theories do not become necessary simply because colleagues support the student.'}</Feedback>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: Share What Is Needed · actionable support information, not everything known about the student.</p>
  </section>;
}

function CommunicationConstructCompare() {
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);

  return <section className={surface}>
    <ExperienceHeader kind="Construct & compare" title="Describe the evidence, not the student" description="Rewrite a message that turns frustration into labels and speculation. Then compare your wording with a stronger professional model." />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Draft that needs work</strong><p className="mt-1">“J. is lazy, completely unmotivated and clearly does not care. Does anyone know what is going on at home?”</p></div>
    <label className="mt-4 block text-sm font-semibold text-[#0b294b]" htmlFor="communication-evidence-draft">How would you rewrite it?</label>
    <textarea id="communication-evidence-draft" value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder="Describe what happened, the timeframe, what you tried and the focused question you need colleagues to answer." className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0b294b] focus:ring-2 focus:ring-[#0b294b]/20" />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">Your text stays on this page and is not submitted or scored.</span><Button variant="outline" disabled={!draft.trim()} onClick={() => setRevealed(true)}>Compare with a model</Button></div>
    {revealed && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" /> A stronger professional version</div><p className="mt-2">“This week J. arrived late three times, did not complete two assignments and needed several prompts to begin independent work. Are you seeing similar patterns, and have any strategies been effective?”</p><p className="mt-2">The stronger version gives colleagues evidence they can compare and act on. It does not convert behaviour into a judgement about motivation, character or home life.</p></div>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: Describe, Don’t Label · observable evidence, specific examples and focused questions.</p>
  </section>;
}

function CommunicationLocationClassifier() {
  const items = [
    { id: 'strategy', text: 'A concise note to relevant teachers about the classroom accommodation to use tomorrow.', answer: 'teams' },
    { id: 'evaluation', text: 'A psychoeducational evaluation containing confidential student information.', answer: 'secure' },
    { id: 'vent', text: 'A frustrated message labelling a student as impossible after a difficult lesson.', answer: 'neither' },
    { id: 'pattern', text: 'Relevant teachers comparing factual observations about engagement over several weeks.', answer: 'teams' },
    { id: 'safeguarding', text: 'A safeguarding investigation record.', answer: 'secure' },
  ];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const item = items[index];
  const correct = answer === item.answer;

  function next() {
    if (index === items.length - 1) {
      setIndex(0);
      setAnswer(null);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer(null);
  }

  return <section className={surface}>
    <ExperienceHeader kind="Classify" title="Teams, secure record, or neither?" description="Decide where the information belongs. Internal collaboration does not make every document or message appropriate for Teams." />
    <p className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">Item {index + 1} of {items.length}</p>
    <div className="mt-3 rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">{item.text}</div>
    <div className="mt-4 grid gap-2 sm:grid-cols-3"><button type="button" disabled={Boolean(answer)} className={`${option} ${answer === 'teams' ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer('teams')}>Teams collaboration</button><button type="button" disabled={Boolean(answer)} className={`${option} ${answer === 'secure' ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer('secure')}>Secure confidential process</button><button type="button" disabled={Boolean(answer)} className={`${option} ${answer === 'neither' ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer('neither')}>Neither — rewrite or do not send</button></div>
    {answer && <><Feedback strong={correct}>{correct ? 'Correct. The location matches the purpose and sensitivity of the information.' : item.answer === 'secure' ? 'This is a confidential record. Keep it in the appropriate secure AISG process rather than using Teams as the record store.' : item.answer === 'teams' ? 'This is purposeful, relevant collaboration for an appropriate audience. Teams can support the coordination when the information is necessary and professional.' : 'The problem is the communication itself. A private or internal channel does not make labelling, venting or speculation appropriate.'}</Feedback><div className="mt-4 flex justify-end"><Button variant="outline" onClick={next}>{index === items.length - 1 ? <><RotateCcw /> Start again</> : <>Next item <ArrowRight /></>}</Button></div></>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: Confidentiality and Professional Records · Teams supports collaboration but is not the student’s confidential record.</p>
  </section>;
}

function CommunicationDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'After a difficult lesson, you genuinely need advice. What should happen before you send anything?',
      choices: [
        { id: 'a', text: 'Write immediately while the details and frustration are fresh.', feedback: 'Urgency does not remove the need for professional judgement. First clarify why you are communicating and what decision or support you need.' },
        { id: 'b', text: 'Name the purpose, identify who needs to act, and separate observable evidence from frustration.', strongest: true, feedback: 'Yes. Purpose, audience and evidence should be clear before choosing the channel or drafting the message.' },
        { id: 'c', text: 'Use a private chat so the communication can be more informal.', feedback: 'A private chat is still professional school communication and may be retained or reviewed. The same standards apply.' },
      ],
    },
    {
      prompt: 'Your draft includes two useful observations, a strategy you tried, an unrelated family detail and a theory about motivation. What now?',
      choices: [
        { id: 'a', text: 'Keep everything so colleagues have the full picture.', feedback: 'An appropriate audience can still receive too much information. Full picture is not the same as necessary information.' },
        { id: 'b', text: 'Keep the observations and strategy, remove unrelated family detail and speculation, and ask a focused support question.', strongest: true, feedback: 'This applies Information, Evidence and Language: share what helps colleagues support the student, not everything known or assumed.' },
        { id: 'c', text: 'Replace the student name with initials and keep the rest.', feedback: 'Initials do not make unnecessary or speculative content appropriate.' },
      ],
    },
    {
      prompt: 'A confidential support document would help explain the background. What is the strongest final move?',
      choices: [
        { id: 'a', text: 'Attach the full document because the recipients support the student.', feedback: 'A legitimate audience does not make a confidential document appropriate for Teams. Share the actionable support, not the record.' },
        { id: 'b', text: 'Communicate the relevant support action and keep the confidential document in the appropriate secure process.', strongest: true, feedback: 'Yes. This completes the seven-part check: Purpose, Audience, Information, Evidence, Language, Confidentiality and Professionalism all align.' },
        { id: 'c', text: 'Share nothing because any support information connected to a confidential record is off limits.', feedback: 'Faculty still need relevant classroom support information. The distinction is between useful action and distribution of the confidential record.' },
      ],
    },
  ];

  return <DecisionLab title="Before you send" description="Use the seven-part communication check across a realistic situation, with new information arriving at each step." steps={steps} connection="Purpose · Audience · Information · Evidence · Language · Confidentiality · Professionalism." />;
}

function MtssSystemClassifier() {
  const items = [
    { id: 'tier1', text: 'Most learners in a grade show the same reading difficulty.', answer: 'system' },
    { id: 'learner', text: 'One learner is not responding to a well-implemented targeted intervention.', answer: 'student' },
    { id: 'fidelity', text: 'Several learners show limited progress and implementation varies across classrooms.', answer: 'both' },
    { id: 'access', text: 'A support works in one class but scheduling prevents other classes from accessing it.', answer: 'system' },
  ];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const item = items[index];
  const correct = answer === item.answer;

  function next() {
    if (index === items.length - 1) {
      setIndex(0);
      setAnswer(null);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer(null);
  }

  return <section className={surface}>
    <ExperienceHeader kind="Classify" title="Learner need, system need — or both?" description="MTSS is not a triangle for sorting students. Decide where the evidence is asking the team to look." />
    <p className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">Pattern {index + 1} of {items.length}</p>
    <div className="mt-3 rounded-xl bg-white p-4 text-sm leading-6 text-slate-700">{item.text}</div>
    <div className="mt-4 grid gap-2 sm:grid-cols-3"><button type="button" disabled={Boolean(answer)} className={`${option} ${answer === 'student' ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer('student')}>Learner-level response</button><button type="button" disabled={Boolean(answer)} className={`${option} ${answer === 'system' ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer('system')}>System-level review</button><button type="button" disabled={Boolean(answer)} className={`${option} ${answer === 'both' ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer('both')}>Both</button></div>
    {answer && <><Feedback strong={correct}>{correct ? 'Correct. MTSS asks teams to respond to learner need while also improving the conditions, instruction and infrastructure around learners.' : 'Reconsider where the pattern sits. MTSS works at both learner and system levels; widespread patterns usually require a Tier 1 or implementation review rather than a collection of individual referrals.'}</Feedback><div className="mt-4 flex justify-end"><Button variant="outline" onClick={next}>{index === items.length - 1 ? <><RotateCcw /> Start again</> : <>Next pattern <ArrowRight /></>}</Button></div></>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: MTSS: A System, Not a Triangle · learner support and system improvement happen together.</p>
  </section>;
}

function MtssComponentsLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'A universal measure shows a group may be at risk. What has the team learned?',
      choices: [
        { id: 'a', text: 'The screening result identifies possible risk and should be interpreted with additional evidence.', strongest: true, feedback: 'Yes. Screening notices possible risk; it does not diagnose the cause or prescribe a support by itself.' },
        { id: 'b', text: 'The group has been diagnosed and should automatically receive intensive support.', feedback: 'Screening is not diagnosis. The team still needs context, additional evidence and a proportionate support decision.' },
      ],
    },
    {
      prompt: 'The team chooses a targeted evidence-based support. What must be planned at the same time?',
      choices: [
        { id: 'a', text: 'A progress-monitoring measure, baseline, goal, schedule and review point.', strongest: true, feedback: 'Correct. Intervention without monitoring cannot show whether the support is helping.' },
        { id: 'b', text: 'A permanent tier label so everyone knows where the learners belong.', feedback: 'Tiers describe intensity, not permanent learner identities. The plan should make response visible instead.' },
      ],
    },
    {
      prompt: 'After several planned data points, growth remains limited. What completes the cycle?',
      choices: [
        { id: 'a', text: 'Use the evidence, fidelity information and decision rules to maintain, adjust, intensify or change support.', strongest: true, feedback: 'Exactly. Screening, prevention, progress monitoring and data-based decision making operate as one connected cycle.' },
        { id: 'b', text: 'Continue the same intervention indefinitely because changing plans would make the data less consistent.', feedback: 'MTSS is responsive. Evidence is collected so the team can make a defensible next decision rather than simply continue.' },
      ],
    },
  ];

  return <DecisionLab title="Four components, one cycle" description="Move from a screening signal to support, monitoring and a defensible next decision. No component works well in isolation." steps={steps} connection="Screening → multi-level prevention → progress monitoring → data-based decision making." />;
}

function MtssScreeningJudgement() {
  return <SingleJudgement
    title="A signal is not a diagnosis"
    description="Interpret a screening result without overreaching. Strong MTSS practice notices early and investigates carefully."
    situation="A multilingual learner scores below benchmark on a language-heavy screening measure."
    choices={[
      { id: 'a', text: 'Treat the result as proof of a disability so support can begin quickly.', feedback: 'A screening score is a signal, not a diagnosis. This move over-interprets one measure and ignores validity, language and context.' },
      { id: 'b', text: 'Review additional evidence, language and cultural context, and whether the measure validly reflects the intended outcome before deciding support.', strongest: true, feedback: 'Yes. The team takes the signal seriously without treating it as an explanation. Multiple evidence sources and context make the next decision more defensible.' },
      { id: 'c', text: 'Ignore the result because language-heavy screening cannot provide any useful information.', feedback: 'The signal should not be dismissed either. The stronger response is to interpret it carefully alongside other evidence.' },
    ]}
    connection="Screening: Notice Early, Investigate Carefully · valid indicators, additional evidence and cultural-linguistic context."
  />;
}

function MtssProgressLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'A learner’s progress graph shows limited growth. What should the team check before calling the learner “non-responsive”?',
      context: 'Attendance at the intervention has been inconsistent, and different staff have entered progress data in different ways.',
      choices: [
        { id: 'a', text: 'Check whether the intervention and measurement process were implemented with fidelity.', strongest: true, feedback: 'Yes. You cannot confidently interpret response until you know the learner received the planned support and the data were collected consistently.' },
        { id: 'b', text: 'Increase the intensity immediately because the graph is already low.', feedback: 'The graph may reflect inconsistent implementation or measurement. Check fidelity before attributing the pattern to the learner.' },
        { id: 'c', text: 'Stop monitoring until attendance becomes perfect.', feedback: 'The team still needs useful data. The stronger move is to improve implementation and measurement while documenting what actually occurred.' },
      ],
    },
    {
      prompt: 'Fidelity improves and the team now has a planned series of valid measures. What should drive the next decision?',
      choices: [
        { id: 'a', text: 'The trend relative to the baseline, goal and pre-agreed decision rule.', strongest: true, feedback: 'Correct. Repeated valid data interpreted against a goal and decision rule are stronger than reacting to one point.' },
        { id: 'b', text: 'Whichever data point is most recent, even if it is an outlier.', feedback: 'One score may reflect context or measurement error. MTSS decisions should use the planned trend and rule.' },
        { id: 'c', text: 'Whether the team feels the learner has tried hard enough.', feedback: 'Effort may be useful context, but support decisions should be grounded in valid performance and implementation evidence.' },
      ],
    },
  ];

  return <DecisionLab title="Before you intensify" description="Read a progress pattern without jumping directly from low growth to a learner-level conclusion." steps={steps} connection="Progress Monitoring · valid measures, fidelity, trends, goals and decision rules." />;
}

function MtssCycleDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'Across a grade, screening and classroom work show weak vocabulary outcomes. Where should the team begin?',
      choices: [
        { id: 'a', text: 'Refer the lowest-scoring learners immediately for intensive individual support.', feedback: 'A grade-wide pattern points first to the system as well as individual need. The team should understand Tier 1 before creating many individual referrals.' },
        { id: 'b', text: 'Notice the pattern, review Tier 1 instruction and implementation, and bring multiple evidence sources to the problem analysis.', strongest: true, feedback: 'Yes. A broad pattern should trigger system-level inquiry into instruction, opportunity, implementation and learner evidence.' },
      ],
    },
    {
      prompt: 'The review shows the core vocabulary routine is inconsistently implemented. What is the next strongest move?',
      choices: [
        { id: 'a', text: 'Strengthen the core routine, support implementation and define how the team will monitor whether outcomes improve.', strongest: true, feedback: 'Correct. MTSS improves the system while responding to learner need. Implementation and outcome evidence should be planned together.' },
        { id: 'b', text: 'Purchase a new Tier 2 programme before changing Tier 1.', feedback: 'Adding an intervention without addressing the identified Tier 1 issue skips the system-level finding.' },
      ],
    },
    {
      prompt: 'Most learners improve after the Tier 1 change, but one learner continues to show limited growth. What now?',
      choices: [
        { id: 'a', text: 'Use the learner’s evidence, context and response to plan additional targeted support with a measurable goal and monitoring plan.', strongest: true, feedback: 'Yes. The system response helped most learners; the remaining individual pattern now supports a more targeted learner-level response.' },
        { id: 'b', text: 'Assume the learner is unmotivated because the revised core programme helped everyone else.', feedback: 'MTSS avoids deficit assumptions. Limited response should prompt further evidence, problem analysis and proportionate support.' },
      ],
    },
    {
      prompt: 'The family shares information about language use, routines and what helps the learner engage. How should that affect the plan?',
      choices: [
        { id: 'a', text: 'Use the family and learner perspective alongside quantitative evidence to refine the support and access conditions.', strongest: true, feedback: 'Exactly. Learners and families are partners in MTSS. Their knowledge adds meaning to the data and can improve fit, access and implementation.' },
        { id: 'b', text: 'Keep the plan unchanged because only formal measures should influence intervention decisions.', feedback: 'MTSS uses multiple evidence sources. Family and learner perspectives are not substitutes for data; they are important evidence that helps the team interpret and act on the data well.' },
      ],
    },
  ];

  return <DecisionLab title="Put the whole MTSS cycle together" description="Move from a grade-wide pattern to Tier 1 improvement, then to targeted learner support and partnership without losing the system perspective." steps={steps} connection="NOTICE → UNDERSTAND → RESPOND → IMPLEMENT → MONITOR → ADJUST, at learner and system levels." />;
}
