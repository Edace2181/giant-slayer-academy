#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const TOOL_DIR = __dirname;
const PROJECT_ROOT = path.resolve(TOOL_DIR, "..");
const CONFIG_PATH = path.join(TOOL_DIR, "practice-exam-validator.config.json");
const REQUIRED_FIELDS = ["id", "domain", "objective", "blueprint", "difficulty", "question", "choices", "answer", "explanation"];
const DIFFICULTIES = new Set(["Level 2", "Level 3", "Level 4"]);
const LETTERS = ["A", "B", "C", "D"];

function parseArguments(argv) {
  const options = {
    certification: null,
    exam: null,
    includePlaceholders: false,
    strictWarnings: false,
    summaryOnly: false,
    selfTest: false,
    help: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") options.help = true;
    else if (argument === "--all") options.certification = null;
    else if (argument === "--cert") {
      options.certification = argv[index + 1];
      index += 1;
    } else if (argument === "--exam") {
      options.exam = Number(argv[index + 1]);
      index += 1;
    } else if (argument === "--include-placeholders") options.includePlaceholders = true;
    else if (argument === "--strict-warnings") options.strictWarnings = true;
    else if (argument === "--summary") options.summaryOnly = true;
    else if (argument === "--self-test") options.selfTest = true;
    else throw new Error(`Unknown argument: ${argument}`);
  }
  if (options.exam !== null && (!Number.isInteger(options.exam) || options.exam < 1)) {
    throw new Error("--exam must be a positive integer.");
  }
  if (options.exam !== null && !options.certification) throw new Error("--exam must be used with --cert.");
  return options;
}

function printHelp() {
  console.log(`Giant Slayer Academy Practice Exam Validator

Usage:
  node tools/validate-practice-exams.js --all
  node tools/validate-practice-exams.js --cert aplus-core1
  node tools/validate-practice-exams.js --cert aplus-core1 --exam 1
  node tools/validate-practice-exams.js --self-test

Options:
  --all                    Validate every implemented certification (default)
  --cert <id>              Validate one certification
  --exam <number>          Validate one exam; requires --cert
  --include-placeholders   Include incomplete placeholder certifications in --all
  --strict-warnings        Return a nonzero exit code for warnings
  --summary                Print compact exam results
  --self-test              Prove known defects are detected without editing files
  --help                   Show this help`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function loadConfiguration() {
  const config = readJson(CONFIG_PATH);
  if (config.schemaVersion !== 1 || !config.certifications || !Array.isArray(config.examNumbers)) {
    throw new Error("The practice exam validator configuration is invalid.");
  }
  const timerPath = path.resolve(TOOL_DIR, config.timerConfig);
  const timerSource = fs.readFileSync(timerPath, "utf8");
  const match = timerSource.match(/const\s+CERTIFICATIONS\s*=\s*Object\.freeze\((\{[\s\S]*?\n\s*\})\s*\);/);
  if (!match) throw new Error(`Could not read certification settings from ${timerPath}.`);
  const timerCertifications = vm.runInNewContext(`(${match[1]})`, Object.create(null), { timeout: 1000 });
  for (const [id, certification] of Object.entries(config.certifications)) {
    const timer = timerCertifications[certification.quizPage];
    if (!timer || timer.id !== id || !Number.isInteger(timer.questions)) {
      throw new Error(`Missing or inconsistent timer configuration for ${id}.`);
    }
    certification.expectedQuestions = timer.questions;
    certification.name = timer.name;
  }
  return config;
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'+.-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function isBlank(value) {
  return typeof value !== "string" || value.trim() === "";
}

function countValues(items, selector) {
  const counts = new Map();
  for (const item of items) {
    const value = String(selector(item));
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return counts;
}

function mapToObject(map) {
  return Object.fromEntries([...map.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })));
}

function addFinding(report, status, check, message) {
  report.findings.push({ status, check, message });
  if (status === "FAIL") report.failures += 1;
  if (status === "WARNING") report.warnings += 1;
}

function walkJsonFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkJsonFiles(fullPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) files.push(fullPath);
  }
  return files;
}

