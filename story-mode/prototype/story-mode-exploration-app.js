(function runStoryModeExplorationPrototype() {
  "use strict";

  const Engine = window.StoryModeEngine;
  const World = window.StoryModeWorld;
  const UI_STATES = Object.freeze({
    STORY_ENTRY: "STORY_ENTRY",
    EXPLORING: "EXPLORING",
    ENCOUNTER_TRANSITION: "ENCOUNTER_TRANSITION",
    ENDED: "ENDED"
  });
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
  const DIALOGUE = Object.freeze({
    initial: Object.freeze([
      "Welcome to the Technician's Forge. A Scrap Gremlin has been stealing, loosening, and mismatching the components entrusted to this hall.",
      "Approach the Gremlin when you are ready. Hydra will present five A+ Core 1 Objective 1.1 questions. Three correct answers earn victory, and every answer includes the full approved explanation."
    ]),
    talk: Object.freeze([
      "The Scrap Gremlin waits across the forge. Walk into its encounter boundary when you are ready to begin your five-question training battle."
    ]),
    defeatedTalk: Object.freeze([
      "The Gremlin remains an inert pile of scrap. If you want another training encounter, I can prepare it without resetting your question cycle."
    ]),
    victory: Object.freeze([
      "You defeated the Scrap Gremlin through your own knowledge. The remains are inert, and the forge is secure for now."
    ]),
    defeat: Object.freeze([
      "The forge remains open. Learn from the encounter, then approach the Scrap Gremlin again when you are ready."
    ])
  });

  const screens = Array.from(document.querySelectorAll(".screen"));
  const byId = (id) => document.getElementById(id);
  const elements = {
    loading: byId("loadingScreen"), entry: byId("entryScreen"), world: byId("worldScreen"),
    battle: byId("battleScreen"), result: byId("resultScreen"), failure: byId("failureScreen"), ended: byId("endedScreen"),
    entryTitle: byId("entryTitle"), enterForge: byId("enterForge"), endFromEntry: byId("endFromEntry"),
    endFromWorld: byId("endFromWorld"), worldTitle: byId("worldTitle"), worldStatus: byId("worldStatus"),
    worldHero: byId("worldHero"), worldGremlin: byId("worldGremlin"), worldScrap: byId("worldScrap"),
    worldPrompt: byId("worldPrompt"), talkButton: byId("talkButton"), encounterTransition: byId("encounterTransition"),
    dialoguePanel: byId("dialoguePanel"), dialogueText: byId("dialogueText"), dialogueContinue: byId("dialogueContinue"),
    prepareEncounter: byId("prepareEncounter"), dpadButtons: Array.from(document.querySelectorAll("[data-direction]")),
    turnCounter: byId("turnCounter"), questionNumber: byId("questionNumber"), questionText: byId("questionText"),
    answerForm: byId("answerForm"), answerList: byId("answerList"), choiceFieldset: byId("choiceFieldset"),
    submitAnswer: byId("submitAnswer"), feedbackPanel: byId("feedbackPanel"), feedbackResult: byId("feedbackResult"),
    submittedAnswer: byId("submittedAnswer"), approvedAnswer: byId("approvedAnswer"), explanationText: byId("explanationText"),
    continueBattle: byId("continueBattle"), heroHpText: byId("heroHpText"), enemyHpText: byId("enemyHpText"),
    heroHpSegments: byId("heroHpSegments"), enemyHpSegments: byId("enemyHpSegments"),
    heroCombatant: byId("heroCombatant"), enemyCombatant: byId("enemyCombatant"),
    resultTitle: byId("resultTitle"), resultMark: byId("resultMark"), resultScore: byId("resultScore"),
    resultHeroHp: byId("resultHeroHp"), resultEnemyHp: byId("resultEnemyHp"), retryEncounter: byId("retryEncounter"),
    returnToMaestro: byId("returnToMaestro"), failureTitle: byId("failureTitle"), recheckContent: byId("recheckContent"),
    endFromFailure: byId("endFromFailure"), endedTitle: byId("endedTitle"), liveRegion: byId("liveRegion")
  };

  let state = Engine.STATES.INITIALIZING;
  let authoritativeBank = [];
  let questionById = new Map();
  let cycle = null;
  let encounterPlan = null;
  let attempt = null;
  let lastResult = null;
  let worldState = World.createState();
  let dialoguePages = [];
  let dialogueIndex = 0;
  let dialogueKind = "";
  let heldDirections = [];
  let lastFrameTime = window.performance.now();
  let encounterTimer = null;

  function showScreen(screen, focusTarget) {
    screens.forEach((item) => { item.hidden = item !== screen; });
    if (focusTarget) window.setTimeout(() => focusTarget.focus(), 0);
  }

  function announce(message) {
    elements.liveRegion.textContent = "";
    window.setTimeout(() => { elements.liveRegion.textContent = message; }, 15);
  }

  function clearMovementInput() {
    heldDirections = [];
    elements.worldHero.classList.remove("walking");
    elements.dpadButtons.forEach((button) => button.classList.remove("pressed"));
  }

  async function sha256(text) {
    if (!window.crypto || !window.crypto.subtle) throw new Engine.StoryModeContractError("Secure source verification is unavailable.");
    const digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function cycleMetadata() {
    return {
      version: CONFIG.cycleVersion, certificationId: CONFIG.certificationId, objectiveId: CONFIG.objectiveId,
      sourceBankId: CONFIG.sourceBankId, sourceHash: CONFIG.sourceHash
    };
  }

  function writeCycle(nextCycle) {
    Engine.validateCycle(nextCycle, authoritativeBank.map((question) => question.id), cycleMetadata());
    try {
      window.localStorage.setItem(CONFIG.storageKey, JSON.stringify(nextCycle));
    } catch (_error) {
      throw new Engine.StoryModeContractError("Story Mode continuity could not be saved.");
    }
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

  async function initialize() {
    state = Engine.STATES.INITIALIZING;
    clearMovementInput();
    window.clearTimeout(encounterTimer);
    attempt = null;
    encounterPlan = null;
    lastResult = null;
    worldState = World.createState();
    elements.dialoguePanel.hidden = true;
    elements.encounterTransition.hidden = true;
    showScreen(elements.loading, byId("loadingTitle"));
    try {
      const response = await window.fetch(CONFIG.sourceUrl, { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Engine.StoryModeContractError("The approved source bank could not be loaded.");
      const sourceText = await response.text();
      const sourceHash = await sha256(sourceText.replace(/\r\n/g, "\n"));
      if (sourceHash !== CONFIG.sourceHash) throw new Engine.StoryModeContractError("The approved source bank fingerprint does not match.");
      authoritativeBank = Engine.validateBank(JSON.parse(sourceText), CONFIG);
      questionById = new Map(authoritativeBank.map((question) => [question.id, question]));
      cycle = readCycle(authoritativeBank.map((question) => question.id));
      state = UI_STATES.STORY_ENTRY;
      showScreen(elements.entry, elements.entryTitle);
      announce("Story Mode entry ready.");
    } catch (_error) {
      enterContentFailure();
    }
  }

  function enterForge() {
    worldState = World.createState();
    showScreen(elements.world, elements.worldTitle);
    renderWorld();
    openMaestroDialogue("initial");
  }

  function openMaestroDialogue(kind) {
    clearMovementInput();
    worldState = World.setMovementLocked(worldState, true);
    state = Engine.STATES.MAESTRO_BRIEFING;
    dialogueKind = kind;
    dialogueIndex = 0;
    dialoguePages = DIALOGUE[kind] || DIALOGUE.talk;
    elements.dialoguePanel.hidden = false;
    renderDialogue();
    announce("Maestro dialogue opened.");
  }

  function renderDialogue() {
    const finalPage = dialogueIndex === dialoguePages.length - 1;
    elements.dialogueText.textContent = dialoguePages[dialogueIndex];
    elements.dialogueContinue.textContent = dialogueKind === "initial" && finalPage ? "Begin Exploring" : "Continue";
    elements.prepareEncounter.hidden = !(dialogueKind === "defeatedTalk" && finalPage);
    elements.dialogueContinue.focus();
  }

  function advanceDialogue() {
    if (dialogueIndex < dialoguePages.length - 1) {
      dialogueIndex += 1;
      renderDialogue();
      return;
    }
    closeDialogue();
  }

  function closeDialogue() {
    elements.dialoguePanel.hidden = true;
    clearMovementInput();
    worldState = World.finishSafeReturn(worldState);
    state = UI_STATES.EXPLORING;
    renderWorld();
    elements.worldTitle.focus();
    announce("Exploration resumed.");
  }

  function prepareAnotherEncounter() {
    elements.dialoguePanel.hidden = true;
    clearMovementInput();
    worldState = World.prepareTrainingEncounter(worldState);
    state = UI_STATES.EXPLORING;
    renderWorld();
    elements.worldTitle.focus();
    announce("The Scrap Gremlin training encounter is ready again.");
  }

  function renderWorld() {
    elements.worldHero.style.setProperty("--hero-x", `${worldState.player.x / World.MAP.width * 100}%`);
    elements.worldHero.style.setProperty("--hero-y", `${worldState.player.y / World.MAP.height * 100}%`);
    elements.worldHero.classList.remove("facing-up", "facing-down", "facing-left", "facing-right");
    elements.worldHero.classList.add(`facing-${worldState.player.facing}`);
    elements.worldGremlin.hidden = worldState.gremlinState !== "active";
    elements.worldScrap.hidden = worldState.gremlinState !== "defeated";
    elements.worldStatus.textContent = worldState.gremlinState === "active" ? "Scrap Gremlin active" : "Forge secured — inert scrap remains";
    const canTalk = state === UI_STATES.EXPLORING && World.canTalkToMaestro(worldState);
    elements.worldPrompt.hidden = !canTalk;
    elements.talkButton.disabled = !canTalk;
  }

  function pressDirection(direction) {
    if (state !== UI_STATES.EXPLORING || !World.DIRECTIONS[direction]) return;
    heldDirections = heldDirections.filter((item) => item !== direction);
    heldDirections.push(direction);
    const button = elements.dpadButtons.find((item) => item.dataset.direction === direction);
    if (button) button.classList.add("pressed");
  }

  function releaseDirection(direction) {
    heldDirections = heldDirections.filter((item) => item !== direction);
    const button = elements.dpadButtons.find((item) => item.dataset.direction === direction);
    if (button) button.classList.remove("pressed");
    if (!heldDirections.length) elements.worldHero.classList.remove("walking");
  }

  function updateWorldFrame(timestamp) {
    const elapsed = Math.min((timestamp - lastFrameTime) / 1000, 0.05);
    lastFrameTime = timestamp;
    if (state === UI_STATES.EXPLORING && heldDirections.length) {
      const movement = World.movePlayer(worldState, heldDirections[heldDirections.length - 1], elapsed);
      worldState = movement.state;
      elements.worldHero.classList.toggle("walking", movement.moved);
      renderWorld();
      if (movement.encounterTriggered) triggerEncounter();
    }
    window.requestAnimationFrame(updateWorldFrame);
  }

  function triggerEncounter() {
    if (state !== UI_STATES.EXPLORING || worldState.gremlinState !== "active") return;
    clearMovementInput();
    worldState = World.setMovementLocked(worldState, true);
    state = UI_STATES.ENCOUNTER_TRANSITION;
    elements.encounterTransition.hidden = false;
    elements.worldPrompt.hidden = true;
    elements.talkButton.disabled = true;
    announce("Scrap Gremlin encounter triggered.");
    encounterTimer = window.setTimeout(beginEncounter, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 40 : 520);
  }

  function beginEncounter() {
    window.clearTimeout(encounterTimer);
    elements.encounterTransition.hidden = true;
    clearMovementInput();
    try {
      state = Engine.STATES.ENCOUNTER_READY;
      encounterPlan = Engine.planEncounter(cycle, authoritativeBank.map((question) => question.id), CONFIG.encounterLength, cycleMetadata());
      attempt = Engine.createAttempt(encounterPlan.questionIds);
      Engine.activateAttempt(attempt);
      state = attempt.state;
      updateHp();
      showScreen(elements.battle);
      displayCurrentQuestion();
    } catch (_error) {
      enterContentFailure();
    }
  }

  function displayCurrentQuestion() {
    try {
      if (!attempt || attempt.state !== Engine.STATES.QUESTION_ACTIVE) throw new Engine.StoryModeStateError("No active question is available.");
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
      elements.answerList.querySelector("input")?.focus();
    } catch (_error) {
      enterContentFailure();
    }
  }

  function renderHpSegments(container, hp) {
    container.replaceChildren();
    for (let index = 0; index < 5; index += 1) {
      const segment = document.createElement("span");
      segment.className = `hp-segment${index >= hp ? " lost" : ""}`;
      container.append(segment);
    }
  }

  function updateHp() {
    if (!attempt) return;
    renderHpSegments(elements.heroHpSegments, attempt.heroHp);
    renderHpSegments(elements.enemyHpSegments, attempt.enemyHp);
    elements.heroHpText.textContent = `${attempt.heroHp}/5 HP`;
    elements.enemyHpText.textContent = `${attempt.enemyHp}/5 HP`;
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
    } catch (_error) {
      enterContentFailure();
    }
  }

  function continueAfterFeedback() {
    if (!attempt || attempt.state !== Engine.STATES.FEEDBACK_REQUIRED) return;
    try {
      const nextState = Engine.advanceAfterFeedback(attempt);
      state = nextState;
      if (nextState === Engine.STATES.QUESTION_ACTIVE) displayCurrentQuestion();
      else if ([Engine.STATES.VICTORY, Engine.STATES.DEFEAT].includes(nextState)) showResult(nextState);
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
    if (![Engine.STATES.VICTORY, Engine.STATES.DEFEAT].includes(lastResult)) return;
    worldState = World.returnToMaestro(worldState, lastResult);
    attempt = null;
    encounterPlan = null;
    showScreen(elements.world, elements.worldTitle);
    renderWorld();
    openMaestroDialogue(lastResult === Engine.STATES.VICTORY ? "victory" : "defeat");
  }

  function talkToMaestro() {
    if (state !== UI_STATES.EXPLORING || !World.canTalkToMaestro(worldState)) return;
    openMaestroDialogue(worldState.gremlinState === "defeated" ? "defeatedTalk" : "talk");
  }

  function enterContentFailure() {
    clearMovementInput();
    window.clearTimeout(encounterTimer);
    state = Engine.STATES.CONTENT_FAILURE;
    attempt = null;
    encounterPlan = null;
    showScreen(elements.failure, elements.failureTitle);
    announce("Training content unavailable. This encounter was stopped safely. No result was recorded.");
  }

  function endPrototype() {
    clearMovementInput();
    window.clearTimeout(encounterTimer);
    attempt = null;
    encounterPlan = null;
    state = UI_STATES.ENDED;
    showScreen(elements.ended, elements.endedTitle);
    announce("Prototype ended safely.");
  }

  const keyToDirection = Object.freeze({
    ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
    ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right"
  });
  document.addEventListener("keydown", (event) => {
    const direction = keyToDirection[event.code];
    if (direction && state === UI_STATES.EXPLORING) {
      event.preventDefault();
      pressDirection(direction);
      return;
    }
    if (state === UI_STATES.EXPLORING && ["KeyE", "Enter"].includes(event.code)) {
      event.preventDefault();
      talkToMaestro();
    }
  });
  document.addEventListener("keyup", (event) => {
    const direction = keyToDirection[event.code];
    if (direction) {
      event.preventDefault();
      releaseDirection(direction);
    }
  });
  window.addEventListener("blur", clearMovementInput);
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearMovementInput(); });

  elements.dpadButtons.forEach((button) => {
    const direction = button.dataset.direction;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      pressDirection(direction);
    });
    ["pointerup", "pointercancel", "lostpointercapture", "pointerleave"].forEach((name) => {
      button.addEventListener(name, () => releaseDirection(direction));
    });
  });

  elements.answerList.addEventListener("change", () => {
    if (attempt?.state === Engine.STATES.QUESTION_ACTIVE) elements.submitAnswer.disabled = false;
  });
  elements.answerForm.addEventListener("submit", submitCurrentAnswer);
  elements.continueBattle.addEventListener("click", continueAfterFeedback);
  elements.enterForge.addEventListener("click", enterForge);
  elements.dialogueContinue.addEventListener("click", advanceDialogue);
  elements.prepareEncounter.addEventListener("click", prepareAnotherEncounter);
  elements.talkButton.addEventListener("click", talkToMaestro);
  elements.retryEncounter.addEventListener("click", beginEncounter);
  elements.returnToMaestro.addEventListener("click", returnToMaestro);
  elements.endFromEntry.addEventListener("click", endPrototype);
  elements.endFromWorld.addEventListener("click", endPrototype);
  elements.endFromFailure.addEventListener("click", endPrototype);
  elements.recheckContent.addEventListener("click", initialize);

  if (["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) {
    window.__GSA_STORY_MODE_DEV__ = Object.freeze({
      forceContentFailure: enterContentFailure,
      getState: () => state,
      getWorldState: () => World.cloneState(worldState),
      placePlayer: (x, y, facing) => {
        worldState = World.placePlayer(worldState, x, y, facing);
        renderWorld();
        return World.cloneState(worldState);
      },
      storageKey: CONFIG.storageKey
    });
  }

  window.requestAnimationFrame(updateWorldFrame);
  initialize();
})();
