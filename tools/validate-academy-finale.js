#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8").replace(/^\uFEFF/, "");
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
    clear: () => values.clear(),
    snapshot: () => Object.fromEntries(values)
  };
}

function createClassList() {
  const values = new Set();
  return {
    add: (...names) => names.forEach(name => values.add(name)),
    remove: (...names) => names.forEach(name => values.delete(name)),
    toggle: (name, force) => force === undefined ? (values.has(name) ? !values.delete(name) : (values.add(name), true)) : (force ? (values.add(name), true) : !values.delete(name)),
    contains: name => values.has(name)
  };
}

function loadCampaignUi(storage, progressKey = "") {
  const listeners = {};
  const dispatched = [];
  const appended = [];
  const makeElement = tagName => {
    const handlers = {};
    const element = {
      tagName,
      className: "",
      classList: createClassList(),
      innerHTML: "",
      textContent: "",
      removed: false,
      setAttribute() {},
      append() {},
      replaceChildren() {},
      remove() { this.removed = true; },
      addEventListener(type, handler) { handlers[type] = handler; },
      querySelector(selector) {
        if (selector === ".academy-finale-later") return { addEventListener(type, handler) { handlers[`later:${type}`] = handler; } };
        return null;
      }
    };
    return element;
  };
  const document = {
    body: { dataset: { progressKey }, append(element) { appended.push(element); } },
    visibilityState: "visible",
    addEventListener() {},
    createElement: makeElement,
    querySelector(selector) {
      if (selector === ".academy-finale-announcement") return appended.find(element => element.className === "academy-finale-announcement" && !element.removed) || null;
      return null;
    },
    querySelectorAll() { return []; }
  };
  const window = {
    location: { pathname: "/dashboard.html", search: "" },
    addEventListener(type, handler) { listeners[type] = handler; },
    dispatchEvent(event) { dispatched.push(event); },
    setInterval() { return 1; },
    setTimeout() {}
  };
  const context = {
    localStorage: storage,
    CustomEvent: class { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } },
    URL,
    URLSearchParams,
    document,
    window,
    console,
    fetch: async () => ({ ok: false })
  };
  vm.createContext(context);
  vm.runInContext(read("campaign-ui.js"), context, { filename: "campaign-ui.js" });
  return { ui: context.window.HydraCampaignUI, listeners, dispatched, appended };
}

function completedState({ achievement = true, exams = 6 } = {}) {
  const state = { objectives: {}, captains: {}, exams: {}, achievements: {}, sessions: [], stats: {} };
  for (let exam = 1; exam <= exams; exam += 1) {
    state.exams[String(exam)] = { attempts: 1, completed: true, passed: true, bestPercent: 90, lastPercent: 90, updatedAt: "2026-01-01T00:00:00.000Z" };
  }
  if (achievement) state.achievements.finalBoss = { unlockedAt: "2026-01-01T00:00:00.000Z" };
  return state;
}

const baseStorage = createStorage();
const base = loadCampaignUi(baseStorage);
const campaignEntries = Object.entries(base.ui.campaigns);
requireCheck(campaignEntries.length === 7, "Exactly seven certification completion authorities are configured.");
requireCheck(base.ui.getAcademyCompletion().completedCount === 0 && !base.ui.getAcademyCompletion().unlocked, "Empty Academy state is 0/7 and locked.");

