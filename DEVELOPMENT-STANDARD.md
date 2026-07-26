# Hydra Academy Development Standard

**Version 1.2**  
**Date: July 14, 2026**

## 1. Purpose

This document defines the official internal development methodology for Hydra Academy. It governs the planning, construction, validation, release, and maintenance of every certification campaign, including Network+, A+ Core 1, A+ Core 2, Security+, Linux Essentials, AWS Cloud Practitioner, and future programs.

The standard exists to keep campaigns educationally complete, technically compatible, independently versioned, and consistent with the architecture already proven by Hydra Academy Network+ and A+ Core 1. It is an engineering document and is not student-facing course content.

## 2. Hydra Philosophy

The official Hydra Academy doctrine is:

> **No Objective Left Behind.**

Hydra Academy converts a certification blueprint into a deliberate progression rather than treating the exam as a disconnected collection of facts. Every published objective must first be represented, then reinforced, combined with other concepts, challenged through scenarios, and finally assessed under exam conditions.

The learning progression is:

1. **Learn** — Encounter the knowledge and terminology defined by the certification blueprint.
2. **Recognize** — Identify each published objective, child bullet, and nested sub-bullet in focused questions.
3. **Reinforce** — Revisit the completed objective pool through shuffled mixed review.
4. **Challenge** — Apply multiple concepts through Captain-level troubleshooting and best-action scenarios.
5. **Conquer** — Demonstrate readiness in full-length, weighted Practice Exams.

## 3. Campaign Architecture

Every full Hydra Academy certification campaign follows this standard flow:

```text
Worlds 1–5 → Objective Sweep
World 6 → Mixed Objective Review
World 7 → Captain Challenges
World 8 → Exam Chamber
Final Dungeon → Six Practice Exams
Final Static Release Audit
Official Release
```

The campaign map provides the high-level progression. Worlds 1–5 organize the certification domains and objectives. The shared quiz interface loads the appropriate JSON bank or dynamically assembled pool based on the selected world, mode, objective, or exam. Results return the learner to the menu that launched the activity.

## 4. World Standards

### Worlds 1–5: Objective Sweep

Worlds 1–5 provide complete recognition coverage of the current certification blueprint. The objective structure may contain more or fewer individual objectives than another certification, but each published parent bullet, child bullet, and nested sub-bullet must be mapped exactly once during the Objective Sweep.

Objective Sweep questions are short, focused, and primarily Level 2. Their purpose is recognition and coverage, not final-exam difficulty. Each objective is stored in its own JSON bank, and the corresponding objective menu must load that bank through the campaign's quiz engine.

An Objective Sweep is complete only when the project has a documented one-to-one mapping, with no missing, extra, or repeated mappings.

### World 6: Mixed Objective Review

World 6 reinforces the completed Objective Sweep. It does not maintain an independent question bank and must not introduce new questions. Instead, its loader combines every active objective bank from Worlds 1–5, removes duplicate IDs defensively, shuffles the combined pool, and selects the requested number of questions without replacement.

The standard modes are Mixed Run 25, Mixed Run 50, Weakness Mix, and Random Gauntlet. Until persistent weakness tracking is implemented for a campaign, Weakness Mix may use the approved temporary behavior of selecting 25 random questions from the same Worlds 1–5 pool. Random Gauntlet selects from the full pool without domain balancing.

### World 7: Captain Challenges

World 7 uses new, dedicated Captain questions. It must never be implemented as a remix of Objective Sweep prompts. Captain questions emphasize troubleshooting, analysis, best-next-step decisions, configuration judgment, realistic workplace constraints, and integration across objectives.

The standard World 7 menu contains four modes: Boss Rush I, Boss Rush II, Weakness Captain Rush, and Final Captain Rush. Each mode points to its own JSON bank. The approved question total and per-bank allocation may be defined by the certification plan, but every Captain bank must remain separate, parseable, and directly loadable.

Captain questions are Level 3 or Level 4 unless a certification-specific design has an explicitly approved legacy Captain scale. No recognition-only Level 2 questions belong in a new Captain bank.

### World 8: Exam Chamber

World 8 is the transition from campaign training to final assessment. It does not duplicate Practice Exam selection or maintain a separate question bank. Its purpose is to establish the Exam Chamber and route the learner into the Final Dungeon.

