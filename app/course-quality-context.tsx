import type { CourseId } from '@/lib/course-catalog';

type SharedCourseId = Exclude<CourseId, 'safeguarding'>;

type CourseLens = {
  grounding: string;
  cultural: string;
  tlf: string;
};

const COURSE_LENSES: Record<SharedCourseId, CourseLens> = {
  elementary: {
    grounding: 'Grounded first in current Elementary expectations and division practice. Framework language supports reflection, but it does not replace handbook procedures or programme-specific requirements.',
    cultural: 'Design for AISG’s multilingual, internationally mobile community in Guangzhou: use learner identity, home languages, family knowledge and local context as assets without assuming that students from a shared background think, participate or learn in the same way.',
    tlf: 'Where it adds value, notice Personalisation, Agency, Authenticity, Collaboration and Taking Action through student talk, choices, work, relationships and action — not through the presence of a particular activity.',
  },
  secondary: {
    grounding: 'Grounded first in current Secondary expectations, IB programme requirements and division practice. Professional judgement should stay aligned with the handbook and the intended learning.',
    cultural: 'AISG learners move among languages, cultures, programmes and future pathways. Avoid treating one communication style, participation norm or prior-school experience as the default; ask what the learner evidence actually shows.',
    tlf: 'Use the TLF selectively where it illuminates the learner experience — especially Personalisation, Agency, Authenticity, Collaboration and Taking Action — rather than forcing every routine or procedure into a facet.',
  },
  teams: {
    grounding: 'Grounded in AISG Employee Communication Expectations: purpose, audience, minimum necessary information, observable evidence, confidentiality and professional language govern the decision.',
    cultural: 'Professional observation requires cultural humility. Eye contact, silence, directness, public disagreement, family communication and English fluency can be interpreted differently across contexts; describe the pattern and impact before assigning motive or character.',
    tlf: 'The TLF is secondary here. Respectful, evidence-based communication can support belonging and Collaboration, but communication policy and confidentiality requirements remain the governing expectations.',
  },
  ai: {
    grounding: 'Grounded in AISG AI expectations, critical AI literacy and human professional judgement. AI can support a process; it does not become the authority for truth, assessment, learner understanding or professional decisions.',
    cultural: 'Generated output can reproduce dominant, English-language or globally generic assumptions. Check whether examples, histories, family structures, languages, services and recommendations actually make sense for learners and communities in Guangzhou and southern China.',
    tlf: 'Use the six TLF facets only as a purposeful learning-design lens. AI may amplify Personalisation, Agency, Authenticity, Creativity, Taking Action or Collaboration — but its presence is never evidence of a facet by itself.',
  },
  assessment: {
    grounding: 'Grounded in AISG Teacher Growth language around formative assessment, timely feedback, learner use of evidence and responsive planning. Assessment is formative because of what teachers and learners do with evidence.',
    cultural: 'Assessment evidence is only useful when it validly represents the intended learning. Consider whether language load, unfamiliar response conventions, speed, examples or interaction norms are distorting what a multilingual or internationally mobile learner actually knows and can do.',
    tlf: 'The strongest natural connections are Personalisation and Agency, with Collaboration where peer learning is purposeful. Keep the construct and worthwhile challenge clear while widening valid ways to access, interpret and use feedback.',
  },
  data: {
    grounding: 'Grounded in AISG’s current-state → desired-state → gap → action → progress-monitoring cycle and disciplined evidence-informed inquiry. Data should improve a decision, not merely document activity.',
    cultural: 'Data is produced in a context. Before attributing a pattern to motivation or ability, examine language demands, opportunity to learn, cultural familiarity, access, response conventions and whether the measure is valid for the question being asked.',
    tlf: 'TLF language is useful when evidence concerns learner experience: whose strengths and needs are visible, where students have Agency, and what talk, choices, work, relationships or action show about the design.',
  },
  udl: {
    grounding: 'Grounded in CAST UDL Guidelines 3.0 and AISG’s inclusive-learning commitments. UDL is proactive design for learner variability, not learning-styles matching, unlimited choice or a reason to lower worthwhile challenge.',
    cultural: 'Variability exists within as well as between cultural and linguistic groups. Representation should broaden perspectives and ways of knowing without turning identity into a prediction about how an individual learner will prefer to participate.',
    tlf: 'UDL aligns most directly with Personalisation and Agency, and can create conditions for the other facets. The useful evidence is whether barriers are reduced and learners can participate, make meaning, choose purposefully and become more independent.',
  },
  engagement: {
    grounding: 'This course is grounded directly in the AISG Transformative Learning Framework Faculty Field Guide. Engagement for All, Being–Connecting–Doing, the six facets and the 38 indicators are shared AISG language for design, reflection and improvement.',
    cultural: 'Cultural Responsiveness is not a seventh facet to tick off. It is woven across the framework through identity, languages, belonging, diverse perspectives, local and global communities, cultural histories, authentic audiences and equitable collaboration.',
    tlf: 'Use the framework as a lens, not a checklist: select a few relevant indicators, notice student talk, choices, work, relationships and action, then identify the next design move that could deepen engagement for more learners.',
  },
  mtss: {
    grounding: 'Grounded in the essential components of MTSS and AISG’s developing student-support context. This course teaches system logic and professional judgement; it is not a substitute for current AISG referral, documentation or service procedures.',
    cultural: 'Interpret screening and progress evidence through a cultural and linguistic lens. Language development and learning difference are distinct possibilities that can overlap; neither should be inferred from one score or from English proficiency alone.',
    tlf: 'Natural connections include Personalisation, Agency and belonging: support should increase access and independence, use learner and family knowledge, and avoid turning a tier or service into a permanent learner identity.',
  },
  multilingual: {
    grounding: 'Grounded in AISG’s asset-based EAL direction, WIDA-informed language evidence, classroom-based support and shared responsibility between classroom or subject teachers and EAL specialists.',
    cultural: 'A learner may draw on English, Mandarin, Cantonese and/or other home languages and cultural resources in different ways. Treat the full linguistic repertoire as a learning asset without asking any learner to represent an entire language, nationality or culture.',
    tlf: 'Personalisation is visible when learning responds to linguistic and cultural strengths and needs; Agency grows as learners choose strategies and advocate for access; Collaboration and Authenticity deepen when diverse perspectives and languages contribute to shared learning.',
  },
  technology: {
    grounding: 'Grounded in the TLF for learning design and AISG’s SMART-T process when a PLC is considering a digital tool for regular use. A useful tool still needs a clear student-learning need, coherent model of use, accessibility and safety, readiness, and curriculum alignment.',
    cultural: 'In Guangzhou, practical fitness includes reliable access as well as pedagogy: language accessibility, privacy and data protection, technical compatibility, network reliability, support capacity and equitable access all shape whether a tool is genuinely usable.',
    tlf: 'Technology is not a seventh facet. Select the learner experience first, then ask whether the tool meaningfully amplifies Personalisation, Agency, Authenticity, Creativity, Taking Action or Collaboration — and what evidence would show that it did.',
  },
  'growth-domain1': {
    grounding: 'Grounded directly in the AISG Teacher Growth Continuum for Domain 1. The continuum is developmental: Exploring → Building → Embedding → Extending → Transformational, with different strands able to deepen at different rates.',
    cultural: 'Understanding learners includes language profiles, identities, strengths, cultures, interests and access needs. Culturally responsive design uses that knowledge as a resource while avoiding assumptions based on group membership.',
    tlf: 'Strong connections include Personalisation, Agency and Authenticity. The key evidence remains learner experience: clarity of purpose, equitable access, deep thinking, useful assessment, transfer and increasing independence.',
  },
  'growth-domain2': {
    grounding: 'Grounded directly in the AISG Teacher Growth Continuum for Domain 2: belonging, voice, equitable routines, autonomy and purposeful use of space, time and tools.',
    cultural: 'Psychological safety does not require every learner to communicate, disagree or participate in one preferred way. Design multiple legitimate routes into contribution while building shared expectations for dignity, equity and belonging.',
    tlf: 'Personalisation and Agency are especially visible, with Collaboration becoming stronger as learners help sustain inclusive routines, relationships and shared learning conditions.',
  },
  'growth-domain3': {
    grounding: 'Grounded directly in the AISG Teacher Growth Continuum for Domain 3: cognitive demand, inclusive discourse, inquiry and creativity, and authentic application with social impact.',
    cultural: 'Cultural responsiveness is part of rigorous thinking, not an add-on. Ask whose knowledge and perspectives shape inquiry, whether local Guangzhou and southern China contexts are treated as sources of knowledge, and whether learners can challenge a single dominant account.',
    tlf: 'Domain 3 naturally intersects with Authenticity, Creativity, Collaboration and Taking Action, while Agency is visible in learner-led inquiry. Use these connections only when the student evidence supports them.',
  },
  'growth-domain4': {
    grounding: 'Grounded directly in the AISG Teacher Growth Continuum for Domain 4: feedback, evidence, learner reflection, professional collaboration and community partnership.',
    cultural: 'Professional impact includes reciprocal partnership. Communication and collaboration should make room for multilingual family and community knowledge rather than treating school expertise as the only valid perspective.',
    tlf: 'Agency is strengthened when learners use feedback and evidence to own growth; Collaboration and Authenticity become relevant as professional and community partnerships improve the learner experience across contexts.',
  },
};

