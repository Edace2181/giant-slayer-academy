# Giant Slayer Academy Field Manual Standard

**Version:** 1.0  
**Date:** August 24, 2026  
**Status:** Mandatory architecture and production standard

## 1. Purpose

This document defines the permanent Giant Slayer Academy standard for designing, building, validating, and approving Giant Slayer's Field Manuals across every certification track and course.

A Field Manual is the teaching and learning layer that prepares a learner for a later assessment or applied-practice experience. It explains the approved topic in plain English, organizes it into manageable mini-lessons, highlights recognition cues, and checks understanding before directing the learner onward.

This standard applies to Security+, Cloud+, AWS Cloud Practitioner, Linux Essentials, A+ Core 1, A+ Core 2, Network+, Python, CCNA, and future Giant Slayer Academy tracks. It supplements the broader Giant Slayer Academy development standards. When a track-specific addendum defines an approved lesson source, taxonomy, route, or learning mode, that addendum remains authoritative for that track.

## 2. Approved Reference Implementation

Security+ Objectives 1.1 and 1.2 are the initial approved reference implementation for this standard. They establish the following proven architecture:

- A shared Field Manual HTML shell, stylesheet, and JavaScript renderer serve multiple objectives.
- Objective-specific lesson content is stored separately from the shared presentation and interaction logic.
- The route identifies the requested world and objective, and the renderer verifies that the loaded lesson metadata matches that route.
- Every rendered lesson section appears in a visible **Jump to a Mini-Lesson** navigator.
- The navigator contains one additional link to the required Mini Check.
- The Mini Check is part of the teaching layer and does not consume or replace a question from the downstream assessment bank.
- A correct Mini Check unlocks the explicit completion transition to the existing assessment.
- Field Manual completion is stored independently from assessment mastery and downstream progress.
- The Objective Hub displays teaching completion and assessment mastery as separate learner states.

The Security+ implementation is a reference, not a universal naming mandate. Its filenames, route parameters, storage key, exam terminology, two-field classification Mini Check, and **Objective Sweep** label are Security+-specific implementation details.

## 3. Learning Architecture

The universal learning sequence is:

**Objective or Topic Hub → Giant Slayer's Field Manual → Mini Check → Existing Assessment or Practice Experience → Return to Hub**

The Field Manual teaches. The downstream system measures recognition, application, mastery, or practical performance according to the track's approved learning design.

These responsibilities must remain separate:

| Layer | Primary responsibility | Must not do |
|---|---|---|
| Field Manual | Teach, explain, compare, provide cues, and reinforce understanding | Award downstream mastery merely because the lesson was opened or read |
| Mini Check | Confirm immediate recognition or understanding of the lesson | Replace, remove, or consume an existing assessment-bank question |
| Downstream assessment or practice | Measure the track's approved learning outcome | Treat Field Manual completion as proof of assessment mastery |
| Hub and reporting | Show the learner's separate teaching and mastery states | Merge distinct completion records into an ambiguous single state |

A track may call its downstream experience Objective Sweep, Knowledge Check, Lab, Challenge, Exercise, or another approved name. The Field Manual architecture must integrate with that existing system without renaming or rewriting it unless separately authorized.

## 4. Universal Page and Interaction Architecture

Every Field Manual must use the shared Giant Slayer Academy visual language and provide a predictable learner experience. The implementation must include:

1. A clear Giant Slayer's Field Manual identity.
2. The current certification or course, exam code or version where applicable, world/chapter/topic, and objective or lesson title.
3. A visible completion note when that manual has already been completed.
4. A visible **Jump to a Mini-Lesson** navigator.
5. An ordered set of objective- or topic-specific mini-lessons.
6. A required Mini Check.
7. An explicit completion-and-continue action that remains unavailable until the Mini Check is passed.
8. A clear return action to the appropriate objective, topic, chapter, or course hub.
9. A clear and safe error state when a route or lesson cannot be loaded.

Opening, refreshing, or scrolling through a Field Manual must not automatically mark it complete. Completion must result from the approved Mini Check and the learner's explicit completion transition.

Where a track supports returning learners who want to go directly to assessment, its hub may provide a separate direct assessment action. The presence of that action must not weaken the Field Manual's own completion rules or alter assessment behavior.

## 5. Jump to a Mini-Lesson Navigator Standard

The **Jump to a Mini-Lesson** navigator is required on every Field Manual regardless of lesson length. A short lesson must not hide the navigator.

The navigator must follow these rules:

