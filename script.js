const startScreen = document.getElementById("start-screen");
const mainContent = document.getElementById("main-content");
const enterAcademy = document.getElementById("enterAcademy");

function startArcade() {
startScreen.style.display = "none";
mainContent.classList.remove("hidden");
}

enterAcademy.addEventListener("click", startArcade);

const entryState = new URLSearchParams(window.location.search);
if (entryState.get("entered") === "1") {
startArcade();
window.history.replaceState({}, "", "index.html");
}
