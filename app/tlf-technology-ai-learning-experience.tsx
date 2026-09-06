'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EnrichedCourse = 'engagement' | 'technology' | 'ai';

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

type SeriesItem = {
  prompt: string;
  context?: string;
  choices: Choice[];
};

type DecisionStep = SeriesItem;

const surface = 'mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6';
const option = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b294b] focus-visible:ring-offset-2 disabled:cursor-default';

export default function TlfTechnologyAiLearningExperience({ course, sectionId, learnPage }: Props) {
  if (learnPage !== 1) return null;

  const key = `${course}:${sectionId}`;

  if (key === 'engagement:tlf-promise') return <TlfLensJudgement />;
  if (key === 'engagement:tlf-being') return <BeingFacetClassifier />;
  if (key === 'engagement:tlf-connecting') return <ConnectingFacetClassifier />;
  if (key === 'engagement:tlf-doing') return <DoingDecisionLab />;
  if (key === 'engagement:tlf-design-lens') return <TlfDesignConstructCompare />;

  if (key === 'technology:tech-purpose') return <TechnologyAmplificationClassifier />;
  if (key === 'technology:tech-being') return <TechnologyAgencyJudgement />;
  if (key === 'technology:tech-connecting') return <TechnologyAuthenticityDecisionLab />;
  if (key === 'technology:tech-doing') return <TechnologyCollaborationDecisionLab />;
  if (key === 'technology:tech-evidence') return <TechnologyEvidenceConstructCompare />;

  if (key === 'ai:ai-literacy') return <AiLiteracyDecisionLab />;
  if (key === 'ai:safe-secure-private') return <AiPrivacyClassifier />;
  if (key === 'ai:critical-evaluation') return <AiCriticalEvaluationConstructCompare />;
  if (key === 'ai:purposeful-ai') return <AiPurposeJudgement />;
  if (key === 'ai:tlf-doing-evidence') return <AiTlfSynthesisDecisionLab />;

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

function SeriesLab({ kind = 'Classify & compare', title, description, items, connection }: { kind?: string; title: string; description: string; items: SeriesItem[]; connection: string }) {
  const [responses, setResponses] = useState<Record<number, string>>({});

  return <section className={surface}>
    <ExperienceHeader kind={kind} title={title} description={description} />
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

  return <section className={surface}>
    <ExperienceHeader kind="Construct & compare" title={title} description={description} />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Your task</strong><p className="mt-1">{prompt}</p></div>
    <label className="mt-4 block text-sm font-semibold text-[#0b294b]" htmlFor={`${title.replaceAll(' ', '-').toLowerCase()}-draft`}>Write your response</label>
    <textarea id={`${title.replaceAll(' ', '-').toLowerCase()}-draft`} value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0b294b] focus:ring-2 focus:ring-[#0b294b]/20" />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">Your text stays on this page and is not submitted or scored.</span><Button variant="outline" disabled={!draft.trim()} onClick={() => setRevealed(true)}>Compare with a model</Button></div>
    {revealed && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" /> A strong response might sound like</div><p className="mt-2">{model}</p><p className="mt-2"><strong>Notice:</strong> {notice}</p></div>}
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: {connection}</p>
  </section>;
}

function TlfLensJudgement() {
  return <SingleChoiceLab
    title="Lens — or checklist?"
    description="Decide how you would use the TLF before seeing the stronger design move."
    situation="A team wants to improve an upcoming inquiry and suggests scoring the lesson against all 38 Learning Engagement Indicators so nothing is missed."
    choices={[
      { id: 'a', text: 'Use all 38 indicators as a checklist so the lesson can be judged comprehensively.', feedback: 'The framework is not designed as a compliance scorecard. Trying to display every indicator can shift attention away from the intended learning and actual learner experience.' },
      { id: 'b', text: 'Select the few indicators most relevant to the intended learning, decide what evidence to notice, then identify a next design move.', strongest: true, feedback: 'Yes. AISG’s Field Guide explicitly frames the TLF as a lens: Design → Notice → Reflect → Improve.' },
      { id: 'c', text: 'Choose one indicator from each facet so all six facets are represented.', feedback: 'Balanced coverage can still become a checklist. Relevance to the intended learning matters more than mechanically representing every facet.' },
    ]}
    connection="Engagement for All → Being, Connecting and Doing → six facets → 38 indicators; use the framework as a lens, not a checklist."
  />;
}

function BeingFacetClassifier() {
  return <SeriesLab
    title="Personalisation or Agency?"
    description="The facets often reinforce each other, but the evidence points to different learner experiences. Choose the strongest first lens."
    items={[
      {
        prompt: 'Students can access a concept through text, audio, diagrams and home-language supports because the class has varied linguistic strengths.',
        choices: [
          { id: 'p', text: 'Personalisation', strongest: true, feedback: 'Correct. The evidence is about responding to learner strengths and needs through multiple pathways.' },
          { id: 'a', text: 'Agency', feedback: 'Agency may emerge later, but the clearest evidence here is responsive access and inclusion.' },
        ],
      },
      {
        prompt: 'Students set a goal, choose a line of inquiry, use feedback and decide what they will revise next.',
        choices: [
          { id: 'p', text: 'Personalisation', feedback: 'The learning may also be personalised, but the strongest evidence described is ownership of consequential decisions.' },
          { id: 'a', text: 'Agency', strongest: true, feedback: 'Correct. Goal-setting, meaningful choice, reflection and next-step decisions are strong evidence of Agency.' },
        ],
      },
      {
        prompt: 'A teacher gives every student the same task but allows them to choose one of four decorative slide themes.',
        choices: [
          { id: 'p', text: 'Strong Personalisation', feedback: 'Cosmetic variation is not strong evidence that learning responds to learner strengths, needs, identity or aspiration.' },
          { id: 'a', text: 'Strong Agency', feedback: 'Choice alone is not automatically Agency. The choice needs to meaningfully shape learning.' },
          { id: 'n', text: 'Neither is strongly evidenced yet', strongest: true, feedback: 'Correct. The learner experience would need a more meaningful response to individual strengths/needs or consequential ownership.' },
        ],
      },
    ]}
    connection="Being pairs Personalisation and Agency: learning responds to who learners are, while learners increasingly own and shape what happens next."
  />;
}

function ConnectingFacetClassifier() {
  return <SeriesLab
    title="Authenticity or Creativity?"
    description="Look past polished products and identify what the learner experience actually demonstrates."
    items={[
      {
        prompt: 'Students use local water-quality data and brief a community partner whose questions cause them to revise their recommendations.',
        choices: [
          { id: 'a', text: 'Authenticity', strongest: true, feedback: 'Correct. The real context, meaningful role, audience and purpose are direct evidence of Authenticity.' },
          { id: 'c', text: 'Creativity', feedback: 'Creativity may be present, but it is not automatic. The clearest evidence is the authentic context and audience.' },
        ],
      },
      {
        prompt: 'Students generate several solutions, prototype, test, learn from failure and refine an original approach.',
        choices: [
          { id: 'a', text: 'Authenticity', feedback: 'The work could be authentic too, but the strongest evidence described is experimentation and original idea development.' },
          { id: 'c', text: 'Creativity', strongest: true, feedback: 'Correct. Generating, experimenting, taking thoughtful risks and refining ideas are central to Creativity.' },
        ],
      },
      {
        prompt: 'Students make a visually impressive video using the teacher’s exact script, structure and examples for an audience of only the teacher.',
        choices: [
          { id: 'a', text: 'Strong Authenticity', feedback: 'A digital format does not create a meaningful audience, role or purpose by itself.' },
          { id: 'c', text: 'Strong Creativity', feedback: 'A polished product can still be reproduction when learners have little room to generate, experiment or express original ideas.' },
          { id: 'n', text: 'Neither is strongly evidenced yet', strongest: true, feedback: 'Correct. Product polish is not enough; look for meaningful purpose and/or original thinking in the learning process.' },
        ],
      },
    ]}
    connection="Connecting pairs Authenticity and Creativity: meaningful contexts and purposes can create space for original thinking, experimentation and expression."
  />;
}

function DoingDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'Students are asked to work in groups on a community issue. One confident student divides the task into separate pieces and assembles the final product alone. What is missing?',
      choices: [
        { id: 'a', text: 'Nothing — efficient task division is enough to demonstrate Collaboration.', feedback: 'Dividing work can be efficient, but the TLF asks for shared purpose, interdependence, diverse perspectives and equitable contribution.' },
        { id: 'b', text: 'Redesign the group process so students need one another’s perspectives, make shared decisions and contribute equitably.', strongest: true, feedback: 'Yes. Collaboration becomes visible when learners build something together, not simply work beside one another.' },
      ],
    },
    {
      prompt: 'The group now develops a recommendation. What would move the work toward Taking Action?',
      choices: [
        { id: 'a', text: 'Submit the recommendation to the teacher for a grade only.', feedback: 'The learning may still be valuable, but the contribution remains contained within the school exercise.' },
        { id: 'b', text: 'Connect the recommendation to an authentic audience or community need so students can explain who the contribution serves.', strongest: true, feedback: 'Correct. Taking Action is purposeful when learning is applied to an authentic opportunity, audience, community or change.' },
      ],
    },
    {
      prompt: 'After the contribution, what evidence would best help the team reflect?',
      choices: [
        { id: 'a', text: 'Whether every group used the same template and finished on time.', feedback: 'Completion data do not show whether learners collaborated meaningfully or understood their contribution.' },
        { id: 'b', text: 'Student talk, relationships, decisions, equitable contribution, audience response and how learners explain the impact of their action.', strongest: true, feedback: 'Correct. The framework brings reflection back to observable learner experience and purposeful action.' },
      ],
    },
  ];

  return <DecisionLab title="From group work to collective action" description="Follow one learning experience as it moves from task division toward real Collaboration and Taking Action." steps={steps} connection="Doing pairs Taking Action and Collaboration: shared goals, relationships and collective contribution should be visible in learner evidence." />;
}

