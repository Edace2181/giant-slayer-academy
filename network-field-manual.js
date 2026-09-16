(function () {
  "use strict";

  const MANUAL_KEY = "hydra-network-plus-field-manual-v1";
  const params = new URLSearchParams(window.location.search);
  const world = params.get("world") || "";
  const objective = params.get("objective") || "";
  const elements = {
    loading: document.getElementById("networkManualLoading"), error: document.getElementById("networkManualError"),
    errorMessage: document.getElementById("networkManualErrorMessage"), errorReturn: document.getElementById("networkManualErrorReturn"),
    application: document.getElementById("networkManualApplication"), kicker: document.getElementById("networkManualKicker"),
    objective: document.getElementById("networkManualObjective"), completionNote: document.getElementById("networkManualCompletionNote"),
    navigation: document.getElementById("networkManualNavigation"), navigationLinks: document.getElementById("networkManualNavigationLinks"),
    sections: document.getElementById("networkManualSections"), miniForm: document.getElementById("networkMiniCheckForm"),
    miniPrompt: document.getElementById("networkMiniCheckPrompt"), miniChoices: document.getElementById("networkMiniCheckChoices"),
    miniFeedback: document.getElementById("networkMiniCheckFeedback"), complete: document.getElementById("networkManualComplete"),
    returnLink: document.getElementById("networkManualReturn")
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
    } catch (_) { return {}; }
  }

  function isComplete() { return Boolean(readState().objectives?.[objective]?.completed); }

  function saveCompletion() {
    const state = readState();
    state.version = 1;
    state.objectives = state.objectives && typeof state.objectives === "object" ? state.objectives : {};
    const prior = state.objectives[objective] || {};
    state.objectives[objective] = { ...prior, world, completed: true, completedAt: prior.completedAt || new Date().toISOString() };
    localStorage.setItem(MANUAL_KEY, JSON.stringify(state));
  }

  function validateLesson(candidate) {
    if (!candidate || typeof candidate !== "object" || candidate.schemaVersion !== 1) throw new Error("This Field Manual is not valid.");
    if (candidate.certification !== "network-plus" || candidate.examCode !== "N10-009") throw new Error("The Field Manual does not match Network+.");
    if (candidate.world !== world || candidate.objective !== objective) throw new Error("The Field Manual route does not match its lesson metadata.");
    if (!candidate.title || !Array.isArray(candidate.sections) || !candidate.sections.length) throw new Error("The Field Manual is missing required teaching content.");
    const ids = new Set();
    candidate.sections.forEach(section => {
      if (!section.id || !section.title || ids.has(section.id) || !/^[a-z0-9-]+$/.test(section.id)) throw new Error("The Field Manual contains an invalid teaching section.");
      ids.add(section.id);
    });
    if (candidate.miniCheckSource !== "objective-sweep-bank") throw new Error("The Field Manual is not connected to the GSA Mini Check source.");
    return candidate;
  }

  function validateMiniCheck(candidate) {
    if (!candidate || !candidate.question || !Array.isArray(candidate.choices) || candidate.choices.length < 2 || !candidate.choices[Number(candidate.answer)]) {
      throw new Error("The GSA Mini Check could not be loaded.");
    }
    return candidate;
  }

  function appendParagraphs(parent, paragraphs) { (paragraphs || []).forEach(value => parent.append(create("p", "", value))); }

  function appendTable(parent, table) {
    if (!table) return;
    const wrapper = create("div", "security-manual-table-wrap");
    const element = create("table", "security-manual-table");
    element.append(create("caption", "", table.caption));
    const head = create("thead"), headRow = create("tr"), body = create("tbody");
    table.headers.forEach(label => headRow.append(create("th", "", label)));
    head.append(headRow);
    table.rows.forEach(row => {
      const rowElement = create("tr");
      row.forEach(value => rowElement.append(create("td", "", value)));
      body.append(rowElement);
    });
    element.append(head, body); wrapper.append(element); parent.append(wrapper);
  }

  function appendEntry(parent, entry) {
    const article = create("article", "security-field-entry");
    article.append(create("h3", "", entry.title));
    appendParagraphs(article, entry.paragraphs);
    if (entry.examples?.length) {
      const list = create("ul"); entry.examples.forEach(value => list.append(create("li", "", value))); article.append(list);
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
      if (section.bullets?.length) {
        const list = create("ul"); section.bullets.forEach(value => list.append(create("li", "", value))); container.append(list);
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
      link.href = "#manual-" + section.id; elements.navigationLinks.append(link);
    });
    const miniCheckLink = create("a", "security-manual-navigation-link", "Mini Check");
    miniCheckLink.href = "#networkMiniCheckHeading"; elements.navigationLinks.append(miniCheckLink);
    elements.navigation.classList.remove("hidden");
  }

  function resetMiniCheckState() {
    miniCheckPassed = false; elements.complete.classList.add("hidden");
    elements.miniFeedback.className = "security-mini-check-feedback";
    elements.miniFeedback.textContent = "Choose an answer, then check your response.";
  }

  function renderMiniCheck() {
    elements.miniPrompt.textContent = miniCheck.question; elements.miniChoices.replaceChildren();
    miniCheck.choices.forEach((choice, index) => {
      const label = create("label", "answer-option"), input = create("input");
      input.type = "radio"; input.name = "network-mini-check-answer"; input.value = String(index);
      input.addEventListener("change", resetMiniCheckState);
      label.append(input, document.createTextNode(" " + choice)); elements.miniChoices.append(label);
    });
  }

  function showRouteError(message) {
    elements.loading.classList.add("hidden"); elements.application.classList.add("hidden"); elements.error.classList.remove("hidden");
    elements.errorMessage.textContent = message;
    elements.errorReturn.href = /^[1-5]$/.test(world) ? "network-world" + world + "-objectives.html" : "network-campaign.html";
    elements.errorReturn.textContent = /^[1-5]$/.test(world) ? "← Return to World " + world + " Objective Hub" : "← Return to Network+ Campaign Map";
  }

  elements.miniForm.addEventListener("submit", event => {
    event.preventDefault();
    const selected = elements.miniForm.querySelector('input[name="network-mini-check-answer"]:checked');
    if (!selected) {
      elements.miniFeedback.className = "security-mini-check-feedback is-incorrect";
      elements.miniFeedback.textContent = "Choose an answer before checking your response."; return;
    }
    const correct = Number(selected.value) === Number(miniCheck.answer); miniCheckPassed = correct;
    elements.miniFeedback.className = "security-mini-check-feedback " + (correct ? "is-correct" : "is-incorrect");
    elements.miniFeedback.textContent = correct ? "Correct. " + miniCheck.explanation : "Not quite. Review the objective recognition cues and try again.";
    elements.complete.classList.toggle("hidden", !correct); if (correct) elements.complete.focus();
  });

  elements.complete.addEventListener("click", () => {
    if (!miniCheckPassed) return;
    try {
      saveCompletion();
      window.location.assign("hydra-quiz.html?world=" + encodeURIComponent(world) + "&objective=" + encodeURIComponent(objective));
    } catch (_) {
      elements.miniFeedback.className = "security-mini-check-feedback is-incorrect";
      elements.miniFeedback.textContent = "The lesson is complete, but this browser could not save its status. Return to the Objective Hub and try again.";
    }
  });

  async function initialize() {
    const validRoute = (world === "1" && /^1\.[1-8]$/.test(objective)) ||
      (world === "2" && /^2\.[1-4]$/.test(objective)) ||
      (world === "3" && /^3\.[1-5]$/.test(objective)) ||
      (world === "4" && /^4\.[1-3]$/.test(objective)) ||
      (world === "5" && /^5\.[1-5]$/.test(objective));
    if (!validRoute) {
      showRouteError("The requested Network+ Field Manual route is invalid."); return;
    }
    try {
      const lessonResponse = await fetch("json/network-plus/field-manual/" + objective + ".json");
      if (!lessonResponse.ok) throw new Error("This Network+ Field Manual has not been published yet.");
      lesson = validateLesson(await lessonResponse.json());
      const bankResponse = await fetch("json/world" + world + "/" + objective + "-hatchling.json");
      if (!bankResponse.ok) throw new Error("The GSA Mini Check source could not be loaded.");
      const rawBank = await bankResponse.json();
      miniCheck = validateMiniCheck((Array.isArray(rawBank) ? rawBank : rawBank.questions)?.[0]);
      elements.kicker.textContent = "CompTIA Network+ · N10-009 · World " + world + " · Objective " + objective;
      elements.objective.textContent = lesson.title;
      elements.returnLink.href = "network-world" + world + "-objectives.html";
      elements.returnLink.textContent = "← Return to World " + world + " Objective Hub";
      elements.complete.textContent = "⚔️ Complete Manual and Begin Objective " + objective + " Sweep";
      if (isComplete()) {
        elements.completionNote.textContent = "Field Manual completed · Objective Sweep mastery remains separate.";
        elements.completionNote.classList.remove("hidden");
      }
      renderSections(); renderNavigation(); renderMiniCheck();
      elements.loading.classList.add("hidden"); elements.application.classList.remove("hidden");
    } catch (error) { showRouteError(error.message); }
  }

  initialize();
}());
