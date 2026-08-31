const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const errors = [];
const requireValue = (condition, message) => { if (!condition) errors.push(message); };
const read = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");
const json = relativePath => JSON.parse(read(relativePath));

const lesson = json("json/cloud-plus/field-manual/1.1.json");
const bank = json("json/cloud-plus/world1/1.1-hatchling.json");
const lesson12 = json("json/cloud-plus/field-manual/1.2.json");
const bank12 = json("json/cloud-plus/world1/1.2-hatchling.json");
const lesson13 = json("json/cloud-plus/field-manual/1.3.json");
const bank13 = json("json/cloud-plus/world1/1.3-hatchling.json");
const lesson14 = json("json/cloud-plus/field-manual/1.4.json");
const bank14 = json("json/cloud-plus/world1/1.4-hatchling.json");
const lesson15 = json("json/cloud-plus/field-manual/1.5.json");
const bank15 = json("json/cloud-plus/world1/1.5-hatchling.json");
const lesson16 = json("json/cloud-plus/field-manual/1.6.json");
const bank16 = json("json/cloud-plus/world1/1.6-hatchling.json");
const lesson17 = json("json/cloud-plus/field-manual/1.7.json");
const bank17 = json("json/cloud-plus/world1/1.7-hatchling.json");
const lesson18 = json("json/cloud-plus/field-manual/1.8.json");
const bank18 = json("json/cloud-plus/world1/1.8-hatchling.json");
const lesson19 = json("json/cloud-plus/field-manual/1.9.json");
const bank19 = json("json/cloud-plus/world1/1.9-hatchling.json");
const lesson110 = json("json/cloud-plus/field-manual/1.10.json");
const bank110 = json("json/cloud-plus/world1/1.10-hatchling.json");
const lesson111 = json("json/cloud-plus/field-manual/1.11.json");
const bank111 = json("json/cloud-plus/world1/1.11-hatchling.json");
const campaign = read("cloud-plus-campaign.html");
const cloudEntry = read("cloud-plus.html");
const hub = read("cloud-plus-world1-objectives.html");
const manualPage = read("cloud-plus-field-manual.html");
const manualScript = read("cloud-plus-field-manual.js");
const quizPage = read("cloud-plus-quiz.html");
const quizScript = read("cloud-plus-quiz.js");
const navigationStandard = read("GSA-NAVIGATION-STANDARD.md");
const legacyWorld1Path = path.join(root, "cloud-plus-world1.html");

requireValue(lesson.schemaVersion === 1, "Objective 1.1 schemaVersion must be 1.");
requireValue(lesson.certification === "cloud-plus", "Objective 1.1 certification must be cloud-plus.");
requireValue(lesson.examCode === "CV0-004", "Objective 1.1 exam code must be CV0-004.");
requireValue(lesson.world === "1" && lesson.objective === "1.1", "Objective 1.1 route metadata must match Chapter 1.");
requireValue(lesson.miniCheckSource === "objective-sweep-bank", "Objective 1.1 must use the GSA-owned Mini Check source.");
requireValue(!Object.prototype.hasOwnProperty.call(lesson, "miniCheck"), "Objective 1.1 lesson data must not author a Mini Check question.");

