const params = new URLSearchParams(window.location.search);
const world = params.get("world") || "";
const objective = params.get("objective") || "";
const mode = params.get("mode") || "";
const exam = params.get("exam") || "";

const objectiveFiles = [
  "json/linux-essentials/world1/1.1-hatchling.json",
  "json/linux-essentials/world1/1.2-hatchling.json",
  "json/linux-essentials/world1/1.3-hatchling.json",
  "json/linux-essentials/world1/1.4-hatchling.json",
  "json/linux-essentials/world2/2.1-hatchling.json",
  "json/linux-essentials/world2/2.2-hatchling.json",
  "json/linux-essentials/world2/2.3-hatchling.json",
  "json/linux-essentials/world2/2.4-hatchling.json",
  "json/linux-essentials/world3/3.1-hatchling.json",
  "json/linux-essentials/world3/3.2-hatchling.json",
  "json/linux-essentials/world3/3.3-hatchling.json",
  "json/linux-essentials/world4/4.1-hatchling.json",
  "json/linux-essentials/world4/4.2-hatchling.json",
  "json/linux-essentials/world4/4.3-hatchling.json",
  "json/linux-essentials/world4/4.4-hatchling.json",
  "json/linux-essentials/world5/5.1-hatchling.json",
  "json/linux-essentials/world5/5.2-hatchling.json",
  "json/linux-essentials/world5/5.3-hatchling.json",
  "json/linux-essentials/world5/5.4-hatchling.json"
];
const world6Modes = {
  "mixed-25": { name: "Mixed Run 25", count: 25 },
  "mixed-50": { name: "Mixed Run 50", count: 50 },
  "weakness-mix": { name: "Weakness Mix", count: 25 },
  "random-gauntlet": { name: "Random Gauntlet", count: 50 }
};
const captainModes = {
  "boss-rush-1": { name: "Boss Rush I", file: "json/linux-essentials/captains/boss-rush-1.json" },
  "boss-rush-2": { name: "Boss Rush II", file: "json/linux-essentials/captains/boss-rush-2.json" },
  "weakness-captains": { name: "Weakness Captain Rush", file: "json/linux-essentials/captains/weakness-captains.json" },
  "final-captain-rush": { name: "Final Captain Rush", file: "json/linux-essentials/captains/final-captain-rush.json" }
};

