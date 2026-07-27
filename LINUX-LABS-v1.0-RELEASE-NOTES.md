# Linux Labs v1.0 Release Notes

**Release date:** July 27, 2026
**Certification:** LPI Linux Essentials
**Exam blueprint:** 010-160, Version 1.6
**Release status:** Production-complete and live

## Release summary

Linux Labs v1.0 delivers a complete skill-first instructional campaign alongside the existing Linux Essentials recognition, review, Captain, and Practice Exam experiences.

| Release component | Total |
|---|---:|
| Graded instructional missions | 25 |
| Official LPI objectives covered | 19 of 19 |
| Production batches | 5 |
| Lesson phases per mission | 7 |
| Progressive challenge hints per mission | 3 |
| Graduation chambers | 1 |

Mission 26 is a non-graded graduation experience. It does not alter the 25-lab completion total or official objective mapping.

## Instructional architecture

Every graded mission preserves the approved sequence:

1. Mission Briefing
2. Learn
3. Walkthrough
4. Guided Practice
5. Commander Challenge
6. Debrief
7. Fenrir's Tip

Each mission includes:

- A named skill
- One Big Idea
- A goal-oriented learning outcome
- Realistic command examples
- Guided Practice with beginner-facing instructions
- A Commander Challenge
- Three hints in Concept, Recognition, and Command order
- State or command-based grading
- Mission debrief and command-recognition takeaway

## Simulator and learning features

- Browser-contained simulated Linux filesystem
- Navigation, file, archive, text-processing, scripting, system, network, account, permission, ownership, sticky-directory, and symbolic-link commands
- State-based grading that permits valid alternative command sequences
- General command reference help that does not directly solve the active challenge
- Separate Guided Practice and Commander Challenge state
- Replay and reset behavior
- Persistent mission progress
- Terminal history and output
- Keyboard-operable controls
- Accessible status announcements and labeled inputs
- Responsive Linux Labs menu, lesson, terminal, and graduation layouts

## Production batches

| Batch | Missions | Release commit |
|---|---|---|
| Proof of concept | 1–2 | `e57924364419411d5fdaf34beb81185fc12c583d` |
| Proof refinement | 1–2 | `ec8953995d9279c32723597c32c20e2abd418210` |
| Batch 1 | 3–7 | `8cd30c4708d18f59b284082804a7599a7769bb4e` |
| Batch 2 | 8–12 | `60966efb0900397a06eccfced6d78b2c066550a4` |
| Batch 3 | 13–16 | `7547e5cc467bcc9ee190a987818e8d51c3804384` |
| Batch 4 | 17–20 | `5c8c17dbd6b14b09eb1b749c0a720eb0f1ea4214` |
| Batch 5 | 21–25 | `596432308bad1cc35100a8195bd4a278a3638cb5` |
| Graduation chamber | 26 | `8192e0fe2f58b30d8a03fb8b8aa1371593b6b414` |
| Graduation polish and live release | 26 | `f8f9d8b31d1a2cc4b8f55918dab0c67ba2ce700e` |

## Final acceptance audit

Linux Labs v1.0 passed:

- Mission-bank JSON parsing and schema validation
- Exactly 25 graded production missions
- Unique mission IDs and sequential mission numbers
- Complete required instructional fields
- Exactly three progressive hints per Commander Challenge
- Correct Concept, Recognition, and Command hint order
- JavaScript syntax validation
- Simulator command regression checks
- Progress, replay, persistence, and reset validation
- Valid-alternative command-sequence acceptance
- Keyboard and accessibility structure checks
- Responsive-layout checks
- Internal link and asset validation
- Final Dungeon and graduation navigation
- Live GitHub Pages verification

No unrelated certification question banks or shared production systems were modified by Linux Labs mission production.

## Graduation experience

After Mission 25, learners may enter Mission 26 and receive:

- `25 / 25 LABS COMPLETE`
- `LINUX LABS GRADUATE`
- Fenrir's campaign-completion speech
- Return to Linux Labs
- Replay a Mission
- Return to Giant Slayer Academy

## Known non-blocking follow-up

- Add automated continuous-integration checks for JavaScript syntax, JSON parsing, internal links, and Linux mission-bank validation.
- Continue platform-wide focus-visible standardization on legacy certification pages.

---

**Linux Labs v1.0: Approved, complete, and live.**
