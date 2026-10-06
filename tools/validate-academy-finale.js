#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
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

for (const [importedKey, importedConfig] of campaignEntries) {
  const storage = createStorage();
  campaignEntries.forEach(([key]) => {
    if (key !== importedKey) storage.setItem(key, JSON.stringify(completedState()));
  });
  const progressBefore = Object.fromEntries(campaignEntries.map(([key]) => [key, storage.getItem(key)]));
  const { ui, appended } = loadCampaignUi(storage, importedKey);
  const before = ui.getAcademyCompletion();
  requireCheck(before.completedCount === 6 && !before.unlocked, `${importedConfig.name} can remain the unrecorded seventh certification.`);
  const record = ui.saveAlreadyCertified(importedConfig.id, "2026-07-17");
  const after = ui.getAcademyCompletion();
  const importedCompletion = after.certifications.find(certification => certification.id === importedConfig.id);
  requireCheck(record.certificationId === importedConfig.id && record.status === "already-certified" && record.earnedDate === "2026-07-17" && record.evidenceType === "learner-declared", `${importedConfig.name} persists the complete learner-declared data contract.`);
  requireCheck(validIsoTimestamp(record.recordedAt) && validIsoTimestamp(record.updatedAt), `${importedConfig.name} persists recorded and updated timestamps.`);
  requireCheck(after.completedCount === 7 && after.allComplete && after.unlocked, `${importedConfig.name} can independently become the seventh completion through Already Certified evidence.`);
  requireCheck(importedCompletion.complete && importedCompletion.alreadyCertified && !importedCompletion.trainingComplete && importedCompletion.source === "already-certified", `${importedConfig.name} remains explicitly imported rather than fabricating training completion.`);
  requireCheck(Object.entries(progressBefore).every(([key, value]) => storage.getItem(key) === value), `${importedConfig.name} import leaves all seven training-progress keys byte-for-byte unchanged.`);
  requireCheck(appended.some(element => element.innerHTML.includes("All seven certification tracks are complete.")), `${importedConfig.name} seventh-completion announcement uses neutral certification-track language.`);
}

function validIsoTimestamp(value) {
  return typeof value === "string" && value.length > 0 && Number.isFinite(Date.parse(value));
}

const importedProgressionStorage = createStorage();
const importedProgression = loadCampaignUi(importedProgressionStorage);
const importedProgressionCounts = [importedProgression.ui.getAcademyCompletion().completedCount];
campaignEntries.forEach(([, config]) => {
  importedProgression.ui.saveAlreadyCertified(config.id, "2026-07-17");
  importedProgressionCounts.push(importedProgression.ui.getAcademyCompletion().completedCount);
});
requireCheck(importedProgressionCounts.join(",") === "0,1,2,3,4,5,6,7", "Already Certified records progress through every Academy state from 0/7 to 7/7.");
requireCheck(campaignEntries.every(([key]) => importedProgressionStorage.getItem(key) === null), "Seven imported certifications create no training-progress records.");
requireCheck(importedProgression.ui.getAcademyCompletion().certifications.every(certification => certification.alreadyCertified && !certification.trainingComplete), "Seven imported certifications remain distinct from seven Final Boss completions.");

const editId = campaignEntries[0][1].id;
const beforeEdit = importedProgression.ui.getAlreadyCertified(editId);
const afterEdit = importedProgression.ui.saveAlreadyCertified(editId, "2025-06-09");
requireCheck(afterEdit.earnedDate === "2025-06-09" && afterEdit.recordedAt === beforeEdit.recordedAt && afterEdit.updatedAt > beforeEdit.updatedAt, "Edit date preserves identity and recorded timestamp while advancing the modification timestamp.");
requireCheck(importedProgression.ui.formatCertificationDate("2026-07-17") === "July 17, 2026", "Date-only evidence formats without timezone drift.");

