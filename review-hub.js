(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("cert") || "";
  const reviewApi = window.HydraFlags;
  const config = reviewApi?.configFor(slug);
  const byId = id => document.getElementById(id);
  const hubView = byId("reviewHubView");
  const sessionView = byId("reviewSession");
  const worldFilter = byId("worldFilter");
  const objectiveFilter = byId("objectiveFilter");
  const historyTypeFilter = byId("historyTypeFilter");
  const sessionTypeFilter = byId("sessionTypeFilter");
  const collectionList = byId("collectionList");
  const summary = byId("collectionSummary");
  const startButton = byId("startReview");
  const loaded = new Map();
  const requestedView = params.get("view") || "";
  const directViews = new Set(["flags", "incorrect", "favorites", "weak", "adaptive", "all", "history"]);
  let activeType = directViews.has(requestedView) ? requestedView : "flags";
  let resolvedItems = [];
  let visibleItems = [];
  let session = [];
  let sessionIndex = 0;
  let sessionId = "";
  let answered = false;
  let sessionStartedCount = 0;
  let sessionAnsweredCount = 0;
  let sessionCorrectCount = 0;
  let sessionRecorded = false;

  const securityObjectiveTitles = {
    "1.1": "Compare and contrast various types of security controls",
    "1.2": "Summarize fundamental security concepts",
    "1.3": "Explain the importance of change management processes and the impact to security",
    "1.4": "Explain the importance of using appropriate cryptographic solutions",
    "2.1": "Compare and contrast common threat actors and motivations",
    "2.2": "Explain common threat vectors and attack surfaces",
    "2.3": "Explain various types of vulnerabilities",
    "2.4": "Given a scenario, analyze indicators of malicious activity",
    "2.5": "Explain the purpose of mitigation techniques used to secure the enterprise",
    "3.1": "Compare and contrast security implications of different architecture models",
    "3.2": "Given a scenario, apply security principles to secure enterprise infrastructure",
    "3.3": "Compare and contrast concepts and strategies to protect data",
    "3.4": "Explain the importance of resilience and recovery in security architecture",
    "4.1": "Given a scenario, apply common security techniques to computing resources",
    "4.2": "Explain the security implications of proper hardware, software, and data asset management",
    "4.3": "Explain various activities associated with vulnerability management",
    "4.4": "Explain security alerting and monitoring concepts and tools",
    "4.5": "Given a scenario, modify enterprise capabilities to enhance security",
    "4.6": "Given a scenario, implement and maintain identity and access management",
    "4.7": "Explain the importance of automation and orchestration related to secure operations",
    "4.8": "Explain appropriate incident response activities",
    "4.9": "Given a scenario, use data sources to support an investigation",
    "5.1": "Summarize elements of effective security governance",
    "5.2": "Explain elements of the risk management process",
    "5.3": "Explain the processes associated with third-party risk assessment and management",
    "5.4": "Summarize elements of effective security compliance",
    "5.5": "Explain types and purposes of audits and assessments",
    "5.6": "Given a scenario, implement security awareness practices"
  };

  const typeDetails = {
    flags: { title: "Flagged Questions", singular: "flagged question", empty: "No questions are currently flagged for this certification.", remove: "Remove Flag", sessionRemove: "🚩 Flagged — Remove Flag", complete: "Flagged Review Complete" },
    incorrect: { title: "Incorrect Answers", singular: "incorrect question", empty: "No Objective Sweep questions are currently awaiting recovery.", remove: "Remove Incorrect Record", sessionRemove: "Remove Incorrect Record", complete: "Incorrect Answers Review Complete" },
    favorites: { title: "Favorites", singular: "favorite question", empty: "No favorite questions are currently saved for this certification.", remove: "Remove Favorite", sessionRemove: "⭐ Favorite — Remove Favorite", complete: "Favorites Review Complete" },
    weak: { title: "Weak Objectives", singular: "objective", empty: "No Objective Sweep activity is available yet.", remove: "", sessionRemove: "", complete: "Weak Objective Review Complete" },
    adaptive: { title: "Adaptive Review", singular: "adaptive question", empty: "Hydra does not yet have enough Objective Sweep activity to build an adaptive session.", remove: "", sessionRemove: "", complete: "Adaptive Review Complete" },
    all: { title: "All Review Questions", singular: "review question", empty: "No questions currently qualify for review in this certification.", remove: "", sessionRemove: "", complete: "All Review Questions Complete" },
    history: { title: "Session History", singular: "completed session", empty: "No completed study sessions have been recorded for this certification yet.", remove: "", sessionRemove: "", complete: "Session History" }
  };

  if (!config) {
    byId("reviewCertification").textContent = "Unknown certification";
    hubView.innerHTML = '<p class="review-empty">This Review Hub link is invalid.</p>';
    return;
  }

  document.title = `Hydra ${config.name} | Review Hub`;
  byId("returnToCertification").href = config.home;

  async function loadBank(path) {
    if (!loaded.has(path)) {
      loaded.set(path, fetch(path).then(response => {
        if (!response.ok) throw new Error(`Unable to load ${path}`);
        return response.json();
      }).then(payload => Array.isArray(payload) ? payload : payload.questions));
    }
    return loaded.get(path);
  }

  function objectiveBankPath(world, objective) {
    return `${config.bankRoot}/world${world}/${objective}-hatchling.json`;
  }

  async function objectiveTitle(world, objective, questions) {
    if (slug === "security-plus" && securityObjectiveTitles[objective]) return securityObjectiveTitles[objective];
    const page = slug === "network-plus" ? `network-world${world}-objectives.html` : `${slug}-world${world}-objectives.html`;
    const cacheKey = `titles:${page}`;
    try {
      if (!loaded.has(cacheKey)) {
        loaded.set(cacheKey, fetch(page).then(response => response.ok ? response.text() : "").then(html => {
          const documentCopy = new DOMParser().parseFromString(html, "text/html");
          const titles = {};
          documentCopy.querySelectorAll("a[href*='objective=']").forEach(link => {
            const href = new URL(link.getAttribute("href"), window.location.href);
            const id = href.searchParams.get("objective");
            if (!id) return;
            const raw = link.dataset.title || link.textContent.replace(/\s+/g, " ").trim();
            const objectivePosition = raw.indexOf(id);
            titles[id] = (objectivePosition >= 0 ? raw.slice(objectivePosition + id.length) : raw).trim();
          });
          return titles;
        }));
      }
      const titles = await loaded.get(cacheKey);
      if (titles[objective]) return titles[objective];
    } catch (_) { /* Bank metadata remains a safe fallback. */ }
    return questions[0]?.blueprint || questions[0]?.category || `Objective ${objective}`;
  }

  function weaknessReason(row, assessed) {
    if (!row.assessed) return "Hydra does not yet have enough activity to assess this objective.";
    const reasons = [];
    const highestActive = Math.max(0, ...assessed.map(item => item.activeIncorrect));
    const sufficient = assessed.filter(item => item.sufficientAccuracy);
    const lowestAccuracy = sufficient.length ? Math.min(...sufficient.map(item => item.accuracy)) : null;
    if (row.activeIncorrect > 0 && row.activeIncorrect === highestActive) reasons.push("This objective currently has your highest number of unresolved incorrect questions.");
    else if (row.activeIncorrect > 0) reasons.push(`${row.activeIncorrect} question${row.activeIncorrect === 1 ? " remains" : "s remain"} unresolved and should receive additional review.`);
    if (row.sufficientAccuracy && sufficient.length > 1 && row.accuracy === lowestAccuracy) reasons.push("Your accuracy is currently lower than other objectives with sufficient activity.");
    else if (row.sufficientAccuracy && row.accuracy < 70) reasons.push("Your recorded accuracy is below 70%, so Hydra recommends focused reinforcement.");
    if (row.recurringWeaknesses > 0) reasons.push(`${row.recurringWeaknesses} recovered question${row.recurringWeaknesses === 1 ? " was" : "s were"} missed again, indicating recurring difficulty.`);
    if (!reasons.length && row.recoveredQuestions > 0) reasons.push("Your recovery work shows improvement, and Hydra recommends continued practice to keep this objective stable.");
    if (!reasons.length) reasons.push("Your recorded performance is stable, so this objective currently requires less attention than higher-ranked objectives.");
    return reasons.join(" ");
  }

  async function resolveWeakObjectives() {
    const incorrect = reviewApi.readIncorrectState(config);
    const evidence = reviewApi.readWeaknessState(config).objectives;
    const rows = [];
    for (let worldIndex = 0; worldIndex < config.objectiveCounts.length; worldIndex++) {
      const world = String(worldIndex + 1);
      const objectiveIds = config.objectivesByWorld?.[world] || Array.from({ length: config.objectiveCounts[worldIndex] }, (_, index) => `${world}.${index + 1}`);
      for (const objective of objectiveIds) {
        const bankPath = objectiveBankPath(world, objective);
        let questions = [];
        try { questions = await loadBank(bankPath); } catch (_) { questions = []; }
        const active = incorrect.active.filter(record => String(record.objective) === objective);
        const recovered = incorrect.recovered.filter(record => String(record.objective) === objective);
        const recordsByQuestion = new Map();
        [...active, ...recovered].forEach(record => {
          const key = reviewApi.recordKey(record);
          if (!recordsByQuestion.has(key)) recordsByQuestion.set(key, { active: false, recoveries: 0, misses: 0 });
          const entry = recordsByQuestion.get(key);
          entry.active ||= active.includes(record);
          entry.recoveries += recovered.includes(record) ? 1 : 0;
          entry.misses = Math.max(entry.misses, Number(record.missCount) || 0);
        });
        const objectiveEvidence = evidence[objective] || {};
        const attempts = Number(objectiveEvidence.attempts) || 0;
        const correct = Math.min(attempts, Number(objectiveEvidence.correct) || 0);
        const sufficientAccuracy = attempts >= 3;
        const accuracy = attempts ? Math.round((correct / attempts) * 100) : null;
        const recurringWeaknesses = [...recordsByQuestion.values()].filter(entry => (entry.recoveries > 0 && entry.active) || entry.recoveries > 1).length;
        const row = {
          metadata: { world, objective, bankPath }, questions,
          title: await objectiveTitle(world, objective, questions),
          attempts, correct, accuracy, sufficientAccuracy,
          activeIncorrect: active.length,
          totalMisses: Math.max(Number(objectiveEvidence.misses) || 0, [...recordsByQuestion.values()].reduce((sum, entry) => sum + entry.misses, 0)),
          recoveredQuestions: new Set(recovered.map(reviewApi.recordKey)).size,
          recurringWeaknesses
        };
        row.assessed = attempts > 0 || row.activeIncorrect > 0 || row.totalMisses > 0 || row.recoveredQuestions > 0;
        rows.push(row);
      }
    }
    const assessed = rows.filter(row => row.assessed).sort((a, b) =>
      b.activeIncorrect - a.activeIncorrect ||
      (a.sufficientAccuracy ? a.accuracy : 101) - (b.sufficientAccuracy ? b.accuracy : 101) ||
      b.recurringWeaknesses - a.recurringWeaknesses ||
      b.totalMisses - a.totalMisses ||
      a.metadata.objective.localeCompare(b.metadata.objective, undefined, { numeric: true })
    );
    assessed.forEach((row, index) => { row.rank = index + 1; });
    rows.forEach(row => {
      if (!row.assessed) row.status = { icon: "⚪", label: "Not Yet Assessed", className: "unassessed" };
      else if (row.activeIncorrect > 0 || row.recurringWeaknesses > 0 || (row.sufficientAccuracy && row.accuracy < 70)) row.status = { icon: "🔴", label: "Weak", className: "weak" };
      else if (!row.sufficientAccuracy || row.recoveredQuestions > 0 || row.accuracy < 85) row.status = { icon: "🟡", label: "Improving", className: "improving" };
      else row.status = { icon: "🟢", label: "Stable", className: "stable" };
      row.reason = weaknessReason(row, assessed);
    });
    resolvedItems = rows.sort((a, b) => (a.rank || 999) - (b.rank || 999) || a.metadata.objective.localeCompare(b.metadata.objective, undefined, { numeric: true }));
  }

  async function resolveItems() {
    if (activeType === "weak") return resolveWeakObjectives();
    if (activeType === "adaptive") return resolveAdaptiveReview();
    if (activeType === "all") return resolveAllReviewItems();
    if (activeType === "history") {
      const history = window.HydraCampaignUI?.getSessionHistory(config.progressKey) || [];
      resolvedItems = history.map(sessionRecord => ({
        metadata: {
          world: String(sessionRecord.world || ""),
          objective: String(sessionRecord.objective || "")
        },
        sessionRecord
      }));
      return;
    }
    const records = activeType === "incorrect" ? reviewApi.readIncorrectState(config).active : reviewApi.read(config, activeType);
    const results = await Promise.all(records.map(async metadata => {
      try {
        const bank = await loadBank(metadata.bankPath);
        const question = bank.find(item => String(item.id) === String(metadata.questionId));
        return question ? { metadata, question } : null;
      } catch (_) { return null; }
    }));
    resolvedItems = results.filter(Boolean);
  }

  async function resolveAdaptiveReview() {
    await resolveWeakObjectives();
    const objectiveRows = resolvedItems.filter(row => row.assessed && row.questions.length);
    const incorrect = reviewApi.readIncorrectState(config).active;
    const activeKeys = new Set(incorrect.map(reviewApi.recordKey));
    const pools = objectiveRows.map(row => {
      const accuracyGap = row.sufficientAccuracy ? Math.max(0, 85 - row.accuracy) : 8;
      const weight = Math.max(1,
        row.activeIncorrect * 40 +
        accuracyGap * 2 +
        row.recurringWeaknesses * 30 +
        row.totalMisses * 3 +
        (row.status.className === "weak" ? 25 : row.status.className === "improving" ? 10 : 1)
      );
      const questions = shuffle(row.questions).sort((a, b) => {
        const aKey = reviewApi.recordKey({ questionId: String(a.id), world: row.metadata.world, objective: row.metadata.objective, bankPath: row.metadata.bankPath });
        const bKey = reviewApi.recordKey({ questionId: String(b.id), world: row.metadata.world, objective: row.metadata.objective, bankPath: row.metadata.bankPath });
        return Number(activeKeys.has(bKey)) - Number(activeKeys.has(aKey));
      });
      return { row, weight, questions, selected: 0 };
    });
    const target = Math.min(10, pools.reduce((sum, pool) => sum + pool.questions.length, 0));
    const selected = [];
    while (selected.length < target) {
      const available = pools.filter(pool => pool.selected < pool.questions.length);
      if (!available.length) break;
      available.sort((a, b) =>
        (b.weight / (b.selected + 1)) - (a.weight / (a.selected + 1)) ||
        (a.row.rank || 999) - (b.row.rank || 999)
      );
      const pool = available[0];
      const question = pool.questions[pool.selected++];
      const metadata = {
        questionId: String(question.id),
        certification: config.name,
        world: pool.row.metadata.world,
        objective: pool.row.metadata.objective,
        bankPath: pool.row.metadata.bankPath
      };
      const questionIsActive = activeKeys.has(reviewApi.recordKey(metadata));
      selected.push({
        metadata,
        question,
        adaptive: {
          objectiveTitle: pool.row.title,
          rank: pool.row.rank,
          status: pool.row.status,
          accuracy: pool.row.accuracy,
          attempts: pool.row.attempts,
          activeIncorrect: pool.row.activeIncorrect,
          recurringWeaknesses: pool.row.recurringWeaknesses,
          reason: questionIsActive
            ? "This question is currently unresolved in Incorrect Answers."
            : pool.row.reason
        }
      });
    }
    resolvedItems = selected;
  }

  async function resolveAllReviewItems() {
    const combined = new Map();

    async function addRecords(records, source, isIncorrect = false) {
      await Promise.all(records.map(async metadata => {
        try {
          const bank = await loadBank(metadata.bankPath);
          const question = bank.find(item => String(item.id) === String(metadata.questionId));
          if (!question) return;
          const key = reviewApi.recordKey(metadata);
          const existing = combined.get(key);
          if (existing) {
            if (!existing.sources.includes(source)) existing.sources.push(source);
            if (isIncorrect) existing.incorrectMetadata = metadata;
            return;
          }
          combined.set(key, {
            metadata: {
              questionId: String(metadata.questionId),
              certification: metadata.certification || config.name,
              world: String(metadata.world),
              objective: String(metadata.objective),
              bankPath: metadata.bankPath
            },
            question,
            sources: [source],
            incorrectMetadata: isIncorrect ? metadata : null
          });
        } catch (_) { /* Missing source records are omitted safely. */ }
      }));
    }

    await addRecords(reviewApi.read(config, "flags"), "Flagged");
    await addRecords(reviewApi.read(config, "favorites"), "Favorite");
    await addRecords(reviewApi.readIncorrectState(config).active, "Incorrect Answer", true);

    await resolveWeakObjectives();
    const weakObjectives = resolvedItems.filter(item => item.status.className === "weak");
    weakObjectives.forEach(objective => {
      objective.questions.forEach(question => {
        const metadata = {
          questionId: String(question.id),
          certification: config.name,
          world: objective.metadata.world,
          objective: objective.metadata.objective,
          bankPath: objective.metadata.bankPath
        };
        const key = reviewApi.recordKey(metadata);
        const existing = combined.get(key);
        if (existing) {
          if (!existing.sources.includes("Weak Objective")) existing.sources.push("Weak Objective");
        } else {
          combined.set(key, { metadata, question, sources: ["Weak Objective"], incorrectMetadata: null });
        }
      });
    });

    resolvedItems = [...combined.values()].sort((a, b) =>
      Number(a.metadata.world) - Number(b.metadata.world) ||
      a.metadata.objective.localeCompare(b.metadata.objective, undefined, { numeric: true }) ||
      String(a.metadata.questionId).localeCompare(String(b.metadata.questionId), undefined, { numeric: true })
    );
  }

  function itemNeedsRecovery(item) {
    return activeType === "incorrect" || (activeType === "all" && item?.incorrectMetadata);
  }

  function recoveryMetadata(item) {
    return item?.incorrectMetadata || item?.metadata;
  }

  function setOptions(select, values, allLabel) {
    const previous = select.value;
    select.replaceChildren(new Option(allLabel, "all"));
    values.forEach(value => select.append(new Option(value, value)));
    select.value = values.includes(previous) ? previous : "all";
  }

  function refreshFilters() {
    const worlds = [...new Set(resolvedItems.map(item => item.metadata.world).filter(Boolean))].sort((a, b) => Number(a) - Number(b));
    setOptions(worldFilter, worlds, "All Worlds");
    const eligible = worldFilter.value === "all" ? resolvedItems : resolvedItems.filter(item => item.metadata.world === worldFilter.value);
    const objectives = [...new Set(eligible.map(item => item.metadata.objective).filter(Boolean))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    setOptions(objectiveFilter, objectives, "All Objectives");
    if (activeType === "history") {
      const sessionTypes = [...new Set(resolvedItems.map(item => item.sessionRecord.type))].sort();
      setOptions(sessionTypeFilter, sessionTypes, "All Session Types");
    }
  }

  function evidenceLine(label, value, detail = "") {
    const line = document.createElement("div");
    line.className = "weak-evidence-line";
    const name = document.createElement("span");
    name.textContent = label;
    const result = document.createElement("strong");
    result.textContent = value;
    line.append(name, result);
    if (detail) {
      const explanation = document.createElement("small");
      explanation.textContent = detail;
      line.append(explanation);
    }
    return line;
  }

  function beginSession(items) {
    const unique = [...new Map(items.map(item => [reviewApi.recordKey(item.metadata), item])).values()];
    session = shuffle(unique);
    sessionIndex = 0;
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStartedCount = session.length;
    sessionAnsweredCount = 0;
    sessionCorrectCount = 0;
    sessionRecorded = false;
    hubView.classList.add("hidden");
    sessionView.classList.remove("hidden");
    showSessionQuestion();
  }

  function renderWeakList() {
    visibleItems = resolvedItems.filter(item =>
      (worldFilter.value === "all" || item.metadata.world === worldFilter.value) &&
      (objectiveFilter.value === "all" || item.metadata.objective === objectiveFilter.value)
    );
    collectionList.replaceChildren();
    summary.textContent = `${visibleItems.length} objective${visibleItems.length === 1 ? "" : "s"} displayed`;
    startButton.classList.add("hidden");
    if (!visibleItems.length) {
      const empty = document.createElement("p");
      empty.className = "review-empty";
      empty.textContent = "No objectives match these filters.";
      collectionList.append(empty);
      return;
    }
    visibleItems.forEach(item => {
      const card = document.createElement("article");
      card.className = `weak-objective-card ${item.status.className}`;
      const heading = document.createElement("div");
      heading.className = "weak-objective-heading";
      const title = document.createElement("h2");
      title.textContent = `🎯 Objective ${item.metadata.objective} — ${item.title}`;
      const status = document.createElement("span");
      status.className = `weak-status ${item.status.className}`;
      status.textContent = `${item.status.icon} ${item.status.label}`;
      heading.append(title, status);

      const evidenceGrid = document.createElement("div");
      evidenceGrid.className = "weak-evidence-grid";
      evidenceGrid.append(
        evidenceLine("Accuracy", item.sufficientAccuracy ? `${item.accuracy}%` : "Not enough activity", item.attempts ? `${item.correct} correct out of ${item.attempts} attempts` : "No recorded Objective Sweep attempts"),
        evidenceLine("Active Incorrect", String(item.activeIncorrect)),
        evidenceLine("Total Misses", String(item.totalMisses)),
        evidenceLine("Recovered Questions", String(item.recoveredQuestions)),
        evidenceLine("Recurring Weaknesses", String(item.recurringWeaknesses)),
        evidenceLine("Current Rank", item.rank ? `#${item.rank} Weakest` : "Not ranked")
      );

      const recovery = document.createElement("p");
      recovery.className = "weak-recovery-summary";
      recovery.textContent = `Recovery Progress: ${item.recoveredQuestions} question${item.recoveredQuestions === 1 ? "" : "s"} recovered successfully`;
      const reason = document.createElement("div");
      reason.className = "weak-ranking-reason";
      const reasonTitle = document.createElement("strong");
      reasonTitle.textContent = "Why Hydra ranked it here:";
      const reasonText = document.createElement("p");
      reasonText.textContent = item.reason;
      reason.append(reasonTitle, reasonText);
      const review = document.createElement("button");
      review.type = "button";
      review.className = "link-btn weak-review-button";
      review.textContent = "Review This Objective";
      review.disabled = item.questions.length === 0;
      review.addEventListener("click", () => beginSession(item.questions.map(question => ({
        question,
        metadata: { questionId: String(question.id), world: item.metadata.world, objective: item.metadata.objective, bankPath: item.metadata.bankPath }
      }))));
      card.append(heading, evidenceGrid, recovery, reason, review);
      collectionList.append(card);
    });
  }

  function renderList() {
    if (activeType === "weak") return renderWeakList();
    if (activeType === "adaptive") return renderAdaptiveList();
    if (activeType === "history") return renderHistoryList();
    const details = typeDetails[activeType];
    startButton.classList.remove("hidden");
    visibleItems = resolvedItems.filter(item =>
      (worldFilter.value === "all" || item.metadata.world === worldFilter.value) &&
      (objectiveFilter.value === "all" || item.metadata.objective === objectiveFilter.value)
    );
    collectionList.replaceChildren();
    summary.textContent = `${visibleItems.length} ${details.singular}${visibleItems.length === 1 ? "" : "s"} displayed`;
    startButton.textContent = `Review ${details.title}`;
    startButton.disabled = visibleItems.length === 0;
    if (!visibleItems.length) {
      const empty = document.createElement("p");
      empty.className = "review-empty";
      empty.textContent = resolvedItems.length ? `No ${details.title.toLowerCase()} match these filters.` : details.empty;
      collectionList.append(empty);
      return;
    }
    visibleItems.forEach(item => {
      const card = document.createElement("article");
      card.className = "flagged-question-card";
      const source = document.createElement("p");
      source.className = "review-source";
      source.textContent = `${config.name} • World ${item.metadata.world} • Objective ${item.metadata.objective} • ID ${item.metadata.questionId}`;
      const prompt = document.createElement("p");
      prompt.textContent = item.question.question;
      if (activeType === "all") {
        const reasons = document.createElement("p");
        reasons.className = "review-reasons";
        reasons.textContent = `Included because: ${item.sources.join(" • ")}`;
        card.append(source, prompt, reasons);
      } else {
        card.append(source, prompt);
      }
      if (itemNeedsRecovery(item)) {
        const metadata = recoveryMetadata(item);
        const recovery = document.createElement("p");
        recovery.className = "recovery-progress";
        recovery.textContent = `Recovery Progress: ${Number(metadata.recoveryCorrectCount) || 0} of 2 correct sessions • Misses: ${Number(metadata.missCount) || 1}`;
        card.append(recovery);
      }
      if (details.remove) {
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "flag-remove-btn";
        remove.textContent = details.remove;
        remove.addEventListener("click", async () => {
          if (activeType === "incorrect") reviewApi.manualRemoveIncorrect(config, item.metadata);
          else reviewApi.remove(config, item.metadata, activeType);
          await reloadHub();
        });
        card.append(remove);
      }
      collectionList.append(card);
    });
  }

  function renderAdaptiveList() {
    visibleItems = resolvedItems.filter(item =>
      (worldFilter.value === "all" || item.metadata.world === worldFilter.value) &&
      (objectiveFilter.value === "all" || item.metadata.objective === objectiveFilter.value)
    );
    collectionList.replaceChildren();
    startButton.classList.remove("hidden");
    startButton.textContent = `Start Adaptive Review (${visibleItems.length} Question${visibleItems.length === 1 ? "" : "s"})`;
    startButton.disabled = visibleItems.length === 0;
    summary.textContent = visibleItems.length
      ? `${visibleItems.length}-question study plan generated from your current Objective Sweep evidence`
      : "Adaptive Review needs Objective Sweep activity before it can recommend a session.";
    if (!visibleItems.length) {
      const empty = document.createElement("p");
      empty.className = "review-empty";
      empty.textContent = typeDetails.adaptive.empty;
      collectionList.append(empty);
      return;
    }
    const groups = new Map();
    visibleItems.forEach(item => {
      const key = `${item.metadata.world}:${item.metadata.objective}`;
      if (!groups.has(key)) groups.set(key, { example: item, count: 0 });
      groups.get(key).count += 1;
    });
    groups.forEach(({ example, count }) => {
      const evidence = example.adaptive;
      const card = document.createElement("article");
      card.className = `adaptive-objective-card ${evidence.status.className}`;
      const heading = document.createElement("div");
      heading.className = "weak-objective-heading";
      const title = document.createElement("h2");
      title.textContent = `🧠 Objective ${example.metadata.objective} — ${evidence.objectiveTitle}`;
      const status = document.createElement("span");
      status.className = `weak-status ${evidence.status.className}`;
      status.textContent = `${evidence.status.icon} ${evidence.status.label}`;
      heading.append(title, status);
      const allocation = document.createElement("p");
      allocation.className = "adaptive-allocation";
      allocation.textContent = `${count} question${count === 1 ? "" : "s"} selected for this session`;
      const evidenceText = document.createElement("p");
      evidenceText.className = "review-reasons";
      const accuracy = evidence.attempts ? `${evidence.accuracy}% across ${evidence.attempts} attempts` : "not enough activity";
      evidenceText.textContent = `Accuracy: ${accuracy} • Active Incorrect: ${evidence.activeIncorrect} • Recurring Weaknesses: ${evidence.recurringWeaknesses}`;
      const reason = document.createElement("p");
      reason.className = "adaptive-reason";
      reason.textContent = evidence.reason;
      card.append(heading, allocation, evidenceText, reason);
      collectionList.append(card);
    });
  }

  function sessionTypeLabel(type) {
    return {
      "objective-sweep": "Objective Sweep",
      "mixed-review": "Mixed Review",
      captain: "Captain Challenge",
      "practice-exam": "Practice Exam",
      review: "Review Session"
    }[type] || type;
  }

  function renderHistoryList() {
    historyTypeFilter.classList.remove("hidden");
    startButton.classList.add("hidden");
    visibleItems = resolvedItems.filter(item =>
      (worldFilter.value === "all" || item.metadata.world === worldFilter.value) &&
      (objectiveFilter.value === "all" || item.metadata.objective === objectiveFilter.value) &&
      (sessionTypeFilter.value === "all" || item.sessionRecord.type === sessionTypeFilter.value)
    );
    collectionList.replaceChildren();
    summary.textContent = `${visibleItems.length} completed session${visibleItems.length === 1 ? "" : "s"} displayed`;
    if (!visibleItems.length) {
      const empty = document.createElement("p");
      empty.className = "review-empty";
      empty.textContent = resolvedItems.length ? "No completed sessions match these filters." : typeDetails.history.empty;
      collectionList.append(empty);
      return;
    }
    visibleItems.forEach(item => {
      const record = item.sessionRecord;
      const card = document.createElement("article");
      card.className = "session-history-card";
      const heading = document.createElement("div");
      heading.className = "session-history-heading";
      const title = document.createElement("h2");
      title.textContent = record.label;
      const type = document.createElement("span");
      type.className = "session-type-badge";
      type.textContent = sessionTypeLabel(record.type);
      heading.append(title, type);
      const date = document.createElement("p");
      date.className = "review-source";
      date.textContent = new Date(record.completedAt).toLocaleString();
      const result = document.createElement("p");
      result.className = "session-history-result";
      result.textContent = record.studyOnly
        ? `Study only • ${record.answered} of ${record.total} reviewed • ${record.correct} correct`
        : `${record.correct} / ${record.total} correct (${record.percent}%) • ${record.passed ? "Mastery achieved" : "Keep Training"}`;
      const source = document.createElement("p");
      source.className = "review-reasons";
      const sourceParts = [];
      if (record.world) sourceParts.push(`World ${record.world}`);
      if (record.objective) sourceParts.push(`Objective ${record.objective}`);
      if (record.reviewType) sourceParts.push(typeDetails[record.reviewType]?.title || record.reviewType);
      source.textContent = sourceParts.length ? sourceParts.join(" • ") : config.name;
      card.append(heading, date, result, source);
      if (record.href) {
        const repeat = document.createElement("a");
        repeat.className = "link-btn session-repeat-link";
        repeat.href = record.href;
        repeat.textContent = "Study This Again";
        card.append(repeat);
      }
      collectionList.append(card);
    });
  }

  async function reloadHub() {
    const details = typeDetails[activeType];
    byId("reviewCertification").textContent = `${config.name} • ${details.title}`;
    document.querySelectorAll("[data-review-type]").forEach(button => {
      const selected = button.dataset.reviewType === activeType;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    await resolveItems();
    refreshFilters();
    historyTypeFilter.classList.toggle("hidden", activeType !== "history");
    renderList();
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index--) {
      const random = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[random]] = [copy[random], copy[index]];
    }
    return copy;
  }

  function recordCompletedReviewSession() {
    if (sessionRecorded || sessionAnsweredCount === 0) return;
    sessionRecorded = true;
    const worlds = [...new Set(session.map(item => item.metadata.world).filter(Boolean))];
    const objectives = [...new Set(session.map(item => item.metadata.objective).filter(Boolean))];
    window.HydraCampaignUI?.recordSession({
      type: "review",
      label: activeType === "adaptive" ? "Adaptive Review" : `${typeDetails[activeType].title} Review`,
      correct: sessionCorrectCount,
      total: sessionStartedCount,
      answered: sessionAnsweredCount,
      percent: sessionAnsweredCount ? Math.round((sessionCorrectCount / sessionAnsweredCount) * 100) : 0,
      studyOnly: true,
      world: worlds.length === 1 ? worlds[0] : "",
      objective: objectives.length === 1 ? objectives[0] : "",
      reviewType: activeType,
      href: `review-hub.html?cert=${slug}&view=${activeType}`,
      progressKey: config.progressKey
    });
  }

  function finishSession(message, completed = false) {
    if (completed) recordCompletedReviewSession();
    byId("reviewQuestionCount").textContent = typeDetails[activeType].complete;
    byId("reviewSource").textContent = "";
    byId("reviewQuestion").textContent = message;
    byId("reviewAnswers").replaceChildren();
    byId("reviewRemoveItem").classList.add("hidden");
    byId("reviewSubmit").classList.add("hidden");
    byId("reviewNext").classList.add("hidden");
    byId("reviewFeedback").textContent = "";
    byId("reviewRecoveryStatus").textContent = "";
  }

  function showSessionQuestion() {
    const details = typeDetails[activeType];
    if (!session.length) return finishSession(`No ${details.title.toLowerCase()} remain in this review session.`);
    if (sessionIndex >= session.length) {
      const sessionName = activeType === "adaptive" ? "adaptive review" : `${details.title.toLowerCase()} review`;
      return finishSession(`You reached the end of your ${sessionName}.`, true);
    }
    answered = false;
    const item = session[sessionIndex];
    const question = item.question;
    byId("reviewQuestionCount").textContent = `Question ${sessionIndex + 1} of ${session.length}`;
    const reviewReasons = activeType === "all"
      ? ` • Included because: ${item.sources.join(", ")}`
      : activeType === "adaptive"
        ? ` • Adaptive priority: ${item.adaptive.reason}`
        : "";
    byId("reviewSource").textContent = `${config.name} • World ${item.metadata.world} • Objective ${item.metadata.objective} • ID ${item.metadata.questionId}${reviewReasons}`;
    byId("reviewQuestion").textContent = question.question;
    const itemRecoveryMetadata = recoveryMetadata(item);
    byId("reviewRecoveryStatus").textContent = itemNeedsRecovery(item)
      ? `Recovery Progress: ${Number(itemRecoveryMetadata.recoveryCorrectCount) || 0} of 2 correct sessions`
      : "";
    const answers = byId("reviewAnswers");
    answers.replaceChildren();
    question.choices.forEach((choice, index) => {
      const label = document.createElement("label");
      label.className = "answer-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "reviewAnswer";
      input.value = String(index);
      label.append(input, document.createTextNode(` ${choice}`));
      answers.append(label);
    });
    const remove = byId("reviewRemoveItem");
    remove.textContent = details.sessionRemove;
    remove.classList.remove("hidden", "is-flagged", "is-favorite");
    if (activeType === "weak" || activeType === "adaptive" || activeType === "all") remove.classList.add("hidden");
    if (activeType === "flags") remove.classList.add("is-flagged");
    if (activeType === "favorites") remove.classList.add("is-favorite");
    byId("reviewSubmit").classList.remove("hidden");
    byId("reviewNext").classList.add("hidden");
    byId("reviewFeedback").textContent = "";
    byId("returnToReviewList").textContent = `← Return to ${details.title}`;
  }

  document.querySelectorAll("[data-review-type]").forEach(button => {
    button.addEventListener("click", async () => {
      activeType = button.dataset.reviewType;
      worldFilter.value = "all";
      objectiveFilter.value = "all";
      await reloadHub();
    });
  });

  startButton.addEventListener("click", () => {
    beginSession(visibleItems);
  });

  byId("reviewSubmit").addEventListener("click", () => {
    if (answered || !session[sessionIndex]) return;
    const selected = document.querySelector('input[name="reviewAnswer"]:checked');
    if (!selected) { byId("reviewFeedback").textContent = "Select an answer first."; return; }
    answered = true;
    const question = session[sessionIndex].question;
    const correct = Number(selected.value) === Number(question.answer);
    sessionAnsweredCount += 1;
    sessionCorrectCount += correct ? 1 : 0;
    let recoveryMessage = "";
    const currentItem = session[sessionIndex];
    if (itemNeedsRecovery(currentItem)) {
      const activeRecoveryMetadata = recoveryMetadata(currentItem);
      const result = reviewApi.applyRecoveryAnswer(config, activeRecoveryMetadata, correct, sessionId);
      if (result?.status === "recovered") {
        recoveryMessage = " Recovery complete: 2 of 2 correct sessions. Hydra has moved this question to recovered history.";
        byId("reviewRecoveryStatus").textContent = "Recovery Progress: 2 of 2 — Recovered";
        byId("reviewRemoveItem").classList.add("hidden");
      } else if (result?.status === "progress") {
        recoveryMessage = ` Recovery Progress: ${result.recoveryCorrectCount} of 2 correct sessions.`;
        byId("reviewRecoveryStatus").textContent = `Recovery Progress: ${result.recoveryCorrectCount} of 2 correct sessions`;
        activeRecoveryMetadata.recoveryCorrectCount = result.recoveryCorrectCount;
      } else if (result?.status === "reset") {
        recoveryMessage = " Recovery progress reset to 0 of 2. Hydra requires two successful review sessions without an intervening incorrect answer to confirm long-term retention. Review the explanation and try again during a future review session.";
        byId("reviewRecoveryStatus").textContent = "Recovery Progress: 0 of 2 correct sessions";
        activeRecoveryMetadata.recoveryCorrectCount = 0;
      }
    }
    byId("reviewFeedback").textContent = `${correct ? "✅ Correct." : `❌ Incorrect. Correct answer: ${question.choices[Number(question.answer)]}.`} ${question.explanation}${recoveryMessage}`;
    byId("reviewSubmit").classList.add("hidden");
    byId("reviewNext").classList.remove("hidden");
  });

  byId("reviewNext").addEventListener("click", () => { sessionIndex += 1; showSessionQuestion(); });

  byId("reviewRemoveItem").addEventListener("click", () => {
    const item = session[sessionIndex];
    if (!item) return;
    if (activeType === "incorrect") reviewApi.manualRemoveIncorrect(config, item.metadata);
    else if (activeType === "all") return;
    else reviewApi.remove(config, item.metadata, activeType);
    session.splice(sessionIndex, 1);
    if (!session.length) finishSession(`All ${typeDetails[activeType].title.toLowerCase()} in this review session have been removed.`);
    else {
      if (sessionIndex >= session.length) sessionIndex = 0;
      showSessionQuestion();
    }
  });

  byId("returnToReviewList").addEventListener("click", async () => {
    sessionView.classList.add("hidden");
    hubView.classList.remove("hidden");
    await reloadHub();
  });

  worldFilter.addEventListener("change", () => { refreshFilters(); renderList(); });
  objectiveFilter.addEventListener("change", renderList);
  sessionTypeFilter.addEventListener("change", renderList);
  reloadHub();
}());
