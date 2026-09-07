import { COURSE_BY_ID, type CourseId } from '@/lib/course-catalog';

export type CompanionKnowledge = {
  grounding: string;
  tlf: string;
  culture: string;
  sources: readonly string[];
};

export const COMPANION_KNOWLEDGE: Record<CourseId, CompanionKnowledge> = {
  safeguarding: {
    grounding: 'Safeguarding policy, reporting responsibilities and the welfare of the child govern the decision. The companion must not investigate, diagnose or improvise case-management advice.',
    tlf: 'The TLF is secondary here. A framework connection must never delay or complicate a safeguarding response.',
    culture: 'Use cultural humility, but never use cultural interpretation to explain away, minimise or delay responding to a safeguarding concern.',
    sources: ['AISG Student Safeguarding Handbook · Revised May 2026', 'Safeguarding at AISG course'],
  },
  elementary: {
    grounding: 'Ground first in current Elementary expectations and division practice; use framework language to illuminate learning rather than replace handbook or programme requirements.',
    tlf: 'Use Personalisation, Agency, Authenticity, Collaboration and Taking Action selectively through evidence of learner experience.',
    culture: 'AISG Elementary learners bring varied languages, identities, family knowledge and prior-school experiences. Treat these as resources without assuming one background predicts one way of learning.',
    sources: ['AISG Elementary Faculty Handbook 2026–27', 'AISG Transformative Learning Framework', 'Elementary Faculty Essentials course'],
  },
  secondary: {
    grounding: 'Ground first in current Secondary expectations, IB programme requirements and division practice.',
    tlf: 'Use the TLF where it clarifies learner experience rather than forcing every routine into a facet.',
    culture: 'Secondary learners move among languages, cultures, programmes and future pathways. Ask what learner evidence shows before treating one norm as the default.',
    sources: ['AISG Secondary Faculty Handbook 2026–27', 'AISG Transformative Learning Framework', 'Secondary Faculty Essentials course'],
  },
  teams: {
    grounding: 'Purpose, audience, minimum necessary information, observable evidence, confidentiality and professional language govern communication decisions.',
    tlf: 'The TLF is secondary. Communication can support belonging and collaboration, but confidentiality and professional expectations remain governing requirements.',
    culture: 'Eye contact, silence, directness, disagreement, family communication and English fluency can carry different meanings. Describe evidence before assigning motive or character.',
    sources: ['AISG Employee Communication Expectations', 'Employee Communication Guidelines course'],
  },
  ai: {
    grounding: 'AI literacy requires privacy, safety, verification, bias awareness, human oversight and preservation of intellectual ownership.',
    tlf: 'AI may amplify the six TLF facets, but the presence of AI is never evidence of transformation by itself.',
    culture: 'Check whether examples, services, histories, platforms and recommendations actually fit Guangzhou and southern China rather than importing globally generic assumptions.',
    sources: ['AISG Artificial Intelligence Policy', 'AISG Transformative Learning Framework', 'AI in Education course'],
  },
  assessment: {
    grounding: 'Assessment is formative because of what teachers and learners do with evidence while learning is still happening.',
    tlf: 'Natural connections are Personalisation and Agency, with Collaboration where peer learning is purposeful.',
    culture: 'Check whether language load, speed, examples, interaction norms or response conventions are distorting the intended evidence of learning.',
    sources: ['AISG Teacher Growth & Reflection Framework', 'AISG Transformative Learning Framework', 'Assessment for Learning at AISG course'],
  },
  data: {
    grounding: 'Use the current state → desired state → gap → action → progress monitoring → adjust cycle. Data should improve a decision, not merely document activity.',
    tlf: 'TLF language is useful when evidence concerns the learner experience, especially strengths, needs, Agency and observable engagement.',
    culture: 'Data is produced in context. Examine language demands, opportunity to learn, cultural familiarity, access and measure validity before attributing a pattern to motivation or ability.',
    sources: ['AISG Data to Action improvement cycle', 'AISG Transformative Learning Framework', 'Data to Action course'],
  },
  udl: {
    grounding: 'UDL is proactive design for learner variability, clear goals and barrier reduction; it is not learning-styles matching, unlimited choice or lowered challenge.',
    tlf: 'UDL aligns most directly with Personalisation and Agency and can create conditions for the other facets.',
    culture: 'Variability exists within as well as between cultural groups. Broaden representation without using identity as a prediction of individual preference.',
    sources: ['CAST Universal Design for Learning Guidelines 3.0', 'AISG Transformative Learning Framework', 'Designing for Learner Variability course'],
  },
  engagement: {
    grounding: 'Engagement for All, Being–Connecting–Doing and the six facets are shared AISG language for designing, noticing and improving learning.',
    tlf: 'Use the framework as a lens, not a checklist. Select a few relevant indicators and look for learner talk, choices, work, relationships and action.',
    culture: 'Cultural Responsiveness runs through the framework in whose identities, languages, histories, perspectives and communities shape learning. Local Guangzhou contexts can be highly authentic.',
    sources: ['AISG Transformative Learning Framework Faculty Field Guide', 'TLF Learning Engagement Indicators', 'Engagement for All course'],
  },
  mtss: {
    grounding: 'MTSS is a proactive, evidence-informed system for matching support intensity to learner response; it is not a label or a substitute for current referral procedures.',
    tlf: 'Natural connections include Personalisation, Agency and belonging because support should increase access and independence.',
    culture: 'Interpret screening and progress evidence through a cultural and linguistic lens. Language development and learning difference are distinct possibilities that can overlap.',
    sources: ['AISG student-support / MTSS development context', 'Multi-Tiered System of Supports course'],
  },
  multilingual: {
    grounding: 'Use an asset-based, language-conscious approach in which classroom teachers and EAL specialists share responsibility for access, participation and language development.',
    tlf: 'Personalisation, Agency, Collaboration and Authenticity are natural connections when linguistic strengths and diverse perspectives contribute to learning.',
    culture: 'Treat English, Mandarin, Cantonese and other home languages as possible resources without requiring a learner to represent a whole nationality, language or culture.',
    sources: ['AISG asset-based EAL direction and WIDA-informed language evidence', 'AISG Transformative Learning Framework', 'Supporting Multilingual Learners course'],
  },
  technology: {
    grounding: 'Begin with the student-learning need, then consider model of use, accessibility and safety, readiness and teaching/curriculum alignment.',
    tlf: 'Technology is not a seventh facet. Ask whether it meaningfully amplifies a learner experience already worth strengthening.',
    culture: 'Practical fitness in Guangzhou includes language accessibility, privacy, data protection, compatibility, network reliability, support capacity and equitable access.',
    sources: ['AISG SMART-T process', 'AISG Transformative Learning Framework', 'Technology for Transformative Learning course'],
  },
  'growth-domain1': {
    grounding: 'Use the AISG Teacher Growth Continuum developmentally, with learner evidence anchoring judgements about learning purpose, inclusive design and assessment for growth.',
    tlf: 'Strong connections include Personalisation, Agency and Authenticity where learner evidence supports them.',
    culture: 'Understanding learners includes language profiles, identities, strengths, cultures, interests and access needs without stereotyping by group membership.',
    sources: ['AISG Teacher Growth Continuum · Domain 1', 'AISG Transformative Learning Framework', 'Teacher Growth Domain 1 course'],
  },
  'growth-domain2': {
    grounding: 'Domain 2 focuses on belonging, voice, equitable routines, autonomy and purposeful use of space, time and tools.',
    tlf: 'Personalisation and Agency are especially visible, with Collaboration strengthening as learners help sustain inclusive conditions.',
    culture: 'Psychological safety does not require every learner to communicate, disagree or participate in one preferred way.',
    sources: ['AISG Teacher Growth Continuum · Domain 2', 'AISG Transformative Learning Framework', 'Teacher Growth Domain 2 course'],
  },
  'growth-domain3': {
    grounding: 'Domain 3 focuses on cognitive demand, inclusive discourse, inquiry and creativity, and authentic application with social impact.',
    tlf: 'Authenticity, Creativity, Collaboration and Taking Action connect naturally, with Agency visible in learner-led inquiry.',
    culture: 'Ask whose knowledge shapes inquiry, whether Guangzhou and southern China are treated as sources of knowledge, and whether learners can challenge a single dominant account.',
    sources: ['AISG Teacher Growth Continuum · Domain 3', 'AISG Transformative Learning Framework', 'Teacher Growth Domain 3 course'],
  },
  'growth-domain4': {
    grounding: 'Domain 4 connects feedback, evidence, learner reflection, professional collaboration and community partnership with student impact and collective capacity.',
    tlf: 'Agency is strengthened when learners use evidence to own growth; Collaboration and Authenticity become relevant where partnerships improve learning.',
    culture: 'Professional impact includes reciprocal partnership and space for multilingual family and community knowledge.',
    sources: ['AISG Teacher Growth Continuum · Domain 4', 'AISG Transformative Learning Framework', 'Teacher Growth Domain 4 course'],
  },
};

export function companionGrounding(course: CourseId) {
  const knowledge = COMPANION_KNOWLEDGE[course];
  return {
    courseTitle: COURSE_BY_ID[course].title,
    courseDescription: COURSE_BY_ID[course].description,
    ...knowledge,
  };
}
