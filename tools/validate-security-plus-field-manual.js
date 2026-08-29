"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const fieldManualRoot = path.join(root, "json", "security-plus", "field-manual");
const world1HubPath = path.join(root, "security-plus-world1-objectives.html");
const world2HubPath = path.join(root, "security-plus-world2-objectives.html");
const world3HubPath = path.join(root, "security-plus-world3-objectives.html");
const world4HubPath = path.join(root, "security-plus-world4-objectives.html");
const world5HubPath = path.join(root, "security-plus-world5-objectives.html");
const campaignPath = path.join(root, "security-plus-campaign.html");
const quizPath = path.join(root, "security-plus-quiz.html");
const manualPagePath = path.join(root, "security-plus-field-manual.html");
const manualScriptPath = path.join(root, "security-plus-field-manual.js");

const errors = [];
const requireValue = (condition, message) => {
  if (!condition) errors.push(message);
};

const lessonDefinitions = {
  "1.1": {
    expectedQuestionCount: 12,
    sectionIds: [
      "what-you-are-learning",
      "category-versus-type",
      "security-control-categories",
      "security-control-types",
      "recognition-cues",
      "exam-trap"
    ],
    entryTitles: [
      "Technical",
      "Managerial",
      "Operational",
      "Physical",
      "Preventive",
      "Deterrent",
      "Detective",
      "Corrective",
      "Compensating",
      "Directive"
    ],
    miniCheckPrompt: "A company installs a security camera to identify unauthorized entry after hours.",
    miniCheckAnswers: {
      category: "Physical",
      type: "Detective"
    }
  },
  "1.2": {
    expectedQuestionCount: 36,
    sectionIds: [
      "what-you-are-learning",
      "cia-triad",
      "non-repudiation",
      "aaa",
      "authorization-models",
      "gap-analysis",
      "zero-trust",
      "zero-trust-control-plane",
      "zero-trust-data-plane",
      "physical-security",
      "sensors",
      "deception-disruption",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Confidentiality",
      "Integrity",
      "Availability",
      "Authentication",
      "Authorization",
      "Accounting",
      "Adaptive Identity",
      "Threat Scope Reduction",
      "Policy-Driven Access Control",
      "Policy Engine",
      "Policy Administrator",
      "Implicit Trust Zones",
      "Subject/System",
      "Policy Enforcement Point",
      "Zero Trust Flow",
      "Infrared",
      "Pressure",
      "Microwave",
      "Ultrasonic",
      "Honeypot",
      "Honeynet",
      "Honeyfile",
      "Honeytoken"
    ],
    miniCheckPrompt: "A Zero Trust access request is evaluated by one component that decides whether access should be allowed. The final decision is then applied at the access gate.",
    miniCheckAnswers: {
      "decision-component": "Policy Engine",
      "enforcement-component": "Policy Enforcement Point"
    }
  },
  "1.3": {
    expectedQuestionCount: 21,
    sectionIds: [
      "what-you-are-learning",
      "business-processes",
      "approval-process",
      "ownership-and-stakeholders",
      "impact-analysis-and-testing",
      "backout-plan",
      "maintenance-window-and-sop",
      "technical-implications",
      "access-rules-and-restrictions",
      "downtime-and-restarts",
      "legacy-applications-and-dependencies",
      "documentation-updates",
      "version-control",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Approval Process",
      "Ownership",
      "Stakeholders",
      "Impact Analysis",
      "Test Results",
      "Maintenance Window",
      "Standard Operating Procedure",
      "Allow List",
      "Deny List",
      "Restricted Activities",
      "Downtime",
      "Service Restart",
      "Application Restart",
      "Legacy Applications",
      "Dependencies",
      "Updating Diagrams",
      "Updating Policies and Procedures"
    ],
    miniCheckPrompt: "A team is preparing a firewall rule change. Before implementation, it identifies the applications and services that depend on the current rule. It also documents how to restore the previous configuration if the new rule disrupts production.",
    miniCheckAnswers: {
      "planning-activity": "Impact analysis",
      "recovery-safeguard": "Backout plan"
    }
  },
  "1.4": {
    expectedQuestionCount: 42,
    sectionIds: [
      "what-you-are-learning",
      "public-key-infrastructure",
      "encryption",
      "encryption-levels",
      "transport-and-encryption-types",
      "key-exchange-algorithms-length",
      "cryptographic-tools",
      "obfuscation",
      "hashing-and-salting",
      "signatures-and-key-stretching",
      "blockchain-and-public-ledger",
      "certificates",
      "certificate-authorities-and-status",
      "certificate-trust-and-requests",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Public Key",
      "Private Key",
      "Key Escrow",
      "Full-Disk Encryption",
      "Partition Encryption",
      "File Encryption",
      "Volume Encryption",
      "Database Encryption",
      "Record Encryption",
      "Transport and Communication Encryption",
      "Symmetric Encryption",
      "Asymmetric Encryption",
      "Key Exchange",
      "Algorithms",
      "Key Length",
      "Trusted Platform Module (TPM)",
      "Hardware Security Module (HSM)",
      "Key Management System",
      "Secure Enclave",
      "Steganography",
      "Tokenization",
      "Data Masking",
      "Hashing",
      "Salting",
      "Digital Signatures",
      "Key Stretching",
      "Blockchain",
      "Open Public Ledger",
      "Certificate Authority (CA)",
      "Certificate Revocation List (CRL)",
      "Online Certificate Status Protocol (OCSP)",
      "Self-Signed Certificate",
      "Third-Party Certificate",
      "Root of Trust",
      "Certificate Signing Request (CSR)",
      "Wildcard Certificate"
    ],
    miniCheckPrompt: "A software publisher sends a signed release to customers over an untrusted network. Customers must verify who signed the release and whether it was altered, while the release must remain confidential as it travels.",
    miniCheckAnswers: {
      "origin-and-integrity": "Digital signature",
      "in-transit-confidentiality": "Transport and communication encryption"
    }
  },
  "2.1": {
    world: "2",
    expectedQuestionCount: 22,
    sectionIds: [
      "what-you-are-learning",
      "threat-actors",
      "attributes-of-threat-actors",
      "internal-versus-external",
      "resources-and-funding",
      "sophistication-and-capability",
      "motivations",
      "data-exfiltration-and-espionage",
      "service-disruption-and-blackmail",
      "financial-gain-and-beliefs",
      "ethical-and-revenge",
      "disruption-chaos-and-war",
      "actor-and-motivation-relationships",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Nation-State",
      "Unskilled Attacker",
      "Hacktivist",
      "Insider Threat",
      "Organized Crime",
      "Shadow IT",
      "Internal vs. External",
      "Resources and Funding",
      "Level of Sophistication and Capability",
      "Data Exfiltration",
      "Espionage",
      "Service Disruption",
      "Blackmail",
      "Financial Gain",
      "Philosophical or Political Beliefs",
      "Ethical",
      "Revenge",
      "Disruption / Chaos",
      "War"
    ],
    miniCheckPrompt: "After being denied a promotion, an employee uses existing authorized access to delete important company records as retaliation.",
    miniCheckAnswers: {
      "threat-actor": "Insider threat",
      "primary-motivation": "Revenge"
    }
  },
  "2.2": {
    world: "2",
    expectedQuestionCount: 32,
    sectionIds: [
      "what-you-are-learning",
      "message-based-threat-vectors",
      "image-based-threats",
      "file-based-threats",
      "voice-call",
      "removable-devices",
      "vulnerable-software",
      "client-based-and-agentless",
      "unsupported-systems-and-applications",
      "unsecure-networks",
      "open-service-ports",
      "default-credentials",
      "supply-chain",
      "human-vectors-and-social-engineering",
      "phishing-vishing-and-smishing",
      "vector-versus-technique",
      "misinformation-and-disinformation",
      "impersonation-bec-and-pretexting",
      "watering-hole-brand-impersonation-and-typosquatting",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Email",
      "Short Message Service (SMS)",
      "Instant Messaging (IM)",
      "Image-Based",
      "File-Based",
      "Voice Call",
      "Removable Device",
      "Vulnerable Software",
      "Client-Based",
      "Agentless",
      "Unsupported Systems and Applications",
      "Wireless",
      "Wired",
      "Bluetooth",
      "Open Service Ports",
      "Default Credentials",
      "Managed Service Providers (MSPs)",
      "Vendors",
      "Suppliers",
      "Human Vectors and Social Engineering",
      "Phishing",
      "Vishing",
      "Smishing",
      "Misinformation",
      "Disinformation",
      "Impersonation",
      "Business Email Compromise (BEC)",
      "Pretexting",
      "Watering Hole",
      "Brand Impersonation",
      "Typosquatting"
    ],
    miniCheckPrompt: "An attacker sends a fraudulent text message containing a link to a fake sign-in page.",
    miniCheckAnswers: {
      "delivery-vector": "SMS",
      "social-engineering-technique": "Smishing"
    },
    blueprintMappings: {
      "Message-based": "message-based-threat-vectors",
      "Message-based > Email": "message-based-threat-vectors",
      "Message-based > Short Message Service (SMS)": "message-based-threat-vectors",
      "Message-based > Instant messaging (IM)": "message-based-threat-vectors",
      "Image-based": "image-based-threats",
      "File-based": "file-based-threats",
      "Voice call": "voice-call",
      "Removable device": "removable-devices",
      "Vulnerable software": "vulnerable-software",
      "Vulnerable software > Client-based vs. agentless": "client-based-and-agentless",
      "Unsupported systems and applications": "unsupported-systems-and-applications",
      "Unsecure networks": "unsecure-networks",
      "Unsecure networks > Wireless": "unsecure-networks",
      "Unsecure networks > Wired": "unsecure-networks",
      "Unsecure networks > Bluetooth": "unsecure-networks",
      "Open service ports": "open-service-ports",
      "Default credentials": "default-credentials",
      "Supply chain": "supply-chain",
      "Supply chain > Managed service providers (MSPs)": "supply-chain",
      "Supply chain > Vendors": "supply-chain",
      "Supply chain > Suppliers": "supply-chain",
      "Human vectors/social engineering": "human-vectors-and-social-engineering",
      "Human vectors/social engineering > Phishing": "phishing-vishing-and-smishing",
      "Human vectors/social engineering > Vishing": "phishing-vishing-and-smishing",
      "Human vectors/social engineering > Smishing": "phishing-vishing-and-smishing",
      "Human vectors/social engineering > Misinformation/disinformation": "misinformation-and-disinformation",
      "Human vectors/social engineering > Impersonation": "impersonation-bec-and-pretexting",
      "Human vectors/social engineering > Business email compromise": "impersonation-bec-and-pretexting",
      "Human vectors/social engineering > Pretexting": "impersonation-bec-and-pretexting",
      "Human vectors/social engineering > Watering hole": "watering-hole-brand-impersonation-and-typosquatting",
      "Human vectors/social engineering > Brand impersonation": "watering-hole-brand-impersonation-and-typosquatting",
      "Human vectors/social engineering > Typosquatting": "watering-hole-brand-impersonation-and-typosquatting"
    }
  },
  "2.3": {
    world: "2",
    expectedQuestionCount: 29,
    sectionIds: [
      "what-you-are-learning",
      "application-vulnerabilities",
      "memory-injection-and-buffer-overflow",
      "race-conditions-and-toc-tou",
      "malicious-updates",
      "operating-system-based-vulnerabilities",
      "web-based-vulnerabilities",
      "sqli-and-xss",
      "hardware-vulnerabilities",
      "end-of-life-and-legacy",
      "virtualization-vulnerabilities",
      "cloud-specific-vulnerabilities",
      "supply-chain-vulnerabilities",
      "cryptographic-vulnerabilities",
      "misconfiguration",
      "mobile-device-vulnerabilities",
      "zero-day",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Memory Injection",
      "Buffer Overflow",
      "Race Condition",
      "Time-of-Check (TOC)",
      "Time-of-Use (TOU)",
      "TOC/TOU Vulnerability",
      "Malicious Update",
      "Operating System-Based",
      "Structured Query Language Injection (SQLi)",
      "Cross-Site Scripting (XSS)",
      "Firmware",
      "End-of-Life",
      "Legacy",
      "Virtual Machine (VM) Escape",
      "Resource Reuse",
      "Cloud-Specific",
      "Service Provider",
      "Hardware Provider",
      "Software Provider",
      "Cryptographic Vulnerabilities",
      "Misconfiguration",
      "Side Loading",
      "Jailbreaking",
      "Zero-Day"
    ],
    miniCheckPrompt: "During testing, one input changes the records returned from the application's database. In a separate test, a stored comment causes JavaScript to run in another visitor's browser.",
    miniCheckAnswers: {
      "database-vulnerability": "SQL injection (SQLi)",
      "browser-vulnerability": "Cross-site scripting (XSS)"
    },
    blueprintMappings: {
      "Application": "application-vulnerabilities",
      "Application > Memory injection": "memory-injection-and-buffer-overflow",
      "Application > Buffer overflow": "memory-injection-and-buffer-overflow",
      "Application > Race conditions": "race-conditions-and-toc-tou",
      "Application > Malicious update": "malicious-updates",
      "Application > Race conditions > Time-of-check (TOC)": "race-conditions-and-toc-tou",
      "Application > Race conditions > Time-of-use (TOU)": "race-conditions-and-toc-tou",
      "Operating system (OS)-based": "operating-system-based-vulnerabilities",
      "Web-based": "web-based-vulnerabilities",
      "Web-based > Structured Query Language injection (SQLi)": "sqli-and-xss",
      "Web-based > Cross-site scripting (XSS)": "sqli-and-xss",
      "Hardware": "hardware-vulnerabilities",
      "Hardware > Firmware": "hardware-vulnerabilities",
      "Hardware > End-of-life": "end-of-life-and-legacy",
      "Hardware > Legacy": "end-of-life-and-legacy",
      "Virtualization": "virtualization-vulnerabilities",
      "Virtualization > Virtual machine (VM) escape": "virtualization-vulnerabilities",
      "Virtualization > Resource reuse": "virtualization-vulnerabilities",
      "Cloud-specific": "cloud-specific-vulnerabilities",
      "Supply chain": "supply-chain-vulnerabilities",
      "Supply chain > Service provider": "supply-chain-vulnerabilities",
      "Supply chain > Hardware provider": "supply-chain-vulnerabilities",
      "Supply chain > Software provider": "supply-chain-vulnerabilities",
      "Cryptographic": "cryptographic-vulnerabilities",
      "Misconfiguration": "misconfiguration",
      "Mobile device": "mobile-device-vulnerabilities",
      "Mobile device > Side loading": "mobile-device-vulnerabilities",
      "Mobile device > Jailbreaking": "mobile-device-vulnerabilities",
      "Zero-day": "zero-day"
    }
  },
  "2.4": {
    world: "2",
    expectedQuestionCount: 47,
    sectionIds: [
      "what-you-are-learning",
      "malware-attacks",
      "ransomware-trojan-and-worm",
      "spyware-bloatware-and-virus",
      "keylogger-logic-bomb-and-rootkit",
      "physical-attacks",
      "network-ddos",
      "network-access-and-interception-attacks",
      "network-credential-replay-and-malicious-code",
      "application-attacks-and-memory",
      "application-replay-access-and-file-attacks",
      "cryptographic-attacks",
      "password-attacks",
      "indicators-of-malicious-activity",
      "identity-and-account-indicators",
      "blocked-content-and-impossible-travel",
      "resource-indicators",
      "logging-and-threat-intelligence-indicators",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Ransomware",
      "Trojan",
      "Worm",
      "Spyware",
      "Bloatware",
      "Virus",
      "Keylogger",
      "Logic Bomb",
      "Rootkit",
      "Physical Brute Force",
      "Radio Frequency Identification (RFID) Cloning",
      "Environmental",
      "Distributed Denial-of-Service (DDoS)",
      "Amplified DDoS",
      "Reflected DDoS",
      "Domain Name System (DNS) Attacks",
      "Wireless Attacks",
      "On-Path Attack",
      "Credential Replay",
      "Malicious Code",
      "Injection",
      "Buffer Overflow",
      "Replay",
      "Privilege Escalation",
      "Forgery",
      "Directory Traversal",
      "Downgrade Attack",
      "Collision",
      "Birthday Attack",
      "Password Spraying",
      "Password Brute Force",
      "Account Lockout",
      "Concurrent Session Usage",
      "Blocked Content",
      "Impossible Travel",
      "Resource Consumption",
      "Resource Inaccessibility",
      "Out-of-Cycle Logging",
      "Published / Documented",
      "Missing Logs"
    ],
    miniCheckPrompt: "A file server suddenly contains encrypted documents and a ransom note. In a separate alert, the same account signs in from Dallas and Tokyo fifteen minutes apart.",
    miniCheckAnswers: {
      "malware-activity": "Ransomware",
      "account-indicator": "Impossible travel"
    },
    blueprintMappings: {
      "Malware attacks": "malware-attacks",
      "Malware attacks > Ransomware": "ransomware-trojan-and-worm",
      "Malware attacks > Trojan": "ransomware-trojan-and-worm",
      "Malware attacks > Worm": "ransomware-trojan-and-worm",
      "Malware attacks > Spyware": "spyware-bloatware-and-virus",
      "Malware attacks > Bloatware": "spyware-bloatware-and-virus",
      "Malware attacks > Virus": "spyware-bloatware-and-virus",
      "Malware attacks > Keylogger": "keylogger-logic-bomb-and-rootkit",
      "Malware attacks > Logic bomb": "keylogger-logic-bomb-and-rootkit",
      "Malware attacks > Rootkit": "keylogger-logic-bomb-and-rootkit",
      "Physical attacks": "physical-attacks",
      "Physical attacks > Brute force": "physical-attacks",
      "Physical attacks > Radio frequency identification (RFID) cloning": "physical-attacks",
      "Physical attacks > Environmental": "physical-attacks",
      "Network attacks": "network-ddos",
      "Network attacks > Distributed denial-of-service (DDoS)": "network-ddos",
      "Network attacks > Domain Name System (DNS) attacks": "network-access-and-interception-attacks",
      "Network attacks > Wireless": "network-access-and-interception-attacks",
      "Network attacks > On-path": "network-access-and-interception-attacks",
      "Network attacks > Credential replay": "network-credential-replay-and-malicious-code",
      "Network attacks > Malicious code": "network-credential-replay-and-malicious-code",
      "Network attacks > Distributed denial-of-service (DDoS) > Amplified": "network-ddos",
      "Network attacks > Distributed denial-of-service (DDoS) > Reflected": "network-ddos",
      "Application attacks": "application-attacks-and-memory",
      "Application attacks > Injection": "application-attacks-and-memory",
      "Application attacks > Buffer overflow": "application-attacks-and-memory",
      "Application attacks > Replay": "application-replay-access-and-file-attacks",
      "Application attacks > Privilege escalation": "application-replay-access-and-file-attacks",
      "Application attacks > Forgery": "application-replay-access-and-file-attacks",
      "Application attacks > Directory traversal": "application-replay-access-and-file-attacks",
      "Cryptographic attacks": "cryptographic-attacks",
      "Cryptographic attacks > Downgrade": "cryptographic-attacks",
      "Cryptographic attacks > Collision": "cryptographic-attacks",
      "Cryptographic attacks > Birthday": "cryptographic-attacks",
      "Password attacks": "password-attacks",
      "Password attacks > Spraying": "password-attacks",
      "Password attacks > Brute force": "password-attacks",
      "Indicators": "indicators-of-malicious-activity",
      "Indicators > Account lockout": "identity-and-account-indicators",
      "Indicators > Concurrent session usage": "identity-and-account-indicators",
      "Indicators > Blocked content": "blocked-content-and-impossible-travel",
      "Indicators > Impossible travel": "blocked-content-and-impossible-travel",
      "Indicators > Resource consumption": "resource-indicators",
      "Indicators > Resource inaccessibility": "resource-indicators",
      "Indicators > Out-of-cycle logging": "logging-and-threat-intelligence-indicators",
      "Indicators > Published/documented": "logging-and-threat-intelligence-indicators",
      "Indicators > Missing logs": "logging-and-threat-intelligence-indicators"
    }
  },
  "2.5": {
    world: "2",
    expectedQuestionCount: 20,
    sectionIds: [
      "what-you-are-learning",
      "segmentation",
      "access-control",
      "application-allow-list",
      "isolation",
      "patching",
      "encryption",
      "monitoring",
      "least-privilege",
      "configuration-enforcement",
      "decommissioning",
      "hardening-techniques",
      "endpoint-protection",
      "host-firewall-and-hips",
      "disable-unused-access",
      "default-passwords-and-software",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Segmentation",
      "Access Control",
      "Access Control List (ACL)",
      "Permissions",
      "Application Allow List",
      "Isolation",
      "Patching",
      "Encryption",
      "Monitoring",
      "Least Privilege",
      "Configuration Enforcement",
      "Decommissioning",
      "Hardening Techniques",
      "Encryption as Hardening",
      "Endpoint Protection",
      "Host-Based Firewall",
      "Host-Based Intrusion Prevention System (HIPS)",
      "Disabling Ports and Protocols",
      "Default Password Changes",
      "Removal of Unnecessary Software"
    ],
    miniCheckPrompt: "A workstation shows signs of active malware and must be prevented from communicating with other systems. A newly installed network appliance still uses the vendor-supplied administrator credential.",
    miniCheckAnswers: {
      "compromised-workstation": "Isolation",
      "network-appliance": "Default password changes"
    },
    blueprintMappings: {
      "Segmentation": "segmentation",
      "Application allow list": "application-allow-list",
      "Isolation": "isolation",
      "Patching": "patching",
      "Encryption": "encryption",
      "Monitoring": "monitoring",
      "Least privilege": "least-privilege",
      "Configuration enforcement": "configuration-enforcement",
      "Decommissioning": "decommissioning",
      "Access control": "access-control",
      "Access control > Access control list (ACL)": "access-control",
      "Access control > Permissions": "access-control",
      "Hardening techniques": "hardening-techniques",
      "Hardening techniques > Encryption": "hardening-techniques",
      "Hardening techniques > Installation of endpoint protection": "endpoint-protection",
      "Hardening techniques > Host-based firewall": "host-firewall-and-hips",
      "Hardening techniques > Host-based intrusion prevention system (HIPS)": "host-firewall-and-hips",
      "Hardening techniques > Disabling ports/protocols": "disable-unused-access",
      "Hardening techniques > Default password changes": "default-passwords-and-software",
      "Hardening techniques > Removal of unnecessary software": "default-passwords-and-software"
    }
  },
  "3.1": {
    world: "3",
    expectedQuestionCount: 35,
    sectionIds: [
      "what-you-are-learning",
      "cloud",
      "responsibility-matrix",
      "hybrid-and-third-party",
      "iac-and-serverless",
      "microservices",
      "network-infrastructure",
      "physical-isolation-and-air-gaps",
      "logical-segmentation-and-sdn",
      "on-premises",
      "centralized-and-decentralized",
      "containers-and-virtual-machines",
      "iot",
      "industrial-systems",
      "rtos-and-embedded",
      "high-availability",
      "architecture-considerations",
      "availability-and-resilience",
      "cost-performance-and-growth",
      "risk-recovery-and-patching",
      "power-and-compute",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Architecture and Infrastructure Concepts",
      "Cloud",
      "Responsibility Matrix",
      "Hybrid Considerations",
      "Third-Party Vendors",
      "Infrastructure as Code (IaC)",
      "Serverless",
      "Microservices",
      "Network Infrastructure",
      "Physical Isolation",
      "Air-Gapped",
      "Logical Segmentation",
      "Software-Defined Networking (SDN)",
      "On-Premises",
      "Centralized vs. Decentralized",
      "Containerization",
      "Virtualization",
      "Internet of Things (IoT)",
      "Industrial Control Systems (ICS)/SCADA",
      "Real-Time Operating System (RTOS)",
      "Embedded Systems",
      "High Availability",
      "Considerations",
      "Availability",
      "Resilience",
      "Cost",
      "Responsiveness",
      "Scalability",
      "Ease of Deployment",
      "Risk Transference",
      "Ease of Recovery",
      "Patch Availability",
      "Inability to Patch",
      "Power",
      "Compute"
    ],
    miniCheckPrompt: "An organization keeps a regulated database in its own data center but runs a customer application in a public cloud. Its design document separately identifies which security duties belong to the cloud provider and which belong to the customer.",
    miniCheckAnswers: {
      "architecture-model": "Hybrid considerations",
      "cloud-governance-tool": "Responsibility matrix"
    },
    blueprintMappings: {
      "Architecture and infrastructure concepts": "what-you-are-learning",
      "Cloud": "cloud",
      "Responsibility matrix": "responsibility-matrix",
      "Hybrid considerations": "hybrid-and-third-party",
      "Third-party vendors": "hybrid-and-third-party",
      "Infrastructure as code (IaC)": "iac-and-serverless",
      "Serverless": "iac-and-serverless",
      "Microservices": "microservices",
      "Network infrastructure": "network-infrastructure",
      "Physical isolation": "physical-isolation-and-air-gaps",
      "Air-gapped": "physical-isolation-and-air-gaps",
      "Logical segmentation": "logical-segmentation-and-sdn",
      "Software-defined networking (SDN)": "logical-segmentation-and-sdn",
      "On-premises": "on-premises",
      "Centralized vs. decentralized": "centralized-and-decentralized",
      "Containerization": "containers-and-virtual-machines",
      "Virtualization": "containers-and-virtual-machines",
      "Internet of Things (IoT)": "iot",
      "Industrial control systems (ICS)/SCADA": "industrial-systems",
      "Real-time operating system (RTOS)": "rtos-and-embedded",
      "Embedded systems": "rtos-and-embedded",
      "High availability": "high-availability",
      "Considerations": "architecture-considerations",
      "Availability": "availability-and-resilience",
      "Resilience": "availability-and-resilience",
      "Cost": "cost-performance-and-growth",
      "Responsiveness": "cost-performance-and-growth",
      "Scalability": "cost-performance-and-growth",
      "Ease of deployment": "cost-performance-and-growth",
      "Risk transference": "risk-recovery-and-patching",
      "Ease of recovery": "risk-recovery-and-patching",
      "Patch availability": "risk-recovery-and-patching",
      "Inability to patch": "risk-recovery-and-patching",
      "Power": "power-and-compute",
      "Compute": "power-and-compute"
    }
  },
  "3.2": {
    world: "3",
    expectedQuestionCount: 34,
    sectionIds: [
      "what-you-are-learning",
      "placement-zones-and-exposure",
      "failure-modes",
      "device-attributes",
      "active-and-passive",
      "inline-and-monitoring",
      "network-appliances",
      "administrative-access-and-proxies",
      "ids-and-ips",
      "balancing-and-sensing",
      "port-security",
      "8021x-and-eap",
      "firewall-types",
      "waf-utm-and-ngfw",
      "layer4-and-layer7",
      "secure-communications",
      "vpn-remote-access-and-tunneling",
      "tls-and-ipsec",
      "sdwan-and-sase",
      "selecting-effective-controls",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Infrastructure Considerations",
      "Device Placement",
      "Security Zones",
      "Attack Surface",
      "Connectivity",
      "Failure Modes",
      "Fail-Open",
      "Fail-Closed",
      "Device Attribute",
      "Active vs. Passive",
      "Inline vs. TAP/Monitor",
      "Network Appliances",
      "Jump Server",
      "Proxy Server",
      "Intrusion Prevention System (IPS)/Intrusion Detection System (IDS)",
      "Load Balancer",
      "Sensors",
      "Port Security",
      "802.1X",
      "Extensible Authentication Protocol (EAP)",
      "Firewall Types",
      "Web Application Firewall (WAF)",
      "Unified Threat Management (UTM)",
      "Next-Generation Firewall (NGFW)",
      "Layer 4/Layer 7",
      "Secure Communication/Access",
      "Virtual Private Network (VPN)",
      "Remote Access",
      "Tunneling",
      "Transport Layer Security (TLS)",
      "Internet Protocol Security (IPsec)",
      "Software-Defined Wide Area Network (SD-WAN)",
      "Secure Access Service Edge (SASE)",
      "Selection of Effective Controls"
    ],
    miniCheckPrompt: "A security team must inspect a copy of production network traffic without interrupting it. The same team must protect a public web application by inspecting HTTP and HTTPS requests before they reach the application.",
    miniCheckAnswers: {
      "monitoring-placement": "TAP/monitor",
      "web-application-control": "Web application firewall (WAF)"
    },
    blueprintMappings: {
      "Infrastructure considerations": "what-you-are-learning",
      "Device placement": "placement-zones-and-exposure",
      "Security zones": "placement-zones-and-exposure",
      "Attack surface": "placement-zones-and-exposure",
      "Connectivity": "placement-zones-and-exposure",
      "Failure modes": "failure-modes",
      "Fail-open": "failure-modes",
      "Fail-closed": "failure-modes",
      "Device attribute": "device-attributes",
      "Active vs. passive": "active-and-passive",
      "Inline vs. tap/monitor": "inline-and-monitoring",
      "Network appliances": "network-appliances",
      "Jump server": "administrative-access-and-proxies",
      "Proxy server": "administrative-access-and-proxies",
      "Intrusion prevention system (IPS)/intrusion detection system (IDS)": "ids-and-ips",
      "Load balancer": "balancing-and-sensing",
      "Sensors": "balancing-and-sensing",
      "Port security": "port-security",
      "802.1X": "8021x-and-eap",
      "Extensible Authentication Protocol (EAP)": "8021x-and-eap",
      "Firewall types": "firewall-types",
      "Web application firewall (WAF)": "waf-utm-and-ngfw",
      "Unified threat management (UTM)": "waf-utm-and-ngfw",
      "Next-generation firewall (NGFW)": "waf-utm-and-ngfw",
      "Layer 4/Layer 7": "layer4-and-layer7",
      "Secure communication/access": "secure-communications",
      "Virtual private network (VPN)": "vpn-remote-access-and-tunneling",
      "Remote access": "vpn-remote-access-and-tunneling",
      "Tunneling": "vpn-remote-access-and-tunneling",
      "Transport Layer Security (TLS)": "tls-and-ipsec",
      "Internet Protocol Security (IPSec)": "tls-and-ipsec",
      "Software-defined wide area network (SD-WAN)": "sdwan-and-sase",
      "Secure access service edge (SASE)": "sdwan-and-sase",
      "Selection of effective controls": "selecting-effective-controls"
    }
  },
  "3.3": {
    world: "3",
    expectedQuestionCount: 30,
    sectionIds: [
      "what-you-are-learning",
      "regulated-data",
      "trade-secrets-and-intellectual-property",
      "legal-and-financial-information",
      "human-and-machine-readable",
      "data-classifications",
      "sensitive-and-confidential",
      "public-and-private",
      "restricted-and-critical",
      "general-data-considerations",
      "data-states",
      "sovereignty-and-geolocation",
      "methods-to-secure-data",
      "geographic-restrictions",
      "encryption-and-hashing",
      "masking-and-tokenization",
      "obfuscation",
      "segmentation-and-permissions",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Data Types",
      "Regulated",
      "Trade Secret",
      "Intellectual Property",
      "Legal Information",
      "Financial Information",
      "Human- and Non-Human-Readable",
      "Data Classifications",
      "Sensitive",
      "Confidential",
      "Public",
      "Restricted",
      "Private",
      "Critical",
      "General Data Considerations",
      "Data States",
      "Data at Rest",
      "Data in Transit",
      "Data in Use",
      "Data Sovereignty",
      "Geolocation",
      "Methods to Secure Data",
      "Geographic Restrictions",
      "Encryption",
      "Hashing",
      "Masking",
      "Tokenization",
      "Obfuscation",
      "Segmentation",
      "Permission Restrictions"
    ],
    miniCheckPrompt: "A manufacturer stores its secret product formula in an encrypted file on an offline server. The formula provides business value because competitors do not know it, and the file is not currently moving or being processed.",
    miniCheckAnswers: {
      "data-type": "Trade secret",
      "data-state": "Data at rest"
    },
    blueprintMappings: {
      "Data types": "what-you-are-learning",
      "Regulated": "regulated-data",
      "Trade secret": "trade-secrets-and-intellectual-property",
      "Intellectual property": "trade-secrets-and-intellectual-property",
      "Legal information": "legal-and-financial-information",
      "Financial information": "legal-and-financial-information",
      "Human- and non-human-readable": "human-and-machine-readable",
      "Data classifications": "data-classifications",
      "Sensitive": "sensitive-and-confidential",
      "Confidential": "sensitive-and-confidential",
      "Public": "public-and-private",
      "Restricted": "restricted-and-critical",
      "Private": "public-and-private",
      "Critical": "restricted-and-critical",
      "General data considerations": "general-data-considerations",
      "Data states": "data-states",
      "Data at rest": "data-states",
      "Data in transit": "data-states",
      "Data in use": "data-states",
      "Data sovereignty": "sovereignty-and-geolocation",
      "Geolocation": "sovereignty-and-geolocation",
      "Methods to secure data": "methods-to-secure-data",
      "Geographic restrictions": "geographic-restrictions",
      "Encryption": "encryption-and-hashing",
      "Hashing": "encryption-and-hashing",
      "Masking": "masking-and-tokenization",
      "Tokenization": "masking-and-tokenization",
      "Obfuscation": "obfuscation",
      "Segmentation": "segmentation-and-permissions",
      "Permission restrictions": "segmentation-and-permissions"
    }
  },
  "3.4": {
    world: "3",
    expectedQuestionCount: 30,
    sectionIds: [
      "what-you-are-learning",
      "high-availability",
      "load-balancing-and-clustering",
      "site-considerations",
      "hot-warm-cold-sites",
      "geographic-dispersion",
      "platform-diversity",
      "multi-cloud-systems",
      "continuity-of-operations",
      "capacity-planning",
      "people-technology-infrastructure",
      "testing",
      "recovery-testing-methods",
      "backups",
      "onsite-offsite-and-frequency",
      "backup-encryption-and-snapshots",
      "recovery-replication-and-journaling",
      "power",
      "generators-and-ups",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "High Availability",
      "Load Balancing vs. Clustering",
      "Site Considerations",
      "Hot Site",
      "Cold Site",
      "Warm Site",
      "Geographic Dispersion",
      "Platform Diversity",
      "Multi-Cloud Systems",
      "Continuity of Operations",
      "Capacity Planning",
      "People",
      "Technology",
      "Infrastructure",
      "Testing",
      "Tabletop Exercises",
      "Failover",
      "Simulation",
      "Parallel Processing",
      "Backups",
      "Onsite/offsite",
      "Frequency",
      "Backup Encryption",
      "Snapshots",
      "Recovery",
      "Replication",
      "Journaling",
      "Power",
      "Generators",
      "Uninterruptible Power Supply (UPS)"
    ],
    miniCheckPrompt: "A regional disaster makes the primary facility unavailable. The organization needs an alternate location that already has systems, applications, and current data so operations can resume quickly. During any brief utility interruption, production equipment must receive power immediately while the emergency generator starts.",
    miniCheckAnswers: {
      "recovery-site": "Hot site",
      "immediate-power": "Uninterruptible power supply (UPS)"
    },
    blueprintMappings: {
      "High availability": "high-availability",
      "Load balancing vs. clustering": "load-balancing-and-clustering",
      "Site considerations": "site-considerations",
      "Hot site": "hot-warm-cold-sites",
      "Cold site": "hot-warm-cold-sites",
      "Warm site": "hot-warm-cold-sites",
      "Geographic dispersion": "geographic-dispersion",
      "Platform diversity": "platform-diversity",
      "Multi-cloud systems": "multi-cloud-systems",
      "Continuity of operations": "continuity-of-operations",
      "Capacity planning": "capacity-planning",
      "People": "people-technology-infrastructure",
      "Technology": "people-technology-infrastructure",
      "Infrastructure": "people-technology-infrastructure",
      "Testing": "testing",
      "Tabletop exercises": "recovery-testing-methods",
      "Failover": "recovery-testing-methods",
      "Simulation": "recovery-testing-methods",
      "Parallel processing": "recovery-testing-methods",
      "Backups": "backups",
      "Onsite/offsite": "onsite-offsite-and-frequency",
      "Frequency": "onsite-offsite-and-frequency",
      "Backup encryption": "backup-encryption-and-snapshots",
      "Snapshots": "backup-encryption-and-snapshots",
      "Recovery": "recovery-replication-and-journaling",
      "Replication": "recovery-replication-and-journaling",
      "Journaling": "recovery-replication-and-journaling",
      "Power": "power",
      "Generators": "generators-and-ups",
      "Uninterruptible power supply (UPS)": "generators-and-ups"
    }
  },
  "4.1": {
    world: "4",
    expectedQuestionCount: 41,
    sectionIds: [
      "what-you-are-learning",
      "secure-baselines",
      "establish-deploy-maintain",
      "hardening-targets",
      "mobile-devices-and-workstations",
      "switches-and-routers",
      "cloud-infrastructure-and-servers",
      "ics-scada",
      "embedded-rtos-and-iot",
      "wireless-devices",
      "site-surveys-and-heat-maps",
      "mobile-solutions",
      "mobile-device-management",
      "deployment-models",
      "byod-cope-and-cyod",
      "connection-methods",
      "cellular-wifi-and-bluetooth",
      "wireless-security-settings",
      "wpa3-and-aaa-radius",
      "cryptographic-and-authentication-protocols",
      "application-security",
      "input-validation-and-secure-cookies",
      "static-analysis-and-code-signing",
      "sandboxing",
      "monitoring",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Secure Baselines",
      "Establish",
      "Deploy",
      "Maintain",
      "Hardening Targets",
      "Mobile Devices",
      "Workstations",
      "Switches",
      "Routers",
      "Cloud Infrastructure",
      "Servers",
      "ICS/SCADA",
      "Embedded Systems",
      "RTOS",
      "IoT Devices",
      "Wireless Devices",
      "Installation Considerations",
      "Site Surveys",
      "Heat Maps",
      "Mobile Solutions",
      "Mobile Device Management (MDM)",
      "Deployment Models",
      "Bring Your Own Device (BYOD)",
      "Corporate-Owned, Personally Enabled (COPE)",
      "Choose Your Own Device (CYOD)",
      "Connection Methods",
      "Cellular",
      "Wi-Fi",
      "Bluetooth",
      "Wireless Security Settings",
      "Wi-Fi Protected Access 3 (WPA3)",
      "AAA/RADIUS",
      "Cryptographic Protocols",
      "Authentication Protocols",
      "Application Security",
      "Input Validation",
      "Secure Cookies",
      "Static Code Analysis",
      "Code Signing",
      "Sandboxing",
      "Monitoring"
    ],
    miniCheckPrompt: "A security team has already approved a hardened workstation configuration and now uses automation to apply it to hundreds of laptops. Separately, users need to verify that downloaded client software came from the approved developer and has not been altered.",
    miniCheckAnswers: {
      "baseline-stage": "Deploy",
      "software-assurance": "Code signing"
    },
    blueprintMappings: {
      "Secure baselines": "secure-baselines",
      "Establish": "establish-deploy-maintain",
      "Deploy": "establish-deploy-maintain",
      "Maintain": "establish-deploy-maintain",
      "Hardening targets": "hardening-targets",
      "Mobile devices": "mobile-devices-and-workstations",
      "Workstations": "mobile-devices-and-workstations",
      "Switches": "switches-and-routers",
      "Routers": "switches-and-routers",
      "Cloud infrastructure": "cloud-infrastructure-and-servers",
      "Servers": "cloud-infrastructure-and-servers",
      "ICS/SCADA": "ics-scada",
      "Embedded systems": "embedded-rtos-and-iot",
      "RTOS": "embedded-rtos-and-iot",
      "IoT devices": "embedded-rtos-and-iot",
      "Wireless devices": "wireless-devices",
      "Installation considerations": "wireless-devices",
      "Site surveys": "site-surveys-and-heat-maps",
      "Heat maps": "site-surveys-and-heat-maps",
      "Mobile solutions": "mobile-solutions",
      "Mobile device management (MDM)": "mobile-device-management",
      "Deployment models": "deployment-models",
      "Bring your own device (BYOD)": "byod-cope-and-cyod",
      "Corporate-owned, personally enabled (COPE)": "byod-cope-and-cyod",
      "Choose your own device (CYOD)": "byod-cope-and-cyod",
      "Connection methods": "connection-methods",
      "Cellular": "cellular-wifi-and-bluetooth",
      "Wi-Fi": "cellular-wifi-and-bluetooth",
      "Bluetooth": "cellular-wifi-and-bluetooth",
      "Wireless security settings": "wireless-security-settings",
      "Wi-Fi Protected Access 3 (WPA3)": "wpa3-and-aaa-radius",
      "AAA/RADIUS": "wpa3-and-aaa-radius",
      "Cryptographic protocols": "cryptographic-and-authentication-protocols",
      "Authentication protocols": "cryptographic-and-authentication-protocols",
      "Application security": "application-security",
      "Input validation": "input-validation-and-secure-cookies",
      "Secure cookies": "input-validation-and-secure-cookies",
      "Static code analysis": "static-analysis-and-code-signing",
      "Code signing": "static-analysis-and-code-signing",
      "Sandboxing": "sandboxing",
      "Monitoring": "monitoring"
    }
  },
  "4.2": {
    world: "4",
    expectedQuestionCount: 12,
    sectionIds: [
      "what-you-are-learning",
      "acquisition-and-procurement",
      "assignment-and-accounting",
      "ownership-and-classification",
      "monitoring-and-asset-tracking",
      "inventory-and-enumeration",
      "disposal-and-decommissioning",
      "sanitization-and-destruction",
      "certification-and-data-retention",
      "asset-lifecycle",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Acquisition/Procurement Process",
      "Assignment/Accounting",
      "Ownership",
      "Classification",
      "Monitoring/Asset Tracking",
      "Inventory",
      "Enumeration",
      "Disposal/Decommissioning",
      "Sanitization",
      "Destruction",
      "Certification",
      "Data Retention"
    ],
    miniCheckPrompt: "An organization retires storage media containing sensitive data. The media is approved for reuse, but its prior contents must be made unrecoverable. An auditor also requires documented proof that the approved process was completed.",
    miniCheckAnswers: {
      "media-action": "Sanitization",
      "disposal-evidence": "Certification"
    },
    blueprintMappings: {
      "Acquisition/procurement process": "acquisition-and-procurement",
      "Assignment/accounting": "assignment-and-accounting",
      "Ownership": "ownership-and-classification",
      "Classification": "ownership-and-classification",
      "Monitoring/asset tracking": "monitoring-and-asset-tracking",
      "Inventory": "inventory-and-enumeration",
      "Enumeration": "inventory-and-enumeration",
      "Disposal/decommissioning": "disposal-and-decommissioning",
      "Sanitization": "sanitization-and-destruction",
      "Destruction": "sanitization-and-destruction",
      "Certification": "certification-and-data-retention",
      "Data retention": "certification-and-data-retention"
    }
  },
  "4.3": {
    world: "4",
    expectedQuestionCount: 38,
    sectionIds: [
      "what-you-are-learning",
      "identification-methods",
      "application-security-testing",
      "threat-feeds",
      "threat-intelligence-sources",
      "penetration-testing-and-disclosure",
      "system-and-process-audits",
      "analysis-and-confirmation",
      "false-positive-and-negative",
      "prioritization",
      "cve-and-cvss",
      "classification-and-exposure",
      "environmental-impact-and-risk-tolerance",
      "response-and-remediation",
      "patching-and-insurance",
      "segmentation-and-compensating-controls",
      "exceptions-and-exemptions",
      "validation-of-remediation",
      "rescanning-audit-and-verification",
      "reporting",
      "vulnerability-management-lifecycle",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Identification Methods",
      "Vulnerability Scan",
      "Application Security",
      "Static Analysis",
      "Dynamic Analysis",
      "Package Monitoring",
      "Threat Feed",
      "Open-Source Intelligence (OSINT)",
      "Proprietary/Third-Party",
      "Information-Sharing Organization",
      "Dark Web",
      "Penetration Testing",
      "Responsible Disclosure Program",
      "Bug Bounty Program",
      "System/Process Audit",
      "Analysis",
      "Confirmation",
      "False Positive",
      "False Negative",
      "Prioritize",
      "Common Vulnerability Scoring System (CVSS)",
      "Common Vulnerabilities and Exposures (CVE)",
      "Vulnerability Classification",
      "Exposure Factor",
      "Environmental Variables",
      "Industry/Organizational Impact",
      "Risk Tolerance",
      "Vulnerability Response and Remediation",
      "Patching",
      "Insurance",
      "Segmentation",
      "Compensating Controls",
      "Exceptions and Exemptions",
      "Validation of Remediation",
      "Rescanning",
      "Audit",
      "Verification",
      "Reporting"
    ],
    miniCheckPrompt: "A public-facing billing server has a confirmed vulnerability, but the vendor patch cannot be installed until compatibility testing finishes. The organization must reduce the server's network exposure immediately. After the approved maintenance window and patch installation, the team must determine whether the vulnerability scanner still detects the weakness.",
    miniCheckAnswers: {
      "immediate-response": "Segmentation",
      "validation-activity": "Rescanning"
    },
    blueprintMappings: {
      "Identification methods": "identification-methods",
      "Vulnerability scan": "identification-methods",
      "Application security": "application-security-testing",
      "Static analysis": "application-security-testing",
      "Dynamic analysis": "application-security-testing",
      "Package monitoring": "application-security-testing",
      "Threat feed": "threat-feeds",
      "Open-source intelligence (OSINT)": "threat-intelligence-sources",
      "Proprietary/third-party": "threat-intelligence-sources",
      "Information-sharing organization": "threat-intelligence-sources",
      "Dark web": "threat-intelligence-sources",
      "Penetration testing": "penetration-testing-and-disclosure",
      "Responsible disclosure program": "penetration-testing-and-disclosure",
      "Bug bounty program": "penetration-testing-and-disclosure",
      "System/process audit": "system-and-process-audits",
      "Analysis": "analysis-and-confirmation",
      "Confirmation": "analysis-and-confirmation",
      "False positive": "false-positive-and-negative",
      "False negative": "false-positive-and-negative",
      "Prioritize": "prioritization",
      "Common Vulnerability Scoring System (CVSS)": "cve-and-cvss",
      "Common Vulnerabilities and Exposures (CVE)": "cve-and-cvss",
      "Vulnerability classification": "classification-and-exposure",
      "Exposure factor": "classification-and-exposure",
      "Environmental variables": "environmental-impact-and-risk-tolerance",
      "Industry/organizational impact": "environmental-impact-and-risk-tolerance",
      "Risk tolerance": "environmental-impact-and-risk-tolerance",
      "Vulnerability response and remediation": "response-and-remediation",
      "Patching": "patching-and-insurance",
      "Insurance": "patching-and-insurance",
      "Segmentation": "segmentation-and-compensating-controls",
      "Compensating controls": "segmentation-and-compensating-controls",
      "Exceptions and exemptions": "exceptions-and-exemptions",
      "Validation of remediation": "validation-of-remediation",
      "Rescanning": "rescanning-audit-and-verification",
      "Audit": "rescanning-audit-and-verification",
      "Verification": "rescanning-audit-and-verification",
      "Reporting": "reporting"
    }
  },
  "4.4": {
    world: "4",
    expectedQuestionCount: 23,
    sectionIds: [
      "what-you-are-learning",
      "computing-resources",
      "monitoring-activities",
      "response-remediation-validation",
      "automation-and-benchmarks",
      "agents-and-agentless",
      "siem",
      "antivirus-and-dlp",
      "snmp-traps-and-netflow",
      "vulnerability-scanners",
      "alert-response-flow",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Monitoring Computing Resources",
      "Systems",
      "Applications",
      "Infrastructure",
      "Activities",
      "Log Aggregation",
      "Alerting",
      "Scanning",
      "Reporting",
      "Archiving",
      "Alert Response and Remediation/Validation",
      "Quarantine",
      "Alert Tuning",
      "Tools",
      "Security Content Automation Protocol (SCAP)",
      "Benchmarks",
      "Agents/Agentless",
      "Security Information and Event Management (SIEM)",
      "Antivirus",
      "Data Loss Prevention (DLP)",
      "Simple Network Management Protocol (SNMP) Traps",
      "NetFlow",
      "Vulnerability Scanners"
    ],
    miniCheckPrompt: "Authentication records from hundreds of endpoints must be centralized and correlated so repeated failed logins across multiple systems generate one investigation alert. During the investigation, one endpoint is confirmed to be communicating with malicious infrastructure and must be separated from other resources immediately.",
    miniCheckAnswers: {
      "monitoring-platform": "Security information and event management (SIEM)",
      "containment-response": "Quarantine"
    },
    blueprintMappings: {
      "Monitoring computing resources": "what-you-are-learning",
      "Systems": "computing-resources",
      "Applications": "computing-resources",
      "Infrastructure": "computing-resources",
      "Activities": "monitoring-activities",
      "Log aggregation": "monitoring-activities",
      "Alerting": "monitoring-activities",
      "Scanning": "monitoring-activities",
      "Reporting": "monitoring-activities",
      "Archiving": "monitoring-activities",
      "Alert response and remediation/validation": "response-remediation-validation",
      "Quarantine": "response-remediation-validation",
      "Alert tuning": "response-remediation-validation",
      "Tools": "automation-and-benchmarks",
      "Security Content Automation Protocol (SCAP)": "automation-and-benchmarks",
      "Benchmarks": "automation-and-benchmarks",
      "Agents/agentless": "agents-and-agentless",
      "Security information and event management (SIEM)": "siem",
      "Antivirus": "antivirus-and-dlp",
      "Data loss prevention (DLP)": "antivirus-and-dlp",
      "Simple Network Management Protocol (SNMP) traps": "snmp-traps-and-netflow",
      "NetFlow": "snmp-traps-and-netflow",
      "Vulnerability scanners": "vulnerability-scanners"
    }
  },
  "4.5": {
    world: "4",
    expectedQuestionCount: 33,
    sectionIds: [
      "what-you-are-learning",
      "firewall-controls",
      "ids-and-ips",
      "web-filtering",
      "web-filter-delivery",
      "web-filter-decisions",
      "operating-system-security",
      "secure-protocols",
      "dns-filtering",
      "email-security",
      "fim-and-dlp",
      "network-access-control",
      "edr-and-xdr",
      "user-behavior-analytics",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Firewall",
      "Rules",
      "Access Lists",
      "Ports/Protocols",
      "Screened Subnets",
      "IDS/IPS",
      "Trends",
      "Signatures",
      "Web Filter",
      "Agent-Based",
      "Centralized Proxy",
      "Universal Resource Locator (URL) Scanning",
      "Content Categorization",
      "Block Rules",
      "Reputation",
      "Operating System Security",
      "Group Policy",
      "SELinux",
      "Implementation of Secure Protocols",
      "Protocol Selection",
      "Port Selection",
      "Transport Method",
      "DNS Filtering",
      "Email Security",
      "Domain-Based Message Authentication, Reporting and Conformance (DMARC)",
      "DomainKeys Identified Mail (DKIM)",
      "Sender Policy Framework (SPF)",
      "Email Gateway",
      "File Integrity Monitoring",
      "DLP",
      "Network Access Control (NAC)",
      "EDR/XDR",
      "User Behavior Analytics"
    ],
    miniCheckPrompt: "A company is reducing forged email that impersonates its domain. It must publish which mail servers are allowed to send on the domain's behalf. It must also tell receiving systems to quarantine messages that fail aligned email-authentication checks and collect reports about those failures.",
    miniCheckAnswers: {
      "sender-authorization": "Sender Policy Framework (SPF)",
      "receiver-policy": "Domain-Based Message Authentication, Reporting and Conformance (DMARC)"
    },
    blueprintMappings: {
      "Firewall": "firewall-controls",
      "Rules": "firewall-controls",
      "Access lists": "firewall-controls",
      "Ports/protocols": "firewall-controls",
      "Screened subnets": "firewall-controls",
      "IDS/IPS": "ids-and-ips",
      "Trends": "ids-and-ips",
      "Signatures": "ids-and-ips",
      "Web filter": "web-filtering",
      "Agent-based": "web-filter-delivery",
      "Centralized proxy": "web-filter-delivery",
      "Universal Resource Locator (URL) scanning": "web-filter-decisions",
      "Content categorization": "web-filter-decisions",
      "Block rules": "web-filter-decisions",
      "Reputation": "web-filter-decisions",
      "Operating system security": "operating-system-security",
      "Group Policy": "operating-system-security",
      "SELinux": "operating-system-security",
      "Implementation of secure protocols": "secure-protocols",
      "Protocol selection": "secure-protocols",
      "Port selection": "secure-protocols",
      "Transport method": "secure-protocols",
      "DNS filtering": "dns-filtering",
      "Email security": "email-security",
      "DMARC": "email-security",
      "DKIM": "email-security",
      "SPF": "email-security",
      "Email gateway": "email-security",
      "File integrity monitoring": "fim-and-dlp",
      "DLP": "fim-and-dlp",
      "Network access control (NAC)": "network-access-control",
      "EDR/XDR": "edr-and-xdr",
      "User behavior analytics": "user-behavior-analytics"
    }
  },
  "4.6": {
    world: "4",
    expectedQuestionCount: 41,
    sectionIds: [
      "what-you-are-learning",
      "account-lifecycle",
      "federation-and-sso",
      "identity-protocols",
      "interoperability-and-attestation",
      "access-control-foundations",
      "mac-and-dac",
      "role-rule-and-attribute",
      "time-and-least-privilege",
      "mfa-foundations",
      "mfa-implementations",
      "mfa-factors",
      "password-controls",
      "password-tools",
      "privileged-access-management",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Provisioning/De-provisioning User Accounts",
      "Permission Assignments and Implications",
      "Identity Proofing",
      "Federation",
      "Single Sign-On (SSO)",
      "Lightweight Directory Access Protocol (LDAP)",
      "Open Authorization (OAuth)",
      "Security Assertion Markup Language (SAML)",
      "Interoperability",
      "Attestation",
      "Access Controls",
      "Mandatory Access Control",
      "Discretionary Access Control",
      "Role-Based Access Control",
      "Rule-Based Access Control",
      "Attribute-Based Access Control",
      "Time-of-Day Restrictions",
      "Least Privilege",
      "Multifactor Authentication",
      "MFA Implementations",
      "Biometrics",
      "Hard/Soft Authentication Tokens",
      "Security Keys",
      "MFA Factors",
      "Something You Know",
      "Something You Have",
      "Something You Are",
      "Somewhere You Are",
      "Password Concepts",
      "Password Best Practices",
      "Length",
      "Complexity",
      "Reuse",
      "Expiration",
      "Age",
      "Password Managers",
      "Passwordless",
      "Privileged Access Management Tools",
      "Just-in-Time Permissions",
      "Password Vaulting",
      "Ephemeral Credentials"
    ],
    miniCheckPrompt: "A scheduling application asks a user to grant it limited access to the user's contacts without revealing the user's password. Separately, an employee opens a vendor portal after the corporate identity provider sends the portal a signed federated assertion confirming the employee's authentication.",
    miniCheckAnswers: {
      "delegated-access": "Open Authorization (OAuth)",
      "federated-assertion": "Security Assertion Markup Language (SAML)"
    },
    blueprintMappings: {
      "Provisioning/de-provisioning user accounts": "account-lifecycle",
      "Permission assignments and implications": "account-lifecycle",
      "Identity proofing": "account-lifecycle",
      "Federation": "federation-and-sso",
      "Single sign-on (SSO)": "federation-and-sso",
      "Lightweight Directory Access Protocol (LDAP)": "identity-protocols",
      "Open authorization (OAuth)": "identity-protocols",
      "Security Assertion Markup Language (SAML)": "identity-protocols",
      "Interoperability": "interoperability-and-attestation",
      "Attestation": "interoperability-and-attestation",
      "Access controls": "access-control-foundations",
      "Mandatory access control": "mac-and-dac",
      "Discretionary access control": "mac-and-dac",
      "Role-based access control": "role-rule-and-attribute",
      "Rule-based access control": "role-rule-and-attribute",
      "Attribute-based access control": "role-rule-and-attribute",
      "Time-of-day restrictions": "time-and-least-privilege",
      "Least privilege": "time-and-least-privilege",
      "Multifactor authentication": "mfa-foundations",
      "MFA implementations": "mfa-foundations",
      "Biometrics": "mfa-implementations",
      "Hard/soft authentication tokens": "mfa-implementations",
      "Security keys": "mfa-implementations",
      "MFA factors": "mfa-factors",
      "Something you know": "mfa-factors",
      "Something you have": "mfa-factors",
      "Something you are": "mfa-factors",
      "Somewhere you are": "mfa-factors",
      "Password concepts": "password-controls",
      "Password best practices": "password-controls",
      "Length": "password-controls",
      "Complexity": "password-controls",
      "Reuse": "password-controls",
      "Expiration": "password-controls",
      "Age": "password-controls",
      "Password managers": "password-tools",
      "Passwordless": "password-tools",
      "Privileged access management tools": "privileged-access-management",
      "Just-in-time permissions": "privileged-access-management",
      "Password vaulting": "privileged-access-management",
      "Ephemeral credentials": "privileged-access-management"
    }
  },
  "4.7": {
    world: "4",
    expectedQuestionCount: 24,
    sectionIds: [
      "what-you-are-learning",
      "automation-and-orchestration",
      "provisioning",
      "guard-rails-and-security-groups",
      "tickets-and-escalation",
      "service-and-access-control",
      "continuous-integration-and-testing",
      "integrations-and-apis",
      "automation-benefits",
      "consistency-and-scale-benefits",
      "people-and-response-benefits",
      "automation-considerations",
      "automation-risks",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Use Cases of Automation and Scripting",
      "Automation vs. Orchestration",
      "User Provisioning",
      "Resource Provisioning",
      "Guard Rails",
      "Security Groups",
      "Ticket Creation",
      "Escalation",
      "Enabling/Disabling Services and Access",
      "Continuous Integration and Testing",
      "Integrations and APIs",
      "Benefits",
      "Efficiency/Time Saving",
      "Enforcing Baselines",
      "Standard Infrastructure Configurations",
      "Scaling in a Secure Manner",
      "Employee Retention",
      "Reaction Time",
      "Workforce Multiplier",
      "Other Considerations",
      "Complexity",
      "Cost",
      "Single Point of Failure",
      "Technical Debt",
      "Ongoing Supportability"
    ],
    miniCheckPrompt: "A security platform can perform two proposed response designs. The first isolates one endpoint whenever malware is confirmed. The second coordinates the SIEM, endpoint platform, identity provider, firewall, and ticketing system to isolate the device, disable the account, block the malicious address, and open an incident.",
    miniCheckAnswers: {
      "single-action": "Automation",
      "coordinated-workflow": "Orchestration"
    },
    blueprintMappings: {
      "Use cases of automation and scripting": "automation-and-orchestration",
      "User provisioning": "provisioning",
      "Resource provisioning": "provisioning",
      "Guard rails": "guard-rails-and-security-groups",
      "Security groups": "guard-rails-and-security-groups",
      "Ticket creation": "tickets-and-escalation",
      "Escalation": "tickets-and-escalation",
      "Enabling/disabling services and access": "service-and-access-control",
      "Continuous integration and testing": "continuous-integration-and-testing",
      "Integrations and APIs": "integrations-and-apis",
      "Benefits": "automation-benefits",
      "Efficiency/time saving": "consistency-and-scale-benefits",
      "Enforcing baselines": "consistency-and-scale-benefits",
      "Standard infrastructure configurations": "consistency-and-scale-benefits",
      "Scaling in a secure manner": "consistency-and-scale-benefits",
      "Employee retention": "people-and-response-benefits",
      "Reaction time": "people-and-response-benefits",
      "Workforce multiplier": "people-and-response-benefits",
      "Other considerations": "automation-considerations",
      "Complexity": "automation-risks",
      "Cost": "automation-risks",
      "Single point of failure": "automation-risks",
      "Technical debt": "automation-risks",
      "Ongoing supportability": "automation-risks"
    }
  },
  "4.8": {
    world: "4",
    expectedQuestionCount: 21,
    sectionIds: [
      "what-you-are-learning",
      "incident-response-process",
      "preparation",
      "detection-and-analysis",
      "containment-eradication-recovery",
      "lessons-learned",
      "training-and-testing",
      "tabletop-and-simulation",
      "root-cause-analysis",
      "threat-hunting",
      "digital-forensics",
      "legal-hold",
      "evidence-acquisition-and-preservation",
      "reporting-and-ediscovery",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Process",
      "Preparation",
      "Detection",
      "Analysis",
      "Containment",
      "Eradication",
      "Recovery",
      "Lessons Learned",
      "Training",
      "Testing",
      "Tabletop Exercise",
      "Simulation",
      "Root Cause Analysis",
      "Threat Hunting",
      "Digital Forensics",
      "Legal Hold",
      "Chain of Custody",
      "Acquisition",
      "Forensic Reporting",
      "Preservation",
      "E-Discovery"
    ],
    miniCheckPrompt: "An incident team first disconnects an infected server from the network to stop lateral movement. After acquiring the required evidence, the team removes the malware and its persistence mechanisms from the server.",
    miniCheckAnswers: {
      "spread-limiting-action": "Containment",
      "threat-removal-action": "Eradication"
    },
    blueprintMappings: {
      "Process": "incident-response-process",
      "Preparation": "preparation",
      "Detection": "detection-and-analysis",
      "Analysis": "detection-and-analysis",
      "Containment": "containment-eradication-recovery",
      "Eradication": "containment-eradication-recovery",
      "Recovery": "containment-eradication-recovery",
      "Lessons learned": "lessons-learned",
      "Training": "training-and-testing",
      "Testing": "training-and-testing",
      "Tabletop exercise": "tabletop-and-simulation",
      "Simulation": "tabletop-and-simulation",
      "Root cause analysis": "root-cause-analysis",
      "Threat hunting": "threat-hunting",
      "Digital forensics": "digital-forensics",
      "Legal hold": "legal-hold",
      "Chain of custody": "evidence-acquisition-and-preservation",
      "Acquisition": "evidence-acquisition-and-preservation",
      "Forensic reporting": "reporting-and-ediscovery",
      "Preservation": "evidence-acquisition-and-preservation",
      "E-discovery": "reporting-and-ediscovery"
    }
  },
  "4.9": {
    world: "4",
    expectedQuestionCount: 13,
    sectionIds: [
      "what-you-are-learning",
      "data-sources-and-log-data",
      "firewall-logs",
      "application-and-endpoint-logs",
      "os-security-logs",
      "ids-ips-logs",
      "network-logs",
      "metadata",
      "vulnerability-scans",
      "reports-and-dashboards",
      "packet-captures",
      "choosing-the-source",
      "correlating-data-sources",
      "recognition-cues",
      "exam-trap",
      "maestro-recognition-sheet"
    ],
    entryTitles: [
      "Data Sources",
      "Log Data",
      "Firewall Logs",
      "Application Logs",
      "Endpoint Logs",
      "OS-Specific Security Logs",
      "IPS/IDS Logs",
      "Network Logs",
      "Metadata",
      "Vulnerability Scans",
      "Automated Reports",
      "Dashboards",
      "Packet Captures"
    ],
    miniCheckPrompt: "An analyst must first determine whether the edge firewall allowed an outbound connection to a suspicious address. The analyst must then examine the exact network packets exchanged during that session.",
    miniCheckAnswers: {
      "connection-decision": "Firewall log",
      "wire-evidence": "Packet capture"
    },
    blueprintMappings: {
      "Log data": "data-sources-and-log-data",
      "Firewall logs": "firewall-logs",
      "Application logs": "application-and-endpoint-logs",
      "Endpoint logs": "application-and-endpoint-logs",
      "OS-specific security logs": "os-security-logs",
      "IPS/IDS logs": "ids-ips-logs",
      "Network logs": "network-logs",
      "Metadata": "metadata",
      "Data sources": "data-sources-and-log-data",
      "Vulnerability scans": "vulnerability-scans",
      "Automated reports": "reports-and-dashboards",
      "Dashboards": "reports-and-dashboards",
      "Packet captures": "packet-captures"
    }
  },
  "5.1": {
    world: "5", expectedQuestionCount: 36,
    sectionIds: ["what-you-are-learning", "governance-documents", "policy-types", "standard-and-procedure-types", "external-considerations", "governance-structures", "systems-and-data-roles", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    entryTitles: ["Guidelines", "Policies", "Acceptable use policy (AUP)", "Information security policies", "Business continuity policy", "Disaster recovery policy", "Incident response policy", "Software development lifecycle (SDLC) policy", "Change management policy", "Standards", "Password standard", "Access control standard", "Physical security standard", "Encryption standard", "Procedures", "Change management procedure", "Onboarding/offboarding procedure", "Playbooks", "External considerations", "Regulatory", "Legal", "Industry", "Local/regional", "National", "Global", "Monitoring and revision", "Types of governance structures", "Boards", "Committees", "Government entities", "Centralized/decentralized", "Roles and responsibilities for systems and data", "Owners", "Controllers", "Processors", "Custodians/stewards"],
    miniCheckPrompt: "Leadership requires every system to use approved encryption algorithms. A separate document gives administrators the exact steps for applying the approved configuration.",
    miniCheckAnswers: { "mandatory-requirement": "Encryption standard", "implementation-steps": "Procedure" },
    blueprintMappings: Object.fromEntries([
      [["Guidelines", "Policies", "Standards", "Procedures", "Playbooks"], "governance-documents"],
      [["Acceptable use policy (AUP)", "Information security policies", "Business continuity policy", "Disaster recovery policy", "Incident response policy", "Software development lifecycle (SDLC) policy", "Change management policy"], "policy-types"],
      [["Password standard", "Access control standard", "Physical security standard", "Encryption standard", "Change management procedure", "Onboarding/offboarding procedure"], "standard-and-procedure-types"],
      [["External considerations", "Regulatory", "Legal", "Industry", "Local/regional", "National", "Global", "Monitoring and revision"], "external-considerations"],
      [["Types of governance structures", "Boards", "Committees", "Government entities", "Centralized/decentralized"], "governance-structures"],
      [["Roles and responsibilities for systems and data", "Owners", "Controllers", "Processors", "Custodians/stewards"], "systems-and-data-roles"]
    ].flatMap(([items, section]) => items.map(item => [item, section])))
  },
  "5.2": {
    world: "5", expectedQuestionCount: 38,
    sectionIds: ["what-you-are-learning", "identification-and-assessment", "risk-analysis", "risk-tracking", "risk-strategies", "reporting-and-impact", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    entryTitles: ["Risk identification", "Risk assessment", "Ad hoc", "Recurring", "One-time", "Continuous", "Risk analysis", "Qualitative", "Quantitative", "Single loss expectancy (SLE)", "Annualized loss expectancy (ALE)", "Annualized rate of occurrence (ARO)", "Probability", "Likelihood", "Exposure factor", "Impact", "Risk register", "Key risk indicators", "Risk owners", "Risk threshold", "Risk tolerance", "Risk appetite", "Expansionary", "Conservative", "Neutral", "Risk management strategies", "Transfer", "Accept", "Exemption", "Exception", "Avoid", "Mitigate", "Risk reporting", "Business impact analysis", "Recovery time objective (RTO)", "Recovery point objective (RPO)", "Mean time to repair (MTTR)", "Mean time between failures (MTBF)"],
    miniCheckPrompt: "A business can tolerate no more than four hours before a critical service is restored, and it can accept losing no more than fifteen minutes of recently created data.",
    miniCheckAnswers: { "restore-window": "Recovery time objective (RTO)", "data-loss-window": "Recovery point objective (RPO)" },
    blueprintMappings: Object.fromEntries([
      [["Risk identification", "Risk assessment", "Ad hoc", "Recurring", "One-time", "Continuous"], "identification-and-assessment"],
      [["Risk analysis", "Qualitative", "Quantitative", "Single loss expectancy (SLE)", "Annualized loss expectancy (ALE)", "Annualized rate of occurrence (ARO)", "Probability", "Likelihood", "Exposure factor", "Impact"], "risk-analysis"],
      [["Risk register", "Key risk indicators", "Risk owners", "Risk threshold", "Risk tolerance", "Risk appetite", "Expansionary", "Conservative", "Neutral"], "risk-tracking"],
      [["Risk management strategies", "Transfer", "Accept", "Exemption", "Exception", "Avoid", "Mitigate"], "risk-strategies"],
      [["Risk reporting", "Business impact analysis", "Recovery time objective (RTO)", "Recovery point objective (RPO)", "Mean time to repair (MTTR)", "Mean time between failures (MTBF)"], "reporting-and-impact"]
    ].flatMap(([items, section]) => items.map(item => [item, section])))
  },
  "5.3": {
    world: "5", expectedQuestionCount: 20,
    sectionIds: ["what-you-are-learning", "vendor-assessment", "vendor-selection", "agreement-types", "vendor-monitoring", "questionnaires-and-rules-of-engagement", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    entryTitles: ["Vendor assessment", "Penetration testing", "Right-to-audit clause", "Evidence of internal audits", "Independent assessments", "Supply chain analysis", "Vendor selection", "Due diligence", "Conflict of interest", "Agreement types", "Service-level agreement (SLA)", "Memorandum of agreement (MOA)", "Memorandum of understanding (MOU)", "Master service agreement (MSA)", "Work order/statement of work (WO/SOW)", "Non-disclosure agreement (NDA)", "Business partners agreement (BPA)", "Vendor monitoring", "Questionnaires", "Rules of engagement"],
    miniCheckPrompt: "A customer contract allows the customer to inspect a cloud provider's controls. Before a penetration test begins, a separate document defines the permitted systems, testing window, and stop conditions.",
    miniCheckAnswers: { "inspection-permission": "Right-to-audit clause", "testing-boundaries": "Rules of engagement" },
    blueprintMappings: Object.fromEntries([
      [["Vendor assessment", "Penetration testing", "Right-to-audit clause", "Evidence of internal audits", "Independent assessments", "Supply chain analysis"], "vendor-assessment"],
      [["Vendor selection", "Due diligence", "Conflict of interest"], "vendor-selection"],
      [["Agreement types", "Service-level agreement (SLA)", "Memorandum of agreement (MOA)", "Memorandum of understanding (MOU)", "Master service agreement (MSA)", "Work order/statement of work (WO/SOW)", "Non-disclosure agreement (NDA)", "Business partners agreement (BPA)"], "agreement-types"],
      [["Vendor monitoring"], "vendor-monitoring"],
      [["Questionnaires", "Rules of engagement"], "questionnaires-and-rules-of-engagement"]
    ].flatMap(([items, section]) => items.map(item => [item, section])))
  },
  "5.4": {
    world: "5", expectedQuestionCount: 24,
    sectionIds: ["what-you-are-learning", "compliance-reporting", "consequences-of-non-compliance", "compliance-monitoring", "privacy-and-legal-implications", "privacy-roles-records-and-rights", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    entryTitles: ["Compliance reporting", "Internal reporting", "External reporting", "Consequences of non-compliance", "Fines", "Sanctions", "Reputational damage", "Loss of license", "Contractual impacts", "Compliance monitoring", "Due diligence/care", "Attestation and acknowledgement", "Internal and external monitoring", "Automation", "Privacy", "Legal implications", "Local/regional privacy", "National privacy", "Global privacy", "Data subject", "Controller vs. processor", "Ownership", "Data inventory and retention", "Right to be forgotten"],
    miniCheckPrompt: "A retailer decides why customer purchase histories will be analyzed and which uses are permitted. It hires a cloud analytics provider to process that data only under the retailer's instructions.",
    miniCheckAnswers: { "decision-party": "Controller", "service-party": "Processor" },
    blueprintMappings: Object.fromEntries([
      [["Compliance reporting", "Internal reporting", "External reporting"], "compliance-reporting"],
      [["Consequences of non-compliance", "Fines", "Sanctions", "Reputational damage", "Loss of license", "Contractual impacts"], "consequences-of-non-compliance"],
      [["Compliance monitoring", "Due diligence/care", "Attestation and acknowledgement", "Internal and external monitoring", "Automation"], "compliance-monitoring"],
      [["Privacy", "Legal implications", "Local/regional privacy", "National privacy", "Global privacy"], "privacy-and-legal-implications"],
      [["Data subject", "Controller vs. processor", "Ownership", "Data inventory and retention", "Right to be forgotten"], "privacy-roles-records-and-rights"]
    ].flatMap(([items, section]) => items.map(item => [item, section])))
  },
  "5.5": {
    world: "5", expectedQuestionCount: 21,
    sectionIds: ["what-you-are-learning", "attestation", "internal-audits-and-assessments", "external-audits-and-assessments", "penetration-testing", "knowledge-levels", "reconnaissance", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    entryTitles: ["Attestation", "Internal assessments", "Compliance assessment", "Audit committee", "Self-assessments", "External assessments", "Regulatory audit", "Examinations", "Assessment", "Independent third-party audit", "Penetration testing", "Physical penetration test", "Offensive penetration test", "Defensive penetration test", "Integrated penetration test", "Known environment", "Partially known environment", "Unknown environment", "Reconnaissance", "Passive reconnaissance", "Active reconnaissance"],
    miniCheckPrompt: "An authorized penetration-testing team receives network diagrams and selected system details, but not complete target information. The team then probes hosts and services to discover what is reachable.",
    miniCheckAnswers: { "knowledge-level": "Partially known environment", "recon-method": "Active reconnaissance" },
    blueprintMappings: Object.fromEntries([
      [["Attestation"], "attestation"],
      [["Internal assessments", "Compliance assessment", "Audit committee", "Self-assessments"], "internal-audits-and-assessments"],
      [["External assessments", "Regulatory audit", "Examinations", "Assessment", "Independent third-party audit"], "external-audits-and-assessments"],
      [["Penetration testing", "Physical penetration test", "Offensive penetration test", "Defensive penetration test", "Integrated penetration test"], "penetration-testing"],
      [["Known environment", "Partially known environment", "Unknown environment"], "knowledge-levels"],
      [["Reconnaissance", "Passive reconnaissance", "Active reconnaissance"], "reconnaissance"]
    ].flatMap(([items, section]) => items.map(item => [item, section])))
  }
};

function loadJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(label + " JSON parse failure: " + error.message);
    return null;
  }
}

function validateLesson(objective, definition) {
  const world = definition.world || "1";
  const lessonPath = path.join(fieldManualRoot, objective + ".json");
  const bankPath = path.join(root, "json", "security-plus", "world" + world, objective + "-hatchling.json");
  const lesson = loadJson(lessonPath, "Objective " + objective + " Field Manual");
  const rawBank = loadJson(bankPath, "Objective " + objective + " Sweep bank");
  const bank = Array.isArray(rawBank) ? rawBank : rawBank?.questions;
  if (!lesson) return;

  requireValue(lesson.schemaVersion === 1, "Objective " + objective + " schemaVersion must be 1.");
  requireValue(lesson.certification === "security-plus", "Objective " + objective + " certification must be security-plus.");
  requireValue(lesson.examCode === "SY0-701", "Objective " + objective + " exam code must be SY0-701.");
  requireValue(
    lesson.world === world && lesson.objective === objective,
    "Objective " + objective + " route metadata must match World " + world + "."
  );
  requireValue(Array.isArray(lesson.sections), "Objective " + objective + " sections must be an array.");

  const sectionIds = new Set((lesson.sections || []).map(section => section.id));
  requireValue(
    sectionIds.size === (lesson.sections || []).length,
    "Objective " + objective + " contains repeated section IDs."
  );
  definition.sectionIds.forEach(id => {
    requireValue(sectionIds.has(id), "Objective " + objective + " is missing teaching section: " + id);
  });

  const entries = (lesson.sections || []).flatMap(section => section.entries || []);
  const entryTitles = new Set(entries.map(entry => entry.title));
  definition.entryTitles.forEach(title => {
    requireValue(entryTitles.has(title), "Objective " + objective + " is missing lesson concept: " + title);
  });

  const miniCheck = lesson.miniCheck || {};
  requireValue(
    miniCheck.prompt === definition.miniCheckPrompt,
    "Objective " + objective + " Mini Check prompt does not match the approved lesson check."
  );
  const answers = Object.fromEntries((miniCheck.fields || []).map(field => [field.id, field.answer]));
  Object.entries(definition.miniCheckAnswers).forEach(([fieldId, answer]) => {
    requireValue(
      answers[fieldId] === answer,
      "Objective " + objective + " Mini Check answer for " + fieldId + " must be " + answer + "."
    );
  });
  requireValue(
    Array.isArray(bank) && bank.length === definition.expectedQuestionCount,
    "Objective " + objective + " Sweep bank must contain exactly " + definition.expectedQuestionCount + " questions."
  );
  if (Array.isArray(bank) && definition.blueprintMappings) {
    const publishedBlueprints = Object.keys(definition.blueprintMappings);
    const bankBlueprintCounts = bank.reduce((counts, question) => {
      counts[question.blueprint] = (counts[question.blueprint] || 0) + 1;
      return counts;
    }, {});
    publishedBlueprints.forEach(blueprint => {
      requireValue(
        bankBlueprintCounts[blueprint] === 1,
        "Objective " + objective + " Sweep mapping must appear exactly once: " + blueprint
      );
      requireValue(
        sectionIds.has(definition.blueprintMappings[blueprint]),
        "Objective " + objective + " teaching anchor is missing for mapping: " + blueprint
      );
    });
    Object.keys(bankBlueprintCounts).forEach(blueprint => {
      requireValue(
        Object.prototype.hasOwnProperty.call(definition.blueprintMappings, blueprint),
        "Objective " + objective + " contains an extra Sweep mapping: " + blueprint
      );
    });
  }
}

Object.entries(lessonDefinitions).forEach(([objective, definition]) => validateLesson(objective, definition));

const world1Hub = fs.readFileSync(world1HubPath, "utf8");
const world2Hub = fs.readFileSync(world2HubPath, "utf8");
const world3Hub = fs.readFileSync(world3HubPath, "utf8");
const world4Hub = fs.readFileSync(world4HubPath, "utf8");
const world5Hub = fs.readFileSync(world5HubPath, "utf8");
const campaign = fs.readFileSync(campaignPath, "utf8");
const quiz = fs.readFileSync(quizPath, "utf8");
const manualPage = fs.readFileSync(manualPagePath, "utf8");
const manualScript = fs.readFileSync(manualScriptPath, "utf8");

requireValue(
  campaign.includes('href="security-plus-world1-objectives.html" class="world world1 unlocked"'),
  "Campaign Map World 1 does not route directly to the Objective Hub."
);
["1.1", "1.2", "1.3", "1.4"].forEach(objective => {
  requireValue(
    world1Hub.includes('security-plus-field-manual.html?world=1&amp;objective=' + objective),
    "Objective Hub is missing the Objective " + objective + " Field Manual action."
  );
  requireValue(
    world1Hub.includes('security-plus-quiz.html?world=1&amp;objective=' + objective),
    "Objective Hub is missing the direct Objective " + objective + " Sweep action."
  );
});
requireValue(
  world1Hub.includes('data-world-progress="1" data-questions="111"'),
  "Objective Hub does not preserve the verified World 1 question total."
);
requireValue(
  campaign.includes('href="security-plus-world2-objectives.html" class="world world2 unlocked"'),
  "Campaign Map World 2 does not route directly to the Objective Hub."
);
["2.1", "2.2", "2.3", "2.4", "2.5"].forEach(objective => {
  requireValue(
    world2Hub.includes('security-plus-field-manual.html?world=2&amp;objective=' + objective),
    "World 2 Objective Hub is missing the Objective " + objective + " Field Manual action."
  );
  requireValue(
    world2Hub.includes('security-plus-quiz.html?world=2&amp;objective=' + objective),
    "World 2 Objective Hub is missing the direct Objective " + objective + " Sweep action."
  );
});
requireValue(
  world2Hub.includes('data-world-progress="2" data-questions="150"'),
  "World 2 Objective Hub does not preserve the verified 150-question total."
);
requireValue(
  campaign.includes('href="security-plus-world3-objectives.html" class="world world3 unlocked"'),
  "Campaign Map World 3 does not route directly to the Objective Hub."
);
["3.1", "3.2", "3.3", "3.4"].forEach(objective => {
  requireValue(
    world3Hub.includes('security-plus-field-manual.html?world=3&amp;objective=' + objective),
    "World 3 Objective Hub is missing the Objective " + objective + " Field Manual action."
  );
  requireValue(
    world3Hub.includes('security-plus-quiz.html?world=3&amp;objective=' + objective),
    "World 3 Objective Hub is missing the direct Objective " + objective + " Sweep action."
  );
});
requireValue(
  world3Hub.includes('data-world-progress="3" data-questions="129"'),
  "World 3 Objective Hub does not preserve the verified 129-question total."
);
requireValue(
  campaign.includes('href="security-plus-world4-objectives.html" class="world world4 unlocked"'),
  "Campaign Map World 4 does not route directly to the Objective Hub."
);
["4.1", "4.2", "4.3", "4.4", "4.5", "4.6", "4.7", "4.8", "4.9"].forEach(objective => {
  requireValue(
    world4Hub.includes('security-plus-field-manual.html?world=4&amp;objective=' + objective),
    "World 4 Objective Hub is missing the Objective " + objective + " Field Manual action."
  );
  requireValue(
    world4Hub.includes('security-plus-quiz.html?world=4&amp;objective=' + objective),
    "World 4 Objective Hub is missing the direct Objective " + objective + " Sweep action."
  );
});
requireValue(
  world4Hub.includes('data-world-progress="4" data-questions="246"'),
  "World 4 Objective Hub does not preserve the verified 246-question total."
);
requireValue(
  campaign.includes('href="security-plus-world5-objectives.html" class="world world5 unlocked"'),
  "Campaign Map World 5 does not route directly to the Objective Hub."
);
["5.1", "5.2", "5.3", "5.4", "5.5"].forEach(objective => {
  requireValue(world5Hub.includes('security-plus-field-manual.html?world=5&amp;objective=' + objective), "World 5 Objective Hub is missing the Objective " + objective + " Field Manual action.");
  requireValue(world5Hub.includes('security-plus-quiz.html?world=5&amp;objective=' + objective), "World 5 Objective Hub is missing the direct Objective " + objective + " Sweep action.");
});
requireValue(world5Hub.includes('data-world-progress="5" data-questions="157"'), "World 5 Objective Hub does not preserve the verified 157-question total.");
requireValue(
  quiz.includes('<script src="security-plus-quiz.js"></script>'),
  "Security+ quiz page no longer loads the existing quiz engine."
);
requireValue(
  manualPage.includes('id="securityManualNavigation"') &&
    manualScript.includes("function renderNavigation()"),
  "The shared Field Manual renderer is missing large-lesson navigation."
);
if (errors.length) {
  console.error("Security+ Field Manual validation: FAIL");
  errors.forEach(error => console.error("- " + error));
  process.exitCode = 1;
} else {
  console.log("Security+ Field Manual validation: PASS");
  console.log("- Objective 1.1 lesson, Mini Check, and 12-question Sweep: PASS");
  console.log("- Objective 1.2 lesson, Mini Check, and 36-question Sweep: PASS");
  console.log("- Objective 1.3 lesson, Mini Check, and 21-question Sweep: PASS");
  console.log("- Objective 1.4 lesson, Mini Check, and 42-question Sweep: PASS");
  console.log("- Objective 2.1 lesson, Mini Check, and 22-question Sweep: PASS");
  console.log("- Objective 2.2 lesson, Mini Check, and 32-question Sweep: PASS");
  console.log("- Objective 2.2 published teaching/Sweep mappings: 32 of 32 (100%)");
  console.log("- Objective 2.3 lesson, Mini Check, and 29-question Sweep: PASS");
  console.log("- Objective 2.3 published teaching/Sweep mappings: 29 of 29 (100%)");
  console.log("- Objective 2.4 lesson, Mini Check, and 47-question Sweep: PASS");
  console.log("- Objective 2.4 published teaching/Sweep mappings: 47 of 47 (100%)");
  console.log("- Objective 2.5 lesson, Mini Check, and 20-question Sweep: PASS");
  console.log("- Objective 2.5 published teaching/Sweep mappings: 20 of 20 (100%)");
  console.log("- Objective 3.1 lesson, Mini Check, and 35-question Sweep: PASS");
  console.log("- Objective 3.1 published teaching/Sweep mappings: 35 of 35 (100%)");
  console.log("- Objective 3.2 lesson, Mini Check, and 34-question Sweep: PASS");
  console.log("- Objective 3.2 published teaching/Sweep mappings: 34 of 34 (100%)");
  console.log("- Objective 3.3 lesson, Mini Check, and 30-question Sweep: PASS");
  console.log("- Objective 3.3 published teaching/Sweep mappings: 30 of 30 (100%)");
  console.log("- Objective 3.4 lesson, Mini Check, and 30-question Sweep: PASS");
  console.log("- Objective 3.4 published teaching/Sweep mappings: 30 of 30 (100%)");
  console.log("- Objective 4.1 lesson, Mini Check, and 41-question Sweep: PASS");
  console.log("- Objective 4.1 published teaching/Sweep mappings: 41 of 41 (100%)");
  console.log("- Objective 4.2 lesson, Mini Check, and 12-question Sweep: PASS");
  console.log("- Objective 4.2 published teaching/Sweep mappings: 12 of 12 (100%)");
  console.log("- Objective 4.3 lesson, Mini Check, and 38-question Sweep: PASS");
  console.log("- Objective 4.3 published teaching/Sweep mappings: 38 of 38 (100%)");
  console.log("- Objective 4.4 lesson, Mini Check, and 23-question Sweep: PASS");
  console.log("- Objective 4.4 published teaching/Sweep mappings: 23 of 23 (100%)");
  console.log("- Objective 4.5 lesson, Mini Check, and 33-question Sweep: PASS");
  console.log("- Objective 4.5 published teaching/Sweep mappings: 33 of 33 (100%)");
  console.log("- Objective 4.6 lesson, Mini Check, and 41-question Sweep: PASS");
  console.log("- Objective 4.6 published teaching/Sweep mappings: 41 of 41 (100%)");
  console.log("- Objective 4.7 lesson, Mini Check, and 24-question Sweep: PASS");
  console.log("- Objective 4.7 published teaching/Sweep mappings: 24 of 24 (100%)");
  console.log("- Objective 4.8 lesson, Mini Check, and 21-question Sweep: PASS");
  console.log("- Objective 4.8 published teaching/Sweep mappings: 21 of 21 (100%)");
  console.log("- Objective 4.9 lesson, Mini Check, and 13-question Sweep: PASS");
  console.log("- Objective 4.9 published teaching/Sweep mappings: 13 of 13 (100%)");
  console.log("- Objective 5.1 lesson, Mini Check, and 36-question Sweep: PASS");
  console.log("- Objective 5.1 published teaching/Sweep mappings: 36 of 36 (100%)");
  console.log("- Objective 5.2 lesson, Mini Check, and 38-question Sweep: PASS");
  console.log("- Objective 5.2 published teaching/Sweep mappings: 38 of 38 (100%)");
  console.log("- Objective 5.3 lesson, Mini Check, and 20-question Sweep: PASS");
  console.log("- Objective 5.3 published teaching/Sweep mappings: 20 of 20 (100%)");
  console.log("- Objective 5.4 lesson, Mini Check, and 24-question Sweep: PASS");
  console.log("- Objective 5.4 published teaching/Sweep mappings: 24 of 24 (100%)");
  console.log("- Objective 5.5 lesson, Mini Check, and 21-question Sweep: PASS");
  console.log("- Objective 5.5 published teaching/Sweep mappings: 21 of 21 (100%)");
  console.log("- Shared always-visible lesson navigation: PASS");
  console.log("- Campaign → World 1 through World 5 Objective Hub routes: PASS");
  console.log("- Direct Objective Sweep actions: PASS");
  console.log("- World 4 Objectives 4.1–4.9 Field Manual and direct Sweep actions: PASS");
  console.log("- World 5 Objectives 5.1–5.5 Field Manual and direct Sweep actions: PASS");
}
