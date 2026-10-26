"use strict";

// Run with: node tools/test-aws-cloud-practitioner-answer-randomization.js
// Uses the real quiz, progress, and review code with an isolated DOM/storage harness.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "aws-cloud-practitioner-quiz.js"), "utf8");
const progressSource = fs.readFileSync(path.join(root, "campaign-ui.js"), "utf8");
const flagsSource = fs.readFileSync(path.join(root, "flagged-questions.js"), "utf8");
const progressKey = "hydra-aws-cloud-practitioner-progress-v1";
const bankCache = new Map();
const plain = value => JSON.parse(JSON.stringify(value));

function freeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function bank(file) {
  if (!bankCache.has(file)) {
    bankCache.set(file, freeze(JSON.parse(fs.readFileSync(path.join(root, file), "utf8"))));
  }
  return bankCache.get(file);
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function element() {
  const classes = new Set();
  const listeners = {};
  return {
    children: [], textContent: "", innerHTML: "",
    classList: {
      add: name => classes.add(name), remove: name => classes.delete(name),
      contains: name => classes.has(name)
    },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = children; },
    addEventListener(type, listener) { (listeners[type] ||= []).push(listener); },
    fire(type) { (listeners[type] || []).forEach(listener => listener()); },
    click() { this.fire("click"); },
    insertAdjacentHTML(_, html) { this.innerHTML += html; }
  };
}

async function quiz(search, options = {}) {
  const elements = new Map();
  const storage = options.storage || new Map();
  const math = Object.create(Math);
  math.random = seededRandom(options.seed ?? 42);
  const window = {
    location: { search, pathname: "/aws-cloud-practitioner-quiz.html" },
    addEventListener() {}, dispatchEvent() {},
    HydraExamTimer: { prepare: () => false, finish: () => null }
  };
  const context = vm.createContext({
    window, URLSearchParams, Math: math,
    CustomEvent: class { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value)
    },
    document: {
      body: { dataset: { progressKey } },
      getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); },
      createElement: element, createTextNode: text => ({ textContent: text }),
      querySelector: () => null, querySelectorAll: () => [], addEventListener() {}
    },
    fetch: async file => ({ ok: true, json: async () => options.bank ? options.bank(file) : bank(file) })
  });
  vm.runInContext(progressSource, context);
  vm.runInContext(flagsSource, context);
  // Keep the production entry point; await its existing async load before asserting.
  vm.runInContext(source.replace(/loadQuiz\(\);\s*$/, "globalThis.ready = loadQuiz();"), context);
  await context.ready;
  const evaluate = script => vm.runInContext(script, context);
  assert.notEqual(elements.get("question").textContent, "Unable to load quiz.", elements.get("feedback").textContent);
  return {
    context, evaluate, storage, elements, window,
    questions: evaluate("questions"),
    read: (key = progressKey) => JSON.parse(storage.get(key) || "{}"),
    answer(index) { elements.get("answers").children[index].children[0].fire("change"); elements.get("submitBtn").click(); },
    next() { elements.get("nextBtn").click(); }
  };
}

