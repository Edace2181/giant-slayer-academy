(function () {
  "use strict";

  const CERTIFICATIONS = Object.freeze({
    "aplus-core1": {
      label: "CompTIA A+ Core 1 (220-1201)",
      bank: "json/aplus-core1/pbq/production.json",
      returnHref: "aplus-core1-final-dungeon.html",
      returnLabel: "Return to A+ Core 1 Final Dungeon"
    },
    "aplus-core2": {
      label: "CompTIA A+ Core 2 (220-1202)",
      bank: "json/aplus-core2/pbq/production.json",
      returnHref: "aplus-core2-final-dungeon.html",
      returnLabel: "Return to A+ Core 2 Final Dungeon"
    },
    "network-plus": {
      label: "CompTIA Network+ (N10-009)",
      bank: "json/network-plus/pbq/production.json",
      returnHref: "network-final-dungeon.html",
      returnLabel: "Return to Network+ Final Dungeon"
    },
    "security-plus": {
      label: "CompTIA Security+",
      bank: "json/security-plus/pbq/phase-1.json",
      returnHref: "security-plus-final-dungeon.html",
      returnLabel: "Return to Security+ Final Dungeon"
    }
  });

  const REQUIRED_MISSION_FIELDS = [
    "id",
    "certification",
    "type",
    "title",
    "objective",
    "difficulty",
    "briefing",
    "instructions",
    "tasks",
    "options",
    "solution",
    "scoring",
    "explanations"
  ];

  const elements = {
    loading: document.getElementById("pbqLoading"),
    error: document.getElementById("pbqError"),
    errorMessage: document.getElementById("pbqErrorMessage"),
    application: document.getElementById("pbqApplication"),
    certification: document.getElementById("pbqCertification"),
    missionNumber: document.getElementById("pbqMissionNumber"),
    missionTitle: document.getElementById("pbqMissionTitle"),
    objective: document.getElementById("pbqObjective"),
    briefing: document.getElementById("pbqBriefing"),
    instructions: document.getElementById("pbqInstructions"),
    taskChecklist: document.getElementById("pbqTaskChecklist"),
    taskProgress: document.getElementById("pbqTaskProgress"),
    progressText: document.getElementById("pbqProgressText"),
    workspace: document.getElementById("pbqWorkspace"),
    review: document.getElementById("pbqReview"),
    previous: document.getElementById("pbqPrevious"),
    next: document.getElementById("pbqNext"),
    flag: document.getElementById("pbqFlag"),
    reset: document.getElementById("pbqReset"),
    submit: document.getElementById("pbqSubmit"),
    showReport: document.getElementById("pbqShowReport"),
    campaignReport: document.getElementById("pbqCampaignReport"),
    status: document.getElementById("pbqStatus"),
    returnLink: document.getElementById("pbqReturnLink")
  };

  let configuration = null;
  let bank = null;
  let currentIndex = 0;
  let state = null;
  let storageKey = "";

  const renderers = new Map();

  function registerRenderer(type, renderer) {
    if (!type || typeof renderer?.render !== "function" || typeof renderer?.grade !== "function") {
      throw new Error(`Invalid PBQ renderer registration for ${type || "unknown type"}.`);
    }
    renderers.set(type, renderer);
  }

  function announce(message) {
    elements.status.textContent = "";
    window.requestAnimationFrame(() => {
      elements.status.textContent = message;
    });
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function mission() {
    return bank.missions[currentIndex];
  }

  function missionAnswers(activeMission = mission()) {
    state.answers[activeMission.id] ||= {};
    return state.answers[activeMission.id];
  }

  function saveState() {
    sessionStorage.setItem(storageKey, JSON.stringify(state));
  }

  function freshState() {
    return {
      schemaVersion: 1,
      missionIds: bank.missions.map(item => item.id),
      currentIndex: 0,
      answers: {},
      flags: {},
      submitted: {}
    };
  }

  function restoreState() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      const missionIds = bank.missions.map(item => item.id);
      if (
        !stored ||
        stored.schemaVersion !== 1 ||
        JSON.stringify(stored.missionIds) !== JSON.stringify(missionIds)
      ) {
        return freshState();
      }
      stored.answers ||= {};
      stored.flags ||= {};
      stored.submitted ||= {};
      stored.currentIndex = Math.min(Math.max(Number(stored.currentIndex) || 0, 0), missionIds.length - 1);
      return stored;
    } catch {
      return freshState();
    }
  }

  function validateBank(candidate, certification) {
    if (!candidate || typeof candidate !== "object") throw new Error("PBQ bank is not an object.");
    if (candidate.schemaVersion !== 1) throw new Error("Unsupported PBQ schema version.");
    if (candidate.certification !== certification) throw new Error("PBQ bank certification does not match the route.");
    if (!Array.isArray(candidate.missions) || candidate.missions.length === 0) {
      throw new Error("PBQ bank does not contain any missions.");
    }

    const ids = new Set();
    candidate.missions.forEach((item, index) => {
      REQUIRED_MISSION_FIELDS.forEach(field => {
        if (item[field] === undefined || item[field] === null) {
          throw new Error(`Mission ${index + 1} is missing required field "${field}".`);
        }
      });
      if (ids.has(item.id)) throw new Error(`Duplicate PBQ mission ID "${item.id}".`);
      ids.add(item.id);
      if (item.certification !== certification) throw new Error(`Mission "${item.id}" has the wrong certification.`);
      if (!renderers.has(item.type)) throw new Error(`No renderer is registered for PBQ type "${item.type}".`);
      if (!Array.isArray(item.tasks) || item.tasks.length === 0) throw new Error(`Mission "${item.id}" has no tasks.`);
      if (!Array.isArray(item.instructions) || item.instructions.length === 0) {
        throw new Error(`Mission "${item.id}" has no instructions.`);
      }
      if (item.type === "visual-labeling") {
        if (!item.visual?.src || !item.visual?.alt) {
          throw new Error(`Visual-labeling mission "${item.id}" requires a visual source and alternative text.`);
        }
        if (!Array.isArray(item.options) || item.options.length === 0) {
          throw new Error(`Visual-labeling mission "${item.id}" requires answer options.`);
        }
      }
      const taskIds = new Set();
      const calloutLabels = new Set();
      item.tasks.forEach(task => {
        if (!task.id || !task.prompt) throw new Error(`Mission "${item.id}" contains an invalid task.`);
        if (taskIds.has(task.id)) throw new Error(`Mission "${item.id}" contains duplicate task ID "${task.id}".`);
        taskIds.add(task.id);
        if (!(task.id in item.solution)) throw new Error(`Mission "${item.id}" has no solution for "${task.id}".`);
        if (!(task.id in item.explanations)) throw new Error(`Mission "${item.id}" has no explanation for "${task.id}".`);
        if (item.type === "visual-labeling") {
          const callout = task.callout;
          if (
            !callout?.label ||
            !Number.isFinite(callout.x) ||
            !Number.isFinite(callout.y) ||
            callout.x < 0 ||
            callout.x > 100 ||
            callout.y < 0 ||
            callout.y > 100
          ) {
            throw new Error(`Visual-labeling mission "${item.id}" contains an invalid callout for "${task.id}".`);
          }
          if (calloutLabels.has(callout.label)) {
            throw new Error(`Visual-labeling mission "${item.id}" contains duplicate callout label "${callout.label}".`);
          }
          calloutLabels.add(callout.label);
          if (!item.options.some(option => option.id === item.solution[task.id])) {
            throw new Error(`Visual-labeling mission "${item.id}" has an invalid solution for "${task.id}".`);
          }
        }
      });
      if (!item.scoring.partialCredit || item.scoring.maxPoints <= 0) {
        throw new Error(`Mission "${item.id}" must define positive partial-credit scoring.`);
      }
    });
    return candidate;
  }

  function renderInstructions(activeMission) {
    elements.instructions.replaceChildren();
    activeMission.instructions.forEach(instruction => {
      elements.instructions.append(createElement("li", "", instruction));
    });
  }

  function taskCompletion(activeMission, task) {
    const answer = missionAnswers(activeMission)[task.id];
    if (activeMission.type === "configuration-table") {
      return activeMission.scoring.fields.every(field => answer?.[field]);
    }
    return Boolean(answer);
  }

  function progressUnits(activeMission) {
    const answers = missionAnswers(activeMission);
    if (activeMission.type === "configuration-table") {
      const fields = activeMission.scoring.fields;
      const total = activeMission.tasks.length * fields.length;
      const completed = activeMission.tasks.reduce(
        (sum, task) => sum + fields.filter(field => answers[task.id]?.[field]).length,
        0
      );
      return { completed, total, label: "fields completed" };
    }
    return {
      completed: activeMission.tasks.filter(task => Boolean(answers[task.id])).length,
      total: activeMission.tasks.length,
      label: "tasks answered"
    };
  }

  function renderChecklist(activeMission) {
    elements.taskChecklist.replaceChildren();
    const result = state.submitted[activeMission.id];
    activeMission.tasks.forEach((task, index) => {
      const item = createElement("li", taskCompletion(activeMission, task) ? "is-complete" : "");
      const marker = createElement("span", "pbq-check-marker", taskCompletion(activeMission, task) ? "✓" : String(index + 1));
      const label = createElement("span", "", task.label || task.prompt);
      if (result?.taskResults?.[task.id]) {
        item.classList.add(result.taskResults[task.id].correct ? "is-correct" : "is-incorrect");
      }
      item.append(marker, label);
      elements.taskChecklist.append(item);
    });
  }

  function updateProgress(activeMission) {
    const progress = progressUnits(activeMission);
    elements.taskProgress.max = progress.total;
    elements.taskProgress.value = progress.completed;
    elements.progressText.textContent = `${progress.completed} of ${progress.total} ${progress.label}`;
    renderChecklist(activeMission);
  }

  function updateFlag(activeMission) {
    const flagged = Boolean(state.flags[activeMission.id]);
    elements.flag.setAttribute("aria-pressed", String(flagged));
    elements.flag.classList.toggle("is-flagged", flagged);
    elements.flag.textContent = flagged ? "⚑ Flagged for Review" : "⚑ Flag for Review";
  }

  function disableSubmittedWorkspace(activeMission) {
    const submitted = Boolean(state.submitted[activeMission.id]);
    elements.workspace.querySelectorAll("select, input, button").forEach(control => {
      control.disabled = submitted;
    });
    elements.submit.disabled = submitted;
    elements.submit.textContent = submitted ? "✓ PBQ Submitted" : "⚔ Submit PBQ";
  }

  function renderMission(options = {}) {
    const activeMission = mission();
    state.currentIndex = currentIndex;
    saveState();

    elements.missionNumber.textContent = `Mission ${currentIndex + 1} of ${bank.missions.length} · Difficulty ${activeMission.difficulty}`;
    elements.missionTitle.textContent = activeMission.title;
    elements.objective.textContent = activeMission.objective;
    elements.briefing.textContent = activeMission.briefing;
    renderInstructions(activeMission);
    updateFlag(activeMission);
    elements.previous.disabled = currentIndex === 0;
    elements.next.disabled = currentIndex === bank.missions.length - 1;
    elements.review.classList.add("hidden");
    elements.review.replaceChildren();
    elements.campaignReport.classList.add("hidden");
    elements.campaignReport.replaceChildren();
    elements.workspace.replaceChildren();

    renderers.get(activeMission.type).render(activeMission, {
      container: elements.workspace,
      answers: missionAnswers(activeMission),
      onChange: () => {
        delete state.submitted[activeMission.id];
        saveState();
        updateProgress(activeMission);
        disableSubmittedWorkspace(activeMission);
      }
    });

    updateProgress(activeMission);
    if (state.submitted[activeMission.id]) renderReview(activeMission, state.submitted[activeMission.id], false);
    disableSubmittedWorkspace(activeMission);
    updateReportButton();
    if (options.focus) elements.missionTitle.focus?.();
    announce(`Mission ${currentIndex + 1}: ${activeMission.title}`);
  }

  function renderReview(activeMission, result, moveFocus = true) {
    elements.review.replaceChildren();
    elements.review.classList.remove("hidden");
    const heading = createElement("h2", "", "⚔ Battlefield Analysis");
    const summary = createElement(
      "p",
      "pbq-score-summary",
      `${result.points} of ${result.maxPoints} points · ${result.percent}%`
    );
    elements.review.append(heading, summary);

    activeMission.tasks.forEach((task, index) => {
      const taskResult = result.taskResults[task.id];
      const card = createElement("article", `pbq-review-card ${taskResult.correct ? "is-correct" : "is-incorrect"}`);
      card.append(
        createElement("h3", "", `${taskResult.correct ? "✓" : "✕"} Task ${index + 1}: ${task.label || task.prompt}`),
        createElement("p", "", `Your answer: ${taskResult.answerLabel}`),
        createElement("p", "", `Correct answer: ${taskResult.correctLabel}`),
        createElement("p", "pbq-review-explanation", activeMission.explanations[task.id])
      );
      elements.review.append(card);
    });

    if (moveFocus) elements.review.focus();
  }

  function objectiveCode(activeMission) {
    return activeMission.objective.match(/\b\d+\.\d+(?:[–-]\d+\.\d+)?\b/)?.[0] || activeMission.objective;
  }

  function domainCode(activeMission) {
    return activeMission.objective.match(/\b(\d+)\.\d+\b/)?.[1] || "Other";
  }

  function rendererLabel(type) {
    return type
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function performanceStatus(percent) {
    if (percent >= 80) return { label: "Strong", className: "is-strong" };
    if (percent < 70) return { label: "Weak", className: "is-weak" };
    return { label: "Developing", className: "is-developing" };
  }

  function missionRecords() {
    return bank.missions.map((item, index) => {
      const result = state.submitted[item.id];
      return {
        mission: item,
        index,
        result,
        points: result?.points || 0,
        maxPoints: result?.maxPoints || item.scoring.maxPoints,
        percent: result?.percent ?? null,
        flagged: Boolean(state.flags[item.id])
      };
    });
  }

  function aggregatePerformance(records, keySelector, labelSelector = keySelector) {
    const groups = new Map();
    records.filter(record => record.result).forEach(record => {
      const key = keySelector(record.mission);
      const group = groups.get(key) || {
        key,
        label: labelSelector(record.mission),
        points: 0,
        maxPoints: 0,
        missions: 0
      };
      group.points += record.points;
      group.maxPoints += record.maxPoints;
      group.missions += 1;
      groups.set(key, group);
    });
    return [...groups.values()]
      .map(group => ({
        ...group,
        percent: Math.round((group.points / group.maxPoints) * 100)
      }))
      .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
  }

  function appendPerformanceSection(report, title, groups, emptyMessage) {
    const section = createElement("section", "pbq-report-section");
    section.append(createElement("h3", "", title));
    if (!groups.length) {
      section.append(createElement("p", "", emptyMessage));
      report.append(section);
      return;
    }
    const grid = createElement("div", "pbq-performance-grid");
    groups.forEach(group => {
      const status = performanceStatus(group.percent);
      const card = createElement("article", `pbq-performance-card ${status.className}`);
      const progress = createElement("progress", "pbq-report-progress");
      progress.max = 100;
      progress.value = group.percent;
      progress.setAttribute("aria-label", `${group.label}: ${group.percent} percent`);
      card.append(
        createElement("h4", "", group.label),
        createElement("p", "", `${group.points}/${group.maxPoints} points · ${group.percent}% · ${status.label}`),
        createElement("p", "", `${group.missions} graded ${group.missions === 1 ? "mission" : "missions"}`),
        progress
      );
      grid.append(card);
    });
    section.append(grid);
    report.append(section);
  }

  function reportStat(label, value) {
    const card = createElement("div", "pbq-report-stat");
    card.append(createElement("span", "", label), createElement("strong", "", value));
    return card;
  }

  function openMissionFromReport(index) {
    currentIndex = index;
    renderMission({ focus: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderCampaignReport() {
    const records = missionRecords();
    const submitted = records.filter(record => record.result);
    const earnedPoints = submitted.reduce((sum, record) => sum + record.points, 0);
    const gradedPoints = submitted.reduce((sum, record) => sum + record.maxPoints, 0);
    const campaignPoints = records.reduce((sum, record) => sum + record.maxPoints, 0);
    const overallPercent = gradedPoints ? Math.round((earnedPoints / gradedPoints) * 100) : 0;
    const perfectMissions = submitted.filter(record => record.percent === 100).length;
    const partialMissions = submitted.filter(record => record.points > 0 && record.points < record.maxPoints);
    const zeroMissions = submitted.filter(record => record.points === 0).length;
    const rendererGroups = aggregatePerformance(
      records,
      activeMission => activeMission.type,
      activeMission => rendererLabel(activeMission.type)
    );
    const objectiveGroups = aggregatePerformance(records, objectiveCode, objectiveCode);
    const domainGroups = aggregatePerformance(
      records,
      domainCode,
      activeMission => `Domain ${domainCode(activeMission)}`
    );
    const weakObjectives = objectiveGroups.filter(group => group.percent < 70).sort((a, b) => a.percent - b.percent);
    const strongObjectives = objectiveGroups.filter(group => group.percent >= 80).sort((a, b) => b.percent - a.percent);
    const revisit = records
      .filter(record => record.result && (record.percent < 80 || record.flagged))
      .sort((a, b) => (a.percent - b.percent) || Number(b.flagged) - Number(a.flagged));

    const report = elements.campaignReport;
    report.replaceChildren();
    const header = createElement("div", "pbq-report-header");
    const headingGroup = createElement("div");
    const title = createElement("h2", "", "📊 Hydra PBQ Campaign Report");
    title.id = "pbqCampaignReportTitle";
    headingGroup.append(
      title,
      createElement(
        "p",
        "pbq-report-subtitle",
        `${configuration.label} · ${submitted.length} of ${records.length} missions submitted`
      )
    );
    const close = createElement("button", "pbq-control-button pbq-report-close", "Close Report");
    close.type = "button";
    close.addEventListener("click", () => {
      report.classList.add("hidden");
      elements.showReport.focus();
      announce("Campaign report closed.");
    });
    header.append(headingGroup, close);
    report.append(header);

    const overview = createElement("div", "pbq-report-grid");
    overview.append(
      reportStat("Overall PBQ score", gradedPoints ? `${earnedPoints}/${gradedPoints} · ${overallPercent}%` : "No graded missions"),
      reportStat("Campaign progress", `${submitted.length}/${records.length} missions`),
      reportStat("Perfect missions", String(perfectMissions)),
      reportStat("Partial-credit missions", String(partialMissions.length))
    );
    report.append(overview);

    const scopeNotice = createElement(
      "p",
      "",
      submitted.length === records.length
        ? `Final report includes all ${campaignPoints} available campaign points.`
        : `Progress report is based on ${gradedPoints} graded points. The complete campaign contains ${campaignPoints} available points.`
    );
    report.append(scopeNotice);

    appendPerformanceSection(report, "Renderer Performance", rendererGroups, "Submit a mission to generate renderer performance.");
    appendPerformanceSection(report, "Domain Performance", domainGroups, "Submit a mission to generate domain performance.");
    appendPerformanceSection(report, "Objective Performance", objectiveGroups, "Submit a mission to generate objective performance.");

    const partialSection = createElement("section", "pbq-report-section");
    partialSection.append(
      createElement("h3", "", "Partial-Credit Summary"),
      createElement(
        "p",
        "",
        `${partialMissions.length} partially correct · ${perfectMissions} perfect · ${zeroMissions} zero-credit · ${records.length - submitted.length} not submitted`
      ),
      createElement(
        "p",
        "",
        partialMissions.length
          ? `${partialMissions.reduce((sum, record) => sum + record.points, 0)} of ${partialMissions.reduce((sum, record) => sum + record.maxPoints, 0)} possible points were earned across partially correct missions.`
          : "No partially correct missions have been recorded."
      )
    );
    report.append(partialSection);

    const insightSection = createElement("section", "pbq-report-section");
    insightSection.append(createElement("h3", "", "Hydra Strength and Weakness Analysis"));
    const insightGrid = createElement("div", "pbq-performance-grid");
    const strongCard = createElement("article", "pbq-performance-card is-strong");
    strongCard.append(createElement("h4", "", "Strong Objectives"));
    const strongList = createElement("ul", "pbq-report-list");
    if (strongObjectives.length) {
      strongObjectives.forEach(group => strongList.append(createElement("li", "", `${group.label} — ${group.percent}%`)));
    } else {
      strongList.append(createElement("li", "", "No objective has reached the 80% strength threshold yet."));
    }
    strongCard.append(strongList);
    const weakCard = createElement("article", "pbq-performance-card is-weak");
    weakCard.append(createElement("h4", "", "Weak Objectives"));
    const weakList = createElement("ul", "pbq-report-list");
    if (weakObjectives.length) {
      weakObjectives.forEach(group => weakList.append(createElement("li", "", `${group.label} — ${group.percent}%`)));
    } else {
      weakList.append(createElement("li", "", "No submitted objective is below the 70% weakness threshold."));
    }
    weakCard.append(weakList);
    insightGrid.append(strongCard, weakCard);
    insightSection.append(insightGrid);
    report.append(insightSection);

    const revisitSection = createElement("section", "pbq-report-section");
    revisitSection.append(createElement("h3", "", "Recommended Missions to Revisit"));
    if (!revisit.length) {
      revisitSection.append(createElement("p", "", "No submitted mission currently requires review."));
    } else {
      const revisitList = createElement("div", "pbq-mission-results");
      revisit.forEach(record => {
        const card = createElement("article", "pbq-mission-result is-revisit");
        const reasons = [];
        if (record.percent < 80) reasons.push(`${record.percent}% score`);
        if (record.flagged) reasons.push("flagged for review");
        const button = createElement("button", "pbq-control-button", "Open Mission");
        button.type = "button";
        button.addEventListener("click", () => openMissionFromReport(record.index));
        card.append(
          createElement("h4", "", `Mission ${record.index + 1}: ${record.mission.title}`),
          createElement("p", "", `${objectiveCode(record.mission)} · ${rendererLabel(record.mission.type)}`),
          createElement("p", "", reasons.join(" · ")),
          button
        );
        revisitList.append(card);
      });
      revisitSection.append(revisitList);
    }
    report.append(revisitSection);

    const missionSection = createElement("section", "pbq-report-section");
    missionSection.append(createElement("h3", "", "Mission-by-Mission Results"));
    const missionGrid = createElement("div", "pbq-mission-results");
    records.forEach(record => {
      const needsReview = record.result && (record.percent < 80 || record.flagged);
      const card = createElement("article", `pbq-mission-result${needsReview ? " is-revisit" : ""}`);
      const button = createElement("button", "pbq-control-button", record.result ? "Open Battlefield Analysis" : "Open Mission");
      button.type = "button";
      button.addEventListener("click", () => openMissionFromReport(record.index));
      card.append(
        createElement("h4", "", `Mission ${record.index + 1}: ${record.mission.title}`),
        createElement("p", "", `${rendererLabel(record.mission.type)} · ${objectiveCode(record.mission)}`),
        createElement(
          "p",
          "",
          record.result ? `${record.points}/${record.maxPoints} points · ${record.percent}%` : "Not submitted"
        ),
        createElement("p", "", record.flagged ? "⚑ Flagged for review" : "Not flagged"),
        button
      );
      missionGrid.append(card);
    });
    missionSection.append(missionGrid);
    report.append(missionSection);

    report.classList.remove("hidden");
    report.focus();
    announce(`Campaign report opened. ${submitted.length} of ${records.length} missions submitted. Overall score ${overallPercent} percent.`);
  }

  function updateReportButton() {
    const submitted = Object.keys(state.submitted).length;
    elements.showReport.textContent = `📊 Campaign Report (${submitted}/${bank.missions.length})`;
  }

  function submitMission() {
    const activeMission = mission();
    const result = renderers.get(activeMission.type).grade(activeMission, missionAnswers(activeMission));
    state.submitted[activeMission.id] = result;
    saveState();
    renderChecklist(activeMission);
    renderReview(activeMission, result);
    disableSubmittedWorkspace(activeMission);
    updateReportButton();
    announce(`PBQ submitted. Score ${result.points} of ${result.maxPoints}, ${result.percent} percent.`);
  }

  function resetMission() {
    const activeMission = mission();
    if (!window.confirm("Reset this scenario? All answers and review results for this PBQ will be cleared.")) return;
    state.answers[activeMission.id] = {};
    delete state.submitted[activeMission.id];
    saveState();
    renderMission();
    announce("Scenario reset. All answers for this PBQ were cleared.");
  }

  function changeMission(direction) {
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= bank.missions.length) return;
    currentIndex = nextIndex;
    renderMission();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function optionLabel(activeMission, optionId) {
    return activeMission.options.find(option => option.id === optionId)?.label || "Not answered";
  }

  function createChoiceRenderer(defaultPrompt) {
    return {
      render(activeMission, context) {
        const list = createElement("div", "pbq-matching-list");

        activeMission.tasks.forEach((task, index) => {
          const row = createElement("article", "pbq-matching-task");
          const label = createElement("label", "", `${index + 1}. ${task.prompt}`);
          label.htmlFor = `pbq-${activeMission.type}-${task.id}`;
          const select = createElement("select", "pbq-select");
          select.id = label.htmlFor;
          select.dataset.taskId = task.id;
          select.append(new Option(task.placeholder || defaultPrompt, ""));
          activeMission.options.forEach(option => select.append(new Option(option.label, option.id)));
          select.value = context.answers[task.id] || "";
          select.addEventListener("change", () => {
            if (select.value) context.answers[task.id] = select.value;
            else delete context.answers[task.id];
            updateSingleUseOptions(activeMission, list, context.answers);
            context.onChange();
          });
          row.append(label, select);
          list.append(row);
        });

        context.container.append(list);
        updateSingleUseOptions(activeMission, list, context.answers);
      },
      grade(activeMission, answers) {
        let points = 0;
        const taskResults = {};
        activeMission.tasks.forEach(task => {
          const answer = answers[task.id] || "";
          const correctAnswer = activeMission.solution[task.id];
          const correct = answer === correctAnswer;
          if (correct) points += 1;
          taskResults[task.id] = {
            correct,
            answerLabel: optionLabel(activeMission, answer),
            correctLabel: optionLabel(activeMission, correctAnswer)
          };
        });
        return {
          points,
          maxPoints: activeMission.scoring.maxPoints,
          percent: Math.round((points / activeMission.scoring.maxPoints) * 100),
          taskResults
        };
      }
    };
  }

  registerRenderer("matching", {
    render(activeMission, context) {
      const list = createElement("div", "pbq-matching-list");

      activeMission.tasks.forEach((task, index) => {
        const row = createElement("article", "pbq-matching-task");
        const label = createElement("label", "", `${index + 1}. ${task.prompt}`);
        label.htmlFor = `pbq-match-${task.id}`;
        const select = createElement("select", "pbq-select");
        select.id = label.htmlFor;
        select.dataset.taskId = task.id;
        select.append(new Option("Select the best control", ""));
        activeMission.options.forEach(option => {
          select.append(new Option(option.label, option.id));
        });
        select.value = context.answers[task.id] || "";
        select.addEventListener("change", () => {
          if (select.value) context.answers[task.id] = select.value;
          else delete context.answers[task.id];
          updateSingleUseOptions(activeMission, list, context.answers);
          context.onChange();
        });
        row.append(label, select);
        list.append(row);
      });

      context.container.append(list);
      updateSingleUseOptions(activeMission, list, context.answers);
    },
    grade(activeMission, answers) {
      let points = 0;
      const taskResults = {};
      activeMission.tasks.forEach(task => {
        const answer = answers[task.id] || "";
        const correctAnswer = activeMission.solution[task.id];
        const correct = answer === correctAnswer;
        if (correct) points += 1;
        taskResults[task.id] = {
          correct,
          answerLabel: optionLabel(activeMission, answer),
          correctLabel: optionLabel(activeMission, correctAnswer)
        };
      });
      return {
        points,
        maxPoints: activeMission.scoring.maxPoints,
        percent: Math.round((points / activeMission.scoring.maxPoints) * 100),
        taskResults
      };
    }
  });

  function updateSingleUseOptions(activeMission, container, answers) {
    const selectedByTask = answers;
    container.querySelectorAll("select[data-task-id]").forEach(select => {
      const taskId = select.dataset.taskId;
      [...select.options].forEach(optionElement => {
        if (!optionElement.value) return;
        const option = activeMission.options.find(item => item.id === optionElement.value);
        const usedElsewhere = Object.entries(selectedByTask).some(
          ([otherTask, value]) => otherTask !== taskId && value === optionElement.value
        );
        optionElement.disabled = Boolean(option && !option.reusable && usedElsewhere);
      });
    });
  }

  function fieldLabel(field) {
    return {
      source: "Source",
      destination: "Destination",
      protocol: "Protocol",
      port: "Port",
      action: "Action"
    }[field] || field;
  }

  function rowLabel(row, fields) {
    const values = fields.map(field => row?.[field] || "—");
    return values.join(" · ");
  }

  registerRenderer("configuration-table", {
    render(activeMission, context) {
      const wrapper = createElement("div", "pbq-table-scroll");
      wrapper.tabIndex = 0;
      const tableLabel = activeMission.tableLabel || "Configuration table";
      wrapper.setAttribute("aria-label", `${tableLabel}. Scroll horizontally on narrow screens.`);
      const table = createElement("table", "pbq-configuration-table");
      const caption = createElement("caption", "", tableLabel);
      const head = document.createElement("thead");
      const headRow = document.createElement("tr");
      headRow.append(createElement("th", "", "Requirement"));
      activeMission.scoring.fields.forEach(field => {
        headRow.append(createElement("th", "", activeMission.fieldLabels?.[field] || fieldLabel(field)));
      });
      head.append(headRow);
      const body = document.createElement("tbody");

      activeMission.tasks.forEach((task, index) => {
        const row = document.createElement("tr");
        const requirement = document.createElement("th");
        requirement.scope = "row";
        requirement.append(
          createElement("strong", "", task.label || `Rule ${index + 1}`),
          createElement("span", "", task.prompt)
        );
        row.append(requirement);
        context.answers[task.id] ||= {};

        activeMission.scoring.fields.forEach(field => {
          const cell = document.createElement("td");
          const displayField = activeMission.fieldLabels?.[field] || fieldLabel(field);
          const label = createElement("label", "pbq-cell-label", `${task.label || `Rule ${index + 1}`} ${displayField}`);
          label.htmlFor = `pbq-${task.id}-${field}`;
          const select = createElement("select", "pbq-select");
          select.id = label.htmlFor;
          select.append(new Option(`Select ${displayField}`, ""));
          activeMission.options[field].forEach(value => select.append(new Option(value, value)));
          select.value = context.answers[task.id][field] || "";
          select.addEventListener("change", () => {
            if (select.value) context.answers[task.id][field] = select.value;
            else delete context.answers[task.id][field];
            context.onChange();
          });
          cell.append(label, select);
          row.append(cell);
        });
        body.append(row);
      });

      table.append(caption, head, body);
      wrapper.append(table);
      context.container.append(wrapper);
    },
    grade(activeMission, answers) {
      let points = 0;
      const fields = activeMission.scoring.fields;
      const taskResults = {};

      activeMission.tasks.forEach(task => {
        const answer = answers[task.id] || {};
        const correctAnswer = activeMission.solution[task.id];
        const correctFields = fields.filter(field => answer[field] === correctAnswer[field]).length;
        points += correctFields;
        taskResults[task.id] = {
          correct: correctFields === fields.length,
          answerLabel: rowLabel(answer, fields),
          correctLabel: rowLabel(correctAnswer, fields),
          correctFields
        };
      });

      return {
        points,
        maxPoints: activeMission.scoring.maxPoints,
        percent: Math.round((points / activeMission.scoring.maxPoints) * 100),
        taskResults
      };
    }
  });

  registerRenderer("visual-labeling", {
    render(activeMission, context) {
      const layout = createElement("div", "pbq-visual-labeling");
      const figure = createElement("figure", "pbq-visual-figure");
      const imageStage = createElement("div", "pbq-visual-stage");
      const image = createElement("img", "pbq-visual-image");
      image.src = activeMission.visual.src;
      image.alt = activeMission.visual.alt;
      image.addEventListener("error", () => {
        imageStage.classList.add("has-load-error");
        announce("The mission image could not be loaded.");
      });
      imageStage.append(image);

      const answerList = createElement("div", "pbq-visual-answer-list");
      const markerMap = new Map();

      function updateMarkers() {
        activeMission.tasks.forEach(task => {
          const marker = markerMap.get(task.id);
          const answered = Boolean(context.answers[task.id]);
          const markerPrompt = task.prompt.replace(/[.!?]+$/, "");
          marker?.classList.toggle("is-answered", answered);
          marker?.setAttribute(
            "aria-label",
            `Callout ${task.callout.label}: ${markerPrompt}. ${answered ? "Answered." : "Not answered."} Focus answer control.`
          );
        });
      }

      activeMission.tasks.forEach((task, index) => {
        const selectId = `pbq-visual-${task.id}`;
        const marker = createElement("button", "pbq-visual-marker", task.callout.label);
        marker.type = "button";
        marker.dataset.taskId = task.id;
        marker.style.left = `${task.callout.x}%`;
        marker.style.top = `${task.callout.y}%`;
        marker.setAttribute("aria-controls", selectId);
        marker.addEventListener("click", () => {
          document.getElementById(selectId)?.focus();
          announce(`Callout ${task.callout.label} answer control focused.`);
        });
        markerMap.set(task.id, marker);
        imageStage.append(marker);

        const row = createElement("article", "pbq-visual-answer");
        const heading = createElement("div", "pbq-visual-answer-heading");
        heading.append(
          createElement("span", "pbq-visual-callout-label", task.callout.label),
          createElement("strong", "", `${index + 1}. ${task.prompt}`)
        );
        const label = createElement("label", "pbq-cell-label", `Answer for callout ${task.callout.label}`);
        label.htmlFor = selectId;
        const select = createElement("select", "pbq-select");
        select.id = selectId;
        select.dataset.taskId = task.id;
        select.append(new Option(task.placeholder || "Select the correct label", ""));
        activeMission.options.forEach(option => select.append(new Option(option.label, option.id)));
        select.value = context.answers[task.id] || "";
        select.addEventListener("change", () => {
          if (select.value) context.answers[task.id] = select.value;
          else delete context.answers[task.id];
          updateSingleUseOptions(activeMission, answerList, context.answers);
          updateMarkers();
          context.onChange();
        });
        row.append(heading, label, select);
        answerList.append(row);
      });

      figure.append(imageStage);
      if (activeMission.visual.caption) {
        figure.append(createElement("figcaption", "pbq-visual-caption", activeMission.visual.caption));
      }
      layout.append(figure, answerList);
      context.container.append(layout);
      updateSingleUseOptions(activeMission, answerList, context.answers);
      updateMarkers();
    },
    grade(activeMission, answers) {
      let points = 0;
      const taskResults = {};
      activeMission.tasks.forEach(task => {
        const answer = answers[task.id] || "";
        const correctAnswer = activeMission.solution[task.id];
        const correct = answer === correctAnswer;
        if (correct) points += 1;
        taskResults[task.id] = {
          correct,
          answerLabel: optionLabel(activeMission, answer),
          correctLabel: optionLabel(activeMission, correctAnswer)
        };
      });
      return {
        points,
        maxPoints: activeMission.scoring.maxPoints,
        percent: Math.round((points / activeMission.scoring.maxPoints) * 100),
        taskResults
      };
    }
  });

  registerRenderer("ordering", createChoiceRenderer("Select the correct position"));
  registerRenderer("categorization", createChoiceRenderer("Select the best category"));
  registerRenderer("classification", createChoiceRenderer("Select the correct classification"));

  function connectControls() {
    elements.previous.addEventListener("click", () => changeMission(-1));
    elements.next.addEventListener("click", () => changeMission(1));
    elements.flag.addEventListener("click", () => {
      const activeMission = mission();
      state.flags[activeMission.id] = !state.flags[activeMission.id];
      saveState();
      updateFlag(activeMission);
      announce(state.flags[activeMission.id] ? "Mission flagged for review." : "Mission flag removed.");
    });
    elements.reset.addEventListener("click", resetMission);
    elements.submit.addEventListener("click", submitMission);
    elements.showReport.addEventListener("click", renderCampaignReport);
  }

  async function initialize() {
    try {
      const certification = new URLSearchParams(window.location.search).get("certification") || "";
      configuration = CERTIFICATIONS[certification];
      if (!configuration) {
        elements.loading.classList.add("hidden");
        elements.error.classList.remove("hidden");
        elements.errorMessage.textContent = "This PBQ Arena certification is not enabled in Phase 1.";
        return;
      }

      const response = await fetch(configuration.bank, { cache: "no-store" });
      if (!response.ok) throw new Error(`Unable to load PBQ bank (${response.status}).`);
      bank = validateBank(await response.json(), certification);
      storageKey = `hydra-pbq-arena:v1:${certification}`;
      state = restoreState();
      currentIndex = state.currentIndex;

      elements.certification.textContent = `${configuration.label} · Production PBQ Campaign`;
      elements.returnLink.href = configuration.returnHref;
      elements.returnLink.textContent = `← ${configuration.returnLabel}`;
      connectControls();
      renderMission();
      elements.loading.classList.add("hidden");
      elements.application.classList.remove("hidden");
    } catch (error) {
      console.error(error);
      elements.loading.classList.add("hidden");
      elements.error.classList.remove("hidden");
      elements.errorMessage.textContent = error.message;
    }
  }

  initialize();
})();
