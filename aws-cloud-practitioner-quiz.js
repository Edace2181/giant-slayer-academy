const params = new URLSearchParams(window.location.search);
const world = params.get("world") || "";
const objective = params.get("objective") || "";
const mode = params.get("mode") || "";
const exam = params.get("exam") || "";

const objectiveFiles = [
  "json/aws-cloud-practitioner/world1/1.1-hatchling.json",
  "json/aws-cloud-practitioner/world1/1.2-hatchling.json",
  "json/aws-cloud-practitioner/world1/1.3-hatchling.json",
  "json/aws-cloud-practitioner/world1/1.4-hatchling.json",
  "json/aws-cloud-practitioner/world2/2.1-hatchling.json",
  "json/aws-cloud-practitioner/world2/2.2-hatchling.json",
  "json/aws-cloud-practitioner/world2/2.3-hatchling.json",
  "json/aws-cloud-practitioner/world2/2.4-hatchling.json",
  "json/aws-cloud-practitioner/world3/3.1-hatchling.json",
  "json/aws-cloud-practitioner/world3/3.2-hatchling.json",
  "json/aws-cloud-practitioner/world3/3.3-hatchling.json",
  "json/aws-cloud-practitioner/world3/3.4-hatchling.json",
  "json/aws-cloud-practitioner/world4/3.5-hatchling.json",
  "json/aws-cloud-practitioner/world4/3.6-hatchling.json",
  "json/aws-cloud-practitioner/world4/3.7-hatchling.json",
  "json/aws-cloud-practitioner/world4/3.8-hatchling.json",
  "json/aws-cloud-practitioner/world5/4.1-hatchling.json",
  "json/aws-cloud-practitioner/world5/4.2-hatchling.json",
  "json/aws-cloud-practitioner/world5/4.3-hatchling.json"
];

const world6Modes = {
  "mixed-25": { name: "Mixed Run 25", count: 25 },
  "mixed-50": { name: "Mixed Run 50", count: 50 },
  "weakness-mix": { name: "Weakness Mix", count: 25 },
  "random-gauntlet": { name: "Random Gauntlet", count: 50 }
};

const captainModes = {
  "boss-rush-1": { name: "Boss Rush I", file: "json/aws-cloud-practitioner/captains/boss-rush-1.json" },
  "boss-rush-2": { name: "Boss Rush II", file: "json/aws-cloud-practitioner/captains/boss-rush-2.json" },
  "weakness-captains": { name: "Weakness Captain Rush", file: "json/aws-cloud-practitioner/captains/weakness-captains.json" },
  "final-captain-rush": { name: "Final Captain Rush", file: "json/aws-cloud-practitioner/captains/final-captain-rush.json" }
};

const el = id => document.getElementById(id);
const quizInfo = el("quizInfo");
const objectiveTitle = el("objectiveTitle");
const objectiveName = el("objectiveName");
const questionCount = el("questionCount");
const questionEl = el("question");
const answersEl = el("answers");
const submitBtn = el("submitBtn");
const nextBtn = el("nextBtn");
const feedback = el("feedback");
const scoreEl = el("score");
const rankEl = el("rank");
const modeDisplay = el("modeDisplay");
const returnLink = el("returnLink");
let questions = [];
let current = 0;
let score = 0;
let selected = null;
let finished = false;

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const random = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[random]] = [copy[random], copy[index]];
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
  if (exam) return { href: "aws-cloud-practitioner-final-gauntlet.html", label: "Return to AWS Cloud Practitioner Final Boss" };
  if (world === "7") return { href: "aws-cloud-practitioner-world7.html", label: "Return to World 7" };
  if (world === "6") return { href: "aws-cloud-practitioner-world6.html", label: "Return to World 6" };
  return { href: `aws-cloud-practitioner-world${world}-objectives.html`, label: `Return to World ${world}` };
}

function showPlaceholder() {
  questionCount.textContent = "Content Pending";
  questionEl.textContent = "This AWS Cloud Practitioner question bank is ready for content.";
  answersEl.replaceChildren();
  feedback.textContent = "Phase A skeleton validated. Questions will be added during the appropriate production phase.";
  submitBtn.classList.add("hidden");
  nextBtn.classList.add("hidden");
  window.HydraFlags?.clearCurrentQuestion();
}

async function loadQuiz() {
  try {
    const destination = resultDestination();
    returnLink.href = destination.href;
    returnLink.textContent = `← ${destination.label}`;
    returnLink.classList.remove("hidden");
    if (exam) {
      questions = await fetchBank(`json/aws-cloud-practitioner/final-dungeon/practice-exam-${exam}.json`);
      quizInfo.textContent = `🏰 AWS Cloud Practitioner • Practice Exam ${exam}`;
      objectiveTitle.textContent = `Practice Exam ${exam}`;
      modeDisplay.textContent = "Final Boss";
    } else if (world === "7" && captainModes[mode]) {
      questions = await fetchBank(captainModes[mode].file);
      quizInfo.textContent = `🌋 AWS Cloud Practitioner World 7 • ${captainModes[mode].name}`;
      objectiveTitle.textContent = captainModes[mode].name;
      modeDisplay.textContent = captainModes[mode].name;
    } else if (world === "6" && world6Modes[mode]) {
      const banks = await Promise.all(objectiveFiles.map(fetchBank));
      const unique = [...new Map(banks.flat().map(question => [question.id, question])).values()];
      questions = shuffle(unique).slice(0, world6Modes[mode].count);
      quizInfo.textContent = `❄️ AWS Cloud Practitioner World 6 • ${world6Modes[mode].name}`;
      objectiveTitle.textContent = world6Modes[mode].name;
      objectiveName.textContent = `${questions.length} mixed Objective Sweep questions`;
      modeDisplay.textContent = world6Modes[mode].name;
    } else if (/^[1-5]$/.test(world) && objective) {
      questions = await fetchBank(`json/aws-cloud-practitioner/world${world}/${objective}-hatchling.json`);
      quizInfo.textContent = `AWS Cloud Practitioner World ${world} • Objective ${objective}`;
      objectiveTitle.textContent = `Objective ${objective}`;
      objectiveName.textContent = questions[0]?.blueprint || "";
    } else {
      throw new Error("Unknown or incomplete AWS Cloud Practitioner quiz mode.");
    }
    if (!questions.length) return showPlaceholder();
    questions = shuffle(questions);
    startQuizOrTimer();
  } catch (error) {
    questionEl.textContent = "Unable to load quiz.";
    feedback.textContent = error.message;
    submitBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");
  }
}

