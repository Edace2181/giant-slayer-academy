# AWS Cloud Practitioner Development Addendum

**Version 1.0**  
**Date: July 25, 2026**

This addendum governs the AWS Certified Cloud Practitioner campaign and inherits Hydra Academy Development Standard v1.2 and all later approved platform standards unless this document explicitly states otherwise.

## 1. Official Blueprint Source

- **Certification:** AWS Certified Cloud Practitioner
- **Exam code:** CLF-C02
- **Official source:** AWS Certified Cloud Practitioner Exam Guide (CLF-C02)
- **Official structure:** Four content domains and 19 task statements
- **Question formats:** Multiple choice and multiple response
- **Exam composition:** 50 scored questions and 15 unscored questions
- **Passing score:** 700 on a 100–1,000 scaled-score range

Official scored-content weighting:

| Domain | Weight |
|---|---:|
| 1. Cloud Concepts | 24% |
| 2. Security and Compliance | 30% |
| 3. Cloud Technology and Services | 34% |
| 4. Billing, Pricing, and Support | 12% |

## 2. Campaign Structure

The campaign preserves all 19 official task statements while distributing the large third domain across two learning worlds:

| World | Official content | Banks |
|---|---|---:|
| 1 | Domain 1, Task Statements 1.1–1.4 | 4 |
| 2 | Domain 2, Task Statements 2.1–2.4 | 4 |
| 3 | Domain 3, Task Statements 3.1–3.4 | 4 |
| 4 | Domain 3, Task Statements 3.5–3.8 | 4 |
| 5 | Domain 4, Task Statements 4.1–4.3 | 3 |

World 6 dynamically combines all 19 Objective Sweep banks and must not maintain an independent duplicate question bank. World 7 contains four Captain banks. World 8 serves as the Exam Chamber. The Final Dungeon leads to six Practice Exams.

## 3. Question Production

Every question must map to an official CLF-C02 task statement and one or more published knowledge or skill items. The in-scope and out-of-scope service lists are authoritative content guardrails.

Objective Sweep questions are introductory recognition questions. Captain and Practice Exam questions require scenario interpretation, service selection, cloud-economics reasoning, security-responsibility analysis, or best-next-step judgment.

All AWS service names, capabilities, responsibility boundaries, pricing concepts, and support-plan descriptions must be technically accurate at the time of production. Content must not claim affiliation with or endorsement by Amazon Web Services.

## 4. Practice Exams

Each Practice Exam must contain exactly 65 independently authored questions. Domain distribution must approximate the official weighting as closely as whole-question counts permit:

- Cloud Concepts: 16
- Security and Compliance: 19
- Cloud Technology and Services: 22
- Billing, Pricing, and Support: 8

Total: 65 questions.

Hydra Academy Version 1.0 uses the existing four-choice, single-best-answer JSON schema. This preserves shared-engine compatibility while covering the official knowledge and skills. Native multiple-response support requires a separately approved engine enhancement and must not be simulated through an invalid single-answer field.

## 5. Intentional Empty-State Behavior

Before content production, every empty AWS bank must display:

> This AWS Cloud Practitioner question bank is ready for content.

An intentionally empty bank must not appear as a missing file, malformed JSON response, loader failure, or broken campaign state.

## 6. Phase 3 Study Tools

AWS must use independent certification-specific storage for progress, flags, favorites, incorrect answers, weakness evidence, adaptive review, and session history. Review activity remains study-only and must not alter mastery, scoring, statistics, streaks, achievements, or campaign progress.

## 7. Validation Requirements

All inherited Hydra validation requirements remain mandatory:

- JSON parsing and schema validation
- Loader-path and navigation validation
- JavaScript syntax validation
- HTML and internal-reference validation
- Duplicate and substantive-similarity audits
- Desktop, tablet, and mobile browser verification
- Browser-console verification
- Dashboard and Review Hub certification-isolation validation
- Final release snapshot and SHA-256 verification

## 8. Future Revisions

If AWS changes the exam code, task statements, weighting, service scope, scoring model, or exam composition, this addendum must not be silently overwritten. Create a new addendum version, document the blueprint change, and reassess every Objective Sweep, Captain, and Practice Exam distribution.

