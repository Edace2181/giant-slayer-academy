const scenes = document.querySelectorAll(".story");
let currentScene = 0;

const music = document.getElementById("introMusic");

document.addEventListener("click", startMusicOnce);
document.addEventListener("keydown", startMusicOnce);

function startMusicOnce() {
  if (music) {
    music.volume = 0.5;
    music.play();
  }

  setTimeout(nextScene, 6000);

  document.removeEventListener("click", startMusicOnce);
  document.removeEventListener("keydown", startMusicOnce);
}

function nextScene() {
  scenes[currentScene].classList.remove("active");
  const nextSceneIndex = currentScene + 1;

  if (nextSceneIndex >= scenes.length) {
    window.location.href = "index.html";
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
          window.location.href = "index.html";
        }, 1000);
      }, 5000);
    }, 1000);
    return;
  }

  currentScene = nextSceneIndex;
  scenes[currentScene].classList.add("active");
  setTimeout(nextScene, 7000); // normal lines
}

// setTimeout(nextScene, 6000);
