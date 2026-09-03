import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  authUserId: text('auth_user_id'),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['LEARNER', 'ADMIN'] }).notNull().default('LEARNER'),
  userType: text('user_type').notNull().default('Faculty'),
  division: text('division'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
}, (table) => [
  uniqueIndex('idx_users_email').on(table.email),
  uniqueIndex('idx_users_auth_user_id').on(table.authUserId),
  index('idx_users_role').on(table.role),
]);

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const courseVersions = sqliteTable('course_versions', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id),
  versionCode: text('version_code').notNull(),
  title: text('title').notNull(),
  passThreshold: integer('pass_threshold').notNull().default(80),
  status: text('status').notNull().default('draft_for_safeguarding_team_review'),
  createdAt: integer('created_at').notNull(),
}, (table) => [uniqueIndex('idx_course_versions_code').on(table.versionCode)]);

export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(),
  courseVersionId: text('course_version_id').notNull().references(() => courseVersions.id),
  moduleNumber: integer('module_number').notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  learningContent: text('learning_content').notNull(),
}, (table) => [
  uniqueIndex('idx_modules_version_number').on(table.courseVersionId, table.moduleNumber),
]);

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  courseVersion: text('course_version').notNull(),
  module: text('module').notNull(),
  questionNumber: integer('question_number').notNull(),
  title: text('title').notNull(),
  questionType: text('question_type').notNull(),
  learningObjective: text('learning_objective').notNull(),
  scenario: text('scenario').notNull(),
  question: text('question').notNull(),
  answerOptions: text('answer_options', { mode: 'json' }).notNull(),
  correctAnswer: text('correct_answer', { mode: 'json' }).notNull(),
  correctFeedback: text('correct_feedback').notNull(),
  incorrectFeedback: text('incorrect_feedback').notNull(),
  handbookSection: text('handbook_section').notNull(),
  handbookPage: integer('handbook_page').notNull(),
  contentTags: text('content_tags', { mode: 'json' }).notNull(),
  criticalSafeguarding: integer('critical_safeguarding', { mode: 'boolean' }).notNull().default(false),
  status: text('status').notNull().default('draft_for_safeguarding_team_review'),
  updatedAt: integer('updated_at').notNull(),
}, (table) => [
  uniqueIndex('idx_questions_version_number').on(table.courseVersion, table.questionNumber),
  index('idx_questions_module').on(table.module),
  index('idx_questions_status').on(table.status),
]);

export const attempts = sqliteTable('attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  courseVersionId: text('course_version_id').notNull().references(() => courseVersions.id),
  attemptNumber: integer('attempt_number').notNull(),
  startedAt: integer('started_at').notNull(),
  completedAt: integer('completed_at'),
  score: integer('score'),
  percentage: integer('percentage'),
  status: text('status').notNull().default('IN_PROGRESS'),
}, (table) => [index('idx_attempts_user_version').on(table.userId, table.courseVersionId)]);

export const questionResponses = sqliteTable('question_responses', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id').notNull().references(() => attempts.id),
  questionId: text('question_id').notNull().references(() => questions.id),
  answer: text('answer', { mode: 'json' }).notNull(),
  isCorrect: integer('is_correct', { mode: 'boolean' }).notNull(),
  answeredAt: integer('answered_at').notNull(),
}, (table) => [
  uniqueIndex('idx_responses_attempt_question').on(table.attemptId, table.questionId),
]);

export const progress = sqliteTable('progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  courseVersionId: text('course_version_id').notNull().references(() => courseVersions.id),
  currentModule: integer('current_module').notNull().default(1),
  currentQuestion: integer('current_question').notNull().default(1),
  questionsCompleted: integer('questions_completed').notNull().default(0),
  percentageProgress: integer('percentage_progress').notNull().default(0),
  latestActivity: integer('latest_activity').notNull(),
}, (table) => [uniqueIndex('idx_progress_user_version').on(table.userId, table.courseVersionId)]);

export const completions = sqliteTable('completions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  courseVersionId: text('course_version_id').notNull().references(() => courseVersions.id),
  attemptId: text('attempt_id').notNull().references(() => attempts.id),
  score: integer('score').notNull(),
  percentage: integer('percentage').notNull(),
  completedAt: integer('completed_at').notNull(),
}, (table) => [index('idx_completions_user_version').on(table.userId, table.courseVersionId)]);

export const auditLog = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  actorUserId: text('actor_user_id').references(() => users.id),
  eventType: text('event_type').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  metadata: text('metadata', { mode: 'json' }).notNull(),
  occurredAt: integer('occurred_at').notNull(),
}, (table) => [index('idx_audit_entity').on(table.entityType, table.entityId)]);
