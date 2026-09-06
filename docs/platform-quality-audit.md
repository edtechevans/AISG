# AISG My Courses — Platform Quality Audit

Date: 6 September 2026
Scope: learner hub, all seven courses, handbook-course architecture, progress and resume, content governance, administrator surfaces, static GitHub Pages output, Sites production build and deployment documentation.

## Initial issues

| Severity | Type | Area | Finding |
| --- | --- | --- | --- |
| Critical | Learning design / technical | Faculty Essentials assessments | The first generated handbook-course release reused generic situations and contained answer-position mappings that could mark an unsuitable action as correct. Publication was blocked until corrected. |
| High | UX / data | Exact resume | Submitting a response advanced the saved position before feedback was acknowledged, so refresh could skip the feedback state. |
| High | UX / data | Learning-card resume | The long courses persisted question position but not the exact learning card, so leaving mid-section returned a learner to the start of that section’s learning. |
| High | Learning design / data | Faculty Essentials completion | The long required courses did not enforce their stated 80% completion threshold or retain attempt summaries. |
| High | Content / governance | Elementary authenticity | Elementary learning inherited several Secondary phrases and needed explicit Early Years/PYP and Elementary-context treatment. |
| High | Visual design / deployment | Pages typography | The server build bundled Geist, but the static GitHub Pages build silently fell back to Arial and did not ship a font asset. |
| Medium | UX | Question navigation | The question header displayed “of 2” even in five-check handbook sections. |
| Medium | Data / reliability | Corrupted storage | Parsed browser state was accepted without validating collection shapes. |
| Medium | UX | Continue Learning | The first incomplete catalogue item was selected rather than the most recently active course. |
| Medium | Content / documentation | README | Course count, course rhythm and former Teams naming were stale. |
| Low | Performance | Static bundle | The Pages JavaScript bundle is substantial because all course data is delivered in one static bundle. It remains within a practical range for the test environment. |
| Low | Governance | Public test content | Handbook-derived content is publicly visible for testing. It excludes personal phone numbers, credentials, named sensitive records and real learner cases, but AISG should continue to confirm which internal operational content is appropriate for a public test URL. |

## Audit coverage (A–Z)

- **A–I — Learning, assessment, consistency, content, learner experience, progress, feedback and reflection:** reviewed the seven-course catalogue, learning rhythm, Faculty Essentials question generation, feedback, critical remediation, threshold and reflection flow.
- **J–N — Visual design, typography, responsive behaviour, accessibility and navigation:** reviewed shared Geist/AISG styling, semantic landmarks, keyboard answer controls, focus states, responsive grids, route switching and browser history behaviour.
- **O–T — Performance, reliability, persistence, privacy, security and architecture:** reviewed production/static builds, defensive storage parsing, versioned keys, unsafe rendering, public assets, server-route assumptions and database/auth separation.
- **U–Z — Scalability, governance, administrator experience, analytics, Pages and deployment:** reviewed catalogue-driven cards/counts/filters, owner-specific review states, honest Pages limitations, workflow configuration and README accuracy.

## Improvements implemented

- Rebuilt Faculty Essentials assessment generation so every answer key is deterministically correct and every question has a distinct, division-appropriate scenario and strongest action (50 unique scenarios and actions per division).
- Added progressive assessment levels, rotating answer positions, related-but-incomplete alternatives and option-specific instructional feedback.
- Expanded every Faculty Essentials section to four short learning cards before its five checks, including an evidence/role/application prompt rather than a wall of handbook text.
- Restored Elementary authenticity through PK–Grade 5, PYP, homeroom, EAL and developmentally appropriate scenarios instead of Secondary-pathway language.
- Added 80% completion thresholds, retained attempt summaries and a clear review/reattempt state for both required handbook courses.
- Fixed exact resume across learning cards, questions and submitted feedback: the current state remains saved until the learner explicitly continues.
- Added critical remediation to high-consequence handbook concepts without making one error an automatic course failure.
- Corrected five-check section labelling and added defensive browser-storage validation.
- Made Continue Learning select the most recently active incomplete course.
- Enriched My Course Record with completion date and score for browser-based courses.
- Added explicit course version, module, question number, learning objective, source, tags, content owner and review status to Faculty Essentials question metadata.
- Self-hosted the Latin Geist variable font for Pages and verified the generated `/AISG/fonts/` reference.
- Versioned the corrected handbook-course progress keys so invalid earlier test attempts are not reinterpreted as completion.
- Updated catalogue metadata and documentation for seven courses, audience labels and annual handbook versions.
- Standardised the learner-facing platform identity as **AISG My Courses** across application metadata, header and hero branding.
- Strengthened the public test page metadata with a consistent title/description, social metadata, theme colour, a JavaScript fallback message and `noindex, nofollow, noarchive` so the GitHub Pages test environment is shareable without being intentionally promoted for search indexing.
- Strengthened the GitHub Pages deployment gate so every publish now runs `pnpm lint`, `pnpm build` and `pnpm build:pages` before Pages is configured, uploaded or deployed.

