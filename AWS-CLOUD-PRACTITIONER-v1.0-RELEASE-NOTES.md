# AWS Cloud Practitioner v1.0 Release Notes

**Release date:** July 25, 2026  
**Certification:** AWS Certified Cloud Practitioner  
**Exam blueprint:** CLF-C02  
**Campaign status:** Production-complete

## Release summary

AWS Cloud Practitioner v1.0 delivers the complete Giant Slayer Academy campaign progression from introductory objective recognition through six full-length practice exams.

| Release component | Banks | Questions |
|---|---:|---:|
| Worlds 1–5 Objective Sweep | 19 | 261 |
| World 7 Captain Rush | 4 | 120 |
| Practice Exams 1–6 | 6 | 390 |
| **Total production corpus** | **29** | **771** |

World 6 dynamically combines all 19 Objective Sweep banks and does not duplicate questions in an independent bank.

## Completed campaign surfaces

- AWS Foundation and campaign landing experience
- Worlds 1–5 with all 19 official CLF-C02 task statements
- World 6 Mixed Run 25, Mixed Run 50, Weakness Mix, and Random Gauntlet
- World 7 Boss Rush I, Boss Rush II, Weakness Captain Rush, and Final Captain Rush
- World 8 Exam Chamber
- Final Dungeon and Final Boss menu
- Six independent 65-question Practice Exams
- Certification-isolated flags, favorites, incorrect-answer recovery, weakness evidence, adaptive review, and session history

## Practice Exam standard

Every Practice Exam contains:

- 65 original questions
- Four choices and one correct answer
- 16 Cloud Concepts questions
- 19 Security and Compliance questions
- 22 Cloud Technology and Services questions
- 8 Billing, Pricing, and Support questions
- 20 Level 2 questions
- 26 Level 3 questions
- 19 Level 4 questions
- Balanced correct-answer positions: 17 / 16 / 16 / 16

## Final release audit

The completed release passed:

- JSON parsing for all 29 AWS banks
- Schema validation for all 771 questions
- Required field, answer-index, and four-unique-choice validation
- Exact Practice Exam domain and difficulty validation
- Loader-path validation for Objective Sweep, Mixed Review, Captain Rush, and all six Practice Exams
- Internal HTML link and Final Boss navigation validation
- JavaScript syntax validation
- Empty-bank audit
- Duplicate ID, normalized prompt, and normalized explanation audits
- Scenario-core similarity audit

Final audit results:

- Empty production banks: 0
- Duplicate IDs: 0
- Duplicate prompts: 0
- Duplicate explanations: 0
- Scenario-core conflicts at the release threshold: 0
- Missing loader paths: 0
- Broken HTML navigation targets: 0
- JavaScript syntax failures: 0

The final machine-readable audit is preserved as `AWS-CLOUD-PRACTITIONER-v1.0-AUDIT.json` in the project root.

## Version decision

AWS Cloud Practitioner is independently designated **Version 1.0**. This is the first complete production release of the CLF-C02 campaign. The Hydra Academy platform remains Version 1.0; completing this campaign does not require a platform major-version change.

Future changes to the CLF exam code, official task statements, service scope, weighting, question schema, or campaign compatibility must be documented under a new campaign version.

## Repository publication notes

Recommended repository media:

- Campaign map overview
- Objective Sweep screen
- Mixed Review gameplay
- Captain Rush menu
- Exam Chamber and Final Dungeon progression
- Six-exam Final Boss menu
- Practice Exam question and results views
- Review Hub capabilities

A 10–20 second GIF should show the progression from the AWS campaign map into the Final Dungeon and a Practice Exam.

## Known publication cleanup

- The project folder is not currently initialized as a Git repository.
- A license file has not been identified and should be chosen before public distribution.
- Editor metadata such as `.vs/` should be excluded with a `.gitignore`.
- Large PNG and MP3 assets should be reviewed for repository size and licensing.
- Browser screenshots and a short demonstration GIF still need to be captured.

No production question banks were modified during release documentation preparation.

---

**AWS Cloud Practitioner v1.0: Approved for GitHub release preparation.**
