(function () {
  "use strict";

  const MANUAL_KEY = "hydra-security-plus-field-manual-v1";
  const params = new URLSearchParams(window.location.search);
  const world = params.get("world") || "";
  const objective = params.get("objective") || "";
  const elements = {
    loading: document.getElementById("securityManualLoading"),
    error: document.getElementById("securityManualError"),
    errorMessage: document.getElementById("securityManualErrorMessage"),
    errorReturn: document.getElementById("securityManualErrorReturn"),
    application: document.getElementById("securityManualApplication"),
    kicker: document.getElementById("securityManualKicker"),
    objective: document.getElementById("securityManualObjective"),
    completionNote: document.getElementById("securityManualCompletionNote"),
    navigation: document.getElementById("securityManualNavigation"),
    navigationLinks: document.getElementById("securityManualNavigationLinks"),
    sections: document.getElementById("securityManualSections"),
    miniIntro: document.getElementById("securityMiniCheckIntro"),
    miniPrompt: document.getElementById("securityMiniCheckPrompt"),
    miniFields: document.getElementById("securityMiniCheckFields"),
    miniForm: document.getElementById("securityMiniCheckForm"),
    miniFeedback: document.getElementById("securityMiniCheckFeedback"),
    complete: document.getElementById("securityManualComplete"),
    returnLink: document.getElementById("securityManualReturn")
  };

  let lesson = null;
  let miniCheckPassed = false;
  const miniSelections = new Map();

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function readState() {
    try {
      const value = JSON.parse(localStorage.getItem(MANUAL_KEY) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch (_) {
      return {};
    }
  }

  function isComplete() {
    return Boolean(readState().objectives?.[objective]?.completed);
  }

  function saveCompletion() {
    const state = readState();
    state.version = 1;
    state.objectives = state.objectives && typeof state.objectives === "object"
      ? state.objectives
      : {};
    const prior = state.objectives[objective] || {};
    state.objectives[objective] = {
      ...prior,
      world,
      completed: true,
      completedAt: prior.completedAt || new Date().toISOString()
    };
    localStorage.setItem(MANUAL_KEY, JSON.stringify(state));
  }

  function validateLesson(candidate) {
    if (!candidate || typeof candidate !== "object") throw new Error("The Field Manual lesson is not a valid object.");
    if (candidate.schemaVersion !== 1) throw new Error("This Field Manual schema is not supported.");
    if (candidate.certification !== "security-plus") throw new Error("The Field Manual certification does not match this route.");
    if (candidate.world !== world || candidate.objective !== objective) throw new Error("The Field Manual route does not match its lesson metadata.");
    if (!candidate.title || !Array.isArray(candidate.sections) || !candidate.sections.length) {
      throw new Error("The Field Manual lesson is missing required teaching content.");
    }
    const sectionIds = new Set();
    candidate.sections.forEach(section => {
      if (!section.id || !section.title || sectionIds.has(section.id) || !/^[a-z0-9-]+$/.test(section.id)) {
        throw new Error("The Field Manual contains an invalid or repeated teaching section.");
      }
      sectionIds.add(section.id);
    });
    if (!candidate.miniCheck || !Array.isArray(candidate.miniCheck.fields) || candidate.miniCheck.fields.length !== 2) {
      throw new Error("The Field Manual lesson is missing its Mini Check.");
    }
    const fieldIds = new Set();
    candidate.miniCheck.fields.forEach(field => {
      if (!field.id || fieldIds.has(field.id) || !field.label || !Array.isArray(field.choices) || field.choices.length < 2) {
        throw new Error("The Field Manual Mini Check contains an invalid classification field.");
      }
      if (!field.choices.includes(field.answer)) throw new Error("A Mini Check answer is not present in its choices.");
      fieldIds.add(field.id);
    });
    return candidate;
  }

  function appendParagraphs(parent, paragraphs) {
    (paragraphs || []).forEach(text => parent.append(create("p", "", text)));
  }

  function appendTable(parent, table) {
    if (!table) return;
    const wrapper = create("div", "security-manual-table-wrap");
    const element = create("table", "security-manual-table");
    element.append(create("caption", "", table.caption));
    const head = create("thead");
    const headRow = create("tr");
    table.headers.forEach(label => headRow.append(create("th", "", label)));
    head.append(headRow);
    const body = create("tbody");
    table.rows.forEach(row => {
      const rowElement = create("tr");
      row.forEach(value => rowElement.append(create("td", "", value)));
      body.append(rowElement);
    });
    element.append(head, body);
    wrapper.append(element);
    parent.append(wrapper);
  }

  function appendEntry(parent, entry) {
    const article = create("article", "security-field-entry");
    article.append(create("h3", "", entry.title));
    appendParagraphs(article, entry.paragraphs);
    if (Array.isArray(entry.examples) && entry.examples.length) {
      const list = create("ul");
      entry.examples.forEach(example => list.append(create("li", "", example)));
      article.append(list);
    }
    if (entry.memoryHook) article.append(create("p", "", "Memory hook: " + entry.memoryHook));
    if (entry.recognitionCue) article.append(create("aside", "security-recognition-cue", "⭐ " + entry.recognitionCue));
    parent.append(article);
  }

  function renderSections() {
    elements.sections.replaceChildren();
    lesson.sections.forEach(section => {
      const container = create(
        "section",
        "security-field-section" + (section.variant === "exam-trap" ? " security-exam-trap" : "")
      );
      container.id = "manual-" + section.id;
      container.append(create("h2", "", section.title));
      appendParagraphs(container, section.paragraphs);
      (section.entries || []).forEach(entry => appendEntry(container, entry));
      if (Array.isArray(section.bullets) && section.bullets.length) {
        const list = create("ul");
        section.bullets.forEach(item => list.append(create("li", "", item)));
        container.append(list);
      }
      if (section.callout) {
        container.append(create("aside", "security-recognition-cue", "⭐ " + section.callout));
      }
      appendTable(container, section.table);
      elements.sections.append(container);
    });
  }

  function renderNavigation() {
    elements.navigationLinks.replaceChildren();
    lesson.sections.forEach(section => {
      const link = create("a", "security-manual-navigation-link", section.title);
      link.href = "#manual-" + section.id;
      elements.navigationLinks.append(link);
    });
    const miniCheckLink = create("a", "security-manual-navigation-link", "Mini Check");
    miniCheckLink.href = "#securityMiniCheckHeading";
    elements.navigationLinks.append(miniCheckLink);
    elements.navigation.classList.remove("hidden");
  }

  function resetMiniCheckState() {
    miniCheckPassed = false;
    elements.complete.classList.add("hidden");
    elements.miniFeedback.className = "security-mini-check-feedback";
    elements.miniFeedback.textContent = "Complete both selections, then check your answer.";
  }

  function renderMiniCheck() {
    const check = lesson.miniCheck;
    elements.miniIntro.textContent = check.intro;
    elements.miniPrompt.textContent = check.prompt;
    elements.miniFields.replaceChildren();
    miniSelections.clear();

    check.fields.forEach(field => {
      const label = create("label", "", field.label);
      label.htmlFor = "mini-check-" + field.id;
      const select = create("select");
      select.id = "mini-check-" + field.id;
      select.name = field.id;
      select.required = true;
      select.append(create("option", "", "Choose " + field.label.toLowerCase()));
      select.firstElementChild.value = "";
      field.choices.forEach(choice => {
        const option = create("option", "", choice);
        option.value = choice;
        select.append(option);
      });
      select.addEventListener("change", () => {
        miniSelections.set(field.id, select.value);
        resetMiniCheckState();
      });
      label.append(select);
      elements.miniFields.append(label);
    });
  }

  function showRouteError(message) {
    elements.loading.classList.add("hidden");
    elements.application.classList.add("hidden");
    elements.error.classList.remove("hidden");
    elements.errorMessage.textContent = message;
    elements.errorReturn.href = /^[1-5]$/.test(world)
      ? "security-plus-world" + world + "-objectives.html"
      : "security-plus-campaign.html";
    elements.errorReturn.textContent = /^[1-5]$/.test(world)
      ? "← Return to World " + world + " Objective Hub"
      : "← Return to Security+ Campaign Map";
  }

  function connectControls() {
    elements.miniForm.addEventListener("submit", event => {
      event.preventDefault();
      const fields = lesson.miniCheck.fields;
      if (fields.some(field => !miniSelections.get(field.id))) {
        elements.miniFeedback.className = "security-mini-check-feedback is-incorrect";
        elements.miniFeedback.textContent = "Choose an answer for both fields before checking your response.";
        return;
      }
      const correct = fields.every(field => miniSelections.get(field.id) === field.answer);
      miniCheckPassed = correct;
      elements.miniFeedback.className = "security-mini-check-feedback " + (correct ? "is-correct" : "is-incorrect");
      elements.miniFeedback.textContent = correct
        ? lesson.miniCheck.correctFeedback
        : lesson.miniCheck.retryFeedback;
      elements.complete.classList.toggle("hidden", !correct);
      if (correct) elements.complete.focus();
    });

    elements.complete.addEventListener("click", () => {
      if (!miniCheckPassed) return;
      try {
        saveCompletion();
        window.location.assign("security-plus-quiz.html?world=" + encodeURIComponent(world) + "&objective=" + encodeURIComponent(objective));
      } catch (_) {
        elements.miniFeedback.className = "security-mini-check-feedback is-incorrect";
        elements.miniFeedback.textContent = "The lesson is complete, but this browser could not save the Field Manual status. Return to the Objective Hub and try again.";
      }
    });
  }

  async function initialize() {
    if (!/^[1-5]$/.test(world) || !/^[1-5]\.\d+$/.test(objective) || objective.split(".")[0] !== world) {
      showRouteError("The requested Security+ Field Manual route is invalid.");
      return;
    }

    try {
      const response = await fetch("json/security-plus/field-manual/" + objective + ".json", { cache: "no-store" });
      if (!response.ok) throw new Error("This Security+ Field Manual has not been published yet.");
      lesson = validateLesson(await response.json());
      document.title = "Giant Slayer Academy | Security+ | Objective " + objective + " Field Manual";
      elements.kicker.textContent = "Security+ · " + lesson.examCode + " · World " + world;
      elements.objective.textContent = "Objective " + objective + " · " + lesson.title;
      elements.returnLink.href = "security-plus-world" + world + "-objectives.html";
      elements.returnLink.textContent = "← Return to World " + world + " Objective Hub";
      elements.complete.textContent = "⚔️ Complete Manual and Begin Objective " + objective + " Sweep";
      if (isComplete()) {
        elements.completionNote.textContent = "✓ This Field Manual has already been completed. You may review it again at any time.";
        elements.completionNote.classList.remove("hidden");
      }
      renderSections();
      renderNavigation();
      renderMiniCheck();
      connectControls();
      elements.loading.classList.add("hidden");
      elements.application.classList.remove("hidden");
    } catch (error) {
      showRouteError(error.message || "The requested lesson could not be loaded.");
    }
  }

  initialize();
}());