function discoverExamNumbers(certification, configuredNumbers) {
  const directory = path.resolve(TOOL_DIR, certification.examDirectory);
  const discovered = fs.existsSync(directory)
    ? fs.readdirSync(directory)
      .map(name => name.match(/^practice-exam-(\d+)\.json$/i))
      .filter(Boolean)
      .map(match => Number(match[1]))
    : [];
  return [...new Set([...configuredNumbers, ...discovered])].sort((left, right) => left - right);
}

function buildObjectiveMap(certification) {
  const map = new Map();
  const sourceFiles = [];
  const parseErrors = [];
  for (const root of certification.objectiveBankRoots || []) {
    const absoluteRoot = path.resolve(TOOL_DIR, root);
    for (const filePath of walkJsonFiles(absoluteRoot)) {
      sourceFiles.push(filePath);
      try {
        const bank = readJson(filePath);
        const questions = Array.isArray(bank) ? bank : Array.isArray(bank?.questions) ? bank.questions : [];
        for (const question of questions) {
          const objective = String(question.objective ?? "").trim();
          const domain = String(question.domain ?? objective.split(".")[0] ?? "").trim();
          if (!objective || !domain) continue;
          if (!map.has(objective)) map.set(objective, new Set());
          map.get(objective).add(domain);
        }
      } catch (error) {
        parseErrors.push(`${filePath}: ${error.message}`);
      }
    }
  }
  return { map, sourceFiles, parseErrors };
}

function longestAnswerStreak(questions) {
  let longest = 0;
  let current = 0;
  let previous = null;
  for (const question of questions) {
    if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
      previous = null;
      current = 0;
      continue;
    }
    if (question.answer === previous) current += 1;
    else {
      previous = question.answer;
      current = 1;
    }
    longest = Math.max(longest, current);
  }
  return longest;
}

function tokenSet(text) {
  return new Set(normalizeText(text).split(" ").filter(token => token.length > 2));
}

