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
    "hydra-linux-essentials-progress-v1",
    "hydra-aws-cloud-practitioner-progress-v1"
  ];
  const summaries = campaignOrder.map(key => ui.getCampaignSummary(key)).filter(Boolean);

  function metric(label, value) {
    return `<div class="dashboard-metric"><strong>${value}</strong><span>${label}</span></div>`;
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
      <div class="dashboard-domain-row"><span><b>Strongest Domain:</b> ${strongest}</span><span><b>Weakest Domain:</b> ${weakest}</span></div>
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
