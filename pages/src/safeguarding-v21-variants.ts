import type { Question } from './safeguarding-v2-data';

/** Editorially authored alternatives, used on subsequent attempts.
 * Both versions reference the same official handbook obligation.
 * This is formative browser-based mastery practice, not a secure examination. */
type Alternative = Pick<Question, 'scenario' | 'prompt' | 'options' | 'correct' | 'why'> & Partial<Pick<Question, 'page' | 'section' | 'kind'>>;
const alternatives: Record<string, Alternative> = {
  C01: {
    scenario: 'A grade-level team is hesitant to raise a concern because a long-standing school activity and important relationships may be affected.',
    prompt: 'How does the commitment statement guide their decision?',
    options: ['Raise the concern through safeguarding procedures because student welfare takes priority', 'Seek approval from everybody affected before recording the concern', 'Delay reporting until the activity is complete, provided no one asks questions', 'Agree as a team that the matter is outside the school’s responsibility'],
    correct: [0], why: 'AISG places student welfare first. Relationships and disruptions do not override safeguarding responsibilities.'
  },
  C02: {
    scenario: 'A colleague believes a concern can only be safeguarding-related if there is physical injury.',
    prompt: 'Which other categories are explicitly recognised in the handbook? Select all that apply.',
    options: ['Neglect', 'Psychological or emotional abuse', 'Sexual abuse', 'Disagreement with a teacher’s lesson plan'],
    correct: [0,1,2], why: 'The handbook identifies four categories including physical abuse, neglect, sexual abuse and psychological/emotional abuse.'
  },
  C03: {
    scenario: 'During a classroom conversation a student begins an incomplete account of something troubling, then falls silent.',
    prompt: 'What is the best immediate response by the receiving teacher?',
    options: ['Stay calm, give the student time and use only limited non-leading clarification', 'Ask colleagues to question the child separately to establish consistency', 'Offer to keep the conversation secret in return for more details', 'Invite the alleged person into the room to clarify what happened'],
    correct: [0], why: 'An employee listens without suggestion or investigation and refers the concern.'
  },
  C04: {
    scenario: 'A student worries that disclosure will become general knowledge among teachers.',
    prompt: 'Which explanations are consistent with AISG guidance? Select all that apply.',
    options: ['Information will be shared only with those who need it to protect you', 'I will do my best to help you feel safe', 'Your friends can decide what action is taken', 'I cannot promise that no one else will be told'],
    correct: [0,1,3], why: 'Explain the need-to-know process without guaranteeing secrecy or delegating responsibility.'
  },
  C05: {
    scenario: 'A classroom teacher sees repeated warning signs across several weeks but has not witnessed harm directly.',
    prompt: 'Which threshold triggers the employee’s reporting responsibility?',
    options: ['Reasonable cause to believe harm may have occurred or a student may be at risk', 'A written disclosure signed by the student', 'Agreement from all adults who work with the student', 'Proof that the incident happened on school grounds'],
    correct: [0], why: 'Reasonable cause—not investigation or proof—is the reporting threshold.'
  },
  C06: {
    scenario: 'A student is safe at the moment and has just disclosed a concerning experience in class.',
    prompt: 'Place the teacher’s actions in the most appropriate general sequence.',
    options: ['Listen calmly, avoiding leading questions', 'Reassure without promising complete confidentiality', 'Record their words and relevant observations accurately', 'Contact the appropriate safeguarding lead promptly'],
    correct: [0,1,2,3], why: 'Listen and reassure, preserve the account, then promptly refer. In an immediate danger situation, protect safety first.'
  },
  C07: {
    scenario: 'A teacher needs a sensitive conversation with a student during an otherwise empty planning period.',
    prompt: 'Which location best balances privacy and safeguarding?',
    options: ['A visible room where other adults know where the conversation is taking place', 'An empty room with the door locked to avoid interruptions', 'A stairwell where students will not pass', 'An off-campus café without telling any colleagues'],
    correct: [0], why: 'Privacy can be achieved without unnecessary isolation; colleagues should know where the adult and student are.'
  },
  C08: {
    scenario: 'A teacher is deciding whether hands-on assistance is appropriate in a practical lesson.',
    prompt: 'What should inform the decision? Select all that apply.',
    options: ['Whether the contact has a clear legitimate instructional or protective purpose', 'Whether it respects the student’s wishes and dignity', 'Whether it is transparent and visible, except in emergencies', 'Whether the adult has always used this method before'],
    correct: [0,1,2], why: 'Past habit does not replace the specific safe-touch criteria in the handbook.'
  },
  C09: {
    scenario: 'A caregiver sends highly sensitive information to a teacher in a personal messaging application late in the evening.',
    prompt: 'What should the teacher use for any necessary confidential school response?',
    options: ['The school’s authorised email and confidential-reporting arrangements', 'A private caregiver group chat so everyone knows', 'A personal email account to avoid accessing work systems', 'A general faculty Teams channel because it is internal'],
    correct: [0], why: 'The handbook specifies official school systems and states that Microsoft Teams is not for confidential or sensitive information.'
  },
  C10: {
    scenario: 'A colleague observes an adult-student boundary that feels inappropriate but is unsure whether it meets an abuse threshold.',
    prompt: 'Who is responsible for assessing that threshold?',
    options: ['Appropriate safeguarding and school leadership after the concern is raised', 'The reporting colleague alone, before anybody else can be contacted', 'A private vote among those who know the adult', 'The student, who must first confirm whether they want a report'],
    correct: [0], why: 'Employees should raise adult conduct concerns. The principal and School Safeguarding Coordinator assess them.'
  },
  C11: {
    scenario: 'A volunteer joins a PYP/Secondary event, carries a personal phone and offers to help supervise an activity.',
    prompt: 'Which expectations belong to the AISG visitor code? Select all that apply.',
    options: ['Do not photograph students or request their contact details', 'Use only adult-designated bathrooms', 'Avoid being alone with students, except for explicitly exempted professionals', 'Accept direct student messages when a caregiver approves'],
    correct: [0,1,2], why: 'Visitor boundaries protect student privacy and are not waived by informal permission.'
  },
  C12: {
    scenario: 'At an AISG extracurricular event, a faculty member becomes aware of a concern about a student.',
    prompt: 'What is the teacher’s responsibility?',
    options: ['Use the appropriate reporting pathway even though the issue arose outside a normal lesson', 'Ask the event organiser to decide whether a teacher may report', 'Wait for the next school assembly to raise it', 'Only report if a parent makes an official complaint'],
    correct: [0], why: 'Safeguarding reporting requirements continue during school activities.'
  },
  E01: {
    scenario: 'In a PYP class a child seems well provided for, but describes being left alone frequently and expresses intense anxiety about grades.',
    prompt: 'What is the most responsible interpretation?',
    options: ['Consider the pattern and raise reasonable concerns; material comfort does not exclude neglect', 'Exclude neglect because the family has substantial resources', 'Decide the caregiver is abusive based on one comment', 'Share the concern with parent volunteers before involving the safeguarding lead'],
    correct: [0], why: 'AISG explicitly addresses affluent neglect and the need to distinguish indicators from proof.'
  },
  E04: {
    scenario: 'A Grade 2 child uses a mixture of Mandarin and English during a difficult disclosure.',
    prompt: 'What should the classroom teacher do?',
    options: ['Listen without leading, note the child’s actual words and refer through AISG procedures', 'Summarise the child’s meaning in more formal adult language and replace the original words', 'Ask other children to interpret the incident publicly', 'Delay taking action until the student can retell the account entirely in English'],
    correct: [0], why: 'Preserve the child’s language and meaning; do not lead or delay a needed referral.'
  },
  E07: {
    scenario: 'During a Grade 3 lesson, a teaching assistant notices a significant safeguarding concern while the classroom teacher is supporting another group.',
    prompt: 'What is the appropriate action?',
    options: ['Contact the appropriate SSL and document the observations without waiting for a class meeting', 'Wait until the classroom teacher has time to decide whether a report is necessary', 'Ask the child’s friends to confirm the concern first', 'Post the concern in the teaching team’s general chat as a substitute for reporting'],
    correct: [0], why: 'All employees have a personal reporting responsibility and may not rely on informal discussions.'
  },
  E10: {
    scenario: 'A Kindergarten student needs help with clothing after an accident during the school day.',
    prompt: 'Which safeguards belong in the adult’s decision? Select all that apply.',
    options: ['Provide only the personal support that is needed', 'Preserve the child’s privacy and dignity', 'Keep support professionally visible or involve another adult where possible', 'Assume any kind of physical contact is automatically allowed because the student is young'],
    correct: [0,1,2], why: 'The safe-touch guidance permits necessary personal support while maintaining boundaries.'
  },
  E12: {
    scenario: 'A teacher has a credible concern about a student’s safety in a student-designated bathroom but no immediate emergency.',
    prompt: 'Which procedure best matches AISG guidance?',
    options: ['Announce yourself and the reason, enter with a partner where required, then report the entry to the SSL', 'Enter alone without announcing so the student cannot leave', 'Ask another student to go in and investigate, then report only if they find evidence', 'Avoid all entry even if the situation may pose a serious risk'],
    correct: [0], why: 'The bathroom protocol permits safety entry with the specified announcements, partner expectation and self-report.'
  },
  E13: {
    scenario: 'A Grade 1 caregiver begins a private WeChat exchange about an individual student’s safeguarding or wellbeing information.',
    prompt: 'What is the safest professional next step?',
    options: ['Move confidential school-related matters to authorised communication and reporting channels', 'Continue privately because the caregiver initiated the exchange', 'Forward the conversation into a larger parent WeChat group', 'Send the details to a colleague’s personal account for convenience'],
    correct: [0], why: 'The handbook restricts school-related individual communication on personal social media.'
  },
  E16: {
    scenario: 'At an Elementary assembly a visiting adult wishes to take photographs that include identifiable students.',
    prompt: 'What response follows visitor expectations?',
    options: ['Explain the no-photography rule for visitors and involve appropriate school staff for authorised coverage', 'Allow the photos because the assembly is a school event', 'Allow only if the visitor promises to delete them afterward', 'Ask a child to give their own verbal permission instead of applying the visitor code'],
    correct: [0], why: 'Visitor expectations explicitly prohibit photographing students.'
  },
  E18: {
    scenario: 'A caregiver volunteering on a PYP excursion becomes worried about a student’s wellbeing.',
    prompt: 'What should the caregiver volunteer do?',
    options: ['Tell an appropriate teacher, administrator or school employee promptly', 'Contact the student privately afterward to investigate', 'Ask for the student’s number and contact them later', 'Share details in the caregiver chat to see if others agree'],
    correct: [0], why: 'Volunteers refer concerns to school personnel; they do not independently investigate.'
  },
  S01: {
    scenario: 'A Grade 10 student tells an advisor that a peer threatens to publish private messages unless they comply with demands.',
    prompt: 'How should the concern be classified?',
    options: ['A potential student-on-student safeguarding concern involving coercion or blackmail', 'Only a friendship dispute unless the threats happen on campus', 'A matter that must be resolved by the two students privately', 'Something to ignore until a police report exists'],
    correct: [0], why: 'The handbook includes coercion, extortion and blackmail among student-on-student harms.'
  },
  S02: {
    scenario: 'An MYP student receives threatening messages and a synthetic image portraying them in a false compromising situation.',
    prompt: 'How does the handbook guide the teacher’s response?',
    options: ['Treat the possible cyber harassment as a safeguarding concern and refer appropriately', 'Wait until someone confirms whether an AI tool was used', 'Treat it as harmless because the image is not authentic', 'Only report if the image appears on a school-managed website'],
    correct: [0], why: 'AISG explicitly includes harmful manipulated or AI-generated media in cyber harassment.'
  },
  S04: {
    scenario: 'A DP student tells their teacher something serious but asks them to promise no one else will know.',
    prompt: 'Which answer is both supportive and consistent with AISG guidance?',
    options: ['I will share this only with the people who need to help keep you safe; I cannot promise complete secrecy', 'I can keep this between us if you promise it will not happen again', 'I will only contact safeguarding staff if your friends agree', 'I will investigate it personally before telling anyone'],
    correct: [0], why: 'Safeguarding information is shared on a need-to-know basis and complete secrecy must not be promised.'
  },
  S07: {
    scenario: 'An advisor receives a concerning disclosure during an overnight trip, far from the Science Park campus.',
    prompt: 'Which action does the handbook require?',
    options: ['Make the appropriate prompt safeguarding report and protect the student’s immediate safety', 'Wait until the class is back on campus so the matter becomes a school concern', 'Ask other students to conduct interviews to save time', 'Use an informal trip group chat in place of the reporting pathway'],
    correct: [0], why: 'Reporting responsibility continues during overnight school travel.'
  },
  S11: {
    scenario: 'A PE teacher is demonstrating a technique in the Science Park pool and believes hands-on guidance could help.',
    prompt: 'Which conditions are expected? Select all that apply.',
    options: ['Explain the instructional purpose of potential touch', 'Seek the student’s consent before instructional touch', 'Keep approved contact necessary and visible', 'Continue touching a student who has asked not to be touched'],
    correct: [0,1,2], why: 'The aquatic guidance emphasises student consent, visibility and appropriate purpose.'
  },
  S13: {
    scenario: 'A coach receives a student’s direct message on their private social media account about the next tournament.',
    prompt: 'What is the most appropriate professional response?',
    options: ['Use an authorised school communication channel and avoid continuing a private 1:1 personal chat', 'Reply privately because the information is about sport', 'Continue the discussion from a secondary personal account', 'Invite other students into the private account to make it acceptable'],
    correct: [0], why: 'Student contact on personal social media must not be used as a 1:1 school channel.'
  },
  S16: {
    scenario: 'A three-day school trip within mainland China will take 31 Secondary students.',
    prompt: 'According to the mandatory 1:10 ratio, what is the minimum number of chaperones?',
    options: ['Four, subject to the additional chaperone composition rules', 'Three because the trip is in China', 'Two because all students are over 12', 'Any number the trip leader considers comfortable'],
    correct: [0], why: 'The mandatory 1:10 ratio means 31 students require four chaperones; other rules must also be followed.'
  },
  S17: {
    scenario: 'An overnight trip is planned from Guangzhou to Macau with 10 students.',
    prompt: 'Which chaperone requirement is specified for a trip outside mainland China?',
    options: ['At least three, even with fewer than 20 students', 'Only one when the group is small', 'Two whenever the group fits the 1:10 ratio', 'No extra requirement applies because Macau is nearby'],
    correct: [0], why: 'The handbook explicitly includes Macau and Hong Kong among travel outside mainland China requiring at least three chaperones.'
  },
  S18: {
    scenario: 'At hotel curfew one student is showering while other students are waiting to be checked.',
    prompt: 'Which procedures apply? Select all that apply.',
    options: ['Return to recheck the student when they are visible', 'Verify each student face-to-face rather than counting names from outside', 'Maintain the two-adult open-door safeguards for room entry', 'Assume the showering student is in the room and mark them checked'],
    correct: [0,1,2], why: 'The overnight procedures specify face-to-face verification and a return visit where necessary.'
  }
};

export function forAttempt(q: Question, attempt: number): Question {
  if (attempt <= 1 || !alternatives[q.id]) return q;
  // The retake starts with an alternate authored scenario rather than the original answer set.
  return {...q, ...alternatives[q.id]};
}

export function alternateCoverage(questionIds: string[]): { covered: number; total: number } {
  return {covered: questionIds.filter(id => Boolean(alternatives[id])).length, total: questionIds.length};
}