function jaccardSimilarity(left, right) {
  const a = tokenSet(left);
  const b = tokenSet(right);
  if (a.size < 8 || b.size < 8) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

function findNearDuplicatePrompts(questions) {
  const warnings = [];
  for (let left = 0; left < questions.length; left += 1) {
    for (let right = left + 1; right < questions.length; right += 1) {
      const leftText = String(questions[left].question || "");
      const rightText = String(questions[right].question || "");
      const leftLength = normalizeText(leftText).length;
      const rightLength = normalizeText(rightText).length;
      const lengthRatio = Math.min(leftLength, rightLength) / Math.max(leftLength || 1, rightLength || 1);
      if (lengthRatio < 0.72) continue;
      const similarity = jaccardSimilarity(leftText, rightText);
      if (similarity >= 0.82) {
        warnings.push({ left: String(questions[left].id), right: String(questions[right].id), similarity });
      }
    }
  }
  return warnings;
}

function describeDistribution(counts, expectedKeys) {
  return expectedKeys.map(key => `${key}: ${counts.get(String(key)) || 0}`).join(", ");
}

function validateExamQuestions(questions, context) {
  const report = {
    certification: context.certificationId,
    certificationName: context.certification.name,
    exam: context.exam,
    filePath: context.filePath,
    questionCount: Array.isArray(questions) ? questions.length : 0,
    findings: [],
    failures: 0,
    warnings: 0,
    data: { ids: new Map(), prompts: new Map() }
  };
  if (!Array.isArray(questions)) {
    addFinding(report, "FAIL", "JSON root", "The JSON root must be an array.");
    report.status = "FAIL";
    return report;
  }

  addFinding(report, questions.length === context.certification.expectedQuestions ? "PASS" : "FAIL", "Question count",
    questions.length === context.certification.expectedQuestions
      ? `${questions.length} questions matches the configured requirement.`
      : `Expected ${context.certification.expectedQuestions}; found ${questions.length}.`);

  const missingFields = [];
  const blankFields = [];
  const invalidChoices = [];
  const blankChoices = [];
  const duplicateChoices = [];
  const invalidAnswers = [];
  const invalidDifficulties = [];
  const shortExplanations = [];
  const namingWarnings = [];
  const unknownDomains = [];
  const unknownObjectives = [];
  const domainMismatches = [];
  const idPattern = context.certification.idPattern
    ? new RegExp(context.certification.idPattern.split("{exam}").join(String(context.exam)))
    : null;

  questions.forEach((question, index) => {
    const location = `question ${index + 1}`;
    if (!question || typeof question !== "object" || Array.isArray(question)) {
      missingFields.push(`${location} is not an object`);
      return;
    }
    for (const field of REQUIRED_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(question, field)) missingFields.push(`${location}: ${field}`);
    }
    for (const field of ["domain", "objective", "blueprint", "difficulty", "question", "explanation"]) {
      if (Object.prototype.hasOwnProperty.call(question, field) && isBlank(question[field])) blankFields.push(`${location}: ${field}`);
    }

    const id = String(question.id ?? "").trim();
    const prompt = normalizeText(question.question);
    if (!id) blankFields.push(`${location}: id`);
    else {
      if (!report.data.ids.has(id)) report.data.ids.set(id, []);
      report.data.ids.get(id).push(index + 1);
      if (idPattern && !idPattern.test(id)) namingWarnings.push(id);
    }
    if (!prompt) blankFields.push(`${location}: question`);
    else {
      if (!report.data.prompts.has(prompt)) report.data.prompts.set(prompt, []);
      report.data.prompts.get(prompt).push({ index: index + 1, id });
    }

    if (!Array.isArray(question.choices) || question.choices.length !== 4) {
      invalidChoices.push(`${id || location}: ${Array.isArray(question.choices) ? question.choices.length : "not an array"}`);
    } else {
      const normalizedChoices = question.choices.map(normalizeText);
      if (normalizedChoices.some(choice => !choice)) blankChoices.push(id || location);
      if (new Set(normalizedChoices).size !== normalizedChoices.length) duplicateChoices.push(id || location);
    }
    if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) invalidAnswers.push(`${id || location}: ${JSON.stringify(question.answer)}`);
    if (!DIFFICULTIES.has(question.difficulty)) invalidDifficulties.push(`${id || location}: ${JSON.stringify(question.difficulty)}`);
    if (typeof question.explanation === "string" && question.explanation.trim().length > 0 && question.explanation.trim().length < 40) shortExplanations.push(id || location);

    const objective = String(question.objective ?? "").trim();
    const domain = String(question.domain ?? "").trim();
    const knownDomains = context.certification.domainTargets
      ? new Set(Object.keys(context.certification.domainTargets))
      : new Set([...context.objectiveMap.values()].flatMap(domains => [...domains]));
    if (domain && knownDomains.size && !knownDomains.has(domain)) unknownDomains.push(`${id || location}: ${domain}`);
    if (objective && !context.objectiveMap.has(objective)) unknownObjectives.push(`${id || location}: ${objective}`);
    else if (objective && domain && !context.objectiveMap.get(objective).has(domain)) {
      domainMismatches.push(`${id || location}: objective ${objective} uses domain ${domain}; expected ${[...context.objectiveMap.get(objective)].join("/")}`);
    }
  });

  const duplicateIds = [...report.data.ids.entries()].filter(([, locations]) => locations.length > 1);
  const duplicatePrompts = [...report.data.prompts.entries()].filter(([, locations]) => locations.length > 1);
  addFinding(report, missingFields.length ? "FAIL" : "PASS", "Required fields", missingFields.length ? `${missingFields.length} missing: ${missingFields.slice(0, 8).join("; ")}` : "All required fields are present.");
  addFinding(report, blankFields.length ? "FAIL" : "PASS", "Nonempty values", blankFields.length ? `${blankFields.length} blank values: ${blankFields.slice(0, 8).join("; ")}` : "Required text and IDs are nonempty.");
  addFinding(report, duplicateIds.length ? "FAIL" : "PASS", "Unique IDs", duplicateIds.length ? `${duplicateIds.length} duplicate ID groups among ${questions.length} questions: ${duplicateIds.slice(0, 8).map(([id]) => id).join(", ")}` : `Total IDs ${questions.length}; unique IDs ${report.data.ids.size}; duplicate groups 0.`);
  addFinding(report, duplicatePrompts.length ? "FAIL" : "PASS", "Exact prompt duplicates", duplicatePrompts.length ? `${duplicatePrompts.length} duplicate prompt groups: ${duplicatePrompts.slice(0, 8).map(([, values]) => values.map(value => value.id).join("/")).join(", ")}` : `Exact normalized duplicate prompts: 0 of ${questions.length}.`);
  addFinding(report, invalidChoices.length ? "FAIL" : "PASS", "Four choices", invalidChoices.length ? `${invalidChoices.length} invalid choice arrays: ${invalidChoices.slice(0, 8).join(", ")}` : "Every question has exactly four choices.");
  addFinding(report, blankChoices.length ? "FAIL" : "PASS", "Nonempty choices", blankChoices.length ? `${blankChoices.length} questions contain blank choices: ${blankChoices.slice(0, 8).join(", ")}` : "All choices are nonempty.");
  addFinding(report, duplicateChoices.length ? "FAIL" : "PASS", "Distinct choices", duplicateChoices.length ? `${duplicateChoices.length} questions repeat a choice: ${duplicateChoices.slice(0, 8).join(", ")}` : "No question repeats a normalized choice.");
  addFinding(report, invalidAnswers.length ? "FAIL" : "PASS", "Answer indices", invalidAnswers.length ? `${invalidAnswers.length} invalid answer indices: ${invalidAnswers.slice(0, 8).join(", ")}` : "All answer indices are zero-based integers from 0 through 3.");
  addFinding(report, invalidDifficulties.length ? "FAIL" : "PASS", "Difficulty metadata", invalidDifficulties.length ? `${invalidDifficulties.length} malformed difficulty values: ${invalidDifficulties.slice(0, 8).join(", ")}` : "All difficulty values use Level 2, Level 3, or Level 4.");
  addFinding(report, namingWarnings.length ? "WARNING" : "PASS", "ID naming", namingWarnings.length ? `${namingWarnings.length} IDs do not match the configured pattern: ${namingWarnings.slice(0, 8).join(", ")}` : idPattern ? "All IDs match the certification/exam naming pattern." : "No ID pattern is configured; uniqueness was still validated.");
  addFinding(report, shortExplanations.length ? "WARNING" : "PASS", "Explanations", shortExplanations.length ? `${shortExplanations.length} explanations are under 40 characters: ${shortExplanations.slice(0, 8).join(", ")}` : "All explanations are present and at least 40 characters.");

  if (context.objectiveMap.size === 0) {
    addFinding(report, "WARNING", "Objective map", "No Objective Sweep mapping data was available for this certification.");
  } else {
    addFinding(report, unknownDomains.length ? "FAIL" : "PASS", "Known domains", unknownDomains.length ? `${unknownDomains.length} unknown domain values: ${unknownDomains.slice(0, 8).join(", ")}` : "Every domain exists in the certification blueprint map.");
    addFinding(report, unknownObjectives.length ? "FAIL" : "PASS", "Known objectives", unknownObjectives.length ? `${unknownObjectives.length} unknown objective mappings: ${unknownObjectives.slice(0, 8).join(", ")}` : "Every objective exists in the certification's Objective Sweep banks.");
    addFinding(report, domainMismatches.length ? "FAIL" : "PASS", "Objective/domain alignment", domainMismatches.length ? `${domainMismatches.length} mismatches: ${domainMismatches.slice(0, 8).join("; ")}` : "Every objective is aligned to its observed Objective Sweep domain.");
    const coveredObjectives = new Set(questions.map(question => String(question.objective ?? "").trim()).filter(Boolean));
    const missingObjectives = [...context.objectiveMap.keys()].filter(objective => !coveredObjectives.has(objective));
    addFinding(report, missingObjectives.length ? "WARNING" : "PASS", "Objective coverage", missingObjectives.length ? `${missingObjectives.length} known objectives are not represented in this exam: ${missingObjectives.join(", ")}` : `All ${context.objectiveMap.size} known objectives are represented.`);
    const objectiveCounts = countValues(questions, question => question.objective);
    addFinding(report, "PASS", "Objective distribution", describeDistribution(objectiveCounts, [...objectiveCounts.keys()].sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))));
  }

  const validAnswers = questions.filter(question => Number.isInteger(question.answer) && question.answer >= 0 && question.answer <= 3);
  const answerCounts = countValues(validAnswers, question => question.answer);
  const answerPercentages = LETTERS.map((letter, index) => ({
    letter,
    count: answerCounts.get(String(index)) || 0,
    percentage: validAnswers.length ? ((answerCounts.get(String(index)) || 0) / validAnswers.length) * 100 : 0
  }));
  const maximumPercentage = Math.max(...answerPercentages.map(item => item.percentage));
  const minimumPercentage = Math.min(...answerPercentages.map(item => item.percentage));
  const longestStreak = longestAnswerStreak(questions);
  const answerSummary = `${answerPercentages.map(item => `${item.letter} ${item.count} (${item.percentage.toFixed(1)}%)`).join(", ")}; longest streak ${longestStreak}`;
  if (answerPercentages.some(item => item.count === 0) || maximumPercentage >= 50 || longestStreak >= 10) addFinding(report, "FAIL", "Answer distribution", `Severe positional bias detected. ${answerSummary}`);
  else if (maximumPercentage >= 35 || maximumPercentage - minimumPercentage > 15 || longestStreak >= 6) addFinding(report, "WARNING", "Answer distribution", `Review positional balance. ${answerSummary}`);
  else addFinding(report, "PASS", "Answer distribution", answerSummary);
  report.answerDistribution = answerPercentages;
  report.longestAnswerStreak = longestStreak;

  const domainCounts = countValues(questions, question => question.domain);
  const difficultyCounts = countValues(questions, question => question.difficulty);
  report.domainDistribution = mapToObject(domainCounts);
  report.difficultyDistribution = mapToObject(difficultyCounts);
  if (context.certification.domainTargets) {
    const mismatches = Object.entries(context.certification.domainTargets).filter(([domain, expected]) => (domainCounts.get(domain) || 0) !== expected).map(([domain, expected]) => `domain ${domain}: expected ${expected}, found ${domainCounts.get(domain) || 0}`);
    addFinding(report, mismatches.length ? "FAIL" : "PASS", "Domain distribution", mismatches.length ? mismatches.join("; ") : describeDistribution(domainCounts, Object.keys(context.certification.domainTargets)));
  } else addFinding(report, "WARNING", "Domain distribution", `No approved target is configured. Observed ${JSON.stringify(report.domainDistribution)}.`);

  if (context.certification.difficultyTargets) {
    const mismatches = Object.entries(context.certification.difficultyTargets).filter(([difficulty, expected]) => (difficultyCounts.get(difficulty) || 0) !== expected).map(([difficulty, expected]) => `${difficulty}: expected ${expected}, found ${difficultyCounts.get(difficulty) || 0}`);
    addFinding(report, mismatches.length ? "FAIL" : "PASS", "Difficulty distribution", mismatches.length ? mismatches.join("; ") : describeDistribution(difficultyCounts, Object.keys(context.certification.difficultyTargets)));
  } else addFinding(report, "WARNING", "Difficulty distribution", `No approved target is configured. Observed ${JSON.stringify(report.difficultyDistribution)}.`);

  const nearDuplicates = findNearDuplicatePrompts(questions);
  report.nearDuplicates = nearDuplicates;
  addFinding(report, nearDuplicates.length ? "WARNING" : "PASS", "Near-duplicate prompts", nearDuplicates.length ? `${nearDuplicates.length} deterministic similarity candidates: ${nearDuplicates.slice(0, 8).map(pair => `${pair.left}/${pair.right} ${(pair.similarity * 100).toFixed(1)}%`).join(", ")}` : "No prompt pairs crossed the deterministic 82% token-similarity threshold.");
  report.status = report.failures ? "FAIL" : report.warnings ? "WARNING" : "PASS";
  return report;
}