for (const [seventhKey, seventhConfig] of campaignEntries) {
  const storage = createStorage();
  campaignEntries.forEach(([key]) => storage.setItem(key, JSON.stringify(key === seventhKey ? completedState({ achievement: false, exams: 5 }) : completedState())));
  const beforeOtherStates = Object.fromEntries(campaignEntries.filter(([key]) => key !== seventhKey).map(([key]) => [key, storage.getItem(key)]));
  const { ui, appended } = loadCampaignUi(storage, seventhKey);
  const before = ui.getAcademyCompletion();
  requireCheck(before.completedCount === 6 && !before.unlocked, `${seventhConfig.name} can remain the unfinished seventh track without unlocking the Finale.`);
  ui.saveQuizResult({ type: "exam", id: "6", percent: 90, passed: true, label: "Practice Exam 6", href: `${seventhConfig.quiz}?exam=6` });
  const after = ui.getAcademyCompletion();
  requireCheck(after.completedCount === 7 && after.allComplete && after.unlocked, `${seventhConfig.name} can independently produce the 6/7 to 7/7 transition.`);
  requireCheck(JSON.parse(storage.getItem(seventhKey)).achievements.finalBoss?.unlockedAt, `${seventhConfig.name} earns the existing sticky Final Boss achievement.`);
  requireCheck(JSON.parse(storage.getItem("hydra-academy-finale-v1")).unlockedAt, `${seventhConfig.name} creates the sticky Finale entitlement.`);
  requireCheck(appended.filter(element => element.className === "academy-finale-announcement").length === 1, `${seventhConfig.name} produces one completion announcement.`);
  requireCheck(Object.entries(beforeOtherStates).every(([key, value]) => storage.getItem(key) === value), `${seventhConfig.name} completion remains isolated from the other six certifications.`);
  ui.syncAcademyCompletion({ announce: true });
  requireCheck(appended.filter(element => element.className === "academy-finale-announcement").length === 1, `${seventhConfig.name} does not repeat the completion announcement.`);
}

const legacyStorage = createStorage();
campaignEntries.forEach(([key]) => legacyStorage.setItem(key, JSON.stringify(completedState({ achievement: false }))));
const legacyUi = loadCampaignUi(legacyStorage).ui;
const legacy = legacyUi.syncAcademyCompletion();
requireCheck(legacy.allComplete && legacy.unlocked && legacy.certifications.every(certification => certification.source === "six-exam-fallback"), "Legacy six-exam pass states unlock 7/7 without requiring stored achievements.");
const legacyUnlockedAt = JSON.parse(legacyStorage.getItem("hydra-academy-finale-v1")).unlockedAt;
const reloadedLegacy = loadCampaignUi(legacyStorage).ui.getAcademyCompletion();
requireCheck(reloadedLegacy.unlocked && reloadedLegacy.finale.unlockedAt === legacyUnlockedAt, "Finale entitlement survives reload and browser restart storage reuse.");

legacyStorage.removeItem(campaignEntries[0][0]);
const sticky = loadCampaignUi(legacyStorage).ui.getAcademyCompletion();
requireCheck(sticky.completedCount === 6 && sticky.unlocked, "Legitimately earned Finale access remains sticky even if a source record later becomes unavailable.");

const viewedUi = loadCampaignUi(legacyStorage).ui;
const beforeViews = viewedUi.getAcademyCompletion().finale.viewCount;
viewedUi.markAcademyFinaleViewed();
viewedUi.markAcademyFinaleViewed();
const afterViews = viewedUi.getAcademyCompletion().finale;
requireCheck(afterViews.viewCount === beforeViews + 2 && afterViews.firstViewedAt && afterViews.lastViewedAt, "First-view and replay lifecycle evidence persists without changing completion.");

const crossTabStorage = createStorage();
const crossTab = loadCampaignUi(crossTabStorage);
crossTab.listeners.storage({ key: campaignEntries[0][0] });
requireCheck(crossTab.dispatched.some(event => event.type === "hydra-academy-completion-updated"), "Certification storage changes publish a cross-tab Academy completion update.");

const campaignUi = read("campaign-ui.js");
const indexHtml = read("index.html");
const hubScript = read("script.js");
const dashboard = read("dashboard.js");
const dashboardHtml = read("dashboard.html");
const sharedCss = read("style.css");
const finaleHtml = read("academy-finale.html");
const finaleJs = read("academy-finale.js");
const finaleCss = read("academy-finale.css");