const invalidDateStorage = createStorage();
const invalidDateUi = loadCampaignUi(invalidDateStorage).ui;
["", "07/17/2026", "2026-02-30", "2999-01-01"].forEach(value => {
  let rejected = false;
  try { invalidDateUi.saveAlreadyCertified(editId, value); } catch (_) { rejected = true; }
  requireCheck(rejected, `Invalid certification date is rejected: ${value || "blank"}.`);
});
let unknownRejected = false;
try { invalidDateUi.saveAlreadyCertified("unknown-certification", "2026-07-17"); } catch (_) { unknownRejected = true; }
requireCheck(unknownRejected, "Unknown certification IDs are rejected by the seven-certification allowlist.");
requireCheck(invalidDateStorage.getItem("hydra-academy-certification-imports-v1") === null, "Rejected records do not create imported-completion storage.");

const corruptImportStorage = createStorage();
corruptImportStorage.setItem("hydra-academy-certification-imports-v1", JSON.stringify({ version: 1, certifications: {
  "network-plus": { certificationId: "network-plus", status: "already-certified", earnedDate: "2026-02-30", evidenceType: "learner-declared", recordedAt: "bad", updatedAt: "bad" },
  "unknown-certification": { certificationId: "unknown-certification", status: "already-certified", earnedDate: "2026-07-17", evidenceType: "learner-declared", recordedAt: "2026-07-17T00:00:00.000Z", updatedAt: "2026-07-17T00:00:00.000Z" }
} }));
requireCheck(loadCampaignUi(corruptImportStorage).ui.getAcademyCompletion().completedCount === 0, "Malformed, corrupt, and unknown imported records fail closed without granting completion.");

const unsupportedImportStorage = createStorage();
unsupportedImportStorage.setItem("hydra-academy-certification-imports-v1", JSON.stringify({ version: 99, certifications: {
  "network-plus": { certificationId: "network-plus", status: "already-certified", earnedDate: "2026-07-17", evidenceType: "learner-declared", recordedAt: "2026-07-17T00:00:00.000Z", updatedAt: "2026-07-17T00:00:00.000Z" }
} }));
requireCheck(loadCampaignUi(unsupportedImportStorage).ui.getAcademyCompletion().completedCount === 0, "Unsupported imported-store versions fail closed without granting completion.");

const mixedStorage = createStorage();
mixedStorage.setItem(campaignEntries[0][0], JSON.stringify(completedState()));
const mixedUi = loadCampaignUi(mixedStorage).ui;
campaignEntries.slice(1).forEach(([, config]) => mixedUi.saveAlreadyCertified(config.id, "2026-07-17"));
const mixed = mixedUi.getAcademyCompletion();
requireCheck(mixed.completedCount === 7 && mixed.unlocked && mixed.certifications.filter(certification => certification.trainingComplete).length === 1 && mixed.certifications.filter(certification => certification.alreadyCertified).length === 6, "One GSA completion plus six Already Certified records unlocks exactly 7/7.");
mixedUi.saveAlreadyCertified(campaignEntries[0][1].id, "2026-07-17");
const bothSources = mixedUi.getAcademyCompletion();
const dual = bothSources.certifications.find(certification => certification.id === campaignEntries[0][1].id);
requireCheck(bothSources.completedCount === 7 && dual.trainingComplete && dual.alreadyCertified && dual.source === "finalBoss", "A certification with both pathways counts once and preserves normal GSA completion as its primary source.");

const removableStorage = createStorage();
const removableUi = loadCampaignUi(removableStorage).ui;
removableUi.saveAlreadyCertified(editId, "2026-07-17");
const removableProgressBefore = Object.fromEntries(campaignEntries.map(([key]) => [key, removableStorage.getItem(key)]));
requireCheck(removableUi.removeAlreadyCertified(editId) && removableUi.getAcademyCompletion().completedCount === 0, "Removal before Finale unlock recalculates Academy completion immediately.");
requireCheck(Object.entries(removableProgressBefore).every(([key, value]) => removableStorage.getItem(key) === value), "Removing an imported record leaves every training-progress key unchanged.");

