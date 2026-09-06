export type AiQuestion = {
  id: string;
  section: string;
  courseVersion?: string;
  module?: string;
  questionNumber?: number;
  title?: string;
  questionType?: 'single_choice';
  learningObjective?: string;
  question: string;
  scenario: string;
  options: { id: string; text: string }[];
  answer: string;
  correctAnswer?: string[];
  correctFeedback: string;
  incorrectFeedback: string;
  assessmentLevel?: string;
  handbookSection?: string;
  handbookPage?: string;
  contentTags?: string[];
  contentOwner?: string;
  status?: string;
  criticalSafeguarding?: boolean;
  reviewStatus?: string;
  optionFeedback?: Record<string, string>;
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

export const AI_COURSE_VERSION = 'SY2026-27 v2';

const shared = {
  courseVersion: AI_COURSE_VERSION,
  contentOwner: 'Learning & Teaching',
  reviewStatus: 'draft_for_learning_and_teaching_review',
} as const;

export const aiSections: AiSection[] = [
  {
    id: 'ai-literacy',
    number: 1,
    title: 'AI Literacy: understand the system before using it',
    summary: 'Build a practical working understanding of AI and Generative AI so confident use does not become uncritical use.',
    learn: [
      'AISG’s AI Policy describes Artificial Intelligence as computer systems performing processes associated with human intelligence, including learning, reasoning, problem-solving, perception and decision-making. Generative AI is a form of AI that creates new content from patterns learned from existing information. In education, these systems can support analysis, explanation, practice, feedback and creation—but they do not understand a learner, classroom or purpose in the same way an educator does.',
      'AI literacy means understanding both capability and limitation. A fluent response can still be inaccurate. A personalised response can still be poorly matched to a learner. A confident recommendation can still reflect bias or incomplete information. Treat AI output as generated material to interpret, question and verify rather than as an authority that has independently established truth.',
      'A useful mental model is: PROMPT → GENERATE → QUESTION → VERIFY → DECIDE. The human remains responsible for the purpose, the information shared, the interpretation of the output and the professional decision that follows.',
    ],
    takeaways: [
      'AI can generate useful outputs without knowing whether they are true or educationally appropriate.',
      'Fluency and confidence are not evidence of accuracy.',
      'AI literacy includes capability, limitation, questioning and verification.',
      'The human remains responsible for the decision.',
    ],
    questions: [
      {
        ...shared,
        id: 'ai-1', section: 'ai-literacy', questionNumber: 1, assessmentLevel: 'Foundation',
        learningObjective: 'Distinguish generative capability from human understanding or authority.',
        scenario: 'An AI assistant produces a polished explanation of a complex topic in seconds. The wording is confident and includes examples.',
        question: 'What is the most important AI-literacy principle to remember?',
        options: [
          { id: 'a', text: 'A confident explanation is usually reliable because the model has seen a large amount of information.' },
          { id: 'b', text: 'The system generates a plausible response from learned patterns; important claims still need human judgement and verification.' },
          { id: 'c', text: 'The response should be treated as correct unless a student can identify an error.' },
          { id: 'd', text: 'Generative AI is mainly a search engine, so the answer can be assumed to come directly from a source.' },
        ],
        answer: 'b',
        correctFeedback: 'Correct. Generative AI can produce highly plausible language without independently establishing truth. The educator still interprets, questions and verifies what matters.',
        incorrectFeedback: 'Polished language and scale do not turn generated output into verified knowledge. Treat the output as material to evaluate, not as an authority.',
        contentTags: ['AI Literacy', 'Generative AI', 'Human Judgement'],
      },
      {
        ...shared,
        id: 'ai-2', section: 'ai-literacy', questionNumber: 2, assessmentLevel: 'Foundation',
        learningObjective: 'Apply a practical AI-literacy cycle to everyday use.',
        scenario: 'You ask AI to summarise a long professional article before a team meeting. The summary looks sensible, but you have not checked it against the original.',
        question: 'What is the strongest next step?',
        options: [
          { id: 'a', text: 'Share the summary because summarising is lower risk than generating new ideas.' },
          { id: 'b', text: 'Ask the same AI whether its summary is accurate, then use it if it says yes.' },
          { id: 'c', text: 'Use the summary as a draft aid, then compare important points with the original source before relying on it.' },
          { id: 'd', text: 'Avoid AI summarisation because educators should read every source without technological support.' },
        ],
        answer: 'c',
        correctFeedback: 'Correct. AI can increase efficiency, but the user still checks the generated interpretation against the source when accuracy matters.',
        incorrectFeedback: 'AI can support the task without replacing verification. Asking the same system to certify itself is not an independent check.',
        contentTags: ['AI Literacy', 'Verification', 'Professional Judgement'],
      },
    ],
  },
  {
    id: 'safe-secure-private',
    number: 2,
    title: 'Safe, Secure & Private Use',
    summary: 'Protect people and information before considering convenience or output quality.',
    learn: [
      'AISG’s AI Policy places a high priority on student safety, privacy and security. Faculty are expected to protect student data and confidentiality when using AI platforms, address safety or security concerns, and help students develop safe practices when interacting with AI systems. An AI prompt is information shared with another system, so data decisions belong at the beginning of the workflow, not after an output has been generated.',
      'Use the minimum necessary information. Removing a name is not always enough: combinations of age, class, learning needs, assessment results, family circumstances or other details may still identify a learner. Sensitive safeguarding, medical or confidential information should remain within the appropriate protected school systems and processes.',
      'Before directing students to use an AI service, understand the educational purpose, what data the service collects, whether accounts are required, applicable age expectations and how information may be stored or used. Educational usefulness does not automatically make a platform appropriate for learners.',
    ],
    takeaways: [
      'Safety, security and privacy come before convenience.',
      'Share the minimum information genuinely necessary.',
      'Removing a name does not automatically remove identifiability.',
      'Understand accounts, age, data and purpose before introducing a student-facing service.',
    ],
    questions: [
      {
        ...shared,
        id: 'ai-3', section: 'safe-secure-private', questionNumber: 3, assessmentLevel: 'Application',
        learningObjective: 'Apply data-minimisation and confidentiality principles to AI use.',
        scenario: 'You want AI to help identify patterns in a learner’s support needs using assessment results and teacher notes.',
        question: 'What is the strongest approach?',
        options: [
          { id: 'a', text: 'Upload everything because more context always improves the output.' },
          { id: 'b', text: 'Remove the learner’s name, then include all remaining details because the information is anonymous.' },
          { id: 'c', text: 'First decide whether AI is appropriate, then share only the minimum necessary information and remove or generalise identifying details.' },
          { id: 'd', text: 'Use a personal AI account so the information is separate from school systems.' },
        ],
        answer: 'c',
        correctFeedback: 'Correct. Necessity and minimisation come first. A combination of apparently anonymous details can still identify a learner.',
        incorrectFeedback: 'The strongest practice is to consider whether AI is needed, minimise the information shared and protect identifiable or confidential student data.',
        contentTags: ['Privacy', 'Data Minimisation', 'Safety & Security'],
      },
      {
        ...shared,
        id: 'ai-4', section: 'safe-secure-private', questionNumber: 4, assessmentLevel: 'Application',
        learningObjective: 'Evaluate a student-facing AI tool before classroom adoption.',
        scenario: 'A promising AI platform could support language practice, but it requires student accounts, collects personal information and has unclear age expectations.',
        question: 'What should happen first?',
        options: [
          { id: 'a', text: 'Pilot it with a small group because limited use removes most risk.' },
          { id: 'b', text: 'Ask students to use personal accounts so the school is not responsible for the data.' },
          { id: 'c', text: 'Clarify the educational purpose and understand the service’s data, account, age and storage implications before deciding.' },
          { id: 'd', text: 'Let individual students decide whether the risk feels acceptable.' },
        ],
        answer: 'c',
        correctFeedback: 'Correct. The educational benefit must be considered alongside safety, privacy, account and age implications before students are directed to use a service.',
        incorrectFeedback: 'A small pilot, personal account or student choice does not remove the school’s professional responsibility to understand the service before use.',
        contentTags: ['Safety & Security', 'Student Accounts', 'Purposeful Use'],
      },
    ],
  },
  {
    id: 'critical-evaluation',
    number: 3,
    title: 'Critical AI Literacy: accuracy, bias & verification',
    summary: 'Question outputs, verify important claims and look for assumptions, stereotypes and missing perspectives.',
    learn: [
      'AISG’s AI Policy expects students and faculty to critically evaluate AI-generated information, recognise limitations and potential bias, and keep ethical use central. AI can fabricate references, reproduce outdated information, simplify complexity or present uncertainty with confidence. Use GENERATE → QUESTION → VERIFY rather than allowing fluent output to bypass critical thinking.',
      'Bias is not limited to obviously offensive content. Ask whose perspectives are represented, whose experiences are missing, what assumptions are embedded, and whether examples make sense for the learners and communities involved. This connects directly with AISG’s Transformative Learning Framework: Agency asks learners to explore diverse perspectives, Authenticity asks them to learn through cultures and lived experiences, and Collaboration asks them to value and learn from difference.',
      'AI literacy also includes respecting intellectual property and being transparent about how AI has contributed to work when acknowledgement is expected. The goal is not suspicion of every output; it is informed, critical participation.',
    ],
    takeaways: [
      'Verify important claims and references independently.',
      'Look for assumptions, omissions and dominant perspectives.',
      'AI output is not culturally neutral simply because it sounds neutral.',
      'Critical use is part of responsible use.',
    ],
    questions: [
      {
        ...shared,
        id: 'ai-5', section: 'critical-evaluation', questionNumber: 5, assessmentLevel: 'Application',
        learningObjective: 'Verify AI-generated claims and references independently.',
        scenario: 'AI creates an excellent-looking resource with several academic references for tomorrow’s lesson.',
        question: 'What should happen before using it?',
        options: [
          { id: 'a', text: 'Use it because references make factual errors unlikely.' },
          { id: 'b', text: 'Check important factual claims and verify the references independently.' },
          { id: 'c', text: 'Ask the AI to check itself and use the resource if it says the citations are accurate.' },
          { id: 'd', text: 'Use it unchanged but tell students that AI generated it.' },
        ],
        answer: 'b',
        correctFeedback: 'Correct. Important claims and sources should be independently verified. A polished resource can still contain invented or inaccurate information.',
        incorrectFeedback: 'Disclosure does not replace verification, and the same system checking itself is not independent confirmation.',
        contentTags: ['Accuracy', 'Verification', 'AI Literacy'],
      },
      {
        ...shared,
        id: 'ai-6', section: 'critical-evaluation', questionNumber: 6, assessmentLevel: 'Analysis',
        learningObjective: 'Identify and respond to bias and missing perspectives in generated content.',
        scenario: 'AI generates examples of a “typical successful family” that all share one cultural background, language and family structure.',
        question: 'What is the strongest response?',
        options: [
          { id: 'a', text: 'Use the examples because a large model has encountered more perspectives than one educator.' },
          { id: 'b', text: 'Remove the most obvious stereotype and keep the rest.' },
          { id: 'c', text: 'Redesign the set after considering representation, assumptions, missing perspectives and the learners in front of you.' },
          { id: 'd', text: 'Avoid AI for every activity involving identity or culture.' },
        ],
        answer: 'c',
        correctFeedback: 'Correct. Critical AI literacy means examining the whole representation, not merely removing one obvious problem. Diverse perspectives should meaningfully shape the learning.',
        incorrectFeedback: 'AI is not automatically culturally neutral. Review assumptions, omissions and relevance across the whole resource rather than treating one edit as sufficient.',
        contentTags: ['Bias', 'Representation', 'Diverse Perspectives', 'TLF'],
      },
    ],
  },
  {
    id: 'human-judgement',
    number: 4,
    title: 'Human Judgement, Feedback & Authentic Learning',
    summary: 'Keep people, relationships and valid evidence of learning at the centre of AI-supported practice.',
    learn: [
      'AISG’s AI Policy explicitly keeps human oversight central. AI can draft, summarise, analyse and suggest, but educators remain responsible for interpreting results in the context of educational objectives. A useful rule is: AI INFORMS → HUMAN DECIDES.',
      'Generated feedback is not automatically good feedback. Check it against the learner’s actual work, the intended learning and what you know from the classroom. Adapt the language and decide what should reach the student. Efficiency does not remove professional judgement or relational responsibility.',
      'Assessment design matters as AI becomes more capable. If a tool can complete a task in seconds, ask what evidence would genuinely demonstrate the learner’s thinking. Process evidence, explanation, reflection, conferencing, authentic application, performance and iterative drafts can make learning more visible without reducing the response to detection or prohibition.',
    ],
    takeaways: [
      'AI informs; the human decides.',
      'Generated feedback is a draft, not a professional decision.',
      'Make learner thinking visible in assessment.',
      'Detection alone does not strengthen the validity of a weak task.',
    ],
    questions: [
      {
        ...shared,
        id: 'ai-7', section: 'human-judgement', questionNumber: 7, assessmentLevel: 'Application',
        learningObjective: 'Maintain human oversight when AI supports feedback or decisions.',
        scenario: 'AI produces detailed, personalised comments on 25 essays while you are under time pressure.',
        question: 'What should you do next?',
        options: [
          { id: 'a', text: 'Send them because checking every comment removes the efficiency benefit.' },
          { id: 'b', text: 'Check only the comments for students far above or below expectations.' },
          { id: 'c', text: 'Treat the comments as drafts, review them against each student’s work and learning goals, then adapt them.' },
          { id: 'd', text: 'Avoid AI feedback completely because teachers must write every word from scratch.' },
        ],
        answer: 'c',
        correctFeedback: 'Correct. AI can assist the drafting process, but the educator remains responsible for accuracy, alignment, tone and what reaches the learner.',
        incorrectFeedback: 'Efficiency is useful, but it does not remove human oversight. The teacher remains accountable for the feedback shared with students.',
        contentTags: ['Human Oversight', 'Feedback', 'Professional Judgement'],
      },
      {
        ...shared,
        id: 'ai-8', section: 'human-judgement', questionNumber: 8, assessmentLevel: 'Analysis',
        learningObjective: 'Redesign assessment so student thinking remains visible in an AI-enabled context.',
        scenario: 'Students can generate an excellent final response to homework that was intended to assess their reasoning.',
        question: 'What is the strongest response?',
        options: [
          { id: 'a', text: 'Ban AI and leave the task unchanged.' },
          { id: 'b', text: 'Keep the task unchanged and add AI detection.' },
          { id: 'c', text: 'Clarify appropriate AI use and redesign the task so students provide authentic evidence of thinking, process and application.' },
          { id: 'd', text: 'Stop using homework for assessment.' },
        ],
        answer: 'c',
        correctFeedback: 'Correct. The design should produce convincing evidence of learning. Process, explanation and authentic application are stronger responses than relying on detection alone.',
        incorrectFeedback: 'A ban or detector does not by itself make the assessment more valid. Redesign around evidence of what the learner understands and can do.',
        contentTags: ['Authentic Learning', 'Assessment', 'Human Judgement'],
      },
    ],
  },
  {
    id: 'purposeful-ai',
    number: 5,
    title: 'Purposeful AI: learning first, AI second',
    summary: 'Use AI to remove barriers or deepen learning without automatically removing the thinking students need to own.',
    learn: [
      'Purposeful use starts with the learner, the intended learning and the problem being solved. AI is one possible tool—not the learning objective. Ask: What thinking must the learner own? What barrier could AI reduce? What becomes more accessible, more meaningful or newly possible? If AI completes the intellectual work the task was designed to develop, convenience may have displaced learning.',
      'AISG’s Transformative Learning Framework gives us a shared language for that decision. Engagement for All is organised through Being, Connecting and Doing, with six facets: Personalisation, Agency, Authenticity, Creativity, Taking Action and Collaboration. The framework should be used as a lens, not a checklist: select the few indicators relevant to the intended experience, notice what students are experiencing and doing, use evidence to reflect, then make the next design move.',
      'This means purposeful AI use is not “use AI in every facet.” Sometimes the strongest design is to use AI as a scaffold, coach, translator, simulator or creative partner. Sometimes the strongest design is to keep AI out so students can practise independent reasoning, productive struggle, interpersonal interaction or another capability that needs to remain human-owned.',
    ],
    takeaways: [
      'Learning first; AI second.',
      'Name the thinking the learner must own.',
      'Use the TLF as a lens, not a checklist.',
      'The purposeful choice can be to use AI, limit AI or not use AI.',
    ],
    questions: [
      {
        ...shared,
        id: 'ai-9', section: 'purposeful-ai', questionNumber: 9, assessmentLevel: 'Professional Judgement',
        learningObjective: 'Choose AI support that preserves the intended student thinking.',
        scenario: 'A learner is stuck beginning an analytical argument. The intention is for the learner to construct and justify their own position.',
        question: 'Which use best preserves the learning intention?',
        options: [
          { id: 'a', text: 'Ask AI to produce an exemplar argument for the learner to adapt.' },
          { id: 'b', text: 'Use AI as a thinking partner that asks questions and helps organise the learner’s own ideas while the learner constructs the argument.' },
          { id: 'c', text: 'Ask AI for a first draft and have the learner improve the wording.' },
          { id: 'd', text: 'Avoid AI because productive struggle requires no technological support.' },
        ],
        answer: 'b',
        correctFeedback: 'Correct. AI can scaffold the process while the learner retains ownership of constructing and justifying the argument.',
        incorrectFeedback: 'The key question is what thinking remains with the learner. Generating the argument or draft would outsource much of the intended intellectual work.',
        contentTags: ['Purposeful AI', 'Preserving Thinking', 'Agency'],
      },
      {
        ...shared,
        id: 'ai-10', section: 'purposeful-ai', questionNumber: 10, assessmentLevel: 'Professional Judgement',
        learningObjective: 'Use the TLF to judge whether an AI feature meaningfully amplifies learning.',
        scenario: 'You find an AI feature that instantly generates personalised practice. It looks impressive, but it would also complete much of the reasoning your unit is designed to develop.',
        question: 'Which professional decision should come first?',
        options: [
          { id: 'a', text: 'Adopt it if it saves enough teacher preparation time.' },
          { id: 'b', text: 'Use it in every class so students have an equal digital experience.' },
          { id: 'c', text: 'Clarify the intended learning, the thinking students must own and the relevant TLF learner experience, then decide whether AI adds meaningful value.' },
          { id: 'd', text: 'Ask students whether they enjoy the feature and let that determine adoption.' },
        ],
        answer: 'c',
        correctFeedback: 'Correct. Purpose comes before novelty or efficiency. Start with intended learning and the learner experience, then judge whether AI genuinely strengthens it.',
        incorrectFeedback: 'A useful AI feature is not automatically a good learning design. The TLF helps keep attention on what students should experience, decide, create, connect and become.',
        contentTags: ['Purposeful AI', 'TLF Lens', 'Learning Design'],
      },
    ],
  },
  {
    id: 'tlf-being-connecting',
    number: 6,
    title: 'Amplify Being & Connecting with AI',
    summary: 'Use AI purposefully to strengthen Personalisation, Agency, Authenticity and Creativity without handing the learning over to the tool.',
    learn: [
      'BEING brings together Personalisation and Agency. AI may support Personalisation by providing multilingual or multimodal access, alternative explanations, adaptive scaffolds or multiple ways to rehearse and express understanding. This aligns with learner experiences that respond to linguistic, cognitive, social-emotional and cultural strengths and needs. But a personalised output is not automatically Personalisation: the learner still needs to be known, included and supported as a whole person.',
      'AI may strengthen Agency when students make meaningful decisions about what they learn, how they learn and how they demonstrate understanding; reflect on their thinking and progress; or use their voice to shape learning. Agency is weakened when AI makes the important decisions for the learner. The question is not “Did the student choose an AI tool?” but “Did the learner retain meaningful ownership?”',
      'CONNECTING brings together Authenticity and Creativity. AI can help learners investigate authentic questions, analyse perspectives, simulate roles, communicate with real audiences, prototype ideas, generate possibilities and experiment. Yet Authenticity requires meaningful contexts, purposes and audiences, while Creativity requires original ideas, experimentation and thoughtful risk. An AI-generated product is not evidence of either facet unless the learner is genuinely in the creative and decision-making process.',
    ],
    takeaways: [
      'Personalisation: use AI to remove barriers and widen access or expression.',
      'Agency: keep meaningful decisions and reflection with the learner.',
      'Authenticity: connect AI-supported work to real questions, roles, audiences and purposes.',
      'Creativity: use AI to expand possibilities without replacing original thinking and experimentation.',
    ],
    questions: [
      {
        ...shared,
        id: 'ai-11', section: 'tlf-being-connecting', questionNumber: 11, assessmentLevel: 'Analysis',
        learningObjective: 'Connect purposeful AI use to Personalisation without confusing it with mere automation.',
        scenario: 'A multilingual learner understands a science concept but struggles to access a dense English explanation. The teacher uses AI to generate a simpler explanation and a bilingual glossary, then checks both before the learner uses them.',
        question: 'Which TLF facet is most directly being amplified?',
        options: [
          { id: 'a', text: 'Personalisation, because the support responds to linguistic strengths and needs and widens access.' },
          { id: 'b', text: 'Agency, because any individualised AI output gives the learner ownership.' },
          { id: 'c', text: 'Creativity, because AI generated new wording.' },
          { id: 'd', text: 'Taking Action, because the learner used a digital tool.' },
        ],
        answer: 'a',
        correctFeedback: 'Correct. The strongest evidence is learning designed to respond to the learner’s linguistic needs and provide another pathway into understanding—central to Personalisation.',
        incorrectFeedback: 'Individualised output is not automatically Agency, Creativity or Action. The clearest learner experience here is increased access in response to linguistic need.',
        contentTags: ['TLF', 'Personalisation', 'Access', 'AI Scaffolding'],
      },
      {
        ...shared,
        id: 'ai-12', section: 'tlf-being-connecting', questionNumber: 12, assessmentLevel: 'Professional Judgement',
        learningObjective: 'Distinguish meaningful learner agency from superficial AI choice.',
        scenario: 'Students may choose one of three AI tools to generate a presentation. The tools make most content and design decisions; students mainly select a theme and submit the result.',
        question: 'What is the strongest judgement about Agency?',
        options: [
          { id: 'a', text: 'Agency is strong because students choose which AI tool to use.' },
          { id: 'b', text: 'Agency is limited because the choices do not meaningfully shape the learning, reasoning or demonstration of understanding.' },
          { id: 'c', text: 'Agency is guaranteed because AI provides personalisation.' },
          { id: 'd', text: 'Agency cannot exist when AI is involved.' },
        ],
        answer: 'b',
        correctFeedback: 'Correct. TLF Agency is about meaningful decisions, ownership and reflection. Tool selection alone is not enough if the system makes the decisions that matter for learning.',
        incorrectFeedback: 'Choice only becomes Agency when it meaningfully shapes learning. AI can support Agency, but it can also reduce it if it takes over important decisions.',
        contentTags: ['TLF', 'Agency', 'Learner Ownership'],
      },
      {
        ...shared,
        id: 'ai-13', section: 'tlf-being-connecting', questionNumber: 13, assessmentLevel: 'Professional Judgement',
        learningObjective: 'Use AI to strengthen Authenticity and Creativity while preserving learner authorship.',
        scenario: 'Students investigate a local sustainability challenge. They use AI to generate possible questions, test counterarguments and prototype communication ideas, then conduct their own research and create recommendations for a real community audience.',
        question: 'Why is this a stronger use of AI than simply asking it to create the final product?',
        options: [
          { id: 'a', text: 'The AI is used mainly to make the final product look more professional.' },
          { id: 'b', text: 'AI expands inquiry and experimentation while students retain the authentic purpose, research, judgement and original contribution.' },
          { id: 'c', text: 'Any project connected to the community automatically demonstrates all six TLF facets.' },
          { id: 'd', text: 'Using several AI prompts guarantees deeper creativity.' },
        ],
        answer: 'b',
        correctFeedback: 'Correct. The real audience and authentic challenge strengthen Authenticity, while AI supports possibilities and experimentation without replacing the students’ research, judgement and creation.',
        incorrectFeedback: 'The strength comes from the learner experience—not the number of prompts or visual polish. Students remain responsible for inquiry, judgement, original contribution and authentic purpose.',
        contentTags: ['TLF', 'Authenticity', 'Creativity', 'Authentic Audience'],
      },
    ],
  },
  {
    id: 'tlf-doing-evidence',
    number: 7,
    title: 'Amplify Doing: Taking Action, Collaboration & evidence',
    summary: 'Use AI to support ethical contribution and collective learning, then look for evidence that the learner experience actually improved.',
    learn: [
      'DOING brings together Taking Action and Collaboration. AI may support Taking Action when students apply learning to authentic opportunities and challenges, create meaningful products or solutions for authentic audiences, strengthen communities or recognise their capacity to create change. The tool should increase the learners’ ability to contribute—not become the actor in their place.',
      'AI may support Collaboration by helping multilingual groups communicate, compare perspectives, organise shared work, question assumptions or prepare for discussion. The TLF specifically values purposeful collaboration, diverse perspectives and responsible, ethical and purposeful use of technology to strengthen collective learning. AI should not become a shortcut that lets one student generate the group’s thinking while others become spectators.',
      'Finish where the TLF finishes: with evidence and the next design move. Select the few indicators relevant to the learning, then notice student talk, choices, work, relationships and action. Ask what students are experiencing, doing, connecting and becoming. The measure of purposeful AI use is not prompt count, minutes online or novelty; it is whether the learner experience has become meaningfully stronger for more students.',
    ],
    takeaways: [
      'Taking Action: AI should support meaningful contribution, not act in place of students.',
      'Collaboration: use AI responsibly to strengthen shared thinking, communication and diverse perspectives.',
      'Look for evidence in student talk, choices, work, relationships and action.',
      'Use evidence to decide the next design move.',
    ],
    questions: [
      {
        ...shared,
        id: 'ai-14', section: 'tlf-doing-evidence', questionNumber: 14, assessmentLevel: 'Professional Judgement',
        learningObjective: 'Use AI to strengthen collaboration rather than replace collective thinking.',
        scenario: 'A multilingual group is preparing a shared recommendation. They use AI to translate key ideas, identify where their arguments differ and generate questions for discussion. The students then debate the issues, resolve disagreement and write the final recommendation together.',
        question: 'Which interpretation best reflects the TLF?',
        options: [
          { id: 'a', text: 'Collaboration is weakened whenever AI is used in group work.' },
          { id: 'b', text: 'The AI can strengthen Collaboration because it supports communication and perspective-taking while students still do the shared reasoning and decision-making.' },
          { id: 'c', text: 'The task is mainly Personalisation because translation is involved.' },
          { id: 'd', text: 'The strongest evidence is that the group used more than one AI feature.' },
        ],
        answer: 'b',
        correctFeedback: 'Correct. The tool supports communication and diverse perspectives, while the students remain responsible for shared reasoning, respectful disagreement and the collective outcome.',
        incorrectFeedback: 'The TLF asks whether technology strengthens purposeful and ethical collective learning. Here the AI supports access to collaboration without taking over the group’s thinking.',
        contentTags: ['TLF', 'Collaboration', 'Digital Collaboration', 'Diverse Perspectives'],
      },
      {
        ...shared,
        id: 'ai-15', section: 'tlf-doing-evidence', questionNumber: 15, assessmentLevel: 'Synthesis',
        learningObjective: 'Connect AI-supported learning to purposeful action and authentic contribution.',
        scenario: 'Students identify an accessibility problem on campus. They use AI to help compare possible solutions and prepare questions, then interview users, test prototypes, revise their ideas and present a recommendation to people who can act on it.',
        question: 'What makes this strongest as a Taking Action experience?',
        options: [
          { id: 'a', text: 'The students used AI during several stages of the project.' },
          { id: 'b', text: 'The work applies learning to an authentic challenge and produces an informed contribution for people who can use it.' },
          { id: 'c', text: 'The final recommendation is digitally presented.' },
          { id: 'd', text: 'AI helps the students finish more quickly.' },
        ],
        answer: 'b',
        correctFeedback: 'Correct. Taking Action is evidenced by applying learning to an authentic opportunity and making a purposeful contribution. AI is useful because it supports that work, not because its presence defines the facet.',
        incorrectFeedback: 'Tool use, speed and digital presentation are not the defining evidence. The authentic challenge, informed action and meaningful contribution are what matter.',
        contentTags: ['TLF', 'Taking Action', 'Authentic Challenge', 'Purposeful AI'],
      },
      {
        ...shared,
        id: 'ai-16', section: 'tlf-doing-evidence', questionNumber: 16, assessmentLevel: 'Synthesis',
        learningObjective: 'Evaluate purposeful AI use through the TLF design-notice-reflect-improve cycle.',
        scenario: 'A team wants to know whether AI genuinely improved a new inquiry unit. They have platform usage statistics, but they also selected TLF indicators connected to Agency, Authenticity and Collaboration before the unit began.',
        question: 'What should the team examine next?',
        options: [
          { id: 'a', text: 'Whether students used AI more often than in the previous unit.' },
          { id: 'b', text: 'Whether the AI platform generated enough content to justify its cost.' },
          { id: 'c', text: 'Evidence from student talk, choices, work, relationships and action showing whether the selected learner experiences deepened, then identify the next design move.' },
          { id: 'd', text: 'Whether every lesson included at least one AI activity.' },
        ],
        answer: 'c',
        correctFeedback: 'Correct. The TLF keeps evaluation centred on learner experience. Usage statistics can inform implementation, but the stronger evidence is what students experienced, chose, created, connected and did—and what should improve next.',
        incorrectFeedback: 'Frequency and feature use do not demonstrate transformative learning. Connect the evidence back to the selected TLF indicators and use it to decide the next design move.',
        contentTags: ['TLF', 'Evidence', 'Reflection', 'Continuous Improvement'],
      },
    ],
  },
];

export const aiQuestions = aiSections.flatMap((section) => section.questions);
