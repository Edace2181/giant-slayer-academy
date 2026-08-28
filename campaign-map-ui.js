(function () {
  "use strict";

  const body = document.body;
  if (!body.matches("[data-campaign-journey]")) return;

  const title = document.querySelector("body > .arcade-title");
  const tagline = document.querySelector("body > .tagline");
  const map = document.querySelector("body > .campaign-map");
  const footer = document.querySelector("body > footer");
  if (!title || !tagline || !map || !footer) return;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const worldQuestions = (body.dataset.worldQuestions || "").split(",");
  const originalWorlds = Array.from(map.querySelectorAll("a.world:not(.final-dungeon)"));
  const finalLink = map.querySelector("a.final-dungeon");

  function findWorld(number) {
    return originalWorlds.find(link => link.classList.contains(`world${number}`)) ||
      originalWorlds.find(link => new RegExp(`world${number}\\.html(?:$|\\?)`).test(link.getAttribute("href") || ""));
  }

  function worldDetails(link, number) {
    const raw = link.textContent.replace(/\s+/g, " ").trim();
    const iconMatch = raw.match(/^(\p{Extended_Pictographic}(?:\uFE0F)?)/u);
    const icon = iconMatch ? iconMatch[1] : "✦";
    const withoutIcon = iconMatch ? raw.slice(iconMatch[0].length).trim() : raw;
    return {
      icon,
      name: withoutIcon.replace(new RegExp(`^(?:World|Chapter)\\s+${number}\\s*`, "i"), "").trim()
    };
  }

  function createWorldStage(number) {
    const source = findWorld(number);
    if (!source) return null;
    const details = worldDetails(source, number);
    const stage = element("div", `campaign-stage ${number % 2 ? "stage-left" : "stage-right"}${number > 5 ? " campaign-trial" : ""}`);
    stage.append(element("span", "stage-marker", String(number).padStart(2, "0")));

    const link = element("a", `world world${number} unlocked`);
    link.href = source.getAttribute("href");
    link.append(
      element("span", "world-icon", details.icon),
      element("span", "world-label", `Chapter ${number}`),
      element("strong", "", details.name)
    );

    if (number <= 5) {
      const progress = element("span", "world-card-progress");
      progress.dataset.worldProgress = String(number);
      progress.dataset.questions = worldQuestions[number - 1] || "0";
      link.append(progress);
    } else {
      const trialLabels = { 6: "REINFORCEMENT TRIAL", 7: "CAPTAIN TRIALS", 8: "FINAL PREPARATION" };
      link.append(element("span", "stage-type", trialLabels[number]));
    }
    stage.append(link);
    return stage;
  }

  const shell = element("main", "linux-campaign-shell");
  const hero = element("header", "linux-campaign-hero");
  hero.append(
    element("span", "campaign-kicker", `${body.dataset.examCode} · ${body.dataset.questName}`),
    title.cloneNode(true),
    tagline.cloneNode(true)
  );

  const command = element("section", "campaign-command-panel");
  command.setAttribute("aria-label", `${body.dataset.certification} campaign status`);
  const commandCopy = element("div", "campaign-command-copy");
  commandCopy.append(
    element("span", "campaign-panel-label", "COMMANDER PROGRESS"),
    element("h2", "", `Your ${body.dataset.journeyName} Journey`),
    element("p", "", "Five campaign chapters lead to mixed review, Captain Challenges, and the Exam Chamber.")
  );
  const overall = element("section", "campaign-overall-slot");
  overall.dataset.overallProgress = "";
  overall.dataset.questions = body.dataset.questions;
  overall.setAttribute("aria-label", `${body.dataset.certification} Objective Sweep progress`);
  const stats = element("section", "campaign-stats-slot");
  stats.dataset.campaignStats = "";
  stats.dataset.topics = body.dataset.topics;
  stats.dataset.objectives = body.dataset.objectives;
  stats.dataset.banks = body.dataset.banks;
  stats.dataset.questions = body.dataset.questions;
  stats.setAttribute("aria-label", `${body.dataset.certification} campaign statistics`);
  command.append(commandCopy, overall, stats);

  const quest = element("section", "linux-quest");
  quest.setAttribute("aria-labelledby", "quest-heading");
  const questHeading = element("div", "quest-heading");
  questHeading.append(
    element("span", "", "START YOUR ASCENT"),
    element("h2", "", "The Path to the Final Dungeon")
  );
  questHeading.lastElementChild.id = "quest-heading";
  const path = element("div", "campaign-map linux-campaign-path");
  for (let number = 1; number <= 8; number += 1) {
    const stage = createWorldStage(number);
    if (stage) path.append(stage);
  }

  if (finalLink) {
    const finalStage = element("div", "campaign-stage final-stage");
    finalStage.append(element("span", "final-stage-crown", "✦"));
    const destination = element("a", "world final-dungeon unlocked");
    destination.href = finalLink.getAttribute("href");
    destination.append(
      element("span", "world-icon", "🏰"),
      element("span", "world-label", "ULTIMATE DESTINATION"),
      element("strong", "", "FINAL DUNGEON"),
      element("span", "stage-type", "SIX PRACTICE EXAMS AWAIT")
    );
    finalStage.append(destination);
    path.append(finalStage);
  }

  quest.append(questHeading, path);
  const newFooter = footer.cloneNode(true);
  newFooter.classList.add("arcade-footer");
  shell.append(hero, command, quest, newFooter);

  title.remove();
  tagline.remove();
  map.remove();
  footer.remove();
  body.insertBefore(shell, document.querySelector("body > script"));
}());