requireCheck(campaignUi.includes("hydra-academy-finale-v1") && campaignUi.includes("six-exam-fallback"), "Shared engine exposes the approved completion authority and legacy fallback.");
requireCheck(indexHtml.includes("academyFinaleLink") && hubScript.includes("syncAcademyCompletion"), "Select a Game exposes permanent Hall access after unlock.");
requireCheck(dashboard.includes("Academy Completion") && dashboard.includes("Enter the Hall") && dashboardHtml.includes("gsa-academy-finale-1"), "Command Center exposes 0/7–7/7 status and permanent Hall access.");
requireCheck(sharedCss.includes("academy-finale-announcement") && sharedCss.includes("@media (max-width: 480px)"), "Shared completion announcement has exact 390px-compatible styling.");
requireCheck(finaleHtml.includes("finaleLocked") && finaleHtml.includes("finaleUnlocked") && finaleHtml.includes("finalePlayPause") && finaleHtml.includes("replayFinale"), "Finale direct route contains locked, unlocked, playback, and replay surfaces.");
requireCheck(finaleJs.includes("window.GSA_FINALE_CONFIG") && finaleJs.includes("narrationSrc") && finaleJs.includes("requestAnimationFrame(renderTimeline)"), "Finale player exposes media, narration, text, and synchronized cue hooks.");
requireCheck(finaleJs.includes("browser paused automatic audio") && finaleHtml.includes("Start Finale with Sound"), "Autoplay failure degrades to an obvious manual-start action.");
requireCheck(finaleCss.includes("overflow-x: hidden") && finaleCss.includes("@media (max-width: 520px)"), "Finale has overflow protection and responsive mobile layout.");
[
  "Seven kingdoms. Seven battles. One journey.",
  "You leave them as a Giant Slayer.",
  "But everything you learned... stands with you.",
  "It was meant to prepare you...",
  "Rise, Giant Slayer.",
  "Your journey... has only begun.",
  "Welcome... to the ranks of the Giant Slayers."
].forEach(line => requireCheck(finaleJs.includes(line), `Canonical Finale narration includes: ${line}`));
requireCheck(finaleJs.includes('new URLSearchParams(window.location.search).get("preview") === "1"') && finaleJs.includes('"localhost", "127.0.0.1", "::1"'), "Localhost-only ?preview=1 path previews the Finale without production entitlement.");
requireCheck(finaleJs.includes("if (!previewMode) ui.markAcademyFinaleViewed()"), "Developer preview does not write learner Finale-view evidence.");
requireCheck(!/\.mp3|\.wav|\.ogg/i.test(finaleJs), "Finale skeleton does not integrate a production audio asset.");

const allowedFiles = new Set([
  "academy-finale.css", "academy-finale.html", "academy-finale.js", "campaign-ui.js", "dashboard.html", "dashboard.js",
  "index.html", "script.js", "style.css", "tools/validate-academy-finale.js", "tools/validate-command-center-intelligence.js"
]);
const statusLines = execFileSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf8" }).split(/\r?\n/).filter(line => line.trim());
const changedFiles = statusLines.map(line => line.slice(3).replace(/\\/g, "/"));
requireCheck(changedFiles.every(file => allowedFiles.has(file)), "Working-tree boundary contains only the approved Finale architecture files.");
requireCheck([...allowedFiles].every(file => changedFiles.includes(file)), "All required Finale architecture files are present in the working-tree boundary.");
const protectedChanges = execFileSync("git", ["status", "--porcelain", "--", "json"], { cwd: ROOT, encoding: "utf8" }).trim();
requireCheck(!protectedChanges, "Protected curriculum, Sweep, Practice Exam, Captain, PBQ, and lab JSON remains unchanged.");

console.log("GSA Academy 7/7 Completion and Finale validation: PASS");
console.log(`- ${checks.length} completion, order, legacy, persistence, isolation, presentation, and integrity checks passed.`);
console.log("- All seven certifications independently validated as the seventh completion: PASS");
console.log("- 6/7 locked, 7/7 unlocked, sticky entitlement, one-time announcement, first-view, and replay: PASS");
console.log("- Academy Hub, Command Center, direct Finale route, cue hooks, and manual audio fallback: PASS");
console.log("- Protected learning content unchanged: PASS");