- It contains exactly one link for every rendered top-level lesson section, in the same order in which those sections appear.
- It contains exactly one additional **Mini Check** link.
- Its total link count therefore equals the number of rendered lesson sections plus one.
- Each section link targets a unique, deterministic section anchor.
- The Mini Check link targets the Mini Check heading or container.
- Every target must exist, and no navigator link may point to a stale, missing, or duplicate anchor.
- Activating a link must move the learner to the intended section without changing completion, mastery, scoring, or assessment state.
- The target heading must remain visible after navigation; fixed or sticky page elements must not cover it.
- Native link and keyboard behavior must be preserved. Focus indicators must remain visible.
- Reduced-motion preferences must be respected when smooth scrolling or transitions are used.

The navigator should be generated from the same ordered section data used by the renderer. Maintaining a separate hard-coded link list is discouraged because it can drift from the lesson content.

## 6. Field Manual Content Standard

### 6.1 What You Are Learning

Every Field Manual must begin with a **What You Are Learning** section. It should state the lesson's scope, the distinctions the learner must understand, and the recognition or application outcome expected at the end of the manual.

### 6.2 Mini-lessons

The remainder of the lesson must be divided into logical, objective- or topic-specific mini-lessons. Each mini-lesson should teach one coherent concept or a closely related concept group. Large objectives should use more sections rather than creating a single dense block.

Teaching must use plain English without sacrificing technical accuracy. Necessary technical terminology, commands, paths, acronyms, product names, protocols, standards, and exam vocabulary must be introduced in context.

### 6.3 Recognition-focused teaching

Field Manuals should help learners recognize how the concept appears in questions and realistic situations. When appropriate, content should include:

- concise recognition cues;
- memory hooks that reinforce an accurate distinction;
- examples tied directly to the approved lesson source;
- a Recognition Sheet or consolidated Recognition Cues section;
- exam traps that explain a genuinely confusing distinction without teaching test tricks or copied exam content.

Recognition cues must explain why a clue matters. They must not merely reveal an answer without teaching the underlying concept.

### 6.4 Tables and comparisons

Comparison tables should be used when they materially clarify concepts that learners are likely to confuse. They must not be added solely for decoration or to make a lesson appear more comprehensive. Tables require meaningful captions or context, clear headers, accurate relationships, and a responsive presentation that remains usable on narrow screens.

### 6.5 Source and scope fidelity

Every lesson must map to the approved source and taxonomy for its track. Authors must preserve the source's intended terminology, hierarchy, and technical scope. A Field Manual must not introduce unsupported requirements, silently combine unrelated objectives, or force another certification's vocabulary onto the current track.

## 7. Mini Check Standard

Every Field Manual must end with a Mini Check that tests recognition or understanding taught within that same lesson.

The Mini Check must satisfy these requirements:

- It is independently authored for the teaching layer and is not removed from or copied out of an existing assessment bank.
- Its prompt, controls, choices, and correct response are technically accurate and supported by the lesson.
- It has a clearly determinable correct outcome.
- Missing responses produce a clear instruction rather than a loader or runtime error.
- An incorrect response provides encouraging, lesson-specific guidance and keeps the final completion action locked.
- A correct response provides meaningful reinforcement and unlocks the final completion transition.
- Changing an answer after a correct attempt resets the unlocked state until the current response is checked again.
- Completion logic must not be bypassed through a hidden, stale, or previously enabled control.
- Feedback must be announced accessibly, and the newly available completion action should receive or support a logical focus transition.

The interaction type may vary by track or topic. Classification, matching, ordering, selection, command interpretation, code reading, or another suitable format may be used when supported by the shared architecture and approved for that lesson. The Security+ reference uses a two-field classification check, but that exact shape is not universal.

## 8. Completion, Storage, and Progress Isolation

Field Manual completion is a teaching milestone. It must remain separate from Objective Sweep mastery, practice-exam results, lab completion, Captain progress, review data, achievements, statistics, scoring, streaks, and other downstream records unless an explicit future design authorizes a defined integration.

Each track must use an isolated, versioned completion state appropriate to its own architecture. The state should store only the metadata needed to represent completion, such as the objective or lesson identifier, its parent world/chapter/topic, completion status, and an idempotent completion timestamp.

The following rules are mandatory:

- Reopening or recompleting an already completed manual must not create duplicate completion records or repeatedly replace the original completion timestamp unless the track explicitly defines versioned retraining behavior.
- Corrupt or missing completion state must fail safely and must not damage other learner data.
- One certification or course must never read from or write to another track's completion state.
- Manual completion must not alter the existing downstream mastery record.
- A hub may read both manual and mastery records to display separate statuses, but it must not infer one from the other.
- Existing localStorage keys and data formats are protected. They must not be renamed, reset, migrated, or merged without explicit authorization and a backward-compatible plan.