const SECTION_NOTES: Partial<Record<`${SharedCourseId}:${string}`, { title: string; text: string }>> = {
  'engagement:tlf-promise': {
    title: 'Cultural Responsiveness runs through the framework',
    text: 'Do not look for Cultural Responsiveness as a separate seventh facet. Notice it in whose languages, identities and strengths shape Personalisation; whose perspectives influence Agency and Authenticity; whose histories are preserved through Taking Action; and whether Collaboration genuinely values difference. A local Guangzhou or Pearl River Delta context can be as authentic as an international one when the purpose, people and consequences are meaningful.',
  },
  'technology:tech-purpose': {
    title: 'For regular tool adoption, add the SMART-T lens',
    text: 'A strong classroom use and a sound adoption decision are related but different. When a PLC is considering a digital tool for regular use, AISG’s SMART-T process asks teams to begin with the Student Learning Need, agree a Model of Use, examine Accessibility & Safety, check Resources & Readiness, and confirm Teaching & Curriculum Alignment. The TLF helps judge the learner experience; SMART-T helps judge whether the tool can be adopted responsibly and sustainably.',
  },
  'data:data-inquiry': {
    title: 'Treat validity as a cultural and linguistic question too',
    text: 'A score is not culturally or linguistically neutral simply because it is numerical. Ask what the measure required students to understand about language, examples, timing, response conventions and prior opportunity to learn. Disaggregation should generate better questions about access and design — not more precise deficit labels.',
  },
  'assessment:afl-evidence': {
    title: 'Keep the construct visible',
    text: 'When language, speed or response format is not the intended learning, it should not quietly become the main thing being measured. When it is part of the construct — for example, writing an argument in English — preserve that expectation and scaffold access around it. Fair evidence is not always identical evidence; it is evidence that supports the intended inference about learning.',
  },
  'teams:communication-evidence': {
    title: 'Description also protects against cultural misinterpretation',
    text: 'Behaviours such as eye contact, silence, directness, public disagreement, turn-taking and family communication can carry different meanings across languages, cultures and relationships. Record what happened, in what context, with what pattern and impact. Then ask what else you need to understand before converting the observation into a judgement about motivation, respect, engagement or home life.',
  },
  'ai:critical-evaluation': {
    title: 'Local relevance is part of verification',
    text: 'Critical AI literacy includes more than factual checking. A response may be accurate somewhere and still be a poor fit for Guangzhou. Verify whether policies, services, platforms, examples, histories, language assumptions and cultural references are locally applicable, and bring in sources or people with relevant contextual knowledge when the decision matters.',
  },
  'mtss:mtss-screening': {
    title: 'Keep a dual lens on language and learning',
    text: 'For multilingual learners, a difficulty can reflect language development, the design of instruction or assessment, a learning difference, several factors together, or something else. Use classroom evidence across modes, language-proficiency information, response to appropriate scaffolds, learner and family knowledge, and EAL/Learning Support expertise before making a high-consequence attribution.',
  },
  'multilingual:mll-assets': {
    title: 'Asset-based does not mean essentialising identity',
    text: 'Knowing that a learner is multilingual is a starting point for curiosity, not a script for what they prefer or what they should represent. Invite learners to draw on languages, experiences and identities when these are useful to the learning; do not require them to perform cultural expertise or speak for a whole community.',
  },
  'growth-domain3:growth-d3-authentic': {
    title: 'Authenticity can begin locally',
    text: 'Authentic application does not need a distant or globally branded context. Learners can investigate meaningful questions in the school, neighbourhood, Guangzhou or the wider Pearl River Delta, work with relevant perspectives and audiences, and then connect local learning to national or global patterns where that strengthens the inquiry.',
  },
};

