Giant Slayer Academy — Engineering Handoff
Handoff date: July 30, 2026
Live deployment: [Giant Slayer Academy](https://edace2181.github.io/giant-slayer-academy/index.html)
Repository branch: main
Production Baseline (origin/main): 8500c1e4ce9e2de10f6ae8ca0193db5292159056
Current classification: Publicly deployed beta

This Production Baseline includes the live Network+ PBQ campaign and the Beta Audit fixes. Additional documentation updates and Story Mode planning artifacts currently exist only in the local working tree and are not part of the deployed Production Baseline.
1. Project Overview
Purpose
Giant Slayer Academy is a browser-based certification-learning platform that converts official certification blueprints into RPG-style educational campaigns.
The platform is intended to provide more structure than a conventional question bank. Learners progress through:
Recognition of every published objective
Mixed reinforcement
Higher-difficulty Captain challenges
Exam preparation
Full-length Practice Exams
Applied PBQ or lab experiences where implemented
Review and weakness-recovery systems
The public-facing brand is Giant Slayer Academy. The internal shared learning technology is still called the Hydra engine.
Educational philosophy
The governing doctrine is:
No Objective Left Behind.

The instructional progression is:
Learn → Recognize → Reinforce → Challenge → Conquer

The campaign hierarchy is:
Objective → World → Certification → Academy

Mastery is currently defined as a score of 85% or higher. Scores below 85% produce a “Keep Training” result and do not grant mastery.
Implemented certifications
Certification	Exam blueprint
CompTIA A+ Core 1	220-1201
CompTIA A+ Core 2	220-1202
CompTIA Network+	N10-009
CompTIA Security+	SY0-701
LPI Linux Essentials	010-160, Version 1.6
AWS Certified Cloud Practitioner	CLF-C02

The active multiple-choice corpus contains 6,550 questions.
2. Production Status
Completed
The following platform systems are implemented in the deployed beta, with the local Windows launcher available as a completed local support utility:
Prologue and Academy entrance
Certification cabinet selection
Six certification campaign maps
Worlds 1–5 Objective Sweep
World 6 Mixed Objective Review
World 7 Captain Challenges
World 8 Exam Chamber
Final Dungeon and Final Boss menus
Six Practice Exams per certification
85% mastery doctrine
Practice Exam timers
Certification-isolated progress
Commander Dashboard
Achievement system
Study-time tracking
Flagged Questions
Favorites
Incorrect-answer recovery
Weak Objectives analysis
Adaptive Review
All Review Questions
Session History
PBQ Arena for four CompTIA certifications
Linux Labs
Responsive desktop, tablet, and mobile layouts
Local Windows launcher
GitHub Pages deployment
In beta
Although many components are described as production-complete individually, the integrated platform is still appropriately classified as beta.
Two outside testers are currently using it. The repository does not yet contain a formal tester-feedback log, severity register, or repeatable end-to-end automated test suite.
The main beta concerns are:
Client-only progress persistence
Broad dependence on browser localStorage
Limited automated regression infrastructure
Remaining legacy-page accessibility polish
Story Mode not implemented
No documented Firefox acceptance pass
No formal psychometric validation of question difficulty
Some documentation drift between historical milestones and current implementation
Planned
Story Mode vertical slice
Story combat and quest engine
Story maps, enemies, Guardians, and Giants
Victory Screen
Mini Boss experiences
Additional explicit Recognition Mode controls
Automated continuous-integration validation
Platform-wide focus-visible and reduced-motion follow-up
Optional AWS PBQ campaign
Additional certification campaigns and labs
Story Mode is the final major planned gameplay component. It currently exists only as a local planning effort and has not been implemented, committed, pushed, or deployed. Production has not been authorized beyond its blueprint and vertical-slice planning.
3. Architecture
Application structure
The application is a static web platform built with:
HTML
Shared CSS
Vanilla JavaScript
JSON question and mission banks
Browser localStorage and sessionStorage
GitHub Pages hosting
There is no server-side application, account system, database, API, authentication layer, or cloud synchronization.
Important shared files include:
style.css
campaign-ui.js
campaign-map-ui.js
flagged-questions.js
review-hub.js
dashboard.js
practice-exam-timer.js
objective-quiz-return.js
pbq-engine.js
Shared Hydra engine
campaign-ui.js is the central progress and reporting layer. It defines:
Certification configuration
Total recognition-question counts
Objective counts
Domain labels
Progress normalization
Answer statistics
Objective mastery
World completion
Captain completion
Practice Exam completion
Achievements
Session History
Study-time accumulation
Dashboard summaries
Network+ uses the original shared quiz.js. The other certifications use certification-specific quiz loaders:
aplus-core1-quiz.js
aplus-core2-quiz.js
security-plus-quiz.js
linux-essentials-quiz.js
aws-cloud-practitioner-quiz.js
These loaders preserve the same general UI and results doctrine while supplying certification-specific paths, modes, and navigation.
Question-bank organization
Objective Sweep banks are stored by certification, World, and objective:
json/<certification>/worldN/<objective>-hatchling.json
Network+ retains its original structure:
json/world1/
json/world2/
...
Captain banks use four stable files:
boss-rush-1.json
boss-rush-2.json
weakness-captains.json
final-captain-rush.json
Practice Exams use:
json/<certification>/final-dungeon/practice-exam-N.json
World 6 does not maintain duplicate banks. It dynamically loads the relevant Worlds 1–5 Objective Sweep corpus, shuffles it, and selects the requested number of unique questions.
Question schema
The active Hydra question schema includes:
{
  "id": "globally-unique-id",
  "domain": "1",
  "objective": "1.1",
  "blueprint": "Tested topic",
  "difficulty": "Level 2",
  "question": "Prompt",
  "choices": ["A", "B", "C", "D"],
  "answer": 0,
  "explanation": "Explanation"
}
The answer is a numeric, zero-based index.
Progress tracking
Each certification has an isolated progress key, such as:
hydra-network-plus-progress-v1
hydra-aplus-core1-progress-v1
hydra-aplus-core2-progress-v1
hydra-security-plus-progress-v1
hydra-linux-essentials-progress-v1
hydra-aws-cloud-practitioner-progress-v1
Separate certification-specific keys exist for flags, favorites, incorrect answers, and weakness evidence.
Progress includes:
Objective results
Captain results
Practice Exam results
Questions answered
Correct answers
Current and best streaks
Domain performance
Study time
Achievements
Session History
Current mission
Corrupt storage records are normalized or replaced with safe empty-state structures. Progress remains device- and browser-specific.
Reporting system
The Commander Dashboard provides:
Certification mastery
Objectives mastered
Questions answered
Accuracy
Current and best streaks
Study time
Worlds completed
Practice Exams completed and passed
Strongest and weakest domains
Achievements
Academy-wide totals
Current mission
The Review Hub adds:
Flagged Questions
Favorites
Incorrect Answers
Two-session recovery tracking
Weak Objectives evidence
Ranking reasons
Recurring weakness tracking
Adaptive Review
All Review Questions
Session History
Study-only review sessions do not change certification mastery or campaign scores.
PBQ architecture
The PBQ Arena uses one certification-independent engine and a renderer registry.
Supported renderers:
Matching
Configuration Table
Ordering
Categorization
Classification
Visual Labeling
PBQ banks declare their certification, mission type, tasks, options, solution, scoring, and explanations. Runtime validation rejects:
Missing required fields
Duplicate mission IDs
Wrong-certification content
Unsupported renderers
Missing solutions
Missing explanations
Invalid visual callouts
Invalid scoring definitions
PBQ in-progress state uses certification-specific sessionStorage. It survives refreshes in the same browser tab/session but should not be treated as durable cross-session storage.
Accessibility implementation
Implemented accessibility measures include:
Semantic headings
Image alternative text
Accessible progress bars
aria-disabled for inactive controls
aria-live feedback announcements
PBQ status announcements
Labeled PBQ controls
Keyboard-operable PBQ alternatives
Focusable review and reporting regions
Touch-friendly responsive controls
Mobile PBQ table handling
Accessible Linux terminal output and lab feedback
Accessibility is strong for a custom static learning platform but not yet equivalent to a formal WCAG conformance claim. Legacy focus styling, reduced-motion behavior, and comprehensive screen-reader testing remain follow-up work.
4. Certification Status
Certification	Objective banks/questions	Captain banks/questions	Practice Exams	PBQ/Labs	Status
Network+	25 / 467	4 / 150	6 × 90	25 PBQs	Feature-complete and deployed in public beta; official snapshot exists
A+ Core 1	27 / 455	4 / 120	6 × 90	25 PBQs	Feature-complete and deployed in public beta; official snapshot exists
A+ Core 2	36 / 795	4 / 120	6 × 90	25 PBQs	Feature-complete and deployed in public beta; official snapshot exists
Security+	28 / 797	4 / 120	6 × 90	25 PBQs	Feature-complete and deployed in public beta; official snapshot exists
Linux Essentials	19 / 235	4 / 120	6 × 40	25 Labs + graduation	Feature-complete using Linux Labs and deployed in public beta
AWS Cloud Practitioner	19 / 261	4 / 120	6 × 65	PBQ Coming Soon	Feature-complete and deployed in public beta

Network+
Worlds 1–5: complete
World 6: complete
World 7: 150 Captain questions
Practice Exams: 540 questions
PBQs: 25 missions
Total multiple-choice corpus: 1,157
Immutable v1.0 release snapshot exists
A+ Core 1
Worlds 1–5: 27 objective banks
Recognition questions: 455
World 6: complete
World 7: 120 Captain questions
Practice Exams: 540 questions
PBQs: 25 missions
Total multiple-choice corpus: 1,115
Immutable v1.0 release snapshot exists
A+ Core 2
Worlds 1–5: 36 objective banks
Recognition questions: 795
World 6: complete
World 7: 120 Captain questions
Practice Exams: 540 questions
PBQs: 25 missions
Total multiple-choice corpus: 1,455
Immutable v1.0 release snapshot exists
Security+
Worlds 1–5: 28 objective banks
Recognition questions: 797
World 6: complete
World 7: 120 Captain questions
Practice Exams: 540 questions
PBQs: 25 missions
Total multiple-choice corpus: 1,457
Immutable v1.0 release snapshot exists
Linux Essentials
Worlds 1–5: 19 objective banks
Recognition questions: 235
World 6: complete
World 7: 120 Captain questions
Practice Exams: 240 questions
Total multiple-choice corpus: 595
Linux Labs: 25 graded missions
Mission 26: graduation chamber
Feature-complete using Linux Labs and deployed in public beta
No dedicated Linux certification snapshot currently appears under Releases/
AWS Cloud Practitioner
Worlds 1–5: 19 task-statement banks
Recognition questions: 261
World 6: complete
World 7: 120 Captain questions
Practice Exams: 390 questions
Total multiple-choice corpus: 771
PBQ Arena: Coming Soon
Feature-complete and deployed in public beta
Root-level release notes and audit evidence exist
No dedicated immutable AWS snapshot currently appears under Releases/
5. PBQ System
Production totals
Certification	Missions	Points
Network+	25	157
A+ Core 1	25	107
A+ Core 2	25	144
Security+	25	130
Total	100	538

Renderer coverage
All four PBQ campaigns use the shared renderer registry. Visual Labeling is used by:
Network+: 2 missions
A+ Core 1: 4 missions
A+ Core 2: 1 mission
Security+ currently uses the other five renderer types and has no visual-labeling mission.
Original SVG assets support device, motherboard, network closet, cabling, and operational-safety scenarios.
Validation
The PBQ system validates:
JSON parsing
Schema version
Certification identity
Required mission fields
Unique mission and task IDs
Renderer availability
Task solutions
Task explanations
Positive point values
Partial-credit configuration
Visual asset paths and callouts
Keyboard-operable inputs
Responsive rendering
Return navigation
Clear invalid-route handling
The most recent beta audit exercised all 100 PBQ missions through the live shared engine without blank renderer states.
6. Development Workflow
The established workflow is:
Repository audit
Inspect existing architecture, navigation, loaders, question banks, and release state.

Blueprint phase
Start from the official certification blueprint. Define domains, objectives, World mapping, weighting, and exam length.

Approval gate
Obtain explicit approval before progressing to the next major production stage.

Implementation
Build one controlled phase at a time:
Skeleton
Objective Sweep
World 6
World 7
World 8
Practice Exams
PBQs or labs

Validation
Check JSON, schema, counts, IDs, prompts, originality, loaders, navigation, JavaScript, HTML, and references.

Local acceptance testing
Serve the project through HTTP and test rendered behavior, responsive layouts, console state, and navigation.

Commit
Stage only approved files and preserve unrelated working-tree changes.

Push
Push the approved commit to main.

Deployment verification
Monitor GitHub Pages and verify the live production routes after deployment completes.

Documentation updates
Update the Development Board, release notes, audit evidence, and immutable snapshots at major milestones.

The deployed Production Baseline (origin/main) is:
8500c1e4ce9e2de10f6ae8ca0193db5292159056
Beta Audit: Verified technical fixes and stability improvements
7. Testing and Beta Readiness
Latest validation evidence
The latest repository-wide beta audit reported:
HTML pages inspected: 116
JavaScript files checked: 19
JSON files parsed: 220
Multiple-choice questions: 6,550
Malformed HTML: 0
Missing internal references: 0
Duplicate HTML IDs: 0
JSON parse failures: 0
Question-schema failures: 0
Duplicate question IDs: 0
Duplicate prompts: 0
JavaScript syntax failures: 0
Question-bank modifications during audit: 0
Storage-key changes during audit: 0
Responsive testing covered:
320px
375px
390px
430px
768px
Desktop
The approved fixes were deployed and verified live.
Current beta feedback
Known facts:
Two outside testers are using the platform.
The beta audit identified genuine navigation, AWS progress, accessibility-announcement, placeholder, and PBQ fallback defects.
Those confirmed defects were fixed and deployed.
What is not yet present:
A formal tester-feedback ledger
Reproduction templates
Browser/device coverage records per tester
Severity and triage fields
Long-duration progress-corruption testing
Quantitative usability or learning-outcome data
Remaining risks
Client-only storage
Clearing browser data or changing devices loses progress.

No authentication or synchronization
There is no learner account, backup, migration, or cloud-save layer.

Limited automated regression testing
Validation is extensive but primarily bespoke scripts and manual browser checks.

Documentation drift
Some roadmap entries still list shipped features as future work.

Release-snapshot inconsistency
Four CompTIA snapshots exist under Releases/; Linux and AWS are documented differently.

Accessibility follow-up
No formal WCAG conformance audit has been issued.

Browser coverage
Chrome/Edge-oriented testing is stronger than Firefox testing.

Question quality assurance
Structural originality and duplicate checks exist, but there is no external psychometric calibration.

Story Mode integration risk
Story Mode will introduce the first major new stateful gameplay layer and must remain isolated from certification mastery.

8. Documentation State
Production documentation
The deployed Production Baseline (origin/main) is commit 8500c1e4ce9e2de10f6ae8ca0193db5292159056.

[README.md](C:\\Projects\\Hydra Academy\\README.md) in the Production Baseline emphasizes AWS Cloud Practitioner and Linux Labs. It describes the platform as officially complete, which conflicts slightly with the current beta classification and unfinished Story Mode.
It is useful but not yet a neutral platform-wide onboarding document.

[DEVELOPMENT-BOARD.md](C:\\Projects\\Hydra Academy\\DEVELOPMENT-BOARD.md) is Version 1.9 in the Production Baseline.

[DEVELOPMENT-STANDARD.md](C:\\Projects\\Hydra Academy\\DEVELOPMENT-STANDARD.md) is Version 1.2 and defines:
Campaign progression
Question standards
Practice Exam originality
Network+ as the structural reference
Browser-verification requirements
Release gates
Versioning
Release snapshots
Release history
Immutable release directories exist for:
Network+ v1.0
A+ Core 1 v1.0
A+ Core 2 v1.0
Security+ v1.0
Root-level release evidence exists for:
AWS Cloud Practitioner v1.0
Linux Labs v1.0
Linux Objective Sweep lock
Linux campaign polish
Objective maps and certification addenda

Local, uncommitted documentation
[DEVELOPMENT-BOARD.md](C:\\Projects\\Hydra Academy\\DEVELOPMENT-BOARD.md) is at Version 1.10 in the local working tree. It records:
Certification milestones
Better Study Tools
PBQ releases
Linux Labs
AWS
Story Mode blueprint
Current vertical-slice planning

The local repository currently contains uncommitted work:
Modified README.md
Modified DEVELOPMENT-BOARD.md
Untracked GIANT-SLAYER-ACADEMY-STORY-MODE-BLUEPRINT-v1.0.docx
These files are not part of the deployed Production Baseline (origin/main), commit 8500c1e4ce9e2de10f6ae8ca0193db5292159056.
9. Future Roadmap
Linux Essentials
The core certification campaign and its purpose-built Linux Labs experience are feature-complete and deployed in public beta.
Plausible next work:
Additional advanced Linux labs
Stronger lab analytics
Durable progress export/import
Dedicated immutable Linux certification snapshot
AWS Cloud Practitioner
The feature-complete campaign is deployed in public beta.
Remaining opportunities:
AWS PBQ campaign
Applied cloud architecture simulations
AWS-specific labs or guided scenarios
Immutable release snapshot under Releases/
Updated AWS documentation reflecting current Git/GitHub status
Story Mode
Story Mode is the active local planning milestone. It has not been implemented, committed, pushed, or deployed.
The blueprint defines:
Player-facing Giant Slayer universe
Certification kingdoms
Domain provinces
Objective regions
NPCs
Main and side quests
Normal enemies
Elite enemies
Objective Guardians
Certification Giants
Repeatable arenas
Story XP
Question-powered combat
Separation between Story progress and certification mastery
The next approved activity should be planning one A+ Core 1 vertical slice, not building the entire Story system.
Commander Dashboard
The dashboard is already implemented.
Future improvements could include:
Progress export/import
Cross-device synchronization
More detailed historical trends
Session charts
Tester diagnostics
Story Mode statistics
CompTIA PBQ and Linux Labs summaries
Future certifications
The Development Standard supports additional certification campaigns, but no new certification should begin before the Story Mode vertical slice and beta stabilization priorities are resolved.
Potential future programs previously discussed include:
Advanced Linux pathways
Additional cloud certifications
Other foundational IT certifications
10. Overall Engineering Assessment
Giant Slayer Academy is substantially more mature than a prototype. It is a real, publicly deployed static learning platform with:
Six feature-complete certification campaigns within the publicly deployed beta
6,550 validated multiple-choice questions
100 PBQ missions
25 graded Linux Labs
A shared progress system
Review and recovery tools
Practice Exam timing
Responsive layouts
Accessibility support
Release standards
Live deployment discipline
However, it should not yet be described as a fully mature commercial learning-management system.
Its strongest qualities are:
Breadth of objective coverage
Reusable campaign architecture
Certification isolation
Originality discipline
Consistent mastery rules
Review and recovery tooling
Applied CompTIA PBQ and Linux Labs systems
Careful release verification
Its main engineering weaknesses are:
No backend or learner accounts
No cloud progress synchronization
Limited automated regression infrastructure
Uneven release-snapshot/documentation consistency
No formal accessibility certification
No formal psychometric validation
Story Mode not yet implemented
Early-stage external beta evidence
Final maturity judgment
Educational content platform: advanced beta
Static application architecture: stable
Certification campaign infrastructure: production-capable
CompTIA PBQ and Linux Labs systems: production-capable within current scope
Cross-device learner platform: incomplete
Automated QA maturity: developing
Story-driven game layer: planned
Overall product status: credible public beta, not yet final platform release
The correct next engineering move is to preserve the current stable Hydra learning engine, formalize beta feedback, strengthen automated regression coverage, and build only one carefully isolated Story Mode vertical slice before expanding further.
