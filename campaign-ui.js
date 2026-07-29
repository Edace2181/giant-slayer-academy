(function () {
  "use strict";

  const clamp = value => Math.max(0, Math.min(100, Math.round(value || 0)));

  const CAMPAIGNS = {
    "hydra-network-plus-progress-v1": {
      name: "Network+", campaign: "network-campaign.html", totalQuestions: 467,
      objectiveCounts: [8, 4, 5, 3, 5],
      domains: { "1": "Networking Concepts", "2": "Network Implementation", "3": "Network Operations", "4": "Network Security", "5": "Network Troubleshooting" }
    },
    "hydra-aplus-core1-progress-v1": {
      name: "A+ Core 1", campaign: "aplus-core1-campaign.html", totalQuestions: 455,
      objectiveCounts: [3, 8, 8, 2, 6],
      domains: { "1": "Mobile Devices", "2": "Networking", "3": "Hardware", "4": "Virtualization and Cloud", "5": "Hardware and Network Troubleshooting" }
    },
    "hydra-aplus-core2-progress-v1": {
      name: "A+ Core 2", campaign: "aplus-core2-campaign.html", totalQuestions: 795,
      objectiveCounts: [11, 11, 4, 5, 5],
      domains: { "1": "Operating Systems", "2": "Security", "3": "Software Troubleshooting", "4": "Operational Procedures" }
    },
    "hydra-security-plus-progress-v1": {
      name: "Security+", campaign: "security-plus-campaign.html", totalQuestions: 797,
      objectiveCounts: [4, 5, 4, 9, 6],
      domains: { "1": "General Security Concepts", "2": "Threats, Vulnerabilities, and Mitigations", "3": "Security Architecture", "4": "Security Operations", "5": "Security Program Management and Oversight" }
    },
    "hydra-linux-essentials-progress-v1": {
      name: "Linux Essentials", campaign: "linux-essentials-campaign.html", totalQuestions: 235,
      objectiveCounts: [4, 4, 3, 4, 4],
      domains: { "1": "Linux Community and Open Source", "2": "Finding Your Way on Linux", "3": "Power of the Command Line", "4": "The Linux Operating System", "5": "Security and File Permissions" }
    },
    "hydra-aws-cloud-practitioner-progress-v1": {
      name: "AWS Cloud Practitioner", campaign: "aws-cloud-practitioner-campaign.html", totalQuestions: 261,
      objectiveCounts: [4, 4, 4, 4, 3],
      domains: { "1": "Cloud Concepts", "2": "Security and Compliance", "3": "Cloud Technology and Services", "4": "Billing, Pricing, and Support" }
    }
  };

  const ACHIEVEMENTS = {
    firstObjective: { icon: "🏅", name: "First Objective Mastered" },
    firstWorld: { icon: "🛡️", name: "First World Completed" },
    certificationChampion: { icon: "🏆", name: "Certification Champion" },
    hydraSlayer: { icon: "🐉", name: "Hydra Slayer" },
    finalBoss: { icon: "👑", name: "Final Boss Defeated" }
  };

  function ProgressBar(percent, label) {
    const value = clamp(percent);
    const wrapper = document.createElement("div");
    wrapper.className = "campaign-progress";
    wrapper.setAttribute("role", "progressbar");
    wrapper.setAttribute("aria-label", label);
    wrapper.setAttribute("aria-valuemin", "0");
    wrapper.setAttribute("aria-valuemax", "100");
    wrapper.setAttribute("aria-valuenow", String(value));
    wrapper.innerHTML = `<span class="campaign-progress-fill" style="width:${value}%"></span>`;
    return wrapper;
  }

  function CompletionBadge(percent) {
    const value = clamp(percent);
    const badge = document.createElement("span");
    badge.className = `completion-badge${value === 100 ? " complete" : ""}`;
    badge.textContent = value === 100 ? "✓ Complete" : `${value}% Complete`;
    return badge;
  }

  function CampaignStats(element) {
    const stats = [
      [element.dataset.unitLabel || "Topics", element.dataset.topics],
      ["Objectives", element.dataset.objectives],
      ["Objective Sweep Banks", element.dataset.banks],
      ["Recognition Questions", element.dataset.questions]
    ];
    element.classList.add("campaign-stats");
    element.innerHTML = stats.map(([label, value]) =>
      `<div class="campaign-stat"><strong>${value}</strong><span>${label}</span></div>`
    ).join("");
  }

  function pageProgressKey() {
    if (document.body.dataset.progressKey) return document.body.dataset.progressKey;
    const page = window.location.pathname.toLowerCase();
    if (page.includes("aplus-core1-")) return "hydra-aplus-core1-progress-v1";
    if (page.includes("aplus-core2-")) return "hydra-aplus-core2-progress-v1";
    if (page.includes("security-plus-")) return "hydra-security-plus-progress-v1";
    if (page.includes("network-world")) return "hydra-network-plus-progress-v1";
    if (page.includes("linux-essentials-")) return "hydra-linux-essentials-progress-v1";
    if (page.includes("aws-cloud-practitioner-")) return "hydra-aws-cloud-practitioner-progress-v1";
    return "";
  }

  function progressStore(explicitKey = "") {
    const key = explicitKey || pageProgressKey();
    if (!key) return { key: "", state: normalizeState({}) };
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "{}");
      return { key, state: normalizeState(parsed) };
    } catch (_) {
      return { key, state: normalizeState({}) };
    }
  }

  function normalizeState(state) {
    const stats = state.stats || {};
    return {
      ...state,
      objectives: state.objectives || {},
      captains: state.captains || {},
      exams: state.exams || {},
      achievements: state.achievements || {},
      sessions: Array.isArray(state.sessions) ? state.sessions.filter(session => session && session.id && session.completedAt).slice(0, 100) : [],
      stats: {
        answered: Number(stats.answered) || 0,
        correct: Number(stats.correct) || 0,
        currentStreak: Number(stats.currentStreak) || 0,
        bestStreak: Number(stats.bestStreak) || 0,
        studySeconds: Math.max(0, Number(stats.studySeconds) || 0),
        domains: stats.domains || {}
      },
      currentMission: state.currentMission || null
    };
  }

  function saveState(key, state) {
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("hydra-progress-updated"));
  }

  const STUDY_IDLE_LIMIT_MS = 5 * 60 * 1000;
  const STUDY_TICK_MS = 15 * 1000;
  const STUDY_FLUSH_SECONDS = 30;
  let studyLastActivity = Date.now();
  let studyLastTick = Date.now();
  let pendingStudySeconds = 0;
  let studyTimer = null;

  function reviewProgressKey() {
    if (!window.location.pathname.toLowerCase().endsWith("review-hub.html")) return "";
    const certification = new URLSearchParams(window.location.search).get("cert");
    const keys = {
      "network-plus": "hydra-network-plus-progress-v1",
      "aplus-core1": "hydra-aplus-core1-progress-v1",
      "aplus-core2": "hydra-aplus-core2-progress-v1",
      "security-plus": "hydra-security-plus-progress-v1",
      "linux-essentials": "hydra-linux-essentials-progress-v1",
      "aws-cloud-practitioner": "hydra-aws-cloud-practitioner-progress-v1"
    };
    return keys[certification] || "";
  }

  function studyProgressKey() {
    return document.body.dataset.progressKey || reviewProgressKey() || pageProgressKey();
  }

  function isStudySurface() {
    const page = window.location.pathname.split("/").pop().toLowerCase();
    return page.includes("quiz") || page === "review-hub.html";
  }

  function markStudyActivity() {
    const now = Date.now();
    if (now - studyLastActivity > STUDY_IDLE_LIMIT_MS) studyLastTick = now;
    studyLastActivity = now;
  }

  function accumulateStudyTime(includeVisibleInterval = false) {
    const now = Date.now();
    const elapsed = Math.max(0, Math.min(STUDY_TICK_MS * 2, now - studyLastTick));
    const active = now - studyLastActivity <= STUDY_IDLE_LIMIT_MS;
    if (active && (includeVisibleInterval || document.visibilityState === "visible")) {
      pendingStudySeconds += elapsed / 1000;
    }
    studyLastTick = now;
  }

  function flushStudyTime() {
    const wholeSeconds = Math.floor(pendingStudySeconds);
    if (wholeSeconds < 1) return;
    const key = studyProgressKey();
    if (!key || !CAMPAIGNS[key]) return;
    let parsed = {};
    try { parsed = JSON.parse(localStorage.getItem(key) || "{}"); } catch (_) { parsed = {}; }
    const state = normalizeState(parsed);
    state.stats.studySeconds += wholeSeconds;
    pendingStudySeconds -= wholeSeconds;
    saveState(key, state);
  }

  function studyTick() {
    accumulateStudyTime();
    if (pendingStudySeconds >= STUDY_FLUSH_SECONDS) flushStudyTime();
  }

  function startStudyTimer() {
    if (!isStudySurface() || !studyProgressKey() || studyTimer) return;
    ["pointerdown", "keydown", "touchstart", "input", "change", "scroll"].forEach(eventName => {
      window.addEventListener(eventName, markStudyActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        accumulateStudyTime(true);
        flushStudyTime();
      } else {
        studyLastTick = Date.now();
        markStudyActivity();
      }
    });
    window.addEventListener("pagehide", () => {
      accumulateStudyTime(true);
      flushStudyTime();
    });
    studyTimer = window.setInterval(studyTick, STUDY_TICK_MS);
  }

  function masteredWorlds(state, config) {
    if (!config) return [];
    return config.objectiveCounts.map((required, index) => {
      const world = String(index + 1);
      const mastered = Object.values(state.objectives).filter(record => record.complete && String(record.world) === world).length;
      return mastered >= required;
    });
  }

  function evaluateAchievements(state, key) {
    const config = CAMPAIGNS[key];
    if (!config) return [];
    const unlocked = [];
    const unlock = id => {
      if (!state.achievements[id]) {
        state.achievements[id] = { unlockedAt: new Date().toISOString() };
        unlocked.push({ id, ...ACHIEVEMENTS[id] });
      }
    };
    const masteredObjectives = Object.values(state.objectives).filter(record => record.complete).length;
    if (masteredObjectives >= 1) unlock("firstObjective");
    if (masteredWorlds(state, config).some(Boolean)) unlock("firstWorld");
    if (masteredObjectives >= config.objectiveCounts.reduce((sum, count) => sum + count, 0)) unlock("certificationChampion");
    if (["boss-rush-1", "boss-rush-2", "weakness-captains", "final-captain-rush"].every(mode => state.captains[mode]?.passed)) unlock("hydraSlayer");
    if (["1", "2", "3", "4", "5", "6"].every(exam => state.exams[exam]?.passed)) unlock("finalBoss");
    return unlocked;
  }

  function announceAchievements(unlocked) {
    if (!unlocked.length) return;
    window.dispatchEvent(new CustomEvent("hydra-achievements-unlocked", { detail: unlocked }));
  }

  function recordAnswer({ question, correct, world, objective, mode, exam }) {
    const { key, state } = progressStore();
    if (!key) return;
    const domain = String(question?.domain || objective?.split(".")[0] || world || "Unknown");
    const domainStats = state.stats.domains[domain] || { answered: 0, correct: 0 };
    state.stats.answered += 1;
    state.stats.correct += correct ? 1 : 0;
    state.stats.currentStreak = correct ? state.stats.currentStreak + 1 : 0;
    state.stats.bestStreak = Math.max(state.stats.bestStreak, state.stats.currentStreak);
    domainStats.answered += 1;
    domainStats.correct += correct ? 1 : 0;
    state.stats.domains[domain] = domainStats;
    const label = exam ? `Practice Exam ${exam}` : world === "7" ? mode : objective ? `Objective ${objective}` : mode || `World ${world}`;
    state.currentMission = { label, href: `${window.location.pathname.split("/").pop()}${window.location.search}`, updatedAt: new Date().toISOString() };
    saveState(key, state);
  }

  function saveQuizResult({ type, id, percent, passed, label, href }) {
    const { key, state } = progressStore();
    if (!key || !id || !["captain", "exam"].includes(type)) return [];
    const collection = type === "captain" ? state.captains : state.exams;
    const prior = collection[id] || {};
    collection[id] = {
      attempts: (Number(prior.attempts) || 0) + 1,
      completed: true,
      passed: Boolean(prior.passed || passed),
      bestPercent: Math.max(Number(prior.bestPercent) || 0, Number(percent) || 0),
      lastPercent: Number(percent) || 0,
      updatedAt: new Date().toISOString()
    };
    state.currentMission = { label, href, updatedAt: new Date().toISOString() };
    const unlocked = evaluateAchievements(state, key);
    saveState(key, state);
    announceAchievements(unlocked);
    return unlocked;
  }

  function recordSession({
    type,
    label,
    correct = 0,
    total = 0,
    answered = total,
    percent = null,
    passed = false,
    studyOnly = false,
    world = "",
    objective = "",
    mode = "",
    exam = "",
    reviewType = "",
    href = "",
    progressKey = ""
  }) {
    const { key, state } = progressStore(progressKey);
    if (!key || !type || !label) return null;
    const safeTotal = Math.max(0, Number(total) || 0);
    const safeAnswered = Math.max(0, Math.min(safeTotal || Number(answered) || 0, Number(answered) || 0));
    const safeCorrect = Math.max(0, Math.min(safeAnswered || safeTotal, Number(correct) || 0));
    const calculatedPercent = safeAnswered
      ? Math.round((safeCorrect / safeAnswered) * 100)
      : 0;
    const completedAt = new Date().toISOString();
    const session = {
      id: `${completedAt}-${Math.random().toString(36).slice(2, 10)}`,
      type: String(type),
      label: String(label),
      correct: safeCorrect,
      total: safeTotal,
      answered: safeAnswered,
      percent: percent == null ? calculatedPercent : clamp(Number(percent)),
      passed: Boolean(passed),
      studyOnly: Boolean(studyOnly),
      world: String(world || ""),
      objective: String(objective || ""),
      mode: String(mode || ""),
      exam: String(exam || ""),
      reviewType: String(reviewType || ""),
      href: String(href || ""),
      completedAt
    };
    state.sessions.unshift(session);
    state.sessions = state.sessions.slice(0, 100);
    saveState(key, state);
    return session;
  }

  function getSessionHistory(key) {
    const config = CAMPAIGNS[key];
    if (!config) return [];
    let parsed = {};
    try { parsed = JSON.parse(localStorage.getItem(key) || "{}"); } catch (_) { parsed = {}; }
    return normalizeState(parsed).sessions;
  }

  function attemptedPercent(record, total) {
    if (!record || !total) return 0;
    if (record.complete) return 100;
    return clamp((Number(record.answered) / Number(total)) * 100);
  }

  function ObjectiveCard(card, state) {
    const objective = card.dataset.objective;
    const title = card.dataset.title;
    const weight = card.dataset.weight;
    const questionCount = Number(card.dataset.questions);
    const record = state.objectives[objective];
    const percent = attemptedPercent(record, questionCount);
    card.classList.add("objective-card");
    card.replaceChildren();

    const heading = document.createElement("span");
    heading.className = "objective-number";
    heading.textContent = `Objective ${objective}`;
    const name = document.createElement("span");
    name.className = "objective-card-title";
    name.textContent = title;
    const weightLine = document.createElement("span");
    weightLine.className = "objective-weight";
    weightLine.textContent = weight ? `Official LPI Objective Weight: ${weight}` : "";
    const countLine = document.createElement("span");
    countLine.className = "objective-question-count";
    countLine.textContent = `${questionCount} recognition questions`;

    const attemptedLabel = document.createElement("span");
    attemptedLabel.className = "objective-attempted-label";
    attemptedLabel.textContent = `Questions Attempted: ${percent}%`;
    const masteryBadge = document.createElement("span");
    masteryBadge.className = `completion-badge${record?.complete ? " complete" : ""}`;
    masteryBadge.textContent = record?.complete ? "✓ Mastered" : "Not Yet Mastered";
    card.classList.toggle("objective-mastered", Boolean(record?.complete));
    const attemptBar = ProgressBar(percent, `Objective ${objective} questions attempted`);
    attemptBar.classList.add("attempt-progress");

    card.append(heading, name);
    if (weight) card.append(weightLine);
    card.append(countLine, attemptedLabel, attemptBar, masteryBadge);
  }

  function worldProgress(state, world, totalQuestions) {
    const records = Object.entries(state.objectives).filter(([objective]) => objective.startsWith(`${world}.`));
    const masteredQuestions = records.reduce((sum, [, record]) =>
      sum + (record.complete ? Number(record.total) || 0 : 0), 0);
    return totalQuestions ? clamp((masteredQuestions / totalQuestions) * 100) : 0;
  }

  function questionBankPath(world, objective) {
    const page = window.location.pathname.toLowerCase();
    if (page.includes("aplus-core1-")) return `json/aplus-core1/world${world}/${objective}-hatchling.json`;
    if (page.includes("aplus-core2-")) return `json/aplus-core2/world${world}/${objective}-hatchling.json`;
    if (page.includes("security-plus-")) return `json/security-plus/world${world}/${objective}-hatchling.json`;
    if (page.includes("aws-cloud-practitioner-")) return `json/aws-cloud-practitioner/world${world}/${objective}-hatchling.json`;
    if (page.includes("network-world")) return `json/world${world}/${objective}-hatchling.json`;
    return "";
  }

  async function prepareObjectiveSelection() {
    const cards = Array.from(document.querySelectorAll(".mode-card[href*='objective=']"));
    if (!cards.length) return;

    await Promise.all(cards.map(async card => {
      const href = new URL(card.getAttribute("href"), window.location.href);
      const objective = href.searchParams.get("objective");
      const world = href.searchParams.get("world");
      if (!objective || !world) return;

      card.dataset.objective = objective;
      if (!card.dataset.title) {
        const rawTitle = card.textContent.replace(/\s+/g, " ").trim();
        card.dataset.title = rawTitle
          .replace(new RegExp(`^Objective\\s+${objective}\\s*`, "i"), "")
          .replace(new RegExp(`^${objective}\\s*`, "i"), "") || `Objective ${objective}`;
      }

      if (!card.dataset.questions) {
        const bankPath = questionBankPath(world, objective);
        if (!bankPath) return;
        try {
          const response = await fetch(bankPath);
          if (!response.ok) return;
          const payload = await response.json();
          const questions = Array.isArray(payload) ? payload : payload.questions;
          if (Array.isArray(questions)) card.dataset.questions = String(questions.length);
        } catch (_) {
          // Quiz loading remains authoritative; a progress decoration failure is non-fatal.
        }
      }
    }));

    const firstHref = new URL(cards[0].getAttribute("href"), window.location.href);
    const world = firstHref.searchParams.get("world");
    const total = cards.reduce((sum, card) => sum + (Number(card.dataset.questions) || 0), 0);
    const grid = cards[0].closest(".mode-grid");
    if (world && total && grid && !document.querySelector("[data-world-progress]")) {
      const summary = document.createElement("div");
      summary.dataset.worldProgress = world;
      summary.dataset.questions = String(total);
      summary.setAttribute("aria-label", `World ${world} completion`);
      grid.before(summary);
    }
  }

  function renderWorldProgress(element, state) {
    const world = element.dataset.worldProgress;
    const total = Number(element.dataset.questions);
    const percent = worldProgress(state, world, total);
    element.classList.add("world-progress-summary");
    element.replaceChildren(CompletionBadge(percent), ProgressBar(percent, `World ${world} completion`));
  }

  function renderOverall(element, state) {
    const total = Number(element.dataset.questions);
    const masteredQuestions = Object.values(state.objectives).reduce((sum, record) =>
      sum + (record.complete ? Number(record.total) || 0 : 0), 0);
    const percent = total ? clamp((masteredQuestions / total) * 100) : 0;
    element.classList.add("overall-progress-summary");
    const heading = document.createElement("div");
    heading.className = "progress-heading";
    heading.textContent = `Objective Sweep Progress: ${percent}%`;
    const campaignName = CAMPAIGNS[pageProgressKey()]?.name || "Certification";
    element.replaceChildren(heading, ProgressBar(percent, `${campaignName} Objective Sweep completion`), CompletionBadge(percent));
  }

  function render() {
    const { state } = progressStore();
    document.querySelectorAll("[data-campaign-stats]").forEach(CampaignStats);
    document.querySelectorAll(".mode-card[data-objective]").forEach(card => ObjectiveCard(card, state));
    document.querySelectorAll("[data-world-progress]").forEach(element => renderWorldProgress(element, state));
    document.querySelectorAll("[data-overall-progress]").forEach(element => renderOverall(element, state));
  }

  function saveObjectiveProgress({ objective, world, answered, total, score, complete }) {
    const { key, state } = progressStore();
    if (!key || !objective || !/^[1-5]$/.test(String(world))) return;
    const prior = state.objectives[objective] || {};
    state.objectives[objective] = {
      world: String(world),
      answered: Math.max(Number(prior.answered) || 0, Number(answered) || 0),
      total: Number(total) || Number(prior.total) || 0,
      bestScore: Math.max(Number(prior.bestScore) || 0, Number(score) || 0),
      complete: Boolean(prior.complete || complete)
    };
    const unlocked = evaluateAchievements(state, key);
    saveState(key, state);
    announceAchievements(unlocked);
    return unlocked;
  }

  function domainRanking(state, config) {
    const rows = Object.entries(state.stats.domains)
      .filter(([, record]) => Number(record.answered) > 0)
      .map(([id, record]) => ({
        id,
        name: config?.domains[id] || `Domain ${id}`,
        answered: Number(record.answered) || 0,
        accuracy: Math.round(((Number(record.correct) || 0) / Number(record.answered)) * 100)
      }))
      .sort((a, b) => b.accuracy - a.accuracy || b.answered - a.answered || a.name.localeCompare(b.name));
    return { strongest: rows[0] || null, weakest: rows.length ? rows[rows.length - 1] : null };
  }

  function getCampaignSummary(key) {
    const config = CAMPAIGNS[key];
    if (!config) return null;
    let parsed = {};
    try { parsed = JSON.parse(localStorage.getItem(key) || "{}"); } catch (_) { parsed = {}; }
    const state = normalizeState(parsed);
    const retroactive = evaluateAchievements(state, key);
    if (retroactive.length) localStorage.setItem(key, JSON.stringify(state));
    const objectiveRecords = Object.values(state.objectives);
    const masteredObjectives = objectiveRecords.filter(record => record.complete).length;
    const masteredQuestions = objectiveRecords.reduce((sum, record) => sum + (record.complete ? Number(record.total) || 0 : 0), 0);
    const worlds = masteredWorlds(state, config);
    const completedExams = Object.values(state.exams).filter(record => record.completed).length;
    const passedExams = Object.values(state.exams).filter(record => record.passed).length;
    const ranking = domainRanking(state, config);
    return {
      key,
      config,
      state,
      totalObjectives: config.objectiveCounts.reduce((sum, count) => sum + count, 0),
      masteredObjectives,
      masteredQuestions,
      masteryPercent: clamp((masteredQuestions / config.totalQuestions) * 100),
      questionsAnswered: state.stats.answered,
      correctAnswers: state.stats.correct,
      accuracy: state.stats.answered ? Math.round((state.stats.correct / state.stats.answered) * 100) : 0,
      currentStreak: state.stats.currentStreak,
      bestStreak: state.stats.bestStreak,
      studySeconds: state.stats.studySeconds,
      worldsCompleted: worlds.filter(Boolean).length,
      completedExams,
      passedExams,
      achievements: Object.keys(ACHIEVEMENTS).filter(id => state.achievements[id]).map(id => ({ id, ...ACHIEVEMENTS[id], ...state.achievements[id] })),
      strongestDomain: ranking.strongest,
      weakestDomain: ranking.weakest,
      finalBossesDefeated: state.achievements.finalBoss ? 1 : 0,
      currentMission: state.currentMission
    };
  }

  function showAchievementToast(event) {
    const unlocked = event.detail || [];
    if (!unlocked.length) return;
    document.querySelector(".achievement-toast")?.remove();
    const toast = document.createElement("aside");
    toast.className = "achievement-toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = `<strong>Achievement Unlocked!</strong>${unlocked.map(item => `<span>${item.icon} ${item.name}</span>`).join("")}`;
    document.body.append(toast);
    window.setTimeout(() => toast.remove(), 6000);
  }

  async function initialize() {
    await prepareObjectiveSelection();
    render();
    startStudyTimer();
  }

  window.HydraCampaignUI = {
    CampaignStats, ObjectiveCard, ProgressBar, CompletionBadge,
    saveObjectiveProgress, recordAnswer, saveQuizResult, recordSession, getSessionHistory, getCampaignSummary,
    campaigns: CAMPAIGNS, achievements: ACHIEVEMENTS, render
  };
  document.addEventListener("DOMContentLoaded", initialize);
  window.addEventListener("hydra-progress-updated", render);
  window.addEventListener("storage", render);
  window.addEventListener("hydra-achievements-unlocked", showAchievementToast);
}());
