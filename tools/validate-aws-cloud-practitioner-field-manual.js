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
  },
  "2.1": {
    count: 9,
    hash: "2BB4436D7D522F3C9E81EDD3E9F8771E9FE269E817B67D0A1BD4702E37286124",
    firstId: "AWSCLF-2.1-R001",
    sections: ["what-you-are-learning", "maestro-focus", "shared-responsibility-model", "aws-responsibilities", "customer-responsibilities", "shared-responsibilities", "service-boundary", "amazon-ec2", "amazon-rds", "aws-lambda", "responsibility-ladder", "exam-trap", "maestro-recognition-sheet"],
    topics: ["AWS Shared Responsibility Model", "Security OF the Cloud", "Security IN the Cloud", "AWS Responsibility", "Customer Responsibility", "Shared Responsibilities", "Responsibility Boundary Moves by Service", "Amazon EC2", "Amazon RDS", "AWS Lambda"]
  },
  "2.2": {
    count: 22,
    hash: "808DB94A4A0D68F1B77D16875E958E010E553F7D431916C26F0EE2C9F393965C",
    firstId: "AWSCLF-2.2-R001",
    sections: ["what-you-are-learning", "maestro-focus", "security-governance-compliance", "cloud-security-and-logs", "aws-artifact", "compliance-requirements", "encryption", "customer-resource-security", "governance-services", "service-comparison", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Security vs. Governance vs. Compliance", "Benefits of Cloud Security", "Security Logs", "AWS Artifact", "Geographic Locations", "Industries", "AWS Services", "Encryption in Transit", "Encryption at Rest", "Amazon Inspector", "Amazon GuardDuty", "AWS Security Hub", "AWS Shield", "Amazon CloudWatch", "AWS CloudTrail", "AWS Audit Manager", "AWS Config", "Access Reports"]
  },
  "2.3": {
    count: 22,
    hash: "E1814D517BE07DF9B96C745A94011442A99EAA083602003CD24C79E0C86F6E09",
    firstId: "AWSCLF-2.3-R001",
    sections: ["what-you-are-learning", "maestro-focus", "aws-iam", "authentication-and-authorization", "users-groups-policies", "least-privilege", "iam-roles", "identity-center-and-federation", "authentication-methods", "credential-management", "credential-storage", "root-user", "exam-trap", "maestro-recognition-sheet"],
    topics: ["AWS Identity and Access Management (IAM)", "Root User", "Least Privilege", "AWS IAM Identity Center", "Access Keys", "Password Policies", "Credential Storage", "AWS Secrets Manager", "AWS Systems Manager", "Multi-Factor Authentication (MFA)", "Cross-Account IAM Role", "IAM User", "IAM Group", "Custom Policy", "Managed Policy", "Root-User-Only", "Federated Identity"]
  },
  "2.4": {
    count: 13,
    hash: "655A5326025446DEBB204E260C5CC5CAE8CC45CAADAFFE202BF33A6229369D28",
    firstId: "AWSCLF-2.4-R001",
    sections: ["what-you-are-learning", "maestro-focus", "security-capabilities", "security-services", "aws-marketplace", "security-documentation", "trusted-advisor", "toolbox-comparison", "exam-trap", "maestro-recognition-sheet", "world-two-connection"],
    topics: ["AWS Security Capabilities", "AWS Security Documentation", "AWS WAF", "AWS Firewall Manager", "AWS Shield", "Amazon GuardDuty", "AWS Marketplace", "AWS Knowledge Center", "AWS Security Center", "AWS Security Blog", "AWS Trusted Advisor"]
  },
  "3.1": {
    count: 12,
    hash: "DF5030BCCFBCFE64B32967DE7897555505DBC1A54F2BDA2FF213AD4F7E6FEA10",
    firstId: "AWSCLF-3.1-R001",
    sections: ["what-you-are-learning", "maestro-focus", "provisioning-and-operating", "management-console", "aws-cli", "apis", "aws-sdks", "access-method-exam-trap", "infrastructure-as-code", "aws-cloudformation", "one-time-operations", "repeatable-processes", "one-time-vs-repeatable", "cloud-deployment", "on-premises-deployment", "hybrid-deployment", "deployment-model-exam-trap", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Provisioning", "AWS Management Console", "AWS Command Line Interface", "AWS Service API", "AWS SDKs", "Infrastructure as Code", "AWS CloudFormation", "One-Time Operations", "Repeatable Processes", "Cloud Deployment", "Hybrid Deployment", "On-Premises Deployment"]
  },
  "3.2": {
    count: 13,
    hash: "6E569849482E8ACDBD2F3B867E6B488FC8C56D96FB584D124E3D7D416A883EC0",
    firstId: "AWSCLF-3.2-R001",
    sections: ["what-you-are-learning", "maestro-focus", "aws-regions", "availability-zones", "high-availability", "multiple-regions", "data-sovereignty", "edge-locations", "amazon-cloudfront", "infrastructure-comparison", "scenario-recognition", "exam-trap", "maestro-recognition-sheet"],
    topics: ["AWS Regions", "Availability Zones", "Edge Locations", "High Availability", "Multiple Regions", "Disaster Recovery", "Business Continuity", "Latency", "Data Sovereignty", "Amazon CloudFront"]
  },
  "3.3": {
    count: 12,
    hash: "96BE00BDAC803A18394D327044BB8BC03A8116F2F182C76DC423C8A501547A03",
    firstId: "AWSCLF-3.3-R001",
    sections: ["what-you-are-learning", "maestro-focus", "amazon-ec2", "ec2-instance-types", "containers", "serverless-compute", "lambda-vs-fargate", "auto-scaling", "load-balancers", "scaling-vs-balancing", "scenario-recognition", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Amazon EC2", "General Purpose", "Compute Optimized", "Memory Optimized", "Storage Optimized", "Amazon ECS", "Amazon EKS", "AWS Lambda", "AWS Fargate", "Auto Scaling", "Load Balancers"]
  },
  "3.4": {
    count: 13,
    hash: "95EE365B68772813EE18D76E652A16FCFEB1BC4D9F41F0FA8967877446EF8782",
    firstId: "AWSCLF-3.4-R001",
    sections: ["what-you-are-learning", "maestro-focus", "ec2-vs-managed", "relational-databases", "rds-vs-aurora", "nosql-and-dynamodb", "elasticache", "database-types", "database-migration", "migration-sequence", "scenario-recognition", "exam-trap", "maestro-recognition-sheet", "world-three-connection"],
    topics: ["EC2-Hosted", "AWS-Managed Databases", "Amazon RDS", "Amazon Aurora", "NoSQL", "Amazon DynamoDB", "Amazon ElastiCache", "AWS Database Migration Service", "AWS Schema Conversion Tool"]
  },
  "3.5": {
    world: "4",
    count: 12,
    hash: "61605681B12F772087DAECF3691E77BE5E7B4373F3C3132B7D0433E0AC2A6DD9",
    firstId: "AWSCLF-3.5-R001",
    sections: ["what-you-are-learning", "maestro-focus", "amazon-vpc", "subnets", "public-private-placement", "gateways", "security-groups", "network-acls", "security-group-vs-nacl", "amazon-inspector", "inspector-vs-security-group", "amazon-route-53", "route53-exam-trap", "connecting-to-aws", "aws-vpn", "aws-direct-connect", "vpn-vs-direct-connect", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Amazon VPC", "Subnets", "Gateways", "Security Groups", "Network ACLs", "Amazon Inspector", "Amazon Route 53", "AWS VPN", "AWS Direct Connect"]
  },
  "3.6": {
    world: "4",
    count: 12,
    hash: "EEB5EDF0DDA8650FCF190112D38D792C711DED9345BE0467A3D5ACF65302D077",
    firstId: "AWSCLF-3.6-R001",
    sections: ["what-you-are-learning", "maestro-focus", "storage-models", "amazon-s3", "s3-storage-classes", "amazon-ebs", "instance-store", "ebs-vs-instance-store", "file-storage", "storage-gateway", "lifecycle-policies", "aws-backup", "scenario-recognition", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Object Storage", "Amazon S3", "S3 Storage Classes", "S3 Intelligent-Tiering", "Block Storage", "Amazon EBS", "Instance Store", "File Storage", "Amazon EFS", "Amazon FSx", "AWS Storage Gateway", "Lifecycle Policies", "AWS Backup"]
  },
  "3.7": {
    world: "4",
    count: 10,
    hash: "677EB5B85CDC5F278FDD960C12F37607EABFDACFC13A202AA95D3A0BF572C8EF",
    firstId: "AWSCLF-3.7-R001",
    sections: ["what-you-are-learning", "maestro-focus", "ai-vs-analytics", "sagemaker-ai", "amazon-lex", "amazon-kendra", "amazon-athena", "amazon-kinesis", "aws-glue", "amazon-quicksight", "analytics-comparison", "scenario-recognition", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Amazon SageMaker AI", "Amazon Lex", "Amazon Kendra", "Amazon Athena", "Amazon Kinesis", "AWS Glue", "Amazon QuickSight"]
  },
  "3.8": {
    world: "4",
    count: 22,
    hash: "748D6FE95127C230503C4105843046AF45DBF77BE29F12D5C083F51C6DF2A66D",
    firstId: "AWSCLF-3.8-R001",
    sections: ["what-you-are-learning", "maestro-focus", "application-integration", "integration-comparison", "business-applications", "aws-support", "developer-tools", "end-user-computing", "end-user-computing-comparison", "frontend-web-mobile", "iot-core", "scenario-recognition", "exam-trap", "maestro-recognition-sheet", "world-four-connection"],
    topics: ["Amazon EventBridge", "Amazon SNS", "Amazon SQS", "Amazon Connect", "Amazon SES", "AWS Support", "AWS CodeBuild", "AWS CodePipeline", "AWS X-Ray", "Amazon AppStream 2.0", "Amazon WorkSpaces", "Amazon WorkSpaces Secure Browser", "AWS Amplify", "AWS AppSync", "AWS IoT Core"]
  }
};

for (const [objective, expected] of Object.entries(objectives)) {
  const lesson = json(`json/aws-cloud-practitioner/field-manual/${objective}.json`);
  const expectedWorld = expected.world || objective.split(".")[0];
  const bankPath = path.join(root, `json/aws-cloud-practitioner/world${expectedWorld}/${objective}-hatchling.json`);
  const bankBytes = fs.readFileSync(bankPath);
  const bank = JSON.parse(bankBytes.toString("utf8"));
  const hash = crypto.createHash("sha256").update(bankBytes).digest("hex").toUpperCase();
  const sectionIds = (lesson.sections || []).map(section => section.id);
  const lessonText = JSON.stringify(lesson).toLowerCase();

  requireValue(lesson.schemaVersion === 1, `${objective} schemaVersion must be 1.`);
  requireValue(lesson.certification === "aws-cloud-practitioner" && lesson.examCode === "CLF-C02", `${objective} metadata must match AWS Cloud Practitioner CLF-C02.`);
  requireValue(lesson.world === expectedWorld && lesson.objective === objective, `${objective} route metadata must match World ${expectedWorld}.`);
  requireValue(lesson.miniCheckSource === "objective-sweep-bank", `${objective} must use the GSA-owned Mini Check source.`);
  requireValue(!Object.prototype.hasOwnProperty.call(lesson, "miniCheck"), `${objective} must not author a Mini Check question.`);
  requireValue(sectionIds.length === new Set(sectionIds).size, `${objective} section IDs must be unique.`);
  expected.sections.forEach(id => requireValue(sectionIds.includes(id), `${objective} is missing section: ${id}`));
  expected.topics.forEach(topic => requireValue(lessonText.includes(topic.toLowerCase()), `${objective} is missing required topic: ${topic}`));
  requireValue(Array.isArray(bank) && bank.length === expected.count, `${objective} protected Sweep bank must contain exactly ${expected.count} questions.`);
  requireValue(bank[0]?.id === expected.firstId, `${objective} Mini Check source must remain the first protected Sweep question.`);
  requireValue(hash === expected.hash, `${objective} protected Sweep bank bytes changed.`);
}

const hubs = {
  "1": read("aws-cloud-practitioner-world1-objectives.html"),
  "2": read("aws-cloud-practitioner-world2-objectives.html"),
  "3": read("aws-cloud-practitioner-world3-objectives.html"),
  "4": read("aws-cloud-practitioner-world4-objectives.html")
};
const campaign = read("aws-cloud-practitioner-campaign.html");
const manualPage = read("aws-cloud-practitioner-field-manual.html");
const manualScript = read("aws-cloud-practitioner-field-manual.js");
const hubScript = read("aws-cloud-practitioner-objective-hub.js");
const quizScript = read("aws-cloud-practitioner-quiz.js");

requireValue(campaign.includes('href="aws-cloud-practitioner-world1-objectives.html"'), "Campaign World 1 must route to its Objective Hub.");
requireValue(campaign.includes('href="aws-cloud-practitioner-world2-objectives.html"'), "Campaign World 2 must route to its Objective Hub.");
requireValue(campaign.includes('href="aws-cloud-practitioner-world3-objectives.html"'), "Campaign World 3 must route to its Objective Hub.");
requireValue(campaign.includes('href="aws-cloud-practitioner-world4-objectives.html"'), "Campaign World 4 must route to its Objective Hub.");
for (const [objective, expected] of Object.entries(objectives)) {
  const world = expected.world || objective.split(".")[0];
  const hub = hubs[world];
  requireValue(hub.includes(`aws-cloud-practitioner-field-manual.html?world=${world}&amp;objective=${objective}`), `World ${world} Hub is missing the ${objective} Field Manual action.`);
  requireValue(hub.includes(`aws-cloud-practitioner-quiz.html?world=${world}&amp;objective=${objective}`), `${objective} Sweep route changed unexpectedly.`);
  requireValue(hub.includes(`id="objective${objective.replace(".", "")}ManualStatus"`) && hub.includes(`id="objective${objective.replace(".", "")}SweepStatus"`), `${objective} Manual and Sweep statuses must remain separate.`);
}
for (const [world, hub] of Object.entries(hubs)) {
  requireValue(hub.includes('href="security-plus-field-manual.css"') && hub.includes('src="aws-cloud-practitioner-objective-hub.js"'), `World ${world} Hub must use the established Field Manual card presentation and status engine.`);
  requireValue(hub.includes('href="aws-cloud-practitioner-campaign.html" class="back-link">← Return to Campaign Map</a>'), `World ${world} Hub must return to the AWS Campaign Map.`);
}
requireValue(manualPage.includes('id="awsManualNavigation"') && manualScript.includes("function renderNavigation()"), "The AWS Field Manual is missing lesson navigation.");
requireValue(manualScript.includes('const MANUAL_KEY = "hydra-aws-cloud-practitioner-field-manual-v1"'), "Manual completion storage must remain isolated.");
requireValue(hubScript.includes('const PROGRESS_KEY = "hydra-aws-cloud-practitioner-progress-v1"'), "The Objective Hub must read the existing Sweep progress key.");
requireValue(manualScript.includes('"json/aws-cloud-practitioner/world" + world + "/" + objective + "-hatchling.json"'), "Mini Checks must load the existing protected Sweep banks.");
requireValue(manualScript.includes('window.location.assign("aws-cloud-practitioner-quiz.html?world="'), "Completing a manual must continue to the existing Objective Sweep.");
requireValue(manualScript.includes('elements.returnLink.href = "aws-cloud-practitioner-world" + world + "-objectives.html"'), "Field Manuals must return to their Objective Hub.");
requireValue(manualScript.includes('world === "1" && /^1\\.[1-4]$/.test(objective)'), "The Field Manual route gate must include only published World 1 objectives 1.1-1.4.");
requireValue(manualScript.includes('world === "2" && /^2\\.[1-4]$/.test(objective)'), "The Field Manual route gate must include only published World 2 objectives 2.1-2.4.");
requireValue(manualScript.includes('world === "3" && /^3\\.[1-4]$/.test(objective)'), "The Field Manual route gate must include only published World 3 objectives 3.1-3.4.");
requireValue(manualScript.includes('world === "4" && /^3\\.[5-8]$/.test(objective)'), "The Field Manual route gate must include only published World 4 objectives 3.5-3.8.");
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