export function CourseLearningLens({ course }: { course: SharedCourseId }) {
  const lens = COURSE_LENSES[course];
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6" aria-labelledby="aisg-learning-lens-title">
    <p className="tiny-eyebrow">Quality & context</p>
    <h2 id="aisg-learning-lens-title" className="mt-2 text-lg font-semibold tracking-tight text-[#0b294b]">AISG learning lens</h2>
    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Use these lenses to keep the course grounded, culturally responsive and connected to AISG’s shared language without forcing framework alignment where it does not belong.</p>
    <dl className="mt-5 grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200"><dt className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">Grounding</dt><dd className="mt-2 text-sm leading-6 text-slate-700">{lens.grounding}</dd></div>
      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200"><dt className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">Cultural responsiveness</dt><dd className="mt-2 text-sm leading-6 text-slate-700">{lens.cultural}</dd></div>
      <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200"><dt className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">TLF connection</dt><dd className="mt-2 text-sm leading-6 text-slate-700">{lens.tlf}</dd></div>
    </dl>
  </section>;
}

export function CourseSectionQualityNote({ course, sectionId, learnPage }: { course: SharedCourseId; sectionId: string; learnPage: number }) {
  if (learnPage !== 0) return null;
  const note = SECTION_NOTES[`${course}:${sectionId}`];
  if (!note) return null;
  return <aside className="mt-6 rounded-2xl border border-[#d8e1ea] bg-[#f5f8fb] p-5" aria-label={note.title}>
    <p className="text-xs font-bold uppercase tracking-[.11em] text-[#8f2034]">Deepen the lens</p>
    <h2 className="mt-2 text-lg font-semibold tracking-tight text-[#0b294b]">{note.title}</h2>
    <p className="mt-2 text-sm leading-6 text-slate-700">{note.text}</p>
  </aside>;
}
