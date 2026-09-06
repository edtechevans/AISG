import type { AiSection } from './ai-course';

export const FACULTY_COURSE_VERSION = 'SY2026-27';

const prompts = ['What is the strongest next step?', 'Which response best applies the handbook expectation?', 'Which professional judgement is most defensible?', 'What should the faculty member do?', 'Which response best integrates the competing priorities?'] as const;

const secondaryScenarios = [
  ['A Grade 8 student can demonstrate the intended learning but a single prescribed format creates an avoidable language barrier.','Two multilingual students use home language to clarify a complex idea before sharing with the wider group.','A colleague proposes giving every learner identical support because that seems fairest.','A student shares information that may indicate a safeguarding concern; the facts are incomplete.','A student is excluded from a group task and becomes visibly distressed while the class is under time pressure.'],
  ['A teacher needs to coordinate support for a learner and is deciding what information to send and to whom.','A caregiver asks for details about another student after a group incident.','A concern begins with a classroom practice that the classroom teacher can address.','The concern remains unresolved after the appropriate first conversation.','A staff member is preparing a message that mixes useful evidence, assumptions and confidential detail.'],
  ['A teacher notices a recurring learning barrier and has evidence that a small team change could help.','A mid-year growth review shows the original strategy is not yet improving student learning.','A colleague treats the growth cycle mainly as paperwork to finish.','A team needs detailed PLC procedures that are referenced but not reproduced in the handbook.','A faculty member without a formal title wants to help lead curriculum improvement.'],
  ['A Grade 7 learner needs support moving from Elementary routines into Lower Secondary expectations.','A Grade 10 student and caregiver are comparing rigorous Upper Secondary pathways.','A learner has an Accommodation Plan, but the usual assessment format creates a documented barrier.','An advisee describes distress that goes beyond the advisor’s role and expertise.','Course choice, wellbeing and achievement evidence point in different directions for one student.'],
  ['A student misses a summative assessment because of an excused absence.','A teacher is considering lowering an achievement grade because important work was submitted late.','A student’s early evidence is weak, but recent evidence shows sustained and consistent growth.','A learner understands the subject well but has inconsistent effort and homework completion.','A semester grade decision involves mixed evidence, late work, recent growth and inconsistent engagement.'],
  ['A China Trip team is choosing between tourism-focused activities and experiences linked to ATL, service or Chinese culture.','A teacher is planning a Secondary overnight field trip and remembers an Elementary ratio from a previous school.','A class can use MacBooks, but the proposed digital task adds no learning value.','A student requests a confidential recommendation letter with less than one week’s notice.','A major assessment, activity commitment and experiential-learning opportunity are competing for a student’s time.'],
  ['A student arrives after 7:55 and walks directly to class without checking in.','A student wants to leave the closed campus and return later without permission.','A teacher knows several weeks in advance that approved leave will affect classes and duties.','A faculty member develops a fever before school and has duties requiring cover.','Contract hours, an assigned duty, a school event and Wednesday professional learning create competing demands.'],
  ['A familiar employee arrives without the required ID during a busy school event.','A faculty member is hosting a large caregiver event with many campus visitors.','A new teacher needs both curriculum guidance and help building a life in Guangzhou.','A teacher wants to rely on procedures remembered from another school during an emergency.','A faculty member wants to purchase materials personally before approval because the deadline is close.'],
  ['A planned classroom topic is relevant but politically sensitive and likely to prompt different perspectives.','A faculty member is unsure whether a proposed interaction fits the Employee Code of Conduct.','An employee is choosing clothing for a day involving active supervision and an external visitor meeting.','A staff member becomes aware of credible fraud and a serious health-and-safety risk.','A vendor offers an expensive gift shortly after the employee influences a purchasing decision.'],
  ['A repeated one-sided pattern includes threats, exclusion and harmful digital images.','A student repeatedly disrupts learning but there is no immediate danger or rights violation.','A student with missing work needs structured support and may also face an academic-integrity concern.','An AI detector reports a high probability score on a student assignment.','A Grade 10 student has attendance concerns, late work, recent improvement, an AI flag and peer behaviour that may be becoming abusive.'],
] as const;

