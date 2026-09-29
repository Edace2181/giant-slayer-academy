const startScreen = document.getElementById("start-screen");
const mainContent = document.getElementById("main-content");
const enterAcademy = document.getElementById("enterAcademy");
const academyFinaleLink = document.getElementById("academyFinaleLink");

function renderAcademyFinaleAccess({ announce = false } = {}) {
const completion = window.HydraCampaignUI?.syncAcademyCompletion({ announce });
if (!academyFinaleLink || !completion) return;
academyFinaleLink.classList.toggle("hidden", !completion.unlocked);
academyFinaleLink.textContent = completion.unlocked
? "🏆 Hall of Giant Slayers — 7/7"
: "🏆 Hall of Giant Slayers";
}

function startArcade() {
startScreen.style.display = "none";
mainContent.classList.remove("hidden");
renderAcademyFinaleAccess({ announce: true });
}

enterAcademy.addEventListener("click", startArcade);

const entryState = new URLSearchParams(window.location.search);
if (entryState.get("entered") === "1") {
startArcade();
window.history.replaceState({}, "", "index.html");
}

renderAcademyFinaleAccess();
window.addEventListener("hydra-academy-completion-updated", () => renderAcademyFinaleAccess());
