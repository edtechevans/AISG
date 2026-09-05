# My Courses — AISG Professional Development

My Courses is an educator-centred AISG professional learning hub. It connects the existing six-module Safeguarding at AISG course (30 checks) with AI in Education and Microsoft Teams for Communication (five sections and 10 judgement-focused checks each), while showing independent progress, exact resume positions and a personal course record.

Courses follow a consistent Course Home → Learn → Check → Apply → Reflect rhythm. AI in Education, Microsoft Teams for Communication and MTSS present each section across short learning screens before two aligned checks. Safeguarding uses two learning pages → a three-check retrieval block → two further learning pages → a final two-check application block. Every route provides immediate explanatory feedback; the short courses also provide a private “Take it into practice” selection and optional commitment.

The catalogue currently includes four courses: Safeguarding at AISG, AI in Education, Microsoft Teams for Communication, and Multi-Tiered System of Supports (MTSS). MTSS is an original synthesis of the MTSS Center’s essential-components framework: screening, a multi-level prevention system, progress monitoring, and data-based decision making.

Typography uses the Geist family bundled at build time by `next/font`, with a system fallback stack; no runtime font CDN is required.

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
- Course-specific browser progress keys support independent self-paced demo courses and exact resume positions. Course versions preserve historical completions.
- The catalogue is data-driven so future courses can be added without redesigning the hub.

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

### GitHub Pages test deployment

The workflow in `.github/workflows/deploy-pages.yml` deploys a browser-only test
version whenever `main` is pushed. It calculates the repository subdirectory at
build time, so asset paths work without hard-coding the GitHub username or
repository name.

GitHub Pages cannot run the application's Cloudflare D1 database, authentication,
or server API routes. The Pages version therefore uses a demo learner and stores
assessment progress only in that browser's local storage. It does not provide the
administrator workspace or shared training records. The full Sites deployment
continues to use the original Vinext build and server-backed features.

The Pages hub also stores AI practice commitments and the local My Course Record
in that browser. It does not claim to provide shared reporting or named reflection
analytics; the server-backed Sites deployment remains the place for administrator
filtering, aggregate insights and question review.

## Adding courses and assessment quality

Register catalogue metadata and a course-specific data/component module for a new
course. Categories and Required / Optional / Recommended designations are ready
for future filtering. `lib/assessment-progression.ts` provides a reviewable
Foundation → Application → Analysis → Professional Judgement → Synthesis map for
all existing checks. Questions favour realistic scenarios, plausible distractors,
application and professional judgement. Feedback explains the strongest response
and what an incorrect choice misses. Safeguarding content remains grounded in the
handbook and begins as `draft_for_safeguarding_team_review` until AISG reviewers
approve it in the admin workspace. Critical errors require remediation but do not
automatically fail an attempt.

## Seed accounts and data

The database includes eight entirely fictional learners across faculty, educational assistants, coaches, substitutes, counselors, leadership and operations, with representative not-started, in-progress, passed and retake states. Addresses use the reserved `example.invalid` domain.

## Quality checks

Run `pnpm build` for the production Sites build, `pnpm build:pages` for the static
GitHub Pages build, and `pnpm lint` for static checks. The generated Worker must
export a callable default `fetch` handler and the Drizzle migration must remain
schema-only.
