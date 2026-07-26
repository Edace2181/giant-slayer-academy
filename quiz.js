// ============================================
// HYDRA QUIZ ENGINE v3.0
// Loads questions from JSON
// ============================================

// This is the first question bank Hydra will load.
const params = new URLSearchParams(window.location.search);

const exam = params.get("exam") || "";
const world = params.get("world") || "1";
const objective = params.get("objective") || "1.1";
const mode = params.get("mode");

const isFinalExam = exam !== "";
const isWorld6Mode = world === "6" && mode !== null;
const isWorld7Mode = world === "7" && mode !== null;
const isWorld1To7 = !isFinalExam && /^[1-7]$/.test(world);
const isObjectiveMode = !isFinalExam && !isWorld6Mode && !isWorld7Mode && /^[1-5]$/.test(world);

function getWorldMenuFile(worldNumber) {
    return Number(worldNumber) <= 5
        ? `network-world${worldNumber}-objectives.html`
        : `network-world${worldNumber}.html`;
}

const world6Modes = {
    "mixed-25": { name: "Mixed Run 25", count: 25 },
    "mixed-50": { name: "Mixed Run 50", count: 50 },
    "weakness-mix": { name: "Weakness Mix", count: 25 },
    "random-gauntlet": { name: "Random Gauntlet", count: 50 }
};

const world7Modes = {
    "boss-rush-1": {
        name: "Boss Rush I",
        file: "json/world7-captains/boss-rush-1.json"
    },
    "boss-rush-2": {
        name: "Boss Rush II",
        file: "json/world7-captains/boss-rush-2.json"
    },
    "weakness-captains": {
        name: "Weakness Captain Rush",
        file: "json/world7-captains/weakness-captains.json"
    },
    "final-captain-rush": {
        name: "Final Captain Rush",
        file: "json/world7-captains/final-captain-rush.json"
    }
};

const worldQuestionFiles = [
    "json/world1/1.1-hatchling.json", "json/world1/1.2-hatchling.json",
    "json/world1/1.3-hatchling.json", "json/world1/1.4-hatchling.json",
    "json/world1/1.5-hatchling.json", "json/world1/1.6-hatchling.json",
    "json/world1/1.7-hatchling.json", "json/world1/1.8-hatchling.json",
    "json/world2/2.1-hatchling.json", "json/world2/2.2-hatchling.json",
    "json/world2/2.3-hatchling.json", "json/world2/2.4-hatchling.json",
    "json/world3/3.1-hatchling.json", "json/world3/3.2-hatchling.json",
    "json/world3/3.3-hatchling.json", "json/world3/3.4-hatchling.json",
    "json/world3/3.5-hatchling.json",
    "json/world4/4.1-hatchling.json", "json/world4/4.2-hatchling.json",
    "json/world4/4.3-hatchling.json",
    "json/world5/5.1-hatchling.json", "json/world5/5.2-hatchling.json",
    "json/world5/5.3-hatchling.json", "json/world5/5.4-hatchling.json",
    "json/world5/5.5-hatchling.json"
];

let questionFile = "";

if (isFinalExam) {
    questionFile = `json/final-dungeon/practice-exam-${exam}.json`;
} else if (isWorld7Mode && world7Modes[mode]) {
    questionFile = world7Modes[mode].file;
} else if (!isWorld6Mode) {
    questionFile = `json/world${world}/${objective}-hatchling.json`;
}




// ============================================
// GAME VARIABLES
// ============================================

let questions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;

// ============================================
// PAGE ELEMENTS
// ============================================

const quizInfo = document.getElementById("quizInfo");
const objectiveTitle = document.getElementById("objectiveTitle");
const objectiveName = document.getElementById("objectiveName");

const questionText = document.getElementById("question");
const answersBox = document.getElementById("answers");

const submitBtn = document.getElementById("submitBtn");
const nextBtn = document.getElementById("nextBtn");

const feedback = document.getElementById("feedback");
const questionCount = document.getElementById("questionCount");

const scoreDisplay = document.getElementById("score");
const rankDisplay = document.getElementById("rank");
const modeDisplay = document.getElementById("modeDisplay");
const returnLink = document.getElementById("returnLink");

    if (isWorld7Mode) {
        returnLink.href = "network-world7.html";
        returnLink.textContent = "← Return to World 7";
        returnLink.classList.remove("hidden");
    } else if (isWorld1To7) {
        returnLink.href = getWorldMenuFile(world);
        returnLink.textContent = `⬅️ Return to World ${world}`;
        returnLink.classList.add("hidden");
    } else if(exam) {
        returnLink.href = "network-final-gauntlet.html";
        returnLink.textContent = "⬅️ Return to Final Boss";
    } else {
    returnLink.href = `network-world${world}-objectives.html`;
    returnLink.textContent ="⬅️ Return to Objective Selection";
}

// ============================================
// LOAD QUESTIONS FROM JSON
// ============================================

