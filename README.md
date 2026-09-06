# My Courses — AISG Professional Development

My Courses is an educator-centred AISG professional learning hub containing fifteen courses: Safeguarding at AISG, the two annual Faculty Essentials courses, Employee Communication Guidelines, AI in Education, Assessment for Learning at AISG, Data to Action, Designing for Learner Variability, Engagement for All, MTSS, Technology for Transformative Learning, and all four Teacher Growth & Reflection domain courses. It provides independent progress, exact resume positions, immediate instructional feedback, unscored practice labs, private practice reflections, favourites and a personal course record.

Courses follow a consistent Course Home → Learn → Check → Apply → Reflect rhythm while retaining course-appropriate section lengths. Employee Communication Guidelines includes Microsoft Teams as one section rather than a separate course. The Faculty Essentials courses use five applied checks per section, an 80% completion threshold, critical-concept remediation and retained attempt summaries.

The Required catalogue remains intentionally ordered: Safeguarding at AISG; Elementary Faculty Essentials; Secondary Faculty Essentials; and Employee Communication Guidelines. Explore Next includes a dedicated **Teacher Growth & Reflection** category containing Domain 1: Purposeful & Inclusive Learning Design; Domain 2: Inclusive Learning Culture & Environment; Domain 3: Transformative, Culturally Responsive Learning in Action; and Domain 4: Collaborative Planning, Reflection & Professional Impact. The remaining Explore courses stay alphabetical by title: AI in Education; Assessment for Learning at AISG; Data to Action: Using Evidence to Improve Learning; Designing for Learner Variability; Engagement for All: The AISG Learning Framework; Multi-Tiered System of Supports (MTSS); and Technology for Transformative Learning.

Typography uses the Geist family throughout. The server build bundles Geist through `next/font`; the GitHub Pages build ships a self-hosted `public/fonts/geist-latin.woff2` asset. Neither deployment depends on a runtime font CDN.

## Content governance

The AISG Student Safeguarding Handbook - Revised May 2026 is the content source of truth for the safeguarding course. The AI in Education course is grounded in the AISG Artificial Intelligence Policy for safety, security, privacy, ethical use, critical evaluation, bias and human oversight, and in the AISG Transformative Learning Framework for purposeful learning design. TLF courses are grounded in the AISG Transformative Learning Framework, Learning Engagement Indicators and accompanying faculty guidance.

Designing for Learner Variability is grounded in CAST's Universal Design for Learning Guidelines version 3.0 and related CAST implementation guidance for learner variability, clear goals, proactive barrier reduction, accessibility and the three UDL principles. Assessment for Learning at AISG is grounded in AISG's Teacher Growth and Reflection assessment continuum and TLF principles, while drawing on established formative-assessment practices such as clear learning intentions, success criteria, eliciting evidence, actionable feedback, self-assessment and peer learning. Data to Action uses AISG's Current State → Desired State → Gap → Action → Progress Monitoring → Adjust improvement cycle and classroom evidence routines. The Teacher Growth & Reflection domain courses are built directly from the AISG Teacher Growth Continuum and preserve its developmental, student-centred framing. Generated or synthesised learning content is not treated as automatically policy-approved.

Every safeguarding question stores its learning objective, handbook section, page, tags, correct answer, feedback, critical-safeguarding flag, and review status. All safeguarding seed questions begin as `draft_for_safeguarding_team_review`.

The administrator question-bank workspace allows safeguarding reviewers to edit wording, scenarios, answer options, feedback and metadata, and then mark an item approved without a code change. Updates are written to the database and audit log. Other course modules carry course-appropriate content-owner and review metadata where supported by their data model.

## Architecture

- Vinext / React / TypeScript / Tailwind CSS
- Cloudflare D1 through the Sites runtime
- Drizzle schema and migrations in `db/` and `drizzle/`
- Platform authentication adapter in `app/chatgpt-auth.ts`
- Server-side role checks for administrator pages and write endpoints
- Relational entities for users, courses, versions, modules, questions, attempts, responses, progress, completions and audit events
- Course-specific browser progress keys support independent self-paced demo courses and exact resume positions. The annual handbook courses use `my-courses-elementary-faculty-progress-sy2627-v2` and `my-courses-secondary-faculty-progress-sy2627-v2`. Employee Communication Guidelines uses `my-courses-communication-progress-v2`; AI in Education uses `my-courses-ai-progress-v1`; Assessment for Learning uses `my-courses-assessment-for-learning-progress-v1`; Data to Action uses `my-courses-data-to-action-progress-v1`; Designing for Learner Variability uses `my-courses-udl-progress-v1`; Technology for Transformative Learning uses `my-courses-technology-tlf-progress-v1`; Teacher Growth Domains 1–4 use `my-courses-teacher-growth-domain1-progress-v1` through `my-courses-teacher-growth-domain4-progress-v1`.
- The catalogue and shared course router are data-driven so future courses can be added without redesigning the hub or adding a new route branch for every shared-engine course.

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

