import type { CourseId } from '@/lib/course-catalog';

export type CourseConnection = {
  course: CourseId;
  reason: string;
};

export const COURSE_CONNECTIONS: Record<CourseId, readonly CourseConnection[]> = {
  safeguarding: [
    { course: 'teams', reason: 'Professional communication and confidentiality shape how concerns are recorded and shared, while safeguarding procedures remain the governing requirement.' },
    { course: 'mtss', reason: 'Both courses value disciplined evidence and coordinated support, but safeguarding concerns must always follow the safeguarding pathway rather than an MTSS process.' },
  ],
  elementary: [
    { course: 'engagement', reason: 'The TLF provides shared language for noticing the learner experience behind everyday Elementary routines and learning design.' },
    { course: 'multilingual', reason: 'Asset-based multilingual practice deepens access, participation and collaboration within the Elementary classroom.' },
    { course: 'assessment', reason: 'Formative evidence and feedback strengthen responsive teaching and learner ownership across Elementary learning.' },
  ],
  secondary: [
    { course: 'assessment', reason: 'Clear learning intentions, valid evidence and actionable feedback strengthen assessment practice across Secondary programmes.' },
    { course: 'ai', reason: 'AI literacy, academic integrity and human judgement increasingly intersect with Secondary teaching, assessment and learner ownership.' },
    { course: 'engagement', reason: 'The TLF helps connect programme expectations with a shared AISG language for learner experience.' },
  ],
  teams: [
    { course: 'data', reason: 'Both courses ask educators to describe evidence precisely before moving to interpretation or action.' },
    { course: 'growth-domain4', reason: 'Professional communication becomes more powerful when it supports reciprocal collaboration, shared evidence and collective improvement.' },
  ],
  ai: [
    { course: 'technology', reason: 'Both courses begin with the learning need and ask whether a digital tool genuinely amplifies the learner experience.' },
    { course: 'assessment', reason: 'AI changes what counts as trustworthy evidence of learning, making assessment design and visible learner thinking increasingly important.' },
    { course: 'engagement', reason: 'The TLF helps keep AI use connected to meaningful learner Agency, Authenticity, Creativity, Collaboration and action.' },
  ],
  assessment: [
    { course: 'data', reason: 'Assessment evidence becomes more useful when it feeds a disciplined cycle of noticing, acting, monitoring and adjustment.' },
    { course: 'udl', reason: 'Both courses distinguish the intended learning from unnecessary barriers that can distort access or evidence.' },
    { course: 'growth-domain4', reason: 'Feedback, evidence and learner reflection are central to Domain 4 professional impact.' },
  ],
  data: [
    { course: 'assessment', reason: 'Formative assessment creates close evidence of learner thinking that can drive the Data to Action improvement cycle.' },
    { course: 'mtss', reason: 'MTSS relies on multiple evidence sources, progress monitoring and clear decision rules rather than one-off scores.' },
    { course: 'growth-domain4', reason: 'Domain 4 extends evidence use into reflection, collaboration and collective professional impact.' },
  ],
  udl: [
    { course: 'multilingual', reason: 'Both approaches preserve worthwhile challenge while reducing barriers to access, participation and meaning-making.' },
    { course: 'growth-domain1', reason: 'Domain 1 connects inclusive design with learner identity, access, cognitive engagement and assessment for growth.' },
    { course: 'engagement', reason: 'UDL creates conditions for Personalisation and Agency and can support deeper engagement across the TLF.' },
  ],
  engagement: [
    { course: 'growth-domain1', reason: 'Domain 1 turns shared TLF ideas into a developmental lens for purposeful and inclusive learning design.' },
    { course: 'growth-domain2', reason: 'Domain 2 deepens the conditions for belonging, voice, autonomy and participation that support Engagement for All.' },
    { course: 'growth-domain3', reason: 'Domain 3 extends the TLF into cognitive demand, inquiry, creativity, authentic application and meaningful action.' },
  ],
  mtss: [
    { course: 'data', reason: 'Strong MTSS decisions depend on disciplined evidence use, progress monitoring and adjustment over time.' },
    { course: 'multilingual', reason: 'A dual language-and-learning lens helps teams avoid confusing English development, learning need and instructional design.' },
    { course: 'udl', reason: 'Strong Tier 1 design can remove barriers proactively before more intensive support is considered.' },
  ],
  multilingual: [
    { course: 'udl', reason: 'Both courses widen access through flexible design while keeping the learning goal and cognitive demand visible.' },
    { course: 'assessment', reason: 'Valid assessment helps separate language demands from the knowledge or thinking a learner is meant to demonstrate.' },
    { course: 'mtss', reason: 'Multiple evidence sources and specialist collaboration support stronger decisions when language and learning questions overlap.' },
  ],
  technology: [
    { course: 'engagement', reason: 'Technology is most useful when it amplifies a learner experience already worth strengthening through the TLF.' },
    { course: 'ai', reason: 'AI is one increasingly important form of digital practice requiring the same learning-first judgement plus additional literacy, privacy and verification.' },
    { course: 'growth-domain3', reason: 'Purposeful technology can enable richer inquiry, creation, collaboration, authentic audiences and meaningful action.' },
  ],
  'growth-domain1': [
    { course: 'udl', reason: 'UDL gives a practical design framework for anticipating learner variability and removing unnecessary barriers.' },
    { course: 'assessment', reason: 'Assessment for Learning strengthens the Domain 1 focus on evidence, feedback, clarity and learner growth.' },
    { course: 'engagement', reason: 'The TLF provides shared AISG language that Domain 1 develops through a continuum of learner evidence.' },
  ],
  'growth-domain2': [
    { course: 'engagement', reason: 'Belonging, Agency and Collaboration are closely connected to the conditions described in Domain 2.' },
    { course: 'multilingual', reason: 'Language-conscious participation and multiple legitimate routes into contribution strengthen belonging and learner voice.' },
    { course: 'growth-domain3', reason: 'Inclusive culture and learner autonomy create conditions for stronger student-led discourse, inquiry and knowledge-building.' },
  ],
  'growth-domain3': [
    { course: 'engagement', reason: 'Domain 3 deepens several TLF facets through observable cognitive demand, inquiry, collaboration, authentic application and action.' },
    { course: 'technology', reason: 'Purposeful technology can amplify inquiry, creation, authentic audiences and collaboration when the learning need leads.' },
    { course: 'growth-domain2', reason: 'Learner-led thinking and discourse depend on belonging, voice, autonomy and inclusive participation structures.' },
  ],
  'growth-domain4': [
    { course: 'data', reason: 'Evidence, progress monitoring and adjustment become more powerful when they inform shared professional learning.' },
    { course: 'assessment', reason: 'Feedback, learner reflection and evidence use connect directly with Domain 4 growth practices.' },
    { course: 'teams', reason: 'Purposeful, evidence-based communication supports collaboration and community partnership without sacrificing confidentiality.' },
  ],
};
