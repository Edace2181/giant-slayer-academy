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
    playerState: document.getElementById("finalePlayerState"),
    founderThankYou: document.getElementById("founderThankYou"),
    founderReplay: document.getElementById("replayFinaleFromFounder"),
    stage: document.getElementById("finaleStage"),
    sceneA: document.getElementById("finaleSceneA"),
    sceneB: document.getElementById("finaleSceneB"),
    sceneDescription: document.getElementById("finaleSceneDescription"),
    titleCard: document.getElementById("finaleTitleCard"),
    titleText: document.getElementById("finaleTitleText"),
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
    music: document.getElementById("finaleMusic")
  };

  if (!ui || Object.values(elements).some(element => !element)) return;

  const previewMode = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)
    && new URLSearchParams(window.location.search).get("preview") === "1";

  const MASTER_DURATION_SECONDS = 228.624;
  const PRODUCTION_MUSIC_SRC = "assets/rise-giant-slayer-ending.mp3";

  // Aligned to the decoded production master at 20 ms resolution. Production
  // directions drive visual scenes and never render as spoken dialogue.
  const PRODUCTION_CUES = [
    { id: "scene-soft-orchestra", start: 0.000, type: "scene", scene: "origins", sceneTitle: "The Seven Kingdoms", productionCue: "Soft orchestra — spoken" },
    { id: "line-01", start: 4.800, type: "line", scene: "origins", sceneTitle: "The Seven Kingdoms", text: "Seven kingdoms." },
    { id: "line-02", start: 8.160, type: "line", scene: "origins", sceneTitle: "The Seven Kingdoms", text: "Seven battles." },
    { id: "line-03", start: 10.880, type: "line", scene: "origins", sceneTitle: "The Seven Kingdoms", text: "One journey." },
    { id: "line-04", start: 13.980, type: "line", scene: "origins", sceneTitle: "The Seven Kingdoms", text: "You entered these halls as a student." },
    { id: "line-05", start: 18.080, type: "line", scene: "origins", sceneTitle: "The Seven Kingdoms", text: "You leave them as a Giant Slayer." },

    { id: "scene-rising", start: 25.860, type: "scene", scene: "rising", sceneTitle: "The Battles", productionCue: "Music begins to rise" },
    { id: "line-06", start: 33.700, type: "line", scene: "rising", sceneTitle: "The Battles", text: "There were lessons that tested you." },
    { id: "line-07", start: 37.240, type: "line", scene: "rising", sceneTitle: "The Battles", text: "Battles that challenged you." },
    { id: "line-08", start: 39.920, type: "line", scene: "rising", sceneTitle: "The Battles", text: "And giants that once seemed impossible to defeat." },
    { id: "line-09", start: 46.200, type: "line", scene: "rising", sceneTitle: "The Battles", text: "But you kept moving forward." },
    { id: "line-10", start: 49.640, type: "line", scene: "rising", sceneTitle: "The Battles", text: "One lesson at a time." },
    { id: "line-11", start: 52.980, type: "line", scene: "rising", sceneTitle: "The Battles", text: "One battle at a time." },
    { id: "line-12", start: 55.160, type: "line", scene: "rising", sceneTitle: "The Battles", text: "One kingdom at a time." },

    { id: "scene-larger", start: 57.600, type: "scene", scene: "command", sceneTitle: "What You Carry", productionCue: "Orchestra grows larger" },
    { id: "line-13", start: 68.900, type: "line", scene: "command", sceneTitle: "What You Carry", text: "You learned to build." },
    { id: "line-14", start: 71.220, type: "line", scene: "command", sceneTitle: "What You Carry", text: "You learned to troubleshoot." },
    { id: "line-15", start: 73.940, type: "line", scene: "command", sceneTitle: "What You Carry", text: "You learned to connect." },
    { id: "line-16", start: 75.920, type: "line", scene: "command", sceneTitle: "What You Carry", text: "You learned to defend." },
    { id: "line-17", start: 78.300, type: "line", scene: "command", sceneTitle: "What You Carry", text: "You learned to command systems" },
    { id: "line-18", start: 80.620, type: "line", scene: "command", sceneTitle: "What You Carry", text: "and rise into the clouds." },
    { id: "line-19", start: 84.700, type: "line", scene: "command", sceneTitle: "What You Carry", text: "Seven kingdoms now stand behind you." },
    { id: "line-20", start: 89.820, type: "line", scene: "command", sceneTitle: "What You Carry", text: "But everything you learned..." },
    { id: "line-21", start: 94.280, type: "line", scene: "command", sceneTitle: "What You Carry", text: "stands with you." },

    { id: "scene-climax", start: 96.140, type: "scene", scene: "climax", sceneTitle: "The Giant Slayer", productionCue: "Huge heroic orchestral climax" },
    { id: "line-22", start: 130.600, type: "line", scene: "climax", sceneTitle: "The Giant Slayer", text: "The battles were never meant to be easy." },
    { id: "line-23", start: 134.540, type: "line", scene: "climax", sceneTitle: "The Giant Slayer", text: "Neither were the giants." },
    { id: "line-24", start: 137.420, type: "line", scene: "climax", sceneTitle: "The Giant Slayer", text: "And this Academy was never meant to be the end of your journey." },
    { id: "line-25", start: 146.700, type: "line", scene: "climax", sceneTitle: "The Giant Slayer", text: "It was meant to prepare you..." },
    { id: "line-26", start: 152.620, type: "line", scene: "climax", sceneTitle: "The Giant Slayer", text: "for what comes next." },

    { id: "scene-settling", start: 157.940, type: "scene", scene: "beyond", sceneTitle: "Beyond the Gates", productionCue: "Music begins settling" },
    { id: "line-27", start: 158.440, type: "line", scene: "beyond", sceneTitle: "Beyond the Gates", text: "Beyond these gates are new systems to build." },
    { id: "line-28", start: 163.480, type: "line", scene: "beyond", sceneTitle: "Beyond the Gates", text: "New problems to solve." },
    { id: "line-29", start: 165.960, type: "line", scene: "beyond", sceneTitle: "Beyond the Gates", text: "New battles to fight." },
    { id: "line-30", start: 167.620, type: "line", scene: "beyond", sceneTitle: "Beyond the Gates", text: "And giants we cannot name yet." },

    { id: "scene-prologue", start: 171.300, type: "scene", scene: "forward", sceneTitle: "Step Forward", productionCue: "Prologue melody slowly returns" },
    { id: "line-31", start: 173.060, type: "line", scene: "forward", sceneTitle: "Step Forward", text: "The Academy has taught you all it can." },
    { id: "line-32", start: 178.120, type: "line", scene: "forward", sceneTitle: "Step Forward", text: "The gates are open." },
    { id: "line-33", start: 180.960, type: "line", scene: "forward", sceneTitle: "Step Forward", text: "Raise your sword." },
    { id: "line-34", start: 182.040, type: "line", scene: "forward", sceneTitle: "Step Forward", text: "Step forward." },
    { id: "line-35", start: 185.420, type: "line", scene: "forward", sceneTitle: "Step Forward", text: "Rise, Giant Slayer." },
    { id: "line-36", start: 188.000, type: "line", scene: "forward", sceneTitle: "Step Forward", text: "Your journey..." },
    { id: "line-37", start: 191.920, type: "line", scene: "forward", sceneTitle: "Step Forward", text: "has only begun." },

    { id: "scene-ending", start: 205.820, type: "scene", scene: "welcome", sceneTitle: "The Hall of Giant Slayers", productionCue: "Final quiet orchestral ending" },
    { id: "line-38", start: 208.500, type: "line", scene: "welcome", sceneTitle: "The Hall of Giant Slayers", text: "Welcome..." },
    { id: "line-39", start: 212.620, type: "line", scene: "welcome", sceneTitle: "The Hall of Giant Slayers", text: "to the ranks of the Giant Slayers." }
  ];

  // Approved cinematic storyboard. The production MP3 remains the only clock;
  // these visual plates never drive, pause, or otherwise alter audio playback.
  const PRODUCTION_SCENES = [
    { id: "academy-establishing", start: 0.000, src: "assets/finale/scenes/finale-000-academy-establishing.png", motion: "pull", description: "Giant Slayer Academy stands beyond the seven kingdoms at sunrise." },
    { id: "student-enters", start: 14.000, src: "assets/finale/scenes/finale-014-student-enters.png", motion: "push", description: "The learner enters the Academy as a student." },
    { id: "giant-slayer-reveal", start: 18.000, src: "assets/finale/scenes/finale-018-giant-slayer-reveal.png", motion: "pan-right", description: "The same learner is revealed as the developed Giant Slayer." },
    { id: "training-trials", start: 26.000, src: "assets/finale/scenes/finale-026-training-trials.png", motion: "pan-left", description: "The learner studies systems and endures the Academy training trials." },
    { id: "impossible-giant", start: 40.000, src: "assets/finale/scenes/finale-040-impossible-giant.png", motion: "pull", description: "A once-impossible giant towers beyond the learner." },
    { id: "seven-kingdom-path", start: 46.000, src: "assets/finale/scenes/finale-046-seven-kingdom-path.png", motion: "push", description: "The learner advances through the path of seven kingdoms." },
    { id: "build-troubleshoot", start: 69.000, src: "assets/finale/scenes/finale-069-build-troubleshoot.png", motion: "pan-right", description: "The learner builds hardware and restores a failed system." },
    { id: "connect-defend", start: 74.000, src: "assets/finale/scenes/finale-074-connect-defend.png", motion: "pan-left", description: "The learner connects networks and defends them." },
    { id: "systems-cloud", start: 78.000, src: "assets/finale/scenes/finale-078-systems-cloud.png", motion: "push", description: "The learner commands systems and rises into the clouds." },
    { id: "kingdoms-united", start: 85.000, src: "assets/finale/scenes/finale-085-kingdoms-united.png", motion: "pull", description: "The seven completed kingdoms stand united behind the learner." },
    { id: "aplus-core1", start: 96.000, src: "assets/finale/scenes/finale-096-aplus-core1.png", motion: "pan-right", description: "A plus Core 1 kingdom and its Maestro." },
    { id: "aplus-core2", start: 101.000, src: "assets/finale/scenes/finale-101-aplus-core2.png", motion: "pan-left", description: "A plus Core 2 kingdom and its Maestro." },
    { id: "network-plus", start: 106.000, src: "assets/finale/scenes/finale-106-network-plus.png", motion: "push", description: "Network plus kingdom and its Maestro." },
    { id: "security-plus", start: 111.000, src: "assets/finale/scenes/finale-111-security-plus.png", motion: "pull", description: "Security plus kingdom and its Maestro." },
    { id: "linux", start: 116.000, src: "assets/finale/scenes/finale-116-linux.png", motion: "pan-right", description: "Linux Essentials kingdom and its penguin Maestro." },
    { id: "aws", start: 121.000, src: "assets/finale/scenes/finale-121-aws.png", motion: "pan-left", description: "AWS Cloud Practitioner kingdom and its Maestro." },
    { id: "cloud-plus", start: 126.000, src: "assets/finale/scenes/finale-126-cloud-plus.png", motion: "push", description: "Cloud plus kingdom and its Maestro." },
    { id: "future-beyond-gates", start: 130.600, src: "assets/finale/scenes/finale-158-future-beyond-gates.png", motion: "pull", description: "Unknown systems and distant giants wait beyond the Academy gates." },
    { id: "graduation-eight", start: 173.000, src: "assets/finale/scenes/finale-173-graduation-eight.png", motion: "push", description: "The Giant Slayer graduates beside all seven Academy Maestros." },
    { id: "gates-open", start: 178.000, src: "assets/finale/scenes/finale-178-gates-open.png", motion: "pull", description: "The Academy gates open before the Giant Slayer while the Maestros remain behind." },
    { id: "sword-raised", start: 181.000, src: "assets/finale/scenes/finale-181-sword-raised.png", motion: "push", description: "The Giant Slayer raises his sword toward the open sky." },
    { id: "step-forward", start: 183.500, src: "assets/finale/scenes/finale-182-step-forward.png", motion: "pan-right", description: "The Giant Slayer crosses the Academy threshold." },
    { id: "horizon-departure", start: 188.000, src: "assets/finale/scenes/finale-188-horizon-departure.png", motion: "pull", description: "The Giant Slayer walks toward the horizon with the Academy behind him." },
    { id: "hall-recognition", start: 206.000, src: "assets/finale/scenes/finale-206-hall-recognition.png", motion: "push", description: "The graduate is welcomed into the Hall of Giant Slayers beside all seven Maestros." }
  ];

  const PRODUCTION_TITLES = [
    { id: "seven-kingdoms", start: 4.800, end: 13.800, text: "SEVEN KINGDOMS. SEVEN BATTLES. ONE JOURNEY." },
    { id: "rise", start: 185.420, end: 188.000, text: "RISE, GIANT SLAYER." },
    { id: "welcome", start: 212.620, end: MASTER_DURATION_SECONDS, text: "WELCOME TO THE RANKS OF THE GIANT SLAYERS." }
  ];

  function normalizeCues(cues, durationSeconds) {
    const normalized = cues
      .filter(cue => cue && Number.isFinite(Number(cue.start)))
      .map(cue => ({
        id: String(cue.id || cue.start),
        start: Math.max(0, Number(cue.start)),
        type: cue.type === "scene" ? "scene" : "line",
        scene: String(cue.scene || "origins"),
        sceneTitle: String(cue.sceneTitle || "Rise, Giant Slayer"),
        productionCue: String(cue.productionCue || ""),
        text: String(cue.text || "")
      }))
      .sort((a, b) => a.start - b.start);
    return normalized.map((cue, index) => ({
      ...cue,
      end: normalized[index + 1]?.start ?? durationSeconds
    }));
  }

  function normalizeScenes(scenes, durationSeconds) {
    const normalized = scenes
      .filter(scene => scene && Number.isFinite(Number(scene.start)) && typeof scene.src === "string" && scene.src)
      .map(scene => ({
        id: String(scene.id || scene.start),
        start: Math.max(0, Number(scene.start)),
        src: scene.src,
        motion: ["push", "pull", "pan-left", "pan-right"].includes(scene.motion) ? scene.motion : "push",
        description: String(scene.description || "Giant Slayer Academy Finale scene.")
      }))
      .sort((a, b) => a.start - b.start);
    return normalized.map((scene, index) => ({
      ...scene,
      end: normalized[index + 1]?.start ?? durationSeconds
    }));
  }

  function normalizeTitles(titles, durationSeconds) {
    return titles
      .filter(title => title && Number.isFinite(Number(title.start)) && typeof title.text === "string")
      .map(title => ({
        id: String(title.id || title.start),
        start: Math.max(0, Number(title.start)),
        end: Math.min(durationSeconds, Math.max(Number(title.start), Number(title.end) || durationSeconds)),
        text: title.text
      }))
      .sort((a, b) => a.start - b.start);
  }

  // A deployment may assign this object before the player loads; the checked-
  // in production master and synchronized map remain the default.
  const suppliedConfig = window.GSA_FINALE_CONFIG || {};
  const durationSeconds = Math.max(0, Number(suppliedConfig.durationSeconds) || MASTER_DURATION_SECONDS);
  const cueSource = Array.isArray(suppliedConfig.cues) && suppliedConfig.cues.length
    ? suppliedConfig.cues
    : PRODUCTION_CUES;
  const config = {
    musicSrc: typeof suppliedConfig.musicSrc === "string" && suppliedConfig.musicSrc
      ? suppliedConfig.musicSrc
      : PRODUCTION_MUSIC_SRC,
    durationSeconds,
    cues: normalizeCues(cueSource, durationSeconds),
    scenes: normalizeScenes(Array.isArray(suppliedConfig.scenes) && suppliedConfig.scenes.length ? suppliedConfig.scenes : PRODUCTION_SCENES, durationSeconds),
    titles: normalizeTitles(Array.isArray(suppliedConfig.titles) && suppliedConfig.titles.length ? suppliedConfig.titles : PRODUCTION_TITLES, durationSeconds)
  };

  let frameId = 0;
  let activeCueId = "";
  let activeSceneId = "";
  let activeTitleId = "";
  let activeSceneLayer = 0;
  let founderHoldTimer = 0;
  let founderRevealTimer = 0;
  const POST_FINALE_HOLD_MS = 1200;
  const POST_FINALE_FADE_MS = 1600;
  let experienceStarted = false;

  function formatTime(seconds) {
    const safe = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function duration() {
    // Keep the visible/seekable production timeline aligned to the approved
    // cue map. Some MP3 decoders expose encoder padding beyond this duration;
    // playback still ends naturally on the untouched audio element.
    return config.durationSeconds;
  }

  function currentTime() {
    return Number(elements.music.currentTime) || 0;
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
    elements.stage.dataset.productionCue = cue?.productionCue || "";
  }

  function activeCueAt(time) {
    return config.cues.find(cue => time >= cue.start && time < cue.end)
      || (time >= config.durationSeconds ? config.cues[config.cues.length - 1] : config.cues[0]);
  }

  function activeSceneAt(time) {
    return config.scenes.find(scene => time >= scene.start && time < scene.end)
      || (time >= config.durationSeconds ? config.scenes[config.scenes.length - 1] : config.scenes[0]);
  }

  function activeTitleAt(time) {
    return config.titles.find(title => time >= title.start && time < title.end)
      || (time >= config.durationSeconds ? config.titles[config.titles.length - 1] : null);
  }

  function setScene(scene) {
    if (!scene || scene.id === activeSceneId) return;
    const nextLayerIndex = activeSceneId ? 1 - activeSceneLayer : activeSceneLayer;
    const nextLayer = nextLayerIndex === 0 ? elements.sceneA : elements.sceneB;
    const previousLayer = nextLayerIndex === 0 ? elements.sceneB : elements.sceneA;

    nextLayer.className = "finale-scene-layer";
    nextLayer.src = scene.src;
    nextLayer.alt = "";
    // Restart the restrained camera treatment only when a new plate becomes active.
    void nextLayer.offsetWidth;
    nextLayer.classList.add("is-active", `motion-${scene.motion}`);
    previousLayer.classList.remove("is-active");

    activeSceneLayer = nextLayerIndex;
    activeSceneId = scene.id;
    elements.stage.dataset.scene = scene.id;
    elements.sceneDescription.textContent = scene.description;
    elements.stage.setAttribute("aria-label", `Academy Finale — ${scene.description}`);
  }

  function setTitle(title) {
    const id = title?.id || "";
    if (id === activeTitleId) return;
    activeTitleId = id;
    elements.titleText.textContent = title?.text || "";
    elements.titleCard.classList.toggle("is-visible", Boolean(title));
  }

  function renderPresentation(time) {
    setCue(activeCueAt(time));
    setScene(activeSceneAt(time));
    setTitle(activeTitleAt(time));
  }

  function preloadScenes() {
    config.scenes.forEach(scene => {
      const image = new Image();
      image.src = scene.src;
    });
  }

  function renderTimeline() {
    const total = duration();
    const now = Math.min(currentTime(), total || currentTime());
    elements.seek.max = String(total || 0);
    elements.seek.value = String(total ? Math.min(now, total) : 0);
    elements.seek.disabled = total <= 0;
    elements.time.textContent = `${formatTime(now)} / ${formatTime(total)}`;
    renderPresentation(now);
    if (!elements.music.paused && !elements.music.ended) {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(renderTimeline);
    }
  }

  function pauseTimeline() {
    elements.music.pause();
    cancelAnimationFrame(frameId);
    elements.playPause.textContent = "▶ Play";
    setPlaybackStatus("Finale paused.");
  }

  async function playTimeline() {
    try {
      await elements.music.play();
      hideManualStart();
      elements.playPause.disabled = false;
      elements.playPause.textContent = "⏸ Pause";
      setPlaybackStatus("Finale playing — production master is the synchronization clock.");
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
    elements.music.pause();
    elements.music.currentTime = 0;
    activeCueId = "";
    activeSceneId = "";
    activeTitleId = "";
    elements.experience.classList.remove("is-complete");
    renderPresentation(0);
    renderTimeline();
  }

  function resetFounderThankYou() {
    window.clearTimeout(founderHoldTimer);
    window.clearTimeout(founderRevealTimer);
    founderHoldTimer = 0;
    founderRevealTimer = 0;
    elements.experience.classList.remove("is-founder-transition", "is-founder-visible");
    elements.playerState.classList.remove("hidden");
    elements.founderThankYou.classList.add("hidden");
    elements.founderThankYou.classList.remove("is-visible");
  }

  function showFounderThankYou() {
    founderHoldTimer = window.setTimeout(() => {
      elements.experience.classList.add("is-founder-transition");
      founderRevealTimer = window.setTimeout(() => {
        elements.playerState.classList.add("hidden");
        elements.founderThankYou.classList.remove("hidden");
        elements.experience.classList.add("is-founder-visible");
        window.requestAnimationFrame(() => {
          elements.founderThankYou.classList.add("is-visible");
          elements.founderThankYou.focus({ preventScroll: true });
        });
      }, POST_FINALE_FADE_MS);
    }, POST_FINALE_HOLD_MS);
  }

  function beginExperience({ replay = false } = {}) {
    if (!experienceStarted) {
      experienceStarted = true;
      elements.unlocked.classList.add("hidden");
      elements.experience.classList.remove("hidden");
    }
    resetFounderThankYou();
    elements.experience.classList.remove("is-complete");
    if (!previewMode) ui.markAcademyFinaleViewed();
    if (replay) resetTimeline();
    playTimeline();
  }

  function renderCompletion(completion = ui.syncAcademyCompletion()) {
    const accessGranted = completion.unlocked || previewMode;
    elements.completionStatus.textContent = previewMode
      ? `Developer preview — learner entitlement remains ${completion.completedCount}/${completion.totalCount}.`
      : `${completion.completedCount}/${completion.totalCount} certification tracks complete.`;
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
    if (!elements.music.getAttribute("src")) elements.music.src = config.musicSrc;
    elements.music.volume = Number(elements.volume.value);
    renderTimeline();
  }

  elements.begin.addEventListener("click", () => beginExperience());
  elements.manualStartButton.addEventListener("click", () => playTimeline());
  elements.playPause.addEventListener("click", () => {
    if (!elements.music.paused) pauseTimeline();
    else playTimeline();
  });
  elements.mute.addEventListener("click", () => {
    const muted = !elements.music.muted;
    elements.music.muted = muted;
    elements.mute.setAttribute("aria-pressed", String(muted));
    elements.mute.textContent = muted ? "🔇 Unmute" : "🔊 Mute";
  });
  elements.volume.addEventListener("input", () => {
    elements.music.volume = Number(elements.volume.value);
  });
  elements.replay.addEventListener("click", () => beginExperience({ replay: true }));
  elements.founderReplay.addEventListener("click", () => beginExperience({ replay: true }));
  elements.seek.addEventListener("input", () => {
    elements.music.currentTime = Number(elements.seek.value) || 0;
    activeCueId = "";
    if (elements.music.currentTime < duration()) elements.experience.classList.remove("is-complete");
    renderTimeline();
  });
  elements.music.addEventListener("loadedmetadata", renderTimeline);
  elements.music.addEventListener("timeupdate", renderTimeline);
  elements.music.addEventListener("play", () => {
    elements.playPause.textContent = "⏸ Pause";
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(renderTimeline);
  });
  elements.music.addEventListener("pause", () => {
    if (elements.music.ended) return;
    elements.playPause.textContent = "▶ Play";
    renderTimeline();
  });
  elements.music.addEventListener("ended", () => {
    cancelAnimationFrame(frameId);
    elements.playPause.textContent = "▶ Play";
    elements.experience.classList.add("is-complete");
    setPlaybackStatus("Finale complete. Replay remains available.");
    renderTimeline();
    showFounderThankYou();
  });
  elements.music.addEventListener("error", () => {
    showManualStart("The production Finale audio could not be loaded. Check the local asset and try again.");
    setPlaybackStatus("Production master unavailable; learner entitlement remains unchanged.");
  });
  window.addEventListener("hydra-academy-completion-updated", event => renderCompletion(event.detail));

  preloadScenes();
  renderPresentation(0);
  renderCompletion();
}());