const elementaryScenarios = [
  ['A Grade 2 learner understands the idea but a single prescribed format creates an avoidable language barrier.','Two multilingual learners use home language to rehearse an explanation before sharing.','A team proposes identical support for every learner even though barriers differ.','A child shares information that may indicate a safeguarding concern.','A child becomes distressed after exclusion from a collaborative task.'],
  ['A homeroom teacher needs to coordinate learner support without oversharing.','A caregiver asks for private information about another child.','A concern is closest to the classroom teacher and can first be discussed there.','A concern remains unresolved after the appropriate first conversation.','A draft message mixes observation with labels and speculation.'],
  ['A teacher has evidence that a collaborative inquiry could improve learning.','Mid-year evidence suggests a professional goal needs adjustment.','A colleague treats growth and evaluation as paperwork rather than learning.','A PLC is deciding how to use the five inquiry questions.','A teacher wants to contribute leadership without holding a formal title.'],
  ['A PK–K learner needs play, relationships and developmentally appropriate learning.','A Grade 5 team is designing a PYP inquiry that connects disciplines meaningfully.','A learner receiving support needs classroom barriers removed through agreed plans.','A teacher needs to communicate with a child in a way that protects dignity and trust.','A learner’s academic, social and emotional needs require coordinated support.'],
  ['A teacher is deciding what evidence will show genuine Elementary learning.','A home-learning task would require substantial caregiver teaching to complete.','A conference needs to communicate progress, next steps and learner voice.','A learner receiving EAL support needs accurate reporting of achievement and support.','A report-card decision includes recent growth, multiple evidence sources and learner reflection.'],
  ['A field trip is being planned and the team is checking current Elementary procedures.','A learning experience outside class could connect inquiry, relationships and action.','Technology is available, but the proposed task simply replaces paper without improving learning.','An online-learning plan must remain accessible to younger learners and families.','An activity opportunity competes with wellbeing and classroom commitments.'],
  ['A child arrives late and the teacher wants to protect both safety and a calm welcome.','A dismissal plan changes unexpectedly near the end of the day.','A teacher knows in advance that approved leave will affect classes and supervision.','A faculty member develops a fever before school.','An assigned duty and Wednesday professional learning create competing demands.'],
  ['A familiar adult arrives without visitor identification.','A faculty member is hosting a caregiver event on campus.','A new teacher needs help with professional routines and community belonging.','A teacher has not yet read the relevant campus Emergency Manual.','A faculty member wants to make an urgent purchase before approval.'],
  ['A relevant classroom issue may be controversial for families.','A teacher is unsure whether a proposed interaction fits the Code of Conduct.','Clothing must suit active work with young children and a professional meeting.','A staff member becomes aware of credible harassment and a safety risk.','A supplier offers a costly personal gift.'],
  ['A child shows repeated behaviour that affects others but is not an immediate critical incident.','A team is deciding whether a behaviour is isolated, repeated or escalating.','A dress-related conversation could embarrass a child if handled publicly.','A caregiver’s behaviour toward staff becomes aggressive and concerning.','A complex case involves learning, behaviour, wellbeing, family communication and possible safeguarding concerns.'],
] as const;