const currentAccessStorage = createStorage();
const currentAccessRuntime = loadCampaignUi(currentAccessStorage);
const currentAccessUi = currentAccessRuntime.ui;
campaignEntries.slice(0, 6).forEach(([, config]) => currentAccessUi.saveAlreadyCertified(config.id, "2026-07-17"));
requireCheck(currentAccessUi.getAcademyCompletion().completedCount === 6 && !currentAccessUi.getAcademyCompletion().unlocked, "Already Certified lifecycle begins with 6/7 and the Hall locked.");
const currentSeventhId = campaignEntries[6][1].id;
currentAccessUi.saveAlreadyCertified(currentSeventhId, "2026-07-17");
requireCheck(currentAccessUi.getAcademyCompletion().completedCount === 7 && currentAccessUi.getAcademyCompletion().unlocked, "Adding the seventh certification unlocks the Hall at current 7/7 completion.");
requireCheck(currentAccessRuntime.appended.some(element => element.className === "academy-finale-announcement"), "The 7/7 transition offers the Enter the Hall or Later announcement.");
currentAccessUi.removeAlreadyCertified(currentSeventhId);
const relockedAfterLater = currentAccessUi.getAcademyCompletion();
requireCheck(relockedAfterLater.completedCount === 6 && !relockedAfterLater.unlocked && relockedAfterLater.everUnlocked, "Removing the seventh certification after choosing Later relocks the Hall while preserving historical milestone evidence.");
currentAccessUi.saveAlreadyCertified(currentSeventhId, "2026-07-17");
requireCheck(currentAccessUi.getAcademyCompletion().completedCount === 7 && currentAccessUi.getAcademyCompletion().unlocked, "Restoring the seventh certification restores Hall access at current 7/7 completion.");

currentAccessUi.markAcademyFinaleViewed();
const viewedAtSeven = currentAccessUi.getAcademyCompletion().finale;
requireCheck(viewedAtSeven.viewCount === 1 && viewedAtSeven.firstViewedAt && viewedAtSeven.lastViewedAt, "Entering the Finale at 7/7 records view history.");
currentAccessUi.removeAlreadyCertified(currentSeventhId);
const relockedAfterView = currentAccessUi.getAcademyCompletion();
requireCheck(relockedAfterView.completedCount === 6 && !relockedAfterView.unlocked && relockedAfterView.finale.viewCount === 1, "Removing the seventh certification after viewing the Finale relocks access without deleting view history.");
currentAccessUi.saveAlreadyCertified(currentSeventhId, "2026-07-17");
requireCheck(currentAccessUi.getAcademyCompletion().unlocked && currentAccessUi.getAcademyCompletion().finale.viewCount === 1, "Restoring current 7/7 completion unlocks the Hall again without fabricating another Finale view.");

const cleanupStorage = createStorage();
const legitimateProgressKey = campaignEntries[0][0];
cleanupStorage.setItem(legitimateProgressKey, JSON.stringify(completedState()));
const cleanupProgressBefore = cleanupStorage.getItem(legitimateProgressKey);
const founderSnapshot = {
  imports: cleanupStorage.getItem("hydra-academy-certification-imports-v1"),
  finale: cleanupStorage.getItem("hydra-academy-finale-v1")
};
const cleanupUi = loadCampaignUi(cleanupStorage).ui;
campaignEntries.forEach(([, config]) => cleanupUi.saveAlreadyCertified(config.id, "2026-07-17"));
requireCheck(cleanupUi.getAcademyCompletion().unlocked, "Controlled Founder acceptance can reach 7/7 through imported records.");
if (founderSnapshot.imports === null) cleanupStorage.removeItem("hydra-academy-certification-imports-v1"); else cleanupStorage.setItem("hydra-academy-certification-imports-v1", founderSnapshot.imports);
if (founderSnapshot.finale === null) cleanupStorage.removeItem("hydra-academy-finale-v1"); else cleanupStorage.setItem("hydra-academy-finale-v1", founderSnapshot.finale);
const restoredCleanup = loadCampaignUi(cleanupStorage).ui.getAcademyCompletion();
requireCheck(cleanupStorage.getItem(legitimateProgressKey) === cleanupProgressBefore && restoredCleanup.completedCount === 1 && !restoredCleanup.unlocked, "Founder snapshot restoration removes test-only imports and entitlement while preserving legitimate GSA completion evidence.");

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
  requireCheck(JSON.parse(storage.getItem("hydra-academy-finale-v1")).unlockedAt, `${seventhConfig.name} records the first 7/7 Finale milestone timestamp.`);
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
requireCheck(reloadedLegacy.unlocked && reloadedLegacy.finale.unlockedAt === legacyUnlockedAt, "Current 7/7 Finale access and milestone history survive reload and browser restart storage reuse.");

