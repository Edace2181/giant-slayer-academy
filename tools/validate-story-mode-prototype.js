#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const prototypeDir = path.join(root, "story-mode", "prototype");
const bankPath = path.join(root, "json", "aplus-core1", "world1", "1.1-hatchling.json");
const enginePath = path.join(prototypeDir, "story-mode-engine.js");
const worldPath = path.join(prototypeDir, "story-mode-world.js");
const appPath = path.join(prototypeDir, "story-mode-exploration-app.js");
const htmlPath = path.join(prototypeDir, "index.html");
const cssPath = path.join(prototypeDir, "story-mode.css");
const expectedHash = "ced5202569fc6be240eddd160ed6dedc54a2684467cb8d3b38789c17a6d40869";
const Engine = require(enginePath);
const World = require(worldPath);

const metadata = Object.freeze({
  version: 1,
  certificationId: "aplus-core1-220-1201",
  objectiveId: "1.1",
  sourceBankId: "json/aplus-core1/world1/1.1-hatchling.json",
  sourceHash: expectedHash
});
const trace = Object.freeze({
  certificationId: metadata.certificationId,
  objectiveId: metadata.objectiveId,
  sourceBankId: metadata.sourceBankId
});
const contract = Object.freeze({ questionCount: 11, domain: "1", objectiveId: "1.1" });