const secondaryActions = [
  [
    'Preserve the learning goal, remove the avoidable language barrier and offer an equivalent way for the student to show the intended learning.',
    'Allow purposeful home-language sense-making, then help the students communicate the shared learning clearly to the wider group.',
    'Identify the actual barriers and provide equitable support that protects each learner’s dignity and access.',
    'Listen without investigating, avoid promising confidentiality, make an accurate record and follow AISG safeguarding reporting procedures promptly.',
    'Pause the task, restore the student’s dignity and belonging, address the exclusion and adjust the learning conditions before continuing.',
  ],
  [
    'Use a school-authorised channel and share factual, necessary information only with colleagues who need it to support the learner.',
    'Protect the other student’s confidentiality, explain that individual information cannot be shared and focus on the caregiver’s own child and next steps.',
    'Begin with the teacher or person closest to the concern, using specific observations and a clear professional purpose.',
    'Document what remains unresolved and escalate through the appropriate Secondary leadership sequence rather than repeating the same informal conversation.',
    'Revise the message to separate observations from assumptions, limit confidential detail and identify the smallest appropriate audience.',
  ],
  [
    'Share the evidence, invite colleagues into inquiry and take an appropriate leadership role focused on improving student learning.',
    'Use the mid-year evidence to refine the goal or strategy and agree what evidence will show whether the change improves learning.',
    'Reconnect the growth cycle to student impact through evidence, feedback, reflection and an adjusted next step.',
    'Consult the current AISG PLC source and seek clarification rather than importing detailed procedures that the Secondary handbook does not state.',
    'Contribute expertise, build relational trust and help lead the improvement work even without a formal leadership title.',
  ],
  [
    'Use developmentally appropriate Lower Secondary structures that build skills, independence, relationships and a supported transition.',
    'Involve the counselor and programme coordinator so the student and caregiver can compare pathway demands, goals and implications accurately.',
    'Implement the documented accommodation and preserve the intended learning outcome while removing the identified assessment barrier.',
    'Listen and remain a trusted connector, then involve the counselor or appropriate support professional rather than acting as the student’s therapist.',
    'Coordinate the teacher, advisor, counselor and programme coordinator around evidence, wellbeing, pathway requirements and the student’s goals.',
  ],
  [
    'Provide an appropriate make-up opportunity and assess the resulting evidence without reducing the achievement grade as punishment for the excused absence.',
    'Keep the expectation that the work be completed, communicate and arrange support, but do not lower the academic achievement grade because it was late.',
    'Use best-fit professional judgement that weighs the pattern, trajectory, recency and consistency of evidence rather than calculating a simple average.',
    'Report subject achievement from academic evidence and address effort, homework habits and self-management separately through ATL feedback and support.',
    'Determine a defensible best-fit grade from the learning evidence, treat lateness and engagement separately, and create a documented completion and support plan.',
  ],
  [
    'Choose experiences explicitly connected to ATL, service learning or Chinese history and culture, with clear relationship and learning purposes.',
    'Use the current Secondary Trip Procedures and Ramsnet forms; do not assume an Elementary ratio or procedure applies.',
    'Redesign the task so MacBook use materially improves collaboration, communication, creation or learning—or use a simpler tool.',
    'Explain that participation is voluntary, the letter is confidential and submitted directly, and that the handbook expects at least two weeks’ notice.',
    'Coordinate with the student and relevant adults to protect learning, wellbeing and balanced participation rather than treating each commitment in isolation.',
  ],
  [
    'Direct the student to the Secondary Office to complete the late-arrival process, document the pattern and monitor the 90% course-credit requirement.',
    'Follow the closed-campus permission process and involve Secondary leadership rather than allowing an informal departure and return.',
    'Submit leave through ADP, then after approval inform the AP and secretary and provide timely plans for every affected class and duty.',
    'Use the designated short-notice contact process, identify blocks and duties needing cover, send substitute plans, apply for sick leave and remain fever-free for 48 hours without medication before returning.',
    'Plan to meet contract hours, supervise assigned duties actively, support at least three events and attend Wednesday professional learning, raising genuine conflicts early.',
  ],
  [
    'Follow the ID and access process even for a familiar person, seeking security support so convenience does not weaken campus safeguards.',
    'Coordinate the event in advance using the appropriate visitor-registration, identification, security and large-event procedures.',
    'Use the Professional Buddy for curriculum and school processes, the Guangzhou Social Buddy for community transition, and the wider community for additional help.',
    'Read and follow the current Science Park Emergency Manual and protect confidential material rather than relying on another school’s remembered procedure.',
    'Seek approval through the PLC Leader or Secondary Office before purchasing and do not assume an unauthorised personal expense will be reimbursed.',
  ],
  [
    'Frame the topic with a clear educational purpose, balanced perspectives, verified information and age-appropriate, objective facilitation.',
    'Pause and seek guidance before proceeding rather than improvising when a professional boundary is unclear.',
    'Choose clothing that is professional, neat, safe and suitable for active supervision and a meeting with an outside guest.',
    'Raise the serious concern in good faith through the appropriate whistleblowing route and preserve relevant factual information.',
    'Decline or disclose the gift and seek guidance because its timing and value could create or appear to create a conflict of interest.',
  ],
  [
    'Treat the one-sided threats and harmful images as potential student-on-student abuse, preserve information and follow safeguarding escalation rather than mediating it as ordinary conflict.',
    'Use a documented Level 2 team response that reteaches expectations and involves the appropriate caregiver, advisor, GLL, counselor or administrator.',
    'Use Supervised Study as structured support, document and communicate the missing-work plan, and follow the formal academic-integrity process for the separate concern.',
    'Treat the detector result as a prompt for a transparent evidence-based conversation, hear the student’s explanation and follow academic-integrity procedures rather than treating a score as proof.',
    'Separate academic evidence from behaviour, arrange the missed-assessment response, examine the AI concern with the student, document attendance and peer-safety concerns, and coordinate advisor, counselor, caregiver and Secondary leadership support.',
  ],
] as const;

