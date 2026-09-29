#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8").replace(/^\uFEFF/, "");
const readJson = file => JSON.parse(read(file));
const checks = [];

function requireCheck(condition, label) {
  if (!condition) throw new Error(label);
  checks.push(label);
}

function createStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    clear: () => values.clear()
  };
}

function loadCampaignUi(storage) {
  const context = {
    localStorage: storage,
    CustomEvent: class { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } },
    URL,
    URLSearchParams,
    document: {
      body: { dataset: {} },
      visibilityState: "visible",
      addEventListener() {},
      querySelector() { return null; },
      querySelectorAll() { return []; }
    },
    window: {
      location: { pathname: "/dashboard.html", search: "" },
      addEventListener() {},
      dispatchEvent() {},
      setInterval() { return 1; },
      setTimeout() {}
    },
    console,
    fetch: async () => ({ ok: false })
  };
  vm.createContext(context);
  vm.runInContext(read("campaign-ui.js"), context, { filename: "campaign-ui.js" });
  return context.window.HydraCampaignUI;
}

function loadExamTimer(storage) {
  const context = { window: {}, localStorage: storage, sessionStorage: createStorage(), console, URLSearchParams };
  vm.createContext(context);
  vm.runInContext(read("practice-exam-timer.js"), context, { filename: "practice-exam-timer.js" });
  return context.window.HydraExamTimer;
}

const storage = createStorage();
const ui = loadCampaignUi(storage);
const timer = loadExamTimer(storage);
const campaigns = ui.campaigns;
const campaignEntries = Object.entries(campaigns);

requireCheck(campaignEntries.length === 7, "Seven certification campaigns are configured.");
const allObjectives = campaignEntries.flatMap(([, config]) => Object.values(config.objectivesByWorld).flat());
requireCheck(allObjectives.length === 187, "All 187 objectives have an authoritative GSA World mapping.");
requireCheck(campaignEntries.every(([, config]) => Object.keys(config.objectivesByWorld).join(",") === "1,2,3,4,5"), "Every certification maps Worlds 1–5 explicitly.");

for (const [key, config] of campaignEntries) {
  const summary = ui.getCampaignSummary(key);
  requireCheck(summary.intelligence.objectiveSweeps.length === Object.values(config.objectivesByWorld).flat().length, `${config.name}: empty-state Objective Sweep rows are complete.`);
  requireCheck(summary.intelligence.objectiveSweeps.every(row => row.diagnostic === "insufficient"), `${config.name}: empty objective evidence is Insufficient Evidence.`);
  requireCheck(summary.intelligence.mixedReview.retainedSessions === 0, `${config.name}: empty World 6 state is safe.`);
  requireCheck(summary.intelligence.bossRush.length === 4, `${config.name}: all four World 7 modes are represented.`);
  requireCheck(summary.intelligence.practiceExams.results.length === 0, `${config.name}: empty Practice Exam state is safe.`);
}

const sampleKey = "hydra-aplus-core1-progress-v1";
storage.setItem(sampleKey, JSON.stringify({
  objectives: {
    "1.1": { world: "1", answered: 10, total: 10, bestScore: 9, complete: true },
    "1.2": { world: "1", answered: 10, total: 10, bestScore: 10, complete: true },
    "1.3": { world: "1", answered: 10, total: 10, bestScore: 4, complete: false },
    "2.1": { world: "2", answered: 10, total: 10, bestScore: 3, complete: false }
  },
  captains: { "boss-rush-1": { attempts: 2, completed: true, passed: true, bestPercent: 90, lastPercent: 86, updatedAt: "2026-01-04T00:00:00Z" } },
  exams: { "1": { attempts: 1, completed: true, passed: false, bestPercent: 60, lastPercent: 60 } },
  sessions: [
    { id: "c1", type: "captain", label: "Boss Rush I", correct: 18, total: 20, answered: 20, percent: 90, passed: true, world: "7", mode: "boss-rush-1", completedAt: "2026-01-04T00:00:00Z" },
    { id: "m1", type: "mixed-review", label: "Mixed Run 25", correct: 20, total: 25, answered: 25, percent: 80, passed: false, world: "6", mode: "mixed-25", completedAt: "2026-01-03T00:00:00Z" },
    { id: "o1", type: "objective-sweep", label: "Objective 1.1", correct: 9, total: 10, answered: 10, percent: 90, passed: true, world: "1", objective: "1.1", completedAt: "2026-01-02T00:00:00Z" }
  ],
  stats: { answered: 55, correct: 47, domains: { "1": { answered: 55, correct: 47 } } },
  achievements: {}
}));
storage.setItem("hydra-aplus-core1-weakness-v1", JSON.stringify({ version: 1, objectives: {
  "1.1": { world: "1", attempts: 4, correct: 4, misses: 0 },
  "1.2": { world: "1", attempts: 5, correct: 5, misses: 0 },
  "1.3": { world: "1", attempts: 5, correct: 2, misses: 3 },
  "2.1": { world: "2", attempts: 5, correct: 2, misses: 3 }
} }));
storage.setItem("hydra-practice-result:aplus-core1:exam-1", JSON.stringify({
  version: 1, certificationId: "aplus-core1", exam: "1", correct: 10, total: 20, percent: 50, passed: false, readinessThreshold: 85,
  domains: [{ id: "1", label: "Mobile Devices", correct: 10, total: 20, percent: 50 }],
  objectives: [
    { id: "1.1", domain: "1", correct: 4, total: 4, percent: 100 },
    { id: "1.2", domain: "1", correct: 2, total: 5, percent: 40 },
    { id: "1.3", domain: "1", correct: 5, total: 5, percent: 100 },
    { id: "2.1", domain: "2", correct: 1, total: 5, percent: 20 }
  ]
}));
storage.setItem("hydra-practice-result:aplus-core1:exam-2", JSON.stringify({
  version: 1, certificationId: "aplus-core1", exam: "2", correct: 8, total: 10, percent: 80, passed: false, readinessThreshold: 85,
  domains: [{ id: "1", label: "Mobile Devices", correct: 8, total: 10, percent: 80 }]
}));