function showQuestion() {
  const question = questions[current];
  selected = null;
  questionCount.textContent = `Question ${current + 1} of ${questions.length}`;
  questionEl.textContent = question.question;
  answersEl.replaceChildren();
  question.choices.forEach((choice, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = String(index);
    input.addEventListener("change", () => { selected = index; });
    label.append(input, document.createTextNode(` ${choice}`));
    answersEl.append(label);
  });
  feedback.textContent = "";
  submitBtn.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  window.HydraFlags?.setCurrentQuestion({
    question,
    world,
    objective,
    bankPath: `json/aws-cloud-practitioner/world${world}/${objective}-hatchling.json`
  });
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
  const question = questions[current];
  const correct = selected === Number(question.answer);
  if (/^[1-5]$/.test(world) && objective) {
    const metadata = {
      questionId: question.id,
      world,
      objective,
      bankPath: `json/aws-cloud-practitioner/world${world}/${objective}-hatchling.json`
    };
    const reviewConfig = window.HydraFlags?.currentConfig();
    window.HydraFlags?.recordObjectiveEvidence(reviewConfig, metadata, correct);
    if (!correct) window.HydraFlags?.recordIncorrect(reviewConfig, metadata);
  }
  if (correct) {
    score += 1;
    feedback.textContent = `Correct. ${question.explanation}`;
  } else {
    feedback.textContent = `Incorrect. Correct answer: ${question.choices[Number(question.answer)]}. ${question.explanation}`;
  }
  scoreEl.textContent = String(score);
  window.HydraCampaignUI?.recordAnswer({ question, correct, world, objective, mode, exam });
  if (/^[1-5]$/.test(world) && objective) {
    window.HydraCampaignUI?.saveObjectiveProgress({ objective, world, answered: current + 1, total: questions.length, score, complete: false });
  }
  submitBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");
});

nextBtn.addEventListener("click", () => {
  current += 1;
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
  if (/^[1-5]$/.test(world) && objective) {
    window.HydraCampaignUI?.saveObjectiveProgress({ objective, world, answered: questions.length, total: questions.length, score, complete: passed });
  }
  if (world === "7" && captainModes[mode]) {
    window.HydraCampaignUI?.saveQuizResult({ type: "captain", id: mode, percent, passed, label: captainModes[mode].name, href: `aws-cloud-practitioner-quiz.html?world=7&mode=${mode}` });
  } else if (exam) {
    window.HydraCampaignUI?.saveQuizResult({ type: "exam", id: exam, percent, passed, label: `Practice Exam ${exam}`, href: `aws-cloud-practitioner-quiz.html?exam=${exam}` });
  }
  window.HydraCampaignUI?.recordSession({
    type: objective && /^[1-5]$/.test(world) ? "objective-sweep" : world === "7" ? "captain" : exam ? "practice-exam" : "mixed-review",
    label: objective && /^[1-5]$/.test(world) ? `Objective ${objective}` : world === "7" && captainModes[mode] ? captainModes[mode].name : exam ? `Practice Exam ${exam}` : mode || `World ${world} Review`,
    correct: score,
    total: questions.length,
    answered: questions.length,
    percent,
    passed,
    world,
    objective,
    mode,
    exam,
    href: `${window.location.pathname.split("/").pop()}${window.location.search}`
  });
  questionCount.textContent = "Results";
  questionEl.textContent = `Final Score: ${score} / ${questions.length}`;
  answersEl.replaceChildren();
  feedback.innerHTML = passed
    ? `<h2>🏆 VICTORY!</h2><p>Score: ${score}/${questions.length} (${percent}%)</p><p>Congratulations Commander!</p><p>🐉 Hydra recognizes your victory.</p><a href="${destination.href}" class="next-objective-btn">${destination.label}</a>`
    : `<h2>⚔️ Keep Training</h2><p>Score: ${score}/${questions.length} (${percent}%)</p><p>Hydra has identified weaknesses.</p><p>Review the objective and try again.</p><a href="${destination.href}" class="next-objective-btn">${destination.label}</a>`;
  if (timingSummary) {
    feedback.insertAdjacentHTML("beforeend", window.HydraExamTimer.resultsMarkup(timingSummary));
  }
  rankEl.textContent = passed ? "Hatchling Victor" : "Hatchling";
  submitBtn.classList.add("hidden");
  nextBtn.classList.add("hidden");
  returnLink.classList.add("hidden");
}

loadQuiz();