const elementaryActions = [
  [
    'Preserve the learning intention and give the child an equivalent, developmentally appropriate way to show understanding.',
    'Use home language as an asset for rehearsal and meaning-making, then scaffold communication with the wider learning community.',
    'Identify each learner’s barrier and provide equitable access rather than confusing identical treatment with inclusion.',
    'Listen, reassure without promising confidentiality, record accurately and follow AISG safeguarding reporting procedures promptly.',
    'Stop the exclusion, restore the child’s dignity and belonging, and redesign the collaboration before resuming the task.',
  ],
  [
    'Use an authorised channel to share concise observations only with the colleagues who need them to coordinate support.',
    'Protect the other child’s privacy and keep the conversation focused on the caregiver’s child and the next appropriate step.',
    'Begin with the homeroom or person closest to the concern and describe specific evidence rather than labels.',
    'Document what remains unresolved and move to the next appropriate leadership step through the stated concern-resolution process.',
    'Rewrite the message to distinguish observation from interpretation, reduce confidential detail and narrow the audience.',
  ],
  [
    'Bring the evidence to colleagues and help lead a focused inquiry into a change that could improve learner experience.',
    'Adjust the professional goal or strategy in response to the mid-year evidence and define the next evidence to collect.',
    'Use observation, evidence, feedback and reflection to reconnect the growth process to learner impact.',
    'Use the current AISG PLC inquiry process and seek clarification rather than inventing a parallel procedure.',
    'Exercise shared leadership through expertise, initiative and trust even without holding a formal title.',
  ],
  [
    'Design play-based, relational and developmentally appropriate learning that reflects the needs of Early Years learners.',
    'Build a concept-driven PYP inquiry with meaningful disciplinary connections rather than a collection of loosely related activities.',
    'Implement the agreed support plan within classroom learning and collaborate with Learning Support or EAL to remove barriers.',
    'Communicate calmly, respectfully and privately so the child remains safe, heard and able to trust the adults involved.',
    'Coordinate the homeroom teacher, specialists and support staff around academic, social and emotional evidence and the learner’s needs.',
  ],
  [
    'Collect varied, authentic evidence aligned to the intended learning rather than relying on a single convenient task.',
    'Redesign the home-learning task so it is purposeful, manageable by the learner and does not depend on caregiver teaching.',
    'Use the conference to share evidence, make next steps clear and include the learner’s voice in the learning conversation.',
    'Report achievement accurately while explaining the language support and evidence used, without lowering expectations because support was provided.',
    'Use multiple sources and recent patterns of evidence, including learner reflection, to make and explain a defensible judgement.',
  ],
  [
    'Check and follow the current Elementary trip procedure, approval and supervision requirements before confirming the plan.',
    'Design the experience around inquiry, relationships and meaningful action, with a clear connection to current learning.',
    'Use technology only when it improves access, creation, feedback or collaboration; otherwise choose the clearer learning tool.',
    'Provide simple, accessible instructions and predictable support so younger learners and families can participate without unnecessary barriers.',
    'Coordinate commitments with the child, family and relevant adults so participation supports rather than undermines learning and wellbeing.',
  ],
  [
    'Follow the Elementary late-arrival procedure while welcoming the child calmly and recording any pattern that needs follow-up.',
    'Use the authorised dismissal-change process and verify the responsible adult rather than relying on an informal message.',
    'Complete the leave process, notify the appropriate people after approval and provide timely plans for classes and supervision.',
    'Use the short-notice illness process, arrange cover and remain fever-free for the handbook period without medication before returning.',
    'Meet supervision and professional-learning responsibilities, communicating genuine conflicts early so safe cover can be arranged.',
  ],
  [
    'Follow the visitor identification and access process even when the adult is familiar, asking security for support if needed.',
    'Plan the event with the appropriate registration, identification, safeguarding and campus procedures in advance.',
    'Use the Professional Buddy for school practice and the social buddy for community transition while seeking help from the wider community as needed.',
    'Read the current campus Emergency Manual and follow it rather than relying on memory from another setting.',
    'Use the approved purchasing route before spending personal funds and do not assume an unapproved purchase will be reimbursed.',
  ],
  [
    'Teach the issue only with a clear educational purpose, age-appropriate context, accurate information and balanced professional facilitation.',
    'Pause and seek guidance before proceeding when the Code of Conduct or a professional boundary is unclear.',
    'Choose professional, safe clothing suited to active work with children and an external professional meeting.',
    'Raise the credible harassment and safety concern in good faith through the appropriate reporting route.',
    'Decline or disclose the costly gift and seek guidance because it may create or appear to create a conflict of interest.',
  ],
  [
    'Use a proportionate teacher-led response, reteach the expectation, document the pattern and seek team support if it continues or escalates.',
    'Examine frequency, impact, power and context with colleagues before deciding the level of response and support.',
    'Speak privately and respectfully, focus on the stated expectation and avoid shame, bias or public body-policing.',
    'Maintain safety, set a boundary and involve the appropriate leader rather than attempting to manage aggressive adult behaviour alone.',
    'Separate learning, behaviour and wellbeing evidence, coordinate support and family communication, and report any safeguarding concern through the required route.',
  ],
] as const;