const expectedSections = [
  "what-you-are-learning", "maestro-focus", "infrastructure-as-a-service", "platform-as-a-service",
  "software-as-a-service", "function-as-a-service", "service-model-comparison", "shared-responsibility-model",
  "service-model-connection", "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds = (lesson.sections || []).map(section => section.id);
requireValue(sectionIds.length === new Set(sectionIds).size, "Objective 1.1 section IDs must be unique.");
expectedSections.forEach(id => requireValue(sectionIds.includes(id), "Objective 1.1 is missing section: " + id));

const lessonText = JSON.stringify(lesson);
[
  "Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)",
  "Function as a Service (FaaS)", "Shared Responsibility Model"
].forEach(topic => requireValue(lessonText.includes(topic), "Objective 1.1 is missing required topic: " + topic));

requireValue(Array.isArray(bank) && bank.length === 6, "Objective 1.1 protected Sweep bank must contain exactly 6 questions.");
requireValue(bank[0]?.id === "CV0004-1.1-R001", "Objective 1.1 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson12.schemaVersion === 1 && lesson12.certification === "cloud-plus" && lesson12.examCode === "CV0-004", "Objective 1.2 metadata must match Cloud+ CV0-004.");
requireValue(lesson12.world === "1" && lesson12.objective === "1.2", "Objective 1.2 route metadata must match Chapter 1.");
requireValue(lesson12.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson12, "miniCheck"), "Objective 1.2 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections12 = ["what-you-are-learning", "maestro-focus", "resource-availability", "regions", "availability-zones", "region-vs-availability-zone", "cloud-bursting", "edge-computing", "availability-monitoring", "disaster-recovery", "recovery-time-objective", "recovery-point-objective", "rto-vs-rpo", "recovery-sites", "multicloud-tenancy", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds12 = (lesson12.sections || []).map(section => section.id);
requireValue(sectionIds12.length === new Set(sectionIds12).size, "Objective 1.2 section IDs must be unique.");
expectedSections12.forEach(id => requireValue(sectionIds12.includes(id), "Objective 1.2 is missing section: " + id));
const requiredTopics12 = ["Resource Availability", "Region", "Availability Zone", "Cloud Bursting", "Edge Computing", "Availability Monitoring", "Disaster Recovery", "Recovery Time Objective (RTO)", "Recovery Point Objective (RPO)", "Hot Site", "Warm Site", "Cold Site", "Multicloud Tenancy"];
const lessonText12 = JSON.stringify(lesson12);
requiredTopics12.forEach(topic => requireValue(lessonText12.includes(topic), "Objective 1.2 is missing required topic: " + topic));
requireValue(Array.isArray(bank12) && bank12.length === 13, "Objective 1.2 protected Sweep bank must contain exactly 13 questions.");
requireValue(bank12[0]?.id === "CV0004-1.2-R001", "Objective 1.2 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson13.schemaVersion === 1 && lesson13.certification === "cloud-plus" && lesson13.examCode === "CV0-004", "Objective 1.3 metadata must match Cloud+ CV0-004.");
requireValue(lesson13.world === "1" && lesson13.objective === "1.3", "Objective 1.3 route metadata must match Chapter 1.");
requireValue(lesson13.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson13, "miniCheck"), "Objective 1.3 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections13 = ["what-you-are-learning", "maestro-focus", "public-and-private-connections", "network-functions-components-and-services", "virtual-private-cloud", "routing-and-switching", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds13 = (lesson13.sections || []).map(section => section.id);
requireValue(sectionIds13.length === new Set(sectionIds13).size, "Objective 1.3 section IDs must be unique.");
expectedSections13.forEach(id => requireValue(sectionIds13.includes(id), "Objective 1.3 is missing section: " + id));
const requiredTopics13 = ["Public and Private Connections to the Cloud", "Virtual Private Network (VPN)", "Dedicated Connections", "Network Functions, Components, and Services", "Application Load Balancer", "Network Load Balancer", "Application Gateway", "Content Delivery Network (CDN)", "Firewalls", "Virtual Private Cloud (VPC)", "VPC Peering", "Transit Gateway", "Subnets", "Routing and Switching", "Virtual Local Area Network (VLAN)", "Software-Defined Networking (SDN)", "Border Gateway Protocol (BGP)", "Static Routes", "Route Tables"];
const lessonText13 = JSON.stringify(lesson13);
requiredTopics13.forEach(topic => requireValue(lessonText13.includes(topic), "Objective 1.3 is missing required topic: " + topic));
requireValue(Array.isArray(bank13) && bank13.length === 19, "Objective 1.3 protected Sweep bank must contain exactly 19 questions.");
requireValue(bank13[0]?.id === "CV0004-1.3-R001", "Objective 1.3 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson14.schemaVersion === 1 && lesson14.certification === "cloud-plus" && lesson14.examCode === "CV0-004", "Objective 1.4 metadata must match Cloud+ CV0-004.");
requireValue(lesson14.world === "1" && lesson14.objective === "1.4", "Objective 1.4 route metadata must match Chapter 1.");
requireValue(lesson14.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson14, "miniCheck"), "Objective 1.4 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections14 = ["what-you-are-learning", "maestro-focus", "tiered-storage", "disk-types", "storage-types", "performance-implications", "cost-implications", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds14 = (lesson14.sections || []).map(section => section.id);
requireValue(sectionIds14.length === new Set(sectionIds14).size, "Objective 1.4 section IDs must be unique.");
expectedSections14.forEach(id => requireValue(sectionIds14.includes(id), "Objective 1.4 is missing section: " + id));
const requiredTopics14 = ["Tiered Storage", "Hot Storage", "Warm Storage", "Cold Storage", "Archive Storage", "Disk Types", "Solid-State Drive (SSD)", "Hard Disk Drive (HDD)", "Storage Types", "Object Storage", "Block Storage", "File Storage", "Performance Implications", "Cost Implications"];
const lessonText14 = JSON.stringify(lesson14);
requiredTopics14.forEach(topic => requireValue(lessonText14.includes(topic), "Objective 1.4 is missing required topic: " + topic));
requireValue(Array.isArray(bank14) && bank14.length === 14, "Objective 1.4 protected Sweep bank must contain exactly 14 questions.");
requireValue(bank14[0]?.id === "CV0004-1.4-R001", "Objective 1.4 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson15.schemaVersion === 1 && lesson15.certification === "cloud-plus" && lesson15.examCode === "CV0-004", "Objective 1.5 metadata must match Cloud+ CV0-004.");
requireValue(lesson15.world === "1" && lesson15.objective === "1.5", "Objective 1.5 route metadata must match Chapter 1.");
requireValue(lesson15.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson15, "miniCheck"), "Objective 1.5 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections15 = ["what-you-are-learning", "maestro-focus", "cloud-provided-managed-services", "microservices", "loosely-coupled-architecture", "fan-out", "service-discovery", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds15 = (lesson15.sections || []).map(section => section.id);
requireValue(sectionIds15.length === new Set(sectionIds15).size, "Objective 1.5 section IDs must be unique.");
expectedSections15.forEach(id => requireValue(sectionIds15.includes(id), "Objective 1.5 is missing section: " + id));
const requiredTopics15 = ["Cloud-Provided Managed Services", "Microservices", "Loosely Coupled Architecture", "Fan-Out", "Service Discovery"];
const lessonText15 = JSON.stringify(lesson15);
requiredTopics15.forEach(topic => requireValue(lessonText15.includes(topic), "Objective 1.5 is missing required topic: " + topic));
requireValue(Array.isArray(bank15) && bank15.length === 5, "Objective 1.5 protected Sweep bank must contain exactly 5 questions.");
requireValue(bank15[0]?.id === "CV0004-1.5-R001", "Objective 1.5 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson16.schemaVersion === 1 && lesson16.certification === "cloud-plus" && lesson16.examCode === "CV0-004", "Objective 1.6 metadata must match Cloud+ CV0-004.");
requireValue(lesson16.world === "1" && lesson16.objective === "1.6", "Objective 1.6 route metadata must match Chapter 1.");
requireValue(lesson16.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson16, "miniCheck"), "Objective 1.6 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections16 = ["what-you-are-learning", "maestro-focus", "stand-alone", "workload-orchestration", "networking", "storage-types", "image-registries", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds16 = (lesson16.sections || []).map(section => section.id);
requireValue(sectionIds16.length === new Set(sectionIds16).size, "Objective 1.6 section IDs must be unique.");
expectedSections16.forEach(id => requireValue(sectionIds16.includes(id), "Objective 1.6 is missing section: " + id));
const requiredTopics16 = ["Stand-Alone", "Workload Orchestration", "Networking", "Port Mapping", "Storage Types", "Persistent Volumes", "Ephemeral Storage", "Image Registries"];
const lessonText16 = JSON.stringify(lesson16);
requiredTopics16.forEach(topic => requireValue(lessonText16.includes(topic), "Objective 1.6 is missing required topic: " + topic));
requireValue(Array.isArray(bank16) && bank16.length === 8, "Objective 1.6 protected Sweep bank must contain exactly 8 questions.");
requireValue(bank16[0]?.id === "CV0004-1.6-R001", "Objective 1.6 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson17.schemaVersion === 1 && lesson17.certification === "cloud-plus" && lesson17.examCode === "CV0-004", "Objective 1.7 metadata must match Cloud+ CV0-004.");
requireValue(lesson17.world === "1" && lesson17.objective === "1.7", "Objective 1.7 route metadata must match Chapter 1.");
requireValue(lesson17.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson17, "miniCheck"), "Objective 1.7 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections17 = ["what-you-are-learning", "maestro-focus", "stand-alone", "clustering", "cloning", "host-affinity", "hardware-pass-through", "network-types", "storage", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds17 = (lesson17.sections || []).map(section => section.id);
requireValue(sectionIds17.length === new Set(sectionIds17).size, "Objective 1.7 section IDs must be unique.");
expectedSections17.forEach(id => requireValue(sectionIds17.includes(id), "Objective 1.7 is missing section: " + id));
const requiredTopics17 = ["Stand-Alone", "Clustering", "Cloning", "Host Affinity", "Hardware Pass-Through", "Network Types", "Overlay Networks", "Virtual Machine (VM) Networks", "Storage", "Local Storage", "Storage Area Network (SAN)", "Network-Attached Storage (NAS)"];
const lessonText17 = JSON.stringify(lesson17);
requiredTopics17.forEach(topic => requireValue(lessonText17.includes(topic), "Objective 1.7 is missing required topic: " + topic));
requireValue(Array.isArray(bank17) && bank17.length === 12, "Objective 1.7 protected Sweep bank must contain exactly 12 questions.");
requireValue(bank17[0]?.id === "CV0004-1.7-R001", "Objective 1.7 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson18.schemaVersion === 1 && lesson18.certification === "cloud-plus" && lesson18.examCode === "CV0-004", "Objective 1.8 metadata must match Cloud+ CV0-004.");
requireValue(lesson18.world === "1" && lesson18.objective === "1.8", "Objective 1.8 route metadata must match Chapter 1.");
requireValue(lesson18.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson18, "miniCheck"), "Objective 1.8 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections18 = ["what-you-are-learning", "maestro-focus", "billing-models", "resource-metering", "tagging", "rightsizing", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds18 = (lesson18.sections || []).map(section => section.id);
requireValue(sectionIds18.length === new Set(sectionIds18).size, "Objective 1.8 section IDs must be unique.");
expectedSections18.forEach(id => requireValue(sectionIds18.includes(id), "Objective 1.8 is missing section: " + id));
const requiredTopics18 = ["Billing Models", "Dedicated Host", "Reserved Resources", "Pay-As-You-Go", "Spot Instance", "Resource Metering", "Tagging", "Rightsizing"];
const lessonText18 = JSON.stringify(lesson18);
requiredTopics18.forEach(topic => requireValue(lessonText18.includes(topic), "Objective 1.8 is missing required topic: " + topic));
requireValue(Array.isArray(bank18) && bank18.length === 8, "Objective 1.8 protected Sweep bank must contain exactly 8 questions.");
requireValue(bank18[0]?.id === "CV0004-1.8-R001", "Objective 1.8 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson19.schemaVersion === 1 && lesson19.certification === "cloud-plus" && lesson19.examCode === "CV0-004", "Objective 1.9 metadata must match Cloud+ CV0-004.");
requireValue(lesson19.world === "1" && lesson19.objective === "1.9", "Objective 1.9 route metadata must match Chapter 1.");
requireValue(lesson19.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson19, "miniCheck"), "Objective 1.9 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections19 = ["what-you-are-learning", "maestro-focus", "types", "deployment-options", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds19 = (lesson19.sections || []).map(section => section.id);
requireValue(sectionIds19.length === new Set(sectionIds19).size, "Objective 1.9 section IDs must be unique.");
expectedSections19.forEach(id => requireValue(sectionIds19.includes(id), "Objective 1.9 is missing section: " + id));
const requiredTopics19 = ["Types", "Relational Databases", "Non-Relational Databases", "Deployment Options", "Self-Managed Databases", "Provider-Managed Databases"];
const lessonText19 = JSON.stringify(lesson19);
requiredTopics19.forEach(topic => requireValue(lessonText19.includes(topic), "Objective 1.9 is missing required topic: " + topic));
requireValue(Array.isArray(bank19) && bank19.length === 6, "Objective 1.9 protected Sweep bank must contain exactly 6 questions.");
requireValue(bank19[0]?.id === "CV0004-1.9-R001", "Objective 1.9 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson110.schemaVersion === 1 && lesson110.certification === "cloud-plus" && lesson110.examCode === "CV0-004", "Objective 1.10 metadata must match Cloud+ CV0-004.");
requireValue(lesson110.world === "1" && lesson110.objective === "1.10", "Objective 1.10 route metadata must match Chapter 1.");
requireValue(lesson110.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson110, "miniCheck"), "Objective 1.10 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections110 = ["what-you-are-learning", "maestro-focus", "compute-resources", "orchestration", "workflow", "network", "storage", "managed-services", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds110 = (lesson110.sections || []).map(section => section.id);
requireValue(sectionIds110.length === new Set(sectionIds110).size, "Objective 1.10 section IDs must be unique.");
expectedSections110.forEach(id => requireValue(sectionIds110.includes(id), "Objective 1.10 is missing section: " + id));
const requiredTopics110 = ["Compute Resources", "Virtual Machine (VM)", "Container", "Serverless", "Orchestration", "Workflow", "Network", "Latency", "Network throughput", "Storage", "Input/Output Operations per Second (IOPS)", "Storage throughput", "Managed Services"];
const lessonText110 = JSON.stringify(lesson110);
requiredTopics110.forEach(topic => requireValue(lessonText110.includes(topic), "Objective 1.10 is missing required topic: " + topic));
requireValue(Array.isArray(bank110) && bank110.length === 13, "Objective 1.10 protected Sweep bank must contain exactly 13 questions.");
requireValue(bank110[0]?.id === "CV0004-1.10-R001", "Objective 1.10 GSA Mini Check source must remain the existing first bank question.");
requireValue(lesson111.schemaVersion === 1 && lesson111.certification === "cloud-plus" && lesson111.examCode === "CV0-004", "Objective 1.11 metadata must match Cloud+ CV0-004.");
requireValue(lesson111.world === "1" && lesson111.objective === "1.11", "Objective 1.11 route metadata must match Chapter 1.");
requireValue(lesson111.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson111, "miniCheck"), "Objective 1.11 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections111 = ["what-you-are-learning", "maestro-focus", "machine-learning-and-artificial-intelligence", "internet-of-things", "recognition-cues", "exam-trap", "maestro-recognition-sheet"];
const sectionIds111 = (lesson111.sections || []).map(section => section.id);
requireValue(sectionIds111.length === new Set(sectionIds111).size, "Objective 1.11 section IDs must be unique.");
expectedSections111.forEach(id => requireValue(sectionIds111.includes(id), "Objective 1.11 is missing section: " + id));
const requiredTopics111 = ["Machine Learning and Artificial Intelligence (AI)", "Text Recognition", "Text Translation", "Visual Recognition", "Sentiment Analysis", "Voice-to-Text", "Text-to-Voice", "Generative AI", "Internet of Things (IoT)", "Sensors", "Gateways", "Communication", "Transmission Protocols"];
const lessonText111 = JSON.stringify(lesson111);
requiredTopics111.forEach(topic => requireValue(lessonText111.includes(topic), "Objective 1.11 is missing required topic: " + topic));
requireValue(Array.isArray(bank111) && bank111.length === 13, "Objective 1.11 protected Sweep bank must contain exactly 13 questions.");
requireValue(bank111[0]?.id === "CV0004-1.11-R001", "Objective 1.11 GSA Mini Check source must remain the existing first bank question.");
requireValue(campaign.includes('href="cloud-plus-world1-objectives.html" class="world world1 unlocked"'), "Cloud+ Campaign Map Chapter 1 must route directly to the Objective Hub.");
requireValue(!fs.existsSync(legacyWorld1Path), "Legacy Cloud+ Chapter 1 PRESS START page must be retired after Objective Hub migration.");
requireValue(![campaign, cloudEntry, hub, manualPage, manualScript, quizPage, quizScript].some(source => source.includes("cloud-plus-world1.html")), "Active Cloud+ navigation still references the legacy Chapter 1 landing page.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.1"), "Chapter 1 Objective Hub is missing the Objective 1.1 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.1"), "Chapter 1 Objective Hub is missing the direct Objective 1.1 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.2"), "Chapter 1 Objective Hub is missing the Objective 1.2 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.2"), "Chapter 1 Objective Hub is missing the direct Objective 1.2 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.3"), "Chapter 1 Objective Hub is missing the Objective 1.3 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.3"), "Chapter 1 Objective Hub is missing the direct Objective 1.3 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.4"), "Chapter 1 Objective Hub is missing the Objective 1.4 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.4"), "Chapter 1 Objective Hub is missing the direct Objective 1.4 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.5"), "Chapter 1 Objective Hub is missing the Objective 1.5 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.5"), "Chapter 1 Objective Hub is missing the direct Objective 1.5 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.6"), "Chapter 1 Objective Hub is missing the Objective 1.6 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.6"), "Chapter 1 Objective Hub is missing the direct Objective 1.6 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.7"), "Chapter 1 Objective Hub is missing the Objective 1.7 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.7"), "Chapter 1 Objective Hub is missing the direct Objective 1.7 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.8"), "Chapter 1 Objective Hub is missing the Objective 1.8 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.8"), "Chapter 1 Objective Hub is missing the direct Objective 1.8 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.9"), "Chapter 1 Objective Hub is missing the Objective 1.9 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.9"), "Chapter 1 Objective Hub is missing the direct Objective 1.9 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.10"), "Chapter 1 Objective Hub is missing the Objective 1.10 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.10"), "Chapter 1 Objective Hub is missing the direct Objective 1.10 Sweep action.");
requireValue(hub.includes("cloud-plus-field-manual.html?world=1&amp;objective=1.11"), "Chapter 1 Objective Hub is missing the Objective 1.11 Field Manual action.");
requireValue(hub.includes("cloud-plus-quiz.html?world=1&amp;objective=1.11"), "Chapter 1 Objective Hub is missing the direct Objective 1.11 Sweep action.");
requireValue(hub.includes('href="cloud-plus-campaign.html" class="back-link">← Return to Campaign Map</a>'), "Chapter 1 Objective Hub must return to the Cloud+ Campaign Map.");
requireValue(manualScript.includes('elements.returnLink.href = "cloud-plus-world" + world + "-objectives.html";'), "Cloud+ Field Manual must return to its Chapter Objective Hub.");
requireValue(quizScript.includes('return { href: `cloud-plus-world${world}-objectives.html`, label: `Return to Chapter ${world}` };'), "Cloud+ Objective Sweep must return to its Chapter Objective Hub.");
requireValue(cloudEntry.includes('href="index.html?entered=1" class="link-btn">🏰 Return to Academy 🏰</a>'), "Cloud+ Return to Academy must open the internal Select a Game hub.");
requireValue(manualPage.includes('id="cloudManualNavigation"') && manualScript.includes("function renderNavigation()"), "Cloud+ Field Manual is missing lesson navigation.");
requireValue(manualPage.includes("confirm the objective concepts") && manualScript.includes("Review the objective recognition cues"), "Cloud+ Mini Check guidance must remain objective-neutral.");
requireValue(manualScript.includes('const MANUAL_KEY = "hydra-cloud-plus-field-manual-v1"'), "Cloud+ Field Manual completion storage must remain isolated.");
requireValue(manualScript.includes('"json/cloud-plus/world" + world + "/" + objective + "-hatchling.json"'), "Cloud+ Mini Check must use the existing GSA bank at runtime.");
requireValue(quizPage.includes('<script src="cloud-plus-quiz.js"></script>'), "Cloud+ quiz page no longer loads the existing quiz engine.");
requireValue(quizScript.includes('saveObjectiveProgress({ objective, world'), "Cloud+ Objective Sweep progress integration is missing.");
[
  "Security+ is the canonical learner-flow model",
  "Academy Gate = external front door",
  "Select a Game = internal Academy hub",
  "Training Grounds",
  "Campaign Map",
  "PRESS START",
  "Field Manual Return to Chapter",
  "Objective Hub Return",
  "Certification Return to Academy",
  "Academy Hub"
].forEach(rule => requireValue(navigationStandard.includes(rule), "GSA navigation standard is missing required rule: " + rule));

