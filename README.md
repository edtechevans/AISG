# My Courses — AISG Professional Development

My Courses is an educator-centred AISG professional learning hub containing eight courses: the two annual Faculty Essentials courses, Employee Communication Guidelines, Safeguarding at AISG, Engagement for All, MTSS, AI in Education and Technology for Transformative Learning. It provides independent progress, exact resume positions, immediate instructional feedback, private practice reflections and a personal course record.

Courses follow a consistent Course Home → Learn → Check → Apply → Reflect rhythm while retaining course-appropriate section lengths. Employee Communication Guidelines includes Microsoft Teams as one section rather than a separate course. The Faculty Essentials courses use five applied checks per section, an 80% completion threshold, critical-concept remediation and retained attempt summaries.

The catalogue is intentionally ordered: Elementary Faculty Essentials (Required, Elementary Faculty); Secondary Faculty Essentials (Required, Secondary Faculty); Employee Communication Guidelines (Required); Safeguarding at AISG (Required); Engagement for All (Foundation); MTSS (Recommended); AI in Education (Recommended); and Technology for Transformative Learning (Recommended). Both divisional handbook courses are SY2026-27, 10 sections and 50 checks, with independent browser progress keys. Secondary-specific learning covers pathways, advisory, assessment, best-fit grading, attendance, academic integrity, Supervised Study, student safety and AI in assessment.

Typography uses the Geist family throughout. The server build bundles Geist through `next/font`; the GitHub Pages build ships a self-hosted `public/fonts/geist-latin.woff2` asset. Neither deployment depends on a runtime font CDN.

## Content governance

The AISG Student Safeguarding Handbook - Revised May 2026 is the content source of truth for the safeguarding course. The AI in Education course is grounded in the AISG Artificial Intelligence Policy for safety, security, privacy, ethical use, critical evaluation, bias and human oversight, and in the AISG Transformative Learning Framework for purposeful learning design. TLF courses are grounded in the AISG Transformative Learning Framework, Learning Engagement Indicators and accompanying faculty guidance. Generated or synthesised learning content is not treated as automatically policy-approved.

Every safeguarding question stores its learning objective, handbook section, page, tags, correct answer, feedback, critical-safeguarding flag, and review status. All safeguarding seed questions begin as `draft_for_safeguarding_team_review`.

The administrator question-bank workspace allows safeguarding reviewers to edit wording, scenarios, answer options, feedback and metadata, and then mark an item approved without a code change. Updates are written to the database and audit log. Other course modules carry course-appropriate content-owner and review metadata where supported by their data model.

## Architecture

- Vinext / React / TypeScript / Tailwind CSS
- Cloudflare D1 through the Sites runtime
- Drizzle schema and migrations in `db/` and `drizzle/`
- Platform authentication adapter in `app/chatgpt-auth.ts`
- Server-side role checks for administrator pages and write endpoints
- Relational entities for users, courses, versions, modules, questions, attempts, responses, progress, completions and audit events
- Course-specific browser progress keys support independent self-paced demo courses and exact resume positions. The corrected annual handbook courses use `my-courses-elementary-faculty-progress-sy2627-v2` and `my-courses-secondary-faculty-progress-sy2627-v2`. Employee Communication Guidelines uses `my-courses-communication-progress-v2`; AI in Education uses `my-courses-ai-progress-v1`; Technology for Transformative Learning uses `my-courses-technology-tlf-progress-v1`; the former Teams-only key remains untouched. Course versions preserve historical completions.
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

The Pages hub also stores practice commitments and the local My Course Record in that browser. It does not claim to provide shared reporting or named reflection analytics; the server-backed Sites deployment remains the place for administrator filtering, aggregate insights and question review.

The public test page uses `noindex, nofollow, noarchive` metadata to discourage search indexing. This is not access control: anyone with the GitHub Pages URL can still open the test build, so public-release content must remain suitable for that exposure.

## Employee Communication Guidelines

The required Employee Communication Guidelines course contains six sections and 14 applied checks. Its Teams section retains the authoritative AISG guidance on channels, chats, legitimate educational need, observable evidence, minimum necessary information, confidential records and professional digital records. Content is grounded in the supplied AISG Communication Expectations document; broader professional-learning synthesis is not presented as a new AISG policy. Incorrect responses use explanatory feedback so the assessment continues the learning.

## AI in Education

AI in Education is a Recommended Digital Practice course in the Explore Next catalogue. The revised SY2026-27 v2 course contains seven sections and 16 applied checks and is designed as a 30–40 minute professional-learning experience.

The course remains predominantly about AI literacy and responsible use: understanding AI and Generative AI, safety, security, privacy, data minimisation, critical evaluation, accuracy, bias, verification, intellectual property, human oversight, feedback and authentic evidence of learning. The learning then moves into purposeful AI use through AISG’s Transformative Learning Framework rather than treating AI as a separate initiative or learning goal.

The final three sections explicitly use the TLF as a lens, not a checklist. Learners work with Engagement for All; Being, Connecting and Doing; and the six facets of Personalisation, Agency, Authenticity, Creativity, Taking Action and Collaboration. Scenarios ask educators to judge whether AI removes barriers, preserves meaningful learner decisions, connects work to authentic purposes and audiences, supports original thinking and experimentation, strengthens ethical collaboration, enables purposeful action and produces observable evidence in student talk, choices, work, relationships and action. The central principle is learning first; AI second.

## Technology for Transformative Learning

Technology for Transformative Learning is a Recommended Digital Practice course in the Explore Next catalogue. It contains six sections and 18 applied checks, using the AISG Transformative Learning Framework as the learning-design lens rather than treating technology as a separate learning outcome.

The course moves from purposeful technology selection into the three TLF dimensions: Being (Personalisation and Agency), Connecting (Authenticity and Creativity), and Doing (Taking Action and Collaboration). It then asks educators to design for technology affordances, preserve learner thinking, notice evidence in student talk, choices, work, relationships and action, and select a practical next design move. Technology is presented as valuable when it removes barriers, widens meaningful choice, connects authentic audiences and perspectives, enables original creation or strengthens collective learning—not simply because a task is digital.

The course uses `my-courses-technology-tlf-progress-v1`, supports exact browser resume, includes a private Take it Into Practice reflection, and appears beside AI in Education as Recommended learning rather than Required learning.

## Adding courses and assessment quality

Register catalogue metadata and a course-specific data/component module for a new
course. Categories and Required / Foundation / Recommended designations are ready
for future filtering. `lib/assessment-progression.ts` provides a reviewable
Foundation → Application → Analysis → Professional Judgement → Synthesis map for
all existing checks. Questions favour realistic scenarios, plausible distractors,
application and professional judgement. Feedback explains the strongest response
and what an incorrect choice misses. Safeguarding content remains grounded in the
handbook and begins as `draft_for_safeguarding_team_review` until AISG reviewers
approve it in the admin workspace. Critical safeguarding errors require remediation but do not automatically fail an attempt.

## Seed accounts and data

The database includes eight entirely fictional learners across faculty, educational assistants, coaches, substitutes, counselors, leadership and operations, with representative not-started, in-progress, passed and retake states. Addresses use the reserved `example.invalid` domain.

## Quality checks

Run `pnpm lint`, `pnpm build` and `pnpm build:pages` before publication. The GitHub Pages workflow enforces all three checks before configuring, uploading or deploying Pages. The generated Worker must export a callable default `fetch` handler and the Drizzle migration must remain schema-only.