const secondaryRefs = [
  ['Sections 1.1–1.9','pp. 5–8'], ['Sections 2–3.1','pp. 8–12'], ['Sections 4–5','pp. 13–15'], ['Sections 6.1–6.5','pp. 15–24'], ['Sections 6.7–6.9','pp. 24–30'], ['Sections 6.6, 6.11–6.12 and 11','pp. 24, 31–32, 53–54'], ['Sections 7.1–7.12','pp. 32–37'], ['Sections 7.17–7.20, 9–10','pp. 38–40, 51–53'], ['Section 8.1','pp. 40–43'], ['Sections 8.2–8.3.5','pp. 43–51'],
] as const;
const elementaryRefs = [
  ['Sections 1.1–1.9','pp. 5–7'], ['Sections 2–3.1','pp. 7–12'], ['Sections 4–5.3','pp. 12–18'], ['Sections 6.1–6.7','pp. 18–22'], ['Sections 6.8–6.10','pp. 22–25'], ['Sections 6.4, 6.11–6.13 and 12','pp. 20, 25, 43'], ['Sections 7.1–7.7','pp. 26–30'], ['Sections 7.10–7.11 and 9–10','pp. 30, 41–43'], ['Section 8.1','pp. 31–34'], ['Sections 8.2–8.3','pp. 34–41'],
] as const;