function validateExamFile(context) {
  try {
    const questions = readJson(context.filePath);
    const report = validateExamQuestions(questions, context);
    report.findings.unshift({ status: "PASS", check: "JSON parsing", message: "JSON parsed successfully." });
    return report;
  } catch (error) {
    return {
      certification: context.certificationId,
      certificationName: context.certification.name,
      exam: context.exam,
      filePath: context.filePath,
      questionCount: 0,
      findings: [{ status: "FAIL", check: "JSON parsing", message: error.message }],
      failures: 1,
      warnings: 0,
      status: "FAIL",
      data: { ids: new Map(), prompts: new Map() }
    };
  }
}

function validateCrossExam(certificationId, reports) {
  const idLocations = new Map();
  const promptLocations = new Map();
  for (const report of reports) {
    for (const id of report.data.ids.keys()) {
      if (!idLocations.has(id)) idLocations.set(id, []);
      idLocations.get(id).push(report.exam);
    }
    for (const prompt of report.data.prompts.keys()) {
      if (!promptLocations.has(prompt)) promptLocations.set(prompt, []);
      promptLocations.get(prompt).push(report.exam);
    }
  }
  const duplicateIds = [...idLocations.entries()].filter(([, exams]) => new Set(exams).size > 1);
  const duplicatePrompts = [...promptLocations.entries()].filter(([, exams]) => new Set(exams).size > 1);
  const findings = [
    { status: duplicateIds.length ? "FAIL" : "PASS", check: "Cross-exam IDs", message: duplicateIds.length ? `${duplicateIds.length} IDs occur across exams: ${duplicateIds.slice(0, 10).map(([id, exams]) => `${id} (Exams ${[...new Set(exams)].join("/")})`).join(", ")}` : "No exact ID is reused across this certification's selected exams." },
    { status: duplicatePrompts.length ? "FAIL" : "PASS", check: "Cross-exam prompts", message: duplicatePrompts.length ? `${duplicatePrompts.length} normalized prompts occur across exams: ${duplicatePrompts.slice(0, 10).map(([, exams]) => `Exams ${[...new Set(exams)].join("/")}`).join(", ")}` : "No normalized exact prompt is reused across this certification's selected exams." }
  ];
  return { certification: certificationId, findings, failures: findings.filter(finding => finding.status === "FAIL").length, warnings: 0 };
}

