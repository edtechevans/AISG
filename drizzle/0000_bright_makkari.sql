CREATE TABLE `attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_version_id` text NOT NULL,
	`attempt_number` integer NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`score` integer,
	`percentage` integer,
	`status` text DEFAULT 'IN_PROGRESS' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_version_id`) REFERENCES `course_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_attempts_user_version` ON `attempts` (`user_id`,`course_version_id`);--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_user_id` text,
	`event_type` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`metadata` text NOT NULL,
	`occurred_at` integer NOT NULL,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_audit_entity` ON `audit_log` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `completions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_version_id` text NOT NULL,
	`attempt_id` text NOT NULL,
	`score` integer NOT NULL,
	`percentage` integer NOT NULL,
	`completed_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_version_id`) REFERENCES `course_versions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_completions_user_version` ON `completions` (`user_id`,`course_version_id`);--> statement-breakpoint
CREATE TABLE `course_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`version_code` text NOT NULL,
	`title` text NOT NULL,
	`pass_threshold` integer DEFAULT 80 NOT NULL,
	`status` text DEFAULT 'draft_for_safeguarding_team_review' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_course_versions_code` ON `course_versions` (`version_code`);--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` text PRIMARY KEY NOT NULL,
	`course_version_id` text NOT NULL,
	`module_number` integer NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`learning_content` text NOT NULL,
	FOREIGN KEY (`course_version_id`) REFERENCES `course_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_modules_version_number` ON `modules` (`course_version_id`,`module_number`);--> statement-breakpoint
CREATE TABLE `progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`course_version_id` text NOT NULL,
	`current_module` integer DEFAULT 1 NOT NULL,
	`current_question` integer DEFAULT 1 NOT NULL,
	`questions_completed` integer DEFAULT 0 NOT NULL,
	`percentage_progress` integer DEFAULT 0 NOT NULL,
	`latest_activity` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_version_id`) REFERENCES `course_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_progress_user_version` ON `progress` (`user_id`,`course_version_id`);--> statement-breakpoint
CREATE TABLE `question_responses` (
	`id` text PRIMARY KEY NOT NULL,
	`attempt_id` text NOT NULL,
	`question_id` text NOT NULL,
	`answer` text NOT NULL,
	`is_correct` integer NOT NULL,
	`answered_at` integer NOT NULL,
	FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_responses_attempt_question` ON `question_responses` (`attempt_id`,`question_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`course_version` text NOT NULL,
	`module` text NOT NULL,
	`question_number` integer NOT NULL,
	`title` text NOT NULL,
	`question_type` text NOT NULL,
	`learning_objective` text NOT NULL,
	`scenario` text NOT NULL,
	`question` text NOT NULL,
	`answer_options` text NOT NULL,
	`correct_answer` text NOT NULL,
	`correct_feedback` text NOT NULL,
	`incorrect_feedback` text NOT NULL,
	`handbook_section` text NOT NULL,
	`handbook_page` integer NOT NULL,
	`content_tags` text NOT NULL,
	`critical_safeguarding` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft_for_safeguarding_team_review' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_questions_version_number` ON `questions` (`course_version`,`question_number`);--> statement-breakpoint
CREATE INDEX `idx_questions_module` ON `questions` (`module`);--> statement-breakpoint
CREATE INDEX `idx_questions_status` ON `questions` (`status`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`auth_user_id` text,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'LEARNER' NOT NULL,
	`user_type` text DEFAULT 'Faculty' NOT NULL,
	`division` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_auth_user_id` ON `users` (`auth_user_id`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);