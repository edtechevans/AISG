'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, MessageCircle, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Choice = { id: string; text: string; strongest?: boolean; feedback: string };
type SeriesItem = { prompt: string; context?: string; choices: Choice[] };
type DecisionStep = SeriesItem;

const surface = 'mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6';
const option = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold leading-6 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b294b] focus-visible:ring-offset-2 disabled:cursor-default';

export default function MultilingualLearningExperience({ sectionId, learnPage }: { sectionId: string; learnPage: number }) {
  if (learnPage !== 1) return null;
  if (sectionId === 'mll-assets') return <AssetLensLab />;
  if (sectionId === 'mll-content-language') return <LanguageDemandConstructCompare />;
  if (sectionId === 'mll-interaction') return <ParticipationDecisionLab />;
  if (sectionId === 'mll-scaffolding') return <ScaffoldClassifier />;
  if (sectionId === 'mll-evidence-collaboration') return <EvidenceDecisionLab />;
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

function ConstructCompare({ title, description, prompt, placeholder, model, notice, connection }: { title: string; description: string; prompt: string; placeholder: string; model: string; notice: string; connection: string }) {
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const id = 'mll-language-demand-draft';
  return <section className={surface}>
    <ExperienceHeader kind="Construct & compare" title={title} description={description} />
    <div className="rounded-xl bg-white p-4 text-sm leading-6 text-slate-700"><strong className="text-[#0b294b]">Your task</strong><p className="mt-1">{prompt}</p></div>
    <label className="mt-4 block text-sm font-semibold text-[#0b294b]" htmlFor={id}>Write your response</label>
    <textarea id={id} value={draft} onChange={(event) => setDraft(event.target.value)} rows={4} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none focus:border-[#0b294b] focus:ring-2 focus:ring-[#0b294b]/20" />
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">Your text stays on this page and is not submitted or scored.</span><Button variant="outline" disabled={!draft.trim()} onClick={() => setRevealed(true)}>Compare with a model</Button></div>
    {revealed && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="flex items-center gap-2 font-semibold"><MessageCircle className="h-4 w-4" aria-hidden="true" /> A strong response might include</div><p className="mt-2">{model}</p><p className="mt-2"><strong>Notice:</strong> {notice}</p></div>}
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
    <div className="mt-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <p className="text-base font-semibold leading-7 text-[#0b294b]">{current.prompt}</p>
      {current.context && <p className="mt-2 text-sm leading-6 text-slate-600">{current.context}</p>}
      <div className="mt-5 grid gap-2">{current.choices.map((choice) => <button key={choice.id} type="button" disabled={Boolean(chosen)} className={`${option} ${choiceId === choice.id ? 'border-[#0b294b] ring-1 ring-[#0b294b]' : ''}`} onClick={() => setChoiceId(choice.id)}><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs text-[#0b294b]">{choice.id.toUpperCase()}</span>{choice.text}</button>)}</div>
      {chosen && <><Feedback strong={Boolean(chosen.strongest)}>{chosen.feedback}</Feedback><div className="mt-4 flex justify-end"><Button onClick={advance} className="rounded-full bg-[#0b294b] text-white hover:bg-[#163b63]">{complete ? <><RotateCcw /> Run the lab again</> : <>Continue scenario <ArrowRight /></>}</Button></div></>}
    </div>
    <p className="mt-4 text-xs leading-5 text-slate-500">Course connection: {connection}</p>
  </section>;
}

function AssetLensLab() {
  return <SeriesLab title="Asset lens — or deficit lens?" description="Notice how the story we tell about a learner changes the instructional decision that follows." connection="Begin with what learners can do, the languages and experiences they bring, and the worthwhile learning they are ready to access." items={[
    {
      prompt: '“Her English writing is short, so she probably cannot handle the complex science task yet.”',
      choices: [
        { id: 'asset', text: 'Asset-based', feedback: 'This statement infers cognitive capacity from English output and lowers the learning before examining other evidence.' },
        { id: 'deficit', text: 'Deficit-based', strongest: true, feedback: 'Correct. English writing length is not a reliable measure of the learner’s scientific reasoning or potential.' },
      ],
    },
    {
      prompt: '“He explained the concept precisely using a diagram and his home language. Let’s preserve that reasoning and build the English needed to communicate it here.”',
      choices: [
        { id: 'asset', text: 'Asset-based', strongest: true, feedback: 'Yes. The learner’s existing conceptual and linguistic resources become the starting point for continued learning.' },
        { id: 'deficit', text: 'Deficit-based', feedback: 'The statement explicitly notices strengths and plans to extend them.' },
      ],
    },
    {
      prompt: '“She is quiet in whole-class discussion. I want to find out what she understands before deciding what support she needs.”',
      choices: [
        { id: 'asset', text: 'Asset-based', strongest: true, feedback: 'Yes. Silence in one interaction format is treated as incomplete evidence rather than proof of limited understanding.' },
        { id: 'deficit', text: 'Deficit-based', feedback: 'The teacher is withholding judgement and seeking stronger evidence.' },
      ],
    },
  ]} />;
}

function LanguageDemandConstructCompare() {
  return <ConstructCompare
    title="Name the language demand"
    description="Move beyond a vocabulary list and identify the language students need for the thinking itself."
    prompt="The content goal is: ‘Evaluate two proposed solutions to reduce plastic waste and justify which is more effective using evidence.’ In one or two sentences, identify the main language demand and one purposeful support."
    placeholder="Students need language to... A useful support could be..."
    model="Students need language for comparison, evaluation, evidence and justification — for example, ‘Both solutions…, however…’, ‘The stronger evidence is… because…’. A useful support could combine a model response, a comparison organiser and partner rehearsal before independent justification."
    notice="The support is tied to the disciplinary language function. It does not replace the evaluation task or reduce the expectation to use evidence."
    connection="Plan content and language together: what students will think about, and how they will use language to participate in that thinking."
  />;
}

function ParticipationDecisionLab() {
  return <DecisionLab title="Build a route into the discussion" description="Work through three decisions that increase meaningful participation without reducing the thinking." connection="Multilingual learners need comprehensible input, interaction, rehearsal and meaningful output. Home languages can be strategic resources within that pathway." steps={[
    {
      prompt: 'A challenging discussion prompt produces immediate answers from the same fluent speakers. What do you change first?',
      choices: [
        { id: 'a', text: 'Cold-call multilingual learners immediately so expectations are equal.', feedback: 'Equal exposure to risk does not necessarily create equal access to the interaction.' },
        { id: 'b', text: 'Give everyone think time, then brief partner rehearsal around the same challenging prompt.', strongest: true, feedback: 'Strong. Rehearsal keeps the cognitive demand while giving more learners time to formulate ideas and language.' },
        { id: 'c', text: 'Simplify the prompt only for multilingual learners.', feedback: 'This lowers the thinking before trying to improve access to the original prompt.' },
      ],
    },
    {
      prompt: 'During rehearsal, two students discuss the concept partly in Mandarin and annotate key terms in both languages. What do you do?',
      context: 'The final whole-class discussion will be in English.',
      choices: [
        { id: 'a', text: 'Stop the home-language use so all processing happens in English.', feedback: 'This removes a meaning-making resource even though the students are still preparing for the English communication goal.' },
        { id: 'b', text: 'Allow the strategic home-language processing and prompt them to prepare the key idea they want to contribute in English.', strongest: true, feedback: 'Strong. Their full linguistic repertoire supports understanding while the intended English output remains purposeful.' },
        { id: 'c', text: 'Tell them they no longer need to participate in English.', feedback: 'Translanguaging is not a reason to remove the intended language-development opportunity.' },
      ],
    },
    {
      prompt: 'The students now have a strong idea but are unsure how to enter the discussion. What is the most useful support?',
      choices: [
        { id: 'a', text: 'A short bank of discussion moves such as “I want to build on…”, “My evidence suggests…” and “I see it differently because…”.', strongest: true, feedback: 'Strong. The support targets participation language and leaves the reasoning to the learner.' },
        { id: 'b', text: 'A complete response for them to read aloud.', feedback: 'That would remove much of the learner-owned thinking and language construction.' },
        { id: 'c', text: 'No support — independence means doing it without a scaffold.', feedback: 'Independence can be developed through temporary, targeted scaffolds that are faded with evidence.' },
      ],
    },
  ]} />;
}

function ScaffoldClassifier() {
  return <SeriesLab title="Scaffold — or lower the bar?" description="Decide whether the design supports access to the intended thinking or quietly replaces it." connection="Strong scaffolds change the route into worthwhile learning and can be faded as learners become more independent." items={[
    {
      prompt: 'Provide a labelled diagram, selected key terms and a cause-and-effect sentence starter for the same scientific explanation goal.',
      choices: [
        { id: 'scaffold', text: 'Scaffold access', strongest: true, feedback: 'Yes. The supports target language and representation while preserving the explanation.' },
        { id: 'lower', text: 'Lower the learning', feedback: 'The intended explanation remains intact.' },
      ],
    },
    {
      prompt: 'Replace the class analysis task with a worksheet that asks the multilingual learner only to match vocabulary definitions.',
      choices: [
        { id: 'scaffold', text: 'Scaffold access', feedback: 'This changes the learning goal rather than supporting access to the analysis.' },
        { id: 'lower', text: 'Lower the learning', strongest: true, feedback: 'Correct. Vocabulary practice may have a place, but it should not automatically replace the shared analytical learning.' },
      ],
    },
    {
      prompt: 'Allow oral rehearsal and a bilingual glossary before the learner independently writes the same evidence-based recommendation.',
      choices: [
        { id: 'scaffold', text: 'Scaffold access', strongest: true, feedback: 'Yes. The supports build access and language while the learner still owns the final reasoning and recommendation.' },
        { id: 'lower', text: 'Lower the learning', feedback: 'The core evidence and reasoning demand is preserved.' },
      ],
    },
  ]} />;
}

function EvidenceDecisionLab() {
  return <DecisionLab title="Language, learning — or both?" description="Use a dual lens before deciding what a learner’s difficulty means." connection="Use multiple sources of evidence and specialist collaboration to distinguish language demands, content understanding and possible learning barriers." steps={[
    {
      prompt: 'A learner performs poorly on a dense English reading task but explains the concept much more strongly with visuals and oral discussion. What is your first conclusion?',
      choices: [
        { id: 'a', text: 'The learner has a reading disability.', feedback: 'One English task does not support that conclusion.' },
        { id: 'b', text: 'The learner has no learning needs because the oral explanation was stronger.', feedback: 'That conclusion is also premature. The difference is useful evidence, not a diagnosis.' },
        { id: 'c', text: 'The task may be revealing a language or access barrier; gather more evidence before deciding what the pattern means.', strongest: true, feedback: 'Strong. Start with the discrepancy as a question and investigate across contexts.' },
      ],
    },
    {
      prompt: 'What evidence would strengthen the next decision?',
      choices: [
        { id: 'a', text: 'Only the next English reading score.', feedback: 'Another single score may reproduce the same ambiguity.' },
        { id: 'b', text: 'Classroom work across modes, language-proficiency information, learner voice, response to appropriate scaffolds, and where possible evidence across languages or contexts.', strongest: true, feedback: 'Strong. Multiple sources help the team separate content understanding, language development and other possible barriers.' },
        { id: 'c', text: 'The teacher’s impression of effort.', feedback: 'Effort judgements are too indirect and can be shaped by cultural or linguistic expectations.' },
      ],
    },
    {
      prompt: 'The pattern remains complex after classroom supports. What is the strongest professional move?',
      choices: [
        { id: 'a', text: 'Collaborate with EAL and Learning Support colleagues around the evidence and agree what to try and monitor next.', strongest: true, feedback: 'Strong. A shared dual lens reduces the risk of treating language and learning needs as either interchangeable or unrelated.' },
        { id: 'b', text: 'Choose either EAL or Learning Support and ask that team to take over.', feedback: 'The learner may sit at the intersection of needs; separate hand-offs can fragment the evidence and support.' },
        { id: 'c', text: 'Wait until English proficiency is high before investigating further.', feedback: 'Waiting can delay appropriate support. Language development should be considered, not used as a reason to suspend inquiry.' },
      ],
    },
  ]} />;
}