## What was deliberately not changed

- The Vinext/React/TypeScript/Tailwind stack, D1 production architecture and existing GitHub Pages deployment model were preserved.
- Safeguarding policy answers and the current communication, MTSS, AI and learning-framework course sources were not rewritten during this platform pass.
- GitHub Pages remains a transparent browser-only test environment; fake SSO and fake central reporting were not introduced.
- Content marked `draft_for_elementary_leadership_review`, `draft_for_secondary_leadership_review` or `draft_for_safeguarding_team_review` is not presented as policy-approved merely because it was generated or technically validated.

## Remaining low-risk items

- The static bundle could later be split by course if the catalogue grows materially; this is not currently a reliability blocker.
- The server-backed administrator database currently has richer reporting for Safeguarding than for browser-only courses. Production-wide Faculty Essentials analytics should be added when those courses move from local test progress to central assignment records.
- Human content owners must complete policy approval of draft handbook questions before production assignment.
- GitHub Pages remains publicly reachable by anyone with the URL. The added `noindex` directive reduces deliberate search indexing but is not an access-control mechanism.

## Verification evidence

- Static data audit: all seven catalogue entries are present in the intended order; Safeguarding contains 30 checks; Communication 14; Engagement 10; MTSS 16; AI 10; Elementary 50; Secondary 50.
- Faculty Essentials data audit: both courses contain 10 sections, four learning cards per section, 50 unique scenarios, 50 unique strongest actions, valid four-option answer keys and complete version/source/owner/review metadata.
- Browser QA from the prior platform pass: direct course links hydrate without errors; all seven course homes open; Safeguarding and administrator review surfaces load; incorrect option-specific feedback and critical remediation work; learning-card and feedback-state reloads resume exactly.
- Long-course browser run from the prior platform pass: a 12/50 attempt correctly produced “Another attempt needed”; a subsequent 50/50 attempt completed; attempt history was retained and Course Record displayed completion date, 50/50 and SY2026–27.
- Responsive QA from the prior platform pass: narrow mobile rendering showed no horizontal document overflow; semantic radio controls, live feedback, disabled remediation progression, skip navigation and visible focus styling were retained.
- Public exposure review of the latest GitHub Pages artifact: no private keys, API credentials, AISG employee email addresses, Chinese mobile numbers, local filesystem paths or real learner records were detected. The only learner email in the artifact is the reserved fictional `demo@example.invalid` address.
- Published artifact audit: the Pages bundle contains all seven courses in the intended order, includes the locally hosted Geist font, uses `/AISG/` asset paths, and does not expose a separate Microsoft Teams course card; Teams remains a section of Employee Communication Guidelines.
- Latest successful Pages artifact sizes are approximately 484 KB JavaScript, 236 KB CSS, 32 KB Geist font and 164 KB AISG logo. These are acceptable for the current testing hub, with course-level code splitting remaining a future optimisation if the catalogue grows substantially.

## Final internal score

| Dimension | Score |
| --- | ---: |
| Learning & Instructional Design | 19/20 |
| Assessment & Feedback | 14/15 |
| Learner Experience & UX | 15/15 |
| Accessibility & Inclusion | 14/15 |
| Visual Design & Consistency | 10/10 |
| Technical Reliability & Performance | 9/10 |
| Architecture & Scalability | 5/5 |
| Data / Privacy / Security | 5/5 |
| Content Governance | 3/3 |
| Deployment / Production Readiness | 2/2 |
| **Total** | **96/100** |

Final gate: **0 Critical unresolved issues; 0 High unresolved issues.**

## Deployment verification

The most recent pre-audit branding deployment, commit `7ba2bde510cb46d03bed9519a88967a5d43c6da5`, completed successfully through the GitHub Pages workflow. The workflow installed dependencies, built the static site, configured Pages, uploaded the artifact and deployed successfully.

This quality-control update adds a stricter CI gate before deployment. Record the final post-audit commit and workflow result after the updated workflow completes; the public testing URL remains:

`https://edtechevans.github.io/AISG/`
