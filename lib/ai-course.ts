export type AiQuestion = {
  id: string;
  section: string;
  question: string;
  scenario: string;
  options: { id: string; text: string }[];
  answer: string;
  correctFeedback: string;
  incorrectFeedback: string;
};

export type AiSection = {
  id: string;
  number: number;
  title: string;
  summary: string;
  learn: string[];
  takeaways: string[];
  questions: AiQuestion[];
};

export const AI_COURSE_VERSION = 'SY2026-27';

export const aiSections: AiSection[] = [
  {
    id: 'privacy-data', number: 1, title: 'Privacy & Data',
    summary: 'Use the minimum necessary information and think before sharing it with another system.',
    learn: ['AI can analyse, organise and generate useful material, but an AI conversation is not automatically private. Before entering information, ask whether it identifies a student, whether the task needs it, and whether identifying detail can be removed or generalised.', 'Removing a name is not always anonymisation. A combination of age, class, learning needs, family circumstances or assessment results may still identify a learner. Share the minimum necessary information, and never paste confidential safeguarding or medical detail into a general-purpose tool.'],
    takeaways: ['Ask whether AI is necessary for the task.', 'Share the minimum information genuinely needed.', 'A name removed does not always mean a person is anonymous.', 'Treat AI prompts as information shared with another system.'],
    questions: [
      { id: 'ai-1', section: 'privacy-data', scenario: 'You want AI to identify patterns in a learner’s support needs using assessment results and teacher notes.', question: 'What is the strongest approach?', options: [{ id: 'a', text: 'Upload everything because more context always improves the output.' }, { id: 'b', text: 'Remove the name, then include all other details because the data is anonymous.' }, { id: 'c', text: 'Consider whether AI is appropriate, share only the minimum necessary information, and remove or generalise identifying details.' }, { id: 'd', text: 'Use a personal account so the information is not connected to school.' }], answer: 'c', correctFeedback: 'Correct. Start by asking whether the task needs student information at all, then minimise and de-identify what is shared. A combination of details can still identify a learner.', incorrectFeedback: 'The strongest response is to consider necessity first, then share only minimum necessary information and remove or generalise identifying details. A removed name does not automatically make information anonymous.' },
      { id: 'ai-2', section: 'privacy-data', scenario: 'You are preparing a lesson and want a quick example for students.', question: 'Which input is least appropriate for a general-purpose AI system?', options: [{ id: 'a', text: 'Create five Grade 4 fraction examples involving equivalent fractions.' }, { id: 'b', text: 'An anonymised paragraph written by you for a generic lesson example.' }, { id: 'c', text: 'Detailed safeguarding, medical and family information that could identify a student.' }, { id: 'd', text: 'A generic vocabulary list for a new unit.' }], answer: 'c', correctFeedback: 'Correct. Sensitive, identifiable student information belongs in appropriate professional systems, not a general-purpose AI prompt.', incorrectFeedback: 'Detailed safeguarding, medical and family information is sensitive and potentially identifiable. Keep it within the systems and processes designed to protect it.' },
    ],
  },
  {
    id: 'human-feedback', number: 2, title: 'Human Judgement & Feedback',
    summary: 'AI can assist professional work; educators remain responsible for decisions and relationships.',
    learn: ['AI can draft, summarise, analyse and suggest feedback. It cannot know the whole learner, the relationship, the learning intention or the context in a classroom. Use a simple rule: AI informs; the human decides.', 'Generated feedback is not automatically good feedback. Check it against the student’s actual work and learning goals, adapt the language and decide what is appropriate before anything reaches the learner.'],
    takeaways: ['Use AI output as a draft or source of ideas.', 'Check accuracy, context and alignment with the learning intention.', 'The educator remains responsible for what reaches students.', 'Efficiency does not remove professional judgement.'],
    questions: [
      { id: 'ai-3', section: 'human-feedback', scenario: 'AI produces detailed, personalised comments on 25 essays while you are under time pressure.', question: 'What should you do next?', options: [{ id: 'a', text: 'Send them because checking would remove most of the efficiency.' }, { id: 'b', text: 'Check only comments for students far above or below expectations.' }, { id: 'c', text: 'Treat them as drafts, review them against each student’s work and learning goals, and adapt them.' }, { id: 'd', text: 'Avoid AI feedback entirely because teachers must write every word from scratch.' }], answer: 'c', correctFeedback: 'Correct. AI can help formulate feedback, but detailed wording does not guarantee accuracy or educational fit. The teacher remains responsible.', incorrectFeedback: 'Personalised tone is not evidence that feedback is accurate or aligned. Use the output as a draft and review it against the learner and the learning intention before sharing it.' },
      { id: 'ai-4', section: 'human-feedback', scenario: 'AI flags five learners as needing intervention, but one has recently improved in class.', question: 'What is the strongest next step?', options: [{ id: 'a', text: 'Follow the AI recommendation because it processed more data.' }, { id: 'b', text: 'Remove that learner and follow the rest.' }, { id: 'c', text: 'Triangulate the analysis with classroom evidence, professional judgement and other relevant information.' }, { id: 'd', text: 'Use another AI system and follow the recommendation if both agree.' }], answer: 'c', correctFeedback: 'Correct. Pattern recognition is one source of evidence; decisions require context and professional judgement.', incorrectFeedback: 'Agreement between AI systems would not replace human judgement. Check the pattern against classroom evidence, current context and what you know of the learner.' },
    ],
  },
  {
    id: 'accuracy-bias', number: 3, title: 'Accuracy, Bias & Critical Evaluation',
    summary: 'Convincing language is not proof. Question outputs, verify claims and look for missing perspectives.',
    learn: ['AI can be fast, articulate and wrong. It may fabricate references, repeat outdated information or present an uncertain claim with confidence. Use generate → question → verify, especially for information students will rely upon.', 'AI output is not culturally neutral. Look for stereotypes, dominant perspectives, assumptions and missing voices. A polished resource still needs an educator’s critical review.'],
    takeaways: ['Verify important claims and references independently.', 'Do not ask the same AI to certify its own accuracy.', 'Check whose perspectives are represented and whose are missing.', 'Polished language is not evidence of truth.'],
    questions: [
      { id: 'ai-5', section: 'accuracy-bias', scenario: 'AI creates an excellent-looking resource with several academic references for tomorrow’s lesson.', question: 'What should happen before using it?', options: [{ id: 'a', text: 'Use it because the references make errors unlikely.' }, { id: 'b', text: 'Check important factual claims and verify the references independently.' }, { id: 'c', text: 'Ask the AI to check itself and use it if it says it is accurate.' }, { id: 'd', text: 'Use it unchanged but tell students AI generated it.' }], answer: 'b', correctFeedback: 'Correct. Verify important claims and sources independently. The quality of the prose does not establish truth.', incorrectFeedback: 'The strongest response is independent verification. AI can invent citations, and asking the same system to review itself is not an independent check.' },
      { id: 'ai-6', section: 'accuracy-bias', scenario: 'AI generates examples of a “typical successful family” that all share one cultural background and structure.', question: 'What is the strongest response?', options: [{ id: 'a', text: 'Use them because a large model has seen more perspectives than one teacher.' }, { id: 'b', text: 'Remove one obviously stereotypical example and keep the rest.' }, { id: 'c', text: 'Redesign the examples after considering representation, assumptions, missing perspectives and your learners.' }, { id: 'd', text: 'Avoid AI for every activity involving identity or culture.' }], answer: 'c', correctFeedback: 'Correct. Critically review representation and context, then redesign the resource so it serves the learners in front of you.', incorrectFeedback: 'AI is not automatically objective or culturally neutral. Removing one example is not enough; review the whole set for assumptions, omissions and relevance.' },
    ],
  },
  {
    id: 'authentic-tools', number: 4, title: 'Authentic Learning & Responsible Tool Use',
    summary: 'Design for evidence of learning and understand a tool before directing students to use it.',
    learn: ['If AI can complete an existing task in seconds, the key question is what evidence would convince you that the learner understands. Use drafts, process evidence, explanation, discussion, conferences or authentic application rather than relying on detection alone.', 'Before introducing a student-facing tool, understand what data it collects, account and age requirements, how data may be stored or used, and whether the educational benefit justifies the risk.'],
    takeaways: ['Make student thinking visible.', 'Detection alone does not repair weak assessment design.', 'Understand data, accounts and age requirements before introducing a tool.', 'Educational usefulness does not automatically make a tool appropriate.'],
    questions: [
      { id: 'ai-7', section: 'authentic-tools', scenario: 'Students can generate an excellent final response to homework that was meant to assess their reasoning.', question: 'What is the strongest response?', options: [{ id: 'a', text: 'Ban AI and leave the task unchanged.' }, { id: 'b', text: 'Keep the task unchanged and add AI detection.' }, { id: 'c', text: 'Clarify appropriate use and redesign the assessment so students provide authentic evidence of thinking and process.' }, { id: 'd', text: 'Stop using homework for assessment.' }], answer: 'c', correctFeedback: 'Correct. Redesign for convincing evidence of learning, including process, explanation and application. Detection alone does not solve the underlying design problem.', incorrectFeedback: 'The stronger response is to clarify use and redesign the task around authentic evidence of thinking. A ban or detector does not by itself make the assessment more valid.' },
      { id: 'ai-8', section: 'authentic-tools', scenario: 'A promising platform requires student accounts, personal information and has unclear age requirements.', question: 'What is the strongest first step?', options: [{ id: 'a', text: 'Pilot it with a small group because limited use removes the risk.' }, { id: 'b', text: 'Ask students to use personal accounts.' }, { id: 'c', text: 'Understand collection, storage, age requirements and educational purpose before deciding.' }, { id: 'd', text: 'Explain the uncertainty and let each student decide.' }], answer: 'c', correctFeedback: 'Correct. Understand the implications before directing learners to use a service, then decide whether the benefit justifies introducing it.', incorrectFeedback: 'A small pilot or student choice does not remove the responsibility to understand the service. Check data, age and purpose first.' },
    ],
  },
  {
    id: 'purposeful-thinking', number: 5, title: 'Preserving Thinking & Purposeful AI',
    summary: 'Use AI to remove barriers without automatically removing the learning.',
    learn: ['AI can translate, explain, brainstorm, coach and support accessibility. The right question is: what thinking do I want the learner to do? Sometimes completing a task with AI is appropriate; sometimes the task itself contains the thinking students need to practise.', 'Start with the learner, the learning goal and the problem being solved. AI is one possible tool, not the learning objective. Learning first; AI second.'],
    takeaways: ['Name the thinking the learner must own.', 'Use AI to scaffold, question and coach where appropriate.', 'Do not outsource the intellectual work the task is designed to practise.', 'Start with the learning goal before choosing a tool.'],
    questions: [
      { id: 'ai-9', section: 'purposeful-thinking', scenario: 'A learner is stuck beginning an analytical argument. The intention is for them to construct and justify their own position.', question: 'Which use best preserves the learning intention?', options: [{ id: 'a', text: 'Ask AI to produce an exemplar argument for the learner to adapt.' }, { id: 'b', text: 'Use AI as a thinking partner to ask questions and organise the learner’s own ideas while the learner constructs the argument.' }, { id: 'c', text: 'Ask AI for a first draft and have the learner improve the language.' }, { id: 'd', text: 'Avoid AI because productive struggle requires no technological support.' }], answer: 'b', correctFeedback: 'Correct. AI can scaffold thinking while the learner retains ownership of constructing and justifying the argument.', incorrectFeedback: 'The key question is what thinking remains with the learner. Generating the argument or draft would outsource the intended intellectual work.' },
      { id: 'ai-10', section: 'purposeful-thinking', scenario: 'You find an impressive AI feature that could generate personalised activities and want to introduce it tomorrow.', question: 'What should your first question be?', options: [{ id: 'a', text: 'How much preparation time will this save?' }, { id: 'b', text: 'Will students find it engaging?' }, { id: 'c', text: 'What learning problem am I trying to solve, and how would this improve learning?' }, { id: 'd', text: 'How can I ensure every student uses it consistently?' }], answer: 'c', correctFeedback: 'Correct. Begin with the learner, learning goal and problem. Sometimes AI is the right tool; sometimes another strategy—or no technology—is better.', incorrectFeedback: 'Start with purpose, not novelty or efficiency. Identify the learning problem and intended benefit before selecting a tool.' },
    ],
  },
];

export const aiQuestions = aiSections.flatMap((section) => section.questions);
