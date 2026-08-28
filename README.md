# Giant Slayer Academy v1.0

**Official release status: Complete and ready for the world.**

Giant Slayer Academy is a browser-based certification training platform that turns official exam objectives into campaign-style learning paths. Each campaign progresses through objective recognition, mixed review, Captain challenges, an Exam Chamber, and full-length practice exams.

## Linux Labs v1.0

Linux Labs adds a complete learn-by-doing path for LPI Linux Essentials:

- 25 skill-first missions covering all 19 Version 1.6 objectives
- Mission Briefing, Learn, Walkthrough, Guided Practice, Commander Challenge, Debrief, and Fenrir's Tip
- A safe browser-contained Linux simulator
- State-based grading that accepts valid alternative command sequences
- Three progressive hints: Concept, Recognition, and Command
- Persistent progress, replay, keyboard support, accessibility announcements, and responsive layouts
- Mission 26 graduation chamber with Fenrir's completion message

Live routes:

- [Linux Labs](https://edace2181.github.io/giant-slayer-academy/linux-labs.html)
- [Giant Slayer Academy](https://edace2181.github.io/giant-slayer-academy/index.html)

## AWS Certified Cloud Practitioner v1.0

The AWS Certified Cloud Practitioner campaign is production-complete for the CLF-C02 blueprint.

| Component | Production total |
|---|---:|
| Objective Sweep | 19 banks / 261 questions |
| Captain Rush | 4 banks / 120 questions |
| Practice Exams | 6 exams / 390 questions |
| **AWS question corpus** | **771 questions** |

Every practice exam contains 65 independently authored, four-choice, single-best-answer questions with this distribution:

| CLF-C02 domain | Questions per exam |
|---|---:|
| Cloud Concepts | 16 |
| Security and Compliance | 19 |
| Cloud Technology and Services | 22 |
| Billing, Pricing, and Support | 8 |

Difficulty per exam is 20 Level 2, 26 Level 3, and 19 Level 4 questions. Correct-answer positions are balanced 17 / 16 / 16 / 16.

## Campaign progression

1. Worlds 1–5: Objective Sweep across all 19 CLF-C02 task statements
2. World 6: Dynamic Mixed Objective Review
3. World 7: Boss Rush I, Boss Rush II, Weakness Captain Rush, and Final Captain Rush
4. World 8: Exam Chamber
5. Final Dungeon: Six 65-question Practice Exams

The platform also includes flags, favorites, incorrect-answer recovery, weakness evidence, adaptive review, and certification-isolated session history.

## Run locally

On Windows, launch `Launch Hydra Academy.bat`, then open the local address displayed by the launcher. The site can also be served with any local static web server from the project root.

Start at `index.html` and select **AWS Cloud Practitioner**.

## Project structure

- `json/aws-cloud-practitioner/` — AWS Objective Sweep, Captain, and Practice Exam banks
- `aws-cloud-practitioner-*.html` — AWS campaign screens and navigation
- `aws-cloud-practitioner-quiz.js` — AWS quiz loader and runtime behavior
- `AWS-CLOUD-PRACTITIONER-OBJECTIVE-MAP.md` — CLF-C02 objective mapping
- `AWS-CLOUD-PRACTITIONER-DEVELOPMENT-ADDENDUM-v1.0.md` — campaign production standard
- `LINUX-LABS-v1.0-RELEASE-NOTES.md` — Linux Labs release summary
- `LINUX-LABS-v1.0-AUDIT.json` — machine-readable Linux Labs release evidence
- `GIANT-SLAYER-ACADEMY-PROJECT-HISTORY.md` — evidence-based Part 1 project chronology
- `GIANT-SLAYER-ACADEMY-STORY-MODE-BLUEPRINT-v1.0.docx` — canonical Story Mode world, progression, combat, quest, and vertical-slice blueprint
- `DEVELOPMENT-STANDARD.md` — platform engineering and release requirements
- `DEVELOPMENT-BOARD.md` — roadmap and release-history ledger

## Validation status

AWS Cloud Practitioner v1.0 passed its final static release audit:

- 29 populated AWS JSON banks
- 771 schema-valid questions
- zero duplicate IDs, prompts, or explanations
- zero scenario-core conflicts at the release audit threshold
- valid World 6, World 7, and Practice Exam loaders
- valid Final Dungeon and Final Boss navigation
- valid internal HTML links
- clean JavaScript syntax

See `AWS-CLOUD-PRACTITIONER-v1.0-RELEASE-NOTES.md` for the complete release summary.
Machine-readable release evidence is available in `AWS-CLOUD-PRACTITIONER-v1.0-AUDIT.json`.

## Screenshots recommended for GitHub

- Main Academy gate or certification-selection screen
- AWS Cloud Practitioner campaign map
- One Objective Sweep selection screen
- A World 6 Mixed Review question
- World 7 Captain Rush menu
- World 8 Exam Chamber
- Final Dungeon / Final Boss six-exam menu
- A Practice Exam question and results screen
- Review Hub showing flags, weaknesses, or adaptive review

For a short GIF, capture: AWS campaign map → World 7 or World 8 → Final Dungeon → Practice Exam launch → answer feedback.

## Disclaimer

Giant Slayer Academy is an independent training project. It is not affiliated with, sponsored by, or endorsed by Amazon Web Services. AWS product names and certification marks belong to their respective owners.

## Licensing

### Software license

The Giant Slayer Academy software is licensed under the MIT License. See `LICENSE` for the complete terms.

### Educational content and brand assets

The original question banks, explanations, course content, artwork, audio, logos, branding, and other original educational or creative materials are © 2026 Edelmiro Acevedo. All rights reserved unless otherwise stated. These materials are not licensed under the MIT License.

## Release

AWS Certified Cloud Practitioner campaign: **v1.0 — July 25, 2026**

**No Objective Left Behind.**