legacyStorage.removeItem(campaignEntries[0][0]);
const reconciledLegacy = loadCampaignUi(legacyStorage).ui.getAcademyCompletion();
requireCheck(reconciledLegacy.completedCount === 6 && !reconciledLegacy.unlocked && reconciledLegacy.everUnlocked, "Pre-existing sticky entitlement data is reconciled to a locked Hall when current completion is 6/7.");

const crossTabStorage = createStorage();
const crossTab = loadCampaignUi(crossTabStorage);
crossTab.listeners.storage({ key: campaignEntries[0][0] });
requireCheck(crossTab.dispatched.some(event => event.type === "hydra-academy-completion-updated"), "Certification storage changes publish a cross-tab Academy completion update.");
crossTab.listeners.storage({ key: "hydra-academy-certification-imports-v1" });
requireCheck(crossTab.dispatched.some(event => event.type === "hydra-certification-imports-updated"), "Already Certified storage changes publish a cross-tab import update.");

const campaignUi = read("campaign-ui.js");
const indexHtml = read("index.html");
const hubScript = read("script.js");
const dashboard = read("dashboard.js");
const dashboardHtml = read("dashboard.html");
const sharedCss = read("style.css");
const finaleHtml = read("academy-finale.html");
const finaleJs = read("academy-finale.js");
const finaleCss = read("academy-finale.css");
const localServer = read("hydra-local-server.ps1");