The workflow in `.github/workflows/deploy-pages.yml` deploys a browser-only test version whenever `main` is pushed. It calculates the repository subdirectory at build time, so asset paths work without hard-coding the GitHub username or repository name.

GitHub Pages cannot run the application's Cloudflare D1 database, authentication, or server API routes. The Pages version therefore uses a demo learner and stores assessment progress only in that browser's local storage. It does not provide the administrator workspace or shared training records. The full Sites deployment continues to use the original Vinext build and server-backed features.

The Pages hub also stores favourites, practice commitments and the local My Course Record in that browser. It does not claim to provide shared reporting or named reflection analytics; the server-backed Sites deployment remains the place for administrator filtering, aggregate insights and question review.

The public test page uses `noindex, nofollow, noarchive` metadata to discourage search indexing. This is not access control: anyone with the GitHub Pages URL can still open the test build, so public-release content must remain suitable for that exposure.

## Employee Communication Guidelines

The required Employee Communication Guidelines course contains six sections and 14 applied checks. Its Teams section retains the authoritative AISG guidance on channels, chats, legitimate educational need, observable evidence, minimum necessary information, confidential records and professional digital records. Content is grounded in the supplied AISG Communication Expectations document; broader professional-learning synthesis is not presented as a new AISG policy. Incorrect responses use explanatory feedback so the assessment continues the learning.

## Assessment for Learning at AISG

Assessment for Learning at AISG is a Recommended Learning & Teaching course in Explore Next. It contains five sections, 12 applied checks and five unscored practice labs and is designed as a 25–30 minute professional-learning experience.

The course treats formative assessment as a use of evidence rather than a task label. It moves from the purpose of Assessment for Learning into clear learning intentions and success criteria, representative checks for understanding, valid evidence of learning, timely and actionable feedback, revision, self-assessment and peer feedback. The final section connects assessment most directly with TLF Agency, with additional links to Personalisation and Collaboration where assessment design helps learners use evidence, make meaningful next-step decisions and support one another's improvement.

The course is cross-divisional and does not replace Elementary, MYP, DP or other programme-specific assessment expectations. Its focus is the everyday formative process that can strengthen learning across classrooms: Where are we going? Where are we now? What is the next move? The course uses `my-courses-assessment-for-learning-progress-v1` and is marked `draft_for_learning_and_teaching_review`.

## Data to Action: Using Evidence to Improve Learning

Data to Action is a Recommended Learning & Teaching course in Explore Next. It contains five sections, 10 applied checks and five unscored practice labs and is designed as a 20–25 minute classroom-teacher learning experience.

The course uses AISG's Current State → Desired State → Gap → Action → Progress Monitoring → Adjust cycle, distinguishing broader pattern data from close evidence of learner experience. It emphasises curiosity over judgement, multiple relevant evidence sources, proportionate monitoring and small teaching moves that can be reviewed and adjusted.

## Teacher Growth & Reflection

Teacher Growth & Reflection is a dedicated Explore Next category built directly from the AISG Teacher Growth Continuum. It now contains all four domain courses. Each is Recommended, designed for approximately 25–30 minutes, uses progressive applied checks and includes five unscored practice labs.

**Domain 1: Purposeful & Inclusive Learning Design** develops continuum literacy across 1a Learning Purpose & Outcomes, 1b Understanding Learners & Identity, 1c Inclusive Learning Engagements & Materials Design, and 1d Assessment Planning for Equity & Growth. The course keeps reflection anchored in student evidence and repeatedly asks what a realistic next developmental move would be.

**Domain 2: Inclusive Learning Culture & Environment** develops continuum literacy across 2a Belonging, Respect & Psychological Safety, 2b Student Voice, Representation & Advocacy, 2c Routines that Support Equity & Autonomy, and 2d Purposeful Use of Space, Time & Tools. The course focuses on the progression from teacher-established structures toward students increasingly sustaining, adapting and improving the conditions for learning.