function TlfDesignConstructCompare() {
  return <ConstructCompare
    title="Turn observation into a next design move"
    description="Use the TLF as a reflection tool rather than an observation score."
    prompt="During a learning walk, students are on task and the products look polished, but students cannot explain why the work matters, who it is for, or what choices they have made. What would you notice, and what is one useful next design move?"
    placeholder="Name the learner evidence first, then identify a focused next move using one or two relevant TLF facets or indicators."
    model="I would notice that completion and product quality are visible, but evidence of meaningful purpose and learner ownership is weak. I would use Authenticity and Agency as focused lenses, then redesign the next iteration so students have a consequential choice and a clearer audience or purpose. I would look for student explanations, decisions and changes in the work as evidence."
    notice="The response does not score the teacher or try to cover all six facets. It starts with learner evidence, selects a small lens and names one practical improvement."
    connection="Design → Notice → Reflect → Improve, using evidence from student talk, choices, work, relationships and action."
  />;
}

function TechnologyAmplificationClassifier() {
  return <SeriesLab
    title="Amplify — or simply digitise?"
    description="Decide whether technology meaningfully changes the learner experience or mainly changes the medium."
    items={[
      {
        prompt: 'A paper worksheet becomes the same locked PDF. Students type the same individual answers.',
        choices: [
          { id: 'd', text: 'Mostly digitisation', strongest: true, feedback: 'Correct. Convenience may improve, but there is little evidence that access, ownership, authenticity, creativity, collaboration or action has deepened.' },
          { id: 'a', text: 'Clear amplification', feedback: 'Device use alone is not evidence of a stronger TLF learner experience.' },
        ],
      },
      {
        prompt: 'Students use translation, audio and speech-to-text supports to access a complex concept while keeping the reasoning and explanation their own.',
        choices: [
          { id: 'd', text: 'Mostly digitisation', feedback: 'The technology is doing more than changing medium: it is reducing barriers while preserving the intended thinking.' },
          { id: 'a', text: 'Clear amplification', strongest: true, feedback: 'Correct. The technology strengthens Personalisation by widening access without automatically outsourcing the learning.' },
        ],
      },
      {
        prompt: 'Students interview community members remotely, map local evidence and publish recommendations to an organisation that has agreed to respond.',
        choices: [
          { id: 'd', text: 'Mostly digitisation', feedback: 'The technology is enabling people, perspectives and an audience that materially change the task.' },
          { id: 'a', text: 'Clear amplification', strongest: true, feedback: 'Correct. Technology expands authentic connection, audience, purpose and potentially Taking Action.' },
        ],
      },
    ]}
    connection="Learning first → relevant TLF indicators → desired learner experience → technology affordance → evidence to notice."
  />;
}