The required progression is Campaign Map → World 8 Exam Chamber → Final Dungeon → Final Boss Practice Exam Menu. A campaign's campaign-map Final Dungeon card must route through World 8 so the intended progression cannot be bypassed.

### Final Dungeon

The Final Dungeon contains the Final Boss entry point and may display explicitly disabled future features such as PBQ Arena or Victory Screen. Unimplemented controls must remain visibly marked Coming Soon, must not navigate, and should use accessible disabled-state metadata.

The Final Boss menu provides six distinct Practice Exam buttons. Each button must load its own numbered JSON bank through the shared campaign quiz engine. Practice Exam results must contain exactly one return link to the Final Boss Practice Exam menu.

## 5. Question Standards

Active question banks are JSON arrays. Every question must be compatible with the current Hydra quiz engines and contain the following core fields:

```json
{
  "id": "globally-unique-id",
  "domain": "1",
  "objective": "1.1",
  "blueprint": "Concise blueprint topic",
  "difficulty": "Level 2",
  "question": "Question prompt",
  "choices": [
    "Choice A",
    "Choice B",
    "Choice C",
    "Choice D"
  ],
  "answer": 0,
  "explanation": "Why the selected answer is correct."
}
```

Each question must have exactly four answer choices and one clearly best answer. The `answer` value must be a numeric, zero-based index from `0` through `3` and must reference an existing choice. Explanations must state why the correct answer resolves the question; concise distractor analysis may be included when the campaign schema supports it.

The `objective` field identifies the applicable published objective. Integrated questions may use an approved combined value when more than one objective is genuinely assessed. The `blueprint` field must be nonempty and must identify the specific tested topic rather than merely repeating a world or bank name. The `difficulty` field must use the approved Hydra difficulty vocabulary.

Questions must be original. Commercial questions, exam dumps, copied questions, and lightly paraphrased questions are prohibited. Prompts, IDs, and—during final assessment production—substantive scenario content must be checked against every active Hydra bank.

## 6. Practice Exam Originality Standard

Every Practice Exam must be independently authored. Each exam must assess the approved certification blueprint through its own substantive scenarios, reasoning paths, technical decisions, and contextual conditions.

Changing only organization names, user names, locations, device names, introductory wording, or other surface details does not create an original question. Adding a different narrative wrapper around the same underlying situation, sequence of facts, correct answer, and reasoning path is rewording rather than independent authorship and does not satisfy Hydra Academy originality requirements.

Practice Exams may test the same published objectives because blueprint coverage and weighting must remain consistent across the full exam suite. However, each examination must approach those objectives through substantially different circumstances. Differences should include the evidence presented, operational constraints, symptoms, required analysis, competing answer choices, and the reasoning needed to select the best response.

Independent authorship does not permit domain weighting or difficulty requirements to drift. Every exam must retain its approved question count, objective coverage, domain distribution, and difficulty distribution while providing genuinely distinct assessment content.

Practice Exam validation must therefore include both exact-duplicate checks and substantive similarity review. A suite does not pass originality validation merely because its full prompt strings, IDs, or answer-choice arrays are technically unique. Reviewers must check for reused scenario cores, repeated reasoning sequences, aligned question templates, lightly paraphrased conditions, and other forms of structural duplication across exams.

## 7. HTML Structure Standard

Network+ is the canonical HTML layout and design reference for Hydra Academy. All future certification campaigns, including A+ Core 1, A+ Core 2, Security+, Linux, AWS, and later programs, shall preserve the established Network+ HTML structure unless this Development Standard is intentionally revised.

The following structures shall remain consistent across certifications:

- Landing page
- Campaign Map
- World intro cards
- Press Start transition
- Message box layout
- Mode menu layout
- Campaign row structure
- World card structure
- World 8
- Final Dungeon
- Final Boss menu
- Quiz page layout
- Commander Status panel
- Active-session Return control
- Results return-link behavior

Campaigns must reuse the existing shared CSS classes whenever possible. Certification-specific titles, colors, links, objective content, JSON paths, and question banks remain campaign-owned, but they must not introduce a separate layout structure when an equivalent Network+ implementation already exists.

When a visual defect is discovered, engineers shall troubleshoot in this order:

1. Compare the page's HTML structure against the corresponding Network+ page.
2. Verify that the established shared CSS classes are present and used correctly.
3. Verify the JavaScript behavior controlling transitions, visibility, return controls, and results state.
4. Modify shared CSS only when the defect is confirmed to be a genuine shared design problem.

