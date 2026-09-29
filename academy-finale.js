(function () {
  "use strict";

  const ui = window.HydraCampaignUI;
  const elements = {
    completionStatus: document.getElementById("finaleCompletionStatus"),
    locked: document.getElementById("finaleLocked"),
    unlocked: document.getElementById("finaleUnlocked"),
    incompleteList: document.getElementById("finaleIncompleteList"),
    begin: document.getElementById("beginFinale"),
    experience: document.getElementById("finaleExperience"),
    cueDirection: document.getElementById("finaleCueDirection"),
    cueText: document.getElementById("finaleCueText"),
    manualStart: document.getElementById("finaleManualStart"),
    manualStartMessage: document.getElementById("finaleManualStartMessage"),
    manualStartButton: document.getElementById("manualStartFinale"),
    seek: document.getElementById("finaleSeek"),
    time: document.getElementById("finaleTime"),
    playPause: document.getElementById("finalePlayPause"),
    mute: document.getElementById("finaleMute"),
    volume: document.getElementById("finaleVolume"),
    replay: document.getElementById("replayFinale"),
    playbackStatus: document.getElementById("finalePlaybackStatus"),
    music: document.getElementById("finaleMusic"),
    narration: document.getElementById("finaleNarration")
  };

  if (!ui || Object.values(elements).some(element => !element)) return;

  const previewMode = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)
    && new URLSearchParams(window.location.search).get("preview") === "1";

  const CANONICAL_SCRIPT_SECTIONS = [
    {
      direction: "Soft orchestra — spoken",
      lines: [
        "Seven kingdoms. Seven battles. One journey.",
        "You entered these halls as a student.",
        "You leave them as a Giant Slayer."
      ]
    },
    {
      direction: "Music begins to rise",
      lines: [
        "There were lessons that tested you.",
        "Battles that challenged you.",
        "And giants that once seemed impossible to defeat.",
        "But you kept moving forward.",
        "One lesson at a time.",
        "One battle at a time.",
        "One kingdom at a time."
      ]
    },
    {
      direction: "Orchestra grows larger",
      lines: [
        "You learned to build.",
        "You learned to troubleshoot.",
        "You learned to connect.",
        "You learned to defend.",
        "You learned to command systems and rise into the clouds.",
        "Seven kingdoms now stand behind you.",
        "But everything you learned... stands with you."
      ]
    },
    {
      direction: "Huge heroic orchestral climax",
      lines: [
        "The battles were never meant to be easy.",
        "Neither were the giants.",
        "And this Academy was never meant to be the end of your journey.",
        "It was meant to prepare you...",
        "for what comes next."
      ]
    },
    {
      direction: "Music begins settling",
      lines: [
        "Beyond these gates are new systems to build.",
        "New problems to solve.",
        "New battles to fight.",
        "And giants we cannot name yet."
      ]
    },
    {
      direction: "Prologue melody slowly returns",
      lines: [
        "The Academy has taught you all it can.",
        "The gates are open.",
        "Raise your sword.",
        "Step forward.",
        "Rise, Giant Slayer.",
        "Your journey... has only begun."
      ]
    },
    {
      direction: "Final quiet orchestral ending",
      lines: ["Welcome... to the ranks of the Giant Slayers."]
    }
  ];

  function buildCanonicalPreviewCues() {
    let cursor = 0;
    const cues = [];
    CANONICAL_SCRIPT_SECTIONS.forEach((section, sectionIndex) => {
      section.lines.forEach((text, lineIndex) => {
        const previewDuration = Math.max(3.2, text.split(/\s+/).length / 2.25 + 1.4);
        cues.push({
          id: `canonical-${sectionIndex + 1}-${lineIndex + 1}`,
          start: cursor,
          end: cursor + previewDuration,
          text,
          direction: section.direction,
          narrationSrc: ""
        });
        cursor += previewDuration;
      });
    });
    return { cues, durationSeconds: cursor };
  }

  const canonicalPreview = buildCanonicalPreviewCues();

  // Production integration hook. The later creative package may assign
  // window.GSA_FINALE_CONFIG before this script loads. Its music and exact
  // cue timing replace the generated text-preview timing without a redesign.
  const suppliedConfig = window.GSA_FINALE_CONFIG || {};
  const suppliedCues = Array.isArray(suppliedConfig.cues) ? suppliedConfig.cues : [];
  const config = {
    musicSrc: typeof suppliedConfig.musicSrc === "string" ? suppliedConfig.musicSrc : "",
    durationSeconds: Math.max(0, Number(suppliedConfig.durationSeconds) || (suppliedCues.length ? 0 : canonicalPreview.durationSeconds)),
    cues: suppliedCues.length
      ? suppliedCues.filter(cue => cue && Number.isFinite(Number(cue.start)) && Number.isFinite(Number(cue.end)))
        .map(cue => ({
          id: String(cue.id || `${cue.start}-${cue.end}`),
          start: Math.max(0, Number(cue.start)),
          end: Math.max(Number(cue.start), Number(cue.end)),
          text: String(cue.text || ""),
          direction: String(cue.direction || ""),
          narrationSrc: typeof cue.narrationSrc === "string" ? cue.narrationSrc : ""
        }))
      : canonicalPreview.cues
  };

  let frameId = 0;
  let fallbackStartedAt = 0;
  let fallbackElapsed = 0;
  let fallbackPlaying = false;
  let activeCueId = "";
  let experienceStarted = false;

  function formatTime(seconds) {
    const safe = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function duration() {
    return Number.isFinite(elements.music.duration) && elements.music.duration > 0
      ? elements.music.duration
      : config.durationSeconds;
  }

  function currentTime() {
    if (config.musicSrc) return Number(elements.music.currentTime) || 0;
    if (!fallbackPlaying) return fallbackElapsed;
    return fallbackElapsed + ((performance.now() - fallbackStartedAt) / 1000);
  }

  function setPlaybackStatus(message) {
    elements.playbackStatus.textContent = message;
  }

  function showManualStart(message) {
    elements.manualStartMessage.textContent = message || "Playback needs a manual start.";
    elements.manualStart.classList.remove("hidden");
  }

  function hideManualStart() {
    elements.manualStart.classList.add("hidden");
  }

  function setCue(cue) {
    const id = cue?.id || "";
    if (id === activeCueId) return;
    activeCueId = id;
    elements.cueDirection.textContent = cue?.direction || "Finale presentation";
    elements.cueText.textContent = cue?.text || "Rise, Giant Slayer.";
    elements.narration.pause();
    elements.narration.removeAttribute("src");
    elements.narration.load();
    if (!cue?.narrationSrc) return;
    elements.narration.src = cue.narrationSrc;
    elements.narration.volume = Number(elements.volume.value);
    elements.narration.muted = elements.music.muted;
    elements.narration.play().catch(() => showManualStart("Narration is ready. Select Start Finale with Sound to continue playback."));
  }

  function renderTimeline() {
    const total = duration();
    const now = Math.min(currentTime(), total || currentTime());
    elements.seek.max = String(total || 0);
    elements.seek.value = String(total ? Math.min(now, total) : 0);
    elements.seek.disabled = total <= 0;
    elements.time.textContent = `${formatTime(now)} / ${formatTime(total)}`;
    const cue = config.cues.find(item => now >= item.start && now < item.end)
      || (total > 0 && now >= total ? config.cues[config.cues.length - 1] : null);
    setCue(cue);

    if (fallbackPlaying && total > 0 && now >= total) {
      fallbackPlaying = false;
      fallbackElapsed = total;
      elements.playPause.textContent = "▶ Play";
      setPlaybackStatus("Finale complete. Replay remains available.");
    }

    if (!elements.music.paused || fallbackPlaying) {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(renderTimeline);
    }
  }

  function pauseTimeline() {
    if (fallbackPlaying) {
      fallbackElapsed = currentTime();
      fallbackPlaying = false;
    }
    elements.music.pause();
    elements.narration.pause();
    cancelAnimationFrame(frameId);
    elements.playPause.textContent = "▶ Play";
    setPlaybackStatus("Finale paused.");
  }

  async function playTimeline() {
    const total = duration();
    if (!config.musicSrc && total <= 0) {
      elements.playPause.disabled = true;
      showManualStart("The Finale player is ready. Production music, narration, credits, and cue timing will be connected in the creative integration pass.");
      setPlaybackStatus("Creative package not yet integrated.");
      renderTimeline();
      return false;
    }

    try {
      if (config.musicSrc) {
        await elements.music.play();
      } else {
        fallbackStartedAt = performance.now();
        fallbackPlaying = true;
      }
      hideManualStart();
      elements.playPause.disabled = false;
      elements.playPause.textContent = "⏸ Pause";
      setPlaybackStatus("Finale playing.");
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(renderTimeline);
      return true;
    } catch (_) {
      elements.playPause.textContent = "▶ Play";
      showManualStart("Your browser paused automatic audio. Select Start Finale with Sound to begin.");
      setPlaybackStatus("Waiting for manual playback permission.");
      return false;
    }
  }

  function resetTimeline() {
    pauseTimeline();
    fallbackElapsed = 0;
    elements.music.currentTime = 0;
    elements.narration.currentTime = 0;
    activeCueId = "";
    elements.cueDirection.textContent = config.cues[0]?.direction || "Finale presentation";
    elements.cueText.textContent = config.cues[0]?.text || "Rise, Giant Slayer.";
    renderTimeline();
  }

  function beginExperience({ replay = false } = {}) {
    if (!experienceStarted) {
      experienceStarted = true;
      elements.unlocked.classList.add("hidden");
      elements.experience.classList.remove("hidden");
    }
    if (!previewMode) ui.markAcademyFinaleViewed();
    if (replay) resetTimeline();
    playTimeline();
  }

  function renderCompletion(completion = ui.syncAcademyCompletion()) {
    const accessGranted = completion.unlocked || previewMode;
    elements.completionStatus.textContent = previewMode
      ? `Developer preview — learner entitlement remains ${completion.completedCount}/${completion.totalCount}.`
      : `${completion.completedCount}/${completion.totalCount} certification Final Bosses defeated.`;
    elements.locked.classList.toggle("hidden", accessGranted);
    elements.unlocked.classList.toggle("hidden", !accessGranted || experienceStarted);
    if (!accessGranted) {
      pauseTimeline();
      elements.experience.classList.add("hidden");
      elements.incompleteList.replaceChildren(...completion.incomplete.map(certification => {
        const item = document.createElement("li");
        item.textContent = certification.name;
        return item;
      }));
      return;
    }
    if (config.musicSrc && !elements.music.getAttribute("src")) elements.music.src = config.musicSrc;
    elements.music.volume = Number(elements.volume.value);
    elements.narration.volume = Number(elements.volume.value);
    renderTimeline();
  }

  elements.begin.addEventListener("click", () => beginExperience());
  elements.manualStartButton.addEventListener("click", () => playTimeline());
  elements.playPause.addEventListener("click", () => {
    if (!elements.music.paused || fallbackPlaying) pauseTimeline();
    else playTimeline();
  });
  elements.mute.addEventListener("click", () => {
    const muted = !elements.music.muted;
    elements.music.muted = muted;
    elements.narration.muted = muted;
    elements.mute.setAttribute("aria-pressed", String(muted));
    elements.mute.textContent = muted ? "🔇 Unmute" : "🔊 Mute";
  });
  elements.volume.addEventListener("input", () => {
    const value = Number(elements.volume.value);
    elements.music.volume = value;
    elements.narration.volume = value;
  });
  elements.replay.addEventListener("click", () => beginExperience({ replay: true }));
  elements.seek.addEventListener("input", () => {
    const value = Number(elements.seek.value) || 0;
    if (config.musicSrc) elements.music.currentTime = value;
    else {
      fallbackElapsed = value;
      fallbackStartedAt = performance.now();
    }
    activeCueId = "";
    renderTimeline();
  });
  elements.music.addEventListener("loadedmetadata", renderTimeline);
  elements.music.addEventListener("timeupdate", renderTimeline);
  elements.music.addEventListener("ended", () => {
    elements.playPause.textContent = "▶ Play";
    setPlaybackStatus("Finale complete. Replay remains available.");
    renderTimeline();
  });
  elements.music.addEventListener("error", () => showManualStart("Finale audio could not be loaded. The visual presentation and navigation remain available."));
  window.addEventListener("hydra-academy-completion-updated", event => renderCompletion(event.detail));

  renderCompletion();
}());
