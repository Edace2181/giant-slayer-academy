#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const childProcess = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const bank = JSON.parse(fs.readFileSync(path.join(root, "json", "aplus-core1", "world1", "1.1-hatchling.json"), "utf8"));
const pageUrl = "http://127.0.0.1:8765/story-mode/prototype/index.html";
const storageKey = "gsa.storyMode.prototype.v1.aplus-core1.1.1.questionCycle";
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
];

class CdpClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.nextId = 1;
    this.pending = new Map();
    this.handlers = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
      this.socket.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (message.id) {
          const pending = this.pending.get(message.id);
          if (!pending) return;
          this.pending.delete(message.id);
          if (message.error) pending.reject(new Error(message.error.message));
          else pending.resolve(message.result);
          return;
        }
        const callbacks = this.handlers.get(message.method) || [];
        callbacks.forEach((callback) => callback(message.params));
      });
    });
  }

  on(method, callback) {
    const callbacks = this.handlers.get(method) || [];
    callbacks.push(callback);
    this.handlers.set(method, callbacks);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const response = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
    }
    return response.result.value;
  }

  close() {
    if (this.socket) this.socket.close();
  }
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

async function pollJson(url, timeout = 12000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch (_error) {
      // Chrome is still starting.
    }
    await sleep(120);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function waitFor(client, expression, message, timeout = 7000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await client.evaluate(expression)) return;
    await sleep(80);
  }
  throw new Error(message);
}

async function navigate(client, width, height, reducedMotion = false) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 430
  });
  await client.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: reducedMotion ? "reduce" : "no-preference" }]
  });
  await client.send("Page.navigate", { url: `${pageUrl}?qa=${Date.now()}` });
  await waitFor(
    client,
    "document.readyState === 'complete' && !document.getElementById('maestroScreen').hidden",
    "Maestro briefing did not become ready."
  );
}

async function click(client, id) {
  const clicked = await client.evaluate(`(() => { const el = document.getElementById(${JSON.stringify(id)}); if (!el || el.hidden || el.disabled) return false; el.click(); return true; })()`);
  assert.equal(clicked, true, `Unable to click ${id}`);
}

async function playEncounter(client, pattern) {
  assert.equal(pattern.length, 5);
  await click(client, "beginEncounter");
  for (let turn = 0; turn < 5; turn += 1) {
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'QUESTION_ACTIVE'", `Turn ${turn + 1} did not become active.`);
    const questionText = await client.evaluate("document.getElementById('questionText').textContent");
    const question = bank.find((item) => item.question === questionText);
    assert.ok(question, `Rendered question was not found in the protected bank: ${questionText}`);
    const choice = pattern[turn] ? question.answer : (question.answer + 1) % question.choices.length;
    const submitted = await client.evaluate(`(() => {
      const options = document.querySelectorAll('input[name="storyAnswer"]');
      const input = options[${choice}];
      if (!input) return false;
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      document.getElementById('answerForm').requestSubmit();
      return true;
    })()`);
    assert.equal(submitted, true);
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'FEEDBACK_REQUIRED'", `Turn ${turn + 1} feedback did not appear.`);
    const feedback = await client.evaluate(`(() => ({
      result: document.getElementById('feedbackResult').textContent,
      explanation: document.getElementById('explanationText').textContent,
      approved: document.getElementById('approvedAnswer').textContent,
      submitDisabled: document.getElementById('submitAnswer').disabled,
      feedbackVisible: !document.getElementById('feedbackPanel').hidden
    }))()`);
    assert.equal(feedback.result, pattern[turn] ? "Correct" : "Incorrect");
    assert.equal(feedback.explanation, question.explanation);
    assert.equal(feedback.approved, question.choices[question.answer]);
    assert.equal(feedback.submitDisabled, true);
    assert.equal(feedback.feedbackVisible, true);
    await click(client, "continueBattle");
  }
}