This order prevents certification-specific markup or styling from masking a structural mismatch and protects the approved appearance of existing campaigns.

## 8. Browser Verification Standard

Every certification must successfully complete a live browser verification before release. Static HTML, JavaScript, JSON, and reference checks remain mandatory, but they do not replace direct verification of rendered layout and interactive behavior.

Browser verification shall confirm:

- The landing page renders correctly.
- The Campaign Map matches the canonical Network+ layout.
- Worlds 1–8 render correctly.
- The Press Start transition functions.
- Objective menus display correctly.
- Quiz pages load correctly.
- Active-session Return controls are visible, functional, and route correctly.
- Results pages generate exactly one Return link to the appropriate menu.
- Desktop rendering is usable and consistent.
- Tablet rendering is usable and consistent.
- Narrow-screen and mobile rendering are usable and introduce no unintended horizontal overflow.
- The browser console contains no runtime errors.
- Navigation paths function correctly from campaign entry through results and return navigation.

The verification report must distinguish behavior actually observed in a browser from conclusions derived through static analysis. A release audit is not considered complete until browser verification passes.

## 9. Naming Standards

New campaigns must use human-readable, certification-prefixed string IDs. The prefix should identify the certification or exam code and prevent collisions with every other Hydra campaign.

### Recognition questions

The current A+ Core 1 convention is:

```text
A1201-1.1-R01
```

The format is `{certification-prefix}-{objective}-R{sequence}`. Sequence numbers are zero-padded within the objective bank. The `R` designates Objective Sweep recognition content.

### Captain questions

The current A+ Core 1 convention is:

```text
A1201-W7-BR1-001
```

The format is `{certification-prefix}-W7-{mode-code}-{sequence}`. Approved mode codes should be concise and stable, such as `BR1`, `BR2`, `WCR`, and `FCR`.

### Practice Exam questions

The current A+ Core 1 convention is:

```text
A1201-PE1-001
```

The format is `{certification-prefix}-PE{exam-number}-{sequence}`. Each Practice Exam begins its own zero-padded sequence while retaining global uniqueness through the certification prefix and exam number.

Released legacy campaigns may retain established numeric IDs for compatibility. Existing released IDs must not be renumbered merely to adopt a newer convention. All newly created campaigns should use the prefixed convention unless an approved migration standard supersedes it.

File and route names should remain lowercase, use hyphens, and describe their role. Objective banks follow the established `{objective}-hatchling.json` pattern. Captain banks use stable mode filenames, and Practice Exams use `practice-exam-{number}.json` under the campaign's `final-dungeon` directory.

## 10. Difficulty Standards

### Level 2: Recognition and direct application

Level 2 questions confirm that the learner recognizes a concept, component, protocol, tool, symptom, or straightforward action. They normally assess one primary concept and are the default for Objective Sweep content. A modest scenario is acceptable, but unnecessary ambiguity is not.

### Level 3: Analysis and troubleshooting

Level 3 questions require the learner to interpret symptoms, combine related concepts, choose an appropriate tool, or identify the best next step. Distractors should be plausible and should reflect common technical mistakes. Level 3 is appropriate for Captain challenges and the middle portion of Practice Exam difficulty.

### Level 4: Integrated judgment

Level 4 questions require multi-step reasoning, competing plausible answers, operational constraints, or integration across objectives. The learner must choose the best, first, next, or most likely response based on the complete scenario. Level 4 represents the hardest Hydra content before or within the Final Dungeon.

New Captain and Practice Exam banks must not use Level 1. A certification's approved exam plan must define and validate its exact difficulty distribution before release.

## 11. Validation Standards

Validation is required at every milestone and again across the complete campaign before release. At minimum, the following checks must pass:

- Every JSON file parses successfully and contains an array in the form expected by the loader.
- Every question contains all required fields, exactly four choices, and a valid zero-based answer index.
- Every ID is nonempty and globally unique across active Hydra question banks.
- Every prompt is globally unique across active Hydra question banks.
- Every Practice Exam passes substantive scenario-originality review in addition to exact prompt comparison.
- Objective Sweep coverage matches the published mapping manifest with no missing, extra, or repeated mappings.
- World 6 loads every intended objective bank, requests the correct counts, shuffles questions, and introduces no duplicates within a run.
- Every Captain mode and Practice Exam button resolves to its intended separate JSON bank.
- Loader paths, result destinations, return links, and campaign navigation are internally consistent.
- JavaScript syntax checks pass for every active campaign engine and shared script.
- HTML structure is balanced, IDs are not duplicated, and linked stylesheets and scripts exist.
- Every local HTML, CSS, JavaScript, JSON, image, audio, and asset reference resolves to an existing file.

