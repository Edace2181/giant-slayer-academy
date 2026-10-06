const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
let failures = 0;

function check(condition, message) {
  if (condition) console.log(`PASS: ${message}`);
  else {
    failures += 1;
    console.error(`FAIL: ${message}`);
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function count(source, needle) {
  return source.split(needle).length - 1;
}

const tracks = [
  {
    id: "aplus-core1",
    name: "A+ Core 1",
    prefix: "aplus-core1",
    entry: "aplus-core1.html",
    quiz: "aplus-core1-quiz.html",
    bodyValues: ["aplus-core1", "A+ Core 1"],
    file: "the-technicians-forge-aplus-core1.mp3",
    bytes: 4685079,
    hash: "28633510D613939ED79CD7BEB32585F6A72CF4F0F70658F4CD64C384F8D6A912"
  },
  {
    id: "aplus-core2",
    name: "A+ Core 2",
    prefix: "aplus-core2",
    entry: "aplus-core2.html",
    quiz: "aplus-core2-quiz.html",
    bodyValues: ["aplus-core2", "A+ Core 2"],
    file: "guardian-of-the-systems-aplus-core2.mp3",
    bytes: 4538710,
    hash: "8417B692FBADE0EDAB91397A363107EA870A4ACA21103C39F77EF694C50D0153"
  },
  {
    id: "network-plus",
    name: "Network+",
    prefix: "network",
    entry: "network-plus.html",
    quiz: "hydra-quiz.html",
    bodyValues: ["network-plus", "Network+"],
    file: "the-connected-kingdom-network-plus.mp3",
    bytes: 4591594,
    hash: "861CD072789FD7B2372E072D54EDFF4A49721358594A9AD78BBC6351F6D55731"
  },
  {
    id: "security-plus",
    name: "Security+",
    prefix: "security-plus",
    entry: "security-plus.html",
    quiz: "security-plus-quiz.html",
    bodyValues: ["security-plus", "Security+"],
    file: "defend-the-citadel-security-plus.mp3",
    bytes: 4496041,
    hash: "74A48659D941A8C1D14BFC81F509A6B11B40C04A8C52B2468B90B583306DE8C9"
  },
  {
    id: "linux-essentials",
    name: "Linux Essentials",
    prefix: "linux-essentials",
    entry: "linux-essentials.html",
    quiz: "linux-essentials-quiz.html",
    bodyValues: ["linux-essentials"],
    file: "the-terminal-sanctum-linux-essentials.mp3",
    bytes: 4356141,
    hash: "B641060D27AB804964B1A6887718368A755D3E0639F6936877C0843F28D9B564"
  },
  {
    id: "aws-cloud-practitioner",
    name: "AWS Cloud Practitioner",
    prefix: "aws-cloud-practitioner",
    entry: "aws-cloud-practitioner.html",
    quiz: "aws-cloud-practitioner-quiz.html",
    bodyValues: ["aws-cloud-practitioner"],
    file: "guide-of-the-clouds-aws-cloud-practitioner.mp3",
    bytes: 4456043,
    hash: "F882A45D383272EF3B77FF7C1D0BBD8B7501BAA4B402D6193D1DFB6B14FD0DE5"
  },
  {
    id: "cloud-plus",
    name: "Cloud+",
    prefix: "cloud-plus",
    entry: "cloud-plus.html",
    quiz: "cloud-plus-quiz.html",
    bodyValues: ["cloud-plus"],
    file: "citadel-above-the-clouds-cloud-plus.mp3",
    bytes: 4930252,
    hash: "A7CD4FC0A8C04F066850752D0A1A6166D81247C3DAA1909CEA5CC69B19E69C04"
  }
];

const soundtrackDirectory = path.join(ROOT, "assets", "soundtracks");
for (const track of tracks) {
  const assetPath = path.join(soundtrackDirectory, track.file);
  check(fs.existsSync(assetPath), `${track.name} production soundtrack exists in the dedicated asset directory.`);
  if (fs.existsSync(assetPath)) {
    const bytes = fs.readFileSync(assetPath);
    check(bytes.length === track.bytes, `${track.name} production soundtrack preserves the original byte count.`);
    check(
      crypto.createHash("sha256").update(bytes).digest("hex").toUpperCase() === track.hash,
      `${track.name} production soundtrack remains byte-for-byte identical to the approved master.`
    );
  }
}

function standardPages(track) {
  return [
    track.entry,
    `${track.prefix}-campaign.html`,
    ...[1, 2, 3, 4, 5].map(world => `${track.prefix}-world${world}-objectives.html`),
    `${track.prefix}-field-manual.html`,
    ...[6, 7, 8].map(world => `${track.prefix}-world${world}.html`),
    `${track.prefix}-final-dungeon.html`,
    `${track.prefix}-final-gauntlet.html`,
    track.quiz
  ];
}

for (const track of tracks) {
  for (const page of standardPages(track)) {
    const html = read(page);
    check(count(html, "certification-soundtrack.css") === 1, `${page} loads the shared soundtrack stylesheet exactly once.`);
    check(count(html, "certification-soundtrack.js") === 1, `${page} loads the shared soundtrack controller exactly once.`);
    check(track.bodyValues.some(value => html.includes(`data-certification="${value}"`)), `${page} identifies ${track.name}.`);
  }
}

for (const page of ["linux-labs.html", "linux-lab.html", "linux-labs-graduation.html"]) {
  const html = read(page);
  check(count(html, "certification-soundtrack.css") === 1, `${page} loads the shared soundtrack stylesheet exactly once.`);
  check(count(html, "certification-soundtrack.js") === 1, `${page} loads the shared soundtrack controller exactly once.`);
  check(html.includes('data-certification="linux-essentials"'), `${page} identifies Linux Essentials.`);
}

for (const page of ["review-hub.html", "pbq-arena.html"]) {
  const html = read(page);
  check(count(html, "certification-soundtrack.css") === 1, `${page} loads the shared soundtrack stylesheet exactly once.`);
  check(count(html, "certification-soundtrack.js") === 1, `${page} loads the shared soundtrack controller exactly once.`);
}

for (const track of tracks) {
  check(read(track.quiz).includes('data-soundtrack-policy="focus"'), `${track.name} quizzes and Practice Exams explicitly use focus policy.`);
}
check(read("pbq-arena.html").includes('data-soundtrack-policy="focus"'), "The shared PBQ Arena explicitly uses focus policy.");
check(read("linux-lab.html").includes('data-soundtrack-policy="focus"'), "The interactive Linux lab runner explicitly uses focus policy.");

const controller = read("certification-soundtrack.js");
const css = read("certification-soundtrack.css");
for (const track of tracks) {
  check(count(controller, `"${track.id}": Object.freeze`) === 1, `Shared controller contains exactly one ${track.name} soundtrack mapping.`);
  check(controller.includes(track.file), `${track.name} maps to the correct production asset.`);
}
check(!controller.includes("rise-giant-slayer-ending.mp3"), "Soundtrack controller is isolated from the sealed Finale master.");
check(controller.includes("BroadcastChannel") && controller.includes("COORDINATION_KEY"), "Cross-tab playback protection has a storage fallback.");
check(controller.includes("sessionStorage") && controller.includes("localStorage"), "Playback position and learner preferences use the approved storage split.");
check(controller.includes("Your browser paused automatic audio") && controller.includes("await audio.play()"), "Blocked autoplay degrades to a visible manual resume state.");
check(controller.includes('window.addEventListener("gsa:media-start"') && controller.includes('window.addEventListener("gsa:media-end"'), "Other Academy media can pause and safely release the soundtrack.");
check(controller.includes('policy === "focus"') && controller.includes("focusHeld"), "Focus-page entry pauses automatic soundtrack continuation.");
check(css.includes("@media (max-width: 480px)") && css.includes("calc(100vw - 28px)"), "Soundtrack dock includes constrained mobile layout rules.");
check(css.includes("min-width: 44px") && css.includes("min-height: 44px"), "Soundtrack controls preserve touch-size accessibility.");

const soundtrackAssets = fs.existsSync(soundtrackDirectory)
  ? fs.readdirSync(soundtrackDirectory).filter((name) => name.toLowerCase().endsWith(".mp3")).sort()
  : [];
check(
  soundtrackAssets.length === tracks.length && tracks.every(track => soundtrackAssets.includes(track.file)),
  "Soundtrack asset directory contains exactly the seven approved production masters."
);

for (const world of [1, 2, 3, 4, 5]) {
  const legacy = read(`security-plus-world${world}.html`);
  check(!legacy.includes("certification-soundtrack"), `Inactive Security+ World ${world} legacy page remains untouched.`);
}

const finaleValidator = read("tools/validate-academy-finale.js");
check(finaleValidator.includes("assets/rise-giant-slayer-ending.mp3"), "Existing Finale validator still targets the sealed production master.");

if (failures) {
  console.error(`\nCertification soundtrack validation failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log("\nSeven-kingdom certification soundtrack validation passed.");