The Security+ reference currently uses `hydra-security-plus-field-manual-v1`. That key is an implementation example only and must not be reused as a universal key.

## 9. Shared Renderer and Component Standard

New manuals should extend a shared Field Manual shell, renderer, styles, and validation approach. Objective-specific duplicate pages or scripts should not be created when the shared architecture can represent the lesson safely.

The shared renderer should support reusable content structures such as:

- paragraphs and ordered teaching sections;
- titled concept entries;
- examples and bullet lists;
- memory hooks and recognition cues;
- accessible comparison tables;
- exam-trap presentation;
- Mini Check controls and feedback;
- completion, return, loading, and error states.

Lesson data must be validated before rendering. At minimum, validation must confirm the supported schema version, track identity, route identity, title, non-empty ordered sections, unique valid section identifiers, a valid Mini Check, and correct responses that exist among the available response options.

If a new objective exposes a genuine shared limitation, the shared implementation may be extended through the smallest compatible change. That change must then be regression-tested against every previously approved Field Manual using the shared architecture. An objective-specific workaround should be used only when the variation is inherently unique and has been approved.

## 10. Universal Rules and Track-Specific Rules

The Field Manual experience must be consistent without erasing legitimate differences between tracks.

| Universal GSA Field Manual rules | Track-specific content and integration rules |
|---|---|
| Teaching layer remains separate from assessment mastery | Approved blueprint, curriculum, lesson guide, or source authority |
| Shared GSA visual hierarchy and interaction pattern | Certification/course name, code, version, terminology, and iconography |
| Visible navigator on every manual | World, chapter, domain, topic, objective, module, or lesson hierarchy |
| One link per rendered section plus Mini Check | Lesson filenames, folders, route parameters, and URL conventions |
| What You Are Learning, mini-lessons, and Mini Check | Number, names, and depth of lesson sections |
| Correct/incorrect gating and reinforcement behavior | Mini Check interaction type and topic-specific responses |
| Completion isolated from mastery and practice | Track-specific completion key and state adapter |
| Shared accessibility, responsive, and validation requirements | Downstream destination such as Sweep, Lab, exercise, or practice mode |
| Regression testing for shared changes | Track-specific progress presentation and mastery system |

Security+, Cloud+, AWS, Linux, A+, Network+, Python, CCNA, and future tracks must retain their own approved content sources and technical language. No track is required to adopt Security+ filenames, storage keys, exam terminology, world count, objective format, or the phrase **Objective Sweep**.

## 11. Accessibility, Responsive, and Browser Requirements

Every Field Manual must remain usable with keyboard, touch, and assistive technology. At minimum:

- The page has a logical heading hierarchy with one clear primary heading.
- Navigation, forms, feedback, completion controls, and return controls have accessible names and semantic elements.
- Mini Check controls have persistent programmatic labels.
- Correct, incorrect, loading, and error feedback uses an appropriate status or live region without creating disruptive duplicate announcements.
- Keyboard focus order is logical, and visible focus indicators are preserved.
- Color is not the only indicator of state.
- Touch targets remain usable on mobile screens.
- Tables remain readable through an accessible responsive treatment.
- Reduced-motion preferences are respected.
- No viewport has unintended horizontal page overflow.
- Text, controls, sections, tables, and actions remain readable and operable at 320px, 390px, 768px, and a representative desktop width.
- The browser console contains zero errors and zero warnings during normal loading, navigation, Mini Check, completion, return, and downstream-launch flows.

## 12. Protected Systems and Change Boundaries

Creating or correcting a Field Manual does not authorize changes to existing question banks, answers, explanations, assessment loaders, quiz engines, practice engines, lab engines, scoring, mastery thresholds, progress logic, review systems, weakness evidence, statistics, achievements, navigation outside the approved Field Manual flow, or unrelated styling.

Those systems may be changed only when a confirmed defect requires it and the correction has been explicitly authorized. Before and after hashes or a tightly scoped diff should be used whenever necessary to demonstrate that protected content remained unchanged.

## 13. Required Validation Checklist

A Field Manual is not complete until all applicable checks pass:

### Content and schema

- The lesson parses successfully and satisfies the supported schema.
- Track, route, objective/topic, title, and source mapping are correct.
- All required teaching sections are present, ordered, and technically accurate.
- Section identifiers are unique and valid.
- **What You Are Learning** is present.
- Recognition cues, tables, Recognition Sheets, and exam traps are used only where educationally appropriate.
- The Mini Check is original to the teaching layer, supported by the lesson, and has a valid correct outcome.