function printExamReport(report, summaryOnly) {
  console.log(`\n${report.status.padEnd(7)} ${report.certificationName} — Practice Exam ${report.exam}`);
  console.log(`        ${path.relative(PROJECT_ROOT, report.filePath)} | ${report.questionCount} questions`);
  if (!summaryOnly) for (const finding of report.findings) console.log(`  [${finding.status.padEnd(7)}] ${finding.check}: ${finding.message}`);
}

function printCrossExamReport(report, summaryOnly) {
  console.log(`\nCross-exam audit — ${report.certification}`);
  for (const finding of report.findings) if (!summaryOnly || finding.status !== "PASS") console.log(`  [${finding.status.padEnd(7)}] ${finding.check}: ${finding.message}`);
}

function makeSelfTestQuestion(id, prompt, answer = 0) {
  return {
    id,
    domain: "1",
    objective: "1.1",
    blueprint: "Validator self-test",
    difficulty: "Level 3",
    question: prompt,
    choices: ["Choice A", "Choice B", "Choice C", "Choice D"],
    answer,
    explanation: "This explanation is intentionally long enough to satisfy the validator's explanation-length check."
  };
}

function runSelfTest() {
  const objectiveMap = new Map([["1.1", new Set(["1"])]]);
  const certification = { name: "Validator Self-Test", expectedQuestions: 12, idPattern: "^TEST-{exam}-\\d{3}$", domainTargets: { "1": 12 }, difficultyTargets: { "Level 3": 12 } };
  const biased = Array.from({ length: 12 }, (_, index) => makeSelfTestQuestion(`TEST-1-${String(index + 1).padStart(3, "0")}`, `A technician evaluates controlled validation scenario number ${index + 1}. Which approved response should be selected for this unique test condition?`, 0));
  const biasedReport = validateExamQuestions(biased, { certification, certificationId: "self-test", exam: 1, filePath: "<memory:all-a>", objectiveMap });
  const biasDetected = biasedReport.findings.some(finding => finding.check === "Answer distribution" && finding.status === "FAIL");

  const malformed = biased.map(question => ({ ...question, choices: [...question.choices] }));
  malformed[1].id = malformed[0].id;
  malformed[2].question = malformed[0].question;
  malformed[3].answer = 4;
  malformed[4].choices[3] = malformed[4].choices[0];
  delete malformed[5].explanation;
  malformed[6].id = "";
  malformed[7].id = "INVALID-NAME";
  const malformedReport = validateExamQuestions(malformed, { certification, certificationId: "self-test", exam: 1, filePath: "<memory:malformed>", objectiveMap });
  const requiredFailures = ["Unique IDs", "Exact prompt duplicates", "Answer indices", "Distinct choices", "Required fields", "Nonempty values"];
  const caught = requiredFailures.filter(check => malformedReport.findings.some(finding => finding.check === check && finding.status === "FAIL"));
  const namingDetected = malformedReport.findings.some(finding => finding.check === "ID naming" && finding.status === "WARNING");

  console.log("Giant Slayer Academy Practice Exam Validator — self-test");
  console.log(`  [${biasDetected ? "PASS" : "FAIL"}] All-A positional bias is detected.`);
  console.log(`  [${caught.length === requiredFailures.length && namingDetected ? "PASS" : "FAIL"}] Structural defects detected: ${caught.join(", ")}, ID naming`);
  console.log("  [PASS] Self-test used in-memory fixtures only; no project file was written.");
  return biasDetected && caught.length === requiredFailures.length && namingDetected ? 0 : 1;
}

