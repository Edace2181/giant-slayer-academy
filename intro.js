const scenes = document.querySelectorAll(".story");
let currentScene = 0;
let sequenceStarted = false;

const music = document.getElementById("introMusic");
const soundButton = document.getElementById("enableIntroSound");

function startSequence() {
  if (sequenceStarted) return;
  sequenceStarted = true;
  setTimeout(nextScene, 6000);
}

async function startMusic() {
  if (!music) return;
  music.volume = 0.5;
  try {
    await music.play();
    soundButton.classList.add("hidden");
  } catch {
    soundButton.classList.remove("hidden");
  }
}

soundButton.addEventListener("click", startMusic);
document.addEventListener("keydown", startMusic, { once: true });

startSequence();
startMusic();

function nextScene() {
  scenes[currentScene].classList.remove("active");
  const nextSceneIndex = currentScene + 1;

  if (nextSceneIndex >= scenes.length) {
    window.location.href = "index.html?entered=1";
    return;
  }

  if (scenes[nextSceneIndex].classList.contains("final-line")) {
    // Let the objectives line finish its existing one-second fade first.
    setTimeout(() => {
      currentScene = nextSceneIndex;
      scenes[currentScene].classList.add("active");

      // One-second fade-in, four seconds fully visible, then fade out.
      setTimeout(() => {
        scenes[currentScene].classList.remove("active");
        setTimeout(() => {
          window.location.href = "index.html?entered=1";
        }, 1000);
      }, 5000);
    }, 1000);
    return;
  }

  currentScene = nextSceneIndex;
  scenes[currentScene].classList.add("active");
  setTimeout(nextScene, 7000); // normal lines
}
