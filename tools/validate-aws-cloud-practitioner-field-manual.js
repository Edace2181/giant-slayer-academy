"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const errors = [];
const requireValue = (condition, message) => { if (!condition) errors.push(message); };
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const json = relative => JSON.parse(read(relative));

const objectives = {
  "1.1": {
    count: 6,
    hash: "323930AD65F7B9A5D3B011701F9032909D607F47288A1215D89736C7D98DEE63",
    firstId: "AWSCLF-1.1-R001",
    sections: ["what-you-are-learning", "maestro-focus", "value-proposition", "global-infrastructure", "high-availability", "elasticity", "agility", "scenario-recognition", "exam-trap", "maestro-recognition-sheet"],
    topics: ["AWS Cloud value proposition", "Speed of Deployment", "Global Reach", "High Availability", "Elasticity", "Agility"]
  },
  "1.2": {
    count: 8,
    hash: "E8C60E1C0830E30926D1D31D3632EE3D225ED79EE98141DE35C6CA9C99165F84",
    firstId: "AWSCLF-1.2-R001",
    sections: ["what-you-are-learning", "maestro-focus", "well-architected-framework", "operational-excellence", "security", "reliability", "performance-efficiency", "cost-optimization", "sustainability", "pillar-comparison", "exam-trap", "maestro-recognition-sheet"],
    topics: ["AWS Well-Architected Framework", "Operational Excellence", "Security", "Reliability", "Performance Efficiency", "Cost Optimization", "Sustainability", "Distinguishing the Six Pillars"]
  },
  "1.3": {
    count: 10,
    hash: "BA6ABDF4D4C33B264F40935BDB8826C00B5CE26A32F81C519FBE5D99FDA71635",
    firstId: "AWSCLF-1.3-R001",
    sections: ["what-you-are-learning", "maestro-focus", "cloud-adoption-strategy", "migration-resources", "aws-caf", "caf-outcomes", "migration-strategies", "database-replication", "aws-snowball", "framework-comparison", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Cloud Adoption Strategies", "Resources for the Cloud Migration Journey", "AWS Cloud Adoption Framework (AWS CAF)", "Reduced Business Risk", "Improved ESG Performance", "Increased Revenue", "Increased Operational Efficiency", "Selecting a Migration Strategy", "Database Replication", "AWS Snowball"]
  },
  "1.4": {
    count: 8,
    hash: "1AA0A59871EB1A898A2D9FBA505DC9B11BA8BD95A9E5D14038B2502E14B463EE",
    firstId: "AWSCLF-1.4-R001",
    sections: ["what-you-are-learning", "maestro-focus", "cloud-economics", "fixed-and-variable-costs", "on-premises-costs", "licensing-strategies", "rightsizing", "automation", "economies-of-scale", "cost-savings", "scenario-recognition", "exam-trap", "maestro-recognition-sheet", "world-one-connection"],
    topics: ["Cloud Economics", "Fixed Costs", "Variable Costs", "On-Premises Environments", "Bring Your Own License (BYOL)", "Included License", "Rightsizing", "Automation", "Economies of Scale", "Potential Cost Savings"]
  }
};

for (const [objective, expected] of Object.entries(objectives)) {
  const lesson = json(`json/aws-cloud-practitioner/field-manual/${objective}.json`);
  const bankPath = path.join(root, `json/aws-cloud-practitioner/world1/${objective}-hatchling.json`);
  const bankBytes = fs.readFileSync(bankPath);
  const bank = JSON.parse(bankBytes.toString("utf8"));
  const hash = crypto.createHash("sha256").update(bankBytes).digest("hex").toUpperCase();
  const sectionIds = (lesson.sections || []).map(section => section.id);
  const lessonText = JSON.stringify(lesson).toLowerCase();

  requireValue(lesson.schemaVersion === 1, `${objective} schemaVersion must be 1.`);
  requireValue(lesson.certification === "aws-cloud-practitioner" && lesson.examCode === "CLF-C02", `${objective} metadata must match AWS Cloud Practitioner CLF-C02.`);
  requireValue(lesson.world === "1" && lesson.objective === objective, `${objective} route metadata must match World 1.`);
  requireValue(lesson.miniCheckSource === "objective-sweep-bank", `${objective} must use the GSA-owned Mini Check source.`);
  requireValue(!Object.prototype.hasOwnProperty.call(lesson, "miniCheck"), `${objective} must not author a Mini Check question.`);
  requireValue(sectionIds.length === new Set(sectionIds).size, `${objective} section IDs must be unique.`);
  expected.sections.forEach(id => requireValue(sectionIds.includes(id), `${objective} is missing section: ${id}`));
  expected.topics.forEach(topic => requireValue(lessonText.includes(topic.toLowerCase()), `${objective} is missing required topic: ${topic}`));
  requireValue(Array.isArray(bank) && bank.length === expected.count, `${objective} protected Sweep bank must contain exactly ${expected.count} questions.`);
  requireValue(bank[0]?.id === expected.firstId, `${objective} Mini Check source must remain the first protected Sweep question.`);
  requireValue(hash === expected.hash, `${objective} protected Sweep bank bytes changed.`);
}

const hub = read("aws-cloud-practitioner-world1-objectives.html");
const campaign = read("aws-cloud-practitioner-campaign.html");
const manualPage = read("aws-cloud-practitioner-field-manual.html");
const manualScript = read("aws-cloud-practitioner-field-manual.js");
const hubScript = read("aws-cloud-practitioner-objective-hub.js");
const quizScript = read("aws-cloud-practitioner-quiz.js");

requireValue(campaign.includes('href="aws-cloud-practitioner-world1-objectives.html"'), "Campaign World 1 must route to its Objective Hub.");
for (const objective of Object.keys(objectives)) {
  requireValue(hub.includes(`aws-cloud-practitioner-field-manual.html?world=1&amp;objective=${objective}`), `World 1 Hub is missing the ${objective} Field Manual action.`);
  requireValue(hub.includes(`aws-cloud-practitioner-quiz.html?world=1&amp;objective=${objective}`), `${objective} Sweep route changed unexpectedly.`);
  requireValue(hub.includes(`id="objective${objective.replace(".", "")}ManualStatus"`) && hub.includes(`id="objective${objective.replace(".", "")}SweepStatus"`), `${objective} Manual and Sweep statuses must remain separate.`);
}
requireValue(hub.includes('href="security-plus-field-manual.css"') && hub.includes('src="aws-cloud-practitioner-objective-hub.js"'), "World 1 Hub must use the established Field Manual card presentation and status engine.");
requireValue(hub.includes('href="aws-cloud-practitioner-campaign.html" class="back-link">← Return to Campaign Map</a>'), "World 1 Hub must return to the AWS Campaign Map.");
requireValue(manualPage.includes('id="awsManualNavigation"') && manualScript.includes("function renderNavigation()"), "The AWS Field Manual is missing lesson navigation.");
requireValue(manualScript.includes('const MANUAL_KEY = "hydra-aws-cloud-practitioner-field-manual-v1"'), "Manual completion storage must remain isolated.");
requireValue(hubScript.includes('const PROGRESS_KEY = "hydra-aws-cloud-practitioner-progress-v1"'), "The Objective Hub must read the existing Sweep progress key.");
requireValue(manualScript.includes('"json/aws-cloud-practitioner/world" + world + "/" + objective + "-hatchling.json"'), "Mini Checks must load the existing protected Sweep banks.");
requireValue(manualScript.includes('window.location.assign("aws-cloud-practitioner-quiz.html?world="'), "Completing a manual must continue to the existing Objective Sweep.");
requireValue(manualScript.includes('elements.returnLink.href = "aws-cloud-practitioner-world" + world + "-objectives.html"'), "Field Manuals must return to their Objective Hub.");
requireValue(manualScript.includes('world === "1" && /^1\\.[1-4]$/.test(objective)'), "The Field Manual route gate must include only published World 1 objectives 1.1-1.4.");
requireValue(quizScript.includes('return { href: `aws-cloud-practitioner-world${world}-objectives.html`'), "Objective Sweeps must continue returning to their Objective Hub.");

if (errors.length) {
  console.error("AWS Cloud Practitioner Field Manual validation: FAIL");
  errors.forEach(error => console.error("- " + error));
  process.exitCode = 1;
} else {
  console.log("AWS Cloud Practitioner Field Manual validation: PASS");
  for (const [objective, expected] of Object.entries(objectives)) {
    console.log(`- Task Statement ${objective} protected mappings: ${expected.count} of ${expected.count} (100%)`);
    console.log(`- Task Statement ${objective} lesson architecture and ${expected.sections.length}-section navigator: PASS`);
    console.log(`- Protected ${objective} Sweep bank remains ${expected.count} questions and byte-for-byte unchanged: PASS`);
  }
  console.log("- GSA-owned Mini Checks; no new questions authored: PASS");
  console.log("- Manual completion and Sweep mastery remain separate: PASS");
  console.log("- Campaign, Objective Hub, Field Manual, and Sweep navigation: PASS");
}