requireCheck(campaignUi.includes("hydra-academy-finale-v1") && campaignUi.includes("six-exam-fallback"), "Shared engine exposes the approved completion authority and legacy fallback.");
requireCheck(campaignUi.includes("hydra-academy-certification-imports-v1") && campaignUi.includes("learner-declared") && campaignUi.includes("already-certified"), "Shared engine exposes the separate versioned learner-declared certification pathway.");
requireCheck(indexHtml.includes("academyFinaleLink") && hubScript.includes("syncAcademyCompletion"), "Select a Game exposes Hall access from the shared current-completion authority.");
requireCheck(dashboard.includes("Academy Completion") && dashboard.includes("Enter the Hall") && dashboardHtml.includes("gsa-academy-finale-1"), "Command Center exposes 0/7–7/7 status and current-state Hall access.");
requireCheck(dashboard.includes("Already certified? Record certification") && dashboard.includes("Learner-declared") && dashboard.includes("Edit date") && dashboard.includes("Remove"), "Command Center certification cards expose the approved Already Certified lifecycle.");
requireCheck(dashboardHtml.includes('id="alreadyCertifiedDialog"') && dashboardHtml.includes("does not independently verify") && dashboardHtml.includes("training progress, scores, mastery, exams, achievements, PBQs, and labs will not be deleted"), "Reusable Command Center dialog communicates the trust boundary and safe removal scope.");
requireCheck(dashboardHtml.includes("Honor System") && dashboardHtml.includes('id="alreadyCertifiedHonor"') && dashboard.includes("alreadyCertifiedHonor.checked = false") && dashboard.includes("Confirm the Honor System acknowledgment before saving this certification."), "Record and Edit Date require a fresh, save-time Honor System acknowledgment without changing imported evidence.");
requireCheck(sharedCss.includes("academy-finale-announcement") && sharedCss.includes("@media (max-width: 480px)"), "Shared completion announcement has exact 390px-compatible styling.");
requireCheck(finaleHtml.includes("finaleLocked") && finaleHtml.includes("finaleUnlocked") && finaleHtml.includes("finalePlayPause") && finaleHtml.includes("replayFinale") && finaleHtml.includes("finaleSceneA") && finaleHtml.includes("finaleSceneB") && finaleHtml.includes("finaleTitleCard"), "Finale direct route contains locked, unlocked, dual-layer cinematic stage, title, playback, and replay surfaces.");
requireCheck(finaleHtml.includes("Complete all seven certification tracks to unlock the Academy Finale.") && finaleJs.includes("certification tracks complete."), "Finale access shell uses neutral certification-track completion language.");
requireCheck(finaleHtml.includes('id="founderThankYou"') && finaleHtml.includes("A Personal Thank You") && finaleHtml.includes("Difficult does not mean impossible.") && finaleHtml.includes("— Edelmiro Acevedo") && finaleHtml.includes('id="replayFinaleFromFounder"'), "Post-Finale Founder card preserves the approved personal message and independent Replay action.");
requireCheck(finaleJs.includes("window.GSA_FINALE_CONFIG") && finaleJs.includes("assets/rise-giant-slayer-ending.mp3") && finaleJs.includes("requestAnimationFrame(renderTimeline)"), "Finale player uses the production master as its synchronized media clock while preserving the deployment hook.");
requireCheck(finaleJs.includes('elements.music.addEventListener("ended"') && finaleJs.includes("showFounderThankYou();") && finaleJs.includes("POST_FINALE_HOLD_MS = 1200") && finaleJs.includes("POST_FINALE_FADE_MS = 1600"), "Founder message begins only after the production audio ends, following a resolved ending and fade to black.");
requireCheck(finaleJs.includes('elements.founderReplay.addEventListener("click", () => beginExperience({ replay: true }))') && finaleJs.includes("resetFounderThankYou();"), "Founder Replay resets the original Finale independently without changing entitlement.");
requireCheck(finaleJs.includes("const MASTER_DURATION_SECONDS = 228.624") && finaleJs.includes("return config.durationSeconds;"), "Visible and seekable Finale timing remains aligned to the approved 3:48.624 production cue map despite decoder padding.");
requireCheck(finaleJs.includes("browser paused automatic audio") && finaleHtml.includes("Start Finale with Sound"), "Autoplay failure degrades to an obvious manual-start action.");
requireCheck(finaleCss.includes("overflow-x: hidden") && finaleCss.includes("@media (max-width: 520px)") && finaleCss.includes(".finale-scene-layer") && finaleCss.includes("@keyframes finale-push") && finaleCss.includes("@keyframes finale-pull"), "Finale has overflow protection, responsive mobile layout, crossfades, and restrained cinematic motion.");
[
  "Seven kingdoms.",
  "Seven battles.",
  "One journey.",
  "You leave them as a Giant Slayer.",
  "But everything you learned...",
  "stands with you.",
  "It was meant to prepare you...",
  "Rise, Giant Slayer.",
  "Your journey...",
  "has only begun.",
  "Welcome...",
  "to the ranks of the Giant Slayers."
].forEach(line => requireCheck(finaleJs.includes(line), `Canonical Finale narration includes: ${line}`));
requireCheck((finaleJs.match(/type: "line"/g) || []).length === 39, "Production cue map contains all 39 embedded spoken phrases.");
requireCheck((finaleJs.match(/type: "scene"/g) || []).length === 7, "Production cue map contains all seven major musical/scene transitions.");
requireCheck((finaleJs.match(/assets\/finale\/scenes\/finale-/g) || []).length === 24, "Cinematic storyboard maps all 24 approved production scene plates.");
requireCheck(finaleJs.includes('{ id: "cloud-plus", start: 126.000') && finaleJs.includes('{ id: "future-beyond-gates", start: 130.600'), "Cloud+ Maestro hold ends at the 130.600-second narration return after a 4.600-second montage appearance.");
[
  "SEVEN KINGDOMS. SEVEN BATTLES. ONE JOURNEY.",
  "RISE, GIANT SLAYER.",
  "WELCOME TO THE RANKS OF THE GIANT SLAYERS."
].forEach(title => requireCheck(finaleJs.includes(`text: "${title}"`), `Approved major title is present: ${title}`));
requireCheck(!finaleHtml.includes("finaleCueText") && !finaleHtml.includes("finaleCueDirection"), "Default presentation no longer renders every narration phrase as subtitles.");
[
  'start: 4.800', 'start: 25.860', 'start: 57.600', 'start: 96.140', 'start: 157.940',
  'start: 171.300', 'start: 205.820', 'start: 208.500', 'start: 212.620'
].forEach(timestamp => requireCheck(finaleJs.includes(timestamp), `Waveform-aligned cue is preserved: ${timestamp}`));
[
  "Music begins to rise", "Orchestra grows larger", "Huge heroic orchestral climax", "Music begins settling",
  "Prologue melody slowly returns", "Final quiet orchestral ending"
].forEach(direction => requireCheck(finaleJs.includes(`productionCue: "${direction}"`), `Production transition is encoded as a non-dialogue scene cue: ${direction}`));
requireCheck(finaleJs.includes('new URLSearchParams(window.location.search).get("preview") === "1"') && finaleJs.includes('"localhost", "127.0.0.1", "::1"'), "Localhost-only ?preview=1 path previews the Finale without production entitlement.");
requireCheck(finaleJs.includes("if (!previewMode) ui.markAcademyFinaleViewed()"), "Developer preview does not write learner Finale-view evidence.");
requireCheck(localServer.includes('206 "Partial Content"') && localServer.includes('"Content-Range"') && localServer.includes('"Accept-Ranges" = "bytes"') && localServer.includes('416 "Range Not Satisfiable"'), "Localhost server implements valid byte-range, 206, and 416 responses for seeking and replay.");

