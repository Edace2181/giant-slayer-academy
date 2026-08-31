const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const errors = [];
const requireValue = (condition, message) => { if (!condition) errors.push(message); };
const read = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");

const certifications = [
  {
    name: "A+ Core 1",
    prefix: "aplus-core1",
    entry: "aplus-core1.html",
    campaign: "aplus-core1-campaign.html",
    quiz: "aplus-core1-quiz.html"
  },
  {
    name: "A+ Core 2",
    prefix: "aplus-core2",
    entry: "aplus-core2.html",
    campaign: "aplus-core2-campaign.html",
    quiz: "aplus-core2-quiz.html"
  },
  {
    name: "Network+",
    prefix: "network",
    entry: "network-plus.html",
    campaign: "network-campaign.html",
    quiz: "hydra-quiz.html"
  },
  {
    name: "AWS Cloud Practitioner",
    prefix: "aws-cloud-practitioner",
    entry: "aws-cloud-practitioner.html",
    campaign: "aws-cloud-practitioner-campaign.html",
    quiz: "aws-cloud-practitioner-quiz.html"
  },
  {
    name: "Linux Essentials",
    prefix: "linux-essentials",
    entry: "linux-essentials.html",
    campaign: "linux-essentials-campaign.html",
    quiz: "linux-essentials-quiz.html"
  }
];

const rootRouteSources = fs.readdirSync(root, { withFileTypes: true })
  .filter(entry => entry.isFile() && /\.(?:html|js)$/i.test(entry.name))
  .map(entry => ({ name: entry.name, text: read(entry.name) }));
const academyScript = read("script.js");
const objectiveReturnScript = read("objective-quiz-return.js");

requireValue(
  academyScript.includes('entryState.get("entered") === "1"'),
  "Select a Game entry state no longer supports index.html?entered=1."
);
requireValue(
  objectiveReturnScript.includes('returnLink.href = `${prefix}-world${world}-objectives.html`;'),
  "Shared Objective Sweep return no longer targets Chapter Objective Hubs."
);

certifications.forEach(certification => {
  const entry = read(certification.entry);
  const campaign = read(certification.campaign);
  const quiz = read(certification.quiz);
  const hubs = [];

  requireValue(
    entry.includes('href="index.html?entered=1"') && entry.includes("Return to Academy"),
    certification.name + " internal Return to Academy must open Select a Game."
  );
  requireValue(
    campaign.includes('href="' + certification.entry + '"'),
    certification.name + " Campaign Map must return to its certification entry page."
  );
  requireValue(
    quiz.includes('<script src="objective-quiz-return.js"></script>'),
    certification.name + " Objective Sweep no longer loads the shared Objective Hub return behavior."
  );

  for (let world = 1; world <= 5; world += 1) {
    const legacy = certification.prefix + "-world" + world + ".html";
    const hubPath = certification.prefix + "-world" + world + "-objectives.html";
    const legacyPath = path.join(root, legacy);
    const hub = read(hubPath);
    hubs.push(hub);

    requireValue(
      campaign.includes('href="' + hubPath + '"'),
      certification.name + " Campaign Map World " + world + " must route directly to its Objective Hub."
    );
    requireValue(
      hub.includes('href="' + certification.campaign + '" class="back-link"') && hub.includes("Return to Campaign Map"),
      certification.name + " World " + world + " Objective Hub must return to the Campaign Map."
    );
    requireValue(
      !fs.existsSync(legacyPath),
      certification.name + " legacy World " + world + " PRESS START page must be retired."
    );

    const inboundSources = rootRouteSources
      .filter(source => source.text.includes(legacy))
      .map(source => source.name);
    requireValue(
      inboundSources.length === 0,
      certification.name + " legacy World " + world + " page is still referenced by: " + inboundSources.join(", ")
    );
  }

  requireValue(
    ![entry, campaign, ...hubs].some(source => /PRESS START|Choose Your Training Mode/i.test(source)),
    certification.name + " active learning flow still exposes a legacy chapter landing state."
  );
  [6, 7, 8].forEach(world => {
    requireValue(
      campaign.includes(certification.prefix + "-world" + world + ".html"),
      certification.name + " Campaign Map World " + world + " route must remain unchanged."
    );
  });
});

if (errors.length) {
  console.error("Academy navigation validation: FAIL");
  errors.forEach(error => console.error("- " + error));
  process.exitCode = 1;
} else {
  console.log("Academy navigation validation: PASS");
  certifications.forEach(certification => {
    console.log("- " + certification.name + ": entry, Campaign Map, five Objective Hubs, legacy retirement, and Sweep return PASS");
  });
  console.log("- Chapters/Worlds 6-8 preserved: PASS");
  console.log("- Internal Academy returns open Select a Game: PASS");
}