function TechnologyAgencyJudgement() {
  return <SingleChoiceLab
    title="Is the choice meaningful?"
    description="Technology can offer many choices without increasing Agency. Decide which design gives learners real ownership."
    situation="Two classes are completing the same inquiry. Class A lets students choose a slide theme and transition style. Class B lets students choose the question they pursue, the evidence they gather, an appropriate digital or non-digital medium, and how they respond to feedback."
    choices={[
      { id: 'a', text: 'Class A shows stronger Agency because students make more visible technology choices.', feedback: 'Cosmetic choices can be motivating, but they do not necessarily shape the direction or improvement of learning.' },
      { id: 'b', text: 'Class B shows stronger Agency because students make consequential decisions about the learning and its expression.', strongest: true, feedback: 'Correct. Agency is strengthened when decisions genuinely shape questions, evidence, expression, reflection and next steps.' },
      { id: 'c', text: 'Both are equally agentic because any choice counts as Agency.', feedback: 'Choice is not automatically Agency. The significance of the decision to the learning matters.' },
    ]}
    connection="Technology amplifies Agency when learners retain meaningful ownership; it amplifies Personalisation when it responds to strengths, needs and pathways."
  />;
}

function TechnologyAuthenticityDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'A Grade 6 team wants students to create a digital product about a local environmental issue. The current audience is only the teacher. What should change first?',
      choices: [
        { id: 'a', text: 'Require more multimedia so the product looks more authentic.', feedback: 'Multimedia can improve communication, but authenticity comes from meaningful context, role, audience and purpose.' },
        { id: 'b', text: 'Identify a real audience or community purpose that should influence the students’ decisions.', strongest: true, feedback: 'Correct. A meaningful audience should affect what students investigate, create and revise.' },
      ],
    },
    {
      prompt: 'The team identifies a community audience. How can technology best strengthen Creativity as well?',
      choices: [
        { id: 'a', text: 'Give every student the same polished template so the public product looks professional.', feedback: 'A polished template may improve consistency but can reduce opportunities to generate, test and refine original ideas.' },
        { id: 'b', text: 'Give students room to prototype, select an appropriate medium, test with users and refine their communication.', strongest: true, feedback: 'Yes. Technology supports Creativity when it expands experimentation, thoughtful risk and purposeful expression.' },
      ],
    },
    {
      prompt: 'What would show that the technology actually amplified Connecting?',
      choices: [
        { id: 'a', text: 'The class used four different apps and uploaded everything successfully.', feedback: 'Tool count and successful upload describe implementation, not the quality of the learner experience.' },
        { id: 'b', text: 'Students explain how community perspectives and audience feedback changed their ideas and final decisions.', strongest: true, feedback: 'Correct. That evidence connects technology use to Authenticity, Creativity and learner decision-making.' },
      ],
    },
  ];

  return <DecisionLab title="Make the audience matter" description="Redesign a digital task so technology strengthens Authenticity and Creativity rather than decorating the final product." steps={steps} connection="Connecting: technology can widen meaningful contexts, audiences and perspectives while enabling experimentation and original expression." />;
}

function TechnologyCollaborationDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'Students are using a shared document. One student writes almost everything while the others watch. Does the shared tool prove Collaboration?',
      choices: [
        { id: 'a', text: 'Yes — simultaneous access is evidence of collaboration.', feedback: 'A shared workspace creates an opportunity for collaboration, but it does not guarantee interdependence, shared decisions or equitable contribution.' },
        { id: 'b', text: 'No — redesign the task so learners need one another’s perspectives and contributions.', strongest: true, feedback: 'Correct. Collaboration is a learning design outcome, not a software feature.' },
      ],
    },
    {
      prompt: 'The group is now collaborating more equitably. How could technology support Taking Action?',
      choices: [
        { id: 'a', text: 'Use the final product only as evidence for the teacher’s gradebook.', feedback: 'That may assess learning, but it does not yet connect the work to a purposeful contribution.' },
        { id: 'b', text: 'Use technology to connect the group’s learning with an authentic audience, need or opportunity for contribution.', strongest: true, feedback: 'Yes. Taking Action is stronger when students can explain who benefits and how their learning informs the contribution.' },
      ],
    },
    {
      prompt: 'Which evidence would matter most in reviewing the design?',
      choices: [
        { id: 'a', text: 'Number of comments, edits and minutes spent in the shared platform.', feedback: 'Usage data can be useful, but they do not show the quality of relationships, contribution or collective thinking.' },
        { id: 'b', text: 'Student explanations of shared decisions, diverse perspectives, equitable contribution and the impact of the final action.', strongest: true, feedback: 'Correct. The evidence returns to learner experience rather than platform activity.' },
      ],
    },
  ];

  return <DecisionLab title="A shared document is not the same as collaboration" description="Follow a digital group task from shared access toward genuine interdependence and purposeful contribution." steps={steps} connection="Doing: responsible, ethical and purposeful technology use should strengthen collective learning and meaningful action." />;
}

