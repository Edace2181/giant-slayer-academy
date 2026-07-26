const startScreen = document.getElementById("start-screen");
const mainContent = document.getElementById("main-content");

function startArcade() {
startScreen.style.display = "none";
mainContent.classList.remove("hidden");
}


document.addEventListener("keydown", function (event) {
if(event.key=="Enter") {
startArcade();
}
});

startScreen.addEventListener("click", startArcade);
