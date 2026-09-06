export type CourseId = 'elementary' | 'secondary' | 'teams' | 'safeguarding' | 'engagement' | 'udl' | 'data' | 'mtss' | 'ai' | 'technology';

export type CourseCatalogItem = {
  id: CourseId;
  title: string;
  description: string;
  intro?: string;
  category: string;
  designation: 'Required' | 'Foundation' | 'Recommended';
  audience?: string;
  duration: string;
  sectionCount: number;
  checkCount: number;
  storageKey?: string;
  capabilities: readonly string[];
};

export const COURSE_CATALOG: readonly CourseCatalogItem[] = [
  {
    id: 'safeguarding',
    title: 'Safeguarding at AISG',
    description: 'Essential knowledge, responsibilities and professional judgement to help keep students safe at AISG.',
    category: 'Student Safety & Wellbeing',
    designation: 'Required',
    duration: '35–45 minutes',
    sectionCount: 6,
    checkCount: 30,
    capabilities: ['Recognising concerns', 'Responding & reporting', 'Professional boundaries', 'Student safety'],
  },
  {
    id: 'elementary',
    title: 'Elementary Faculty Essentials',
    description: 'A practical guide to the expectations, routines and shared responsibilities that shape Elementary at AISG.',
    intro: 'Elementary at AISG is shaped by shared approaches to learning, relationships, assessment, student support and community life. Work through this course over one or more sittings; your progress is saved so you can return to the same place.',
    category: 'Elementary School',
    designation: 'Required',
    audience: 'Elementary Faculty',
    duration: '90–120 minutes',
    sectionCount: 10,
    checkCount: 50,
    storageKey: 'my-courses-elementary-faculty-progress-sy2627-v2',
    capabilities: ['Elementary practice', 'Assessment & reporting', 'Student support', 'Professional responsibilities'],
  },
  {
    id: 'secondary',
    title: 'Secondary Faculty Essentials',
    description: 'A comprehensive guide to the expectations, routines, professional practices and shared responsibilities that shape Secondary at AISG.',
    intro: 'Secondary at AISG is shaped by more than schedules, courses and procedures. Our shared approach to learning, assessment, student support, professional growth, communication and community life creates a coherent experience across Grades 6–12. Complete this course over one or more sittings; your progress is saved so you can return to the same place.',
    category: 'Secondary School',
    designation: 'Required',
    audience: 'Secondary Faculty',
    duration: '90–120 minutes',
    sectionCount: 10,
    checkCount: 50,
    storageKey: 'my-courses-secondary-faculty-progress-sy2627-v2',
    capabilities: ['Secondary practice', 'Assessment & grading', 'Student support & advisory', 'Academic integrity'],
  },
  {
    id: 'teams',
    title: 'Employee Communication Guidelines',
    description: 'Practical guidance for purposeful, professional and responsible communication at AISG.',
    intro: 'Good communication helps us share information, identify patterns, coordinate support and make better decisions. The challenge is not whether we communicate. It is how we communicate well. Throughout this course, you will consider the purpose, audience, information, evidence, language and confidentiality behind everyday professional communication at AISG. This course is about professional judgement, not simply memorising rules.',
    category: 'Professional Practice',
    designation: 'Required',
    duration: '30–40 minutes',
    sectionCount: 6,
    checkCount: 14,
    storageKey: 'my-courses-communication-progress-v2',
    capabilities: ['Purposeful communication', 'Professional language', 'Confidentiality', 'Teams collaboration'],
  },
  {
    id: 'engagement',
    title: 'Engagement for All: The AISG Learning Framework',
    description: 'A practical gateway to AISG’s shared language for designing, noticing and improving learning experiences.',
    category: 'AISG Learning Framework',
    designation: 'Foundation',
    duration: '20–25 minutes',
    sectionCount: 5,
    checkCount: 10,
    storageKey: 'my-courses-engagement-progress-v1',
    capabilities: ['Learning design', 'Student engagement', 'TLF language', 'Reflection & evidence'],
  },
  {
    id: 'udl',
    title: 'Designing for Learner Variability',
    description: 'Use Universal Design for Learning to anticipate learner variability, reduce barriers and build purposeful learner agency without lowering meaningful challenge.',
    intro: 'Universal Design for Learning (UDL) helps educators design for the range of learners from the beginning rather than retrofit support after barriers appear. Grounded in the CAST Universal Design for Learning Guidelines 3.0, this course explores learner variability, clear goals, barrier analysis, Multiple Means of Engagement, Representation, and Action & Expression, accessibility, identity, belonging and iterative redesign. The aim is not to add more options for their own sake. It is to create flexible, rigorous learning experiences that make worthwhile learning more accessible and learner agency more possible.',
    category: 'Inclusive Learning',
    designation: 'Recommended',
    duration: '45–60 minutes',
    sectionCount: 8,
    checkCount: 18,
    storageKey: 'my-courses-udl-progress-v1',
    capabilities: ['Learner variability', 'Barrier-aware design', 'Multiple means for learning', 'Accessibility & learner agency'],
  },
  {
    id: 'data',
    title: 'Data to Action: Using Evidence to Improve Learning',
    description: 'Use everyday classroom evidence to identify a meaningful learning gap, choose a focused next move, monitor impact and adjust practice.',
    intro: 'Data does not need to mean dashboards, spreadsheets or large tests. For a classroom teacher, useful evidence is often already close at hand: student work, conversations, observations, exit tickets, common assessments, learner voice and broader patterns over time. This short course uses AISG’s Current State → Desired State → Gap → Action → Progress Monitoring → Adjust cycle to help you turn evidence into practical teaching decisions. The emphasis is curiosity over judgement, big data plus small data, and small improvement cycles that make learner experience and outcomes more visible.',
    category: 'Learning & Teaching',
    designation: 'Recommended',
    duration: '20–25 minutes',
    sectionCount: 5,
    checkCount: 10,
    storageKey: 'my-courses-data-to-action-progress-v1',
    capabilities: ['Evidence-informed practice', 'Big & small data', 'Progress monitoring', 'Reflective adjustment'],
  },
  {
    id: 'mtss',
    title: 'Multi-Tiered System of Supports (MTSS)',
    description: 'A systems-focused course on proactive support, evidence-informed decisions and continuous improvement.',
    category: 'Instructional Practice',
    designation: 'Recommended',
    duration: '45–60 minutes',
    sectionCount: 8,
    checkCount: 16,
    storageKey: 'my-courses-mtss-progress-v1',
    capabilities: ['Tiered support', 'Evidence-informed decisions', 'Progress monitoring', 'Equity & fidelity'],
  },
  {
    id: 'technology',
    title: 'Technology for Transformative Learning',
    description: 'Use technology purposefully to amplify the learner experiences at the heart of AISG’s Transformative Learning Framework.',
    intro: 'Technology is most powerful when it amplifies learning rather than simply digitising a task. In this course, use AISG’s Transformative Learning Framework as a design lens to decide when technology can deepen Personalisation, Agency, Authenticity, Creativity, Taking Action and Collaboration—and when the better choice is to keep the technology out of the way.',
    category: 'Digital Practice',
    designation: 'Recommended',
    duration: '30–40 minutes',
    sectionCount: 6,
    checkCount: 18,
    storageKey: 'my-courses-technology-tlf-progress-v1',
    capabilities: ['Purposeful technology', 'TLF amplification', 'Learner agency & access', 'Authentic creation & collaboration'],
  },
  {
    id: 'ai',
    title: 'AI in Education',
    description: 'Build AI literacy and use AI safely, critically and purposefully to strengthen learning through AISG’s Transformative Learning Framework.',
    intro: 'AI literacy is more than knowing how to prompt. This course develops a practical understanding of how AI works and where it can fail, then applies AISG expectations for safety, security, privacy, critical evaluation and human oversight. It finishes by using the Transformative Learning Framework as a lens for purposeful AI use—amplifying Personalisation, Agency, Authenticity, Creativity, Taking Action and Collaboration without outsourcing the thinking students need to own.',
    category: 'Digital Practice',
    designation: 'Recommended',
    duration: '30–40 minutes',
    sectionCount: 7,
    checkCount: 16,
    storageKey: 'my-courses-ai-progress-v1',
    capabilities: ['AI literacy', 'Safety, privacy & security', 'Critical evaluation & human judgement', 'Purposeful AI through the TLF'],
  },
];

export const COURSE_BY_ID = Object.fromEntries(
  COURSE_CATALOG.map((course) => [course.id, course]),
) as Record<CourseId, CourseCatalogItem>;

export function isCourseId(value: string): value is CourseId {
  return COURSE_CATALOG.some((course) => course.id === value);
}

export type CourseCatalogId = CourseId;