const results = [];
function test(name, fn) {
  try {
    fn();
    results.push({ name, pass: true });
  } catch (error) {
    results.push({ name, pass: false, error });
  }
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function expectContractFailure(fn) {
  assert.throws(fn, (error) => error instanceof Engine.StoryModeContractError);
}

const bankBytes = fs.readFileSync(bankPath);
const canonicalBankText = bankBytes.toString("utf8").replace(/\r\n/g, "\n");
const bankHash = crypto.createHash("sha256").update(canonicalBankText, "utf8").digest("hex");
const rawBank = JSON.parse(bankBytes.toString("utf8"));
const bank = Engine.validateBank(rawBank, contract);
const ids = bank.map((question) => question.id);

test("protected bank fingerprint", () => assert.equal(bankHash, expectedHash));

test("all 11 authoritative questions validate", () => {
  assert.equal(bank.length, 11);
  assert.equal(new Set(ids).size, 11);
  bank.forEach((question) => {
    assert.equal(question.domain, "1");
    assert.equal(question.objective, "1.1");
    assert.ok(question.question);
    assert.ok(question.explanation);
    assert.ok(Number.isInteger(question.answer));
  });
});

test("player-safe payload has no answer or explanation", () => {
  bank.forEach((question) => {
    const safe = Engine.createPlayerSafeQuestion(question, trace);
    assert.equal(Object.hasOwn(safe, "answer"), false);
    assert.equal(Object.hasOwn(safe, "explanation"), false);
    assert.deepEqual(safe.choices, question.choices);
    assert.equal(safe.id, question.id);
    assert.equal(safe.certificationId, metadata.certificationId);
    assert.equal(safe.objectiveId, "1.1");
    assert.equal(safe.sourceBankId, metadata.sourceBankId);
  });
});

test("invalid academic content fails closed", () => {
  const duplicate = JSON.parse(JSON.stringify(rawBank));
  duplicate[1].id = duplicate[0].id;
  expectContractFailure(() => Engine.validateBank(duplicate, contract));

  const missingExplanation = JSON.parse(JSON.stringify(rawBank));
  missingExplanation[0].explanation = "";
  expectContractFailure(() => Engine.validateBank(missingExplanation, contract));

  const badAnswer = JSON.parse(JSON.stringify(rawBank));
  badAnswer[0].answer = 99;
  expectContractFailure(() => Engine.validateBank(badAnswer, contract));

  const wrongObjective = JSON.parse(JSON.stringify(rawBank));
  wrongObjective[0].objective = "1.2";
  expectContractFailure(() => Engine.validateBank(wrongObjective, contract));
});

test("shuffle-bag avoids repeats until all 11 are seen", () => {
  let cycle = Engine.createCycle(ids, metadata, seededRandom(11));
  const first = Engine.planEncounter(cycle, ids, 5, metadata, seededRandom(12));
  assert.equal(new Set(first.questionIds).size, 5);
  cycle = JSON.parse(JSON.stringify(first.checkpoints[4]));

  const second = Engine.planEncounter(cycle, ids, 5, metadata, seededRandom(13));
  assert.equal(new Set(second.questionIds).size, 5);
  assert.equal(first.questionIds.filter((id) => second.questionIds.includes(id)).length, 0);
  const firstTen = new Set([...first.questionIds, ...second.questionIds]);
  assert.equal(firstTen.size, 10);
  cycle = JSON.parse(JSON.stringify(second.checkpoints[4]));

  const unseen = ids.find((id) => !firstTen.has(id));
  const third = Engine.planEncounter(cycle, ids, 5, metadata, seededRandom(14));
  assert.equal(third.questionIds[0], unseen);
  assert.equal(new Set(third.questionIds).size, 5);
  assert.equal(third.checkpoints[0].cycleNumber, 1);
  assert.equal(third.checkpoints[1].cycleNumber, 2);
});

test("interrupted attempt preserves displayed questions only", () => {
  const cycle = Engine.createCycle(ids, metadata, seededRandom(21));
  const plan = Engine.planEncounter(cycle, ids, 5, metadata, seededRandom(22));
  const afterFirstDisplay = Engine.validateCycle(plan.checkpoints[0], ids, metadata);
  assert.deepEqual(afterFirstDisplay.seen, [plan.questionIds[0]]);
  plan.questionIds.slice(1).forEach((id) => assert.equal(afterFirstDisplay.seen.includes(id), false));
});

test("stale continuity state is rejected without changing content", () => {
  const cycle = Engine.createCycle(ids, metadata, seededRandom(31));
  cycle.sourceHash = "stale";
  expectContractFailure(() => Engine.validateCycle(cycle, ids, metadata));
  const unchangedText = fs.readFileSync(bankPath, "utf8").replace(/\r\n/g, "\n");
  assert.equal(crypto.createHash("sha256").update(unchangedText, "utf8").digest("hex"), expectedHash);
});

test("all 32 five-turn outcome patterns are correct", () => {
  for (let mask = 0; mask < 32; mask += 1) {
    const questions = bank.slice(0, 5);
    const attempt = Engine.activateAttempt(Engine.createAttempt(questions.map((question) => question.id)));
    let expectedCorrect = 0;

    for (let turn = 0; turn < 5; turn += 1) {
      const shouldBeCorrect = Boolean(mask & (1 << turn));
      const question = questions[turn];
      const choice = shouldBeCorrect ? question.answer : (question.answer + 1) % question.choices.length;
      const heroBefore = attempt.heroHp;
      const enemyBefore = attempt.enemyHp;
      const feedback = Engine.resolveAnswer(attempt, question, choice, trace);
      if (shouldBeCorrect) expectedCorrect += 1;
      assert.equal(feedback.correct, shouldBeCorrect);
      assert.equal(feedback.explanation, question.explanation);
      assert.equal(attempt.heroHp, heroBefore - (shouldBeCorrect ? 0 : 1));
      assert.equal(attempt.enemyHp, enemyBefore - (shouldBeCorrect ? 1 : 0));
      assert.equal(attempt.state, Engine.STATES.FEEDBACK_REQUIRED);

      const snapshot = { heroHp: attempt.heroHp, enemyHp: attempt.enemyHp, answers: attempt.answers.length };
      assert.throws(() => Engine.resolveAnswer(attempt, question, choice, trace), Engine.StoryModeStateError);
      assert.deepEqual(
        { heroHp: attempt.heroHp, enemyHp: attempt.enemyHp, answers: attempt.answers.length },
        snapshot
      );

      const nextState = Engine.advanceAfterFeedback(attempt);
      if (turn < 4) assert.equal(nextState, Engine.STATES.QUESTION_ACTIVE);
      else assert.equal(nextState, expectedCorrect >= 3 ? Engine.STATES.VICTORY : Engine.STATES.DEFEAT);
    }

    assert.equal(attempt.correctCount, expectedCorrect);
    assert.equal(attempt.heroHp, expectedCorrect);
    assert.equal(attempt.enemyHp, 5 - expectedCorrect);
    assert.equal(attempt.answers.length, 5);
  }
});

test("invalid state transitions are rejected", () => {
  const attempt = Engine.createAttempt(ids.slice(0, 5));
  assert.throws(() => Engine.advanceAfterFeedback(attempt), Engine.StoryModeStateError);
  assert.throws(() => Engine.resolveAnswer(attempt, bank[0], bank[0].answer, trace), Engine.StoryModeStateError);
});

test("Forge world uses smooth continuous movement over a 10 by 7 collision map", () => {
  assert.equal(World.MAP.columns, 10);
  assert.equal(World.MAP.rows, 7);
  let world = World.createState();
  assert.equal(world.movementLocked, true);
  world = World.setMovementLocked(world, false);
  const before = world.player.x;
  const movement = World.movePlayer(world, "right", 0.016);
  assert.equal(movement.moved, true);
  assert.ok(movement.state.player.x > before);
  assert.notEqual(movement.state.player.x % World.MAP.tileSize, 0);
  assert.ok(movement.state.player.x - before < World.MAP.tileSize);
});

test("Forge collision blocks props, NPCs, enemy bodies, and world boundaries", () => {
  let world = World.setMovementLocked(World.createState(), false);
  assert.equal(World.positionIsBlocked(world, -100, 100), true);
  assert.equal(World.positionIsBlocked(world, 100, 100), true);
  assert.equal(World.positionIsBlocked(world, 175, 350), true);
  assert.equal(World.positionIsBlocked(world, 770, 315), true);
  assert.equal(World.positionIsBlocked(world, 300, 300), false);
});

test("physical Gremlin boundary triggers once and locks movement", () => {
  let world = World.setMovementLocked(World.createState(), false);
  world = World.placePlayer(world, 681, 320, "right");
  let triggered = false;
  for (let step = 0; step < 20 && !triggered; step += 1) {
    const movement = World.movePlayer(world, "right", 0.05);
    world = movement.state;
    triggered = movement.encounterTriggered;
  }
  assert.equal(triggered, true);
  assert.equal(world.encounterLatched, true);
  assert.equal(world.movementLocked, true);
  assert.equal(World.movePlayer(world, "right", 0.05).moved, false);
});

test("battle return and repeat-training world states follow the locked contract", () => {
  const original = World.createState();
  const victory = World.returnToMaestro(original, "VICTORY");
  assert.equal(victory.gremlinState, "defeated");
  assert.equal(victory.encounterEnabled, false);
  assert.deepEqual(victory.player, World.MAESTRO_RETURN);
  assert.equal(World.canTalkToMaestro(victory), true);
  const prepared = World.prepareTrainingEncounter(World.finishSafeReturn(victory));
  assert.equal(prepared.gremlinState, "active");
  assert.equal(prepared.encounterEnabled, true);
  const defeat = World.returnToMaestro(original, "DEFEAT");
  assert.equal(defeat.gremlinState, "active");
  assert.equal(defeat.encounterEnabled, true);
});

test("presentation includes required learner states and controls", () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const app = fs.readFileSync(appPath, "utf8");
  const presentationSource = `${html}\n${app}`;
  [
    "Enter Story Mode",
    "Begin Exploring",
    "Talk to Maestro",
    "Prepare Another Training Encounter",
    "Submit Answer",
    "Continue Battle",
    "View Battle Result",
    "Defeat — Training Continues",
    "Retry Encounter",
    "Return to the Maestro",
    "Training Content Unavailable",
    "Recheck Training Content",
    "End Prototype"
  ].forEach((text) => assert.ok(presentationSource.includes(text), `Missing presentation text: ${text}`));
  assert.ok(html.includes("../../assets/finale/references/maestro-aplus-core1.png"));
  assert.ok(html.includes("story-mode-world.js"));
  assert.ok(html.includes("story-mode-exploration-app.js"));
  assert.equal(/href=["'][^"']*(?:index\.html|campaign|objective)/i.test(html), false);
});

test("application persists only isolated Story Mode continuity", () => {
  const app = fs.readFileSync(appPath, "utf8");
  assert.ok(app.includes("gsa.storyMode.prototype.v1.aplus-core1.1.1.questionCycle"));
  assert.equal(app.includes("sessionStorage"), false);
  assert.equal(/localStorage\.(?:setItem|getItem|removeItem)\((?!CONFIG\.storageKey)/.test(app), false);
  ["mastery", "readiness", "practiceExam", "finalBoss", "pbq", "linuxLab"].forEach((term) => {
    assert.equal(app.includes(term), false, `Unexpected GSA evidence term: ${term}`);
  });
});

test("responsive and reduced-motion contracts exist", () => {
  const css = fs.readFileSync(cssPath, "utf8");
  assert.ok(css.includes("@media (max-width: 430px)"));
  assert.ok(css.includes("@media (prefers-reduced-motion: reduce)"));
  assert.ok(css.includes("overflow: hidden"));
  assert.ok(css.includes("touch-action: none"));
  assert.ok(css.includes("aspect-ratio: 10 / 7"));
});

test("prototype is silent and contains no media player", () => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const app = fs.readFileSync(appPath, "utf8");
  assert.equal(/<audio|new Audio\(|\.play\(/i.test(`${html}\n${app}`), false);
});

const failed = results.filter((result) => !result.pass);
results.forEach((result) => {
  if (result.pass) console.log(`PASS  ${result.name}`);
  else console.error(`FAIL  ${result.name}\n      ${result.error.stack || result.error.message}`);
});
console.log(`\nStory Mode prototype validation: ${results.length - failed.length}/${results.length} PASS`);
if (failed.length) process.exitCode = 1;
