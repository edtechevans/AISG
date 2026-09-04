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

export type LearningPoint = {
  label: string;
  text: string;
};

export type LearningStep = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  points: LearningPoint[];
  example?: { title: string; text: string };
};

export type CourseModule = {
  id: string;
  number: number;
  title: string;
  eyebrow: string;
  summary: string;
  learningContent: string;
  estimatedMinutes: number;
  learningSteps: LearningStep[];
  keyTakeaways: string[];
  handbookReferences: { section: string; page: number }[];
};

export const courseModules: CourseModule[] = [
  {
    id: 'M1',
    number: 1,
    title: 'Safeguarding at AISG',
    eyebrow: 'Know',
    summary: 'The commitment, shared responsibility and signs that require professional attention.',
    learningContent: 'At AISG, the interests and welfare of children come first. Every employee has a role in recognising and reporting suspected abuse or neglect.',
    estimatedMinutes: 3,
    learningSteps: [
      {
        eyebrow: 'Learn 1 of 3',
        title: "Start with the child's welfare",
        paragraphs: [
          "AISG's primary consideration in any decision about suspected abuse or neglect is the interests and welfare of the child. A safe and secure environment is essential to a student's education, physical development and emotional development.",
          'Because educators see and interact with students over time, they are well placed to notice when a child may need help or protection. That position brings a professional and ethical obligation to identify and report suspected cases - not only cases that have already been proven.',
        ],
        points: [
          { label: 'Notice', text: 'Pay attention to changes, patterns, injuries, behaviour and what a student tells you.' },
          { label: 'Act', text: 'Put the student\'s safety and welfare ahead of convenience, reputation or avoiding disruption.' },
          { label: 'Share', text: 'Use AISG\'s safeguarding pathway so the trained safeguarding team can respond.' },
        ],
      },
      {
        eyebrow: 'Learn 2 of 3',
        title: 'Recognise the main areas of abuse',
        paragraphs: [
          'The handbook identifies four main areas of student abuse: neglect, physical abuse, sexual abuse, and psychological or emotional abuse. These forms of harm can overlap, and sexual abuse does not have to involve physical contact.',
          'Possible indicators include unexplained or inconsistently explained injuries, flinching, marked changes in behaviour, fear of particular adults or places, age-inappropriate sexual knowledge, poor attendance, hunger, regression, or persistent self-deprecation. A sign may have another explanation; your role is to notice the concern, not diagnose its cause.',
        ],
        points: [
          { label: 'Neglect', text: 'Basic or emotional needs are persistently or severely unmet.' },
          { label: 'Physical', text: 'A non-accidental injury is inflicted or knowingly not prevented.' },
          { label: 'Sexual', text: 'Coercion, force or unequal power is used for sexual activity or behaviour.' },
          { label: 'Emotional', text: 'Persistent rejection, threats, taunting, isolation or other severe emotional ill-treatment causes harm.' },
        ],
      },
      {
        eyebrow: 'Learn 3 of 3',
        title: 'Look beyond appearances',
        paragraphs: [
          'Material comfort does not rule out neglect. The handbook highlights affluent neglect: caregivers may be physically present but emotionally absent, gifts may replace care, or a child may face extreme pressure to succeed. This can be difficult to spot and is often under-recognised.',
          'Consider the whole picture over time. Several changes together may create reasonable cause for concern even when no single sign proves abuse. Record what you have observed accurately and follow the reporting process; do not question a student repeatedly, seek proof yourself or wait for the situation to become more serious.',
        ],
        points: [
          { label: 'Example', text: 'A well-presented student describes little emotional support, frequent caregiver absence and intense pressure at home.' },
          { label: 'Your judgement', text: 'Do not dismiss the concern because the student appears materially provided for.' },
          { label: 'Your action', text: 'Record the indicators and raise the concern through AISG\'s safeguarding pathway.' },
        ],
      },
    ],
    keyTakeaways: [
      "The child's interests and welfare are AISG's primary consideration.",
      'Safeguarding is the responsibility of every professional who works with students.',
      'Know the four main areas: neglect, physical, sexual, and psychological or emotional abuse.',
      'Affluence and outward presentation do not rule out neglect.',
      'Indicators do not prove abuse, but they must not be dismissed when they create a concern.',
    ],
    handbookReferences: [
      { section: '1 Commitment Statement', page: 4 },
      { section: '3.1 Student Abuse', page: 7 },
      { section: '3.1.1-3.1.4 Signs of Abuse and Neglect', page: 8 },
      { section: '4.1 Reporting Requirements', page: 11 },
    ],
  },
  {
    id: 'M2',
    number: 2,
    title: 'Student-on-student and online harm',
    eyebrow: 'Recognise',
    summary: 'Recognising physical, sexual, emotional, financial and technology-enabled harm between students.',
    learningContent: 'Student-on-student harm can happen in varied relationships, at school or outside school, and through digital channels. Treat it as a safeguarding concern.',
    estimatedMinutes: 3,
    learningSteps: [
      {
        eyebrow: 'Learn 1 of 3',
        title: 'Harm between students is safeguarding',
        paragraphs: [
          'AISG defines student-on-student abuse broadly. It can include physical, sexual, emotional or financial abuse and coercive control. It may occur between classmates, friends or romantic partners, in intimate or non-intimate relationships.',
          'The location does not remove the safeguarding concern. Harm may happen during school, at a school event or outside school. It also does not need to be repeated before staff take it seriously.',
        ],
        points: [
          { label: 'Physical', text: 'Hitting, kicking, pinching, biting, hair-pulling or other physical harm.' },
          { label: 'Sexual', text: 'Non-consensual sexual behaviour, harassment, inappropriate language, sexting or requests for explicit material.' },
          { label: 'Control', text: 'Threats, coercion, blackmail, extortion or controlling behaviour within a student relationship.' },
        ],
        example: { title: 'AISG context', text: 'A concern shared after an activity or about behaviour in a friendship group deserves the same safeguarding attention as a concern first noticed in class.' },
      },
      {
        eyebrow: 'Learn 2 of 3',
        title: 'Separate harmful behaviour from ordinary conflict',
        paragraphs: [
          'The handbook describes antagonistic behaviour as unwanted, aggressive behaviour that may be verbal, physical or electronic. Examples include intimidation, threats, attacks linked to an identity or characteristic, encouraging self-harm, extortion or blackmail, and purposely excluding someone from a group.',
          'Staff should not minimise these behaviours because there is no visible injury or because the students know one another. Consider the behaviour, its impact, the use of power or coercion and the possibility of a wider pattern.',
        ],
        points: [
          { label: 'Notice', text: 'Look for fear, pressure, humiliation, exclusion, threats or a student losing control over a situation.' },
          { label: 'Respond', text: 'Take the report seriously and help the student feel heard and safe.' },
          { label: 'Report', text: 'Use the safeguarding pathway rather than trying to mediate a possible abuse concern yourself.' },
        ],
      },
      {
        eyebrow: 'Learn 3 of 3',
        title: 'Digital harm is still real harm',
        paragraphs: [
          'Cyber harassment is the use of technology to harass, threaten or intimidate. It can include abusive messages, rumours, group-based abuse, posting photos or videos without consent, harmful memes or filters, hate sites, stolen identities, and AI-generated or manipulated media that misrepresents or harms another person.',
          'Do not treat harmful online behaviour as only an IT issue or dismiss it because it happened after school. If a student reports sexual requests, coercion or other online harm, listen calmly, preserve their account, record accurately and report. Do not arrange a confrontation, conduct your own investigation or contact caregivers independently.',
        ],
        points: [
          { label: 'Deepfakes', text: 'Synthetic or manipulated media can humiliate, misrepresent and harm even when people know it is fake.' },
          { label: 'Private groups', text: 'A closed message thread can still cause serious safeguarding harm.' },
          { label: 'Next step', text: 'Move from support to accurate recording and prompt reporting.' },
        ],
      },
    ],
    keyTakeaways: [
      'Student-on-student abuse can take many forms and occur in many kinds of relationship.',
      'Harm outside school or through technology remains a safeguarding concern.',
      'Threats, coercion, extortion and purposeful exclusion are not ordinary friendship conflict.',
      'AI-generated or manipulated media can constitute cyber harassment.',
      'Listen, record and report; do not mediate or investigate possible abuse yourself.',
    ],
    handbookReferences: [
      { section: '3.2 Student on Student Abuse', page: 10 },
      { section: '3.2.2 Antagonistic Behavior', page: 10 },
      { section: '3.2.3 Cyber Harassment', page: 11 },
      { section: '4.1 Reporting Requirements', page: 11 },
    ],
  },
  {
    id: 'M3',
    number: 3,
    title: 'Responding to a disclosure',
    eyebrow: 'Respond',
    summary: 'Calm listening, neutral clarification, honest confidentiality and accurate recording.',
    learningContent: 'Listen without leading or investigating. Reassure the student, never promise secrecy, record their words accurately and report to the appropriate Student Safeguarding Lead.',
    estimatedMinutes: 3,
    learningSteps: [
      {
        eyebrow: 'Learn 1 of 3',
        title: 'Make the first response calm and safe',
        paragraphs: [
          'A student may test whether it feels safe to speak before sharing the full concern. Remain calm. Do not panic, show shock or rush the student. Listen carefully and allow them to use their own words without your assumptions.',
          'Reassure the student that speaking to an adult was the right thing to do. Let them know you believe them and will do your best to protect and support them. Praise the courage it took to speak without making promises about what will happen next.',
        ],
        points: [
          { label: 'Do', text: 'Listen, stay steady and give the student time to speak.' },
          { label: 'Say', text: '“You did the right thing by telling me.”' },
          { label: 'Avoid', text: 'Expressing disbelief, alarm, blame or pressure.' },
        ],
      },
      {
        eyebrow: 'Learn 2 of 3',
        title: 'Clarify without leading or investigating',
        paragraphs: [
          'Do not prompt responses, project an explanation or supply details. Most employees are not responsible for conducting an interview. If a word or meaning must be understood, use the minimum neutral clarification needed and let the student continue in their own language.',
          'A neutral prompt such as “Tell me what you mean by they” leaves the answer open. A question such as “Was it your caregiver?” introduces an assumption and may influence the account. Do not make the student prove what happened or repeat the details to several people.',
        ],
        points: [
          { label: 'Open', text: 'Use neutral wording that does not suggest the answer.' },
          { label: 'Limited', text: 'Ask only what is needed to understand the student\'s meaning and immediate safety.' },
          { label: 'Accurate', text: 'Keep the student\'s own language rather than translating it into your interpretation.' },
        ],
      },
      {
        eyebrow: 'Learn 3 of 3',
        title: 'Be honest about what happens next',
        paragraphs: [
          'Never promise secrecy. Explain that you need to tell specific people who can help, while keeping the matter as confidential as possible. The concern should not become general knowledge within the school community.',
          'After the conversation, record what the student said or what you observed, including relevant dates and times, in as much detail as possible. Report to the appropriate Division Student Safeguarding Lead when called for. Maintain confidentiality: do not discuss the incident with uninvolved staff, students, people outside school, friends or family.',
        ],
        points: [
          { label: 'Record', text: 'Use the student\'s words and include dates, times and direct observations.' },
          { label: 'Report', text: 'Share promptly with the appropriate Division Student Safeguarding Lead.' },
          { label: 'Protect', text: 'Keep information within the safeguarding process on a need-to-know basis.' },
        ],
      },
    ],
    keyTakeaways: [
      'Remain calm and let the student speak in their own words.',
      'Listen and clarify neutrally; do not lead, investigate or ask the student to prove the concern.',
      'Reassure the student that telling an adult was the right thing to do.',
      'Never promise secrecy; explain that specific people need to know in order to help.',
      'Record accurately, report promptly and maintain confidentiality.',
    ],
    handbookReferences: [
      { section: '4.1 Responding to a Disclosure', page: 11 },
      { section: '4.1 Responding to a Disclosure - Safeguarding Team Members', page: 12 },
      { section: '4.2 Reporting Pathways', page: 13 },
    ],
  },
  {
    id: 'M4',
    number: 4,
    title: 'Recording, reporting and escalating concerns',
    eyebrow: 'Report',
    summary: 'The reporting threshold, urgency, AISG pathways, confidentiality and personal responsibility.',
    learningContent: 'Reasonable cause is enough to report. Record observations, follow AISG procedures and consult the appropriate Student Safeguarding Lead.',
    estimatedMinutes: 3,
    learningSteps: [
      {
        eyebrow: 'Learn 1 of 3',
        title: 'Reasonable cause is the reporting threshold',
        paragraphs: [
          'All AISG employees must report suspected abuse or neglect whenever they have reasonable cause to believe a student has suffered, or is at risk of suffering, harm. Proof is not required. Investigating privately or waiting for certainty can delay protection.',
          'The duty belongs to each employee. If a colleague shares information that creates reasonable cause for concern, do not assume that person will report it for you. Record and report the concern through the AISG process yourself.',
        ],
        points: [
          { label: 'Threshold', text: 'Reasonable cause - not proof, certainty or a group decision.' },
          { label: 'Responsibility', text: 'Every employee who becomes concerned has a duty to act.' },
          { label: 'Boundary', text: 'The safeguarding team assesses and follows up; staff do not investigate.' },
        ],
      },
      {
        eyebrow: 'Learn 2 of 3',
        title: 'Match the speed to the level of danger',
        paragraphs: [
          'At all times, record your observations, follow AISG Student Safeguarding Policy and Procedures, and consult the appropriate Student Safeguarding Lead. A concern does not need to be an emergency before it is recorded and reported.',
          'If you believe a student needs immediate protection or is at significant risk of harm, contact the appropriate Student Safeguarding Lead immediately and communicate it as a Student Safeguarding case. The Lead completes the CPOMS Student Safeguarding Report and the case is handled by members of the safeguarding committee.',
        ],
        points: [
          { label: 'Immediate danger', text: 'Contact the appropriate Student Safeguarding Lead immediately.' },
          { label: 'Other concern', text: 'Record the observations and use the safeguarding system and reporting pathway without waiting for an emergency.' },
          { label: 'Follow-up', text: 'Let the designated safeguarding team determine and coordinate the next steps.' },
        ],
      },
      {
        eyebrow: 'Learn 3 of 3',
        title: 'Record facts and limit who knows',
        paragraphs: [
          'A useful record preserves what was seen or heard: the student\'s words, direct observations, dates, times and relevant context. Avoid speculation, labels or conclusions that go beyond what you know. Detail helps reduce the need for a student to repeat an account unnecessarily.',
          'After reporting, information stays within the safeguarding process. Do not discuss the incident with uninvolved colleagues, students, people outside school or loved ones. A name-free summary in a staff chat is still an inappropriate disclosure. The safeguarding team manages information on a need-to-know basis.',
        ],
        points: [
          { label: 'Record', text: 'Facts, exact words, dates, times and observations.' },
          { label: 'Report', text: 'The concern and its urgency through the AISG pathway.' },
          { label: 'Restrict', text: 'Details to the people responsible for the safeguarding response.' },
        ],
      },
    ],
    keyTakeaways: [
      'Report whenever there is reasonable cause; do not wait for proof.',
      'Your reporting responsibility is not removed because another person knows about the concern.',
      'Immediate risk requires immediate contact with the appropriate Student Safeguarding Lead.',
      'Non-emergency concerns must still be recorded and reported through the AISG pathway.',
      'Safeguarding information is shared only on a need-to-know basis.',
    ],
    handbookReferences: [
      { section: '4.1 Reporting Requirements', page: 11 },
      { section: '4.1 Responding to a Disclosure', page: 12 },
      { section: '4.2 Reporting Pathways', page: 13 },
    ],
  },
  {
    id: 'M5',
    number: 5,
    title: 'Professional boundaries and adult conduct',
    eyebrow: 'Model',
    summary: 'Visible professional practice, Safe Touch, private spaces, self-reporting and adult conduct concerns.',
    learningContent: 'Professional boundaries protect students and adults. Transparency, visibility and early reporting help AISG identify risk and patterns.',
    estimatedMinutes: 4,
    learningSteps: [
      {
        eyebrow: 'Learn 1 of 4',
        title: 'Make professional contact observable',
        paragraphs: [
          'AISG expects adult-student relationships to be open, respectful and clearly connected to the professional activity. Avoid being alone with a student where possible. If a sensitive conversation needs privacy, find a space out of earshot but within sight of others, and make sure another adult knows where you and the student are.',
          'Do not transport a student alone in your car. Keep classroom and office sight lines clear, do not cover windows, and do not block the door. The student should have unhindered access to leave. It is always the adult\'s responsibility to set and maintain the boundary.',
        ],
        points: [
          { label: 'Visible', text: 'Private does not mean hidden; preserve sight lines or audibility.' },
          { label: 'Known', text: 'Tell another member of staff where the conversation is taking place.' },
          { label: 'Professional', text: 'Keep contact relevant to your role and avoid favouritism or personal relationships.' },
        ],
      },
      {
        eyebrow: 'Learn 2 of 4',
        title: 'Apply the Safe Touch rule',
        paragraphs: [
          'Physical contact with students is prohibited except in the specific situations described by the handbook, such as a clear educational purpose, protection from danger, appropriate mental support, medical care, necessary personal support or physical assistance.',
          'Any touch must be non-abusive, in the student\'s best interests or for safety, and public except in an emergency. Consider gender and whether the touch is wanted. Safe touch is not secret, is not used to reprimand, and does not involve areas normally covered by a swimsuit. In a life-threatening emergency, medically necessary and minimal intervention takes priority and is documented afterward.',
        ],
        points: [
          { label: 'Purpose', text: 'There is a clear educational, safety, medical or support reason.' },
          { label: 'Respect', text: 'The contact is wanted, appropriate and attentive to gender considerations.' },
          { label: 'Visibility', text: 'It happens in public unless an emergency makes that impossible.' },
        ],
      },
      {
        eyebrow: 'Learn 3 of 4',
        title: 'Balance safety and privacy in bathrooms and changerooms',
        paragraphs: [
          'Adults may enter a student-designated bathroom or changeroom when concerned that a student is at risk to themselves, is a risk to others, or is acting in violation of school rules. Student dignity and privacy still matter, so entry must be limited to what health and safety require.',
          'Except in an extreme emergency, enter with a partner, announce who you are and why you need to enter, and attempt gender-matched entry. After any entry, make a report to the Student Safeguarding Lead as soon as possible. In aquatics changerooms, staff also knock or call out and give students an opportunity to cover up.',
        ],
        points: [
          { label: 'Before', text: 'Get a partner, attempt gender matching, announce yourself and state the reason.' },
          { label: 'During', text: 'Intrude only as far as the safety concern requires.' },
          { label: 'After', text: 'Promptly self-report the entry to the Student Safeguarding Lead.' },
        ],
      },
      {
        eyebrow: 'Learn 4 of 4',
        title: 'Share small concerns and self-report early',
        paragraphs: [
          'An adult conduct concern can be small: a sense of unease or a nagging doubt that an adult working with children acted inconsistently with the Employee Code of Conduct, even if the behaviour may not meet the harm threshold. Staff do not need to classify the threshold themselves.',
          'Share a concern about another adult with the principal; a concern about the principal goes to the Head of School or School Safeguarding Coordinator. If your own situation could be misinterpreted, appeared compromising or fell below the Code standard, proactively self-report in person to the Student Safeguarding Lead or divisional principal. Sharing is a neutral safeguarding act that allows patterns to be identified.',
        ],
        points: [
          { label: 'Other adult', text: 'Share the concern with the principal under the Adult Conduct Concerns protocol.' },
          { label: 'Your conduct', text: 'Self-report in person to the Student Safeguarding Lead or divisional principal.' },
          { label: 'Threshold', text: 'You share what you observed; the Principal and School Safeguarding Coordinator determine how it is classified.' },
        ],
      },
    ],
    keyTakeaways: [
      'Keep adult-student interactions professional, visible and known to others.',
      'Safe Touch requires a clear purpose, the student\'s best interests, respect and visibility.',
      'Bathroom or changeroom entry follows the partner, announcement, gender and reporting protocol except in an extreme emergency.',
      'Share even small adult conduct concerns or nagging doubts with the principal.',
      'Proactive self-reporting supports transparency and does not imply wrongdoing.',
    ],
    handbookReferences: [
      { section: '6.4-6.5 Appropriate Relationships and Professional Roles', page: 21 },
      { section: '6.6-6.8 Bathroom/Changeroom Protocol and Safe Touch', page: 22 },
      { section: '7.1-7.3 Adult Conduct Concerns and Self-Reporting', page: 27 },
    ],
  },
  {
    id: 'M6',
    number: 6,
    title: 'Safe communication, privacy and school activities',
    eyebrow: 'Act',
    summary: 'Authorised channels, student identity, educational media, overnight travel and everyday judgement.',
    learningContent: 'Everyday choices protect students: use authorised communication, protect student identity, follow activity procedures and share concerns rather than managing them alone.',
    estimatedMinutes: 4,
    learningSteps: [
      {
        eyebrow: 'Learn 1 of 4',
        title: 'Use school-authorised communication',
        paragraphs: [
          'AISG-authorised channels include official AISG social media accounts, Microsoft 365, Seesaw and SIS communication platforms. Personal email and personal social media accounts are not authorised for school-related communication.',
          'Use official school email for confidential information and include caregivers when emailing confidential or sensitive content with students. Microsoft Teams is for school-related, non-confidential or non-sensitive communication. Never conduct a one-to-one chat with a student on social media or a personal email account.',
        ],
        points: [
          { label: 'School-related', text: 'Use a school-assigned email or another authorised AISG account.' },
          { label: 'Sensitive', text: 'Use official school email; do not place confidential information in Teams.' },
          { label: 'Personal channel', text: 'Move the conversation to an authorised channel rather than continuing there.' },
        ],
      },
      {
        eyebrow: 'Learn 2 of 4',
        title: 'Protect identity and privacy online',
        paragraphs: [
          'Do not post student names, initials, identifying information or recognisable faces on personal social media. Caregiver permission allows the school - not an employee\'s personal account - to show a student\'s face for official marketing or promotion.',
          'Do not use personal social media to discuss individual school matters with students or caregivers. AISG caregiver social-media groups are for large groups and school-related content; employees should not join grade or class WeChat caregiver groups unless they are also a caregiver of that grade or class.',
        ],
        points: [
          { label: 'Identity', text: 'A name, initials, face or contextual detail may identify a student.' },
          { label: 'Permission', text: 'Permission granted to AISG does not extend to an employee\'s personal account.' },
          { label: 'WeChat', text: 'Redirect individual school matters and do not join a grade/class group unless you are a caregiver in it.' },
        ],
      },
      {
        eyebrow: 'Learn 3 of 4',
        title: 'Use educational media for its stated purpose',
        paragraphs: [
          'AISG allows photography and filming for educational purposes through authorised channels and in line with the communication policy and applicable codes of conduct. Media should never move casually from a school purpose into personal sharing.',
          'Aquatics has additional safeguards because students may feel vulnerable in swimwear. Caregivers and visitors do not take photos or videos during instructional classes. Coaches may film swimmers for feedback on a school device, and those photos or videos must be deleted immediately after the feedback session.',
        ],
        points: [
          { label: 'Authorised', text: 'Use the approved school channel and equipment for the educational purpose.' },
          { label: 'Limited', text: 'Collect and show only what the activity genuinely requires.' },
          { label: 'Delete', text: 'In aquatics feedback, remove photos and videos immediately after the session.' },
        ],
      },
      {
        eyebrow: 'Learn 4 of 4',
        title: 'Keep overnight supervision visible and accountable',
        paragraphs: [
          'Every school-sponsored overnight trip requires a curfew check each night. Notify students before entering a room and wait for approval unless there is an emergency. Students must be appropriately dressed and seen face to face; a roommate\'s assurance is not enough.',
          'If a student is showering or using the restroom, return in five minutes and check again. Same-gender chaperones may enter with another adult while the door remains open; when two chaperones conduct the check, the second remains outside at the open door. Special secondary events or overnight trips use a Microsoft Teams group chat with two adults included.',
        ],
        points: [
          { label: 'Account for everyone', text: 'Every student is seen face to face during the curfew check.' },
          { label: 'Respect privacy', text: 'Return after five minutes when a student is showering or using the restroom.' },
          { label: 'Stay visible', text: 'Use two adults and keep the room door open during permitted entry.' },
        ],
        example: { title: 'Everyday judgement', text: 'If any adult interaction leaves a persistent sense of unease, use the Adult Conduct Concerns protocol. A nagging doubt is enough to share; you do not investigate it yourself.' },
      },
    ],
    keyTakeaways: [
      'Use authorised AISG accounts for all school-related communication.',
      'Never use personal social media or personal email for one-to-one communication with a student.',
      'Protect student names, initials, faces and other identifying information.',
      'Use educational media only through authorised channels and delete aquatics feedback media after use.',
      'Overnight curfew checks require face-to-face confirmation while respecting privacy and maintaining two-adult visibility.',
    ],
    handbookReferences: [
      { section: '8.1-8.3 Communication, Email, Messaging and Social Media', page: 29 },
      { section: '6.9 Aquatics Photography', page: 25 },
      { section: '9.1 Student Safeguarding Procedures for Overnight Stays', page: 31 },
      { section: '7.1 Adult Conduct Concerns', page: 27 },
    ],
  },
];

export const COURSE_VERSION_ID = 'aisg-sg-sy2627';
export const COURSE_VERSION = 'SY2026-27';
export const DEFAULT_PASS_THRESHOLD = 80;
