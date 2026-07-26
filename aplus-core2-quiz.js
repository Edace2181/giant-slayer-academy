const params = new URLSearchParams(window.location.search);
const world = params.get("world") || "";
const objective = params.get("objective") || "";
const mode = params.get("mode") || "";
const exam = params.get("exam") || "";

const objectiveFiles = [
  "json/aplus-core2/world1/1.1-hatchling.json",
  "json/aplus-core2/world1/1.2-hatchling.json",
  "json/aplus-core2/world1/1.3-hatchling.json",
  "json/aplus-core2/world1/1.4-hatchling.json",
  "json/aplus-core2/world1/1.5-hatchling.json",
  "json/aplus-core2/world1/1.6-hatchling.json",
  "json/aplus-core2/world1/1.7-hatchling.json",
  "json/aplus-core2/world1/1.8-hatchling.json",
  "json/aplus-core2/world1/1.9-hatchling.json",
  "json/aplus-core2/world1/1.10-hatchling.json",
  "json/aplus-core2/world1/1.11-hatchling.json",
  "json/aplus-core2/world2/2.1-hatchling.json",
  "json/aplus-core2/world2/2.2-hatchling.json",
  "json/aplus-core2/world2/2.3-hatchling.json",
  "json/aplus-core2/world2/2.4-hatchling.json",
  "json/aplus-core2/world2/2.5-hatchling.json",
  "json/aplus-core2/world2/2.6-hatchling.json",
  "json/aplus-core2/world2/2.7-hatchling.json",
  "json/aplus-core2/world2/2.8-hatchling.json",
  "json/aplus-core2/world2/2.9-hatchling.json",
  "json/aplus-core2/world2/2.10-hatchling.json",
  "json/aplus-core2/world2/2.11-hatchling.json",
  "json/aplus-core2/world3/3.1-hatchling.json",
  "json/aplus-core2/world3/3.2-hatchling.json",
  "json/aplus-core2/world3/3.3-hatchling.json",
  "json/aplus-core2/world3/3.4-hatchling.json",
  "json/aplus-core2/world4/4.1-hatchling.json",
  "json/aplus-core2/world4/4.2-hatchling.json",
  "json/aplus-core2/world4/4.3-hatchling.json",
  "json/aplus-core2/world4/4.4-hatchling.json",
  "json/aplus-core2/world4/4.5-hatchling.json",
  "json/aplus-core2/world5/4.6-hatchling.json",
  "json/aplus-core2/world5/4.7-hatchling.json",
  "json/aplus-core2/world5/4.8-hatchling.json",
  "json/aplus-core2/world5/4.9-hatchling.json",
  "json/aplus-core2/world5/4.10-hatchling.json"
];
const world6Modes = {
  "mixed-25": { name: "Mixed Run 25", count: 25 },
  "mixed-50": { name: "Mixed Run 50", count: 50 },
  "weakness-mix": { name: "Weakness Mix", count: 25 },
  "random-gauntlet": { name: "Random Gauntlet", count: 50 }
};
const captainModes = {
  "boss-rush-1": { name: "Boss Rush I", file: "json/aplus-core2/captains/boss-rush-1.json" },
  "boss-rush-2": { name: "Boss Rush II", file: "json/aplus-core2/captains/boss-rush-2.json" },
  "weakness-captains": { name: "Weakness Captain Rush", file: "json/aplus-core2/captains/weakness-captains.json" },
  "final-captain-rush": { name: "Final Captain Rush", file: "json/aplus-core2/captains/final-captain-rush.json" }
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
  if (!Array.isArray(data)) throw new Error(`${file} does not contain a question array`);
  return data;
}
function resultDestination() {
  if (exam) return { href: "aplus-core2-final-gauntlet.html", label: "Return to A+ Core 2 Final Boss" };
  if (world === "7") return { href: "aplus-core2-world7.html", label: "Return to World 7" };
  if (world === "6") return { href: "aplus-core2-world6.html", label: "Return to World 6" };
  return { href: `aplus-core2-world${world}-objectives.html`, label: `Return to World ${world}` };
}
async function loadQuiz() {
  try {
    const activeDestination = resultDestination();
    returnLink.href = activeDestination.href;
    returnLink.textContent = `← ${activeDestination.label}`;
    returnLink.classList.remove("hidden");
    if (exam) {
      questions = await fetchBank(`json/aplus-core2/final-dungeon/practice-exam-${exam}.json`);
      quizInfo.textContent = `🏰 A+ Core 2 • Practice Exam ${exam}`;
      objectiveTitle.textContent = `Practice Exam ${exam}`;
      modeDisplay.textContent = "Final Boss";
    } else if (world === "7" && captainModes[mode]) {
      questions = await fetchBank(captainModes[mode].file);
      quizInfo.textContent = `🌋 A+ Core 2 World 7 • ${captainModes[mode].name}`;
      objectiveTitle.textContent = captainModes[mode].name;
      modeDisplay.textContent = captainModes[mode].name;
      returnLink.href = "aplus-core2-world7.html";
      returnLink.textContent = "← Return to World 7";
      returnLink.classList.remove("hidden");
    } else if (world === "6" && world6Modes[mode]) {
      const banks = await Promise.all(objectiveFiles.map(fetchBank));
      const unique = [...new Map(banks.flat().map(q => [q.id, q])).values()];
      questions = shuffle(unique).slice(0, world6Modes[mode].count);
      quizInfo.textContent = `❄️ A+ Core 2 World 6 • ${world6Modes[mode].name}`;
      objectiveTitle.textContent = world6Modes[mode].name;
      objectiveName.textContent = `${questions.length} mixed Objective Sweep questions`;
      modeDisplay.textContent = world6Modes[mode].name;
    } else if (/^[1-5]$/.test(world) && objective) {
      questions = await fetchBank(`json/aplus-core2/world${world}/${objective}-hatchling.json`);
      quizInfo.textContent = `A+ Core 2 World ${world} • Objective ${objective}`;
      objectiveTitle.textContent = `Objective ${objective}`;
      objectiveName.textContent = questions[0]?.blueprint || "";
    } else {
      throw new Error("Unknown or incomplete A+ Core 2 quiz mode.");
    }
    if (!questions.length) throw new Error("This test bank is empty.");
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
  window.HydraFlags?.setCurrentQuestion({ question: q, world, objective, bankPath: `json/aplus-core2/world${world}/${objective}-hatchling.json` });
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
    const reviewMetadata = { questionId: q.id, world, objective, bankPath: `json/aplus-core2/world${world}/${objective}-hatchling.json` };
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
    window.HydraCampaignUI.saveObjectiveProgress({ objective, world, answered: current + 1, total: questions.length, score, complete: false });
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
    window.HydraCampaignUI.saveObjectiveProgress({ objective, world, answered: questions.length, total: questions.length, score, complete: passed });
  }
  if (world === "7" && captainModes[mode]) {
    window.HydraCampaignUI?.saveQuizResult({ type: "captain", id: mode, percent, passed, label: captainModes[mode].name, href: `aplus-core2-quiz.html?world=7&mode=${mode}` });
  } else if (exam) {
    window.HydraCampaignUI?.saveQuizResult({ type: "exam", id: exam, percent, passed, label: `Practice Exam ${exam}`, href: `aplus-core2-quiz.html?exam=${exam}` });
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