Static validation must not be represented as browser-runtime validation. Browser interaction, responsive rendering, audio behavior, and console behavior should be recorded separately when they are actually tested.

## 12. Release Process

The official Hydra release workflow is:

```text
Objective Sweep Complete
          ↓
World 6 Approved
          ↓
World 7 Complete
          ↓
World 8 Approved
          ↓
Practice Exams Complete
          ↓
Final Static Audit
          ↓
Release Snapshot
          ↓
RELEASE-NOTES.md
          ↓
VERSION.txt
          ↓
Official Release
```

Each gate must be approved before production begins on the next major stage. A release audit is read-only. Defects discovered during an audit must be reported and approved before corrective changes are made. After corrections, affected validations must be rerun.

The release snapshot is created under `Releases/` in its own certification-and-version directory. It must preserve the active project's directory structure, include every required runtime asset, and exclude unrelated editor metadata and prior release trees. Source-to-release hashes must be compared for every copied project file.

## 13. Release Requirements

A certification campaign may be designated Version 1.0 only when all of the following conditions are met:

1. Published objective coverage is 100 percent.
2. Missing, extra, and repeated Objective Sweep mappings are zero.
3. Active JSON banks parse and satisfy the required schema.
4. Duplicate question IDs are zero.
5. Duplicate question prompts are zero.
6. Every Practice Exam is independently authored and passes substantive scenario-originality review.
7. World 6, World 7, World 8, the Final Dungeon, and all six Practice Exams are connected to their intended loaders and menus.
8. Practice Exam counts, domain weighting, and difficulty weighting match the approved certification plan.
9. HTML, JavaScript, navigation, and internal reference validation pass.
10. Live browser verification passes for desktop, tablet, and narrow-screen rendering, interactive transitions, return controls, results navigation, and browser-console behavior.
11. The Final Static Release Audit concludes with release approval or approval with only non-blocking notes.
12. The release snapshot exists, contains the required files, passes hash verification, and includes `RELEASE-NOTES.md` and `VERSION.txt`.

## 14. Versioning Policy

Certification campaigns are versioned independently. Completing or revising one certification does not automatically change the version of another.

Examples include:

- Hydra Academy Network+ v1.0
- Hydra Academy A+ Core 1 v1.0
- Hydra Academy A+ Core 2 v1.0

A campaign's version identifies the state of that certification's objectives, questions, navigation, and release assets. A revised exam blueprint, material question-bank revision, or incompatible campaign change may require a new campaign version according to the scope of the change.

The Hydra Academy platform may evolve independently from individual certification versions. Shared launcher, styling, accessibility, loader, or platform improvements may have their own platform lifecycle, provided existing released certification snapshots remain immutable.

## 15. Future Expansion

The architecture and validation gates in this standard are reserved for future certification campaigns, including:

- A+ Core 2
- Security+
- Linux Essentials
- AWS Cloud Practitioner

Each future campaign must begin with its current official blueprint, define its certification prefix and objective-to-world mapping, complete the Objective Sweep, and proceed through the same approval gates. Future capabilities may extend the platform, but they must not weaken objective coverage, question originality, loader compatibility, validation, or release isolation.

## 16. Version History

### Version 1.0

- Established the Hydra Academy development methodology.
- Defined the World progression, validation standards, and official release process.

### Version 1.1

- Added the Practice Exam Originality Standard.
- Required every Practice Exam to be independently authored.
- Clarified that rewording an existing scenario or changing surface details is not sufficient.
- Required new scenarios to differ substantially in context, evidence, reasoning, and assessment while maintaining blueprint coverage, domain weighting, and difficulty distribution.
- Added substantive similarity review to Practice Exam validation and release requirements.

### Version 1.2

- Added the HTML Structure Standard.
- Designated Network+ as the canonical Hydra Academy visual and layout reference.
- Added the Browser Verification Standard.
- Defined the troubleshooting order as HTML structure, shared CSS usage, then JavaScript behavior.
- Required live browser verification before every official release.

## 17. Guiding Principle

Hydra Academy exists to transform certification objectives into progressive mastery through structured learning.

**No Objective Left Behind.**