const partial = ui.getCampaignSummary(sampleKey);
const byObjective = Object.fromEntries(partial.intelligence.objectiveSweeps.map(row => [row.objective, row]));
requireCheck(byObjective["1.1"].mastered && byObjective["1.1"].diagnostic === "insufficient", "Sticky mastery remains independent when Sweep diagnostic evidence is below five samples.");
requireCheck(byObjective["1.2"].diagnostic === "strong" && byObjective["1.3"].diagnostic === "needs-work", "Sweep diagnostics use five samples and the existing 85% threshold.");
requireCheck(partial.intelligence.mixedReview.retainedSessions === 1, "World 6 Mixed Review evidence remains separate.");
requireCheck(partial.intelligence.bossRush[0].attempts === 2 && partial.intelligence.bossRush[0].passed, "World 7 Boss Rush evidence remains separate.");
requireCheck(partial.intelligence.practiceExams.legacyResults === 1, "Legacy domain-only Practice Exam results remain compatible.");
const practiceByObjective = Object.fromEntries(partial.intelligence.practiceExams.objectives.map(row => [row.id, row]));
requireCheck(practiceByObjective["1.1"].diagnostic === "insufficient" && practiceByObjective["1.2"].diagnostic === "needs-work", "Practice Exam objective diagnostics enforce the five-sample minimum.");
requireCheck(partial.intelligence.priorityReview.applicationGap.length === 1, "Priority Review identifies an Application Gap only with five samples from both sources.");
requireCheck(partial.intelligence.priorityReview.improvingTransfer.length === 1, "Priority Review identifies Improving Transfer only with sufficient evidence.");
requireCheck(partial.intelligence.priorityReview.confirmed.length === 1, "Priority Review identifies Confirmed Priority only with sufficient evidence.");
requireCheck(partial.intelligence.priorityReview.insufficientEvidence.some(row => row.sweep.objective === "1.1"), "Priority Review keeps small samples in Insufficient Evidence.");
requireCheck(ui.getCampaignSummary("hydra-aplus-core2-progress-v1").intelligence.practiceExams.results.length === 0, "Certification storage remains isolated.");

const completeKey = "hydra-aplus-core2-progress-v1";
const completeConfig = campaigns[completeKey];
const completeObjectives = Object.values(completeConfig.objectivesByWorld).flat();
storage.setItem(completeKey, JSON.stringify({
  objectives: Object.fromEntries(Object.entries(completeConfig.objectivesByWorld).flatMap(([world, objectives]) => objectives.map(objective => [objective, { world, answered: 5, total: 5, bestScore: 5, complete: true }]))),
  captains: {}, exams: {}, sessions: [], stats: {}, achievements: {}
}));
storage.setItem("hydra-aplus-core2-weakness-v1", JSON.stringify({ version: 1, objectives: Object.fromEntries(Object.entries(completeConfig.objectivesByWorld).flatMap(([world, objectives]) => objectives.map(objective => [objective, { world, attempts: 5, correct: 5, misses: 0 }]))) }));
storage.setItem("hydra-practice-result:aplus-core2:exam-1", JSON.stringify({
  version: 1, certificationId: "aplus-core2", exam: "1", correct: completeObjectives.length * 5, total: completeObjectives.length * 5, percent: 100, passed: true, readinessThreshold: 85,
  domains: Object.keys(completeConfig.domains).map(id => ({ id, label: completeConfig.domains[id], correct: 5, total: 5, percent: 100 })),
  objectives: completeObjectives.map(id => ({ id, domain: id.split(".")[0], correct: 5, total: 5, percent: 100 }))
}));
const complete = ui.getCampaignSummary(completeKey);
requireCheck(complete.intelligence.objectiveSweeps.every(row => row.mastered && row.diagnostic === "strong"), "Complete-state Sweep mastery remains sticky and diagnostics are evidence-based.");
requireCheck(complete.intelligence.practiceExams.objectives.every(row => row.diagnostic === "strong"), "Complete-state Practice Exam objective evidence is classified with sufficient samples.");
requireCheck(complete.intelligence.priorityReview.confirmed.length === 0 && complete.intelligence.priorityReview.applicationGap.length === 0 && complete.intelligence.priorityReview.improvingTransfer.length === 0, "Complete strong evidence does not create false Priority Review findings.");