**Domain 3: Transformative, Culturally Responsive Learning in Action** develops continuum literacy across 3a Cognitive Demand & Thinking, 3b Inclusive Discourse & Collaboration, 3c Choice, Inquiry & Creativity, and 3d Authentic Application & Social Impact. It distinguishes visible activity from genuine cognitive depth, learner-led knowledge-building, independent inquiry, transfer, authentic audiences and meaningful action.

**Domain 4: Collaborative Planning, Reflection & Professional Impact** develops continuum literacy across 4a Feedback & Inclusive Growth Practices, 4b Evidence, Data & Responsive Planning, 4c Learner Reflection & Ownership of Growth, 4d Professional Collaboration & Collective Capacity, and 4e Communication & Community Partnership. Domain 4 retains student impact as the anchor while also recognising increasing professional influence, shared practice and system-level contribution at later continuum levels.

The domain courses deliberately avoid turning continuum levels into fixed teacher labels. In Domains 1–3, the framework primarily locates evidence in student experience and outcomes. Domain 4 also includes increasing professional influence and contribution across teams and the school. All four courses are marked `draft_for_learning_and_teaching_review`.

## Designing for Learner Variability

Designing for Learner Variability is a Recommended Inclusive Learning course in Explore Next. It contains eight sections, 18 applied checks and five unscored practice labs, designed as a 45–60 minute professional-learning experience.

The course is grounded in the CAST Universal Design for Learning Guidelines version 3.0. It develops a UDL understanding of learner variability, proactive design and barrier analysis before moving through clear goals and flexible means; Multiple Means of Engagement; Multiple Means of Representation; Multiple Means of Action & Expression; accessibility, assistive technology and graduated support; identity, belonging and systemic barriers; and an iterative design cycle based on learner evidence.

The course deliberately avoids common UDL misconceptions. It does not present UDL as learning-styles matching, unlimited choice, a requirement to use every guideline in every lesson, or a reason to lower meaningful challenge. Scenarios repeatedly ask educators to preserve the intended learning goal, distinguish the goal from non-essential means, remove unnecessary barriers, use purposeful options, and evaluate whether the design increased access, participation and learner agency.

## AI in Education

AI in Education is a Recommended Digital Practice course in Explore Next. The revised SY2026-27 v2 course contains seven sections and 16 applied checks and is designed as a 30–40 minute professional-learning experience.

The course remains predominantly about AI literacy and responsible use: understanding AI and Generative AI, safety, security, privacy, data minimisation, critical evaluation, accuracy, bias, verification, intellectual property, human oversight, feedback and authentic evidence of learning. The learning then moves into purposeful AI use through AISG’s Transformative Learning Framework rather than treating AI as a separate initiative or learning goal.

The final three sections explicitly use the TLF as a lens, not a checklist. Learners work with Engagement for All; Being, Connecting and Doing; and the six facets of Personalisation, Agency, Authenticity, Creativity, Taking Action and Collaboration. The central principle is learning first; AI second.

## Technology for Transformative Learning

Technology for Transformative Learning is a Recommended Digital Practice course in Explore Next. It contains six sections and 18 applied checks, using the AISG Transformative Learning Framework as the learning-design lens rather than treating technology as a separate learning outcome.

The course moves from purposeful technology selection into the three TLF dimensions: Being (Personalisation and Agency), Connecting (Authenticity and Creativity), and Doing (Taking Action and Collaboration). It then asks educators to design for technology affordances, preserve learner thinking, notice evidence in student talk, choices, work, relationships and action, and select a practical next design move.

## Adding courses and assessment quality

Register catalogue metadata and a course-specific data/component module for a new course. Categories and Required / Foundation / Recommended designations are ready for future filtering. `lib/assessment-progression.ts` provides a reviewable Foundation → Application → Analysis → Professional Judgement → Synthesis map for all existing checks. Questions favour realistic scenarios, plausible distractors, application and professional judgement. Feedback explains the strongest response and what an incorrect choice misses. Safeguarding content remains grounded in the handbook and begins as `draft_for_safeguarding_team_review` until AISG reviewers approve it in the admin workspace.

## Seed accounts and data

The database includes eight entirely fictional learners across faculty, educational assistants, coaches, substitutes, counselors, leadership and operations, with representative not-started, in-progress, passed and retake states. Addresses use the reserved `example.invalid` domain.

## Quality checks

Run `pnpm lint`, `pnpm build` and `pnpm build:pages` before publication. The GitHub Pages workflow enforces all three checks before configuring, uploading or deploying Pages. The generated Worker must export a callable default `fetch` handler and the Drizzle migration must remain schema-only.