async function main() {
  const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
  assert.ok(chrome, "Chrome or Edge is required for runtime validation.");
  const port = await freePort();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "gsa-story-mode-browser-"));
  const process = childProcess.spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--disable-default-apps",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank"
  ], { windowsHide: true, stdio: "ignore" });

  let client;
  const consoleProblems = [];
  try {
    const pages = await pollJson(`http://127.0.0.1:${port}/json/list`);
    const page = pages.find((entry) => entry.type === "page");
    assert.ok(page?.webSocketDebuggerUrl, "Chrome did not expose a debuggable page.");
    client = new CdpClient(page.webSocketDebuggerUrl);
    await client.connect();
    client.on("Runtime.exceptionThrown", (event) => consoleProblems.push(`exception: ${event.exceptionDetails.text}`));
    client.on("Runtime.consoleAPICalled", (event) => {
      if (["error", "warning"].includes(event.type)) consoleProblems.push(`console ${event.type}`);
    });
    client.on("Log.entryAdded", (event) => {
      if (["error", "warning"].includes(event.entry.level)) consoleProblems.push(`${event.entry.level}: ${event.entry.text}`);
    });
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Log.enable");

    await navigate(client, 1440, 900);
    const desktop = await client.evaluate(`(() => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      maestroVisible: !document.getElementById('maestroScreen').hidden,
      imageLoaded: document.querySelector('.maestro-portrait').complete && document.querySelector('.maestro-portrait').naturalWidth > 0
    }))()`);
    assert.deepEqual(desktop, { width: 1440, overflow: false, maestroVisible: true, imageLoaded: true });

    assert.equal(
      await client.evaluate("document.getElementById('beginEncounter').focus(); document.activeElement.id"),
      "beginEncounter"
    );
    await client.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
    await client.send("Input.dispatchKeyEvent", { type: "char", key: "Enter", code: "Enter", text: "\r", unmodifiedText: "\r" });
    await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'QUESTION_ACTIVE'", "Keyboard activation did not start the encounter.");
    await client.evaluate("document.querySelector('input[name=\"storyAnswer\"]').focus()");
    await client.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: " ", code: "Space", windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
    await client.send("Input.dispatchKeyEvent", { type: "char", key: " ", code: "Space", text: " ", unmodifiedText: " " });
    await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
    const keyboardSelection = await client.evaluate(`(() => ({
      checked: document.querySelector('input[name="storyAnswer"]:checked') !== null,
      submitEnabled: !document.getElementById('submitAnswer').disabled
    }))()`);
    assert.deepEqual(keyboardSelection, { checked: true, submitEnabled: true });
    await client.send("Page.reload", { ignoreCache: true });
    await waitFor(client, "document.readyState === 'complete' && window.__GSA_STORY_MODE_DEV__?.getState() === 'MAESTRO_BRIEFING'", "Keyboard-check reload did not return to Maestro.");

    await playEncounter(client, [true, true, false, true, false]);
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'VICTORY'", "Victory state did not appear.");
    const victory = await client.evaluate(`(() => ({
      title: document.getElementById('resultTitle').textContent,
      score: document.getElementById('resultScore').textContent,
      hero: document.getElementById('resultHeroHp').textContent,
      enemy: document.getElementById('resultEnemyHp').textContent,
      retryHidden: document.getElementById('retryEncounter').hidden
    }))()`);
    assert.deepEqual(victory, { title: "Victory", score: "3/5 correct", hero: "3/5 HP", enemy: "2/5 HP", retryHidden: true });

    await click(client, "returnToMaestro");
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'MAESTRO_BRIEFING'", "Return to Maestro failed.");
    assert.equal(await client.evaluate("document.getElementById('beginEncounter').textContent"), "Train Again");

    await playEncounter(client, [false, false, false, false, false]);
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'DEFEAT'", "Defeat state did not appear.");
    const defeat = await client.evaluate(`(() => ({
      title: document.getElementById('resultTitle').textContent,
      score: document.getElementById('resultScore').textContent,
      hero: document.getElementById('resultHeroHp').textContent,
      enemy: document.getElementById('resultEnemyHp').textContent,
      retryHidden: document.getElementById('retryEncounter').hidden
    }))()`);
    assert.deepEqual(defeat, { title: "Defeat — Training Continues", score: "0/5 correct", hero: "0/5 HP", enemy: "5/5 HP", retryHidden: false });

    await click(client, "retryEncounter");
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'QUESTION_ACTIVE'", "Retry did not start.");
    const cleanRetry = await client.evaluate(`(() => ({
      hero: document.getElementById('heroHpText').textContent,
      enemy: document.getElementById('enemyHpText').textContent,
      turn: document.getElementById('turnCounter').textContent,
      question: document.getElementById('questionText').textContent
    }))()`);
    assert.equal(cleanRetry.hero, "5/5 HP");
    assert.equal(cleanRetry.enemy, "5/5 HP");
    assert.equal(cleanRetry.turn, "Turn 1 of 5");

    await client.send("Page.reload", { ignoreCache: true });
    await waitFor(client, "document.readyState === 'complete' && window.__GSA_STORY_MODE_DEV__?.getState() === 'MAESTRO_BRIEFING'", "Reload did not return to Maestro.");
    await click(client, "beginEncounter");
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'QUESTION_ACTIVE'", "Fresh encounter did not start after reload.");
    const afterReloadQuestion = await client.evaluate("document.getElementById('questionText').textContent");
    assert.notEqual(afterReloadQuestion, cleanRetry.question, "Displayed question was incorrectly reused after reload.");
    const storageKeys = await client.evaluate("Object.keys(localStorage)");
    assert.deepEqual(storageKeys, [storageKey]);

    await client.evaluate("window.__GSA_STORY_MODE_DEV__.forceContentFailure()");
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'CONTENT_FAILURE'", "Content Failure did not appear.");
    assert.equal(await client.evaluate("document.getElementById('failureTitle').textContent"), "Training Content Unavailable");
    await click(client, "recheckContent");
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'MAESTRO_BRIEFING'", "Content recheck did not return to Maestro.");

    await navigate(client, 390, 844, true);
    const mobile = await client.evaluate(`(() => {
      const begin = document.getElementById('beginEncounter').getBoundingClientRect();
      return {
        width: innerWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
        bodyOverflow: document.body.scrollWidth > innerWidth,
        beginHeight: Math.round(begin.height),
        reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
        imageLoaded: document.querySelector('.maestro-portrait').complete && document.querySelector('.maestro-portrait').naturalWidth > 0
      };
    })()`);
    assert.equal(mobile.width, 390);
    assert.equal(mobile.overflow, false);
    assert.equal(mobile.bodyOverflow, false);
    assert.ok(mobile.beginHeight >= 44);
    assert.equal(mobile.reducedMotion, true);
    assert.equal(mobile.imageLoaded, true);

    await click(client, "beginEncounter");
    await waitFor(client, "window.__GSA_STORY_MODE_DEV__?.getState() === 'QUESTION_ACTIVE'", "Mobile encounter did not start.");
    const mobileBattle = await client.evaluate(`(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      heroHp: document.getElementById('heroHpText').textContent,
      enemyHp: document.getElementById('enemyHpText').textContent,
      answerHeights: Array.from(document.querySelectorAll('.answer-option span')).map((item) => Math.round(item.getBoundingClientRect().height)),
      animationDuration: getComputedStyle(document.querySelector('.hero-placeholder')).animationDuration
    }))()`);
    assert.equal(mobileBattle.overflow, false);
    assert.equal(mobileBattle.heroHp, "5/5 HP");
    assert.equal(mobileBattle.enemyHp, "5/5 HP");
    assert.ok(mobileBattle.answerHeights.every((height) => height >= 44));
    const reducedMotionSeconds = mobileBattle.animationDuration.endsWith("ms")
      ? Number.parseFloat(mobileBattle.animationDuration) / 1000
      : Number.parseFloat(mobileBattle.animationDuration);
    assert.ok(Number.isFinite(reducedMotionSeconds) && reducedMotionSeconds <= 0.001);

    assert.deepEqual(consoleProblems, []);
    console.log("PASS  desktop Maestro and asset loading");
    console.log("PASS  keyboard activation and answer selection");
    console.log("PASS  earned 3-of-5 Victory flow");
    console.log("PASS  legitimate 0-of-5 Defeat and clean retry");
    console.log("PASS  reload returns to Maestro and preserves seen-question continuity");
    console.log("PASS  Content Failure and recheck flow");
    console.log("PASS  exact 390px mobile, touch targets, and zero overflow");
    console.log("PASS  reduced-motion behavior");
    console.log("PASS  zero browser console warnings/errors");
    console.log("\nStory Mode browser validation: 9/9 PASS");
  } finally {
    if (client) client.close();
    process.kill();
    await sleep(150);
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`FAIL  Story Mode browser validation\n${error.stack || error.message}`);
  process.exitCode = 1;
});
