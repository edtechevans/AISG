import { env } from 'cloudflare:workers';
import questionSeed from '@/content/questions.json';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { COURSE_VERSION, COURSE_VERSION_ID, DEFAULT_PASS_THRESHOLD, courseModules, type Question } from '@/lib/course';

type Actor = { id: string; authUserId: string; email: string; name: string; role: 'LEARNER' | 'ADMIN'; userType: string; division: string | null };
type D1Row = Record<string, unknown>;

const now = () => Date.now();
const uid = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const stringValue = (value: unknown) => typeof value === 'string' ? value : '';

function db(): D1Database {
  if (!env.DB) throw new Error('D1 binding DB is unavailable.');
  return env.DB;
}

async function first<T = D1Row>(sql: string, ...values: unknown[]): Promise<T | null> {
  return (await db().prepare(sql).bind(...values).first<T>()) ?? null;
}

async function all<T = D1Row>(sql: string, ...values: unknown[]): Promise<T[]> {
  const result = await db().prepare(sql).bind(...values).all<T>();
  return result.results ?? [];
}

export async function ensureSeeded() {
  const existing = await first<{ id: string }>('SELECT id FROM course_versions WHERE id = ?', COURSE_VERSION_ID);
  if (existing) return;
  const created = now();
  const statements = [
    db().prepare('INSERT INTO courses (id, title, description, created_at) VALUES (?, ?, ?, ?)')
      .bind('aisg-student-safeguarding', 'AISG Student Safeguarding Training', 'Annual safeguarding learning and assessment for adults working with AISG students.', created),
    db().prepare('INSERT INTO course_versions (id, course_id, version_code, title, pass_threshold, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(COURSE_VERSION_ID, 'aisg-student-safeguarding', COURSE_VERSION, 'Student Safeguarding Training SY2026-27', DEFAULT_PASS_THRESHOLD, 'draft_for_safeguarding_team_review', created),
    ...courseModules.map((module) => db().prepare('INSERT INTO modules (id, course_version_id, module_number, title, summary, learning_content) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(module.id, COURSE_VERSION_ID, module.number, module.title, module.summary, module.learningContent)),
    ...(questionSeed as Question[]).map((q) => db().prepare(`INSERT INTO questions (
      id, course_version, module, question_number, title, question_type, learning_objective, scenario, question,
      answer_options, correct_answer, correct_feedback, incorrect_feedback, handbook_section, handbook_page,
      content_tags, critical_safeguarding, status, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(q.id, q.courseVersion, q.module, q.questionNumber, q.title, q.questionType, q.learningObjective, q.scenario, q.question,
        JSON.stringify(q.answerOptions), JSON.stringify(q.correctAnswer), q.correctFeedback, q.incorrectFeedback, q.handbookSection,
        q.handbookPage, JSON.stringify(q.contentTags), q.criticalSafeguarding ? 1 : 0, q.status, created)),
  ];
  await db().batch(statements);
  await seedFictionalLearners(created);
}

async function seedFictionalLearners(created: number) {
  const day = 86_400_000;
  const learners = [
    ['demo-avery', 'Avery Chen', 'avery.chen@example.invalid', 'Faculty', 'Upper Elementary', 30, 93, 'PASSED', 1, created - 8 * day],
    ['demo-maya', 'Maya Singh', 'maya.singh@example.invalid', 'Educational Assistant', 'Lower Elementary', 30, 80, 'PASSED', 1, created - 4 * day],
    ['demo-ethan', 'Ethan Park', 'ethan.park@example.invalid', 'Coach', 'Athletics', 17, null, 'IN_PROGRESS', 1, created - day],
    ['demo-sofia', 'Sofia Torres', 'sofia.torres@example.invalid', 'Faculty', 'Secondary', 0, null, 'NOT_STARTED', 0, created - 10 * day],
    ['demo-noah', 'Noah Williams', 'noah.williams@example.invalid', 'Substitute', 'Whole School', 30, 73, 'NEEDS_ANOTHER_ATTEMPT', 2, created - 2 * day],
    ['demo-lina', 'Lina Zhao', 'lina.zhao@example.invalid', 'Counselor', 'Secondary', 30, 97, 'PASSED', 1, created - 6 * day],
    ['demo-ravi', 'Ravi Menon', 'ravi.menon@example.invalid', 'Leadership', 'Whole School', 7, null, 'IN_PROGRESS', 1, created - 3 * day],
    ['demo-amelia', 'Amelia Hart', 'amelia.hart@example.invalid', 'Staff', 'Operations', 0, null, 'NOT_STARTED', 0, created - 12 * day],
  ] as const;
  const statements: D1PreparedStatement[] = [];
  for (const [id, name, email, userType, division, completed, score, status, attemptNo, activity] of learners) {
    statements.push(db().prepare('INSERT INTO users (id, auth_user_id, email, name, role, user_type, division, created_at, updated_at) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, email, name, 'LEARNER', userType, division, created - 30 * day, activity));
    statements.push(db().prepare('INSERT INTO progress (id, user_id, course_version_id, current_module, current_question, questions_completed, percentage_progress, latest_activity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(`progress-${id}`, id, COURSE_VERSION_ID, Math.min(6, Math.floor(Number(completed) / 5) + 1), Math.min(30, Number(completed) + 1), completed, Math.round(Number(completed) / 30 * 100), activity));
    if (attemptNo) {
      const attemptId = `attempt-${id}-${attemptNo}`;
      statements.push(db().prepare('INSERT INTO attempts (id, user_id, course_version_id, attempt_number, started_at, completed_at, score, percentage, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(attemptId, id, COURSE_VERSION_ID, attemptNo, activity - 3 * day, status === 'IN_PROGRESS' ? null : activity, score, score, status));
      if (status === 'PASSED') {
        statements.push(db().prepare('INSERT INTO completions (id, user_id, course_version_id, attempt_id, score, percentage, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
          .bind(`completion-${id}`, id, COURSE_VERSION_ID, attemptId, score, score, activity));
      }
    }
  }
  await db().batch(statements);
}

export async function getActor(): Promise<Actor> {
  await ensureSeeded();
  const auth = await getChatGPTUser();
  const local = process.env.NODE_ENV !== 'production' ? { userId: 'local-seedy', email: 'seedy@sites.test', displayName: 'Safeguarding Reviewer' } : null;
  const identity = auth ?? local;
  if (!identity) throw new Error('AUTH_REQUIRED');
  const actor = await first<Actor>('SELECT id, auth_user_id as authUserId, email, name, role, user_type as userType, division FROM users WHERE auth_user_id = ? OR email = ? LIMIT 1', identity.userId, identity.email);
  if (actor) {
    if (!actor.authUserId) {
      await db().prepare('UPDATE users SET auth_user_id = ?, updated_at = ? WHERE id = ?').bind(identity.userId, now(), actor.id).run();
      actor.authUserId = identity.userId;
    }
    return actor;
  }
  const admin = await first<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN' AND auth_user_id IS NOT NULL");
  const role = Number(admin?.count ?? 0) === 0 ? 'ADMIN' : 'LEARNER';
  const id = uid('user');
  await db().prepare('INSERT INTO users (id, auth_user_id, email, name, role, user_type, division, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, identity.userId, identity.email, identity.displayName, role, 'Faculty', null, now(), now()).run();
  await db().prepare('INSERT INTO audit_log (id, actor_user_id, event_type, entity_type, entity_id, metadata, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(uid('audit'), id, 'USER_BOOTSTRAPPED', 'user', id, JSON.stringify({ role }), now()).run();
  return { id, authUserId: identity.userId, email: identity.email, name: identity.displayName, role, userType: 'Faculty', division: null };
}

function parseQuestion(row: D1Row, includeAnswers = false): Question {
  const q: Question = {
    id: String(row.id), courseVersion: String(row.course_version), module: String(row.module), questionNumber: Number(row.question_number),
    title: String(row.title), questionType: row.question_type as Question['questionType'], learningObjective: String(row.learning_objective),
    scenario: String(row.scenario), question: String(row.question), answerOptions: JSON.parse(String(row.answer_options)), handbookSection: String(row.handbook_section),
    handbookPage: Number(row.handbook_page), contentTags: JSON.parse(String(row.content_tags)), criticalSafeguarding: Boolean(row.critical_safeguarding), status: String(row.status),
  };
  if (includeAnswers) {
    q.correctAnswer = JSON.parse(String(row.correct_answer));
    q.correctFeedback = String(row.correct_feedback);
    q.incorrectFeedback = String(row.incorrect_feedback);
  }
  return q;
}

async function activeAttempt(userId: string) {
  const attempt = await first<D1Row>("SELECT * FROM attempts WHERE user_id = ? AND course_version_id = ? AND status = 'IN_PROGRESS' ORDER BY attempt_number DESC LIMIT 1", userId, COURSE_VERSION_ID);
  if (attempt) return attempt;
  const latest = await first<D1Row>('SELECT * FROM attempts WHERE user_id = ? AND course_version_id = ? ORDER BY attempt_number DESC LIMIT 1', userId, COURSE_VERSION_ID);
  if (latest && (latest.status === 'PASSED' || latest.status === 'NEEDS_ANOTHER_ATTEMPT')) return latest;
  const count = await first<{ count: number }>('SELECT COUNT(*) as count FROM attempts WHERE user_id = ? AND course_version_id = ?', userId, COURSE_VERSION_ID);
  const id = uid('attempt');
  await db().prepare('INSERT INTO attempts (id, user_id, course_version_id, attempt_number, started_at, status) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(id, userId, COURSE_VERSION_ID, Number(count?.count ?? 0) + 1, now(), 'IN_PROGRESS').run();
  await db().prepare(`INSERT INTO progress (id, user_id, course_version_id, current_module, current_question, questions_completed, percentage_progress, latest_activity)
    VALUES (?, ?, ?, 1, 1, 0, 0, ?) ON CONFLICT(user_id, course_version_id) DO UPDATE SET latest_activity = excluded.latest_activity`)
    .bind(uid('progress'), userId, COURSE_VERSION_ID, now()).run();
  return await first<D1Row>('SELECT * FROM attempts WHERE id = ?', id);
}

export async function getLearnerBootstrap() {
  const actor = await getActor();
  const attempt = await activeAttempt(actor.id);
  const version = await first<{ pass_threshold: number }>('SELECT pass_threshold FROM course_versions WHERE id = ?', COURSE_VERSION_ID);
  const rows = await all('SELECT * FROM questions WHERE course_version = ? ORDER BY question_number', COURSE_VERSION);
  const responses = attempt ? await all('SELECT question_id, answer, is_correct FROM question_responses WHERE attempt_id = ? ORDER BY answered_at', attempt.id) : [];
  const learnerProgress = await first<D1Row>('SELECT * FROM progress WHERE user_id = ? AND course_version_id = ?', actor.id, COURSE_VERSION_ID);
  return {
    user: actor,
    questions: rows.map((row) => parseQuestion(row)),
    modules: courseModules,
    passThreshold: Number(version?.pass_threshold ?? DEFAULT_PASS_THRESHOLD),
    attempt: attempt ? { id: attempt.id, attemptNumber: attempt.attempt_number, status: attempt.status, score: attempt.score, percentage: attempt.percentage, completedAt: attempt.completed_at } : null,
    responses: responses.map((r) => ({ questionId: r.question_id, answer: JSON.parse(String(r.answer)), isCorrect: Boolean(r.is_correct) })),
    progress: learnerProgress ? { currentModule: learnerProgress.current_module, currentQuestion: learnerProgress.current_question, completed: learnerProgress.questions_completed, percentage: learnerProgress.percentage_progress, latestActivity: learnerProgress.latest_activity } : null,
  };
}

export async function submitAnswer(questionId: string, selected: string[]) {
  const actor = await getActor();
  const attempt = await activeAttempt(actor.id);
  if (!attempt || attempt.status !== 'IN_PROGRESS') throw new Error('ATTEMPT_NOT_ACTIVE');
  const row = await first<D1Row>('SELECT * FROM questions WHERE id = ?', questionId);
  if (!row) throw new Error('QUESTION_NOT_FOUND');
  const q = parseQuestion(row, true);
  const correct = q.correctAnswer ?? [];
  const normalise = (values: string[]) => q.questionType === 'sequence' ? values : [...values].sort();
  const isCorrect = JSON.stringify(normalise(selected)) === JSON.stringify(normalise(correct));
  const answered = now();
  await db().prepare(`INSERT INTO question_responses (id, attempt_id, question_id, answer, is_correct, answered_at)
    VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(attempt_id, question_id) DO UPDATE SET answer = excluded.answer, is_correct = excluded.is_correct, answered_at = excluded.answered_at`)
    .bind(uid('response'), attempt.id, questionId, JSON.stringify(selected), isCorrect ? 1 : 0, answered).run();
  const counts = await first<{ total: number; correct: number }>('SELECT COUNT(*) as total, SUM(is_correct) as correct FROM question_responses WHERE attempt_id = ?', attempt.id);
  const total = Number(counts?.total ?? 0);
  const nextQuestion = Math.min(30, Math.max(q.questionNumber + 1, total + 1));
  const moduleNumber = Math.min(6, Math.ceil(nextQuestion / 5));
  await db().prepare('UPDATE progress SET current_module = ?, current_question = ?, questions_completed = ?, percentage_progress = ?, latest_activity = ? WHERE user_id = ? AND course_version_id = ?')
    .bind(moduleNumber, nextQuestion, total, Math.round(total / 30 * 100), answered, actor.id, COURSE_VERSION_ID).run();
  return { isCorrect, feedback: isCorrect ? q.correctFeedback : q.incorrectFeedback, correctAnswer: correct, criticalSafeguarding: q.criticalSafeguarding };
}

export async function finalizeAttempt() {
  const actor = await getActor();
  const attempt = await activeAttempt(actor.id);
  if (!attempt || attempt.status !== 'IN_PROGRESS') throw new Error('ATTEMPT_NOT_ACTIVE');
  const counts = await first<{ total: number; correct: number }>('SELECT COUNT(*) as total, SUM(is_correct) as correct FROM question_responses WHERE attempt_id = ?', attempt.id);
  const total = Number(counts?.total ?? 0);
  if (total < 30) throw new Error('ASSESSMENT_INCOMPLETE');
  const score = Number(counts?.correct ?? 0);
  const percentage = Math.round(score / 30 * 100);
  const version = await first<{ pass_threshold: number }>('SELECT pass_threshold FROM course_versions WHERE id = ?', COURSE_VERSION_ID);
  const threshold = Number(version?.pass_threshold ?? DEFAULT_PASS_THRESHOLD);
  const passed = percentage >= threshold;
  const completed = now();
  await db().prepare('UPDATE attempts SET completed_at = ?, score = ?, percentage = ?, status = ? WHERE id = ?')
    .bind(completed, score, percentage, passed ? 'PASSED' : 'NEEDS_ANOTHER_ATTEMPT', attempt.id).run();
  if (passed) {
    await db().prepare('INSERT INTO completions (id, user_id, course_version_id, attempt_id, score, percentage, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(uid('completion'), actor.id, COURSE_VERSION_ID, attempt.id, score, percentage, completed).run();
  }
  await db().prepare('UPDATE progress SET current_module = 6, current_question = 30, questions_completed = 30, percentage_progress = 100, latest_activity = ? WHERE user_id = ? AND course_version_id = ?')
    .bind(completed, actor.id, COURSE_VERSION_ID).run();
  await db().prepare('INSERT INTO audit_log (id, actor_user_id, event_type, entity_type, entity_id, metadata, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(uid('audit'), actor.id, 'ATTEMPT_COMPLETED', 'attempt', String(attempt.id), JSON.stringify({ score, percentage, passed, threshold }), completed).run();
  const moduleScores = await all<{ module: string; correct: number; total: number }>(`SELECT q.module as module, SUM(r.is_correct) as correct, COUNT(*) as total
    FROM question_responses r JOIN questions q ON q.id = r.question_id WHERE r.attempt_id = ? GROUP BY q.module ORDER BY q.module`, attempt.id);
  return { score, percentage, passed, threshold, completedAt: completed, moduleScores };
}

export async function startRetake() {
  const actor = await getActor();
  const existing = await first<D1Row>("SELECT id FROM attempts WHERE user_id = ? AND course_version_id = ? AND status = 'IN_PROGRESS'", actor.id, COURSE_VERSION_ID);
  if (existing) return { ok: true };
  const count = await first<{ count: number }>('SELECT COUNT(*) as count FROM attempts WHERE user_id = ? AND course_version_id = ?', actor.id, COURSE_VERSION_ID);
  await db().prepare('INSERT INTO attempts (id, user_id, course_version_id, attempt_number, started_at, status) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(uid('attempt'), actor.id, COURSE_VERSION_ID, Number(count?.count ?? 0) + 1, now(), 'IN_PROGRESS').run();
  await db().prepare('UPDATE progress SET current_module = 1, current_question = 1, questions_completed = 0, percentage_progress = 0, latest_activity = ? WHERE user_id = ? AND course_version_id = ?')
    .bind(now(), actor.id, COURSE_VERSION_ID).run();
  return { ok: true };
}

export async function requireAdmin() {
  const actor = await getActor();
  if (actor.role !== 'ADMIN') throw new Error('ADMIN_REQUIRED');
  return actor;
}

export async function getAdminDashboardData() {
  const actor = await requireAdmin();
  const version = await first<{ pass_threshold: number }>('SELECT pass_threshold FROM course_versions WHERE id = ?', COURSE_VERSION_ID);
  const learners = await all<D1Row>(`SELECT u.id, u.name, u.email, u.user_type, u.division, u.role,
    COALESCE(p.questions_completed, 0) as questions_completed, COALESCE(p.percentage_progress, 0) as progress,
    p.latest_activity,
    (SELECT COUNT(*) FROM attempts a WHERE a.user_id = u.id AND a.course_version_id = ?) as attempts,
    (SELECT a.status FROM attempts a WHERE a.user_id = u.id AND a.course_version_id = ? ORDER BY a.attempt_number DESC LIMIT 1) as status,
    (SELECT a.percentage FROM attempts a WHERE a.user_id = u.id AND a.course_version_id = ? ORDER BY a.attempt_number DESC LIMIT 1) as score,
    (SELECT a.started_at FROM attempts a WHERE a.user_id = u.id AND a.course_version_id = ? ORDER BY a.attempt_number ASC LIMIT 1) as started,
    (SELECT c.completed_at FROM completions c WHERE c.user_id = u.id AND c.course_version_id = ? ORDER BY c.completed_at DESC LIMIT 1) as completed
    FROM users u LEFT JOIN progress p ON p.user_id = u.id AND p.course_version_id = ? WHERE u.role = 'LEARNER' ORDER BY u.name`,
    COURSE_VERSION_ID, COURSE_VERSION_ID, COURSE_VERSION_ID, COURSE_VERSION_ID, COURSE_VERSION_ID, COURSE_VERSION_ID);
  const normalised = learners.map((l) => ({
    id: String(l.id), name: String(l.name), email: String(l.email), userType: String(l.user_type), division: l.division == null ? 'Not assigned' : stringValue(l.division), progress: Number(l.progress),
    score: l.score == null ? null : Number(l.score), attempts: Number(l.attempts), status: l.status == null ? (Number(l.progress) > 0 ? 'IN_PROGRESS' : 'NOT_STARTED') : stringValue(l.status),
    started: l.started == null ? null : Number(l.started), latestActivity: l.latest_activity == null ? null : Number(l.latest_activity), completed: l.completed == null ? null : Number(l.completed),
  }));
  const total = normalised.length;
  const count = (status: string) => normalised.filter((l) => l.status === status).length;
  return { actor, passThreshold: Number(version?.pass_threshold ?? DEFAULT_PASS_THRESHOLD), learners: normalised, metrics: { total, notStarted: count('NOT_STARTED'), inProgress: count('IN_PROGRESS'), completed: count('PASSED'), passed: count('PASSED'), needsRetake: count('NEEDS_ANOTHER_ATTEMPT'), completionPercentage: total ? Math.round(count('PASSED') / total * 100) : 0 } };
}

export async function updatePassThreshold(value: number) {
  const actor = await requireAdmin();
  if (!Number.isInteger(value) || value < 50 || value > 100) throw new Error('INVALID_PASS_THRESHOLD');
  await db().prepare('UPDATE course_versions SET pass_threshold = ? WHERE id = ?').bind(value, COURSE_VERSION_ID).run();
  await db().prepare('INSERT INTO audit_log (id, actor_user_id, event_type, entity_type, entity_id, metadata, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(uid('audit'), actor.id, 'PASS_THRESHOLD_UPDATED', 'course_version', COURSE_VERSION_ID, JSON.stringify({ passThreshold: value }), now()).run();
  return { ok: true, passThreshold: value };
}

export async function getAdminQuestions() {
  await requireAdmin();
  const rows = await all('SELECT * FROM questions WHERE course_version = ? ORDER BY question_number', COURSE_VERSION);
  return rows.map((row) => parseQuestion(row, true));
}

export async function updateAdminQuestion(input: Question) {
  const actor = await requireAdmin();
  const allowedStatus = ['draft_for_safeguarding_team_review', 'approved', 'needs_revision'];
  if (!allowedStatus.includes(input.status)) throw new Error('INVALID_STATUS');
  if (!input.answerOptions.length || !input.correctAnswer?.length || input.correctAnswer.some((id) => !input.answerOptions.some((o) => o.id === id))) throw new Error('INVALID_ANSWER_CONFIGURATION');
  await db().prepare(`UPDATE questions SET title = ?, learning_objective = ?, scenario = ?, question = ?, answer_options = ?, correct_answer = ?, correct_feedback = ?, incorrect_feedback = ?, handbook_section = ?, handbook_page = ?, content_tags = ?, critical_safeguarding = ?, status = ?, updated_at = ? WHERE id = ?`)
    .bind(input.title, input.learningObjective, input.scenario, input.question, JSON.stringify(input.answerOptions), JSON.stringify(input.correctAnswer), input.correctFeedback, input.incorrectFeedback, input.handbookSection, input.handbookPage, JSON.stringify(input.contentTags), input.criticalSafeguarding ? 1 : 0, input.status, now(), input.id).run();
  await db().prepare('INSERT INTO audit_log (id, actor_user_id, event_type, entity_type, entity_id, metadata, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(uid('audit'), actor.id, 'QUESTION_UPDATED', 'question', input.id, JSON.stringify({ status: input.status }), now()).run();
  return { ok: true };
}

export async function getLearnerDetail(id: string) {
  await requireAdmin();
  const learner = await first<D1Row>('SELECT id, name, email, user_type as userType, division, created_at as createdAt FROM users WHERE id = ? AND role = ?', id, 'LEARNER');
  if (!learner) return null;
  const learnerProgress = await first<D1Row>('SELECT * FROM progress WHERE user_id = ? AND course_version_id = ?', id, COURSE_VERSION_ID);
  const learnerAttempts = await all<D1Row>('SELECT id, attempt_number, started_at, completed_at, score, percentage, status FROM attempts WHERE user_id = ? AND course_version_id = ? ORDER BY attempt_number DESC', id, COURSE_VERSION_ID);
  return {
    learner: { id: String(learner.id), name: String(learner.name), email: String(learner.email), userType: String(learner.userType), division: learner.division == null ? null : stringValue(learner.division), createdAt: Number(learner.createdAt) },
    progress: learnerProgress ? { questionsCompleted: Number(learnerProgress.questions_completed), currentModule: Number(learnerProgress.current_module), percentageProgress: Number(learnerProgress.percentage_progress), latestActivity: Number(learnerProgress.latest_activity) } : null,
    attempts: learnerAttempts.map((attempt) => ({ id: String(attempt.id), attemptNumber: Number(attempt.attempt_number), startedAt: Number(attempt.started_at), completedAt: attempt.completed_at == null ? null : Number(attempt.completed_at), percentage: attempt.percentage == null ? null : Number(attempt.percentage), status: String(attempt.status) })),
  };
}