function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    console.error(`Argument error: ${error.message}`);
    printHelp();
    return 2;
  }
  if (options.help) {
    printHelp();
    return 0;
  }
  if (options.selfTest) return runSelfTest();

  let config;
  try {
    config = loadConfiguration();
  } catch (error) {
    console.error(`Configuration error: ${error.message}`);
    return 2;
  }
  if (options.certification && !config.certifications[options.certification]) {
    console.error(`Unknown certification: ${options.certification}`);
    console.error(`Available certifications: ${Object.keys(config.certifications).join(", ")}`);
    return 2;
  }

  const certificationIds = options.certification ? [options.certification] : Object.keys(config.certifications).filter(id => config.certifications[id].active || options.includePlaceholders);
  const skipped = options.certification ? [] : Object.keys(config.certifications).filter(id => !config.certifications[id].active && !options.includePlaceholders);
  console.log("Giant Slayer Academy Practice Exam Validation System v1.0");
  console.log(`Mode: ${options.certification || "all implemented certifications"}${options.exam ? `, Practice Exam ${options.exam}` : ""}`);
  console.log("Expected question counts are loaded from practice-exam-timer.js.");
  if (skipped.length) console.log(`Inactive placeholders skipped: ${skipped.join(", ")} (use --include-placeholders or --cert to inspect them)`);

  const reports = [];
  const crossReports = [];
  let configurationFailures = 0;
  for (const certificationId of certificationIds) {
    const certification = config.certifications[certificationId];
    const objectiveData = buildObjectiveMap(certification);
    if (objectiveData.parseErrors.length) {
      configurationFailures += objectiveData.parseErrors.length;
      for (const error of objectiveData.parseErrors) console.error(`[FAIL] Objective bank parse error: ${error}`);
    }
    const certificationReports = [];
    for (const exam of options.exam ? [options.exam] : discoverExamNumbers(certification, config.examNumbers)) {
      const filePath = path.resolve(TOOL_DIR, certification.examDirectory, `practice-exam-${exam}.json`);
      const report = validateExamFile({ certification, certificationId, exam, filePath, objectiveMap: objectiveData.map });
      reports.push(report);
      certificationReports.push(report);
      printExamReport(report, options.summaryOnly);
    }
    if (certificationReports.length > 1) {
      const crossReport = validateCrossExam(certificationId, certificationReports);
      crossReports.push(crossReport);
      printCrossExamReport(crossReport, options.summaryOnly);
    }
  }

  const failures = configurationFailures + reports.reduce((sum, report) => sum + report.failures, 0) + crossReports.reduce((sum, report) => sum + report.failures, 0);
  const warnings = reports.reduce((sum, report) => sum + report.warnings, 0) + crossReports.reduce((sum, report) => sum + report.warnings, 0);
  const passedExams = reports.filter(report => report.status === "PASS").length;
  const warningExams = reports.filter(report => report.status === "WARNING").length;
  const failedExams = reports.filter(report => report.status === "FAIL").length;
  console.log("\n============================================================");
  console.log("VALIDATION SUMMARY");
  console.log(`Exams inspected: ${reports.length}`);
  console.log(`Exam status: ${passedExams} PASS, ${warningExams} WARNING, ${failedExams} FAIL`);
  console.log(`Findings: ${failures} failures, ${warnings} warnings`);
  console.log(`Exit policy: failures${options.strictWarnings ? " or warnings" : " only"} produce a nonzero exit code.`);
  console.log(failures ? "FINAL STATUS: FAIL" : warnings ? "FINAL STATUS: PASS WITH WARNINGS" : "FINAL STATUS: PASS");
  console.log("============================================================");
  return failures || (options.strictWarnings && warnings) ? 1 : 0;
}

process.exitCode = main();
