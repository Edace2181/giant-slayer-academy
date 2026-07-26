(function () {
  "use strict";

  const CERTIFICATIONS = Object.freeze({
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
      const taskIds = new Set();
      item.tasks.forEach(task => {
        if (!task.id || !task.prompt) throw new Error(`Mission "${item.id}" contains an invalid task.`);
        if (taskIds.has(task.id)) throw new Error(`Mission "${item.id}" contains duplicate task ID "${task.id}".`);
        taskIds.add(task.id);
        if (!(task.id in item.solution)) throw new Error(`Mission "${item.id}" has no solution for "${task.id}".`);
        if (!(task.id in item.explanations)) throw new Error(`Mission "${item.id}" has no explanation for "${task.id}".`);
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

  function submitMission() {
    const activeMission = mission();
    const result = renderers.get(activeMission.type).grade(activeMission, missionAnswers(activeMission));
    state.submitted[activeMission.id] = result;
    saveState();
    renderChecklist(activeMission);
    renderReview(activeMission, result);
    disableSubmittedWorkspace(activeMission);
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