function TechnologyEvidenceConstructCompare() {
  return <ConstructCompare
    title="What evidence would convince you?"
    description="Evaluate a technology-rich lesson through the learner experience rather than the presence of devices."
    prompt="A team reports that a new platform transformed learning because usage doubled. What evidence would you ask for before agreeing, and what might you do next?"
    placeholder="Think about student talk, choices, work, relationships and action — and connect the evidence to the TLF indicators that guided the design."
    model="I would treat the usage data as implementation evidence, not proof of transformation. I would look for evidence linked to the selected TLF indicators: what students could access, decide, create, connect or contribute that was stronger or newly possible. I would also ask students what the technology enabled and made harder. The next design move should respond to that evidence rather than simply increasing use."
    notice="The judgement separates technology activity from learning evidence and uses the TLF cycle to decide what should be kept, changed, simplified or removed."
    connection="From indicator to evidence: notice student talk, choices, work, relationships and action, then make the next design move."
  />;
}

function AiLiteracyDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'AI produces a confident summary of a professional article. It looks accurate. What should you do first?',
      choices: [
        { id: 'a', text: 'Treat confidence and fluency as evidence that the summary is reliable.', feedback: 'Generative AI can sound highly confident while being incomplete or wrong. Fluency is not verification.' },
        { id: 'b', text: 'Treat it as generated material and identify the important claims that matter for your decision.', strongest: true, feedback: 'Correct. AI literacy begins by separating plausible generation from established truth.' },
      ],
    },
    {
      prompt: 'You have identified two important claims. What is the strongest verification move?',
      choices: [
        { id: 'a', text: 'Ask the same AI whether it made any mistakes.', feedback: 'The same system certifying itself is not independent verification.' },
        { id: 'b', text: 'Compare the claims with the original article or another appropriate source.', strongest: true, feedback: 'Correct. Verification should return to the source or another reliable reference when accuracy matters.' },
      ],
    },
    {
      prompt: 'The summary is mostly accurate but leaves out an important limitation. What now?',
      choices: [
        { id: 'a', text: 'Use it unchanged because the main idea is correct.', feedback: 'A missing limitation can materially change professional interpretation.' },
        { id: 'b', text: 'Revise your understanding using the source, then make the professional decision yourself.', strongest: true, feedback: 'Yes. Prompt → Generate → Question → Verify → Decide keeps the human responsible for interpretation and action.' },
      ],
    },
  ];

  return <DecisionLab title="Fluent does not mean verified" description="Work through the AI-literacy cycle rather than allowing a polished response to become an authority." steps={steps} connection="AI literacy: Prompt → Generate → Question → Verify → Decide. The human remains responsible for the purpose, interpretation and decision." />;
}