async function loadQuestions() {

    try {
        if (isWorld7Mode && !world7Modes[mode]) {
            throw new Error("Unknown World 7 mode.");
        }

        if (isWorld6Mode) {
            const selectedMode = world6Modes[mode];

            if (!selectedMode) {
                throw new Error("Unknown World 6 mode.");
            }

            const responses = await Promise.all(worldQuestionFiles.map(async (file) => {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Unable to load ${file}.`);
                return response.json();
            }));

            const uniqueQuestions = Array.from(
                new Map(
                    responses.flat().map((question) => [
                        question.question.trim().toLowerCase(),
                        question
                    ])
                ).values()
            );

            if (uniqueQuestions.length < selectedMode.count) {
                throw new Error(`Only ${uniqueQuestions.length} unique questions are available.`);
            }

            shuffle(uniqueQuestions);
            questions = uniqueQuestions.slice(0, selectedMode.count);
        } else {
            console.log("Loading:", questionFile);
            const response = await fetch(questionFile);

            if (!response.ok) {
                throw new Error("Unable to load JSON.");
            }

            questions = await response.json();
        }

        // Update page information from JSON
        if (isFinalExam) {
            quizInfo.textContent = `🏰Final Boss 🔴 Practice Exam ${exam}`;
        } else if (isWorld7Mode) {
            quizInfo.textContent = `🌋 World 7 • ${world7Modes[mode].name}`;
        } else if (isWorld6Mode) {
            quizInfo.textContent = `❄️ World 6 • ${world6Modes[mode].name}`;
        } else {    
        quizInfo.textContent =
            `🌿 World ${world} • Objective ${questions[0].objective}`;
        }

        if (objectiveTitle) {
            if (isFinalExam)  {
                objectiveTitle.textContent = `Practice Exam ${exam}`;
            } else if (isWorld7Mode) {
                objectiveTitle.textContent = world7Modes[mode].name;
            } else if (isWorld6Mode) {
                objectiveTitle.textContent = world6Modes[mode].name;
            } else {
            objectiveTitle.textContent =
                `Objective ${questions[0].objective}`;
        }
    }
        if (objectiveName) {
            objectiveName.textContent = isWorld6Mode
                ? `${questions.length} mixed questions from Worlds 1–5`
                : questions[0].blueprint;
            }

        if (isWorld7Mode) {
            rankDisplay.textContent = "Captain";
            modeDisplay.textContent = world7Modes[mode].name;
        }
        
        loadQuestion();

    } catch (error) {

        questionText.textContent =
            "Unable to load question bank.";

        console.error(error);

    }

}

function shuffle(items) {
    for (let index = items.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }
    return items;
}

// ============================================
// LOAD A QUESTION
// ============================================

function loadQuestion() {

    answered = false;

    const q = questions[currentQuestion];

    questionCount.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    questionText.textContent = q.question;

    answersBox.innerHTML = "";

    feedback.textContent = "";

    submitBtn.classList.remove("hidden");
    nextBtn.classList.add("hidden");

    q.choices.forEach((choice, index) => {
        const label = document.createElement("label");
        label.className = "answer-option";

        label.innerHTML = `
            <input type="radio" name="answer" value="${index}">
            <span>${choice}</span>
        `;

        answersBox.appendChild(label);

    });

    if (isObjectiveMode) {
        window.HydraFlags?.setCurrentQuestion({ question: q, world, objective, bankPath: questionFile });
    } else {
        window.HydraFlags?.clearCurrentQuestion();
    }

}

// ============================================
// SUBMIT ANSWER
// ============================================

submitBtn.addEventListener("click", () => {
    const selected =  document.querySelector('input[name="answer"]:checked');

    if (!selected) {
        feedback.textContent ="⚠ Please choose an answer first.";
        return;
    }

    answered = true;

    const userAnswer =  Number(selected.value); // selected radio value = 0,1,2,3
    const correctAnswer = Number(questions[currentQuestion].answer);

    const isCorrect = userAnswer === correctAnswer;
    if (isObjectiveMode) {
        const reviewConfig = window.HydraFlags?.currentConfig();
        const reviewMetadata = {
            questionId: questions[currentQuestion].id,
            world,
            objective,
            bankPath: questionFile
        };
        window.HydraFlags?.recordObjectiveEvidence(reviewConfig, reviewMetadata, isCorrect);
        if (!isCorrect) window.HydraFlags?.recordIncorrect(reviewConfig, reviewMetadata);
    }
    if (isCorrect) {
        score++;

        if (scoreDisplay) {
            scoreDisplay.textContent = score;
        }

            feedback.textContent =
            "✅ Correct! " + questions[currentQuestion].explanation;
    } else {
        feedback.textContent =
            "❌ Incorrect. " + questions[currentQuestion].explanation;

    }

    window.HydraCampaignUI?.recordAnswer({ question: questions[currentQuestion], correct: isCorrect, world, objective, mode, exam });

    if (isObjectiveMode && objective && window.HydraCampaignUI) {
        window.HydraCampaignUI.saveObjectiveProgress({
            objective,
            world,
            answered: currentQuestion + 1,
            total: questions.length,
            score,
            complete: false
        });
    }

    submitBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");

});


// ============================================
// NEXT QUESTION
// ============================================

nextBtn.addEventListener("click", () => {

    currentQuestion++;

    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        showResults();

    }

});

// ============================================
// SHOW RESULTS
// ============================================

function showResults() {

    if (isWorld7Mode || isFinalExam) {
        returnLink.classList.add("hidden");
    }

    questionCount.textContent = "Hydra Session Complete";

    questionText.textContent =
        `Final Score: ${score} / ${questions.length}`;

    answersBox.innerHTML = "";

    feedback.innerHTML = "";

    submitBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");

    let percent = Math.round((score / questions.length) * 100);
    const passed = percent >= 85;

    if (isObjectiveMode && objective && window.HydraCampaignUI) {
        window.HydraCampaignUI.saveObjectiveProgress({
            objective,
            world,
            answered: questions.length,
            total: questions.length,
            score,
            complete: passed
        });
    }

    if (isWorld7Mode && world7Modes[mode]) {
        window.HydraCampaignUI?.saveQuizResult({ type: "captain", id: mode, percent, passed, label: world7Modes[mode].name, href: `hydra-quiz.html?world=7&mode=${mode}` });
    } else if (isFinalExam) {
        window.HydraCampaignUI?.saveQuizResult({ type: "exam", id: exam, percent, passed, label: `Practice Exam ${exam}`, href: `hydra-quiz.html?exam=${exam}` });
    }

    window.HydraCampaignUI?.recordSession({
        type: isObjectiveMode ? "objective-sweep" : isWorld7Mode ? "captain" : isFinalExam ? "practice-exam" : "mixed-review",
        label: isObjectiveMode ? `Objective ${objective}` : isWorld7Mode ? world7Modes[mode].name : isFinalExam ? `Practice Exam ${exam}` : mode || `World ${world} Review`,
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

    if (passed) {

        feedback.innerHTML = `
            <h2>🏆 VICTORY!</h2>
            <p>Score: ${percent}%</p>
            <p>Congratulations Commander!</p>
            <p>${isFinalExam ? `You completed Practice Exam ${exam}.` : isWorld6Mode ? `You completed ${world6Modes[mode].name}.` : isWorld7Mode ? `You completed ${world7Modes[mode].name}.` : `You have mastered Objective ${objective}.`}</p>
            <p>🐉 Hydra recognizes your victory.</p>
        `;

        if (isFinalExam) {
            feedback.innerHTML += `
                <br><br>
                <a href="network-final-gauntlet.html" class="next-objective-btn">
                    🐉 Return to Final Boss
                </a>
            `;
            return;
        }

        if (isWorld1To7) {
            feedback.innerHTML += `
                <br><br>
                <a href="${getWorldMenuFile(world)}" class="next-objective-btn">
                    🏰 Return to World ${world}
                </a>
            `;
            return;
        }

        const objectiveMap = {
            "1": ["1.1","1.2","1.3","1.4","1.5","1.6","1.7","1.8"],
            "2": ["2.1","2.2","2.3","2.4","2.5"],
            "3": ["3.1","3.2","3.3","3.4","3.5"],
            "4": ["4.1","4.2","4.3"],
            "5": ["5.1","5.2","5.3","5.4","5.5"]
        };

        const objectiveList = objectiveMap[world] || [];
        const currentIndex = objectiveList.indexOf(objective);
        const nextObjective = objectiveList[currentIndex + 1];

        if (nextObjective) {
    feedback.innerHTML += `
        <br><br>
        <a href="hydra-quiz.html?world=${world}&objective=${nextObjective}" class="next-objective-btn">
            ⚔ Continue to Objective ${nextObjective}
        </a>
    `;
} else {
    feedback.innerHTML += `
        <br><br>
        <a href="network-world${world}-objectives.html" class="next-objective-btn">
            🏰 Return to World ${world} Objective Selection
        </a>
    `;
}

    } else {

        feedback.innerHTML = `
            <h2>⚔️ Keep Training</h2>
            <p>Score: ${percent}%</p>
            <p>Hydra has identified weaknesses.</p>
            <p>Review the objective and try again.</p>
        `;

        if (isFinalExam) {
            feedback.innerHTML += `
                <br><br>
                <a href="network-final-gauntlet.html" class="next-objective-btn">
                    🐉 Return to Final Boss
                </a>
            `;
        }

        if (isWorld1To7) {
            feedback.innerHTML += `
                <br><br>
                <a href="${getWorldMenuFile(world)}" class="next-objective-btn">
                    🏰 Return to World ${world}
                </a>
            `;
        }
    }

}
// =====================================
// START HYDRA
//======================================

loadQuestions();