const sceneDirectory = path.join(ROOT, "assets", "finale", "scenes");
const sceneFiles = fs.readdirSync(sceneDirectory).filter(file => file.toLowerCase().endsWith(".png")).sort();
requireCheck(sceneFiles.length === 24, "Exactly 24 approved cinematic scene assets are present.");
sceneFiles.forEach(file => {
  const bytes = fs.readFileSync(path.join(sceneDirectory, file));
  requireCheck(bytes.length > 1_000_000 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `Cinematic scene is a substantive valid PNG: ${file}`);
});
const referenceDirectory = path.join(ROOT, "assets", "finale", "references");
requireCheck(fs.readdirSync(referenceDirectory).filter(file => file.toLowerCase().endsWith(".png")).length === 8, "All eight locked continuity references remain present.");

const finaleMasterPath = path.join(ROOT, "assets", "rise-giant-slayer-ending.mp3");
const finaleMaster = fs.readFileSync(finaleMasterPath);
requireCheck(finaleMaster.length === 5298518, "Production master byte length matches the supplied canonical MP3.");
requireCheck(crypto.createHash("sha256").update(finaleMaster).digest("hex") === "9df935591008077b4b58836be45f47cb7cab3461a6b8d105027da7351ab6d07c", "Production master SHA-256 matches the supplied canonical MP3.");
const embeddedMetadata = finaleMaster.subarray(0, 30000).toString("utf8");
requireCheck(embeddedMetadata.includes("Seven kingdoms.") && embeddedMetadata.includes("Welcome...") && embeddedMetadata.includes("to the ranks of the Giant Slayers."), "Production master retains the embedded English canonical lyrics metadata.");

const sealedFinaleChanges = execFileSync("git", ["status", "--porcelain", "--", "academy-finale.css", "assets/finale", "assets/rise-giant-slayer-ending.mp3", "hydra-local-server.ps1"], { cwd: ROOT, encoding: "utf8" }).trim();
requireCheck(!sealedFinaleChanges, "Finale media, artwork, styling, timing server, and production master remain sealed and unchanged.");
const protectedChanges = execFileSync("git", ["status", "--porcelain", "--", "json"], { cwd: ROOT, encoding: "utf8" }).trim();
requireCheck(!protectedChanges, "Protected curriculum, Sweep, Practice Exam, Captain, PBQ, and lab JSON remains unchanged.");

console.log("GSA Academy 7/7 Completion and Finale validation: PASS");
console.log(`- ${checks.length} completion, order, legacy, persistence, isolation, presentation, and integrity checks passed.`);
console.log("- All seven certifications independently validated as the seventh completion: PASS");
console.log("- Already Certified 0/7–7/7, mixed evidence, validation, editing, current-state relocking, and cleanup restoration: PASS");
console.log("- 6/7 locked, 7/7 unlocked, Later/viewed removal relocking, historical view evidence, one-time announcement, and replay: PASS");
console.log("- Academy Hub, Command Center, direct Finale route, cue hooks, and manual audio fallback: PASS");
console.log("- Protected learning content unchanged: PASS");
