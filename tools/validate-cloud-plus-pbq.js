const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const bankPath = path.join(root, "json", "cloud-plus", "pbq", "production.json");
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const failures = [];

function requireValue(condition, message) {
  if (!condition) failures.push(message);
}

const expectedMissions = [
  ["cloud-plus-pbq-001", "configuration-table", 8, ["1.1"]],
  ["cloud-plus-pbq-002", "configuration-table", 12, ["2.2", "2.4", "2.5"]],
  ["cloud-plus-pbq-003", "configuration-table", 9, ["3.1", "3.2"]],
  ["cloud-plus-pbq-004", "configuration-table", 9, ["3.3", "3.4"]],
  ["cloud-plus-pbq-005", "configuration-table", 9, ["4.3", "4.4"]],
  ["cloud-plus-pbq-006", "configuration-table", 8, ["4.5", "4.6"]],
  ["cloud-plus-pbq-007", "matching", 9, ["6.1", "6.2", "6.3"]]
];

const applicationCoverage = {
  "1.1": 8,
  "2.2": 4,
  "2.4": 4,
  "2.5": 4,
  "3.1": 6,
  "3.2": 3,
  "3.3": 6,
  "3.4": 3,
  "4.3": 6,
  "4.4": 3,
  "4.5": 4,
  "4.6": 4,
  "6.1": 3,
  "6.2": 3,
  "6.3": 3
};

requireValue(bank.schemaVersion === 1, "PBQ bank must use schema version 1.");
requireValue(bank.certification === "cloud-plus", "PBQ bank certification must be cloud-plus.");
requireValue(Array.isArray(bank.missions), "PBQ bank must contain a missions array.");
requireValue(bank.missions.length === expectedMissions.length, "PBQ bank must contain exactly seven missions.");

const ids = new Set();
let totalPoints = 0;
bank.missions.forEach((mission, index) => {
  const expected = expectedMissions[index];
  requireValue(mission.id === expected[0], `Mission ${index + 1} must use ID ${expected[0]}.`);
  requireValue(mission.type === expected[1], `${mission.id} must use renderer ${expected[1]}.`);
  requireValue(mission.scoring?.maxPoints === expected[2], `${mission.id} must define ${expected[2]} points.`);
  requireValue(JSON.stringify(mission.objectiveIds) === JSON.stringify(expected[3]), `${mission.id} objective mapping must be ${expected[3].join(", ")}.`);
  requireValue(JSON.stringify(Object.keys(mission.objectivePointAllocation || {})) === JSON.stringify(expected[3]), `${mission.id} point allocation must map the same objectives.`);
  requireValue(Object.values(mission.objectivePointAllocation || {}).reduce((sum, points) => sum + points, 0) === expected[2], `${mission.id} objective point allocation must total ${expected[2]}.`);
  requireValue(mission.certification === "cloud-plus", `${mission.id} certification mismatch.`);
  requireValue(!ids.has(mission.id), `Duplicate mission ID ${mission.id}.`);
  ids.add(mission.id);
  requireValue(typeof mission.title === "string" && mission.title.length > 0, `${mission.id} is missing a title.`);
  requireValue(typeof mission.objective === "string" && mission.objective.length > 0, `${mission.id} is missing objective metadata.`);
  requireValue(typeof mission.briefing === "string" && mission.briefing.length > 0, `${mission.id} is missing a briefing.`);
  requireValue(Array.isArray(mission.instructions) && mission.instructions.length > 0, `${mission.id} is missing instructions.`);
  requireValue(Array.isArray(mission.tasks) && mission.tasks.length > 0, `${mission.id} is missing tasks.`);
  requireValue(mission.scoring?.partialCredit === true, `${mission.id} must enable partial credit.`);

  const taskIds = new Set();
  mission.tasks.forEach(task => {
    requireValue(Boolean(task.id && task.prompt), `${mission.id} contains an invalid task.`);
    requireValue(!taskIds.has(task.id), `${mission.id} contains duplicate task ID ${task.id}.`);
    taskIds.add(task.id);
    requireValue(Object.prototype.hasOwnProperty.call(mission.solution, task.id), `${mission.id} has no solution for ${task.id}.`);
    requireValue(typeof mission.explanations?.[task.id] === "string" && mission.explanations[task.id].length > 0, `${mission.id} has no explanation for ${task.id}.`);
  });

  if (mission.type === "configuration-table") {
    const fields = mission.scoring.fields || [];
    requireValue(mission.scoring.method === "per-field", `${mission.id} must use per-field scoring.`);
    requireValue(mission.scoring.maxPoints === mission.tasks.length * fields.length, `${mission.id} maxPoints must equal task count times field count.`);
    fields.forEach(field => {
      requireValue(Array.isArray(mission.options[field]) && mission.options[field].length > 0, `${mission.id} is missing options for ${field}.`);
      mission.tasks.forEach(task => {
        const value = mission.solution[task.id]?.[field];
        requireValue(mission.options[field].includes(value), `${mission.id}/${task.id}/${field} solution is not an available option.`);
      });
    });
  } else {
    requireValue(mission.scoring.method === "per-task", `${mission.id} must use per-task scoring.`);
    requireValue(mission.scoring.maxPoints === mission.tasks.length, `${mission.id} maxPoints must equal task count.`);
    requireValue(Array.isArray(mission.options) && mission.options.length > 0, `${mission.id} must contain matching options.`);
    const optionIds = new Set(mission.options.map(option => option.id));
    requireValue(optionIds.size === mission.options.length, `${mission.id} contains duplicate option IDs.`);
    mission.tasks.forEach(task => requireValue(optionIds.has(mission.solution[task.id]), `${mission.id}/${task.id} solution is not an available option.`));
  }
  totalPoints += mission.scoring.maxPoints;
});