async function main() {
  const initial = await quiz("?world=1&objective=1.1");
  const files = [...initial.evaluate("objectiveFiles")];
  const diskFiles = [];
  for (let world = 1; world <= 5; world++) {
    const directory = `json/aws-cloud-practitioner/world${world}`;
    diskFiles.push(...fs.readdirSync(path.join(root, directory))
      .filter(file => file.endsWith("-hatchling.json")).map(file => `${directory}/${file}`));
  }
  assert.deepEqual([...files].sort(), diskFiles.sort(), "Mixed pool must include every Objective Sweep bank");
  assert.equal(files.length, 19);
  const all = files.flatMap(bank);
  assert.equal(all.length, 261);
  assert.equal(new Set(all.map(question => question.id)).size, 261);

  let permutationsTested = 0;
  for (const question of all) {
    assert.equal(question.choices.length, 4, question.id);
    assert.equal(new Set(question.choices).size, 4, question.id);
    assert.ok(question.choices.every(choice => typeof choice === "string" && choice.trim()), question.id);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, question.id);
    assert.ok(question.explanation?.trim(), question.id);
    const snapshot = JSON.stringify(question);
    const orders = new Set();
    const placements = [0, 0, 0, 0];
    // Exhaust every Fisher-Yates draw combination, including unchanged order.
    for (let j3 = 0; j3 < 4; j3++) for (let j2 = 0; j2 < 3; j2++) for (let j1 = 0; j1 < 2; j1++) {
      const draws = [(j3 + 0.5) / 4, (j2 + 0.5) / 3, (j1 + 0.5) / 2];
      initial.context.fixture = question;
      initial.context.draw = () => draws.shift();
      const presentation = initial.evaluate("shuffleQuestionChoices(fixture, draw)");
      assert.equal(draws.length, 0);
      assert.notEqual(presentation, question);
      assert.notEqual(presentation.choices, question.choices);
      assert.deepEqual([...presentation.choices].sort(), [...question.choices].sort());
      assert.equal(presentation.choices[presentation.answer], question.choices[question.answer]);
      const expected = { ...question, choices: [...presentation.choices], answer: presentation.answer };
      assert.deepEqual(plain(presentation), expected, "All identity, explanation, and metadata fields must survive");
      orders.add(JSON.stringify(presentation.choices));
      placements[presentation.answer]++;
      permutationsTested++;
    }
    assert.equal(orders.size, 24, question.id + " must permit all permutations");
    assert.deepEqual(placements, [6, 6, 6, 6], "Every correct position must be equally reachable");
    assert.equal(JSON.stringify(question), snapshot);
  }
  // Numeric string indexes and repeated answer text must still track original identity.
  initial.context.fixture = freeze({ id: "fixture", choices: ["same", "other", "same", "last"], answer: "2" });
  initial.context.draw = () => 0;
  assert.equal(initial.evaluate("shuffleQuestionChoices(fixture, draw).answer"), 1);

  let graded = 0;
  for (const file of files) {
    const [, world, objective] = file.match(/world(\d)\/([\d.]+)-hatchling/);
    // Exercise every rendered answer position through real change/submit handlers.
    for (let selected = 0; selected < 4; selected++) {
      const session = await quiz(`?world=${world}&objective=${objective}`, { seed: 100 + selected });
      let correctCount = 0;
      const incorrectIds = [];
      session.elements.get("submitBtn").click();
      assert.equal(session.elements.get("feedback").textContent, "Select an answer first.");
      assert.equal(session.read().stats, undefined);
      session.next();
      assert.equal(session.evaluate("current"), 0);
      const first = session.questions[0];
      const config = session.window.HydraFlags.currentConfig();
      const flag = { questionId: first.id, world, objective, bankPath: file };
      session.window.HydraFlags.add(config, flag);
      assert.equal(session.window.HydraFlags.isFlagged(config, flag), true);
      session.window.HydraFlags.add(config, flag, "favorites");
      for (const question of session.questions) {
        const original = bank(file).find(item => item.id === question.id);
        assert.notEqual(question, original, "Loader must create isolated presentations");
        assert.equal(question.choices[question.answer], original.choices[original.answer]);
        const snapshot = JSON.stringify(question);
        const labels = session.elements.get("answers").children;
        assert.deepEqual(labels.map(label => label.children[1].textContent), [...question.choices].map(text => ` ${text}`));
        const correct = selected === question.answer;
        if (correct) correctCount++;
        else incorrectIds.push(question.id);
        session.answer(selected);
        const expected = correct ? `Correct. ${question.explanation}`
          : `Incorrect. Correct answer: ${original.choices[original.answer]}. ${question.explanation}`;
        assert.equal(session.elements.get("feedback").textContent, expected);
        assert.equal(session.elements.get("score").textContent, String(correctCount));
        // Changes and duplicate submissions after grading must neither reshuffle nor rescore.
        labels[(selected + 1) % 4].children[0].fire("change");
        session.elements.get("submitBtn").click();
        assert.equal(JSON.stringify(question), snapshot);
        assert.equal(session.elements.get("feedback").textContent, expected);
        graded++;
        session.next();
      }
      const state = session.read();
      assert.equal(state.stats.answered, session.questions.length);
      assert.equal(state.stats.correct, correctCount);
      assert.equal(state.objectives[objective].bestScore, correctCount);
      assert.equal(state.objectives[objective].answered, session.questions.length);
      const passed = Math.round(correctCount / session.questions.length * 100) >= 85;
      assert.equal(state.objectives[objective].complete, passed);
      assert.equal(state.sessions.length, 1);
      assert.equal(state.sessions[0].correct, correctCount);
      assert.equal(state.sessions[0].passed, passed);
      const weakness = session.read(config.weaknessKey).objectives[objective];
      assert.equal(weakness.attempts, session.questions.length);
      assert.equal(weakness.correct, correctCount);
      assert.equal(weakness.misses, incorrectIds.length);
      const missed = session.window.HydraFlags.readIncorrectState(config).active;
      assert.deepEqual([...missed].map(record => record.questionId).sort(), incorrectIds.sort());
      assert.ok(missed.every(record => record.bankPath === file && record.objective === objective));
      assert.equal(session.window.HydraFlags.isFlagged(config, flag), true);
      const reloaded = await quiz(`?world=${world}&objective=${objective}`, { storage: session.storage });
      assert.deepEqual(reloaded.read(), state, "Loading another run must preserve saved progress");
      assert.equal(reloaded.window.HydraFlags.isFlagged(config, flag), true);
      assert.equal(reloaded.window.HydraFlags.contains(config, flag, "favorites"), true);
      session.window.HydraFlags.remove(config, flag);
      assert.equal(session.window.HydraFlags.isFlagged(config, flag), false);
    }
  }

  // Verify the existing mastery boundary and best-score/mastery persistence.
  const twenty = freeze(Array.from({ length: 20 }, (_, index) => ({ ...all[0], id: `threshold-${index}` })));
  const storage = new Map();
  for (const target of [16, 17, 0]) {
    const session = await quiz("?world=1&objective=1.1", { storage, bank: () => twenty });
    session.questions.forEach((question, index) => {
      session.answer(index < target ? question.answer : (question.answer + 1) % 4);
      session.next();
    });
    const state = session.read();
    assert.equal(state.sessions[0].passed, target >= 17);
    assert.equal(state.objectives["1.1"].complete, target !== 16);
    assert.equal(state.objectives["1.1"].bestScore, target === 16 ? 16 : 17);
  }

  for (const [mode, count] of [["mixed-25", 25], ["mixed-50", 50], ["weakness-mix", 25], ["random-gauntlet", 50]]) {
    for (const withWeakness of mode === "weakness-mix" ? [false, true] : [false]) {
      const storage = new Map();
      if (withWeakness) storage.set("hydra-aws-cloud-practitioner-weakness-v1", JSON.stringify({ version: 1, objectives: { "1.1": { attempts: 10, correct: 0, misses: 10 } } }));
      const session = await quiz(`?world=6&mode=${mode}`, { storage });
      assert.equal(session.questions.length, count);
      assert.equal(new Set(session.questions.map(question => question.id)).size, count);
      if (withWeakness) assert.ok(session.questions.filter(question => question.objective === "1.1").length > 0);
      session.questions.forEach(question => {
        const original = all.find(item => item.id === question.id);
        assert.notEqual(question, original);
        assert.equal(question.choices[question.answer], original.choices[original.answer]);
        const snapshot = JSON.stringify(question);
        session.answer(question.answer);
        assert.equal(session.elements.get("feedback").textContent, `Correct. ${original.explanation}`);
        assert.equal(JSON.stringify(question), snapshot);
        session.next();
      });
      assert.equal(session.read().stats.correct, count);
      assert.equal(session.read().sessions[0].type, "mixed-review");
      assert.deepEqual(session.read().objectives, {}, "Mixed modes must retain existing progress behavior");
    }
  }

  // These modes share the engine but are outside the authorized randomization scope.
  for (const mode of ["boss-rush-1", "boss-rush-2", "weakness-captains", "final-captain-rush"]) {
    const session = await quiz(`?world=7&mode=${mode}`);
    const originals = bank(`json/aws-cloud-practitioner/captains/${mode}.json`);
    session.questions.forEach(question => assert.equal(question, originals.find(item => item.id === question.id)));
  }
  for (let exam = 1; exam <= 6; exam++) {
    const session = await quiz(`?exam=${exam}`);
    const originals = bank(`json/aws-cloud-practitioner/final-dungeon/practice-exam-${exam}.json`);
    session.questions.forEach(question => assert.equal(question, originals.find(item => item.id === question.id)));
  }
  // Exam routing takes precedence even if an objective world is also in the URL.
  const exam = await quiz("?exam=1&world=1&objective=1.1");
  exam.questions.forEach(question => assert.ok(bank("json/aws-cloud-practitioner/final-dungeon/practice-exam-1.json").includes(question)));

  // Existing records outside this AWS attempt must survive byte-for-byte.
  const protectedKeys = [
    ...["network-plus", "aplus-core1", "aplus-core2", "security-plus", "cloud-plus", "linux-essentials"]
      .map(slug => `hydra-${slug}-progress-v1`),
    "hydra-academy-finale-v1", "hydra-academy-certification-imports-v1",
    "hydra-aws-cloud-practitioner-field-manual-v1"
  ];
  const protectedRecords = protectedKeys.map(key => [key, JSON.stringify({ version: 1, sentinel: key })]);
  const isolated = await quiz("?world=1&objective=1.1", { storage: new Map(protectedRecords) });
  isolated.questions.forEach(question => { isolated.answer(question.answer); isolated.next(); });
  protectedRecords.forEach(([key, value]) => assert.equal(isolated.storage.get(key), value, key));

  console.log("AWS Cloud Practitioner answer randomization regression: PASS");
  console.log(`- 19 Objective Sweep banks / ${all.length} unique questions validated`);
  console.log(`- ${permutationsTested} exhaustive permutations: 24 per question, six correct placements per position`);
  console.log(`- ${graded} real handler grading checks: all four selections per question`);
  console.log("- Explanations, stable choices, source immutability, metadata, scoring, duplicate-submit guards: PASS");
  console.log("- Real progress/flags/incorrect/weakness/statistics storage, reloads, 85% mastery boundary: PASS");
  console.log("- Favorites persist; other kingdoms, Academy Completion, certification records, and Field Manual storage preserved: PASS");
  console.log("- All four Mixed modes, Weakness Mix with/without evidence: PASS");
  console.log("- Captain and Practice Exam answer order, including exam route precedence: unchanged");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
