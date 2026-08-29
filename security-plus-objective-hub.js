(function () {
  "use strict";

  const MANUAL_KEY = "hydra-security-plus-field-manual-v1";
  const PROGRESS_KEY = "hydra-security-plus-progress-v1";
  const objectiveStatuses = ["1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3", "2.4", "2.5", "3.1", "3.2", "3.3", "3.4", "4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9", "5.1", "5.2"].map(objective => ({
    objective,
    manualStatus: document.getElementById("objective" + objective.replace(".", "") + "ManualStatus"),
    sweepStatus: document.getElementById("objective" + objective.replace(".", "") + "SweepStatus")
  })).filter(status => status.manualStatus && status.sweepStatus);

  if (!objectiveStatuses.length) return;

  function readState(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch (_) {
      return {};
    }
  }

  function setStatus(element, complete, completeLabel, incompleteLabel) {
    element.textContent = complete ? completeLabel : incompleteLabel;
    element.classList.toggle("security-status-complete", complete);
  }

  function render() {
    const manual = readState(MANUAL_KEY);
    const progress = readState(PROGRESS_KEY);
    objectiveStatuses.forEach(status => {
      setStatus(
        status.manualStatus,
        Boolean(manual.objectives?.[status.objective]?.completed),
        "Completed",
        "Not Completed"
      );
      setStatus(
        status.sweepStatus,
        Boolean(progress.objectives?.[status.objective]?.complete),
        "Mastered",
        "Not Yet Mastered"
      );
    });
  }

  window.addEventListener("storage", render);
  window.addEventListener("hydra-progress-updated", render);
  render();
}());
