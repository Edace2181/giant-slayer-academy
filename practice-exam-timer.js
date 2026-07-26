(function () {
  "use strict";

  const STORAGE_PREFIX = "hydra-practice-timer:";
  const ACTIVE_SESSION_KEY = `${STORAGE_PREFIX}active`;

  const CERTIFICATIONS = Object.freeze({
    "hydra-quiz.html": {
      id: "network-plus",
      name: "CompTIA Network+",
      questions: 90,
      minutes: 90
    },
    "aplus-core1-quiz.html": {
      id: "aplus-core1",
      name: "CompTIA A+ Core 1",
      questions: 90,
      minutes: 90
    },
    "aplus-core2-quiz.html": {
      id: "aplus-core2",
      name: "CompTIA A+ Core 2",
      questions: 90,
      minutes: 90
    },
    "security-plus-quiz.html": {
      id: "security-plus",
      name: "CompTIA Security+",
      questions: 90,
      minutes: 90
    },
    "linux-essentials-quiz.html": {
      id: "linux-essentials",
      name: "LPI Linux Essentials",
      questions: 40,
      minutes: 60
    },
    "aws-cloud-practitioner-quiz.html": {
      id: "aws-cloud-practitioner",
      name: "AWS Cloud Practitioner",
      questions: 65,
      minutes: 90
    }
  });

  let session = null;
  let intervalId = null;
  let callbacks = null;
  let timerPanel = null;
  let timerLabel = null;
  let timerValue = null;
  let timerMessage = null;
  let startPanel = null;
  let pauseButton = null;
  let pauseOverlay = null;
  let restartDialog = null;
  let lastFocusedElement = null;
  let expirationHandled = false;
  let finalSummary = null;

  function routeConfig() {
    const file = window.location.pathname.split("/").pop() || "";
    const exam = new URLSearchParams(window.location.search).get("exam") || "";
    const certification = CERTIFICATIONS[file];

    if (!certification || !/^[1-6]$/.test(exam)) return null;

    return {
      ...certification,
      exam,
      durationSeconds: certification.minutes * 60,
      storageKey: `${STORAGE_PREFIX}${certification.id}:exam-${exam}`
    };
  }

  function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainder = seconds % 60;
    return [hours, minutes, remainder]
      .map(value => String(value).padStart(2, "0"))
      .join(":");
  }

  function readStoredSession(config) {
    try {
      const stored = JSON.parse(sessionStorage.getItem(config.storageKey) || "null");
      if (
        !stored ||
        stored.version !== 2 ||
        stored.certificationId !== config.id ||
        stored.exam !== config.exam ||
        stored.durationSeconds !== config.durationSeconds ||
        !Number.isFinite(stored.startedAt) ||
        !Number.isFinite(stored.expiresAt)
      ) {
        sessionStorage.removeItem(config.storageKey);
        return null;
      }
      return stored;
    } catch {
      sessionStorage.removeItem(config.storageKey);
      return null;
    }
  }

  function saveSession() {
    if (!session) return;
    sessionStorage.setItem(session.config.storageKey, JSON.stringify({
      version: 2,
      certificationId: session.config.id,
      exam: session.config.exam,
      durationSeconds: session.config.durationSeconds,
      startedAt: session.startedAt,
      expiresAt: session.expiresAt,
      overtimeEnabled: session.overtimeEnabled,
      trainingPauseEnabled: session.trainingPauseEnabled,
      pausedAt: session.pausedAt,
      totalPausedMs: session.totalPausedMs,
      warnings: [...session.warnings]
    }));
    sessionStorage.setItem(ACTIVE_SESSION_KEY, session.config.storageKey);
  }

  function clearStoredSession() {
    if (!session) return;
    sessionStorage.removeItem(session.config.storageKey);
    if (sessionStorage.getItem(ACTIVE_SESSION_KEY) === session.config.storageKey) {
      sessionStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  }

  function clearOtherTimerSessions(currentKey) {
    const activeKey = sessionStorage.getItem(ACTIVE_SESSION_KEY);
    if (activeKey && activeKey !== currentKey) {
      sessionStorage.removeItem(activeKey);
    }
    sessionStorage.setItem(ACTIVE_SESSION_KEY, currentKey);
  }

  function stopInterval() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function announce(message) {
    if (timerMessage) timerMessage.textContent = message;
  }

  function setExamSurfaceVisible(visible) {
    document.body.classList.toggle("hydra-exam-awaiting-start", !visible);
  }

  function buildInterface(config) {
    const messageBox = document.querySelector(".message-box");
    const host = messageBox?.parentElement || document.querySelector("main") || document.body;

    startPanel = document.createElement("section");
    startPanel.id = "hydraExamStart";
    startPanel.className = "hydra-exam-start";
    startPanel.setAttribute("aria-labelledby", "hydraExamStartTitle");
    startPanel.innerHTML = `
      <h2 id="hydraExamStartTitle">⏱️ Official Certification Practice Timer</h2>
      <p class="hydra-exam-certification">${config.name}</p>
      <dl class="hydra-exam-details">
        <div><dt>Practice Exam</dt><dd>${config.exam}</dd></div>
        <div><dt>Questions</dt><dd>${config.questions}</dd></div>
        <div><dt>Official Time Limit</dt><dd>${formatDuration(config.durationSeconds)}</dd></div>
      </dl>
      <p class="hydra-exam-notice">In Strict Certification Mode, the official countdown cannot be paused once begun.</p>
      <p class="hydra-exam-mode"><strong>Strict Certification Mode</strong> is the default. Training aids are disabled unless selected below.</p>
      <label class="hydra-overtime-option">
        <input id="hydraOvertimeMode" type="checkbox">
        <span><strong>Hydra Overtime Mode</strong><br>Continue answering after the official time limit. Overtime will be recorded in your results.</span>
      </label>
      <label class="hydra-training-pause-option">
        <input id="hydraTrainingPause" type="checkbox">
        <span><strong>Enable Training Pause</strong><br>Training aid: allow the timer to be paused while all exam content is locked.</span>
      </label>
      <button id="hydraBeginExam" class="link-btn" type="button">⚔️ Begin Exam</button>
    `;

    timerPanel = document.createElement("section");
    timerPanel.id = "hydraExamTimer";
    timerPanel.className = "hydra-exam-timer hidden";
    timerPanel.setAttribute("aria-label", "Practice exam timer");
    timerPanel.innerHTML = `
      <span class="hydra-timer-label">Time Remaining:</span>
      <strong id="hydraTimerValue">00:00:00</strong>
      <p id="hydraTimerMessage" class="hydra-timer-message" aria-live="assertive" aria-atomic="true"></p>
      <div class="hydra-timer-actions">
        <button id="hydraPauseExam" class="hydra-timer-control hidden" type="button">⏸ Pause Exam</button>
        <button id="hydraRestartExam" class="hydra-timer-control" type="button">↻ Restart Exam</button>
      </div>
    `;

    host.insertBefore(startPanel, messageBox || host.firstChild);
    host.insertBefore(timerPanel, messageBox || startPanel.nextSibling);
    timerValue = timerPanel.querySelector("#hydraTimerValue");
    timerLabel = timerPanel.querySelector(".hydra-timer-label");
    timerMessage = timerPanel.querySelector("#hydraTimerMessage");
    pauseButton = timerPanel.querySelector("#hydraPauseExam");

    pauseOverlay = document.createElement("div");
    pauseOverlay.id = "hydraPauseOverlay";
    pauseOverlay.className = "hydra-pause-overlay hidden";
    pauseOverlay.setAttribute("role", "dialog");
    pauseOverlay.setAttribute("aria-modal", "true");
    pauseOverlay.setAttribute("aria-labelledby", "hydraPauseTitle");
    pauseOverlay.innerHTML = `
      <section class="hydra-pause-card">
        <h2 id="hydraPauseTitle">⏸ Exam Paused</h2>
        <p>The timer and active exam time are paused. Exam content is locked.</p>
        <button id="hydraResumeExam" class="link-btn" type="button">▶ Resume Exam</button>
      </section>
    `;

    restartDialog = document.createElement("div");
    restartDialog.id = "hydraRestartDialog";
    restartDialog.className = "hydra-confirm-overlay hidden";
    restartDialog.setAttribute("role", "dialog");
    restartDialog.setAttribute("aria-modal", "true");
    restartDialog.setAttribute("aria-labelledby", "hydraRestartTitle");
    restartDialog.setAttribute("aria-describedby", "hydraRestartDescription");
    restartDialog.innerHTML = `
      <section class="hydra-confirm-card">
        <h2 id="hydraRestartTitle">Restart Practice Exam?</h2>
        <p id="hydraRestartDescription">Your current answers and timed session will be discarded and cannot be resumed. The new attempt will begin with the full official time limit.</p>
        <div class="hydra-confirm-actions">
          <button id="hydraCancelRestart" class="hydra-timer-control" type="button">Cancel — Continue Current Exam</button>
          <button id="hydraConfirmRestart" class="hydra-timer-control is-danger" type="button">Restart Exam</button>
        </div>
      </section>
    `;

    document.body.append(pauseOverlay, restartDialog);
    pauseButton.addEventListener("click", pauseExam);
    timerPanel.querySelector("#hydraRestartExam").addEventListener("click", openRestartDialog);
    pauseOverlay.querySelector("#hydraResumeExam").addEventListener("click", resumePausedExam);
    restartDialog.querySelector("#hydraCancelRestart").addEventListener("click", closeRestartDialog);
    restartDialog.querySelector("#hydraConfirmRestart").addEventListener("click", restartExam);
    pauseOverlay.addEventListener("keydown", event => trapModalFocus(event, pauseOverlay, false));
    restartDialog.addEventListener("keydown", event => trapModalFocus(event, restartDialog, true));
  }

  function trapModalFocus(event, container, escapeCloses) {
    if (event.key === "Escape") {
      event.preventDefault();
      if (escapeCloses) closeRestartDialog();
      return;
    }
    if (event.key !== "Tab") return;
    const controls = [...container.querySelectorAll("button:not([disabled])")];
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function lockExamSurface(locked) {
    const main = document.querySelector("main");
    if (locked) main?.setAttribute("inert", "");
    else main?.removeAttribute("inert");
  }

  function openRestartDialog() {
    if (!session || session.pausedAt) return;
    lastFocusedElement = document.activeElement;
    restartDialog.classList.remove("hidden");
    lockExamSurface(true);
    restartDialog.querySelector("#hydraCancelRestart").focus();
  }

  function closeRestartDialog() {
    restartDialog.classList.add("hidden");
    lockExamSurface(false);
    lastFocusedElement?.focus();
  }

  function restartExam() {
    stopInterval();
    clearStoredSession();
    window.location.reload();
  }

  function pauseExam() {
    if (!session?.trainingPauseEnabled || session.pausedAt) return;
    session.pausedAt = Date.now();
    stopInterval();
    saveSession();
    pauseOverlay.classList.remove("hidden");
    document.body.classList.add("hydra-exam-paused");
    lockExamSurface(true);
    pauseOverlay.querySelector("#hydraResumeExam").focus();
  }

  function resumePausedExam() {
    if (!session?.pausedAt) return;
    const pausedDuration = Math.max(0, Date.now() - session.pausedAt);
    session.totalPausedMs += pausedDuration;
    session.expiresAt += pausedDuration;
    session.pausedAt = null;
    pauseOverlay.classList.add("hidden");
    document.body.classList.remove("hydra-exam-paused");
    lockExamSurface(false);
    saveSession();
    announce("Exam resumed.");
    pauseButton.focus();
    startInterval();
  }

  function warningFor(remaining) {
    const warnings = [
      { seconds: 15 * 60, message: "15 minutes remaining. Stay focused." },
      { seconds: 5 * 60, message: "Warning: 5 minutes remaining." },
      {
        seconds: 60,
        message: session.overtimeEnabled
          ? "Final official minute. Hydra Overtime Mode will begin when time expires."
          : "Final minute. The exam will submit automatically when time expires."
      }
    ];

    const applicable = warnings.filter(warning => remaining <= warning.seconds);
    const warning = [...applicable]
      .reverse()
      .find(candidate => !session.warnings.has(candidate.seconds));

    if (warning) {
      applicable.forEach(candidate => session.warnings.add(candidate.seconds));
    }
    return warning;
  }

  function handleExpiration() {
    if (expirationHandled || !session) return;

    if (session.overtimeEnabled) {
      expirationHandled = true;
      timerPanel.classList.add("is-overtime");
      timerPanel.classList.remove("is-warning");
      timerLabel.textContent = "Hydra Overtime:";
      announce("Official time limit reached. Hydra Overtime Mode is active.");
      return;
    }

    expirationHandled = true;
    stopInterval();
    timerPanel.classList.add("is-expired");
    timerValue.textContent = "00:00:00";
    announce("Time expired. The practice exam is being submitted.");
    callbacks.onExpire();
  }

  function tick() {
    if (!session || session.pausedAt) return;

    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((session.expiresAt - now) / 1000));

    if (remaining > 0) {
      timerValue.textContent = formatDuration(remaining);
      const warning = warningFor(remaining);
      if (warning) {
        timerPanel.classList.add("is-warning");
        announce(warning.message);
        saveSession();
      }
      return;
    }

    if (session.overtimeEnabled) {
      handleExpiration();
      const overtime = Math.max(0, Math.floor((now - session.expiresAt) / 1000));
      timerValue.textContent = `OVERTIME +${formatDuration(overtime)}`;
      return;
    }

    handleExpiration();
  }

  function startInterval() {
    stopInterval();
    tick();
    if (!expirationHandled || session?.overtimeEnabled) {
      intervalId = window.setInterval(tick, 1000);
    }
  }

  function beginExam(overtimeEnabled, trainingPauseEnabled) {
    const now = Date.now();
    clearOtherTimerSessions(session.config.storageKey);
    session.startedAt = now;
    session.expiresAt = now + session.config.durationSeconds * 1000;
    session.overtimeEnabled = Boolean(overtimeEnabled);
    session.trainingPauseEnabled = Boolean(trainingPauseEnabled);
    session.pausedAt = null;
    session.totalPausedMs = 0;
    session.warnings = new Set();
    expirationHandled = false;
    saveSession();
    startPanel.classList.add("hidden");
    timerPanel.classList.remove("hidden", "is-warning", "is-expired", "is-overtime");
    timerLabel.textContent = "Time Remaining:";
    pauseButton.classList.toggle("hidden", !session.trainingPauseEnabled);
    setExamSurfaceVisible(true);
    callbacks.onBegin();
    startInterval();
  }

  function resumeExam(stored) {
    session.startedAt = stored.startedAt;
    session.expiresAt = stored.expiresAt;
    session.overtimeEnabled = Boolean(stored.overtimeEnabled);
    session.trainingPauseEnabled = Boolean(stored.trainingPauseEnabled);
    session.pausedAt = Number.isFinite(stored.pausedAt) ? stored.pausedAt : null;
    session.totalPausedMs = Number.isFinite(stored.totalPausedMs) ? stored.totalPausedMs : 0;
    session.warnings = new Set(stored.warnings || []);
    expirationHandled = false;
    startPanel.classList.add("hidden");
    timerPanel.classList.remove("hidden");
    timerLabel.textContent = "Time Remaining:";
    pauseButton.classList.toggle("hidden", !session.trainingPauseEnabled);
    setExamSurfaceVisible(true);
    callbacks.onBegin();
    if (session.pausedAt) {
      const pausedRemaining = Math.max(0, Math.ceil((session.expiresAt - session.pausedAt) / 1000));
      if (pausedRemaining > 0) {
        timerValue.textContent = formatDuration(pausedRemaining);
      } else if (session.overtimeEnabled) {
        timerLabel.textContent = "Hydra Overtime:";
        timerValue.textContent = `OVERTIME +${formatDuration(
          Math.max(0, Math.floor((session.pausedAt - session.expiresAt) / 1000))
        )}`;
        timerPanel.classList.add("is-overtime");
      }
      pauseOverlay.classList.remove("hidden");
      document.body.classList.add("hydra-exam-paused");
      lockExamSurface(true);
      pauseOverlay.querySelector("#hydraResumeExam").focus();
    } else {
      startInterval();
    }
  }

  function prepare(options) {
    const config = routeConfig();
    if (!config) return false;
    if (!options || typeof options.onBegin !== "function" || typeof options.onExpire !== "function") {
      throw new Error("HydraExamTimer requires onBegin and onExpire callbacks.");
    }
    if (options.questionCount !== config.questions) {
      throw new Error(
        `${config.name} Practice Exam ${config.exam} expected ${config.questions} questions but loaded ${options.questionCount}.`
      );
    }

    callbacks = options;
    session = {
      config,
      startedAt: null,
      expiresAt: null,
      overtimeEnabled: false,
      trainingPauseEnabled: false,
      pausedAt: null,
      totalPausedMs: 0,
      warnings: new Set()
    };
    finalSummary = null;
    expirationHandled = false;
    stopInterval();
    buildInterface(config);
    setExamSurfaceVisible(false);

    const stored = readStoredSession(config);
    if (stored) {
      resumeExam(stored);
    } else {
      startPanel.querySelector("#hydraBeginExam").addEventListener("click", () => {
        const overtimeEnabled = startPanel.querySelector("#hydraOvertimeMode").checked;
        const trainingPauseEnabled = startPanel.querySelector("#hydraTrainingPause").checked;
        beginExam(overtimeEnabled, trainingPauseEnabled);
      }, { once: true });
    }
    return true;
  }

  function finish(options = {}) {
    if (!session) return null;
    if (finalSummary) return finalSummary;

    const finishedAt = session.pausedAt || Date.now();
    const elapsedSeconds = options.reason === "expired"
      ? session.config.durationSeconds
      : Math.max(0, Math.ceil((finishedAt - session.startedAt - session.totalPausedMs) / 1000));
    const exceededSeconds = Math.max(0, elapsedSeconds - session.config.durationSeconds);

    finalSummary = {
      officialSeconds: session.config.durationSeconds,
      elapsedSeconds,
      exceededSeconds,
      timeExpired: options.reason === "expired",
      overtimeEnabled: session.overtimeEnabled
    };

    stopInterval();
    clearStoredSession();
    document.body.classList.remove("hydra-exam-paused");
    lockExamSurface(false);
    timerPanel?.classList.add("hidden");
    return finalSummary;
  }

  function resultsMarkup(summary) {
    if (!summary) return "";
    const exceeded = summary.exceededSeconds > 0;
    const notice = summary.timeExpired
      ? `<p class="hydra-time-limit-notice">⏰ Time Expired — the exam was submitted automatically.</p>`
      : exceeded
        ? `<p class="hydra-time-limit-notice">⚠️ The official certification time limit was exceeded.</p>`
        : "";

    return `
      <section class="hydra-time-results" aria-label="Practice exam timing results">
        <h3>⏱️ Certification Timing</h3>
        <p><strong>Official Time Limit:</strong> ${formatDuration(summary.officialSeconds)}</p>
        <p><strong>Actual Completion Time:</strong> ${formatDuration(summary.elapsedSeconds)}</p>
        <p><strong>Time Exceeded:</strong> ${exceeded ? `+${formatDuration(summary.exceededSeconds)}` : "00:00:00"}</p>
        ${notice}
      </section>
    `;
  }

  window.HydraExamTimer = Object.freeze({
    certifications: CERTIFICATIONS,
    prepare,
    finish,
    resultsMarkup
  });
})();
