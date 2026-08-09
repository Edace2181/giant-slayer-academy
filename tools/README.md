# Giant Slayer Academy Practice Exam Validation System

This local developer tool audits Practice Exam JSON banks without changing them. It uses only built-in Node.js modules, reads each expected question count from `practice-exam-timer.js`, and returns a nonzero process exit code when a validation failure is found.

## Run the validator

From the Giant Slayer Academy project root:

```powershell
node tools/validate-practice-exams.js --cert aplus-core1 --exam 1
node tools/validate-practice-exams.js --cert aplus-core1
node tools/validate-practice-exams.js --all
```

If Node.js is not on the Windows `PATH`, use the Node executable provided by the local development environment:

```powershell
& "C:\Users\edace\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" tools/validate-practice-exams.js --all
```

Additional modes:

```powershell
node tools/validate-practice-exams.js --self-test
node tools/validate-practice-exams.js --all --summary
node tools/validate-practice-exams.js --all --strict-warnings
node tools/validate-practice-exams.js --cert cloud-plus
```

Cloud+ Practice Exam files are recognized but are excluded from the default batch while they remain intentional empty placeholders. Explicitly selecting `cloud-plus`, or using `--include-placeholders`, audits those files and reports their incomplete question counts.

## Checks performed

- JSON parsing and array-root validation
- Configured question count
- Required Hydra fields and nonempty values
- Unique IDs and certification-specific ID naming where practical
- Normalized exact duplicate prompts
- Exactly four nonempty, distinct choices
- Valid zero-based answer indices
- Answer-position counts, percentages, unused positions, and longest streak
- Domain and difficulty metadata distributions
- Objective existence and objective-to-domain alignment using the current Objective Sweep banks
- Objective coverage warnings
- Explanation presence and short-explanation warnings
- Deterministic near-duplicate prompt warnings
- Cross-exam exact ID and prompt reuse within each certification

Warnings normally preserve exit code `0`; validation failures return a nonzero exit code. Use `--strict-warnings` when warnings should also fail an automated check.

The `--self-test` mode uses only in-memory fixtures. It proves that severe all-A answer bias, duplicate IDs, duplicate prompts, invalid answer indices, repeated choices, and missing fields are detected without writing to any project file.