const secondaryTopics = [
  ['What Guides Us','Mission, core beliefs, language, inclusion and safeguarding responsibility shape every Secondary decision.',['AISG provides inclusive pathways and a secure, healthy, positive environment. Responsibility for learning is shared.','Use common and home languages purposefully. Inclusion removes barriers; safeguarding is everyone’s responsibility.'],['Connect decisions to mission and dignity.','Remove barriers through asset-based thinking.','Follow safeguarding procedures and mandatory reporting expectations.']],
  ['Communication, Contacts & Concerns','Use authorised channels, protect confidential information and escalate unresolved concerns.',['Communication should be clear, purposeful and audience-appropriate. Protect student information and use school-authorised accounts.','Start with the appropriate person closest to the concern, then escalate through Principal/AP, Head of School and Director.'],['Choose the channel for the purpose.','Share the minimum necessary information.','Escalate unresolved concerns respectfully.']],
  ['Professional Growth, Leadership & Collaboration','Leadership is shared, evidence-informed and connected to student impact.',['Leadership can come from anywhere. Faculty contribute to decisions, trust and collective capacity.','Growth and Evaluation uses goals, evidence, review, observations and reflection. Read and follow current PLC procedures.'],['Leadership is broader than job titles.','Use evidence to examine impact.','Do not invent PLC procedures.']],
  ['The Secondary Learning Programme','Understand pathways, support systems and the distinct role of advisory.',['Secondary serves Grades 6–12; Grades 6–10 use the MYP. Upper pathways include Full Diploma, course certificates and AISG courses; the diploma requires 24 credits.','Course changes use a 10-day drop/add period. Learning Support uses equity, plans and accommodations. Advisors connect and advocate but are not counselors or disciplinarians.'],['Know broad pathway differences.','Implement documented adjustments.','Refer beyond your role when needed.']],
  ['Assessment, Homework, Grading & Reporting','Use evidence, best-fit judgement and transparent reporting without punitive grade practices.',['Excused absences receive make-up opportunities. Late or missing work remains expected, but achievement grades are not lowered as punishment.','Homework needs a purpose. Achievement grades represent academic learning; best-fit judgement weighs progress, trajectory and recent evidence.'],['Do not use grades as behaviour penalties.','Best-fit is not simple averaging.','Report current learning from evidence.']],
  ['Learning Beyond the Classroom & Technology','Experiential learning, technology and recommendations require purpose and professional care.',['China Trips connect service or cultural learning, ATL and relationships. Secondary field trips follow their own procedures and Ramsnet forms.','1:1 MacBooks should enhance learning. Recommendation letters are voluntary, confidential, direct-submission and need at least two weeks.'],['Follow Secondary trip procedures.','Make technology purposeful.','Protect recommendation-letter confidentiality.']],
  ['Daily Life, Attendance & Responsibilities','Reliable routines, attendance and leave processes protect learning and safety.',['Students are ready at 7:55; late arrivals report to the Secondary Office. At least 90% attendance is required for course credit; Secondary is closed campus.','Faculty hours are 7:25–15:40. Follow ADP and absence processes, 48-hour fever-free rule, duties, three events and Wednesday professional learning.'],['Document attendance patterns.','Follow the correct leave pathway.','Supervise duties actively.']],
  ['Campus Safety, Visitors & Operations','Security, onboarding, emergency readiness and purchasing depend on shared procedures.',['IDs and visitor registration support campus security; hosting faculty give advance notice. Professional and Guangzhou Social Buddies have distinct roles.','Every faculty member reads the Science Park Emergency Manual. Use approved purchasing routes; unauthorised personal purchases are not automatically reimbursed.'],['Treat access and visitors as safety work.','Know both buddy roles.','Use approved operational processes.']],
  ['Employee Conduct & Professional Standards','Professional judgement, respectful boundaries and good-faith reporting sustain a safe community.',['The Code of Conduct supports a safe, friendly, respectful environment. Ask when unsure. Sensitive topics may be taught objectively, balanced, age-appropriately and professionally.','Dress is professional, neat, safe and context-appropriate. Whistleblowing covers serious risks; avoid gifts that create conflicts.'],['Ask when a boundary is unclear.','Teach sensitive topics with context.','Raise serious concerns in good faith.']],
  ['Student Behaviour, Integrity, AI & Safety','Respond proportionately, distinguish harm from conflict and protect authentic learning.',['CARE FOR SELF, OTHERS, CAMPUS and careful technology use connect behaviour to dignity. Distinguish conflict, mean behaviour, discrimination and abuse; escalate safeguarding concerns.','Academic integrity is shared. Supervised Study is support. Level 1–3 responses are contextual; searches are administrative. AI detectors are not proof—seek evidence and student explanation.'],['Distinguish conflict from abuse.','Use proportionate responses.','Detectors start conversations; they do not prove guilt.']],
] as const;

