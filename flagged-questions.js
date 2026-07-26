(function () {
  "use strict";

  const CONFIGS = {
    "network-plus": { name: "Network+", progressKey: "hydra-network-plus-progress-v1", storageKey: "hydra-network-plus-flags-v1", favoriteKey: "hydra-network-plus-favorites-v1", incorrectKey: "hydra-network-plus-incorrect-v1", weaknessKey: "hydra-network-plus-weakness-v1", objectiveCounts: [8, 4, 5, 3, 5], bankRoot: "json", home: "network-plus.html" },
    "aplus-core1": { name: "A+ Core 1", progressKey: "hydra-aplus-core1-progress-v1", storageKey: "hydra-aplus-core1-flags-v1", favoriteKey: "hydra-aplus-core1-favorites-v1", incorrectKey: "hydra-aplus-core1-incorrect-v1", weaknessKey: "hydra-aplus-core1-weakness-v1", objectiveCounts: [3, 8, 8, 2, 6], bankRoot: "json/aplus-core1", home: "aplus-core1.html" },
    "aplus-core2": { name: "A+ Core 2", progressKey: "hydra-aplus-core2-progress-v1", storageKey: "hydra-aplus-core2-flags-v1", favoriteKey: "hydra-aplus-core2-favorites-v1", incorrectKey: "hydra-aplus-core2-incorrect-v1", weaknessKey: "hydra-aplus-core2-weakness-v1", objectiveCounts: [11, 11, 4, 5, 5], objectivesByWorld: { "5": ["4.6", "4.7", "4.8", "4.9", "4.10"] }, bankRoot: "json/aplus-core2", home: "aplus-core2.html" },
    "security-plus": { name: "Security+", progressKey: "hydra-security-plus-progress-v1", storageKey: "hydra-security-plus-flags-v1", favoriteKey: "hydra-security-plus-favorites-v1", incorrectKey: "hydra-security-plus-incorrect-v1", weaknessKey: "hydra-security-plus-weakness-v1", objectiveCounts: [4, 5, 4, 9, 6], bankRoot: "json/security-plus", home: "security-plus.html" },
    "linux-essentials": { name: "Linux Essentials", progressKey: "hydra-linux-essentials-progress-v1", storageKey: "hydra-linux-essentials-flags-v1", favoriteKey: "hydra-linux-essentials-favorites-v1", incorrectKey: "hydra-linux-essentials-incorrect-v1", weaknessKey: "hydra-linux-essentials-weakness-v1", objectiveCounts: [4, 4, 3, 4, 4], bankRoot: "json/linux-essentials", home: "linux-essentials.html" },
    "aws-cloud-practitioner": { name: "AWS Cloud Practitioner", progressKey: "hydra-aws-cloud-practitioner-progress-v1", storageKey: "hydra-aws-cloud-practitioner-flags-v1", favoriteKey: "hydra-aws-cloud-practitioner-favorites-v1", incorrectKey: "hydra-aws-cloud-practitioner-incorrect-v1", weaknessKey: "hydra-aws-cloud-practitioner-weakness-v1", objectiveCounts: [4, 4, 4, 4, 3], objectivesByWorld: { "1": ["1.1", "1.2", "1.3", "1.4"], "2": ["2.1", "2.2", "2.3", "2.4"], "3": ["3.1", "3.2", "3.3", "3.4"], "4": ["3.5", "3.6", "3.7", "3.8"], "5": ["4.1", "4.2", "4.3"] }, bankRoot: "json/aws-cloud-practitioner", home: "aws-cloud-practitioner.html" }
  };

  const TYPES = {
    flags: { key: "storageKey", list: "flags", date: "flaggedAt", event: "hydra-flags-updated" },
    favorites: { key: "favoriteKey", list: "favorites", date: "favoritedAt", event: "hydra-favorites-updated" }
  };

  function configFor(slug) { return CONFIGS[slug] || null; }

  function currentConfig() {
    const key = document.body?.dataset.progressKey;
    return Object.values(CONFIGS).find(config => config.progressKey === key) || null;
  }

  function recordKey(record) { return `${record.bankPath}::${String(record.questionId)}`; }

  function typeConfig(type) { return TYPES[type] || TYPES.flags; }

  function read(config, type = "flags") {
    if (!config) return [];
    const settings = typeConfig(type);
    try {
      const stored = JSON.parse(localStorage.getItem(config[settings.key]) || "{}");
      const records = Array.isArray(stored) ? stored : stored[settings.list];
      return Array.isArray(records) ? records.filter(record => record && record.questionId != null && record.bankPath) : [];
    } catch (_) {
      return [];
    }
  }

  function write(config, records, type = "flags") {
    const settings = typeConfig(type);
    const unique = [...new Map(records.map(record => [recordKey(record), record])).values()];
    localStorage.setItem(config[settings.key], JSON.stringify({ version: 1, [settings.list]: unique }));
    window.dispatchEvent(new CustomEvent(settings.event, { detail: { certification: config.name } }));
  }

  function contains(config, metadata, type = "flags") {
    const key = recordKey(metadata);
    return read(config, type).some(record => recordKey(record) === key);
  }

  function add(config, metadata, type = "flags") {
    if (!config || !metadata || metadata.questionId == null || !metadata.bankPath) return false;
    const settings = typeConfig(type);
    const records = read(config, type);
    if (records.some(record => recordKey(record) === recordKey(metadata))) return false;
    records.push({
      questionId: String(metadata.questionId),
      certification: config.name,
      world: String(metadata.world),
      objective: String(metadata.objective),
      bankPath: metadata.bankPath,
      [settings.date]: new Date().toISOString()
    });
    write(config, records, type);
    return true;
  }

  function remove(config, metadata, type = "flags") {
    if (!config || !metadata) return false;
    const records = read(config, type);
    const key = recordKey(metadata);
    const remaining = records.filter(record => recordKey(record) !== key);
    if (remaining.length === records.length) return false;
    write(config, remaining, type);
    return true;
  }

  function readIncorrectState(config) {
    if (!config) return { version: 1, active: [], recovered: [] };
    try {
      const state = JSON.parse(localStorage.getItem(config.incorrectKey) || "{}");
      return {
        version: 1,
        active: Array.isArray(state.active) ? state.active.filter(record => record && record.questionId != null && record.bankPath) : [],
        recovered: Array.isArray(state.recovered) ? state.recovered.filter(record => record && record.questionId != null && record.bankPath) : []
      };
    } catch (_) {
      return { version: 1, active: [], recovered: [] };
    }
  }

  function writeIncorrectState(config, state) {
    localStorage.setItem(config.incorrectKey, JSON.stringify({ version: 1, active: state.active, recovered: state.recovered }));
    window.dispatchEvent(new CustomEvent("hydra-incorrect-updated", { detail: { certification: config.name } }));
  }

  function incorrectMetadata(config, metadata, missCount) {
    return {
      questionId: String(metadata.questionId),
      certification: config.name,
      world: String(metadata.world),
      objective: String(metadata.objective),
      bankPath: metadata.bankPath,
      missCount,
      recoveryCorrectCount: 0,
      lastMissedAt: new Date().toISOString()
    };
  }

  function recordIncorrect(config, metadata) {
    if (!config || !metadata || metadata.questionId == null || !metadata.bankPath) return null;
    const state = readIncorrectState(config);
    const key = recordKey(metadata);
    const activeIndex = state.active.findIndex(record => recordKey(record) === key);
    const recoveredMatches = state.recovered.filter(record => recordKey(record) === key);
    const priorMisses = activeIndex >= 0
      ? Number(state.active[activeIndex].missCount) || 0
      : recoveredMatches.reduce((highest, record) => Math.max(highest, Number(record.missCount) || 0), 0);
    const record = incorrectMetadata(config, metadata, priorMisses + 1);
    if (activeIndex >= 0) state.active[activeIndex] = record;
    else state.active.push(record);
    writeIncorrectState(config, state);
    return record;
  }

  function manualRemoveIncorrect(config, metadata) {
    if (!config || !metadata) return false;
    const state = readIncorrectState(config);
    const key = recordKey(metadata);
    const remaining = state.active.filter(record => recordKey(record) !== key);
    if (remaining.length === state.active.length) return false;
    state.active = remaining;
    writeIncorrectState(config, state);
    return true;
  }

  function readWeaknessState(config) {
    if (!config) return { version: 1, objectives: {} };
    try {
      const state = JSON.parse(localStorage.getItem(config.weaknessKey) || "{}");
      return { version: 1, objectives: state.objectives && typeof state.objectives === "object" ? state.objectives : {} };
    } catch (_) {
      return { version: 1, objectives: {} };
    }
  }

  function recordObjectiveEvidence(config, metadata, correct) {
    if (!config || !metadata?.objective || !/^[1-5]$/.test(String(metadata.world))) return null;
    const state = readWeaknessState(config);
    const objective = String(metadata.objective);
    let record = state.objectives[objective];
    if (!record) {
      let prior = {};
      try {
        const progress = JSON.parse(localStorage.getItem(config.progressKey) || "{}");
        prior = progress.objectives?.[objective] || {};
      } catch (_) { prior = {}; }
      const attempts = Number(prior.answered) || 0;
      record = {
        world: String(metadata.world),
        attempts,
        correct: Math.min(attempts, Number(prior.bestScore) || 0),
        misses: Math.max(0, attempts - Math.min(attempts, Number(prior.bestScore) || 0))
      };
    }
    record.world = String(metadata.world);
    record.misses = Number.isFinite(Number(record.misses)) ? Number(record.misses) : Math.max(0, (Number(record.attempts) || 0) - (Number(record.correct) || 0));
    record.attempts = (Number(record.attempts) || 0) + 1;
    record.correct = (Number(record.correct) || 0) + (correct ? 1 : 0);
    record.misses += correct ? 0 : 1;
    record.updatedAt = new Date().toISOString();
    state.objectives[objective] = record;
    localStorage.setItem(config.weaknessKey, JSON.stringify(state));
    return record;
  }

  const recoveryCredits = new Map();

  function applyRecoveryAnswer(config, metadata, correct, sessionId) {
    if (!config || !metadata || !sessionId) return null;
    const state = readIncorrectState(config);
    const key = recordKey(metadata);
    const index = state.active.findIndex(record => recordKey(record) === key);
    if (index < 0) return null;
    const record = state.active[index];
    if (!correct) {
      record.recoveryCorrectCount = 0;
      writeIncorrectState(config, state);
      return { status: "reset", recoveryCorrectCount: 0 };
    }
    if (!recoveryCredits.has(sessionId)) recoveryCredits.set(sessionId, new Set());
    const credited = recoveryCredits.get(sessionId);
    if (credited.has(key)) return { status: "unchanged", recoveryCorrectCount: Number(record.recoveryCorrectCount) || 0 };
    credited.add(key);
    record.recoveryCorrectCount = Math.min(2, (Number(record.recoveryCorrectCount) || 0) + 1);
    if (record.recoveryCorrectCount >= 2) {
      state.active.splice(index, 1);
      state.recovered.push({ ...record, recoveryCorrectCount: 2, recoveredAt: new Date().toISOString() });
      writeIncorrectState(config, state);
      return { status: "recovered", recoveryCorrectCount: 2 };
    }
    writeIncorrectState(config, state);
    return { status: "progress", recoveryCorrectCount: record.recoveryCorrectCount };
  }

  const isFlagged = (config, metadata) => contains(config, metadata, "flags");
  const isFavorite = (config, metadata) => contains(config, metadata, "favorites");
  let activeMetadata = null;
  let flagButton = null;
  let favoriteButton = null;

  function updateButtons() {
    if (!activeMetadata) return;
    const config = currentConfig();
    if (!config) return;
    if (flagButton) {
      const flagged = isFlagged(config, activeMetadata);
      flagButton.textContent = flagged ? "🚩 Flagged — Remove Flag" : "🚩 Flag for Review";
      flagButton.classList.toggle("is-flagged", flagged);
      flagButton.setAttribute("aria-pressed", String(flagged));
    }
    if (favoriteButton) {
      const favorite = isFavorite(config, activeMetadata);
      favoriteButton.textContent = favorite ? "⭐ Favorite — Remove Favorite" : "☆ Add to Favorites";
      favoriteButton.classList.toggle("is-favorite", favorite);
      favoriteButton.setAttribute("aria-pressed", String(favorite));
    }
  }

  function makeButton(id, className, type) {
    const button = document.createElement("button");
    button.type = "button";
    button.id = id;
    button.className = className;
    button.addEventListener("click", () => {
      const config = currentConfig();
      if (!config || !activeMetadata) return;
      if (contains(config, activeMetadata, type)) remove(config, activeMetadata, type);
      else add(config, activeMetadata, type);
      updateButtons();
    });
    return button;
  }

  function ensureButtons() {
    if (flagButton?.isConnected && favoriteButton?.isConnected) return;
    const messageBox = document.querySelector(".message-box");
    const submit = document.getElementById("submitBtn");
    if (!messageBox || !submit) return;
    let holder = document.querySelector(".flag-control-row");
    if (!holder) {
      holder = document.createElement("div");
      holder.className = "flag-control-row";
      messageBox.insertBefore(holder, submit);
    }
    flagButton = makeButton("flagQuestionBtn", "flag-question-btn", "flags");
    favoriteButton = makeButton("favoriteQuestionBtn", "favorite-question-btn", "favorites");
    holder.replaceChildren(flagButton, favoriteButton);
  }

  function setCurrentQuestion(metadata) {
    const supported = /^[1-5]$/.test(String(metadata?.world || "")) && metadata?.objective && metadata?.question?.id != null;
    if (!supported) return clearCurrentQuestion();
    activeMetadata = { questionId: String(metadata.question.id), world: String(metadata.world), objective: String(metadata.objective), bankPath: metadata.bankPath };
    ensureButtons();
    updateButtons();
  }

  function clearCurrentQuestion() {
    activeMetadata = null;
    flagButton?.closest(".flag-control-row")?.remove();
    flagButton = null;
    favoriteButton = null;
  }

  window.addEventListener("storage", updateButtons);
  window.HydraFlags = {
    configs: CONFIGS, configFor, currentConfig, read, add, remove, contains,
    isFlagged, isFavorite, recordKey, setCurrentQuestion, clearCurrentQuestion,
    readIncorrectState, recordIncorrect, manualRemoveIncorrect, applyRecoveryAnswer,
    readWeaknessState, recordObjectiveEvidence
  };
}());
