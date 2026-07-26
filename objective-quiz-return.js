(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const world = params.get("world") || "";
  const objective = params.get("objective") || "";
  if (!/^[1-5]$/.test(world) || !objective) return;

  const returnLink = document.getElementById("returnLink");
  const answers = document.getElementById("answers");
  const submit = document.getElementById("submitBtn");
  const questionCount = document.getElementById("questionCount");
  if (!returnLink || !answers || !submit || !questionCount) return;

  const page = window.location.pathname.split("/").pop().toLowerCase();
  const prefix = page === "hydra-quiz.html" ? "network" : page.replace("-quiz.html", "");
  returnLink.href = `${prefix}-world${world}-objectives.html`;
  returnLink.textContent = `← Return to World ${world}`;
  returnLink.classList.add("objective-quiz-return");
  returnLink.setAttribute("aria-label", `Return to World ${world} Objective Selection`);

  let started = false;
  const hasCompleted = () => /session complete|final score/i.test(questionCount.textContent || "");
  const synchronizeVisibility = () => {
    if (hasCompleted()) returnLink.classList.add("hidden");
    else returnLink.classList.remove("hidden");
  };

  answers.addEventListener("change", event => {
    if (event.target.matches('input[type="radio"]')) started = true;
  });
  submit.addEventListener("click", () => {
    if (answers.querySelector('input[type="radio"]:checked')) started = true;
  });
  returnLink.addEventListener("click", event => {
    if (started && !window.confirm(`Leave Objective ${objective} and return to World ${world}? Your existing saved progress will remain available.`)) {
      event.preventDefault();
    }
  });

  new MutationObserver(synchronizeVisibility).observe(questionCount, { childList: true, subtree: true, characterData: true });
  synchronizeVisibility();
  window.setTimeout(synchronizeVisibility, 250);
  window.setTimeout(synchronizeVisibility, 1000);
}());
