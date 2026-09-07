# AISG My Courses — Professional Learning System v2

This document records the learner-facing architecture introduced in September 2026 as My Courses evolves from a catalogue of professional-learning modules into a connected professional-learning and practice system.

## Design principle

The system should help an educator move through a meaningful professional-learning cycle:

**Reflect → Choose → Learn → Question → Apply → Notice → Reconsider → Continue**

Completion remains useful for required learning, but Explore learning is designed around professional judgement, transfer and learner evidence rather than points, rankings or compliance signals.

## My Learning Pathway

Find Your Focus remains the reflective entry point. Once a learner completes the six-question reflection, its three recommendations initialise a private **My Learning Pathway**.

The pathway:

- is guidance, not an assignment;
- can be reordered by the learner;
- can have items removed;
- retains Start / Continue / Review state;
- keeps the existing Star behaviour for saved learning;
- resets to the latest Find Your Focus recommendations when requested;
- persists in the public demo under `my-courses-learning-pathway-v1`.

The homepage hero surfaces the pathway when there is no more immediate in-progress course.

## My Practice

**My Practice** is a private professional-practice workspace. It automatically discovers existing `practice` and `commitment` fields stored by shared-engine courses and turns them into practice focuses.

A learner can mark a focus as:

- To try
- Tried it
- Adapted it
- Not yet
- Not for now

After trying or adapting a practice, the workspace asks:

- **What did you notice about learners?**
- **What would you keep, change or try next?**

Educators can also add a professional question or practice focus of their own and optionally connect it to a course. The public GitHub Pages demo stores this workspace only in the current browser under `my-courses-practice-v1`.

The intended use is reflective professional learning, not evaluation or leader scoring.

## Professional Capacity Map

The former course-record emphasis has been expanded into a **Professional Capacity Map**. It deliberately does not produce competency percentages or teacher ratings.

The map organises learning into five overlapping domains:

1. Learning Design & Assessment
2. Inclusive & Responsive Practice
3. Transformative Learning
4. Evidence, Reflection & Collective Improvement
5. Professional Responsibility & Judgement

Completed courses contribute their declared professional capabilities to relevant domains. In-progress and pathway learning can also surface as possible next connections. A conventional completed-course record remains available beneath the capacity view.

## Cross-course Connections

`lib/course-connections.ts` defines explicit conceptual relationships across the catalogue. Connections are deliberately written as professional-learning links rather than prerequisites.

Examples include:

- Assessment for Learning ↔ Data to Action: assessment creates close evidence that can inform a disciplined improvement cycle.
- Supporting Multilingual Learners ↔ UDL: both preserve worthwhile challenge while reducing unnecessary barriers to access and participation.
- MTSS ↔ Data to Action: both depend on multiple evidence sources, progress monitoring and adjustment rather than one-off scores.
- AI in Education ↔ Technology for Transformative Learning: both begin with the learning need and require human judgement about whether technology adds value.
- Engagement for All ↔ Teacher Growth Domains: the TLF provides shared language while the continuum provides a developmental learner-evidence lens.

Safeguarding connections contain an explicit guardrail: a conceptual connection must never replace or delay current safeguarding procedures.

Connections currently surface through My Learning Pathway and the Learning Companion knowledge layer and can be reused by future course-home or follow-through experiences.

## Learning Companion v2

The Learning Companion now has two intentionally different runtime modes.

### Authenticated server-backed mode

`/api/learning-companion` is a secure server route designed for true generative conversation. It uses the OpenAI Responses API only when a server-side `OPENAI_API_KEY` is configured. The default model identifier is `gpt-5.6-luna`; `OPENAI_COMPANION_MODEL` can override it without changing application code.

The route sends the model only the professional-learning context needed for the response:

- current course;
- current stage and section;
- current learning text / takeaways;
- approved course grounding;
- culturally responsive guidance;
- appropriate TLF connection;
- explicit cross-course connections;
- a short recent conversation window.

Hard boundaries in the server prompt include:

- do not invent AISG policy, procedures, approval status or local facts;
- treat the TLF as a lens, not a checklist;
- use cultural humility for AISG’s multilingual international-school context in Guangzhou and southern China;
- do not reveal or steer toward formal learning-check answers;
- do not request or manage personally identifiable student cases;
- redirect safeguarding matters to current AISG safeguarding/reporting procedures;
- preserve meaningful cognitive demand;
- state uncertainty when evidence is ambiguous.

The Companion supports six modes:

- Explain differently
- Connect to TLF
- Challenge my thinking
- Apply this tomorrow
- Cultural lens
- Connect another course

Source labels come from the approved knowledge model in `lib/learning-companion-knowledge.ts`; the model is explicitly instructed not to fabricate citations.

### Public GitHub Pages mode

GitHub Pages is static and must not contain an API secret. The same interface therefore falls back to a deterministic, browser-grounded professional-learning mode using the curated AISG/course knowledge and cross-course connection maps.

This fallback preserves the privacy and learning guardrails and lets the public demo show the intended interaction design without exposing credentials. True generative conversation requires the authenticated server-backed deployment plus a configured server-side key.

## Privacy and governance

The public demo continues to store learner choices, pathway, practice reflections, favourites and course progress only in that browser. `noindex` metadata is not access control, so no confidential student data or private staff information belongs in the public build.

The Learning Companion explicitly tells educators not to enter student names or identifying information. It is a professional-learning coach, not a student case-management system.

## Performance

The professional-learning system homepage is code-split through `app/learning-system-home.tsx` so My Learning Pathway, My Practice, the Capacity Map and their connection logic do not need to inflate the initial dashboard bundle. GitHub Pages continues to enforce its existing entry-JavaScript performance budget during deployment verification.

## Rollback

A clean pre-v2 rollback point is preserved at:

`backup/pre-learning-system-v2`

This branch points to commit `417841e682c6d17a57d11d722b3244e0d7039107`, before the pathway, practice, capacity-map and generative-Companion work began.