const el = id => document.getElementById(id);
const quizInfo = el("quizInfo"), objectiveTitle = el("objectiveTitle"), objectiveName = el("objectiveName");
const questionCount = el("questionCount"), questionEl = el("question"), answersEl = el("answers");
const submitBtn = el("submitBtn"), nextBtn = el("nextBtn"), feedback = el("feedback");
const scoreEl = el("score"), rankEl = el("rank"), modeDisplay = el("modeDisplay"), returnLink = el("returnLink");
let questions = [], current = 0, score = 0, selected = null, finished = false;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
async function fetchBank(file) {
  const response = await fetch(file);
  if (!response.ok) throw new Error(`Unable to load ${file}`);
  const data = await response.json();
  const bank = Array.isArray(data) ? data : data.questions;
  if (!Array.isArray(bank)) throw new Error(`${file} does not contain a question array`);
  return bank;
}
function resultDestination() {
  if (exam) return { href: "linux-essentials-final-gauntlet.html", label: "Return to Linux Essentials Final Boss" };
  if (world === "7") return { href: "linux-essentials-world7.html", label: "Return to World 7" };
  if (world === "6") return { href: "linux-essentials-world6.html", label: "Return to World 6" };
  return { href: `linux-essentials-world${world}-objectives.html`, label: `Return to World ${world}` };
}
function showPlaceholder() {
  questionCount.textContent = "Content Pending";
  questionEl.textContent = "This Linux Essentials question bank is ready for content.";
  answersEl.innerHTML = "";
  feedback.textContent = "Phase 1 skeleton validated. Questions will be added during Objective Sweep production.";
  submitBtn.classList.add("hidden");
  nextBtn.classList.add("hidden");
}
async function loadQuiz() {
  try {
    const activeDestination = resultDestination();
    returnLink.href = activeDestination.href;
    returnLink.textContent = `← ${activeDestination.label}`;
    returnLink.classList.remove("hidden");
    if (exam) {
      questions = await fetchBank(`json/linux-essentials/final-dungeon/practice-exam-${exam}.json`);
      quizInfo.textContent = `🏰 Linux Essentials • Practice Exam ${exam}`;
      objectiveTitle.textContent = `Practice Exam ${exam}`;
      modeDisplay.textContent = "Final Boss";
    } else if (world === "7" && captainModes[mode]) {
      questions = await fetchBank(captainModes[mode].file);
      quizInfo.textContent = `🌋 Linux Essentials World 7 • ${captainModes[mode].name}`;
      objectiveTitle.textContent = captainModes[mode].name;
      modeDisplay.textContent = captainModes[mode].name;
      returnLink.href = "linux-essentials-world7.html";
      returnLink.textContent = "← Return to World 7";
      returnLink.classList.remove("hidden");
    } else if (world === "6" && world6Modes[mode]) {
      const banks = await Promise.all(objectiveFiles.map(fetchBank));
      const unique = [...new Map(banks.flat().map(q => [q.id, q])).values()];
      questions = shuffle(unique).slice(0, world6Modes[mode].count);
      quizInfo.textContent = `❄️ Linux Essentials World 6 • ${world6Modes[mode].name}`;
      objectiveTitle.textContent = world6Modes[mode].name;
      objectiveName.textContent = `${questions.length} mixed Objective Sweep questions`;
      modeDisplay.textContent = world6Modes[mode].name;
    } else if (/^[1-5]$/.test(world) && objective) {
      questions = await fetchBank(`json/linux-essentials/world${world}/${objective}-hatchling.json`);
      quizInfo.textContent = `Linux Essentials World ${world} • Objective ${objective}`;
      objectiveTitle.textContent = `Objective ${objective}`;
      objectiveName.textContent = questions[0]?.blueprint || "";
    } else {
      throw new Error("Unknown or incomplete Linux Essentials quiz mode.");
    }
    if (!questions.length) {
      showPlaceholder();
      return;
    }
    questions = shuffle(questions);
    startQuizOrTimer();
  } catch (error) {
    questionEl.textContent = "Unable to load quiz.";
    feedback.textContent = error.message;
    submitBtn.classList.add("hidden");
  }
}
function showQuestion() {
  const q = questions[current];
  selected = null;
  questionCount.textContent = `Question ${current + 1} of ${questions.length}`;
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";
  q.choices.forEach((choice, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = index;
    input.addEventListener("change", () => selected = index);
    label.append(input, document.createTextNode(" " + choice));
    answersEl.appendChild(label);
  });
  feedback.textContent = "";
  submitBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  window.HydraFlags?.setCurrentQuestion({ question: q, world, objective, bankPath: `json/linux-essentials/world${world}/${objective}-hatchling.json` });
}

function startQuizOrTimer() {
  const timerPrepared = exam && window.HydraExamTimer?.prepare({
    questionCount: questions.length,
    onBegin: showQuestion,
    onExpire: expirePracticeExam
  });
  if (!timerPrepared) showQuestion();
}

