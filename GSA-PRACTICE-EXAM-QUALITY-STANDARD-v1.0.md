# GSA Practice Exam Quality Standard v1.0

## Purpose

Create a permanent quality standard for all Giant Slayer Academy certification Practice Exams.

This standard applies to existing Practice Exams being audited or corrected and to all future Practice Exams created for GSA.

The goal is not merely to create valid JSON or technically correct questions. Every Practice Exam must provide a realistic, varied, certification-aligned assessment experience that measures understanding, application, troubleshooting, and professional judgment.

The lessons learned during the A+ Core 1 beta audit are now mandatory requirements.

---

## 1. Certification Blueprint Integrity

Every Practice Exam must follow the approved certification blueprint.

Before authoring or modifying questions:

- Identify the authoritative certification objectives.
- Identify the approved domain weighting.
- Identify the required exam question count.
- Determine the appropriate question allocation by domain.
- Preserve approved GSA blueprint metadata when correcting an existing exam.

Normal integer rounding caused by translating official percentages into a fixed question count is acceptable when documented.

Blueprint validation must occur before content is approved.

---

## 2. Semantic Objective Alignment

Metadata alone does NOT prove blueprint compliance.

Every question must actually test the objective assigned to it.

Validation must examine:

- Scenario content
- Required knowledge
- Evidence presented
- Decision required
- Correct answer
- Explanation

A question labeled Objective 2.7 that semantically tests Objective 2.8 is a blueprint-integrity failure even if the numerical objective distribution appears correct.

Mechanical objective counting is insufficient.

Content-to-objective semantic alignment is mandatory.

---

## 3. Objective Coverage

Practice Exams should provide appropriate coverage of the certification objectives represented by the approved GSA blueprint.

Do not artificially force identical objective counts across every Practice Exam when the official blueprint does not require it.

However:

- Material objective gaps must be identified.
- Accidental omissions must be corrected.
- Excessive concentration on a small subset of objectives must be avoided.
- Objective coverage must be validated semantically, not merely by metadata.

---

## 4. Question Quality

Every Practice Exam question must provide a legitimate assessment experience.

Questions should test one or more of:

- Knowledge interpretation
- Application
- Troubleshooting
- Diagnosis
- Prioritization
- Best action
- Next action
- Technical judgment
- Constraint-based decision making

Questions must not merely expose the answer through obvious terminology in the prompt.

Scenario-based questions should contain evidence the learner must interpret.

---

## 5. Difficulty Integrity

Difficulty metadata must reflect actual cognitive demand.

### Level 2

Recognition, understanding, and basic interpretation.

### Level 3

Application, troubleshooting, configuration decisions, and selecting the best action from plausible alternatives.

### Level 4

Multi-clue diagnosis, prioritization, competing constraints, multi-step reasoning, or professional judgment.

A Level 4 label does not make a recognition question Level 4.

Difficulty must be validated from the actual reasoning required.

---

## 6. Distractor Quality

Every question must contain exactly four distinct answer choices unless the certification or GSA system explicitly requires otherwise.

Distractors must be:

- Technically plausible
- Relevant to the scenario
- Within the same general decision space
- Capable of attracting a learner with an identifiable misconception

Avoid:

- Obviously absurd choices
- Unrelated technologies
- Random filler
- Grammatically incompatible answers
- Choices that can be eliminated without understanding the objective

There must be one clearly best answer.

---

## 7. Answer-Position Integrity

Correct-answer positions must not create exploitable patterns.

Across an exam:

- A/B/C/D should be approximately balanced.
- Exact equality is not required.
- Technical correctness determines the answer, not a predetermined letter quota.
- Long repeated-answer streaks should be avoided.
- Mechanical sequences such as ABCDABCD are prohibited.
- Alternating patterns such as B/D/B/D are prohibited.
- All-A or heavily biased distributions are prohibited.

Answer placement should appear unpredictable to the learner.

---

## 8. Question Uniqueness

Exact textual uniqueness is not enough.

