(function attachStoryModeEngine(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.StoryModeEngine = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createStoryModeEngine() {
  "use strict";

  const STATES = Object.freeze({
    INITIALIZING: "INITIALIZING",
    MAESTRO_BRIEFING: "MAESTRO_BRIEFING",
    ENCOUNTER_READY: "ENCOUNTER_READY",
    QUESTION_ACTIVE: "QUESTION_ACTIVE",
    ANSWER_RESOLVING: "ANSWER_RESOLVING",
    FEEDBACK_REQUIRED: "FEEDBACK_REQUIRED",
    TURN_ADVANCE: "TURN_ADVANCE",
    VICTORY: "VICTORY",
    DEFEAT: "DEFEAT",
    CONTENT_FAILURE: "CONTENT_FAILURE"
  });

  class StoryModeContractError extends Error {
    constructor(message) {
      super(message);
      this.name = "StoryModeContractError";
    }
  }

  class StoryModeStateError extends Error {
    constructor(message) {
      super(message);
      this.name = "StoryModeStateError";
    }
  }

  function assert(condition, message, ErrorType = StoryModeContractError) {
    if (!condition) throw new ErrorType(message);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function validateBank(rawBank, expected) {
    assert(Array.isArray(rawBank), "The source bank must be an array.");
    assert(rawBank.length === expected.questionCount, "The source bank question count is invalid.");
    const ids = new Set();
    const validated = rawBank.map((item, index) => {
      assert(item && typeof item === "object" && !Array.isArray(item), `Question ${index + 1} is invalid.`);
      assert(typeof item.id === "string" && item.id.trim(), `Question ${index + 1} has no valid ID.`);
      assert(!ids.has(item.id), `Duplicate question ID: ${item.id}`);
      ids.add(item.id);
      assert(String(item.domain) === String(expected.domain), `Question ${item.id} has the wrong domain.`);
      assert(String(item.objective) === String(expected.objectiveId), `Question ${item.id} has the wrong objective.`);
      assert(typeof item.question === "string" && item.question.trim(), `Question ${item.id} has no wording.`);
      assert(Array.isArray(item.choices) && item.choices.length >= 2, `Question ${item.id} has invalid choices.`);
      item.choices.forEach((choice, choiceIndex) => {
        assert(typeof choice === "string" && choice.trim(), `Question ${item.id}, choice ${choiceIndex + 1} is invalid.`);
      });
      assert(Number.isInteger(item.answer), `Question ${item.id} has an invalid answer key.`);
      assert(item.answer >= 0 && item.answer < item.choices.length, `Question ${item.id} answer key is out of range.`);
      assert(typeof item.explanation === "string" && item.explanation.trim(), `Question ${item.id} has no explanation.`);
      return Object.freeze({
        id: item.id,
        domain: String(item.domain),
        objective: String(item.objective),
        blueprint: typeof item.blueprint === "string" ? item.blueprint : "",
        difficulty: typeof item.difficulty === "string" ? item.difficulty : "",
        question: item.question,
        choices: Object.freeze(item.choices.slice()),
        answer: item.answer,
        explanation: item.explanation
      });
    });
    return Object.freeze(validated);
  }

  function createPlayerSafeQuestion(question, trace) {
    return Object.freeze({
      id: question.id,
      certificationId: trace.certificationId,
      objectiveId: trace.objectiveId,
      sourceBankId: trace.sourceBankId,
      domain: question.domain,
      blueprint: question.blueprint,
      difficulty: question.difficulty,
      question: question.question,
      choices: Object.freeze(question.choices.slice())
    });
  }

  function browserRandom() {
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      return values[0] / 4294967296;
    }
    return Math.random();
  }

  function shuffle(values, random = browserRandom) {
    const result = values.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function createCycle(questionIds, metadata, random = browserRandom) {
    assert(Array.isArray(questionIds) && questionIds.length > 0, "Cannot create an empty question cycle.");
    assert(new Set(questionIds).size === questionIds.length, "Question cycle IDs must be unique.");
    return {
      version: metadata.version,
      certificationId: metadata.certificationId,
      objectiveId: metadata.objectiveId,
      sourceBankId: metadata.sourceBankId,
      sourceHash: metadata.sourceHash,
      cycleNumber: 1,
      order: shuffle(questionIds, random),
      seen: []
    };
  }

  function validateCycle(record, questionIds, metadata) {
    assert(record && typeof record === "object" && !Array.isArray(record), "Question cycle is not an object.");
    assert(record.version === metadata.version, "Question cycle version is stale.");
    assert(record.certificationId === metadata.certificationId, "Question cycle certification does not match.");
    assert(record.objectiveId === metadata.objectiveId, "Question cycle objective does not match.");
    assert(record.sourceBankId === metadata.sourceBankId, "Question cycle source does not match.");
    assert(record.sourceHash === metadata.sourceHash, "Question cycle source version does not match.");
    assert(Number.isInteger(record.cycleNumber) && record.cycleNumber >= 1, "Question cycle number is invalid.");
    assert(Array.isArray(record.order) && record.order.length === questionIds.length, "Question cycle order is invalid.");
    assert(new Set(record.order).size === questionIds.length, "Question cycle order contains duplicates.");
    assert(questionIds.every((id) => record.order.includes(id)), "Question cycle order does not match the bank.");
    assert(Array.isArray(record.seen), "Question cycle seen list is invalid.");
    assert(new Set(record.seen).size === record.seen.length, "Question cycle seen list contains duplicates.");
    assert(record.seen.every((id) => questionIds.includes(id)), "Question cycle contains an unknown question.");
    return clone(record);
  }

  function planEncounter(cycleRecord, questionIds, count, metadata, random = browserRandom) {
    assert(Number.isInteger(count) && count > 0 && count <= questionIds.length, "Encounter length is invalid.");
    let working = validateCycle(cycleRecord, questionIds, metadata);
    const selected = [];
    const checkpoints = [];
    while (selected.length < count) {
      let nextId = working.order.find((id) => !working.seen.includes(id) && !selected.includes(id));
      if (!nextId) {
        const previousCycleNumber = working.cycleNumber;
        working = createCycle(questionIds, metadata, random);
        working.cycleNumber = previousCycleNumber + 1;
        nextId = working.order.find((id) => !selected.includes(id));
      }
      assert(Boolean(nextId), "Unable to select a unique encounter question.");
      selected.push(nextId);
      working.seen.push(nextId);
      checkpoints.push(clone(working));
    }
    return Object.freeze({
      questionIds: Object.freeze(selected.slice()),
      checkpoints: Object.freeze(checkpoints.map((checkpoint) => Object.freeze(checkpoint)))
    });
  }

  function createAttempt(questionIds) {
    assert(Array.isArray(questionIds) && questionIds.length === 5, "The prototype encounter requires five questions.");
    assert(new Set(questionIds).size === 5, "An encounter cannot contain duplicate questions.");
    return {
      state: STATES.ENCOUNTER_READY,
      heroHp: 5,
      enemyHp: 5,
      turnIndex: 0,
      correctCount: 0,
      questionIds: questionIds.slice(),
      answers: [],
      currentFeedback: null
    };
  }

  function activateAttempt(attempt) {
    assert(attempt.state === STATES.ENCOUNTER_READY, "Encounter cannot be activated from this state.", StoryModeStateError);
    attempt.state = STATES.QUESTION_ACTIVE;
    return attempt;
  }

  function resolveAnswer(attempt, question, selectedChoice, trace) {
    assert(attempt.state === STATES.QUESTION_ACTIVE, "Answer submission is not allowed in this state.", StoryModeStateError);
    assert(attempt.questionIds[attempt.turnIndex] === question.id, "The active question does not match the encounter.", StoryModeStateError);
    assert(Number.isInteger(selectedChoice) && selectedChoice >= 0 && selectedChoice < question.choices.length, "The submitted choice is invalid.", StoryModeStateError);
    attempt.state = STATES.ANSWER_RESOLVING;
    const correct = selectedChoice === question.answer;
    if (correct) {
      attempt.enemyHp -= 1;
      attempt.correctCount += 1;
    } else {
      attempt.heroHp -= 1;
    }
    const feedback = Object.freeze({
      questionId: question.id,
      certificationId: trace.certificationId,
      objectiveId: trace.objectiveId,
      sourceBankId: trace.sourceBankId,
      selectedChoice,
      submittedAnswer: question.choices[selectedChoice],
      approvedAnswer: question.choices[question.answer],
      correct,
      explanation: question.explanation,
      heroHp: attempt.heroHp,
      enemyHp: attempt.enemyHp
    });
    attempt.answers.push(feedback);
    attempt.currentFeedback = feedback;
    attempt.state = STATES.FEEDBACK_REQUIRED;
    return feedback;
  }

  function advanceAfterFeedback(attempt) {
    assert(attempt.state === STATES.FEEDBACK_REQUIRED, "The explanation must be shown before advancing.", StoryModeStateError);
    attempt.state = STATES.TURN_ADVANCE;
    if (attempt.turnIndex === 4) {
      attempt.state = attempt.correctCount >= 3 ? STATES.VICTORY : STATES.DEFEAT;
      return attempt.state;
    }
    attempt.turnIndex += 1;
    attempt.currentFeedback = null;
    attempt.state = STATES.QUESTION_ACTIVE;
    return attempt.state;
  }

  return Object.freeze({
    STATES,
    StoryModeContractError,
    StoryModeStateError,
    validateBank,
    createPlayerSafeQuestion,
    shuffle,
    createCycle,
    validateCycle,
    planEncounter,
    createAttempt,
    activateAttempt,
    resolveAnswer,
    advanceAfterFeedback
  });
});
