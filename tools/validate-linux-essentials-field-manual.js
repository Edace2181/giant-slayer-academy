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
    count: 14,
    hash: "64D7AF782F133B97F3F160DD800F423BA2C98B619F6FEC1E30B8E3FC6BF1001E",
    firstId: "L010-1.1-R001",
    sections: ["mission", "linux-kernel", "linux-distributions", "debian", "ubuntu", "ubuntu-lts", "red-hat", "centos", "suse-and-opensuse", "distribution-relationships", "linux-mint", "scientific-linux", "embedded-systems", "raspberry-pi", "raspbian", "pi-vs-raspbian", "android", "linux-in-the-cloud", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Distribution", "Debian", "Ubuntu", "Ubuntu LTS", "CentOS", "openSUSE", "Red Hat", "SUSE", "Linux Mint", "Scientific Linux", "Embedded Systems", "Raspberry Pi", "Raspbian", "Android", "Linux in the Cloud"]
  },
  "1.2": {
    count: 25,
    hash: "7C7D762512F90AB56A2638547C13C2BB9B8CDA22F62F3662E20750FFAA601FA1",
    firstId: "L010-1.2-R001",
    sections: ["mission", "desktop-applications", "desktop-recognition", "nextcloud-owncloud", "server-applications", "web-servers", "databases", "web-server-vs-database", "nfs", "samba", "nfs-vs-samba", "development-languages", "c-language", "java-and-javascript", "java-vs-javascript", "perl", "shell", "python", "php", "package-management", "software-repositories", "debian-package-tools", "red-hat-package-tools", "package-tool-trap", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["LibreOffice", "OpenOffice.org", "Thunderbird", "Firefox", "GIMP", "Nextcloud", "ownCloud", "Apache HTTPD", "NGINX", "MariaDB", "MySQL", "NFS", "Samba", "C", "Java", "JavaScript", "Perl", "shell", "Python", "PHP", "dpkg", "apt-get", "rpm", "yum", "repository"]
  },
  "1.3": {
    count: 14,
    hash: "E2FB2DB43AC8CC3915A877C3FBFFDE0A5FDEBD667A35CB047F34DE0C94576A8B",
    firstId: "L010-1.3-R001",
    sections: ["mission", "open-source-philosophy", "free-software", "open-source-software", "foss-and-floss", "free-software-vs-freeware", "free-software-foundation", "open-source-initiative", "copyleft", "gpl", "permissive-licenses", "bsd-licenses", "gpl-vs-bsd", "creative-commons", "open-source-business-models", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Open Source Philosophy", "Open Source Licensing", "Free Software Foundation", "Open Source Initiative", "Copyleft", "Permissive", "GPL", "BSD", "Creative Commons", "Free Software", "Open Source Software", "FOSS", "FLOSS", "Open-Source Business Models"]
  },
  "1.4": {
    count: 15,
    hash: "94694A0B56F3BC0A01A1684672BB9B322B643C8246D9195298E02604C70408C2",
    firstId: "L010-1.4-R001",
    sections: ["mission", "desktop-skills", "using-a-browser", "searching-the-web", "saving-content", "privacy-concerns", "browser-configuration", "getting-to-command-line", "terminal", "console", "command-line-value", "password-issues", "privacy-tools", "linux-in-industry", "cloud-computing", "virtualization", "cloud-vs-virtualization", "open-source-projects", "scenario-recognition", "exam-traps", "maestro-recognition-sheet", "world-one-connection"],
    topics: ["Desktop Skills", "Using a Browser", "Searching the Web", "Saving Content", "Privacy Concerns", "Browser Configuration", "Getting to the Command Line", "Terminal", "Console", "Password Issues", "Privacy Issues and Tools", "Industry Uses of Linux", "Cloud Computing", "Virtualization", "Open-Source Applications in Projects"]
  },
  "2.1": {
    world: "2", count: 10, hash: "691B4ACC3F01CDEDDB4A26BEDA2500DE6F8E05971986FD9559F1CF5CB86FCC70", firstId: "L010-2.1-R001",
    sections: ["mission", "shell", "bash", "command-line-syntax", "commands-options-arguments", "echo", "variables", "variable-assignment-trap", "environment-variables", "path", "why-path-matters", "export", "quoting", "double-quotes", "single-quotes", "quote-trap", "spaces-and-quoting", "history", "type", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Basic Shell", "Bash", "Command-Line Syntax", "Variables", "Quoting", "echo", "history", "PATH", "export", "type"]
  },
  "2.2": {
    world: "2", count: 6, hash: "B7876B3550988C641BBDE5FFEE9813FD757DA0AECBE3167E2E6B29021B416D90", firstId: "L010-2.2-R001",
    sections: ["mission", "built-in-documentation", "man", "man-navigation", "man-sections", "info", "man-vs-info", "usr-share-doc", "locate", "locate-database", "man-vs-locate", "choosing-help-source", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Man Pages", "Info Pages", "man", "info", "/usr/share/doc/", "locate"]
  },
  "2.3": {
    world: "2", count: 13, hash: "BC3164F8532E5A0589E9BBC4CC148627044C9FB04ABE0B477A97E1EABA21D7A8", firstId: "L010-2.3-R001",
    sections: ["mission", "filesystem-hierarchy", "root-directory-vs-user", "files-and-directories", "ls", "ls-long", "hidden-files", "ls-all", "hidden-vs-secure", "combining-options", "recursive-listings", "current-directory", "parent-directory", "dot-recognition", "cd", "home-directory", "tilde", "absolute-paths", "relative-paths", "absolute-vs-relative", "moving-around", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Files", "Directories", "Hidden Files and Directories", "Home Directories", "Absolute Paths", "Relative Paths", "ls", "Long Listing", "Hidden Entries", "Recursive Listings", "cd", "Current Directory", "Parent Directory", "Home", "Tilde"]
  },
  "2.4": {
    world: "2", count: 9, hash: "654051F6224C5BC6D6F874BE97FF1940FFBE2BE669F45ACBD0384589F95ADA8C", firstId: "L010-2.4-R001",
    sections: ["mission", "touch", "cp", "mv", "cp-vs-mv", "rm", "mkdir", "rmdir", "rm-vs-rmdir", "case-sensitivity", "simple-globbing", "asterisk-wildcard", "question-wildcard", "wildcard-trap", "globbing-with-commands", "safety-lesson", "simple-workspace", "scenario-recognition", "exam-traps", "maestro-recognition-sheet", "world-two-connection"],
    topics: ["Files and Directories", "touch", "cp", "mv", "rm", "mkdir", "rmdir", "Case Sensitivity", "Simple Globbing"]
  },
  "3.1": {
    world: "3", count: 11, hash: "8E2233223A7BEDBF4138BC95FC358B2C0CA8A829D9E41375A2572BC7B1C6A83F", firstId: "L010-3.1-R001",
    sections: ["mission", "archive-vs-compression", "tar", "tar-options", "creating-tar", "extracting-tar", "gzip", "tar-gzip", "bzip2", "xz", "tar-compression-options", "zip", "unzip", "tar-vs-gzip", "compression-comparison", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Files and directories", "Archives and compression", "tar", "-c", "-x", "-f", "-v", "gzip", "bzip2", "xz", "zip", "unzip", ".tar.gz", ".tar.bz2", ".tar.xz"]
  },
  "3.2": {
    world: "3", count: 15, hash: "6BD75EE3B1ADE9875913B213DC642F8DAAD49F64CD10E9375E26EFB005A56248", firstId: "L010-3.2-R001",
    sections: ["mission", "standard-streams", "cat", "less", "cat-vs-less", "head", "tail", "head-vs-tail", "grep", "sort", "cut", "wc", "pipes", "pipe-power", "output-redirection", "overwrite-warning", "append-redirection", "overwrite-vs-append", "input-redirection", "pipes-vs-redirection", "regular-expressions", "regex-dot", "character-classes", "regex-star", "glob-vs-regex-star", "question-mark-awareness", "grep-with-patterns", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Command-line pipes", "I/O redirection", "Regular Expressions", "grep", "less", "cat", "head", "tail", "sort", "cut", "wc", "STDIN", "STDOUT", "STDERR"]
  },
  "3.3": {
    world: "3", count: 10, hash: "14A7A2B8EF703B29D35D9D9E26B65EC875BA9F862C1EBD5935489D806B4E869A", firstId: "L010-3.3-R001",
    sections: ["mission", "shell-script", "why-script", "text-editors", "vi", "nano", "shebang", "bin-bash", "shebang-trap", "simple-script", "variables", "arguments", "script-name-arguments", "argument-value", "for-loops", "understanding-loop", "why-loops", "echo-in-scripts", "exit-status", "last-exit-status", "exit-status-trap", "decisions-from-results", "putting-pieces-together", "automation-connection", "scenario-recognition", "exam-traps", "maestro-recognition-sheet", "world-three-connection"],
    topics: ["Basic shell scripting", "vi", "nano", "#!", "/bin/bash", "Variables", "Arguments", "for", "echo", "Exit status", "$1", "$?"]
  },
  "4.1": {
    world: "4", count: 10, hash: "E8941C282500DB9523AAEA5BC7F98DA190D12EFA957DDE9A4607C956E12AFB8F", firstId: "L010-4.1-R001",
    sections: ["mission", "operating-system-role", "windows", "macos", "linux", "gui-vs-cli", "linux-interface-trap", "desktop-configuration", "distribution-life-cycles", "maintenance-cycles", "beta-releases", "stable-releases", "beta-vs-stable", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Windows", "OS X/macOS", "Linux", "GUI", "command line", "Desktop configuration", "Maintenance cycles", "Beta", "Stable"]
  },
  "4.2": {
    world: "4", count: 11, hash: "6C36DA734F6622D06C26634A961AEABB15E44E3C862E773F191954A84510B80E", firstId: "L010-4.2-R001",
    sections: ["mission", "motherboard", "processor", "power-supply", "optical-drives", "peripherals", "hard-disk-drives", "solid-state-drives", "hdd-vs-ssd", "partitions", "device-files", "dev-sd", "disk-vs-partition", "drivers", "why-drivers-matter", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Motherboard", "Processor", "Power Supply", "Optical Drives", "Peripherals", "HDD", "SSD", "Partitions", "/dev/sd", "Drivers"]
  },
  "4.3": {
    world: "4", count: 17, hash: "E1BB76B8E74830AE5F7D4847F474AE11580B4AF1A5511486D906CCEA9AAB7266", firstId: "L010-4.3-R001",
    sections: ["mission", "filesystem-hierarchy", "etc", "var-log", "etc-vs-var-log", "boot", "dev", "proc", "proc-processes", "sys", "proc-dev-sys", "processes", "ps", "top", "ps-vs-top", "free", "memory-runtime", "system-messaging", "syslog", "dmesg", "syslog-vs-dmesg", "logs-as-evidence", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Programs and configuration", "Processes", "Memory", "System messaging", "Logging", "ps", "top", "free", "syslog", "dmesg", "/etc/", "/var/log/", "/boot/", "/proc/", "/dev/", "/sys/"]
  },
  "4.4": {
    world: "4", count: 17, hash: "6739B4773BDB2CC7CAD12B8165312D792CAD8ABC6E74C5E3A75E91CA08686C73", firstId: "L010-4.4-R001",
    sections: ["mission", "network", "internet", "router", "ipv4", "ipv6", "ipv4-vs-ipv6", "network-interfaces", "ifconfig", "ip-addr-show", "interface-command-comparison", "routing-table", "route", "ip-route-show", "address-vs-route", "default-route", "dns", "resolv-conf", "hosts", "resolv-vs-hosts", "host-command", "ping", "ping-limitation", "netstat", "ss", "netstat-vs-ss", "lan-requirements", "troubleshooting-symptoms", "scenario-recognition", "exam-traps", "maestro-recognition-sheet"],
    topics: ["Internet", "Network", "Router", "IPv4", "IPv6", "route", "ip route show", "ifconfig", "ip addr show", "netstat", "ss", "/etc/resolv.conf", "/etc/hosts", "ping", "host"]
  },
  "5.1": {
    world: "5", count: 12, hash: "FA524D0289ABFE34BB019D188A0359DB93240B21F4024C6D922145D2D1ACE758", firstId: "L010-5.1-R001",
    sections: ["mission", "multi-user-system", "standard-users", "root", "root-security", "system-users", "user-types", "etc-passwd", "etc-shadow", "passwd-vs-shadow", "etc-group", "id-command", "who", "w-command", "who-vs-w", "last", "sudo", "su", "sudo-vs-su", "scenario-recognition", "maestro-recognition-sheet"],
    topics: ["Root", "Standard Users", "System Users", "/etc/passwd", "/etc/shadow", "/etc/group", "id", "last", "who", "w", "sudo", "su"]
  },
  "5.2": {
    world: "5", count: 10, hash: "57585212198B93F39575E0763AA702D44BACF5DF4409AD38FCC24FB6FD109ABE", firstId: "L010-5.2-R001",
    sections: ["mission", "numeric-identities", "why-uids-matter", "groups", "useradd", "groupadd", "useradd-vs-groupadd", "passwd-command", "passwd-command-vs-file", "etc-passwd", "etc-shadow", "etc-group", "etc-skel", "why-skel-matters", "creation-workflow", "account-file-connection", "scenario-recognition", "exam-traps", "maestro-recognition-sheet"],
    topics: ["User IDs", "UID", "useradd", "groupadd", "passwd", "/etc/passwd", "/etc/shadow", "/etc/group", "/etc/skel/"]
  },
  "5.3": {
    world: "5", count: 8, hash: "6D3A21A01FF77F72FA015FB08F280E1CF95E46E7AE33383B793CAE8C3A451D8C", firstId: "L010-5.3-R001",
    sections: ["mission", "file-ownership", "permission-classes", "basic-permissions", "read-permission", "write-permission", "execute-permission", "ls-long", "permission-string", "missing-permission", "ls-all", "chmod", "symbolic-chmod", "numeric-permissions", "numeric-examples", "three-digit-modes", "chown", "chmod-vs-chown", "directory-permissions", "file-vs-directory-x", "ownership-and-mode", "scenario-recognition", "exam-traps", "maestro-recognition-sheet"],
    topics: ["Ownership", "Permissions", "ls -l", "ls -a", "chmod", "chown", "Read", "Write", "Execute", "755", "644"]
  },
  "5.4": {
    world: "5", count: 8, hash: "FD15FD267DD98F1B92852350DCF50C32364F2526B45555C5F0FC9DF79071C27F", firstId: "L010-5.4-R001",
    sections: ["mission", "temporary-files", "tmp", "var-tmp", "tmp-vs-var-tmp", "shared-directory-problem", "sticky-bit", "sticky-bit-recognition", "sticky-bit-trap", "symbolic-links", "why-symbolic-links", "ln-s", "source-link-order", "symlink-behavior", "link-vs-copy", "ls-d", "ls-options", "scenario-recognition", "exam-traps", "maestro-recognition-sheet", "world-five-connection"],
    topics: ["Temporary files", "/tmp/", "/var/tmp/", "Sticky Bit", "Symbolic link", "ls -d", "ln -s"]
  }
};

for (const [objective, expected] of Object.entries(objectives)) {
  const lesson = json(`json/linux-essentials/field-manual/${objective}.json`);
  const expectedWorld = expected.world || "1";
  const bankPath = path.join(root, `json/linux-essentials/world${expectedWorld}/${objective}-hatchling.json`);
  const bankBytes = fs.readFileSync(bankPath);
  const bank = JSON.parse(bankBytes.toString("utf8"));
  const hash = crypto.createHash("sha256").update(bankBytes).digest("hex").toUpperCase();
  const sectionIds = (lesson.sections || []).map(section => section.id);
  const lessonText = JSON.stringify(lesson).toLowerCase();

  requireValue(lesson.schemaVersion === 1, `${objective} schemaVersion must be 1.`);
  requireValue(lesson.certification === "linux-essentials" && lesson.examCode === "010-160" && lesson.blueprintVersion === "1.6", `${objective} metadata must match LPI Linux Essentials 010-160 v1.6.`);
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
  "1": read("linux-essentials-world1-objectives.html"),
  "2": read("linux-essentials-world2-objectives.html"),
  "3": read("linux-essentials-world3-objectives.html"),
  "4": read("linux-essentials-world4-objectives.html"),
  "5": read("linux-essentials-world5-objectives.html")
};
const campaign = read("linux-essentials-campaign.html");
const manualPage = read("linux-essentials-field-manual.html");
const manualScript = read("linux-essentials-field-manual.js");
const hubScript = read("linux-essentials-objective-hub.js");
const quizScript = read("linux-essentials-quiz.js");

requireValue(campaign.includes('href="linux-essentials-world1-objectives.html"'), "Campaign World 1 must route to its Objective Hub.");
requireValue(campaign.includes('href="linux-essentials-world2-objectives.html"'), "Campaign World 2 must route to its Objective Hub.");
requireValue(campaign.includes('href="linux-essentials-world3-objectives.html"'), "Campaign World 3 must route to its Objective Hub.");
requireValue(campaign.includes('href="linux-essentials-world4-objectives.html"'), "Campaign World 4 must route to its Objective Hub.");
requireValue(campaign.includes('href="linux-essentials-world5-objectives.html"'), "Campaign World 5 must route to its Objective Hub.");
for (const [objective, expected] of Object.entries(objectives)) {
  const world = expected.world || "1";
  const hub = hubs[world];
  requireValue(hub.includes(`linux-essentials-field-manual.html?world=${world}&amp;objective=${objective}`), `World ${world} Hub is missing the ${objective} Field Manual action.`);
  requireValue(hub.includes(`linux-essentials-quiz.html?world=${world}&amp;objective=${objective}`), `${objective} Sweep route changed unexpectedly.`);
  requireValue(hub.includes(`id="objective${objective.replace(".", "")}ManualStatus"`) && hub.includes(`id="objective${objective.replace(".", "")}SweepStatus"`), `${objective} Manual and Sweep statuses must remain separate.`);
}
for (const [world, hub] of Object.entries(hubs)) {
  requireValue(hub.includes('href="security-plus-field-manual.css"') && hub.includes('src="linux-essentials-objective-hub.js"'), `World ${world} Hub must use the established Field Manual card presentation and status engine.`);
  requireValue(hub.includes('href="linux-essentials-campaign.html" class="back-link">← Return to Campaign Map</a>'), `World ${world} Hub must return to the Linux Essentials Campaign Map.`);
}
requireValue(manualPage.includes('id="linuxManualNavigation"') && manualScript.includes("function renderNavigation()"), "The Linux Essentials Field Manual is missing lesson navigation.");
requireValue(manualScript.includes('const MANUAL_KEY = "hydra-linux-essentials-field-manual-v1"'), "Manual completion storage must remain isolated.");
requireValue(hubScript.includes('const PROGRESS_KEY = "hydra-linux-essentials-progress-v1"'), "The Objective Hub must read the existing Sweep progress key.");
requireValue(manualScript.includes('"json/linux-essentials/world" + world + "/" + objective + "-hatchling.json"'), "Mini Checks must load the existing protected Sweep banks.");
requireValue(manualScript.includes('window.location.assign("linux-essentials-quiz.html?world="'), "Completing a manual must continue to the existing Objective Sweep.");
requireValue(manualScript.includes('elements.returnLink.href = "linux-essentials-world" + world + "-objectives.html"'), "Field Manuals must return to their Objective Hub.");
requireValue(manualScript.includes('world === "1" && /^1\\.[1-4]$/.test(objective)'), "The Field Manual route gate must include only published World 1 objectives 1.1-1.4.");
requireValue(manualScript.includes('world === "2" && /^2\\.[1-4]$/.test(objective)'), "The Field Manual route gate must include only published World 2 objectives 2.1-2.4.");
requireValue(manualScript.includes('world === "3" && /^3\\.[1-3]$/.test(objective)'), "The Field Manual route gate must include only published World 3 objectives 3.1-3.3.");
requireValue(manualScript.includes('world === "4" && /^4\\.[1-4]$/.test(objective)'), "The Field Manual route gate must include only published World 4 objectives 4.1-4.4.");
requireValue(manualScript.includes('world === "5" && /^5\\.[1-4]$/.test(objective)'), "The Field Manual route gate must include only published World 5 objectives 5.1-5.4.");
requireValue(quizScript.includes('return { href: `linux-essentials-world${world}-objectives.html`'), "Objective Sweeps must continue returning to their Objective Hub.");

if (errors.length) {
  console.error("Linux Essentials Field Manual validation: FAIL");
  errors.forEach(error => console.error("- " + error));
  process.exitCode = 1;
} else {
  console.log("Linux Essentials Field Manual validation: PASS");
  for (const [objective, expected] of Object.entries(objectives)) {
    console.log(`- Objective ${objective} protected mappings: ${expected.count} of ${expected.count} (100%)`);
    console.log(`- Objective ${objective} lesson architecture and ${expected.sections.length}-section navigator: PASS`);
    console.log(`- Protected ${objective} Sweep bank remains ${expected.count} questions and byte-for-byte unchanged: PASS`);
  }
  console.log("- GSA-owned Mini Checks; no new questions authored: PASS");
  console.log("- Manual completion and Sweep mastery remain separate: PASS");
  console.log("- Campaign, Objective Hub, Field Manual, and Sweep navigation: PASS");
}