### Navigator and interaction

- **Jump to a Mini-Lesson** is visible regardless of lesson size.
- Navigator link count equals rendered section count plus one.
- Every link reaches the correct visible section or Mini Check target.
- No target IDs are missing or duplicated.
- Incomplete responses fail safely.
- Incorrect responses do not unlock completion.
- Correct responses reinforce the lesson and unlock completion.
- Changing a response after success relocks completion until rechecked.

### Completion and integration

- Manual completion saves only to the approved isolated track state.
- Repeated completion is idempotent.
- Manual completion and downstream mastery display as separate states.
- Return-to-hub and continue-to-assessment routes are correct.
- Direct assessment access, when provided, retains its existing behavior.
- Existing assessment banks, scoring, mastery, progress, and weakness evidence remain unchanged.
- Invalid routes and missing lessons produce a clear recovery path.

### Technical and visual regression

- HTML and JavaScript validation pass.
- Lesson loader and browser runtime pass over HTTP in the supported local and deployed environments.
- Console errors and warnings equal zero.
- No broken internal references are introduced.
- Desktop, tablet, and mobile layouts pass at the required representative widths.
- Horizontal page overflow equals zero.
- Keyboard, focus, labels, feedback announcements, reduced motion, and touch targets pass.
- Every earlier approved manual using changed shared architecture is regression-tested.
- The working-tree diff contains only the authorized manual scope.

## 14. Recommended Production Workflow

Use the following workflow for each new Field Manual:

1. **Confirm authorization and scope.** Identify exactly one approved objective, topic, module, or lesson. Confirm the protected systems and the stop point.
2. **Inspect the track architecture.** Trace the hub, manual route, shared renderer, downstream assessment route, completion state, and existing validators before editing.
3. **Verify the approved source.** Map every intended mini-lesson to the authoritative track-specific curriculum or blueprint. Do not infer or import another track's structure.
4. **Design the lesson outline.** Define **What You Are Learning**, the ordered mini-lessons, appropriate cues/tables/traps, and the Mini Check before production.
5. **Extend shared capabilities only if needed.** Prefer the existing shared renderer and components. If a shared change is necessary, make the smallest compatible change and identify all manuals requiring regression testing.
6. **Author the complete lesson.** Install only a complete, coherent lesson candidate. Do not leave a partial production lesson that appears available to learners.
7. **Connect the hub and routes.** Provide the Field Manual action, preserve any approved direct assessment action, and keep teaching and mastery statuses separate.
8. **Run the complete validation checklist.** Validate schema, content, navigation, Mini Check gating, isolated completion, downstream routing, responsive behavior, accessibility, console health, and protected-file integrity.
9. **Regression-test approved references.** Any shared change must be tested against every existing manual that depends on it. At minimum, the Security+ 1.1 and 1.2 references must remain valid while they use the shared implementation.
10. **Stop for learner review and approval.** Report the exact files changed, lesson sections, navigator count, Mini Check behavior, completion behavior, responsive results, console results, and protected systems confirmed unchanged.

## 15. Approval and Version-Control Gates

Field Manuals are produced one approved objective or lesson at a time unless the user explicitly authorizes a broader scope.

After completing and validating the authorized objective, development must stop before beginning the next objective. Approval of one manual does not authorize the next manual.

No Field Manual work may be staged, committed, pushed, deployed, or incorporated into a release snapshot without explicit authorization. Local approval, Git checkpoint approval, push approval, deployment approval, and release approval remain distinct gates whenever the project workflow treats them separately.

## 16. Definition of Complete

A Giant Slayer's Field Manual is complete only when it accurately teaches its approved scope, exposes every mini-lesson through the required navigator, passes its Mini Check gating, records teaching completion independently, launches the correct existing downstream experience, preserves protected systems, passes accessibility and responsive validation, produces no console errors or warnings, and receives explicit approval.

## 17. Version History

### Version 1.0 — August 24, 2026

- Established the universal Giant Slayer Academy Field Manual architecture.
- Designated Security+ Objectives 1.1 and 1.2 as the initial approved reference implementation.
- Required an always-visible **Jump to a Mini-Lesson** navigator with one link per rendered section and one Mini Check link.
- Defined teaching, Mini Check, completion, storage-isolation, shared-renderer, validation, regression, and authorization standards.
- Distinguished universal GSA requirements from track-specific lesson content and integration rules.

---

**Giant Slayer Academy Field Manuals teach before they test. Every learner should understand what a concept means, recognize how it appears, and know why it matters before being asked to prove mastery.**

**No Objective Left Behind.**