const performance = timer.calculatePerformance(
  { id: "test", name: "Test", exam: "1", domains: { "1": "Domain One" } },
  {
    questions: Array.from({ length: 6 }, (_, index) => ({ id: `q${index + 1}`, domain: "1", objective: index < 5 ? "1.1" : "1.2" })),
    responses: Array.from({ length: 6 }, (_, index) => ({ id: `q${index + 1}`, domain: "1", objective: index < 5 ? "1.1" : "1.2", correct: index !== 4 }))
  }
);
requireCheck(performance.objectives.length === 2 && performance.objectives[0].correct === 4 && performance.objectives[0].total === 5, "Shared Practice Exam results persist correct objective rollups.");

const examDirectories = {
  "network-plus": "json/final-dungeon",
  "aplus-core1": "json/aplus-core1/final-dungeon",
  "aplus-core2": "json/aplus-core2/final-dungeon",
  "security-plus": "json/security-plus/final-dungeon",
  "cloud-plus": "json/cloud-plus/final-dungeon",
  "linux-essentials": "json/linux-essentials/final-dungeon",
  "aws-cloud-practitioner": "json/aws-cloud-practitioner/final-dungeon"
};
let questionCount = 0;
let examCount = 0;
for (const [, config] of campaignEntries) {
  const expected = new Set(Object.values(config.objectivesByWorld).flat());
  for (let exam = 1; exam <= 6; exam += 1) {
    const questions = readJson(`${examDirectories[config.id]}/practice-exam-${exam}.json`);
    const represented = new Set();
    questions.forEach(question => {
      questionCount += 1;
      requireCheck(expected.has(String(question.objective)), `${config.name} Exam ${exam}: ${question.id} maps to a known objective.`);
      requireCheck(String(question.domain) === String(question.objective).split(".")[0], `${config.name} Exam ${exam}: ${question.id} domain/objective mapping aligns.`);
      represented.add(String(question.objective));
    });
    requireCheck(represented.size === expected.size && [...expected].every(id => represented.has(id)), `${config.name} Exam ${exam} represents every certification objective.`);
    examCount += 1;
  }
}
requireCheck(examCount === 42 && questionCount === 3330, "All 42 Practice Exams and 3,330 objective mappings are covered.");

const dashboard = read("dashboard.js");
const dashboardHtml = read("dashboard.html");
const css = read("style.css");
[
  "Objective Sweep Intelligence", "World 6 — Mixed Review", "World 7 — Boss Rush",
  "Practice Exam Intelligence", "Priority Review", "Overall Recorded Quiz Activity",
  "Confirmed Priority", "Application Gap", "Improving Transfer", "Insufficient Evidence"
].forEach(label => requireCheck(dashboard.includes(label), `Command Center renders ${label}.`));
requireCheck(dashboard.includes("Five answered questions") && dashboard.includes("Fewer than five questions"), "Command Center explains the five-sample diagnostic-confidence rule.");
requireCheck(dashboardHtml.includes("campaign-ui.js?v=gsa-academy-finale-1") && dashboardHtml.includes("dashboard.js?v=gsa-academy-finale-1"), "Command Center assets are cache-versioned.");
requireCheck(css.includes("@media (max-width: 480px)") && css.includes(".dashboard-priority-grid"), "Command Center intelligence has responsive mobile styling.");

const quizPages = ["aplus-core1-quiz.html", "aplus-core2-quiz.html", "hydra-quiz.html", "security-plus-quiz.html", "cloud-plus-quiz.html", "linux-essentials-quiz.html", "aws-cloud-practitioner-quiz.html"];
quizPages.forEach(page => requireCheck(read(page).includes("practice-exam-timer.js?v=gsa-command-intelligence-1"), `${page} loads the versioned objective-rollup engine.`));

const protectedChanges = execFileSync("git", ["diff", "--name-only", "--", ":(glob)**/*-hatchling.json", ":(glob)**/practice-exam-*.json"], { cwd: ROOT, encoding: "utf8" }).trim();
requireCheck(!protectedChanges, "Protected Objective Sweep and Practice Exam banks remain unchanged.");

console.log("GSA Command Center Training Intelligence validation: PASS");
console.log(`- ${checks.length} architecture, mapping, compatibility, isolation, and presentation checks passed.`);
console.log("- Seven certifications, 187 objectives, 42 Practice Exams, and 3,330 question mappings: PASS");
console.log("- Five-sample diagnostic confidence and sticky mastery independence: PASS");
console.log("- Empty, partial, legacy, complete-compatible, and certification-isolated states: PASS");
console.log("- Protected Sweep and Practice Exam banks unchanged: PASS");
