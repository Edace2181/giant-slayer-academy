(function () {
  "use strict";

  const BANK_URL = "json/linux-essentials/labs/proof-of-concept.json";
  const PROGRESS_KEY = "hydra-linux-labs:v1:progress";
  const SESSION_PREFIX = "hydra-linux-labs:v1:mission:";
  const PHASES = ["briefing", "learn", "walkthrough", "guided", "challenge", "debrief", "fenrir"];
  const PHASE_LABELS = {
    briefing: "Mission Briefing",
    learn: "Learn the Concept",
    walkthrough: "Step-by-Step Walkthrough",
    guided: "Guided Practice",
    challenge: "Commander Challenge",
    debrief: "Mission Debrief",
    fenrir: "Fenrir's Tip"
  };

  const elements = {
    loading: document.getElementById("linuxLabLoading"),
    error: document.getElementById("linuxLabError"),
    errorMessage: document.getElementById("linuxLabErrorMessage"),
    application: document.getElementById("linuxLabApplication"),
    missionNumber: document.getElementById("linuxMissionNumber"),
    missionTitle: document.getElementById("linuxMissionTitle"),
    objective: document.getElementById("linuxMissionObjective"),
    lessonProgress: document.getElementById("linuxLessonProgress"),
    lessonProgressText: document.getElementById("linuxLessonProgressText"),
    lessonPanel: document.getElementById("linuxLessonPanel"),
    terminalPanel: document.getElementById("linuxTerminalPanel"),
    terminalMode: document.getElementById("linuxTerminalMode"),
    terminalInstructions: document.getElementById("linuxTerminalInstructions"),
    terminalChecklist: document.getElementById("linuxTerminalChecklist"),
    progressiveHintControls: document.getElementById("linuxProgressiveHintControls"),
    revealHint: document.getElementById("linuxRevealHint"),
    hintPanel: document.getElementById("linuxHintPanel"),
    terminalOutput: document.getElementById("linuxTerminalOutput"),
    terminalForm: document.getElementById("linuxTerminalForm"),
    terminalPrompt: document.getElementById("linuxTerminalPrompt"),
    terminalInput: document.getElementById("linuxTerminalInput"),
    resetPractice: document.getElementById("linuxResetPractice"),
    submitPractice: document.getElementById("linuxSubmitPractice"),
    feedback: document.getElementById("linuxFeedback"),
    previous: document.getElementById("linuxPreviousStep"),
    next: document.getElementById("linuxNextStep"),
    lessonControls: document.getElementById("linuxLessonControls") || document.querySelector(".linux-lesson-controls"),
    footer: document.getElementById("linuxLabFooter") || document.querySelector(".linux-lab-footer"),
    status: document.getElementById("linuxLabStatus")
  };

  let bank;
  let mission;
  let missionIndex;
  let phaseIndex = 0;
  let walkthroughStep = 0;
  let simulator;
  let state;

  function announce(message) {
    elements.status.textContent = "";
    window.requestAnimationFrame(() => {
      elements.status.textContent = message;
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function validateMission(candidate, index) {
    const required = [
      "id", "missionNumber", "kingdom", "title", "skill", "goal", "bigIdea", "objective", "difficulty", "briefing",
      "learn", "walkthrough", "guidedPractice", "commanderChallenge", "correctFeedback",
      "incorrectFeedback", "fenrirTip", "debrief", "takeaway"
    ];
    required.forEach(field => {
      if (candidate[field] === undefined || candidate[field] === null || candidate[field] === "") {
        throw new Error(`Mission ${index + 1} is missing “${field}”.`);
      }
    });
    if (!Array.isArray(candidate.learn) || !candidate.learn.length) throw new Error(`${candidate.id} has no learning content.`);
    if (!Array.isArray(candidate.walkthrough) || !candidate.walkthrough.length) throw new Error(`${candidate.id} has no walkthrough.`);
    ["guidedPractice", "commanderChallenge"].forEach(stage => {
      const activity = candidate[stage];
      ["instructions", "steps", "helpExamples", "successFeedback", "incorrectFeedback", "retryHint", "goals"].forEach(field => {
        if (!activity[field] || (field === "goals" && !Array.isArray(activity.goals))) {
          throw new Error(`${candidate.id} has an invalid ${stage} ${field}.`);
        }
      });
      if (!Array.isArray(activity.steps) || !activity.steps.length) {
        throw new Error(`${candidate.id} has no ${stage} task steps.`);
      }
      if (!Array.isArray(activity.helpExamples) || !activity.helpExamples.length) {
        throw new Error(`${candidate.id} has no ${stage} help examples.`);
      }
      if (stage === "commanderChallenge") {
        if (
          !Array.isArray(activity.hints) ||
          activity.hints.length !== 3 ||
          activity.hints.some(hint => !hint.label || !hint.text)
        ) {
          throw new Error(`${candidate.id} requires three complete Commander Challenge hints.`);
        }
      }
    });
  }

  function validateBank(candidate) {
    if (!candidate || candidate.schemaVersion !== 1 || candidate.campaign !== "linux-labs") {
      throw new Error("Unsupported Linux Labs mission bank.");
    }
    if (!Array.isArray(candidate.missions) || candidate.missions.length !== 2) {
      throw new Error("This proof of concept requires exactly two missions.");
    }
    const ids = new Set();
    candidate.missions.forEach((item, index) => {
      validateMission(item, index);
      if (ids.has(item.id)) throw new Error(`Duplicate mission ID “${item.id}”.`);
      ids.add(item.id);
    });
    return candidate;
  }

  function freshState() {
    return {
      schemaVersion: 1,
      phaseIndex: 0,
      walkthroughStep: 0,
      guidedComplete: false,
      challengeComplete: false,
      activeMode: null,
      simulatorSnapshots: {},
      hintLevels: {}
    };
  }

  function restoreState() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(`${SESSION_PREFIX}${mission.id}`) || "null");
      if (!stored || stored.schemaVersion !== 1) return freshState();
      stored.phaseIndex = Math.min(Math.max(Number(stored.phaseIndex) || 0, 0), PHASES.length - 1);
      stored.walkthroughStep = Math.min(
        Math.max(Number(stored.walkthroughStep) || 0, 0),
        mission.walkthrough.length - 1
      );
      stored.simulatorSnapshots ||= {};
      stored.hintLevels ||= {};
      return stored;
    } catch {
      return freshState();
    }
  }

  function saveState() {
    state.phaseIndex = phaseIndex;
    state.walkthroughStep = walkthroughStep;
    if (state.activeMode) state.simulatorSnapshots[state.activeMode] = simulator.snapshot();
    sessionStorage.setItem(`${SESSION_PREFIX}${mission.id}`, JSON.stringify(state));
  }

  function getCampaignProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveCompletion() {
    const progress = getCampaignProgress();
    progress[mission.id] = {
      completed: true,
      bestScore: 100,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }

  function phase() {
    return PHASES[phaseIndex];
  }

  function renderBriefing() {
    elements.lessonPanel.innerHTML = `
      <span class="linux-labs-label">MISSION BRIEFING</span>
      <h2>${escapeHtml(mission.title)}</h2>
      <p><strong>Your goal:</strong> ${escapeHtml(mission.goal)}</p>
      <p>${escapeHtml(mission.briefing)}</p>
      <div class="linux-safety-note">
        <strong>Training safety:</strong> This mission uses a controlled virtual filesystem. Nothing is installed, downloaded, or executed on your computer.
      </div>
    `;
  }

  function renderLearn() {
    elements.lessonPanel.innerHTML = `
      <span class="linux-labs-label">LEARN THE CONCEPT</span>
      <h2>${escapeHtml(mission.skill)}</h2>
      <div class="linux-concept-grid">
        ${mission.learn.map(item => `
          <article class="linux-concept-card">
            ${item.badge ? `<span class="linux-concept-badge">${escapeHtml(item.badge)}</span>` : ""}
            <code>${escapeHtml(item.command)}</code>
            <p>${escapeHtml(item.explanation)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderWalkthrough() {
    const active = mission.walkthrough[walkthroughStep];
    elements.lessonPanel.innerHTML = `
      <span class="linux-labs-label">STEP-BY-STEP WALKTHROUGH</span>
      <h2>Step ${walkthroughStep + 1} of ${mission.walkthrough.length} — ${escapeHtml(active.title)}</h2>
      <p>${escapeHtml(active.text)}</p>
      <pre class="linux-command-example" tabindex="0"><code>${escapeHtml(active.command)}</code></pre>
      <ol class="linux-step-dots" aria-label="Walkthrough steps">
        ${mission.walkthrough.map((step, index) => `
          <li class="${index === walkthroughStep ? "is-current" : index < walkthroughStep ? "is-viewed" : ""}">
            ${escapeHtml(step.title)}
          </li>
        `).join("")}
      </ol>
    `;
  }

  function renderFenrirTip() {
    const nextMission = bank.missions[missionIndex + 1];
    elements.lessonPanel.innerHTML = `
      <span class="linux-labs-label">FENRIR'S TIP</span>
      <h2>Final guidance from the Academy Wolf</h2>
      <aside class="linux-wolf-tip">
        <strong class="linux-guide-name"><span aria-hidden="true">🐺</span> FENRIR</strong>
        <span class="linux-guide-title">The Academy Wolf</span>
        <div class="linux-guide-advice">
          <span class="linux-guide-category">Linux Tip</span>
          <p>${escapeHtml(mission.fenrirTip)}</p>
        </div>
      </aside>
      <div class="linux-next-actions" aria-label="Next actions">
        <button id="linuxReplayMission" class="linux-secondary-button" type="button">↻ Replay Mission</button>
        ${nextMission ? `<a class="linux-action-button" href="linux-lab.html?mission=${encodeURIComponent(nextMission.id)}">Next Mission →</a>` : ""}
        <a class="linux-secondary-button" href="linux-labs.html">Return to Linux Labs</a>
        <a class="linux-secondary-button" href="linux-essentials-final-dungeon.html">Return to Linux Final Dungeon</a>
      </div>
    `;
    document.getElementById("linuxReplayMission").addEventListener("click", replayMission);
  }

  function renderDebrief() {
    elements.lessonPanel.innerHTML = `
      <span class="linux-labs-label">MISSION DEBRIEF</span>
      <h2>Mission objective achieved</h2>
      <p>${escapeHtml(mission.correctFeedback)}</p>
      <p>${escapeHtml(mission.debrief)}</p>
      <div class="linux-big-idea">
        <strong>Big Idea</strong>
        <p>${escapeHtml(mission.bigIdea)}</p>
      </div>
      <div class="linux-takeaway">
        <strong>Command-recognition takeaway</strong>
        <p>${escapeHtml(mission.takeaway)}</p>
      </div>
    `;
  }

  function renderTerminal(mode) {
    const activity = mode === "guided" ? mission.guidedPractice : mission.commanderChallenge;
    const alreadyComplete = mode === "guided" ? state.guidedComplete : state.challengeComplete;
    state.activeMode = mode;
    elements.terminalPanel.classList.remove("hidden");
    elements.terminalMode.textContent = mode === "guided" ? "Guided Practice" : "Commander Challenge";
    elements.terminalInstructions.textContent = activity.instructions;
    elements.terminalChecklist.replaceChildren(...activity.steps.map(step => {
      const item = document.createElement("li");
      item.textContent = step;
      return item;
    }));
    elements.progressiveHintControls.classList.toggle("hidden", mode !== "challenge");
    renderProgressiveHints(activity, mode);
    elements.submitPractice.textContent = mode === "guided" ? "Submit Guided Practice" : "Submit Challenge";
    elements.resetPractice.textContent = mode === "guided" ? "↻ Reset Guided Practice" : "↻ Reset Challenge";
    elements.feedback.classList.add("hidden");
    elements.feedback.replaceChildren();

    simulator.reset();
    simulator.setHelpExamples(activity.helpExamples);
    if (state.simulatorSnapshots[mode]) simulator.restore(state.simulatorSnapshots[mode]);
    renderTerminalTranscript();
    elements.terminalInput.disabled = alreadyComplete;
    elements.submitPractice.disabled = alreadyComplete;
    if (alreadyComplete) {
      elements.feedback.className = "linux-feedback is-correct";
      elements.feedback.innerHTML = `
        <h3>${mode === "guided" ? "Guided Practice Complete" : "Commander Challenge Complete"}</h3>
        <p>${escapeHtml(activity.successFeedback)}</p>
      `;
    }
  }

  function renderProgressiveHints(activity, mode) {
    if (mode !== "challenge") {
      elements.hintPanel.classList.add("hidden");
      elements.hintPanel.replaceChildren();
      return;
    }
    const revealed = Math.min(Number(state.hintLevels[mission.id]) || 0, activity.hints.length);
    elements.revealHint.disabled = revealed >= activity.hints.length;
    elements.revealHint.textContent = revealed >= activity.hints.length
      ? "All Fenrir Hints Revealed"
      : revealed === 0
        ? "🐺 Ask Fenrir for a Hint"
        : "🐺 Reveal the Next Hint";
    if (revealed === 0) {
      elements.hintPanel.classList.add("hidden");
      elements.hintPanel.replaceChildren();
      return;
    }
    elements.hintPanel.classList.remove("hidden");
    elements.hintPanel.innerHTML = activity.hints.slice(0, revealed).map((hint, index) => `
      <div class="linux-hint-level">
        <strong>Hint ${index + 1} — ${escapeHtml(hint.label)}</strong>
        <p>${escapeHtml(hint.text)}</p>
      </div>
    `).join("");
  }

  function revealProgressiveHint() {
    if (phase() !== "challenge") return;
    const activity = mission.commanderChallenge;
    const current = Math.min(Number(state.hintLevels[mission.id]) || 0, activity.hints.length);
    if (current >= activity.hints.length) return;
    state.hintLevels[mission.id] = current + 1;
    renderProgressiveHints(activity, "challenge");
    saveState();
    elements.hintPanel.focus();
    announce(`${activity.hints[current].label} revealed.`);
  }

  function renderTerminalTranscript() {
    elements.terminalOutput.replaceChildren();
    const welcome = document.createElement("p");
    welcome.className = "linux-terminal-system";
    welcome.textContent = "Hydra Linux Simulator ready. Type help for available commands.";
    elements.terminalOutput.append(welcome);
    simulator.history.forEach(entry => {
      const command = document.createElement("p");
      command.className = "linux-terminal-entry";
      const prompt = document.createElement("span");
      prompt.className = "linux-terminal-entry-prompt";
      prompt.textContent = "$ ";
      const text = document.createElement("span");
      text.textContent = entry.input;
      command.append(prompt, text);
      elements.terminalOutput.append(command);
      if (entry.output) {
        const output = document.createElement("pre");
        output.className = entry.ok ? "linux-terminal-result" : "linux-terminal-error";
        output.textContent = entry.output;
        elements.terminalOutput.append(output);
      }
    });
    elements.terminalPrompt.textContent = simulator.prompt();
    elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
  }

  function checkGoals(goals) {
    return goals.map(goal => {
      if (goal.type === "command-ran") return simulator.ranCommand(goal.command);
      if (goal.type === "command-ran-at-path") {
        return simulator.history.some(entry => (
          entry.command === goal.command &&
          entry.ok &&
          entry.cwd === goal.path
        ));
      }
      if (goal.type === "cwd") return simulator.cwd === goal.path;
      if (goal.type === "directory-exists") return simulator.hasDirectory(goal.path);
      if (goal.type === "file-exists") return simulator.hasFile(goal.path);
      return false;
    });
  }

  function submitActivity() {
    const mode = phase();
    const activity = mode === "guided" ? mission.guidedPractice : mission.commanderChallenge;
    const results = checkGoals(activity.goals);
    const passed = results.every(Boolean);
    elements.feedback.className = `linux-feedback ${passed ? "is-correct" : "is-incorrect"}`;
    elements.feedback.innerHTML = passed
      ? `<h3>${mode === "guided" ? "Guided Practice Complete" : "Commander Challenge Complete"}</h3>
         <p>${escapeHtml(activity.successFeedback)}</p>`
      : `<h3>Keep Training</h3>
         <p>${escapeHtml(activity.incorrectFeedback)}</p>
         <p><strong>Hydra hint:</strong> ${escapeHtml(activity.retryHint)}</p>`;
    elements.feedback.focus();

    if (!passed) {
      announce("The activity is not complete. A retry hint is available.");
      return;
    }

    if (mode === "guided") {
      state.guidedComplete = true;
      elements.terminalInput.disabled = true;
      elements.submitPractice.disabled = true;
      elements.next.disabled = false;
      elements.next.textContent = "Begin Commander Challenge →";
      announce("Guided Practice complete. Commander Challenge is now available.");
    } else {
      state.challengeComplete = true;
      saveCompletion();
      elements.terminalInput.disabled = true;
      elements.submitPractice.disabled = true;
      elements.next.disabled = false;
      elements.next.textContent = "Mission Debrief →";
      announce("Commander Challenge complete. Mission progress saved.");
    }
    saveState();
  }

  function resetActivity() {
    const mode = phase();
    simulator.reset();
    state.simulatorSnapshots[mode] = simulator.snapshot();
    elements.feedback.classList.add("hidden");
    elements.feedback.replaceChildren();
    elements.terminalInput.disabled = false;
    elements.submitPractice.disabled = false;
    if (mode === "guided") state.guidedComplete = false;
    if (mode === "challenge") {
      state.challengeComplete = false;
      state.hintLevels[mission.id] = 0;
      renderProgressiveHints(mission.commanderChallenge, "challenge");
    }
    renderTerminalTranscript();
    saveState();
    elements.terminalInput.focus();
    announce(`${mode === "guided" ? "Guided Practice" : "Commander Challenge"} reset.`);
  }

  function render() {
    elements.terminalPanel.classList.add("hidden");
    elements.lessonPanel.classList.remove("hidden");
    elements.lessonControls.classList.remove("hidden");
    elements.footer.classList.remove("hidden");
    elements.next.classList.remove("hidden");
    elements.previous.classList.remove("hidden");
    elements.previous.disabled = phaseIndex === 0;
    elements.next.disabled = false;
    elements.lessonProgress.value = phaseIndex + 1;
    elements.lessonProgressText.textContent = `${PHASE_LABELS[phase()]} · ${phaseIndex + 1} of ${PHASES.length}`;

    if (phase() === "briefing") {
      renderBriefing();
      elements.next.textContent = "Begin Lesson →";
    } else if (phase() === "learn") {
      renderLearn();
      elements.next.textContent = "View Walkthrough →";
    } else if (phase() === "walkthrough") {
      renderWalkthrough();
      elements.next.textContent = walkthroughStep < mission.walkthrough.length - 1
        ? "Next Walkthrough Step →"
        : "Begin Guided Practice →";
    } else if (phase() === "guided") {
      elements.lessonPanel.classList.add("hidden");
      renderTerminal("guided");
      elements.next.disabled = !state.guidedComplete;
      elements.next.textContent = "Begin Commander Challenge →";
    } else if (phase() === "challenge") {
      elements.lessonPanel.classList.add("hidden");
      renderTerminal("challenge");
      elements.next.disabled = !state.challengeComplete;
      elements.next.textContent = "Mission Debrief →";
    } else if (phase() === "debrief") {
      renderDebrief();
      elements.next.textContent = "Fenrir's Tip →";
    } else {
      renderFenrirTip();
      elements.lessonControls.classList.add("hidden");
      elements.footer.classList.add("hidden");
    }

    saveState();
    if (!elements.lessonPanel.classList.contains("hidden")) elements.lessonPanel.focus();
  }

  function nextStep() {
    if (phase() === "walkthrough" && walkthroughStep < mission.walkthrough.length - 1) {
      walkthroughStep += 1;
    } else if (phaseIndex < PHASES.length - 1) {
      phaseIndex += 1;
      walkthroughStep = phase() === "walkthrough" ? 0 : walkthroughStep;
    }
    render();
  }

  function previousStep() {
    if (phase() === "walkthrough" && walkthroughStep > 0) {
      walkthroughStep -= 1;
    } else if (phaseIndex > 0) {
      phaseIndex -= 1;
      if (phase() === "walkthrough") walkthroughStep = mission.walkthrough.length - 1;
    }
    render();
  }

  function replayMission() {
    sessionStorage.removeItem(`${SESSION_PREFIX}${mission.id}`);
    state = freshState();
    phaseIndex = 0;
    walkthroughStep = 0;
    render();
    announce("Mission restarted from the briefing.");
  }

  function runCommand(event) {
    event.preventDefault();
    const input = elements.terminalInput.value;
    if (!input.trim()) return;
    const result = simulator.execute(input);
    const correctingPreviousSubmission = elements.feedback.classList.contains("is-incorrect");
    elements.terminalInput.value = "";
    if (result.clear) simulator.history = [];
    if (correctingPreviousSubmission) {
      elements.feedback.classList.add("hidden");
      elements.feedback.classList.remove("is-incorrect");
      elements.feedback.replaceChildren();
    }
    state.simulatorSnapshots[phase()] = simulator.snapshot();
    renderTerminalTranscript();
    saveState();
    announce(
      correctingPreviousSubmission && result.ok
        ? `${result.command} completed. Submit the activity again when you are ready.`
        : result.ok
          ? `${result.command} completed.`
          : result.output
    );
  }

  function initialize(candidate) {
    bank = validateBank(candidate);
    const requestedId = new URLSearchParams(window.location.search).get("mission") || bank.missions[0].id;
    missionIndex = bank.missions.findIndex(item => item.id === requestedId);
    if (missionIndex < 0) throw new Error("The requested Linux Lab mission does not exist.");
    mission = bank.missions[missionIndex];
    simulator = new window.HydraLinuxSimulator();
    state = restoreState();
    phaseIndex = state.phaseIndex;
    walkthroughStep = state.walkthroughStep;

    elements.missionNumber.textContent = `${mission.kingdom} · Mission ${String(mission.missionNumber).padStart(2, "0")}`;
    elements.missionTitle.textContent = mission.title;
    elements.objective.textContent = `Goal: ${mission.goal} · Official objective: ${mission.objective}`;
    elements.loading.classList.add("hidden");
    elements.application.classList.remove("hidden");
    render();
    elements.missionTitle.focus();
  }

  elements.terminalForm.addEventListener("submit", runCommand);
  elements.submitPractice.addEventListener("click", submitActivity);
  elements.resetPractice.addEventListener("click", resetActivity);
  elements.revealHint.addEventListener("click", revealProgressiveHint);
  elements.next.addEventListener("click", nextStep);
  elements.previous.addEventListener("click", previousStep);

  fetch(BANK_URL)
    .then(response => {
      if (!response.ok) throw new Error(`Mission bank returned HTTP ${response.status}.`);
      return response.json();
    })
    .then(initialize)
    .catch(problem => {
      elements.loading.classList.add("hidden");
      elements.error.classList.remove("hidden");
      elements.errorMessage.textContent = problem.message;
    });
})();