function makeCourse(id: string, topics: readonly (readonly [string,string,readonly string[],readonly string[]])[], scenarios: readonly (readonly string[])[], actions: readonly (readonly string[])[], refs: readonly (readonly [string,string])[], reviewStatus: string) {
  const sections: AiSection[] = topics.map((topic, si) => ({
    id: `${id}-${si + 1}`, number: si + 1, title: topic[0], summary: topic[1], learn: [
      ...topic[2],
      `Think in practice: ${scenarios[si][0]} Before deciding, separate what you have observed from what you have assumed, identify the learner or community need, and use the relevant AISG process.`,
      `Apply this section by asking: What evidence matters? What belongs to my role? Who else should be involved? Use the handbook principles to choose a timely, proportionate and respectful response.`,
    ], takeaways: [...topic[3]],
    questions: prompts.map((p, qi) => {
      const principle = topic[3][qi % topic[3].length];
      const principleText = principle.replace(/\.$/, '');
      const strong = actions[si][qi];
      const distractors = actions[si].filter((_, actionIndex) => actionIndex !== qi).slice(0, 3);
      const correctIndex = (si + qi) % 4;
      const choices = [...distractors]; choices.splice(correctIndex, 0, strong);
      const answer = String.fromCharCode(97 + correctIndex);
      const questionNumber = si * 5 + qi + 1;
      const assessmentLevel = qi === 0 ? 'Foundation' : qi < 3 ? 'Application' : qi === 3 ? 'Professional Judgement' : 'Synthesis';
      const contentOwner = id === 'secondary' ? 'Secondary Leadership' : 'Elementary Leadership';
      const optionFeedback = Object.fromEntries(choices.map((choice, index) => [String.fromCharCode(97 + index), index === correctIndex ? '' : `“${choice}” reflects a related handbook idea, but it does not respond to the central issue in this scenario. The stronger response is to ${strong.charAt(0).toLowerCase()}${strong.slice(1)} This matters because faculty must ${principleText.toLowerCase()} within the documented AISG process.`]));
      return { id: `${id}-${questionNumber}`, courseVersion: FACULTY_COURSE_VERSION, module: `${id}-${si + 1}`, questionNumber, title: topic[0], questionType: 'single_choice' as const, learningObjective: topic[1], section: `${si + 1}. ${topic[0]}`, question: p, scenario: scenarios[si][qi], options: choices.map((text, index) => ({ id: String.fromCharCode(97 + index), text })), answer, correctAnswer: [answer], correctFeedback: `Correct. ${principle} This response is strongest because it applies the handbook expectation while preserving appropriate professional judgement.`, incorrectFeedback: `Not quite. Revisit ${topic[0]} and choose the response that follows the handbook, uses evidence and involves the right people.`, optionFeedback, assessmentLevel, handbookSection: refs[si][0], handbookPage: refs[si][1], contentTags: [id, topic[0].toLowerCase(), assessmentLevel.toLowerCase()], contentOwner, status: reviewStatus, reviewStatus, criticalSafeguarding: [2,6,9,14,19,24,29,31,34,36,39,41,44,45,46,47,48,49,50].includes(questionNumber) };
    })
  }));
  return { sections, questions: sections.flatMap((s) => s.questions) };
}

export const { sections: secondarySections, questions: secondaryQuestions } = makeCourse('secondary', secondaryTopics, secondaryScenarios, secondaryActions, secondaryRefs, 'draft_for_secondary_leadership_review');
export const { sections: elementarySections, questions: elementaryQuestions } = makeCourse('elementary', secondaryTopics.map((t, i) => [ ['What Guides Us','Communication & Collaboration','Professional Growth & PLCs','Elementary Learning Programme','Assessment & Reporting','Learning Beyond the Classroom','Daily Life & Routines','Campus Safety & Operations','Employee Conduct','Student Wellbeing & Behaviour'][i], t[1].replaceAll('Secondary','Elementary'), t[2].map((x) => x.replaceAll('Secondary','Elementary').replaceAll('Grades 6–12','Pre-K–Grade 5').replace('Grades 6–10 use the MYP. Upper pathways include Full Diploma, course certificates and AISG courses; the diploma requires 24 credits.','Elementary learning spans Early Years, Lower Elementary and Upper Elementary through the PYP Programme of Inquiry.').replace('Course changes use a 10-day drop/add period. Learning Support uses equity, plans and accommodations. Advisors connect and advocate but are not counselors or disciplinarians.','Learning Support and EAL plans remove barriers; homeroom teachers coordinate academic, social and emotional support with the appropriate specialists.')), t[3] ] as const), elementaryScenarios, elementaryActions, elementaryRefs, 'draft_for_elementary_leadership_review');
