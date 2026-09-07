const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const errors = [];
const requireValue = (condition, message) => { if (!condition) errors.push(message); };
const read = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");
const json = relativePath => JSON.parse(read(relativePath));

const objectives = {
  "1.1": {
    count: 21,
    hash: "F8BF400E3881721C43DB741E82F44ED6E0E9E7AF6896AF561180F16055ACD6F7",
    firstId: "A1202-1.1-R001",
    sections: ["what-you-are-learning", "maestro-focus", "workstation-operating-systems", "workstation-comparison", "mobile-operating-systems", "filesystems-overview", "windows-filesystems", "linux-filesystems", "apple-and-portable-filesystems", "filesystem-comparison", "vendor-life-cycle-limitations", "compatibility-concerns", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Windows", "Linux", "macOS", "Chrome OS", "iPadOS", "iOS", "Android", "New Technology File System (NTFS)", "Resilient File System (ReFS)", "File Allocation Table 32 (FAT32)", "Fourth Extended Filesystem (ext4)", "Extended Filesystem (XFS)", "Apple File System (APFS)", "Extensible File Allocation Table (exFAT)", "End-of-Life (EOL)", "Update Limitations", "Compatibility Concerns Between Operating Systems"]
  },
  "1.2": {
    count: 28,
    hash: "F8F229392FA5E257A68849AEF9DF73C80EE52DF77B0FBDF9903976F95B7BB47D",
    firstId: "A1202-1.2-R001",
    sections: ["what-you-are-learning", "maestro-focus", "boot-methods", "installation-types", "deployment-methods", "recovery-and-repair", "partitioning", "drive-format", "upgrade-considerations", "feature-updates", "installation-decision-map", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Universal Serial Bus (USB)", "Network", "Solid-State/Flash Drives", "Internet-Based", "External/Hot-Swappable Drive", "Internal Hard Drive Partition", "Multiboot", "Clean Install", "Upgrade", "Image Deployment", "Remote Network Installation", "Zero-Touch Deployment", "Recovery Partition", "Repair Installation", "Third-Party Drivers", "GUID Partition Table (GPT)", "Master Boot Record (MBR)", "Drive Format", "Back Up Files and User Preferences", "Application and Driver Support / Backward Compatibility", "Hardware Compatibility", "Feature Updates", "Product Life Cycle"]
  },
  "1.3": {
    count: 23,
    hash: "7FB75570A1140605354D1BDC524B3505D7C9DB2B67B552EE1FD4942A63EDA3BF",
    firstId: "A1202-1.3-R001",
    sections: ["what-you-are-learning", "maestro-focus", "windows-10-editions", "windows-11-editions", "n-versions", "domain-and-workgroup", "desktop-styles-and-ui", "rdp-and-ram", "security-and-policy-features", "upgrade-paths", "hardware-requirements", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Windows 10 Home", "Windows 10 Pro", "Windows 10 Pro for Workstations", "Windows 10 Enterprise", "Windows 11 Home", "Windows 11 Pro", "Windows 11 Enterprise", "N Versions", "Domain vs. Workgroup", "Desktop Styles and User Interface", "Remote Desktop Protocol (RDP)", "Random-Access Memory (RAM) Support Limitations", "BitLocker", "gpedit.msc", "In-Place Upgrade", "Clean Install", "Trusted Platform Module (TPM)", "Unified Extensible Firmware Interface (UEFI)"]
  },
  "1.4": {
    count: 22,
    hash: "3B5EDA8C368ED8A93474F79B11023C2D96ACBE956A840F5F32055D35CAE6CB4F",
    firstId: "A1202-1.4-R001",
    sections: ["what-you-are-learning", "maestro-focus", "task-manager", "microsoft-management-console", "event-viewer", "disk-management", "task-scheduler", "device-manager", "certificate-manager", "local-users-and-groups", "performance-monitor", "group-policy-editor", "additional-tools", "monitoring-tool-comparison", "tool-comparisons", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Task Manager", "Services", "Startup", "Performance", "Processes", "Users", "Microsoft Management Console (MMC) Snap-Ins", "Event Viewer — eventvwr.msc", "Disk Management — diskmgmt.msc", "Task Scheduler — taskschd.msc", "Device Manager — devmgmt.msc", "Certificate Manager — certmgr.msc", "Local User and Groups — lusrmgr.msc", "Performance Monitor — perfmon.msc", "Group Policy Editor — gpedit.msc", "Additional Windows Tools", "System Information — msinfo32.exe", "Resource Monitor — resmon.exe", "System Configuration — msconfig.exe", "Disk Cleanup — cleanmgr.exe", "Disk Defragment — dfrgui.exe", "Registry Editor — regedit.exe"]
  },
  "1.5": {
    count: 29,
    hash: "5CF898998DBB7E9AB15A6BD17267B177DD769754FF32C649BA8F5927ECCABDA9",
    firstId: "A1202-1.5-R001",
    sections: ["what-you-are-learning", "maestro-focus", "navigation", "network", "network-comparisons", "disk-management", "file-management", "informational", "os-management", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Navigation", "cd", "dir", "Network", "ipconfig", "ping", "netstat", "nslookup", "net use", "tracert", "pathping", "Disk Management", "chkdsk", "format", "diskpart", "File Management", "md", "rmdir", "robocopy", "Informational", "hostname", "net user", "winver", "whoami", "[command name] /?", "OS Management", "gpupdate", "gpresult", "sfc"]
  },
  "1.6": {
    count: 36,
    hash: "C990249900192F94DDC95E7FB883055E8A44EEF0EE13748C9F0F9E251A6A0047",
    firstId: "A1202-1.6-R001",
    sections: ["what-you-are-learning", "maestro-focus", "control-panel-settings", "file-explorer-options", "power-options", "modern-settings", "control-panel-vs-settings", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Internet Options", "Devices and Printers", "Program and Features", "Network and Sharing Center", "System (Control Panel)", "Windows Defender Firewall", "Mail", "Sound", "User Accounts", "Device Manager", "Indexing Options", "Administrative Tools", "File Explorer Options", "View Hidden Files", "Hide Extensions", "General Options", "View Options", "Power Options", "Hibernate", "Power Plans", "Sleep/Suspend", "Standby", "Choose What Closing the Lid Does", "Turn On Fast Startup", "USB Selective Suspend", "Ease of Access", "Time and Language", "Update and Security", "Personalization", "Apps", "Privacy", "System (Windows Settings)", "Devices", "Network and Internet", "Gaming", "Accounts"]
  },
  "1.7": {
    count: 23,
    hash: "AC0C902348869418A28A243A870FFE6220132C8B2E58325EE8BA5F56F4C7FB95",
    firstId: "A1202-1.7-R001",
    sections: ["what-you-are-learning", "maestro-focus", "domain-vs-workgroup", "shared-resources", "local-os-firewall", "client-network-configuration", "establish-network-connections", "proxy-settings", "public-vs-private", "network-paths", "metered-connections", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Domain Joined vs. Workgroup", "Shared Resources", "Printers", "File Servers", "Mapped Drives", "Local OS Firewall Settings", "Application Restrictions and Exceptions", "Configuration", "Client Network Configuration", "Internet Protocol (IP) Addressing Scheme", "Domain Name System (DNS) Settings", "Subnet Mask", "Gateway", "Static vs. Dynamic", "Establish Network Connections", "Virtual Private Network (VPN)", "Wireless", "Wired", "Wireless Wide Area Network (WWAN)/Cellular Network", "Proxy Settings", "Public Network vs. Private Network", "File Explorer Navigation—Network Paths", "Metered Connections and Limitations"]
  },
  "1.8": {
    count: 44,
    hash: "B6290D828EECAAC23CFC5B29B9A0116D3FB44E36247C4D131D24C032F35BCF02",
    firstId: "A1202-1.8-R001",
    sections: ["what-you-are-learning", "maestro-focus", "application-installation", "system-folders", "apple-id-and-restrictions", "best-practices", "system-preferences", "desktop-features", "icloud", "disk-utility", "filevault", "terminal", "force-quit", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Installation and Uninstallation of Applications", "File Types", ".dmg", ".pkg", ".app", "App Store", "Uninstallation Process", "System Folders", "/Applications", "/Users", "/Library", "/System", "/Users/<username>/Library", "Apple ID and Corporate Restrictions", "Best Practices", "Backups", "Antivirus", "Updates/Patches", "Rapid Security Response (RSR)", "System Preferences", "Displays", "Networks", "Printers", "Scanners", "Privacy", "Accessibility", "Time Machine", "Multiple Desktops", "Mission Control", "Keychain", "Spotlight", "iCloud", "iMessage", "FaceTime", "Drive", "Gestures", "Finder", "Dock", "Continuity", "Disk Utility", "FileVault", "Terminal", "Force Quit"]
  }
};

for (const [objective, expected] of Object.entries(objectives)) {
  const lesson = json(`json/aplus-core2/field-manual/${objective}.json`);
  const bankPath = path.join(root, `json/aplus-core2/world1/${objective}-hatchling.json`);
  const bankBytes = fs.readFileSync(bankPath);
  const bank = JSON.parse(bankBytes.toString("utf8"));
  const hash = crypto.createHash("sha256").update(bankBytes).digest("hex").toUpperCase();
  const sectionIds = (lesson.sections || []).map(section => section.id);
  const lessonText = JSON.stringify(lesson);

  requireValue(lesson.schemaVersion === 1, `${objective} schemaVersion must be 1.`);
  requireValue(lesson.certification === "aplus-core2" && lesson.examCode === "220-1202", `${objective} metadata must match A+ Core 2 220-1202.`);
  requireValue(lesson.world === "1" && lesson.objective === objective, `${objective} route metadata must match World 1.`);
  requireValue(lesson.miniCheckSource === "objective-sweep-bank", `${objective} must use the GSA-owned Mini Check source.`);
  requireValue(!Object.prototype.hasOwnProperty.call(lesson, "miniCheck"), `${objective} lesson data must not author a Mini Check question.`);
  requireValue(sectionIds.length === new Set(sectionIds).size, `${objective} section IDs must be unique.`);
  expected.sections.forEach(id => requireValue(sectionIds.includes(id), `${objective} is missing section: ${id}`));
  expected.topics.forEach(topic => requireValue(lessonText.toLowerCase().includes(topic.toLowerCase()), `${objective} is missing required topic: ${topic}`));
  requireValue(Array.isArray(bank) && bank.length === expected.count, `${objective} protected Sweep bank must contain exactly ${expected.count} questions.`);
  requireValue(bank[0]?.id === expected.firstId, `${objective} Mini Check source must remain the first protected bank question.`);
  requireValue(hash === expected.hash, `${objective} protected Sweep bank bytes changed.`);
}

const hub = read("aplus-core2-world1-objectives.html");
const campaign = read("aplus-core2-campaign.html");
const manualPage = read("aplus-core2-field-manual.html");
const manualScript = read("aplus-core2-field-manual.js");
const hubScript = read("aplus-core2-objective-hub.js");
const quizScript = read("aplus-core2-quiz.js");

requireValue(campaign.includes('href="aplus-core2-world1-objectives.html" class="world world1 unlocked"'), "Campaign World 1 must route to its Objective Hub.");
for (const objective of Object.keys(objectives)) {
  requireValue(hub.includes(`aplus-core2-field-manual.html?world=1&amp;objective=${objective}`), `World 1 Hub is missing the ${objective} Field Manual action.`);
  requireValue(hub.includes(`aplus-core2-quiz.html?world=1&amp;objective=${objective}`), `${objective} Sweep route changed unexpectedly.`);
}
requireValue(hub.includes('href="security-plus-field-manual.css"') && hub.includes('src="aplus-core2-objective-hub.js"'), "World 1 Hub must use the established Field Manual card presentation and status engine.");
requireValue(hub.includes('href="aplus-core2-campaign.html" class="back-link">← Return to Campaign Map</a>'), "World 1 Hub must return to the A+ Core 2 Campaign Map.");
requireValue(manualPage.includes('id="aplusManualNavigation"') && manualScript.includes("function renderNavigation()"), "The Field Manual is missing lesson navigation.");
requireValue(manualScript.includes('const MANUAL_KEY = "hydra-aplus-core2-field-manual-v1"'), "Manual completion storage must remain isolated.");
requireValue(hubScript.includes('const PROGRESS_KEY = "hydra-aplus-core2-progress-v1"'), "The Objective Hub must read the existing Sweep progress key.");
requireValue(manualScript.includes('"json/aplus-core2/world" + world + "/" + objective + "-hatchling.json"'), "Mini Check must load the existing Sweep bank at runtime.");
requireValue(manualScript.includes('window.location.assign("aplus-core2-quiz.html?world="'), "Completing a manual must continue to the existing Objective Sweep.");
requireValue(manualScript.includes('elements.returnLink.href = "aplus-core2-world" + world + "-objectives.html"'), "Field Manuals must return to their Objective Hub.");
requireValue(quizScript.includes('return { href: `aplus-core2-world${world}-objectives.html`, label: `Return to World ${world}` };'), "Objective Sweeps must continue returning to their Objective Hub.");

if (errors.length) {
  console.error("A+ Core 2 Field Manual validation: FAIL");
  errors.forEach(error => console.error("- " + error));
  process.exitCode = 1;
} else {
  console.log("A+ Core 2 Field Manual validation: PASS");
  for (const [objective, expected] of Object.entries(objectives)) {
    console.log(`- Objective ${objective} official mappings: ${expected.count} of ${expected.count} (100%)`);
    console.log(`- Objective ${objective} lesson architecture and ${expected.sections.length}-section navigator: PASS`);
    console.log(`- Protected Objective ${objective} Sweep bank remains ${expected.count} questions and byte-for-byte unchanged: PASS`);
  }
  console.log("- GSA-owned Mini Checks; no new questions authored: PASS");
  console.log("- Manual completion and Sweep mastery remain separate: PASS");
  console.log("- Campaign, Objective Hub, Field Manual, and Sweep navigation: PASS");
}
