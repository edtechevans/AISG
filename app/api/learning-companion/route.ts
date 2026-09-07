import { COURSE_CONNECTIONS } from '@/lib/course-connections';
import { companionGrounding } from '@/lib/learning-companion-knowledge';
import { COURSE_BY_ID, isCourseId, type CourseId } from '@/lib/course-catalog';
import { getLearnerBootstrap } from '@/lib/server-data';

export const dynamic = 'force-dynamic';

type CompanionStage = 'course-home' | 'learn' | 'check' | 'practice' | 'result';

type CompanionRequest = {
  course?: string;
  stage?: CompanionStage;
  sectionTitle?: string;
  summary?: string;
  body?: string;
  takeaways?: string[];
  prompt?: string;
  action?: 'explain' | 'tlf' | 'challenge' | 'apply' | 'culture' | 'connect';
  messages?: { role: 'user' | 'assistant'; text: string }[];
};

type OpenAIResponse = {
  output?: { content?: { type?: string; text?: string }[] }[];
  error?: { message?: string };
};

const sensitivePattern = /(real student|student name|named student|disclos|abuse|self-harm|safeguard|report a concern|child protection|cpoms|student id|date of birth)/i;

function modeInstruction(action: CompanionRequest['action']) {
  if (action === 'explain') return 'Explain the current idea differently, preserving its complexity while making the core distinction clearer.';
  if (action === 'tlf') return 'Connect the current idea to AISG’s Transformative Learning Framework only where the supplied grounding supports a natural connection. Do not force a facet.';
  if (action === 'challenge') return 'Challenge the educator’s current thinking constructively. Surface one assumption, one plausible alternative interpretation, and one piece of learner evidence that could change the judgement.';
  if (action === 'apply') return 'Turn the idea into one small, realistic professional move that could be tried soon. Include what learner evidence to notice before judging impact.';
  if (action === 'culture') return 'Apply a culturally and linguistically responsive lens suitable for AISG’s multilingual international-school context in Guangzhou and southern China. Avoid stereotypes and essentialising identity.';
  if (action === 'connect') return 'Use the supplied cross-course connections to explain how another AISG course could deepen or complicate this idea.';
  return 'Respond to the educator’s professional-learning question using the current course context and supplied AISG grounding.';
}

function safeText(value: unknown, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function staticSensitiveResponse(course: CourseId) {
  if (course === 'safeguarding') {
    return 'If this concerns a real student or a live safeguarding matter, stop using the Learning Companion for case advice. Do not enter identifying information. Follow current AISG safeguarding and reporting procedures and contact the appropriate designated staff or reporting system.';
  }
  return 'Please do not enter student names or identifying information. If your question concerns a real student, rewrite it as a de-identified professional-learning scenario. If there is a safeguarding concern, follow current AISG safeguarding and reporting procedures rather than using the Learning Companion for case advice.';
}

export async function POST(request: Request) {
  try {
    await getLearnerBootstrap();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AUTH_REQUIRED';
    return Response.json({ error: message }, { status: message === 'AUTH_REQUIRED' ? 401 : 500 });
  }

  let payload: CompanionRequest;
  try {
    payload = await request.json() as CompanionRequest;
  } catch {
    return Response.json({ error: 'INVALID_REQUEST' }, { status: 400 });
  }

  if (!payload.course || !isCourseId(payload.course)) return Response.json({ error: 'INVALID_COURSE' }, { status: 400 });
  const course = payload.course;
  const stage = payload.stage || 'course-home';
  const prompt = safeText(payload.prompt, 1800);

  if (stage === 'check') {
    return Response.json({
      answer: 'Your judgement comes first during formal learning checks. Finish the check using your own reasoning, then return to the learning content and I can help unpack the principle.',
      sources: [COURSE_BY_ID[course].title],
      mode: 'locked',
    }, { status: 409 });
  }

  if (sensitivePattern.test(prompt)) {
    return Response.json({ answer: staticSensitiveResponse(course), sources: companionGrounding(course).sources, mode: 'safety' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'AI_NOT_CONFIGURED' }, { status: 503 });
  }

  const knowledge = companionGrounding(course);
  const connections = COURSE_CONNECTIONS[course]
    .map((connection) => `${COURSE_BY_ID[connection.course].title}: ${connection.reason}`)
    .join('\n');
  const history = (payload.messages || [])
    .slice(-6)
    .map((message) => `${message.role === 'assistant' ? 'Companion' : 'Educator'}: ${safeText(message.text, 800)}`)
    .join('\n');

  const instructions = `You are the AISG Learning Companion, a professional-learning coach for educators at the American International School of Guangzhou.

Your job is to deepen understanding, professional judgement and transfer to practice. Do not perform the educator's thinking for them.

Hard boundaries:
- Use only the supplied course context, AISG grounding and cross-course connections. Do not invent AISG policy, procedures, frameworks, approval status or local facts.
- The TLF is a lens, not a checklist. Make a TLF connection only when it is conceptually warranted.
- Use cultural humility in AISG's multilingual international-school context in Guangzhou and southern China. Avoid stereotypes, national-character claims and essentialising identity.
- Never reveal, infer or steer toward answers during a formal learning check.
- Do not provide case-management advice about an identifiable student. Do not ask for names or identifying details.
- For safeguarding matters, direct the educator to current AISG safeguarding/reporting procedures; do not investigate or improvise case advice.
- Preserve worthwhile cognitive demand. Distinguish scaffolding access from lowering the learning goal.
- When evidence is ambiguous, say what remains uncertain and suggest what learner evidence could clarify the judgement.

Response style:
- 180–350 words unless the question clearly needs less.
- Professional, intellectually serious and practical.
- Prefer one clear distinction, one contextual example or alternative lens, and one question that returns agency to the educator.
- Do not use generic motivational language.
- Do not fabricate citations. The application will display the approved source labels separately.`;

  const input = `MODE
${modeInstruction(payload.action)}

COURSE
${knowledge.courseTitle}
${knowledge.courseDescription}

GROUNDING
${knowledge.grounding}

CULTURAL RESPONSIVENESS
${knowledge.culture}

TLF CONNECTION
${knowledge.tlf}

CURRENT COURSE CONTEXT
Stage: ${stage}
Section: ${safeText(payload.sectionTitle, 300) || knowledge.courseTitle}
Summary: ${safeText(payload.summary, 1600)}
Learning text: ${safeText(payload.body, 4500)}
Takeaways: ${(payload.takeaways || []).slice(0, 5).map((item) => safeText(item, 500)).filter(Boolean).join(' | ')}

MEANINGFUL CROSS-COURSE CONNECTIONS
${connections}

RECENT CONVERSATION
${history || 'No previous exchange.'}

EDUCATOR QUESTION
${prompt || 'Use the selected mode on the current learning.'}`;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_COMPANION_MODEL || 'gpt-5.6-luna',
      instructions,
      input,
      max_output_tokens: 700,
    }),
  });

  const data = await response.json() as OpenAIResponse;
  if (!response.ok) {
    return Response.json({ error: data.error?.message || 'AI_REQUEST_FAILED' }, { status: 502 });
  }

  const answer = data.output
    ?.flatMap((item) => Array.isArray(item.content) ? item.content : [])
    .find((content) => content.type === 'output_text' && typeof content.text === 'string')
    ?.text?.trim();

  if (!answer) return Response.json({ error: 'EMPTY_AI_RESPONSE' }, { status: 502 });

  return Response.json({ answer, sources: knowledge.sources, mode: 'ai' });
}
