(function () {
  "use strict";

  const ui = window.HydraCampaignUI;
  const campaignDashboard = document.getElementById("campaignDashboard");
  const academySummary = document.getElementById("academySummary");
  if (!ui || !campaignDashboard || !academySummary) return;

  const achievementOrder = ["firstObjective", "firstWorld", "certificationChampion", "hydraSlayer", "finalBoss"];
  const campaignOrder = [
    "hydra-aplus-core1-progress-v1",
    "hydra-aplus-core2-progress-v1",
    "hydra-network-plus-progress-v1",
    "hydra-security-plus-progress-v1",
    "hydra-cloud-plus-progress-v1",
    "hydra-linux-essentials-progress-v1",
    "hydra-aws-cloud-practitioner-progress-v1"
  ];
  const summaries = campaignOrder.map(key => ui.getCampaignSummary(key)).filter(Boolean);

  function metric(label, value) {
    return `<div class="dashboard-metric"><strong>${value}</strong><span>${label}</span></div>`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function percent(value) {
    return value == null ? "No evidence" : `${value}%`;
  }

  const diagnosticLabels = {
    insufficient: ["Insufficient Evidence", "insufficient"],
    strong: ["Strong Evidence", "is-ready"],
    "needs-work": ["Needs Work", "needs-work"]
  };

  function diagnosticBadge(value) {
    const [label, className] = diagnosticLabels[value] || diagnosticLabels.insufficient;
    return `<span class="dashboard-status ${className}">${label}</span>`;
  }

  function objectiveSweepMarkup(summary) {
    const rows = summary.intelligence.objectiveSweeps;
    const worlds = Object.keys(summary.config.objectivesByWorld).map(world => {
      const objectives = rows.filter(row => row.world === world);
      const mastered = objectives.filter(row => row.mastered).length;
      const objectiveRows = objectives.map(row => `
        <article class="dashboard-evidence-row">
          <div class="dashboard-evidence-heading">
            <strong>Objective ${escapeHtml(row.objective)}</strong>
            <span class="dashboard-status-group"><span class="dashboard-status ${row.mastered ? "is-ready" : "needs-work"}">${row.mastered ? "Mastered" : "Not Mastered"}</span>${diagnosticBadge(row.diagnostic)}</span>
          </div>
          <div class="dashboard-evidence-metrics">
            <span><b>Best Sweep:</b> ${row.total ? `${row.bestScore}/${row.total}` : "No completed evidence"}</span>
            <span><b>Recognition:</b> ${row.answered ? `${row.correct}/${row.answered} (${row.accuracy}%)` : "No evidence"}</span>
            <span><b>Retained Sessions:</b> ${row.retainedSessions}</span>
          </div>
          <a href="${row.href}" class="dashboard-evidence-link">Train Objective ${escapeHtml(row.objective)}</a>
        </article>`).join("");
      return `<details class="dashboard-world-details"><summary>World ${world} <span>${mastered}/${objectives.length} mastered</span></summary><div class="dashboard-evidence-list">${objectiveRows}</div></details>`;
    }).join("");
    return `<div class="dashboard-world-list">${worlds}</div>`;
  }

  function mixedReviewMarkup(summary) {
    const evidence = summary.intelligence.mixedReview;
    if (!evidence.modes.length) return `<p class="dashboard-empty-state">No completed World 6 Mixed Review sessions yet.</p>`;
    return `<div class="dashboard-reinforcement-grid">${evidence.modes.map(mode => `
      <article class="dashboard-evidence-row">
        <strong>${escapeHtml(mode.label)}</strong>
        <span>${mode.retainedSessions} retained session${mode.retainedSessions === 1 ? "" : "s"}</span>
        <span>Last: ${percent(mode.lastPercent)} • Best: ${percent(mode.bestPercent)}</span>
      </article>`).join("")}</div>`;
  }

  function bossRushMarkup(summary) {
    return `<div class="dashboard-reinforcement-grid">${summary.intelligence.bossRush.map(mode => `
      <article class="dashboard-evidence-row">
        <div class="dashboard-evidence-heading"><strong>${escapeHtml(mode.label)}</strong><span class="dashboard-status ${mode.passed ? "is-ready" : "needs-work"}">${mode.passed ? "Passed" : mode.completed ? "Keep Training" : "Not Attempted"}</span></div>
        <span>Attempts: ${mode.attempts}</span>
        <span>Last: ${percent(mode.lastPercent)} • Best: ${mode.attempts ? percent(mode.bestPercent) : "No evidence"}</span>
      </article>`).join("")}</div>`;
  }

  function practiceExamMarkup(summary) {
    const practice = summary.intelligence.practiceExams;
    const resultLookup = new Map(practice.results.map(result => [String(result.exam), result]));
    const exams = Array.from({ length: 6 }, (_, index) => {
      const exam = String(index + 1);
      const result = resultLookup.get(exam);
      if (!result) return `<article class="dashboard-exam-result"><strong>Practice Exam ${exam}</strong><span>No submitted result</span></article>`;
      return `<article class="dashboard-exam-result">
        <div class="dashboard-evidence-heading"><strong>Practice Exam ${exam}</strong><span class="dashboard-status ${result.passed ? "is-ready" : "needs-work"}">${result.passed ? "Ready" : "Keep Training"}</span></div>
        <span>${Number(result.correct) || 0}/${Number(result.total) || 0} (${Number(result.percent) || 0}%)</span>
      </article>`;
    }).join("");
    const domains = practice.domains.length ? practice.domains.map(domain => `
      <article class="dashboard-domain-result ${domain.percent < 85 ? "needs-study" : ""}">
        <strong>Domain ${escapeHtml(domain.id)} — ${escapeHtml(domain.label)}</strong>
        <span>${domain.correct}/${domain.total} (${domain.percent}%)</span>
      </article>`).join("") : `<p class="dashboard-empty-state">Complete a Practice Exam to establish domain evidence.</p>`;
    const studyAreas = practice.studyDomains.length
      ? practice.studyDomains.map(domain => `Domain ${escapeHtml(domain.id)} — ${escapeHtml(domain.label)}`).join("; ")
      : practice.domains.length ? "No domain in the available latest results is below the 85% readiness threshold." : "No Practice Exam evidence yet.";
    const objectiveWorlds = Object.keys(summary.config.objectivesByWorld).map(world => {
      const objectives = practice.objectives.filter(objective => objective.world === world);
      if (!objectives.length) return "";
      return `<details class="dashboard-world-details"><summary>World ${world} Objective Evidence <span>${objectives.length} objectives</span></summary><div class="dashboard-objective-exam-grid">${objectives.map(objective => `
        <article class="dashboard-objective-exam-row ${objective.diagnostic === "needs-work" ? "needs-study" : ""}">
          <div class="dashboard-evidence-heading"><strong>Objective ${escapeHtml(objective.id)}</strong>${diagnosticBadge(objective.diagnostic)}</div><span>${objective.correct}/${objective.total} (${objective.percent}%)</span><small>${objective.total} question sample${objective.total === 1 ? "" : "s"}</small>
        </article>`).join("")}</div></details>`;
    }).join("");
    const legacy = practice.legacyResults
      ? `<p class="dashboard-legacy-note">${practice.legacyResults} saved result${practice.legacyResults === 1 ? "" : "s"} predates objective rollups. Domain evidence remains available; submit that exam again to add objective diagnostics.</p>`
      : "";
    return `
      <div class="dashboard-exam-grid">${exams}</div>
      <h5>Performance by Every Exam Domain</h5><div class="dashboard-domain-results">${domains}</div>
      <p class="dashboard-study-areas"><b>Areas Requiring Additional Study:</b> ${studyAreas}</p>
      <h5>Objective-Level Diagnostic Evidence</h5>${legacy}${objectiveWorlds || `<p class="dashboard-empty-state">No objective-level Practice Exam evidence yet.</p>`}`;
  }

  const priorityDefinitions = [
    ["confirmed", "Confirmed Priority", "Weak in Sweeps and Practice Exams"],
    ["applicationGap", "Application Gap", "Strong in Sweeps, weaker in Practice Exams"],
    ["improvingTransfer", "Improving Transfer", "Weaker Sweep history, stronger Practice Exam evidence"],
    ["insufficientEvidence", "Insufficient Evidence", "Only one evidence source is currently available"]
  ];

  function priorityReviewMarkup(summary) {
    const evidence = summary.intelligence.priorityReview;
    return `<div class="dashboard-priority-grid">${priorityDefinitions.map(([key, label, description]) => {
      const rows = evidence[key];
      return `<section class="dashboard-priority-group"><h5>${label}</h5><p>${description}</p>${rows.length ? rows.map(({ sweep, exam }) => `
        <article class="dashboard-priority-row">
          <strong>World ${escapeHtml(sweep.world)} • Objective ${escapeHtml(sweep.objective)}</strong>
          <span>Sweep: ${sweep.answered ? `${sweep.correct}/${sweep.answered} (${sweep.accuracy}%) — ${sweep.diagnostic === "insufficient" ? "Insufficient Evidence" : sweep.diagnostic === "strong" ? "Strong Evidence" : "Needs Work"}` : sweep.mastered ? "Mastered; detailed evidence unavailable" : "No evidence"}</span>
          <span>Practice Exams: ${exam?.total ? `${exam.correct}/${exam.total} (${exam.percent}%) — ${exam.diagnostic === "insufficient" ? "Insufficient Evidence" : exam.diagnostic === "strong" ? "Strong Evidence" : "Needs Work"}` : "No objective evidence"}</span>
        </article>`).join("") : `<span class="dashboard-no-priority">None currently identified</span>`}</section>`;
    }).join("")}</div>`;
  }

  function intelligenceMarkup(summary) {
    return `
      <section class="dashboard-training-intelligence" aria-label="${escapeHtml(summary.config.name)} training intelligence">
        <details class="dashboard-intelligence-section">
          <summary>🎯 Objective Sweep Intelligence</summary>
          <p class="dashboard-intelligence-note">Worlds 1–5 recognition evidence. Five answered questions are required for a confident diagnostic label. Existing Objective mastery remains independent and authoritative.</p>
          ${objectiveSweepMarkup(summary)}
          <h4>World 6 — Mixed Review</h4>
          <p class="dashboard-intelligence-note">Reinforcement evidence only — does not alter Objective mastery.</p>
          ${mixedReviewMarkup(summary)}
          <h4>World 7 — Boss Rush</h4>
          <p class="dashboard-intelligence-note">Readiness and reinforcement evidence only — does not create new Objectives.</p>
          ${bossRushMarkup(summary)}
        </details>
        <details class="dashboard-intelligence-section">
          <summary>📊 Practice Exam Intelligence</summary>
          <p class="dashboard-intelligence-note">Latest submitted result for each Practice Exam. Objective percentages are diagnostic evidence with sample counts, not mastery scores. Fewer than five questions is Insufficient Evidence.</p>
          ${practiceExamMarkup(summary)}
        </details>
        <details class="dashboard-intelligence-section">
          <summary>🧭 Priority Review</summary>
          <p class="dashboard-intelligence-note">A read-only correlation of existing Sweep and Practice Exam evidence. No new score or readiness rule is created.</p>
          ${priorityReviewMarkup(summary)}
        </details>
      </section>`;
  }

  function formatStudyTime(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    if (seconds < 60) return seconds ? "< 1 min" : "0 min";
    const totalMinutes = Math.floor(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours ? `${hours}h ${minutes}m` : `${minutes} min`;
  }

  function achievementShelf(summary) {
    const unlocked = new Set(summary.achievements.map(item => item.id));
    return achievementOrder.map(id => {
      const item = ui.achievements[id];
      const earned = unlocked.has(id);
      return `<span class="dashboard-achievement${earned ? " earned" : " locked"}" title="${item.name}" aria-label="${item.name}: ${earned ? "Unlocked" : "Locked"}">${item.icon}</span>`;
    }).join("");
  }

  function renderCampaign(summary) {
    const card = document.createElement("article");
    card.className = "dashboard-campaign-card";
    const strongest = summary.strongestDomain ? `${summary.strongestDomain.name} (${summary.strongestDomain.accuracy}%)` : "Not enough data";
    const weakest = summary.weakestDomain ? `${summary.weakestDomain.name} (${summary.weakestDomain.accuracy}%)` : "Not enough data";
    card.innerHTML = `
      <header class="dashboard-card-header">
        <div><span class="campaign-panel-label">CERTIFICATION CAMPAIGN</span><h3>${summary.config.name}</h3></div>
        <strong class="dashboard-percent">${summary.masteryPercent}%</strong>
      </header>
      <div class="dashboard-progress" role="progressbar" aria-label="${summary.config.name} mastery" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${summary.masteryPercent}">
        <span style="width:${summary.masteryPercent}%"></span>
      </div>
      <div class="dashboard-metrics">
        ${metric("Objectives Mastered", `${summary.masteredObjectives} / ${summary.totalObjectives}`)}
        ${metric("Questions Answered", summary.questionsAnswered)}
        ${metric("Overall Accuracy", `${summary.accuracy}%`)}
        ${metric("Best Streak", summary.bestStreak)}
        ${metric("Time Studying", formatStudyTime(summary.studySeconds))}
        ${metric("Worlds Completed", `${summary.worldsCompleted} / 5`)}
        ${metric("Practice Exams", `${summary.completedExams} / 6`)}
        ${metric("Practice Exams Passed", `${summary.passedExams} / 6`)}
        ${metric("Current Streak", summary.currentStreak)}
      </div>
      <div class="dashboard-domain-context"><strong>Overall Recorded Quiz Activity</strong><span>Combined evidence from Sweeps, Mixed Review, Boss Rush, and Practice Exams.</span></div>
      <div class="dashboard-domain-row"><span><b>Strongest Domain:</b> ${strongest}</span><span><b>Weakest Domain:</b> ${weakest}</span></div>
      ${intelligenceMarkup(summary)}
      <div class="dashboard-achievements" aria-label="${summary.config.name} achievements">${achievementShelf(summary)}</div>
      <a href="${summary.config.campaign}" class="link-btn dashboard-enter">Enter ${summary.config.name}</a>`;
    campaignDashboard.append(card);
  }

  summaries.forEach(renderCampaign);

  const totals = summaries.reduce((all, summary) => ({
    questions: all.questions + summary.questionsAnswered,
    correct: all.correct + summary.correctAnswers,
    objectives: all.objectives + summary.masteredObjectives,
    totalObjectives: all.totalObjectives + summary.totalObjectives,
    masteredQuestions: all.masteredQuestions + summary.masteredQuestions,
    totalQuestions: all.totalQuestions + summary.config.totalQuestions,
    worlds: all.worlds + summary.worldsCompleted,
    achievements: all.achievements + summary.achievements.length,
    finalBosses: all.finalBosses + summary.finalBossesDefeated,
    studySeconds: all.studySeconds + summary.studySeconds
  }), { questions: 0, correct: 0, objectives: 0, totalObjectives: 0, masteredQuestions: 0, totalQuestions: 0, worlds: 0, achievements: 0, finalBosses: 0, studySeconds: 0 });

  const overallAccuracy = totals.questions ? Math.round((totals.correct / totals.questions) * 100) : 0;
  const overallMastery = totals.totalQuestions ? Math.round((totals.masteredQuestions / totals.totalQuestions) * 100) : 0;
  const currentMission = summaries.map(summary => ({ ...summary.currentMission, certification: summary.config.name }))
    .filter(mission => mission.updatedAt).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];

  academySummary.innerHTML = `
    <div class="academy-summary-heading"><div><span class="campaign-panel-label">ACADEMY-WIDE PROGRESS</span><h2>Overall Academy</h2></div><strong>${overallMastery}% Mastery</strong></div>
    <div class="dashboard-progress" role="progressbar" aria-label="Overall Academy mastery" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${overallMastery}"><span style="width:${overallMastery}%"></span></div>
    <div class="academy-metrics">
      ${metric("Questions Answered", totals.questions)}
      ${metric("Correct Answers", totals.correct)}
      ${metric("Overall Accuracy", `${overallAccuracy}%`)}
      ${metric("Time Studying", formatStudyTime(totals.studySeconds))}
      ${metric("Objectives Mastered", `${totals.objectives} / ${totals.totalObjectives}`)}
      ${metric("Worlds Completed", `${totals.worlds} / ${summaries.length * 5}`)}
      ${metric("Achievements", `${totals.achievements} / ${summaries.length * achievementOrder.length}`)}
      ${metric("Final Bosses Defeated", `${totals.finalBosses} / ${summaries.length}`)}
    </div>
    <div class="current-mission"><span class="campaign-panel-label">CURRENT MISSION</span>${currentMission ? `<a href="${currentMission.href}">${currentMission.certification}: ${currentMission.label}</a>` : "Begin an Objective Sweep to establish your current mission."}</div>`;
}());
