(function () {
  "use strict";

  const CONFIG = Object.freeze({
    "aplus-core1": Object.freeze({
      title: "The Technician's Forge",
      certification: "A+ Core 1",
      src: "assets/soundtracks/the-technicians-forge-aplus-core1.mp3",
      expectedBytes: 4685079,
      expectedSha256: "28633510D613939ED79CD7BEB32585F6A72CF4F0F70658F4CD64C384F8D6A912"
    }),
    "aplus-core2": Object.freeze({
      title: "Guardian of the Systems",
      certification: "A+ Core 2",
      src: "assets/soundtracks/guardian-of-the-systems-aplus-core2.mp3",
      expectedBytes: 4538710,
      expectedSha256: "8417B692FBADE0EDAB91397A363107EA870A4ACA21103C39F77EF694C50D0153"
    }),
    "network-plus": Object.freeze({
      title: "The Connected Kingdom",
      certification: "Network+",
      src: "assets/soundtracks/the-connected-kingdom-network-plus.mp3",
      expectedBytes: 4591594,
      expectedSha256: "861CD072789FD7B2372E072D54EDFF4A49721358594A9AD78BBC6351F6D55731"
    }),
    "security-plus": Object.freeze({
      title: "Defend the Citadel",
      certification: "Security+",
      src: "assets/soundtracks/defend-the-citadel-security-plus.mp3",
      expectedBytes: 4496041,
      expectedSha256: "74A48659D941A8C1D14BFC81F509A6B11B40C04A8C52B2468B90B583306DE8C9"
    }),
    "linux-essentials": Object.freeze({
      title: "The Terminal Sanctum",
      certification: "Linux Essentials",
      src: "assets/soundtracks/the-terminal-sanctum-linux-essentials.mp3",
      expectedBytes: 4356141,
      expectedSha256: "B641060D27AB804964B1A6887718368A755D3E0639F6936877C0843F28D9B564"
    }),
    "aws-cloud-practitioner": Object.freeze({
      title: "Guide of the Clouds",
      certification: "AWS Cloud Practitioner",
      src: "assets/soundtracks/guide-of-the-clouds-aws-cloud-practitioner.mp3",
      expectedBytes: 4456043,
      expectedSha256: "F882A45D383272EF3B77FF7C1D0BBD8B7501BAA4B402D6193D1DFB6B14FD0DE5"
    }),
    "cloud-plus": Object.freeze({
      title: "Citadel Above the Clouds",
      certification: "Cloud+",
      src: "assets/soundtracks/citadel-above-the-clouds-cloud-plus.mp3",
      expectedBytes: 4930252,
      expectedSha256: "A7CD4FC0A8C04F066850752D0A1A6166D81247C3DAA1909CEA5CC69B19E69C04"
    })
  });

  const ALIASES = Object.freeze({
    "aplus-core1": "aplus-core1",
    "a-plus-core-1": "aplus-core1",
    "aplus-core2": "aplus-core2",
    "a-plus-core-2": "aplus-core2",
    "network-plus": "network-plus",
    "security-plus": "security-plus",
    "linux-essentials": "linux-essentials",
    "aws-cloud-practitioner": "aws-cloud-practitioner",
    "cloud-plus": "cloud-plus",
    "cloud+": "cloud-plus",
    "comptia-cloud-plus": "cloud-plus"
  });
  const PREFS_KEY = "gsa-certification-soundtrack-preferences-v1";
  const SESSION_PREFIX = "gsa-certification-soundtrack-session-v1";
  const COORDINATION_KEY = "gsa-certification-soundtrack-coordination-v1";
  const CHANNEL_NAME = "gsa-certification-soundtrack-v1";
  const ownerId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  function safeParse(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function safeGet(storage, key) {
    try {
      return storage.getItem(key);
    } catch (_error) {
      return null;
    }
  }

  function safeSet(storage, key, value) {
    try {
      storage.setItem(key, value);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function clampVolume(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.min(1, Math.max(0, numeric)) : 0.55;
  }

  function canonicalize(value) {
    const normalized = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\+/g, "-plus")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return ALIASES[normalized] || normalized;
  }

  function resolveCertification() {
    const params = new URLSearchParams(window.location.search);
    const candidates = [
      document.body && document.body.dataset.certification,
      params.get("certification"),
      params.get("cert")
    ];

    for (const candidate of candidates) {
      const certification = canonicalize(candidate);
      if (CONFIG[certification]) return certification;
    }

    const path = window.location.pathname.toLowerCase();
    const pathMappings = [
      ["aplus-core1", "aplus-core1"],
      ["aplus-core2", "aplus-core2"],
      ["network-", "network-plus"],
      ["hydra-quiz", "network-plus"],
      ["security-plus", "security-plus"],
      ["linux-", "linux-essentials"],
      ["aws-cloud-practitioner", "aws-cloud-practitioner"],
      ["cloud-plus", "cloud-plus"]
    ];
    const match = pathMappings.find(([fragment]) => path.includes(fragment));
    return match ? match[1] : "";
  }

  const certificationId = resolveCertification();
  const soundtrack = CONFIG[certificationId];
  if (!soundtrack) return;

  const pageName = window.location.pathname.split("/").pop().toLowerCase();
  const policy = document.body.dataset.soundtrackPolicy
    || (pageName.endsWith("-quiz.html") || pageName === "hydra-quiz.html" || pageName === "pbq-arena.html" || pageName === "linux-lab.html" ? "focus" : "ambient");
  const sessionKey = `${SESSION_PREFIX}:${certificationId}`;
  const storedPrefs = safeParse(safeGet(localStorage, PREFS_KEY), {});
  const storedSession = safeParse(safeGet(sessionStorage, sessionKey), {});
  const preferences = {
    volume: clampVolume(storedPrefs.volume),
    muted: Boolean(storedPrefs.muted),
    collapsed: Boolean(storedPrefs.collapsed)
  };
  const playback = {
    currentTime: Math.max(0, Number(storedSession.currentTime) || 0),
    intentPlaying: Boolean(storedSession.intentPlaying)
  };
  let focusHeld = policy === "focus";
  let visibilityWasPlaying = false;
  let mediaWasPlaying = false;
  let lastPersistedSecond = -1;

  const audio = document.createElement("audio");
  audio.className = "gsa-soundtrack-audio";
  audio.dataset.certification = certificationId;
  audio.src = soundtrack.src;
  audio.preload = "metadata";
  audio.loop = true;
  audio.hidden = true;
  audio.volume = preferences.volume;
  audio.muted = preferences.muted;

  const dock = document.createElement("aside");
  dock.className = `gsa-soundtrack${preferences.collapsed ? " is-collapsed" : ""}`;
  dock.dataset.policy = policy;
  dock.setAttribute("aria-label", `${soundtrack.certification} kingdom music controls`);

  const dockHeader = document.createElement("div");
  dockHeader.className = "gsa-soundtrack-header";
  const identity = document.createElement("div");
  identity.className = "gsa-soundtrack-identity";
  identity.innerHTML = `<span class="gsa-soundtrack-kicker">KINGDOM MUSIC</span><strong>${soundtrack.title}</strong>`;
  const collapse = document.createElement("button");
  collapse.className = "gsa-soundtrack-collapse";
  collapse.type = "button";
  collapse.setAttribute("aria-expanded", String(!preferences.collapsed));
  collapse.setAttribute("aria-label", preferences.collapsed ? "Expand kingdom music controls" : "Collapse kingdom music controls");
  collapse.textContent = preferences.collapsed ? "♫" : "−";
  dockHeader.append(identity, collapse);

  const panel = document.createElement("div");
  panel.className = "gsa-soundtrack-panel";
  const buttons = document.createElement("div");
  buttons.className = "gsa-soundtrack-buttons";
  const playPause = document.createElement("button");
  playPause.type = "button";
  playPause.className = "gsa-soundtrack-button gsa-soundtrack-play";
  const mute = document.createElement("button");
  mute.type = "button";
  mute.className = "gsa-soundtrack-button gsa-soundtrack-mute";
  buttons.append(playPause, mute);

  const volumeLabel = document.createElement("label");
  volumeLabel.className = "gsa-soundtrack-volume";
  volumeLabel.textContent = "Volume";
  const volume = document.createElement("input");
  volume.type = "range";
  volume.min = "0";
  volume.max = "1";
  volume.step = "0.05";
  volume.value = String(preferences.volume);
  volume.setAttribute("aria-label", "Kingdom music volume");
  volumeLabel.append(volume);

  const status = document.createElement("p");
  status.className = "gsa-soundtrack-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  panel.append(buttons, volumeLabel, status);
  dock.append(dockHeader, panel);
  document.body.append(audio, dock);
  document.body.classList.add("gsa-soundtrack-mounted");

  function persistPreferences() {
    safeSet(localStorage, PREFS_KEY, JSON.stringify(preferences));
  }

  function persistPlayback() {
    if (Number.isFinite(audio.currentTime)) playback.currentTime = audio.currentTime;
    safeSet(sessionStorage, sessionKey, JSON.stringify(playback));
  }

  function setStatus(message, tone) {
    status.textContent = message;
    status.dataset.tone = tone || "neutral";
  }

  function updateControls() {
    const playing = !audio.paused;
    playPause.textContent = playing ? "❚❚ Pause" : playback.intentPlaying ? "▶ Resume" : "▶ Play";
    playPause.setAttribute("aria-label", playing ? "Pause kingdom music" : "Play kingdom music");
    playPause.setAttribute("aria-pressed", String(playing));
    mute.textContent = audio.muted ? "🔇 Unmute" : "🔊 Mute";
    mute.setAttribute("aria-label", audio.muted ? "Unmute kingdom music" : "Mute kingdom music");
    mute.setAttribute("aria-pressed", String(audio.muted));
  }

  function coordinate(message) {
    if (!message || message.ownerId === ownerId || message.type !== "claim") return;
    if (!audio.paused) audio.pause();
    playback.intentPlaying = false;
    persistPlayback();
    updateControls();
    setStatus("Paused because kingdom music started in another tab.", "notice");
  }

  let channel = null;
  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.addEventListener("message", (event) => coordinate(event.data));
  }

  window.addEventListener("storage", (event) => {
    if (event.key === COORDINATION_KEY && event.newValue) {
      coordinate(safeParse(event.newValue, null));
    }
  });

  function claimPlayback() {
    const message = { type: "claim", ownerId, certificationId, sentAt: Date.now() };
    if (channel) channel.postMessage(message);
    safeSet(localStorage, COORDINATION_KEY, JSON.stringify(message));
  }

  async function startPlayback(options) {
    const settings = options || {};
    if (settings.userInitiated) focusHeld = false;
    if (focusHeld) {
      updateControls();
      setStatus("Paused for focus. Press Play whenever you want the music.", "focus");
      return false;
    }

    playback.intentPlaying = true;
    persistPlayback();
    try {
      await audio.play();
      claimPlayback();
      setStatus(policy === "focus" ? "Playing by your choice on this focus page." : `Playing across the ${soundtrack.certification} kingdom.`, "playing");
      updateControls();
      return true;
    } catch (_error) {
      updateControls();
      setStatus("Your browser paused automatic audio. Press Resume to continue.", "blocked");
      return false;
    }
  }

  function userPause() {
    playback.intentPlaying = false;
    audio.pause();
    persistPlayback();
    updateControls();
    setStatus("Paused by you.", "neutral");
  }

  function restorePosition() {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const restored = playback.currentTime >= audio.duration - 0.5 ? 0 : playback.currentTime;
    try {
      audio.currentTime = restored;
    } catch (_error) {
      // The metadata event will provide another opportunity on browsers that defer seeking.
    }
  }

  collapse.addEventListener("click", () => {
    preferences.collapsed = dock.classList.toggle("is-collapsed");
    collapse.setAttribute("aria-expanded", String(!preferences.collapsed));
    collapse.setAttribute("aria-label", preferences.collapsed ? "Expand kingdom music controls" : "Collapse kingdom music controls");
    collapse.textContent = preferences.collapsed ? "♫" : "−";
    persistPreferences();
  });

  playPause.addEventListener("click", () => {
    if (audio.paused) startPlayback({ userInitiated: true });
    else userPause();
  });

  mute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    preferences.muted = audio.muted;
    persistPreferences();
    updateControls();
    setStatus(audio.muted ? "Kingdom music muted." : "Kingdom music unmuted.", "neutral");
  });

  volume.addEventListener("input", () => {
    preferences.volume = clampVolume(volume.value);
    audio.volume = preferences.volume;
    persistPreferences();
    setStatus(`Volume ${Math.round(preferences.volume * 100)}%.`, "neutral");
  });

  audio.addEventListener("loadedmetadata", () => {
    restorePosition();
    if (policy === "focus") {
      setStatus(playback.intentPlaying
        ? "Music was playing, but this focus page paused it. Press Resume if desired."
        : "Focus page: kingdom music is ready but paused.", "focus");
    } else if (playback.intentPlaying) {
      startPlayback();
    } else {
      setStatus(`Ready. Press Play to begin the ${soundtrack.certification} soundtrack.`, "neutral");
    }
    updateControls();
  });

  audio.addEventListener("timeupdate", () => {
    const wholeSecond = Math.floor(audio.currentTime);
    if (wholeSecond !== lastPersistedSecond) {
      lastPersistedSecond = wholeSecond;
      persistPlayback();
    }
  });
  audio.addEventListener("play", updateControls);
  audio.addEventListener("pause", updateControls);
  audio.addEventListener("error", () => setStatus(`The ${soundtrack.certification} soundtrack could not be loaded.`, "error"));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      visibilityWasPlaying = !audio.paused;
      if (visibilityWasPlaying) audio.pause();
      persistPlayback();
      return;
    }
    if (visibilityWasPlaying && playback.intentPlaying && !focusHeld) {
      visibilityWasPlaying = false;
      startPlayback();
    }
  });

  window.addEventListener("gsa:media-start", () => {
    mediaWasPlaying = !audio.paused && playback.intentPlaying;
    if (!audio.paused) audio.pause();
    setStatus("Paused while other Academy audio is playing.", "focus");
  });
  window.addEventListener("gsa:media-end", () => {
    if (mediaWasPlaying && playback.intentPlaying && !focusHeld) startPlayback();
    mediaWasPlaying = false;
  });

  window.addEventListener("pagehide", () => {
    persistPlayback();
    audio.pause();
  });

  if (audio.readyState >= 1) {
    restorePosition();
  } else {
    setStatus(policy === "focus" ? "Focus page: loading kingdom music in a paused state." : `Loading ${soundtrack.certification} kingdom music…`, policy === "focus" ? "focus" : "neutral");
  }
  updateControls();

  window.GSACertificationSoundtrack = Object.freeze({
    certificationId,
    policy,
    config: soundtrack,
    play: () => startPlayback({ userInitiated: true }),
    pause: userPause,
    snapshot: () => ({
      certificationId,
      policy,
      paused: audio.paused,
      muted: audio.muted,
      volume: audio.volume,
      currentTime: audio.currentTime,
      intentPlaying: playback.intentPlaying,
      focusHeld
    })
  });
})();
