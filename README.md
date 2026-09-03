# AISG Student Safeguarding Training

Production-ready MVP for AISG's SY2026-27 annual safeguarding course. It provides a six-module learner journey, 30 assessed questions, immediate explanatory feedback, autosaved progress, retakes, completion records, a printable certificate, administrator reporting, CSV export, and a question-review workspace.

## Content governance

The AISG Student Safeguarding Handbook - Revised May 2026 is the content source of truth. Every question stores its learning objective, handbook section, page, tags, correct answer, feedback, critical-safeguarding flag, and review status. All seed questions begin as `draft_for_safeguarding_team_review`; generated content is not treated as approved.

The administrator question-bank workspace allows safeguarding reviewers to edit wording, scenarios, answer options, feedback and metadata, and then mark an item approved without a code change. Updates are written to the database and audit log.

## Architecture

- Vinext / React / TypeScript / Tailwind CSS
- Cloudflare D1 through the Sites runtime
- Drizzle schema and migrations in `db/` and `drizzle/`
- Platform authentication adapter in `app/chatgpt-auth.ts`
- Server-side role checks for administrator pages and write endpoints
- Relational entities for users, courses, versions, modules, questions, attempts, responses, progress, completions and audit events

The first authenticated user on a new, owner-only deployment is bootstrapped as the administrator. Later users default to learner. This makes the development build usable without AISG identity-provider credentials while leaving a single authentication adapter for future Microsoft/AISG SSO integration.

## Safeguarding assessment behavior

- The default pass threshold is 80% and is editable by an administrator.
- Learners receive feedback after each response, but the full answer key is never included in the initial course payload.
- An incorrect critical-safeguarding answer requires a short remediation acknowledgement before the learner can continue.
- Critical errors do not automatically fail an attempt.
- Attempts and completion records are retained independently of the printable certificate.
- The application stores training records only; it has no fields or workflows for confidential student safeguarding reports.

## Local setup

Requirements: Node.js 22.13 or newer and pnpm.

1. Install dependencies with `pnpm install`.
2. Generate a schema migration after schema changes with `pnpm db:generate`.
3. Apply migrations to the local D1 database used by the Sites preview.
4. Start the application with `pnpm dev`.

The Sites scaffold provides a local signed-in development identity. The local D1 database is seeded on first use with fictional training-only data.

## Deployment

Deployment is managed by OpenAI Sites using `.openai/hosting.json`. The configuration declares the logical D1 binding `DB`; Sites provisions the production database and applies the saved Drizzle migrations before the Worker is published. The site should remain private to the intended AISG audience.

No application environment variables are required for this MVP. Microsoft/AISG SSO credentials are intentionally not embedded. Replace or extend `app/chatgpt-auth.ts` when AISG's identity integration is available, while keeping authorization checks in server-side data access.

## Seed accounts and data

The database includes eight entirely fictional learners across faculty, educational assistants, coaches, substitutes, counselors, leadership and operations, with representative not-started, in-progress, passed and retake states. Addresses use the reserved `example.invalid` domain.

## Quality checks

Run `pnpm build` for the production build and `pnpm lint` for static checks. The generated Worker must export a callable default `fetch` handler and the Drizzle migration must remain schema-only.