function AiPrivacyClassifier() {
  return <SeriesLab
    title="Would you put this in an AI prompt?"
    description="Choose the safest professional move before convenience or output quality enters the decision."
    items={[
      {
        prompt: 'You want help rewriting a generic Grade 7 rubric. It contains no student information.',
        choices: [
          { id: 'a', text: 'Potentially appropriate with normal professional judgement', strongest: true, feedback: 'Correct. A generic instructional artefact may be appropriate when the tool and purpose are suitable and no confidential learner data are involved.' },
          { id: 'b', text: 'Keep it only in a confidential student system', feedback: 'There is no student-specific confidential record in this example.' },
        ],
      },
      {
        prompt: 'You want AI to analyse a learner case using name, age, class, assessment scores, diagnosis, family circumstances and teacher notes.',
        choices: [
          { id: 'a', text: 'Remove only the name and send the rest', feedback: 'Removing a name does not automatically remove identifiability, and sensitive information may not be appropriate to share with an AI service at all.' },
          { id: 'b', text: 'Stop and reconsider whether AI is appropriate; minimise or generalise information and keep protected records in the correct systems', strongest: true, feedback: 'Correct. Necessity, minimisation, identifiability and confidentiality should be considered before prompting.' },
        ],
      },
      {
        prompt: 'A student-facing AI service requires personal accounts and collects data, but its age expectations and storage practices are unclear.',
        choices: [
          { id: 'a', text: 'Pilot it with a small group first', feedback: 'A small pilot does not remove the school’s responsibility to understand the service before directing students to use it.' },
          { id: 'b', text: 'Clarify purpose, account, age, data and storage implications before deciding', strongest: true, feedback: 'Correct. Educational usefulness does not automatically make a student-facing service appropriate.' },
        ],
      },
    ]}
    connection="AISG AI Policy: student safety, privacy and security; protect student data, maintain confidentiality and address safety risks promptly."
  />;
}

function AiCriticalEvaluationConstructCompare() {
  return <ConstructCompare
    title="Question the output, not just the wording"
    description="Practise looking for bias, missing perspectives and unsupported confidence in generated content."
    prompt="AI creates a set of examples of a ‘typical successful family’. Every example uses the same cultural background, language, family structure and assumptions about success. What would you question or change before using this with students?"
    placeholder="Consider representation, assumptions, missing perspectives, relevance to your learners and what would need independent verification."
    model="I would not simply remove one obvious stereotype. I would examine the assumptions about family, language and success across the whole set; identify perspectives and lived experiences that are missing; verify any factual claims; and redesign the examples so the learning invites diverse perspectives rather than presenting one pattern as normal."
    notice="Critical AI literacy looks beyond offensive wording. It asks whose perspectives are represented, whose are absent, what assumptions are embedded and whether the content is accurate and appropriate for the learners in front of us."
    connection="AISG AI Policy: critically evaluate AI-generated information, recognise limitations and potential bias, and keep ethical use central."
  />;
}