requireValue(totalPoints === 64, `PBQ bank must contain exactly 64 independently scored points, found ${totalPoints}.`);
requireValue(Object.keys(applicationCoverage).length === 15, "Application coverage map must contain 15 objectives.");
requireValue(Object.values(applicationCoverage).reduce((sum, value) => sum + value, 0) === 64, "Application coverage point allocation must total 64.");
const implementedCoverage = Object.assign({}, ...bank.missions.map(mission => mission.objectivePointAllocation));
requireValue(JSON.stringify(implementedCoverage) === JSON.stringify(applicationCoverage), "Production mission objective allocation does not match the approved 15-objective, 64-point blueprint.");

const engine = fs.readFileSync(path.join(root, "pbq-engine.js"), "utf8");
const dungeon = fs.readFileSync(path.join(root, "cloud-plus-final-dungeon.html"), "utf8");
requireValue(engine.includes('"cloud-plus": {'), "Shared PBQ engine does not register Cloud+.");
requireValue(engine.includes('bank: "json/cloud-plus/pbq/production.json"'), "Shared PBQ engine does not load the Cloud+ production bank.");
requireValue(dungeon.includes('pbq-arena.html?certification=cloud-plus'), "Cloud+ Final Dungeon does not link to the PBQ Arena.");
requireValue(!dungeon.includes("PBQ Arena — Coming Soon"), "Cloud+ Final Dungeon still exposes the retired PBQ placeholder.");

const protectedObjectives = [
  "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "1.10", "1.11",
  "2.1", "2.2", "2.3", "2.4", "2.5", "3.1", "3.2", "3.3", "3.4",
  "4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "5.1", "5.2", "5.3", "5.4", "6.1", "6.2", "6.3"
];
let manifest = "";
for (const objective of protectedObjectives) {
  const domain = Number(objective.split(".")[0]);
  const world = domain <= 4 ? domain : 5;
  const relative = `json/cloud-plus/world${world}/${objective}-hatchling.json`;
  const bytes = fs.readFileSync(path.join(root, relative));
  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  const count = JSON.parse(bytes).length;
  manifest += `${relative}\t${count}\t${hash}\n`;
}
const protectedHash = crypto.createHash("sha256").update(manifest).digest("hex");
requireValue(protectedHash === "745b5e49f30399c22d5f7c5e00e94c3067b6af242431056373c35d08c5d9bbe0", "Protected Objective Sweep aggregate fingerprint changed.");

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