if (errors.length) {
  console.error("Cloud+ Field Manual validation: FAIL");
  errors.forEach(error => console.error("- " + error));
  process.exitCode = 1;
} else {
  console.log("Cloud+ Field Manual validation: PASS");
  console.log("- Objective 1.1 official topics: 5 of 5 (100%)");
  console.log("- Objective 1.1 lesson architecture and 12-section navigator: PASS");
  console.log("- GSA-owned Mini Check source; no new question authored: PASS");
  console.log("- Direct Objective Sweep integration and isolated Manual completion: PASS");
  console.log("- Protected Objective 1.1 Sweep bank remains 6 questions: PASS");
  console.log("- Objective 1.2 official/published mappings: 13 of 13 (100%)");
  console.log("- Objective 1.2 lesson architecture and 18-section navigator: PASS");
  console.log("- Protected Objective 1.2 Sweep bank remains 13 questions: PASS");
  console.log("- Objective 1.3 official/published mappings: 19 of 19 (100%)");
  console.log("- Objective 1.3 lesson architecture and 9-section navigator: PASS");
  console.log("- Protected Objective 1.3 Sweep bank remains 19 questions: PASS");
  console.log("- Objective 1.4 official/published mappings: 14 of 14 (100%)");
  console.log("- Objective 1.4 lesson architecture and 10-section navigator: PASS");
  console.log("- Protected Objective 1.4 Sweep bank remains 14 questions: PASS");
  console.log("- Objective 1.5 official/published mappings: 5 of 5 (100%)");
  console.log("- Objective 1.5 lesson architecture and 10-section navigator: PASS");
  console.log("- Protected Objective 1.5 Sweep bank remains 5 questions: PASS");
  console.log("- Objective 1.6 official/published mappings: 8 of 8 (100%)");
  console.log("- Objective 1.6 lesson architecture and 10-section navigator: PASS");
  console.log("- Protected Objective 1.6 Sweep bank remains 8 questions: PASS");
  console.log("- Objective 1.7 official/published mappings: 12 of 12 (100%)");
  console.log("- Objective 1.7 lesson architecture and 12-section navigator: PASS");
  console.log("- Protected Objective 1.7 Sweep bank remains 12 questions: PASS");
  console.log("- Objective 1.8 official/published mappings: 8 of 8 (100%)");
  console.log("- Objective 1.8 lesson architecture and 9-section navigator: PASS");
  console.log("- Protected Objective 1.8 Sweep bank remains 8 questions: PASS");
  console.log("- Objective 1.9 official/published mappings: 6 of 6 (100%)");
  console.log("- Objective 1.9 lesson architecture and 7-section navigator: PASS");
  console.log("- Protected Objective 1.9 Sweep bank remains 6 questions: PASS");
  console.log("- Objective 1.10 official/published mappings: 13 of 13 (100%)");
  console.log("- Objective 1.10 lesson architecture and 11-section navigator: PASS");
  console.log("- Protected Objective 1.10 Sweep bank remains 13 questions: PASS");
  console.log("- Objective 1.11 official/published mappings: 13 of 13 (100%)");
  console.log("- Objective 1.11 lesson architecture and 7-section navigator: PASS");
  console.log("- Protected Objective 1.11 Sweep bank remains 13 questions: PASS");
}