function AiPurposeJudgement() {
  return <SingleChoiceLab
    title="Remove the barrier — not the thinking"
    description="Use the TLF to decide whether AI is amplifying learning or quietly doing the intellectual work for the learner."
    situation="A multilingual learner understands a science concept but finds extended English writing a barrier. The intended learning is the learner’s scientific reasoning and explanation."
    choices={[
      { id: 'a', text: 'Ask AI to generate the complete explanation so the learner can submit a polished answer.', feedback: 'This removes the language barrier by also removing much of the intended reasoning and explanation from the learner.' },
      { id: 'b', text: 'Use AI for translation, vocabulary rehearsal or alternative explanations, while keeping the scientific reasoning and final decisions with the learner.', strongest: true, feedback: 'Correct. AI can amplify Personalisation by reducing a barrier while preserving Agency and the thinking the learner needs to own.' },
      { id: 'c', text: 'Do not allow any AI support because independent thinking requires identical conditions for everyone.', feedback: 'Identical conditions can preserve avoidable barriers. The stronger question is which support increases access without outsourcing the intended learning.' },
    ]}
    connection="Purposeful AI: learning first, AI second. Use the TLF to ask what becomes more accessible or meaningful while preserving learner ownership."
  />;
}

function AiTlfSynthesisDecisionLab() {
  const steps: DecisionStep[] = [
    {
      prompt: 'Students are investigating a local accessibility challenge. Where could AI add value without becoming the learner?',
      choices: [
        { id: 'a', text: 'Generate the final recommendations so students can focus on presentation.', feedback: 'That risks outsourcing the reasoning and contribution the learning is meant to develop.' },
        { id: 'b', text: 'Support translation, question generation or comparison of perspectives while students retain the inquiry decisions and evidence judgement.', strongest: true, feedback: 'Correct. AI can increase access and perspective-taking while preserving Agency and authentic inquiry.' },
      ],
    },
    {
      prompt: 'The group wants AI to combine everyone’s ideas into one final answer. What would better protect Collaboration?',
      choices: [
        { id: 'a', text: 'Let AI synthesise the answer and have the group approve it at the end.', feedback: 'Approval after generation can leave learners as spectators rather than co-constructors of shared thinking.' },
        { id: 'b', text: 'Use AI to surface tensions or organise ideas, then require the group to discuss, negotiate and make the shared decisions.', strongest: true, feedback: 'Yes. AI can support collective work without replacing the interdependence, perspective-taking and decision-making that Collaboration requires.' },
      ],
    },
    {
      prompt: 'Students now have a recommendation for an authentic community audience. What keeps Taking Action human-centred?',
      choices: [
        { id: 'a', text: 'Let AI decide what the community needs and produce the final contribution.', feedback: 'Taking Action should apply learner understanding to an authentic opportunity or need; the tool should not become the actor in the learners’ place.' },
        { id: 'b', text: 'Students decide what contribution is ethical and useful, use AI only where it strengthens the work, and remain responsible for what they communicate.', strongest: true, feedback: 'Correct. The learner remains accountable for purpose, judgement and contribution.' },
      ],
    },
    {
      prompt: 'Afterwards, what evidence would best tell you whether AI amplified Engagement for All?',
      choices: [
        { id: 'a', text: 'Prompt count, minutes in the AI tool and number of generated outputs.', feedback: 'Those metrics show use, not necessarily deeper learning or engagement.' },
        { id: 'b', text: 'Student talk, choices, work, relationships and action showing stronger access, ownership, authenticity, creativity, collaboration or contribution.', strongest: true, feedback: 'Correct. The TLF brings the evaluation back to the learner experience and the evidence connected to selected indicators.' },
      ],
    },
  ];

  return <DecisionLab title="AI as an amplifier, not the actor" description="Bring AI literacy and the TLF together in one authentic learning design. Make a decision, see the consequence, and keep the human learner at the centre." steps={steps} connection="Engagement for All: AI can enable Personalisation, Agency, Authenticity, Creativity, Collaboration and Taking Action only when learner evidence shows the experience is actually stronger." />;
}
