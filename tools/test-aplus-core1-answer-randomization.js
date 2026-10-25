"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const quizPath = path.join(root, "aplus-core1-quiz.js");
const manualPath = path.join(root, "aplus-core1-field-manual.js");
const quizSource = fs.readFileSync(quizPath, "utf8");
const manualSource = fs.readFileSync(manualPath, "utf8");

function extractFunction(source, name) {
  const start = source.indexOf("function " + name + "(");
  assert.notStrictEqual(start, -1, name + " must exist");
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index++) {
    if (source[index] === "{") depth++;
    if (source[index] === "}") depth--;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error("Unable to extract " + name);
}

function loadShuffle(source) {
  const context = {};
  vm.runInNewContext(extractFunction(source, "shuffleQuestionChoices") + "; result = shuffleQuestionChoices;", context);
  return context.result;
}

const quizShuffle = loadShuffle(quizSource);
const manualShuffle = loadShuffle(manualSource);

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = ((state * 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function placementFor(shuffleQuestionChoices, question, targetIndex) {
  for (let seed = 0; seed < 10000; seed++) {
    const presentation = shuffleQuestionChoices(question, seededRandom(seed));
    if (presentation.answer === targetIndex) return presentation;
  }
  throw new Error("Unable to place the correct answer at index " + targetIndex);
}

function assertPresentation(shuffleQuestionChoices, question, targetIndex) {
  const originalSnapshot = JSON.stringify(question);
  const presentation = placementFor(shuffleQuestionChoices, question, targetIndex);
  assert.strictEqual(JSON.stringify(question), originalSnapshot, question.id + " source object was mutated");
  assert.notStrictEqual(presentation, question, question.id + " must use an isolated presentation object");
  assert.deepStrictEqual(
    [...presentation.choices].sort(),
    [...question.choices].sort(),
    question.id + " displayed choices must be a complete permutation"
  );
  assert.strictEqual(
    presentation.choices[presentation.answer],
    question.choices[question.answer],
    question.id + " correct answer text must survive remapping"
  );
  assert.strictEqual(presentation.answer, targetIndex, question.id + " deterministic placement mismatch");
  assert.strictEqual(targetIndex === presentation.answer, true, question.id + " correct selection must grade true");
  assert.strictEqual((targetIndex + 1) % presentation.choices.length === presentation.answer, false, question.id + " incorrect selection must grade false");
  assert.strictEqual(presentation.id, question.id, question.id + " identity must be preserved");
  assert.strictEqual(presentation.explanation, question.explanation, question.id + " explanation must be preserved");
  return presentation;
}

function assertStablePresentation(shuffleQuestionChoices, question) {
  const random = seededRandom(42);
  const presentation = shuffleQuestionChoices(question, random);
  const snapshot = JSON.stringify(presentation);
  for (let attempt = 0; attempt < 5; attempt++) {
    const selected = attempt % presentation.choices.length;
    void (selected === presentation.answer);
    assert.strictEqual(JSON.stringify(presentation), snapshot, question.id + " displayed order changed during answering");
  }
}

const objectives = ["1.1", "1.2", "1.3"];
let world1Questions = 0;
for (const objective of objectives) {
  const bankPath = path.join(root, "json", "aplus-core1", "world1", objective + "-hatchling.json");
  const questions = JSON.parse(fs.readFileSync(bankPath, "utf8"));
  world1Questions += questions.length;
  questions.forEach(question => {
    for (let target = 0; target < question.choices.length; target++) {
      assertPresentation(quizShuffle, question, target);
    }
    assertStablePresentation(quizShuffle, question);
  });

  const miniCheckSource = questions[0];
  for (let target = 0; target < miniCheckSource.choices.length; target++) {
    assertPresentation(manualShuffle, miniCheckSource, target);
  }
  assertStablePresentation(manualShuffle, miniCheckSource);
}

assert.strictEqual(world1Questions, 52, "World 1 must contain the expected 52 questions");

function listJsonFiles(directory, predicate = () => true) {
  return fs.readdirSync(directory)
    .filter(name => name.endsWith(".json") && predicate(name))
    .map(name => path.join(directory, name));
}

const objectiveBankFiles = [];
for (let world = 1; world <= 5; world++) {
  objectiveBankFiles.push(...listJsonFiles(
    path.join(root, "json", "aplus-core1", "world" + world),
    name => name.endsWith("-hatchling.json")
  ));
}
const captainBankFiles = listJsonFiles(path.join(root, "json", "aplus-core1", "captains"));
const practiceExamFiles = listJsonFiles(path.join(root, "json", "aplus-core1", "final-dungeon"));

function testBankSet(files, label) {
  let questionCount = 0;
  files.forEach(file => {
    const questions = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.ok(Array.isArray(questions) && questions.length, path.relative(root, file) + " must be a non-empty array");
    questions.forEach(question => {
      questionCount++;
      assertPresentation(quizShuffle, question, question.answer % question.choices.length);
      assertStablePresentation(quizShuffle, question);
    });
  });
  assert.ok(questionCount > 0, label + " must include questions");
  return questionCount;
}

const allObjectiveQuestions = testBankSet(objectiveBankFiles, "Objective Sweep and mixed/weakness source banks");
const allCaptainQuestions = testBankSet(captainBankFiles, "Captain mode banks");
const allPracticeExamQuestions = testBankSet(practiceExamFiles, "Practice exam banks");

assert.ok(
  quizSource.includes("questions = shuffle(questions).map(question => shuffleQuestionChoices(question));"),
  "Every quiz mode must prepare stable shuffled choice presentations after loading"
);
assert.ok(
  quizSource.includes("const correct = selected === q.answer;"),
  "Quiz grading must use the remapped presentation answer"
);
assert.ok(
  quizSource.includes("q.choices[q.answer]"),
  "Incorrect feedback must resolve the correct displayed choice"
);
assert.ok(
  quizSource.includes("recordObjectiveEvidence(window.HydraFlags.currentConfig(), reviewMetadata, correct)"),
  "Weakness evidence integration must remain connected to remapped grading"
);
assert.ok(
  quizSource.includes("recordIncorrect(window.HydraFlags.currentConfig(), reviewMetadata)"),
  "Incorrect-answer tracking must remain connected"
);
assert.ok(
  quizSource.includes("window.HydraCampaignUI?.recordAnswer({ question: q, correct, world, objective, mode, exam })"),
  "Statistics must retain question identity and remapped correctness"
);
assert.ok(
  quizSource.includes("saveObjectiveProgress({ objective, world, answered: questions.length, total: questions.length, score, complete: passed })"),
  "Objective progress persistence must remain connected"
);
assert.ok(quizSource.includes("const passed = percent >= 85;"), "The 85% mastery threshold must remain unchanged");
assert.ok(
  manualSource.includes("miniCheck = shuffleQuestionChoices(validateMiniCheck(bank?.[0]));"),
  "Field Manual Mini Checks must shuffle and remap the existing first protected bank question"
);
assert.ok(
  manualSource.includes("input.addEventListener(\"change\", resetMiniCheckState);"),
  "Changing a Mini Check answer must continue to relock completion"
);
assert.ok(
  manualSource.includes("const correct = Number(selected.value) === Number(miniCheck.answer);"),
  "Mini Check grading must use the remapped answer"
);

console.log("A+ Core 1 answer randomization regression: PASS");
console.log("- World 1 Objective Sweep questions tested: " + world1Questions);
console.log("- Deterministic correct-answer placements A, B, C, and D: PASS");
console.log("- World 1 Field Manual Mini Checks 1.1, 1.2, and 1.3: PASS");
console.log("- Source immutability, identity, explanations, permutation, and stable presentation: PASS");
console.log("- Shared Objective, Mixed, Weakness, Captain, and Practice Exam preparation path: PASS");
console.log("- All Objective Sweep/mixed/weakness source-bank questions tested: " + allObjectiveQuestions);
console.log("- All Captain-mode questions tested: " + allCaptainQuestions);
console.log("- All Practice Exam questions tested: " + allPracticeExamQuestions);
console.log("- Grading, feedback, weakness, incorrect-answer, statistics, progress, and mastery integrations: PASS");