const corpus = [];
for (let world = 1; world <= 5; world += 1) {
  const directory = path.join(root, "json", "cloud-plus", `world${world}`);
  fs.readdirSync(directory).filter(file => file.endsWith("-hatchling.json")).forEach(file => {
    JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")).forEach(question => corpus.push({id: question.id, kind: "sweep", text: question.question}));
  });
}
for (const directory of [path.join(root, "json", "cloud-plus", "captains"), path.join(root, "json", "cloud-plus", "final-dungeon")]) {
  fs.readdirSync(directory).filter(file => file.endsWith(".json")).forEach(file => {
    JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")).forEach(question => corpus.push({id: question.id, kind: directory.endsWith("captains") ? "captain" : "practice", text: question.question}));
  });
}
const pbqDocs = bank.missions.flatMap(mission => mission.tasks.map(task => ({id: `${mission.id}/${task.id}`, kind: "pbq", text: task.prompt})));
const allDocs = [...corpus, ...pbqDocs];
const normalized = new Map();
for (const doc of allDocs) {
  const key = normalize(doc.text);
  if (normalized.has(key) && (doc.kind === "pbq" || normalized.get(key).kind === "pbq")) failures.push(`Exact duplicate text: ${doc.id} and ${normalized.get(key).id}.`);
  else normalized.set(key, doc);
}

const stop = new Set("a an and are as at be been being best but by can could did do does for from given has have how if in into is it its most of on or should than that the their then they this to use used using what when where which who why will with would you your".split(" "));
const tokens = allDocs.map(doc => normalize(doc.text).split(" ").filter(token => token.length > 2 && !stop.has(token)));
const documentFrequency = new Map();
tokens.forEach(list => new Set(list).forEach(token => documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1)));
const vectors = tokens.map(list => {
  const counts = new Map();
  list.forEach(token => counts.set(token, (counts.get(token) || 0) + 1));
  const values = new Map();
  let norm = 0;
  counts.forEach((count, token) => {
    const value = count * (Math.log((allDocs.length + 1) / ((documentFrequency.get(token) || 0) + 1)) + 1);
    values.set(token, value);
    norm += value * value;
  });
  return {values, norm: Math.sqrt(norm)};
});
function cosine(left, right) {
  let dot = 0;
  const pair = left.values.size < right.values.size ? [left.values, right.values] : [right.values, left.values];
  pair[0].forEach((value, token) => { dot += value * (pair[1].get(token) || 0); });
  return left.norm && right.norm ? dot / (left.norm * right.norm) : 0;
}
const similarityCandidates = [];
for (let left = 0; left < allDocs.length; left += 1) {
  for (let right = left + 1; right < allDocs.length; right += 1) {
    if (allDocs[left].kind !== "pbq" && allDocs[right].kind !== "pbq") continue;
    const score = cosine(vectors[left], vectors[right]);
    if (score >= 0.59) similarityCandidates.push({score: Number(score.toFixed(4)), left: allDocs[left].id, right: allDocs[right].id});
  }
}
requireValue(similarityCandidates.length === 0, `Substantive similarity candidates require review: ${JSON.stringify(similarityCandidates)}.`);

if (failures.length) {
  console.error("Cloud+ PBQ validation: FAIL");
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Cloud+ PBQ validation: PASS");
console.log(`- Production missions: ${bank.missions.length}`);
console.log(`- Independently scored points: ${totalPoints}`);
console.log(`- Application objectives: ${Object.keys(applicationCoverage).length} of 15`);
console.log(`- PBQ tasks: ${pbqDocs.length}`);
console.log("- Structural solutions, explanations, field-level scoring, and route integration: PASS");
console.log("- Exact and TF-IDF substantive similarity checks: PASS");
console.log(`- Protected Sweep aggregate SHA-256: ${protectedHash}`);
