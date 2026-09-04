(function () {
  "use strict";

  const MANUAL_KEY = "hydra-cloud-plus-field-manual-v1";
  const params = new URLSearchParams(window.location.search);
  const world = params.get("world") || "";
  const objective = params.get("objective") || "";
  const elements = {
    loading: document.getElementById("cloudManualLoading"),
    error: document.getElementById("cloudManualError"),
    errorMessage: document.getElementById("cloudManualErrorMessage"),
    errorReturn: document.getElementById("cloudManualErrorReturn"),
    application: document.getElementById("cloudManualApplication"),
    kicker: document.getElementById("cloudManualKicker"),
    objective: document.getElementById("cloudManualObjective"),
    completionNote: document.getElementById("cloudManualCompletionNote"),
    navigation: document.getElementById("cloudManualNavigation"),
    navigationLinks: document.getElementById("cloudManualNavigationLinks"),
    sections: document.getElementById("cloudManualSections"),
    miniForm: document.getElementById("cloudMiniCheckForm"),
    miniPrompt: document.getElementById("cloudMiniCheckPrompt"),
    miniChoices: document.getElementById("cloudMiniCheckChoices"),
    miniFeedback: document.getElementById("cloudMiniCheckFeedback"),
    complete: document.getElementById("cloudManualComplete"),
    returnLink: document.getElementById("cloudManualReturn")
  };

  let lesson = null;
  let miniCheck = null;
  let miniCheckPassed = false;

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
    state.objectives = state.objectives && typeof state.objectives === "object" ? state.objectives : {};
    const prior = state.objectives[objective] || {};
    state.objectives[objective] = {
      ...prior,
      chapter: world,
      completed: true,
      completedAt: prior.completedAt || new Date().toISOString()
    };
    localStorage.setItem(MANUAL_KEY, JSON.stringify(state));
  }

  function validateLesson(candidate) {
    if (!candidate || typeof candidate !== "object") throw new Error("The Field Manual lesson is not a valid object.");
    if (candidate.schemaVersion !== 1) throw new Error("This Field Manual schema is not supported.");
    if (candidate.certification !== "cloud-plus") throw new Error("The Field Manual certification does not match this route.");
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
    if (candidate.miniCheckSource !== "objective-sweep-bank") {
      throw new Error("The Field Manual is not connected to the GSA-owned Mini Check source.");
    }
    return candidate;
  }

  function validateMiniCheck(candidate) {
    if (!candidate || typeof candidate !== "object" || !candidate.question || !Array.isArray(candidate.choices)) {
      throw new Error("The GSA Mini Check could not be loaded.");
    }
    if (candidate.choices.length < 2 || !Number.isInteger(Number(candidate.answer)) || !candidate.choices[Number(candidate.answer)]) {
      throw new Error("The GSA Mini Check contains an invalid answer definition.");
    }
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
      const container = create("section", "security-field-section" + (section.variant === "exam-trap" ? " security-exam-trap" : ""));
      container.id = "manual-" + section.id;
      container.append(create("h2", "", section.title));
      appendParagraphs(container, section.paragraphs);
      (section.entries || []).forEach(entry => appendEntry(container, entry));
      if (Array.isArray(section.bullets) && section.bullets.length) {
        const list = create("ul");
        section.bullets.forEach(item => list.append(create("li", "", item)));
        container.append(list);
      }
      if (section.callout) container.append(create("aside", "security-recognition-cue", "⭐ " + section.callout));
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
    miniCheckLink.href = "#cloudMiniCheckHeading";
    elements.navigationLinks.append(miniCheckLink);
    elements.navigation.classList.remove("hidden");
  }

  function resetMiniCheckState() {
    miniCheckPassed = false;
    elements.complete.classList.add("hidden");
    elements.miniFeedback.className = "security-mini-check-feedback";
    elements.miniFeedback.textContent = "Choose an answer, then check your response.";
  }

  function renderMiniCheck() {
    elements.miniPrompt.textContent = miniCheck.question;
    elements.miniChoices.replaceChildren();
    miniCheck.choices.forEach((choice, index) => {
      const label = create("label", "answer-option");
      const input = create("input");
      input.type = "radio";
      input.name = "cloud-mini-check-answer";
      input.value = String(index);
      input.addEventListener("change", resetMiniCheckState);
      label.append(input, document.createTextNode(" " + choice));
      elements.miniChoices.append(label);
    });
  }

  function showRouteError(message) {
    elements.loading.classList.add("hidden");
    elements.application.classList.add("hidden");
    elements.error.classList.remove("hidden");
    elements.errorMessage.textContent = message;
    elements.errorReturn.href = /^[1-5]$/.test(world) ? "cloud-plus-world" + world + "-objectives.html" : "cloud-plus-campaign.html";
    elements.errorReturn.textContent = /^[1-5]$/.test(world) ? "← Return to Chapter " + world + " Objective Hub" : "← Return to Cloud+ Campaign Map";
  }

  function connectControls() {
    elements.miniForm.addEventListener("submit", event => {
      event.preventDefault();
      const selected = elements.miniForm.querySelector('input[name="cloud-mini-check-answer"]:checked');
      if (!selected) {
        elements.miniFeedback.className = "security-mini-check-feedback is-incorrect";
        elements.miniFeedback.textContent = "Choose an answer before checking your response.";
        return;
      }
      const correct = Number(selected.value) === Number(miniCheck.answer);
      miniCheckPassed = correct;
      elements.miniFeedback.className = "security-mini-check-feedback " + (correct ? "is-correct" : "is-incorrect");
      elements.miniFeedback.textContent = correct
        ? "Correct. " + miniCheck.explanation
        : "Not quite. Review the objective recognition cues and try again.";
      elements.complete.classList.toggle("hidden", !correct);
      if (correct) elements.complete.focus();
    });

    elements.complete.addEventListener("click", () => {
      if (!miniCheckPassed) return;
      try {
        saveCompletion();
        window.location.assign("cloud-plus-quiz.html?world=" + encodeURIComponent(world) + "&objective=" + encodeURIComponent(objective));
      } catch (_) {
        elements.miniFeedback.className = "security-mini-check-feedback is-incorrect";
        elements.miniFeedback.textContent = "The lesson is complete, but this browser could not save the Field Manual status. Return to the Objective Hub and try again.";
      }
    });
  }

  async function initialize() {
    const objectiveMatchesWorld = objective.split(".")[0] === world || (world === "5" && /^6\.[1-3]$/.test(objective));
    if (!/^[1-5]$/.test(world) || !/^[1-6]\.\d+$/.test(objective) || !objectiveMatchesWorld) {
      showRouteError("The requested Cloud+ Field Manual route is invalid.");
      return;
    }

    try {
      const lessonResponse = await fetch("json/cloud-plus/field-manual/" + objective + ".json");
      if (!lessonResponse.ok) throw new Error("This Cloud+ Field Manual has not been published yet.");
      lesson = validateLesson(await lessonResponse.json());

      const bankResponse = await fetch("json/cloud-plus/world" + world + "/" + objective + "-hatchling.json");
      if (!bankResponse.ok) throw new Error("The GSA Mini Check source could not be loaded.");
      const rawBank = await bankResponse.json();
      const bank = Array.isArray(rawBank) ? rawBank : rawBank.questions;
      miniCheck = validateMiniCheck(bank?.[0]);

      elements.kicker.textContent = "Cloud+ · Chapter " + world + " · Objective " + objective;
      elements.objective.textContent = lesson.title;
      elements.returnLink.href = "cloud-plus-world" + world + "-objectives.html";
      elements.returnLink.textContent = "← Return to Chapter " + world + " Objective Hub";
      elements.complete.textContent = "⚔️ Complete Manual and Begin Objective " + objective + " Sweep";
      if (isComplete()) {
        elements.completionNote.textContent = "Field Manual completed · Objective Sweep mastery remains separate.";
        elements.completionNote.classList.remove("hidden");
      }
      renderSections();
      renderNavigation();
      renderMiniCheck();
      elements.loading.classList.add("hidden");
      elements.application.classList.remove("hidden");
    } catch (error) {
      showRouteError(error.message);
    }
  }

  connectControls();
  initialize();
}());
