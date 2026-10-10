(function runStoryModePrototype() {
  "use strict";

  const Engine = window.StoryModeEngine;
  const CONFIG = Object.freeze({
    certificationId: "aplus-core1-220-1201",
    objectiveId: "1.1",
    domain: "1",
    sourceBankId: "json/aplus-core1/world1/1.1-hatchling.json",
    sourceUrl: "../../json/aplus-core1/world1/1.1-hatchling.json",
    sourceHash: "ced5202569fc6be240eddd160ed6dedc54a2684467cb8d3b38789c17a6d40869",
    questionCount: 11,
    encounterLength: 5,
    cycleVersion: 1,
    storageKey: "gsa.storyMode.prototype.v1.aplus-core1.1.1.questionCycle"
  });

  const TRACE = Object.freeze({
    certificationId: CONFIG.certificationId,
    objectiveId: CONFIG.objectiveId,
    sourceBankId: CONFIG.sourceBankId
  });

  const screens = Array.from(document.querySelectorAll(".screen"));
  const elements = {
    loading: document.getElementById("loadingScreen"),
    maestro: document.getElementById("maestroScreen"),
    battle: document.getElementById("battleScreen"),
    result: document.getElementById("resultScreen"),
    failure: document.getElementById("failureScreen"),
    ended: document.getElementById("endedScreen"),
    maestroTitle: document.getElementById("maestroTitle"),
    maestroMessage: document.getElementById("maestroMessage"),
    beginEncounter: document.getElementById("beginEncounter"),
    endFromMaestro: document.getElementById("endFromMaestro"),
    turnCounter: document.getElementById("turnCounter"),
    questionNumber: document.getElementById("questionNumber"),
    questionText: document.getElementById("questionText"),
    answerForm: document.getElementById("answerForm"),
    answerList: document.getElementById("answerList"),
    choiceFieldset: document.getElementById("choiceFieldset"),
    submitAnswer: document.getElementById("submitAnswer"),
    feedbackPanel: document.getElementById("feedbackPanel"),
    feedbackResult: document.getElementById("feedbackResult"),
    submittedAnswer: document.getElementById("submittedAnswer"),
    approvedAnswer: document.getElementById("approvedAnswer"),
    explanationText: document.getElementById("explanationText"),
    continueBattle: document.getElementById("continueBattle"),
    heroHpText: document.getElementById("heroHpText"),
    enemyHpText: document.getElementById("enemyHpText"),
    heroHpSegments: document.getElementById("heroHpSegments"),
    enemyHpSegments: document.getElementById("enemyHpSegments"),
    heroCombatant: document.getElementById("heroCombatant"),
    enemyCombatant: document.getElementById("enemyCombatant"),
    resultTitle: document.getElementById("resultTitle"),
    resultMark: document.getElementById("resultMark"),
    resultScore: document.getElementById("resultScore"),
    resultHeroHp: document.getElementById("resultHeroHp"),
    resultEnemyHp: document.getElementById("resultEnemyHp"),
    retryEncounter: document.getElementById("retryEncounter"),
    returnToMaestro: document.getElementById("returnToMaestro"),
    failureTitle: document.getElementById("failureTitle"),
    recheckContent: document.getElementById("recheckContent"),
    endFromFailure: document.getElementById("endFromFailure"),
    endedTitle: document.getElementById("endedTitle"),
    liveRegion: document.getElementById("liveRegion")
  };

  let state = Engine.STATES.INITIALIZING;
  let authoritativeBank = [];
  let questionById = new Map();
  let cycle = null;
  let encounterPlan = null;
  let attempt = null;
  let lastResult = null;

  function showScreen(screen, focusTarget) {
    screens.forEach((item) => { item.hidden = item !== screen; });
    if (focusTarget) window.setTimeout(() => focusTarget.focus(), 0);
  }

  function announce(message) {
    elements.liveRegion.textContent = "";
    window.setTimeout(() => { elements.liveRegion.textContent = message; }, 15);
  }

  async function sha256(text) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Engine.StoryModeContractError("Secure source verification is unavailable.");
    }
    const bytes = new TextEncoder().encode(text);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function canonicalSourceText(text) {
    return text.replace(/\r\n/g, "\n");
  }

  function cycleMetadata() {
    return {
      version: CONFIG.cycleVersion,
      certificationId: CONFIG.certificationId,
      objectiveId: CONFIG.objectiveId,
      sourceBankId: CONFIG.sourceBankId,
      sourceHash: CONFIG.sourceHash
    };
  }

  function readCycle(questionIds) {
    let stored = null;
    try {
      stored = window.localStorage.getItem(CONFIG.storageKey);
    } catch (_error) {
      throw new Engine.StoryModeContractError("Story Mode continuity storage is unavailable.");
    }

    if (stored) {
      try {
        return Engine.validateCycle(JSON.parse(stored), questionIds, cycleMetadata());
      } catch (_invalidRecord) {
        try {
          window.localStorage.removeItem(CONFIG.storageKey);
        } catch (_error) {
          throw new Engine.StoryModeContractError("Invalid Story Mode continuity could not be cleared.");
        }
      }
    }

    const freshCycle = Engine.createCycle(questionIds, cycleMetadata());
    writeCycle(freshCycle);
    return freshCycle;
  }

  function writeCycle(nextCycle) {
    Engine.validateCycle(nextCycle, authoritativeBank.map((question) => question.id), cycleMetadata());
    try {
      window.localStorage.setItem(CONFIG.storageKey, JSON.stringify(nextCycle));
    } catch (_error) {
      throw new Engine.StoryModeContractError("Story Mode continuity could not be saved.");
    }
  }

  async function initialize() {
    state = Engine.STATES.INITIALIZING;
    attempt = null;
    encounterPlan = null;
    showScreen(elements.loading, document.getElementById("loadingTitle"));
    try {
      const response = await window.fetch(CONFIG.sourceUrl, { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Engine.StoryModeContractError("The approved source bank could not be loaded.");
      const sourceText = await response.text();
      const sourceHash = await sha256(canonicalSourceText(sourceText));
      if (sourceHash !== CONFIG.sourceHash) throw new Engine.StoryModeContractError("The approved source bank fingerprint does not match.");
      const parsed = JSON.parse(sourceText);
      authoritativeBank = Engine.validateBank(parsed, CONFIG);
      questionById = new Map(authoritativeBank.map((question) => [question.id, question]));
      cycle = readCycle(authoritativeBank.map((question) => question.id));
      showMaestro("");
    } catch (_error) {
      enterContentFailure();
    }
  }

  function showMaestro(message) {
    state = Engine.STATES.MAESTRO_BRIEFING;
    attempt = null;
    encounterPlan = null;
    elements.maestroMessage.textContent = message;
    elements.beginEncounter.textContent = lastResult ? "Train Again" : "Begin Encounter";
    showScreen(elements.maestro, elements.maestroTitle);
    announce("Maestro briefing ready.");
  }

  function beginEncounter() {
    try {
      state = Engine.STATES.ENCOUNTER_READY;
      encounterPlan = Engine.planEncounter(
        cycle,
        authoritativeBank.map((question) => question.id),
        CONFIG.encounterLength,
        cycleMetadata()
      );
      attempt = Engine.createAttempt(encounterPlan.questionIds);
      Engine.activateAttempt(attempt);
      state = attempt.state;
      renderBattle();
      displayCurrentQuestion();
    } catch (_error) {
      enterContentFailure();
    }
  }

  function renderBattle() {
    updateHp();
    showScreen(elements.battle);
  }

  function displayCurrentQuestion() {
    try {
      if (!attempt || attempt.state !== Engine.STATES.QUESTION_ACTIVE) {
        throw new Engine.StoryModeStateError("No active question is available.");
      }
      const question = questionById.get(attempt.questionIds[attempt.turnIndex]);
      if (!question) throw new Engine.StoryModeContractError("The selected question is unavailable.");
      const safeQuestion = Engine.createPlayerSafeQuestion(question, TRACE);

      elements.turnCounter.textContent = `Turn ${attempt.turnIndex + 1} of 5`;
      elements.questionNumber.textContent = `Question ${attempt.turnIndex + 1} of 5`;
      elements.questionText.textContent = safeQuestion.question;
      elements.answerList.replaceChildren();
      safeQuestion.choices.forEach((choice, index) => {
        const label = document.createElement("label");
        label.className = "answer-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "storyAnswer";
        input.value = String(index);
        const text = document.createElement("span");
        text.textContent = choice;
        label.append(input, text);
        elements.answerList.append(label);
      });
      elements.submitAnswer.disabled = true;
      elements.choiceFieldset.disabled = false;
      elements.feedbackPanel.hidden = true;
      elements.answerForm.hidden = false;

      cycle = JSON.parse(JSON.stringify(encounterPlan.checkpoints[attempt.turnIndex]));
      writeCycle(cycle);
      announce(`Question ${attempt.turnIndex + 1} of 5 ready.`);
      const firstChoice = elements.answerList.querySelector("input");
      if (firstChoice) firstChoice.focus();
    } catch (_error) {
      enterContentFailure();
    }
  }

  function updateHp() {
    if (!attempt) return;
    renderHpSegments(elements.heroHpSegments, attempt.heroHp);
    renderHpSegments(elements.enemyHpSegments, attempt.enemyHp);
    elements.heroHpText.textContent = `${attempt.heroHp}/5 HP`;
    elements.enemyHpText.textContent = `${attempt.enemyHp}/5 HP`;
  }

  function renderHpSegments(container, hp) {
    container.replaceChildren();
    for (let index = 0; index < 5; index += 1) {
      const segment = document.createElement("span");
      segment.className = `hp-segment${index >= hp ? " lost" : ""}`;
      container.append(segment);
    }
  }

  function submitCurrentAnswer(event) {
    event.preventDefault();
    if (!attempt || attempt.state !== Engine.STATES.QUESTION_ACTIVE) return;
    const selected = elements.answerForm.querySelector('input[name="storyAnswer"]:checked');
    if (!selected) return;

    elements.choiceFieldset.disabled = true;
    elements.submitAnswer.disabled = true;
    try {
      const question = questionById.get(attempt.questionIds[attempt.turnIndex]);
      const feedback = Engine.resolveAnswer(attempt, question, Number(selected.value), TRACE);
      state = attempt.state;
      updateHp();
      showFeedback(feedback);
    } catch (_error) {
      enterContentFailure();
    }
  }

  function showFeedback(feedback) {
    elements.feedbackResult.textContent = feedback.correct ? "Correct" : "Incorrect";
    elements.feedbackResult.className = `feedback-result ${feedback.correct ? "correct" : "incorrect"}`;
    elements.submittedAnswer.textContent = feedback.submittedAnswer;
    elements.approvedAnswer.textContent = feedback.approvedAnswer;
    elements.explanationText.textContent = feedback.explanation;
    elements.continueBattle.textContent = attempt.turnIndex === 4 ? "View Battle Result" : "Continue Battle";
    elements.feedbackPanel.hidden = false;

    const struck = feedback.correct ? elements.enemyCombatant : elements.heroCombatant;
    struck.classList.remove("hit");
    window.requestAnimationFrame(() => struck.classList.add("hit"));
    window.setTimeout(() => struck.classList.remove("hit"), 500);

    elements.feedbackPanel.focus();
    announce(`${feedback.correct ? "Correct" : "Incorrect"}. ${feedback.explanation}`);
  }

  function continueAfterFeedback() {
    if (!attempt || attempt.state !== Engine.STATES.FEEDBACK_REQUIRED) return;
    try {
      const nextState = Engine.advanceAfterFeedback(attempt);
      state = nextState;
      if (nextState === Engine.STATES.QUESTION_ACTIVE) displayCurrentQuestion();
      else if (nextState === Engine.STATES.VICTORY || nextState === Engine.STATES.DEFEAT) showResult(nextState);
      else enterContentFailure();
    } catch (_error) {
      enterContentFailure();
    }
  }

  function showResult(resultState) {
    lastResult = resultState;
    const victory = resultState === Engine.STATES.VICTORY;
    elements.resultTitle.textContent = victory ? "Victory" : "Defeat — Training Continues";
    elements.resultMark.textContent = victory ? "⚔" : "↻";
    elements.resultScore.textContent = `${attempt.correctCount}/5 correct`;
    elements.resultHeroHp.textContent = `${attempt.heroHp}/5 HP`;
    elements.resultEnemyHp.textContent = `${attempt.enemyHp}/5 HP`;
    elements.retryEncounter.hidden = victory;
    showScreen(elements.result, elements.resultTitle);
    announce(victory ? "Victory. Return to the Maestro." : "Defeat. Training continues.");
  }

  function returnToMaestro() {
    const message = lastResult === Engine.STATES.VICTORY
      ? "You defeated the Scrap Gremlin through your own knowledge. Continue training when you are ready."
      : "The forge remains open. Learn from the encounter and return when you are ready.";
    showMaestro(message);
  }

  function enterContentFailure() {
    state = Engine.STATES.CONTENT_FAILURE;
    attempt = null;
    encounterPlan = null;
    showScreen(elements.failure, elements.failureTitle);
    announce("Training content unavailable. This encounter was stopped safely. No result was recorded.");
  }

  function endPrototype() {
    attempt = null;
    encounterPlan = null;
    showScreen(elements.ended, elements.endedTitle);
    announce("Prototype ended safely.");
  }

  elements.answerList.addEventListener("change", () => {
    if (attempt && attempt.state === Engine.STATES.QUESTION_ACTIVE) elements.submitAnswer.disabled = false;
  });
  elements.answerForm.addEventListener("submit", submitCurrentAnswer);
  elements.continueBattle.addEventListener("click", continueAfterFeedback);
  elements.beginEncounter.addEventListener("click", beginEncounter);
  elements.retryEncounter.addEventListener("click", beginEncounter);
  elements.returnToMaestro.addEventListener("click", returnToMaestro);
  elements.endFromMaestro.addEventListener("click", endPrototype);
  elements.endFromFailure.addEventListener("click", endPrototype);
  elements.recheckContent.addEventListener("click", initialize);

  if (["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) {
    window.__GSA_STORY_MODE_DEV__ = Object.freeze({
      forceContentFailure: enterContentFailure,
      getState: () => state,
      storageKey: CONFIG.storageKey
    });
  }

  initialize();
})();
