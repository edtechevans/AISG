'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FacultyCourse = 'elementary' | 'secondary';

type FacultyLearningExperienceProps = {
  course: FacultyCourse;
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

export default function FacultyLearningExperience({ course, sectionId, learnPage }: FacultyLearningExperienceProps) {
  if (learnPage !== 2) return null;

  const key = `${course}:${sectionId}`;

  if (key === 'elementary:elementary-1') return <ElementaryEquityJudgement />;
  if (key === 'elementary:elementary-2') return <CommunicationConstructCompare division="Elementary" />;
  if (key === 'elementary:elementary-4') return <ElementarySupportDecisionLab />;
  if (key === 'elementary:elementary-5') return <ElementaryAssessmentDecisionLab />;
  if (key === 'elementary:elementary-10') return <ElementaryBehaviourDecisionLab />;

  if (key === 'secondary:secondary-2') return <CommunicationConstructCompare division="Secondary" />;
  if (key === 'secondary:secondary-4') return <SecondaryRoleClassifier />;
  if (key === 'secondary:secondary-5') return <SecondaryAssessmentLab />;
  if (key === 'secondary:secondary-6') return <SecondaryTechnologyClassifier />;
  if (key === 'secondary:secondary-10') return <SecondaryAiIntegrityDecisionLab />;

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

function ElementaryEquityJudgement() {
  const [selected, setSelected] = useState<string | null>(null);
  const choices: Choice[] = [
    {
      id: 'same',
      text: 'Give every learner the same support so the task remains fair.',
      feedback: 'Identical treatment can preserve an avoidable barrier. The stronger move is to protect the learning intention while responding to the barrier the learner is actually experiencing.',
    },
    {
      id: 'barrier',
      text: 'Keep the learning intention, identify the barrier and provide an equivalent way for the learner to show understanding.',
      strongest: true,
      feedback: 'Yes. Equity is about access to the intended learning, not making every learner use the same route. The adjustment should remain developmentally appropriate and preserve dignity and expectations.',
    },
  ];
  const chosen = choices.find((choice) => choice.id === selected);

  return <section className={surface} aria-labelledby="elementary-equity-title">
    <ExperienceHeader kind="Quick judgement" title="Same support — or equitable access?" description="Commit to a response before comparing it with the Elementary handbook principles that underpin inclusive practice." />
    <div id="elementary-equity-title" className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Situation</strong><p className="mt-1">A Grade 2 learner understands the idea, but a single prescribed format creates an avoidable language barrier.</p></div>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">{choices.map((choice) => <button key={choice.id} type="button" className={`${option} ${selected === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setSelected(choice.id)}>{choice.text}</button>)}</div>
    {chosen && <Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Handbook connection: What Guides Us · inclusion, multilingualism and shared responsibility for learning.</p>
  </section>;
}

function CommunicationConstructCompare({ division }: { division: 'Elementary' | 'Secondary' }) {
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const model = division === 'Elementary'
    ? 'Across the last three independent-work periods, the learner needed repeated prompts to begin and left two tasks incomplete. I would like us to compare what we are noticing and agree the smallest group of people needed to coordinate support.'
    : 'Across the last three lessons, the student arrived without the required materials twice and did not begin the independent task after the first direction. I would like us to compare evidence and agree what support is needed before widening the audience.';

  return <section className={surface} aria-labelledby={`${division.toLowerCase()}-communication-title`}>
    <ExperienceHeader kind="Construct & compare" title="Turn concern into useful professional communication" description="Write the message you would actually send. Then compare it with a version that separates observation from interpretation and keeps the audience purposeful." />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong id={`${division.toLowerCase()}-communication-title`} className="text-[#0b294b]">Draft that needs work</strong><p className="mt-1">“This student is lazy, never prepared and clearly does not care. Everyone should know because the family is not supporting learning.”</p></div>
    <label className="mt-4 block text-sm font-semibold text-[#0b294b]" htmlFor={`${division.toLowerCase()}-communication-draft`}>How would you rewrite it?</label>
    <textarea id={`${division.toLowerCase()}-communication-draft`} value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder="Use observable evidence, a clear purpose and the smallest appropriate audience." className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0b294b] focus:ring-2 focus:ring-[#0b294b]/20" />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">Your text stays on this page and is not submitted or scored.</span><Button variant="outline" disabled={!draft.trim()} onClick={() => setRevealed(true)}>Compare with a model</Button></div>
    {revealed && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" /> A stronger professional version</div><p className="mt-2">{model}</p><p className="mt-2">Notice the shift: observable evidence replaces labels, the purpose is explicit, and the message does not spread confidential detail beyond the people needed to support the learner.</p></div>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Handbook connection: Communication, Contacts & Concerns · authorised channels, evidence, confidentiality and appropriate escalation.</p>
  </section>;
}

function DecisionLab({ title, description, steps, handbookConnection }: { title: string; description: string; steps: DecisionStep[]; handbookConnection: string }) {
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

  return <section className={`${surface} border-[#cbd7e2] bg-[#f5f8fb]`} aria-labelledby={`${title.replaceAll(' ', '-').toLowerCase()}-title`}>
    <ExperienceHeader kind="Decision lab" title={title} description={description} />
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.1em] text-slate-500"><GitBranch className="h-4 w-4" aria-hidden="true" /><span id={`${title.replaceAll(' ', '-').toLowerCase()}-title`}>Decision {step + 1} of {steps.length}</span></div>
    <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-base font-semibold leading-7 text-[#0b294b]">{current.prompt}</p>
      {current.context && <p className="mt-2 text-sm leading-6 text-slate-600">{current.context}</p>}
      <div className="mt-5 grid gap-2">{current.choices.map((choice) => <button key={choice.id} type="button" disabled={Boolean(chosen)} className={`${option} ${choiceId === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setChoiceId(choice.id)}><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs text-[#0b294b]">{choice.id.toUpperCase()}</span>{choice.text}</button>)}</div>
      {chosen && <><Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback><div className="mt-4 flex justify-end"><Button onClick={advance} className="rounded-full bg-[#0b294b] text-white hover:bg-[#163b63]">{complete ? <><RotateCcw /> Run the lab again</> : <>Continue scenario <ArrowRight /></>}</Button></div></>}
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-500">Handbook connection: {handbookConnection}</p>
  </section>;
}

function ElementarySupportDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'A learner has an agreed support plan, but the usual classroom format creates a barrier. What is your first move?',
      choices: [
        { id: 'a', text: 'Keep the standard format so expectations remain identical for everyone.', feedback: 'Identical conditions can preserve a documented barrier. The stronger response is to implement the agreed support while protecting the intended learning.' },
        { id: 'b', text: 'Implement the agreed support in classroom learning and preserve the intended learning outcome.', strongest: true, feedback: 'Yes. Classroom teachers implement agreed plans and collaborate with support specialists to remove barriers without lowering the learning intention.' },
        { id: 'c', text: 'Wait for the Learning Support or EAL specialist to take over the learner’s classroom work.', feedback: 'Support is collaborative. The homeroom/classroom teacher remains part of implementing the plan rather than transferring responsibility.' },
      ],
    },
    {
      prompt: 'The learner becomes upset during the conversation about support. How should you respond?',
      choices: [
        { id: 'a', text: 'Continue the correction publicly so expectations are clear to everyone.', feedback: 'Public correction can undermine dignity and trust. The handbook expects calm, respectful communication and restorative practice.' },
        { id: 'b', text: 'Pause, communicate calmly and privately, and use questions that preserve dignity and trust.', strongest: true, feedback: 'This aligns with Elementary expectations for empowering, positive language and calm, restorative communication with children.' },
        { id: 'c', text: 'Avoid the issue entirely because discussing support may upset the learner.', feedback: 'Avoidance does not resolve the learning need. The stronger move is respectful, private communication that supports both learning and wellbeing.' },
      ],
    },
    {
      prompt: 'Academic, social and emotional evidence now point to a wider need. What next?',
      choices: [
        { id: 'a', text: 'Coordinate the homeroom teacher, specialists and support staff around the evidence and the learner’s needs.', strongest: true, feedback: 'Yes. Elementary support is coordinated. The aim is a coherent response across academic, social and emotional needs.' },
        { id: 'b', text: 'Choose one explanation and ask that team to handle everything.', feedback: 'Complex learner needs should not be reduced to one explanation or one person. Coordination across relevant adults is stronger.' },
        { id: 'c', text: 'Wait until the next reporting period before involving others.', feedback: 'When current evidence shows a need, timely coordination is more appropriate than waiting for a reporting cycle.' },
      ],
    },
  ];

  return <DecisionLab title="Support without handing the learner off" description="Work through a learner-support situation one decision at a time. The goal is coordinated support, not transferring responsibility away from classroom practice." steps={steps} handbookConnection="Elementary School Program · communication with children, Student Support Services and agreed support plans." />;
}

function ElementaryAssessmentDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'A home-learning task would require substantial caregiver teaching for a child to complete it. What is the stronger design decision?',
      choices: [
        { id: 'a', text: 'Keep it because caregiver involvement makes the task more rigorous.', feedback: 'Elementary home learning is not designed around substantial caregiver teaching. The stronger move protects balance and keeps learning manageable by the child.' },
        { id: 'b', text: 'Redesign it so the learner can manage it independently and preserve home reading and a balanced after-school schedule.', strongest: true, feedback: 'Yes. The Elementary handbook emphasises limited homework, balance and home reading rather than assignments that depend on caregiver teaching.' },
        { id: 'c', text: 'Ask families to complete different amounts based on how much time they have available.', feedback: 'This still makes access depend on caregiver capacity. The stronger response is to redesign the learning expectation itself.' },
      ],
    },
    {
      prompt: 'You are preparing a learning conference. What should be at the centre?',
      choices: [
        { id: 'a', text: 'A comparison showing where the learner ranks against classmates.', feedback: 'Elementary reporting does not rank or compare learners to each other.' },
        { id: 'b', text: 'Evidence of where the learner is now, progress over time, next steps and appropriate learner voice.', strongest: true, feedback: 'This reflects the handbook’s purpose for reporting and conferences: communicate learning, progress and next steps, with learners increasingly involved.' },
        { id: 'c', text: 'Only the most recent test score because it is the most objective evidence.', feedback: 'Reporting should draw on the broader evidence of learning rather than reducing progress to one convenient measure.' },
      ],
    },
    {
      prompt: 'A learner receives EAL or Learning Support. How should that affect reporting of achievement?',
      choices: [
        { id: 'a', text: 'Lower the achievement judgement because support was needed.', feedback: 'Support does not automatically lower the academic judgement. Report achievement accurately and explain the support and evidence used.' },
        { id: 'b', text: 'Report the demonstrated achievement accurately while making the support and evidence transparent.', strongest: true, feedback: 'Yes. The purpose is an accurate picture of learning and progress, not a penalty for receiving appropriate support.' },
        { id: 'c', text: 'Avoid reporting achievement until the learner no longer needs support.', feedback: 'Support and reporting happen together. Learners still need an accurate account of current achievement and next steps.' },
      ],
    },
  ];

  return <DecisionLab title="From evidence to a useful learning conversation" description="Make three assessment and reporting decisions. Each one asks you to keep the focus on authentic evidence, learner progress and a manageable Elementary experience." steps={steps} handbookConnection="6.8 Assessment · 6.9 Home Learning Philosophy and Purpose · 6.10 Reporting and Grading." />;
}

function ElementaryBehaviourDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'A child shows repeated behaviour that affects others, but there is no immediate critical incident. What is the strongest first response?',
      choices: [
        { id: 'a', text: 'Use a proportionate teacher-led response, reteach the expectation, document the pattern and seek team support if it continues.', strongest: true, feedback: 'Yes. Elementary behaviour responses should teach, preserve dignity and become more coordinated when patterns continue or escalate.' },
        { id: 'b', text: 'Move immediately to the most serious consequence available.', feedback: 'A response should be proportionate to the behaviour, context and pattern. Escalation is not automatically the strongest first move.' },
        { id: 'c', text: 'Ignore it until the behaviour becomes serious enough for leadership.', feedback: 'Repeated behaviour that affects others still requires a timely teaching response and monitoring.' },
      ],
    },
    {
      prompt: 'A dress-related conversation is needed. How should it be handled?',
      choices: [
        { id: 'a', text: 'Address it publicly so the whole class understands the expectation.', feedback: 'Public correction risks shame and unnecessary attention to the child’s body or clothing.' },
        { id: 'b', text: 'Speak privately and respectfully, focus on the stated expectation and avoid shame or bias.', strongest: true, feedback: 'This preserves the child’s dignity while still addressing the expectation.' },
        { id: 'c', text: 'Ask another student to explain the expectation to avoid an uncomfortable adult conversation.', feedback: 'The adult remains responsible for a respectful, professional response.' },
      ],
    },
    {
      prompt: 'A complex case now includes learning, behaviour, wellbeing, family communication and a possible safeguarding concern. How should you organise the response?',
      choices: [
        { id: 'a', text: 'Keep each issue separate and wait for one of them to become the obvious priority.', feedback: 'Complex cases need coordinated professional judgement. A safeguarding concern should not be delayed while other issues are handled separately.' },
        { id: 'b', text: 'Separate the evidence, coordinate the relevant support and family communication, and follow the required safeguarding route for the safeguarding concern.', strongest: true, feedback: 'Yes. Different issues may need different processes, but the adults should coordinate the response and safeguarding duties remain immediate.' },
        { id: 'c', text: 'Discuss all details with the wider faculty so everyone has the full picture.', feedback: 'Coordination does not mean broad disclosure. Information should stay with the people who need it for the relevant response.' },
      ],
    },
  ];

  return <DecisionLab title="Teach, support, escalate" description="Follow a behaviour concern as it becomes more complex. The professional challenge is to stay proportionate while noticing when another process — including safeguarding — must take over." steps={steps} handbookConnection="Student Wellbeing & Behaviour · restorative communication, proportionate response and safeguarding responsibility." />;
}

function SecondaryRoleClassifier() {
  const items = [
    {
      text: 'An advisee needs a trusted adult to check in, help them reflect on routines and connect them with school support.',
      strong: 'advisor',
      why: 'This fits the advisor role as a connector and advocate. Advisors build relationships and help students access the right support.',
    },
    {
      text: 'An advisee describes distress that goes beyond the advisor’s role and expertise.',
      strong: 'refer',
      why: 'The advisor should remain supportive while involving a counselor or appropriate support professional rather than acting as the student’s therapist.',
    },
    {
      text: 'A Grade 10 student and caregiver need to compare Upper Secondary pathways and future implications.',
      strong: 'refer',
      why: 'Pathway decisions should involve the appropriate counselor and programme coordinator so requirements and implications are accurate.',
    },
    {
      text: 'A learner has a documented Accommodation Plan and the normal assessment format creates the documented barrier.',
      strong: 'act',
      why: 'Faculty should implement the documented accommodation while preserving the intended learning outcome, collaborating with support staff as needed.',
    },
  ] as const;
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const item = items[index];
  const correct = answer === item.strong;

  function next() {
    if (index === items.length - 1) {
      setIndex(0);
      setAnswer(null);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer(null);
  }

  return <section className={surface} aria-labelledby="secondary-role-title">
    <ExperienceHeader kind="Classify" title="Stay in role — or bring in the right specialist?" description="Secondary support depends on knowing both your responsibility and your boundary. Decide what belongs in role and when coordination is the stronger move." />
    <div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span id="secondary-role-title">Situation {index + 1} of {items.length}</span><span>{Math.round(((index + 1) / items.length) * 100)}%</span></div>
    <p className="mt-3 rounded-xl bg-white p-5 text-base font-semibold leading-7 text-[#0b294b]">{item.text}</p>
    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      <button type="button" className={`${option} ${answer === 'advisor' ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer('advisor')}>Advisor can lead this support</button>
      <button type="button" className={`${option} ${answer === 'act' ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer('act')}>Faculty should implement the documented support</button>
      <button type="button" className={`${option} ${answer === 'refer' ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer('refer')}>Coordinate or refer to the appropriate specialist</button>
    </div>
    {answer && <><Feedback strong={correct}>{item.why}</Feedback><div className="mt-4 flex justify-end"><Button variant="outline" onClick={next}>{index === items.length - 1 ? <><RotateCcw /> Try again</> : <>Next situation <ArrowRight /></>}</Button></div></>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Handbook connection: Secondary School Program · Student Support Services, Counseling, Advisory and pathway planning.</p>
  </section>;
}

function SecondaryAssessmentLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'A student misses a summative assessment because of an excused absence. What should happen to the achievement grade?',
      choices: [
        { id: 'a', text: 'Reduce the grade to reflect the missed deadline.', feedback: 'The handbook states that achievement grades are not penalized for school-approved absences. Provide the appropriate make-up opportunity or use the permitted evidence process.' },
        { id: 'b', text: 'Provide the appropriate make-up opportunity and assess the resulting evidence without an achievement penalty for the excused absence.', strongest: true, feedback: 'Yes. Attendance procedures and completion expectations remain, but the academic grade should represent learning rather than punishment.' },
        { id: 'c', text: 'Exclude the assessment from any future judgement regardless of what evidence becomes available.', feedback: 'The stronger response is to follow the assessment-absence procedure and use appropriate evidence of learning.' },
      ],
    },
    {
      prompt: 'Important work is submitted late. What belongs in the achievement grade?',
      choices: [
        { id: 'a', text: 'The quality of the demonstrated learning; lateness is addressed separately through expectations, support and ATL/dispositional feedback.', strongest: true, feedback: 'Correct. Late work remains expected, but the handbook separates academic achievement from behaviours such as homework completion and self-management.' },
        { id: 'b', text: 'A lower academic grade so the score communicates both learning and responsibility.', feedback: 'Combining achievement and behaviour makes the academic grade less accurate. Address responsibility separately.' },
        { id: 'c', text: 'No response at all, because lateness cannot affect a grade.', feedback: 'The work still needs to be completed and the behaviour may need support or follow-up. The key is not to use the achievement grade as the consequence.' },
      ],
    },
    {
      prompt: 'Early evidence is weak, but recent evidence shows sustained and consistent growth. How should the semester grade be determined?',
      choices: [
        { id: 'a', text: 'Average every score so each piece of evidence carries equal mathematical weight.', feedback: 'The Secondary handbook explicitly uses best-fit professional judgement rather than simple averaging.' },
        { id: 'b', text: 'Use best-fit professional judgement, considering progress, growth, trajectory and the most recent and consistent evidence.', strongest: true, feedback: 'Yes. The final judgement should best describe current performance across the evidence, with professional reasoning communicated clearly.' },
        { id: 'c', text: 'Use only the single most recent task because recency is the only factor that matters.', feedback: 'Recency matters, but best-fit also considers the pattern, consistency, trajectory and full collection of evidence.' },
      ],
    },
  ];

  return <DecisionLab title="Grade the learning — respond to the behaviour separately" description="Work through three grading decisions that often become tangled together. The goal is an accurate achievement judgement while still responding to attendance, completion and self-management." steps={steps} handbookConnection="6.7 Assessment · 6.7.4 Assessment Absences · 6.7.5 Late, Missing or Incomplete Work · 6.9 Recording and Reporting." />;
}

function SecondaryTechnologyClassifier() {
  const items = [
    {
      text: 'Students type the same worksheet they would otherwise complete on paper. No new feedback, collaboration, creation or access is enabled.',
      addsValue: false,
      why: 'The device is replacing paper without a learning gain. The stronger design choice may be a simpler tool or a redesign that uses technology for a clear purpose.',
    },
    {
      text: 'Students collaboratively annotate primary sources, compare interpretations in real time and revise a shared explanation from peer feedback.',
      addsValue: true,
      why: 'Here the technology materially supports collaboration, feedback and revision. The learning purpose is doing the work, not merely using the device.',
    },
    {
      text: 'A class uses MacBooks because they are available, even though the task is faster and clearer without them.',
      addsValue: false,
      why: 'Availability alone is not a learning rationale. The handbook frames the 1:1 environment as a learning tool, so use should add value to the learning experience.',
    },
    {
      text: 'A learner uses an accessibility feature that removes a documented barrier while preserving the intended outcome.',
      addsValue: true,
      why: 'Technology is adding access while keeping the learning intention intact — a purposeful use of the 1:1 environment.',
    },
  ];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const item = items[index];
  const correct = answer === item.addsValue;

  function next() {
    if (index === items.length - 1) {
      setIndex(0);
      setAnswer(null);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer(null);
  }

  return <section className={surface} aria-labelledby="secondary-technology-title">
    <ExperienceHeader kind="Classify" title="Does the technology actually improve the learning?" description="The Secondary 1:1 environment is not a requirement to use a device in every task. Judge whether the technology is adding meaningful learning value." />
    <div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span id="secondary-technology-title">Design {index + 1} of {items.length}</span><span>{Math.round(((index + 1) / items.length) * 100)}%</span></div>
    <p className="mt-3 rounded-xl bg-white p-5 text-base font-semibold leading-7 text-[#0b294b]">{item.text}</p>
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      <button type="button" className={`${option} ${answer === true ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer(true)}>Technology adds meaningful learning value</button>
      <button type="button" className={`${option} ${answer === false ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setAnswer(false)}>Technology is incidental or unnecessary</button>
    </div>
    {answer !== null && <><Feedback strong={correct}>{item.why}</Feedback><div className="mt-4 flex justify-end"><Button variant="outline" onClick={next}>{index === items.length - 1 ? <><RotateCcw /> Try again</> : <>Next design <ArrowRight /></>}</Button></div></>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Handbook connection: Learning Beyond the Classroom & Technology · 1:1 laptop environment and purposeful learning design.</p>
  </section>;
}

function SecondaryAiIntegrityDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'An AI detector reports a high probability score on a student assignment. What does that score establish?',
      choices: [
        { id: 'a', text: 'It proves academic misconduct and is sufficient for a consequence.', feedback: 'AISG does not recommend AI detection software because it can be inaccurate and amplify bias. A detector result is not proof.' },
        { id: 'b', text: 'It is one prompt for a transparent, evidence-based conversation; it does not prove misconduct.', strongest: true, feedback: 'Yes. Start with evidence, the student’s explanation and the academic-integrity process rather than treating a probability score as a verdict.' },
        { id: 'c', text: 'It should be ignored completely because AI tools are never relevant to academic integrity.', feedback: 'The result is not proof, but concerns about authorship and appropriate AI use can still require a transparent academic-integrity conversation.' },
      ],
    },
    {
      prompt: 'The student explains their process and can show drafts, sources and revision history. What should you do with that evidence?',
      choices: [
        { id: 'a', text: 'Consider it alongside the assignment expectations and continue the transparent academic-integrity process.', strongest: true, feedback: 'Correct. Student explanation and process evidence matter. Professional judgement should be based on evidence, not detector output alone.' },
        { id: 'b', text: 'Discard it because the detector score is more objective than the student’s account.', feedback: 'That gives the detector more authority than the handbook supports. The process should consider evidence and student voice.' },
        { id: 'c', text: 'End the conversation immediately because any AI use is automatically prohibited.', feedback: 'AISG does not take a blanket-ban approach. The question is whether the work meets the stated expectations, attribution and academic-integrity requirements.' },
      ],
    },
    {
      prompt: 'At the same time, the student is involved in a repeated one-sided peer pattern with threats and harmful digital images. How should the two issues be handled?',
      choices: [
        { id: 'a', text: 'Treat everything as one academic-integrity case because technology is involved in both.', feedback: 'The issues require different processes. Potential student-on-student abuse is a safety/safeguarding matter, not simply an academic-integrity concern.' },
        { id: 'b', text: 'Separate the academic evidence from the peer-safety concern: follow the integrity process for the assignment and escalate the one-sided threats/images through the appropriate student-safety route.', strongest: true, feedback: 'Yes. Strong professional judgement separates the evidence and applies the correct process to each issue while coordinating support around the student.' },
        { id: 'c', text: 'Wait until the academic-integrity issue is resolved before responding to the peer behaviour.', feedback: 'A potential safety or safeguarding concern should not be delayed while an unrelated academic process is completed.' },
      ],
    },
  ];

  return <DecisionLab title="An AI flag is evidence to examine — not a verdict" description="Work through a realistic integrity concern in which AI, student process evidence and a separate peer-safety issue compete for attention." steps={steps} handbookConnection="8.3 Academic Integrity · 8.3.5 The use of Artificial Intelligence in assessment and education · student-on-student safety procedures." />;
}
