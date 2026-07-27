(function () {
  "use strict";

  const BANK_URL = "json/linux-essentials/labs/proof-of-concept.json";
  const STORAGE_KEY = "hydra-linux-labs:v1:progress";

  const grid = document.getElementById("linuxMissionGrid");
  const progress = document.getElementById("linuxLabsProgress");
  const progressText = document.getElementById("linuxLabsProgressText");
  const kingdomProgress = document.getElementById("linuxKingdomProgress");
  const error = document.getElementById("linuxLabsError");
  const errorMessage = document.getElementById("linuxLabsErrorMessage");

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function difficultyLabel(level) {
    return `Level ${level}`;
  }

  function render(bank) {
    const saved = getProgress();
    const completed = bank.missions.filter(mission => saved[mission.id]?.completed).length;
    const percentage = Math.round((completed / bank.missions.length) * 100);
    progress.max = bank.missions.length;
    progress.value = completed;
    progressText.textContent = `${completed} of ${bank.missions.length} complete · ${percentage}%`;
    kingdomProgress.textContent = `${completed} of ${bank.missions.length} Batch 1 missions complete`;

    grid.replaceChildren(...bank.missions.map(mission => {
      const card = document.createElement("article");
      card.className = "linux-mission-card";
      const status = saved[mission.id]?.completed ? "Complete" : "Ready";
      const best = saved[mission.id]?.bestScore;
      card.innerHTML = `
        <span class="linux-mission-number">MISSION ${String(mission.missionNumber).padStart(2, "0")}</span>
        <h3>${mission.title}</h3>
        <p>${mission.objective}</p>
        <dl class="linux-mission-meta">
          <div><dt>Difficulty</dt><dd>${difficultyLabel(mission.difficulty)}</dd></div>
          <div><dt>Status</dt><dd>${status}</dd></div>
          <div><dt>Best result</dt><dd>${best === undefined ? "Not attempted" : `${best}%`}</dd></div>
        </dl>
        <a class="linux-action-button" href="linux-lab.html?mission=${encodeURIComponent(mission.id)}">
          ${saved[mission.id]?.completed ? "Replay Mission" : "Begin Lesson"}
        </a>
      `;
      return card;
    }));
  }

  fetch(BANK_URL)
    .then(response => {
      if (!response.ok) throw new Error(`Mission bank returned HTTP ${response.status}.`);
      return response.json();
    })
    .then(bank => {
      if (!Array.isArray(bank.missions) || bank.missions.length !== 7) {
        throw new Error("Linux Labs Batch 1 must contain exactly seven missions.");
      }
      render(bank);
    })
    .catch(problem => {
      error.classList.remove("hidden");
      errorMessage.textContent = problem.message;
    });
})();