Practice Exams must avoid repeated learning experiences.

Two questions are semantic duplicates when the learner is effectively required to:

- Interpret the same evidence
- Reach the same diagnosis
- Make the same decision
- Follow the same troubleshooting path

Changing only:

- Company names
- Employee names
- Device counts
- Locations
- Numbers
- Timing
- Introductory wording

does NOT create a new learning experience.

Repeated certification concepts are allowed when the reasoning path is meaningfully different.

---

## 9. Cross-Exam Semantic Uniqueness

Every Practice Exam must be evaluated against the other Practice Exams for that certification.

The same objective may appear across multiple exams.

The same learning experience should not.

Examples of acceptable repetition:

- Different DHCP failures requiring relay, scope, reservation, VLAN, firewall, or lease reasoning.
- Different RAID requirements leading to different RAID decisions.
- Different printer problems requiring networking, maintenance, component diagnosis, security, or configuration reasoning.
- Different virtualization problems involving snapshots, networking, resource allocation, recovery, or hypervisor selection.

The goal is:

"Same certification objectives, different assessment experiences."

---

## 10. Explanation Quality

Every question must include an explanation that is specific to that question.

The explanation should state:

- Why the correct answer is correct.
- Which scenario evidence supports it.
- Why the most plausible alternatives are less appropriate when useful.

Avoid:

- Boilerplate explanations
- Generic textbook definitions unrelated to the scenario
- Explanations referring to clues not present in the prompt
- Recycled explanations across multiple questions

The explanation must agree with the prompt and correct answer.

---

## 11. Technical Correctness

Questions must remain within the certification's intended scope.

Before approval, verify:

- Technology terminology
- Hardware behavior
- Networking behavior
- Protocols and ports
- Troubleshooting procedures
- Cloud concepts
- Security concepts
- Certification-specific terminology
- Single-best-answer validity

Do not introduce advanced technology outside the intended certification scope merely to increase difficulty.

---

## 12. Wording Quality

Questions must use professional, natural language.

Check for:

- Incorrect capitalization
- Broken grammar
- Awkward generated phrasing
- Answers that do not grammatically complete the question
- Ambiguous BEST/FIRST/NEXT wording
- Missing scenario information
- Contradictory clues

BEST, FIRST, NEXT, MOST likely, and MOST appropriate should be used only when meaningful judgment is actually required.

---

## 13. Originality Validation

Every new or substantially rewritten Practice Exam question must be compared against existing active GSA question banks.

Check for:

- Duplicate IDs
- Exact duplicate prompts
- Normalized duplicate prompts
- Duplicate choice arrays
- Duplicate explanations
- High-similarity prompts
- Semantic duplicate reasoning paths

A similarity threshold may identify candidates for human/semantic review, but a numerical threshold alone does not determine whether two questions are duplicates.

Semantic review has final authority.

---

## 14. Practice Exam Validation System

The GSA Practice Exam Validator must be run before an exam is approved.

At minimum validate:

- JSON parsing
- Required fields
- Question count
- Unique IDs
- ID formatting
- Four distinct choices
- Valid zero-based answer indices
- Answer-position distribution
- Longest answer streak
- Domain distribution
- Difficulty distribution
- Objective coverage
- Domain/objective alignment
- Explanation presence
- Exact duplicates
- Near-duplicate candidates
- Cross-exam duplication

Mechanical validation must be supplemented by semantic review for objective alignment, difficulty, and learning-experience uniqueness.

---

## 15. Runtime Validation

Static validation is not sufficient.

Before production approval, Practice Exams must be tested through the actual GSA interface.

Verify:

- Correct exam loads
- Correct question count
- Correct timer
- Four choices render
- Submit Answer works
- Each question can affect scoring only once
- Next Question advances correctly
- Timer expiration behaves correctly
- Exam-mode feedback behaves as designed
- Final score cannot exceed question count
- Percentage cannot exceed 100%
- Results save only once
- Correct return destination
- Browser console contains no relevant errors

---

## 16. Score Integrity