function expirePracticeExam() {
  if (finished) return;
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer && !submitBtn.classList.contains("hidden")) submitBtn.click();
  showResults({ timeExpired: true });
}
submitBtn.addEventListener("click", () => {
  if (finished || selected === null) {
    feedback.textContent = "Select an answer first.";
    return;
  }
  const q = questions[current];
  const correct = selected === q.answer;
  if (/^[1-5]$/.test(world) && objective) {
    const reviewMetadata = { questionId: q.id, world, objective, bankPath: `json/linux-essentials/world${world}/${objective}-hatchling.json` };
    window.HydraFlags?.recordObjectiveEvidence(window.HydraFlags.currentConfig(), reviewMetadata, correct);
    if (!correct) window.HydraFlags?.recordIncorrect(window.HydraFlags.currentConfig(), reviewMetadata);
  }
  if (correct) {
    score++;
    feedback.textContent = "Correct. " + q.explanation;
  } else {
    feedback.textContent = `Incorrect. Correct answer: ${q.choices[q.answer]}. ${q.explanation}`;
  }
  scoreEl.textContent = score;
  window.HydraCampaignUI?.recordAnswer({ question: q, correct, world, objective, mode, exam });
  if (/^[1-5]$/.test(world) && objective && window.HydraCampaignUI) {
    window.HydraCampaignUI.saveObjectiveProgress({
      objective,
      world,
      answered: current + 1,
      total: questions.length,
      score,
      complete: false
    });
  }
  submitBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
});
nextBtn.addEventListener("click", () => {
  current++;
  if (current < questions.length) showQuestion();
  else showResults();
});
function showResults(options = {}) {
  if (finished) return;
  finished = true;
  const timingSummary = exam
    ? window.HydraExamTimer?.finish({ reason: options.timeExpired ? "expired" : "manual" })
    : null;
  const percent = Math.round((score / questions.length) * 100);
  const passed = percent >= 85;
  const destination = resultDestination();
  if (/^[1-5]$/.test(world) && objective && window.HydraCampaignUI) {
    window.HydraCampaignUI.saveObjectiveProgress({
      objective,
      world,
      answered: questions.length,
      total: questions.length,
      score,
      complete: passed
    });
  }
  if (world === "7" && captainModes[mode]) {
    window.HydraCampaignUI?.saveQuizResult({ type: "captain", id: mode, percent, passed, label: captainModes[mode].name, href: `linux-essentials-quiz.html?world=7&mode=${mode}` });
  } else if (exam) {
    window.HydraCampaignUI?.saveQuizResult({ type: "exam", id: exam, percent, passed, label: `Practice Exam ${exam}`, href: `linux-essentials-quiz.html?exam=${exam}` });
  }
  window.HydraCampaignUI?.recordSession({
    type: objective && /^[1-5]$/.test(world) ? "objective-sweep" : world === "7" ? "captain" : exam ? "practice-exam" : "mixed-review",
    label: objective && /^[1-5]$/.test(world) ? `Objective ${objective}` : world === "7" && captainModes[mode] ? captainModes[mode].name : exam ? `Practice Exam ${exam}` : mode || `World ${world} Review`,
    correct: score, total: questions.length, answered: questions.length, percent, passed,
    world, objective, mode, exam,
    href: `${window.location.pathname.split("/").pop()}${window.location.search}`
  });
  questionCount.textContent = "Results";
  questionEl.textContent = `Final Score: ${score} / ${questions.length}`;
  answersEl.innerHTML = "";
  feedback.innerHTML = passed
    ? `<h2>🏆 VICTORY!</h2>
       <p>Score: ${score}/${questions.length} (${percent}%)</p>
       <p>Congratulations Commander!</p>
       <p>🐉 Hydra recognizes your victory.</p>
       <a href="${destination.href}" class="next-objective-btn">${destination.label}</a>`
    : `<h2>⚔️ Keep Training</h2>
       <p>Score: ${score}/${questions.length} (${percent}%)</p>
       <p>Hydra has identified weaknesses.</p>
       <p>Review the objective and try again.</p>
       <a href="${destination.href}" class="next-objective-btn">${destination.label}</a>`;
  if (timingSummary) {
    feedback.insertAdjacentHTML("beforeend", window.HydraExamTimer.resultsMarkup(timingSummary));
  }
  rankEl.textContent = passed ? "Hatchling Victor" : "Hatchling";
  submitBtn.classList.add("hidden");
  nextBtn.classList.add("hidden");
  returnLink.classList.add("hidden");
}
loadQuiz();
