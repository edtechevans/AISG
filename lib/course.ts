export type AnswerOption = { id: string; text: string };

export type Question = {
  id: string;
  courseVersion: string;
  module: string;
  questionNumber: number;
  title: string;
  questionType: 'single_answer' | 'multiple_response' | 'sequence';
  learningObjective: string;
  scenario: string;
  question: string;
  answerOptions: AnswerOption[];
  correctAnswer?: string[];
  correctFeedback?: string;
  incorrectFeedback?: string;
  handbookSection: string;
  handbookPage: number;
  contentTags: string[];
  criticalSafeguarding: boolean;
  status: string;
};

export const courseModules = [
  { id: 'M1', number: 1, title: 'Safeguarding at AISG', eyebrow: 'Know', summary: 'The commitment, shared responsibility and reporting threshold.', learningContent: 'At AISG, the interests and welfare of children come first. Employees do not need proof before raising a concern: reasonable cause is the reporting threshold.' },
  { id: 'M2', number: 2, title: 'Recognising abuse, neglect and student-on-student harm', eyebrow: 'Recognise', summary: 'Patterns, indicators and technology-enabled harm.', learningContent: 'A single sign may have several explanations. Notice patterns without diagnosing, keep an accurate record, and use the safeguarding pathway when there is reasonable cause for concern.' },
  { id: 'M3', number: 3, title: 'Responding to a disclosure', eyebrow: 'Respond', summary: 'Calm listening, honest confidentiality and accurate recording.', learningContent: 'Listen without leading or investigating. Reassure the student, never promise secrecy, record their words accurately and report to the appropriate Student Safeguarding Lead.' },
  { id: 'M4', number: 4, title: 'Reporting and escalating concerns', eyebrow: 'Report', summary: 'Urgency, pathways, confidentiality and personal responsibility.', learningContent: 'Urgency changes the speed of escalation, not the duty to report. Contact the appropriate Student Safeguarding Lead immediately where significant harm may be imminent.' },
  { id: 'M5', number: 5, title: 'Professional boundaries and adult conduct', eyebrow: 'Model', summary: 'Visible practice, Safe Touch, self-reporting and low-level concerns.', learningContent: 'Professional boundaries protect students and adults. Transparency, visibility and early reporting help AISG notice patterns before risk grows.' },
  { id: 'M6', number: 6, title: 'Safeguarding in everyday AISG situations', eyebrow: 'Act', summary: 'Communication, privacy, events and professional judgement.', learningContent: 'Everyday decisions matter: use authorised channels, protect student identity, follow trip procedures and share even a small nagging doubt about adult conduct.' },
] as const;

export const COURSE_VERSION_ID = 'aisg-sg-sy2627';
export const COURSE_VERSION = 'SY2026-27';
export const DEFAULT_PASS_THRESHOLD = 80;