Every quiz engine must internally protect against duplicate grading.

Do not rely solely on CSS visibility or disabled-looking controls.

Each displayed question must:

- Affect the score only once.
- Record an answer only once.
- Advance only once.
- Remain protected from rapid clicks.
- Remain protected from programmatic clicks.
- Remain protected from timer/manual-submit collisions.

Final scores must be defensively clamped to the loaded question count.

Percentages must be defensively clamped to 0–100%.

Finalization and result saving must occur only once.

---

## 17. Correction Scope

When auditing an existing Practice Exam:

Do not automatically rewrite the entire bank.

First perform a read-only audit.

Classify findings as:

- Structural defect
- Technical defect
- Blueprint defect
- Semantic objective mismatch
- Difficulty defect
- Distractor defect
- Duplicate learning experience
- Explanation defect
- Wording defect
- Runtime defect

Then make the smallest correction that fully resolves the confirmed defect.

Preserve strong existing questions whenever possible.

---

## 18. Protected Metadata

When an existing exam has an approved structure, protected fields must not be changed casually.

Protected fields may include:

- Question IDs
- Question order
- Certification
- Domain
- Objective
- Blueprint
- Difficulty
- Question count
- Domain weighting

However, if an audit proves that objective or blueprint metadata is semantically incorrect, correcting that metadata is permitted only as part of an explicitly approved blueprint-integrity repair.

Such changes must be documented.

---

## 19. Change Isolation

Practice Exam corrections must not silently modify unrelated project systems.

Do not modify unless explicitly required:

- Other certifications
- Objective Sweep banks
- Captain banks
- Story Mode
- Campaign UI
- Dashboard
- Feedback portal
- Documentation
- Shared runtime files
- Timer configuration
- Question banks outside approved scope

Temporary audit/build helpers must be removed after use unless intentionally approved as permanent tooling.

---

## 20. Git Safety

Before committing:

- Inspect the working tree.
- Identify unrelated local work.
- Stage explicit files only.
- Inspect the staged diff.
- Verify the staged index contains only approved changes.

Never use a bulk add when the working tree contains unrelated unfinished work.

Practice Exam fixes should receive dedicated checkpoint commits when practical.

Never force push unless explicitly authorized.

---

## 21. Approval Gates

Large corrections must use approval gates.

Recommended workflow:

READ-ONLY AUDIT
        ↓
DEFECT REPORT
        ↓
USER APPROVAL
        ↓
TARGETED CORRECTION
        ↓
VALIDATION
        ↓
FINAL REPORT
        ↓
USER APPROVAL
        ↓
COMMIT / PUSH

Do not begin large-scale rewriting merely because an audit found a problem.

Report the scope first.

---

## 22. Final Acceptance Criteria

A GSA Practice Exam is production-ready only when:

- Blueprint weighting is correct.
- Question content semantically matches assigned objectives.
- Required objective coverage is satisfied.
- Difficulty metadata matches actual reasoning demand.
- Questions contain plausible distractors.
- Answer positions are balanced and non-mechanical.
- No avoidable semantic duplicate learning experiences remain.
- Explanations are specific and technically correct.
- Technical content is within certification scope.
- Originality checks pass.
- Validator passes.
- Runtime validation passes.
- Scoring integrity passes.
- No unrelated project files were modified.
- Any remaining warnings are explicitly documented and approved.

Passing JSON validation alone is never sufficient.

---

## 23. Core Principle

GSA Practice Exams are not question dumps.

They are assessment environments designed to determine whether a learner can recognize, apply, troubleshoot, diagnose, prioritize, and make sound technical decisions using the knowledge required by the certification.

The standard is not:

"Are these 90 different sentences?"

The standard is:

"Do these 90 questions provide 90 legitimate, technically correct, blueprint-aligned assessment experiences?"

Across multiple Practice Exams, the standard becomes:

"Do these exams test the same certification blueprint through genuinely different reasoning experiences without becoming predictable, repetitive, or misaligned?"

That is the GSA Practice Exam Quality Standard.