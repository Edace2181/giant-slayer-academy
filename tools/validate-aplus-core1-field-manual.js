const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const errors = [];
const requireValue = (condition, message) => { if (!condition) errors.push(message); };
const read = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");
const json = relativePath => JSON.parse(read(relativePath));

const lesson = json("json/aplus-core1/field-manual/1.1.json");
const bankPath = path.join(root, "json/aplus-core1/world1/1.1-hatchling.json");
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const bankHash = crypto.createHash("sha256").update(fs.readFileSync(bankPath)).digest("hex").toUpperCase();
const lesson12 = json("json/aplus-core1/field-manual/1.2.json");
const bank12Path = path.join(root, "json/aplus-core1/world1/1.2-hatchling.json");
const bank12 = JSON.parse(fs.readFileSync(bank12Path, "utf8"));
const bank12Hash = crypto.createHash("sha256").update(fs.readFileSync(bank12Path)).digest("hex").toUpperCase();
const lesson13 = json("json/aplus-core1/field-manual/1.3.json");
const bank13Path = path.join(root, "json/aplus-core1/world1/1.3-hatchling.json");
const bank13 = JSON.parse(fs.readFileSync(bank13Path, "utf8"));
const bank13Hash = crypto.createHash("sha256").update(fs.readFileSync(bank13Path)).digest("hex").toUpperCase();
const lesson21 = json("json/aplus-core1/field-manual/2.1.json");
const bank21Path = path.join(root, "json/aplus-core1/world2/2.1-hatchling.json");
const bank21 = JSON.parse(fs.readFileSync(bank21Path, "utf8"));
const bank21Hash = crypto.createHash("sha256").update(fs.readFileSync(bank21Path)).digest("hex").toUpperCase();
const lesson22 = json("json/aplus-core1/field-manual/2.2.json");
const bank22Path = path.join(root, "json/aplus-core1/world2/2.2-hatchling.json");
const bank22 = JSON.parse(fs.readFileSync(bank22Path, "utf8"));
const bank22Hash = crypto.createHash("sha256").update(fs.readFileSync(bank22Path)).digest("hex").toUpperCase();
const lesson23 = json("json/aplus-core1/field-manual/2.3.json");
const bank23Path = path.join(root, "json/aplus-core1/world2/2.3-hatchling.json");
const bank23 = JSON.parse(fs.readFileSync(bank23Path, "utf8"));
const bank23Hash = crypto.createHash("sha256").update(fs.readFileSync(bank23Path)).digest("hex").toUpperCase();
const lesson24 = json("json/aplus-core1/field-manual/2.4.json");
const bank24Path = path.join(root, "json/aplus-core1/world2/2.4-hatchling.json");
const bank24 = JSON.parse(fs.readFileSync(bank24Path, "utf8"));
const bank24Hash = crypto.createHash("sha256").update(fs.readFileSync(bank24Path)).digest("hex").toUpperCase();
const lesson25 = json("json/aplus-core1/field-manual/2.5.json");
const bank25Path = path.join(root, "json/aplus-core1/world2/2.5-hatchling.json");
const bank25 = JSON.parse(fs.readFileSync(bank25Path, "utf8"));
const bank25Hash = crypto.createHash("sha256").update(fs.readFileSync(bank25Path)).digest("hex").toUpperCase();
const lesson26 = json("json/aplus-core1/field-manual/2.6.json");
const bank26Path = path.join(root, "json/aplus-core1/world2/2.6-hatchling.json");
const bank26 = JSON.parse(fs.readFileSync(bank26Path, "utf8"));
const bank26Hash = crypto.createHash("sha256").update(fs.readFileSync(bank26Path)).digest("hex").toUpperCase();
const lesson27 = json("json/aplus-core1/field-manual/2.7.json");
const bank27Path = path.join(root, "json/aplus-core1/world2/2.7-hatchling.json");
const bank27 = JSON.parse(fs.readFileSync(bank27Path, "utf8"));
const bank27Hash = crypto.createHash("sha256").update(fs.readFileSync(bank27Path)).digest("hex").toUpperCase();
const lesson28 = json("json/aplus-core1/field-manual/2.8.json");
const bank28Path = path.join(root, "json/aplus-core1/world2/2.8-hatchling.json");
const bank28 = JSON.parse(fs.readFileSync(bank28Path, "utf8"));
const bank28Hash = crypto.createHash("sha256").update(fs.readFileSync(bank28Path)).digest("hex").toUpperCase();
const lesson31 = json("json/aplus-core1/field-manual/3.1.json");
const bank31Path = path.join(root, "json/aplus-core1/world3/3.1-hatchling.json");
const bank31 = JSON.parse(fs.readFileSync(bank31Path, "utf8"));
const bank31Hash = crypto.createHash("sha256").update(fs.readFileSync(bank31Path)).digest("hex").toUpperCase();
const lesson32 = json("json/aplus-core1/field-manual/3.2.json");
const bank32Path = path.join(root, "json/aplus-core1/world3/3.2-hatchling.json");
const bank32 = JSON.parse(fs.readFileSync(bank32Path, "utf8"));
const bank32Hash = crypto.createHash("sha256").update(fs.readFileSync(bank32Path)).digest("hex").toUpperCase();
const lesson33 = json("json/aplus-core1/field-manual/3.3.json");
const bank33Path = path.join(root, "json/aplus-core1/world3/3.3-hatchling.json");
const bank33 = JSON.parse(fs.readFileSync(bank33Path, "utf8"));
const bank33Hash = crypto.createHash("sha256").update(fs.readFileSync(bank33Path)).digest("hex").toUpperCase();
const lesson34 = json("json/aplus-core1/field-manual/3.4.json");
const bank34Path = path.join(root, "json/aplus-core1/world3/3.4-hatchling.json");
const bank34 = JSON.parse(fs.readFileSync(bank34Path, "utf8"));
const bank34Hash = crypto.createHash("sha256").update(fs.readFileSync(bank34Path)).digest("hex").toUpperCase();
const lesson35 = json("json/aplus-core1/field-manual/3.5.json");
const bank35Path = path.join(root, "json/aplus-core1/world3/3.5-hatchling.json");
const bank35 = JSON.parse(fs.readFileSync(bank35Path, "utf8"));
const bank35Hash = crypto.createHash("sha256").update(fs.readFileSync(bank35Path)).digest("hex").toUpperCase();
const lesson36 = json("json/aplus-core1/field-manual/3.6.json");
const bank36Path = path.join(root, "json/aplus-core1/world3/3.6-hatchling.json");
const bank36 = JSON.parse(fs.readFileSync(bank36Path, "utf8"));
const bank36Hash = crypto.createHash("sha256").update(fs.readFileSync(bank36Path)).digest("hex").toUpperCase();
const lesson37 = json("json/aplus-core1/field-manual/3.7.json");
const bank37Path = path.join(root, "json/aplus-core1/world3/3.7-hatchling.json");
const bank37 = JSON.parse(fs.readFileSync(bank37Path, "utf8"));
const bank37Hash = crypto.createHash("sha256").update(fs.readFileSync(bank37Path)).digest("hex").toUpperCase();
const lesson38 = json("json/aplus-core1/field-manual/3.8.json");
const bank38Path = path.join(root, "json/aplus-core1/world3/3.8-hatchling.json");
const bank38 = JSON.parse(fs.readFileSync(bank38Path, "utf8"));
const bank38Hash = crypto.createHash("sha256").update(fs.readFileSync(bank38Path)).digest("hex").toUpperCase();
const lesson41 = json("json/aplus-core1/field-manual/4.1.json");
const bank41Path = path.join(root, "json/aplus-core1/world4/4.1-hatchling.json");
const bank41 = JSON.parse(fs.readFileSync(bank41Path, "utf8"));
const bank41Hash = crypto.createHash("sha256").update(fs.readFileSync(bank41Path)).digest("hex").toUpperCase();
const lesson42 = json("json/aplus-core1/field-manual/4.2.json");
const bank42Path = path.join(root, "json/aplus-core1/world4/4.2-hatchling.json");
const bank42 = JSON.parse(fs.readFileSync(bank42Path, "utf8"));
const bank42Hash = crypto.createHash("sha256").update(fs.readFileSync(bank42Path)).digest("hex").toUpperCase();
const lesson51 = json("json/aplus-core1/field-manual/5.1.json");
const bank51Path = path.join(root, "json/aplus-core1/world5/5.1-hatchling.json");
const bank51 = JSON.parse(fs.readFileSync(bank51Path, "utf8"));
const bank51Hash = crypto.createHash("sha256").update(fs.readFileSync(bank51Path)).digest("hex").toUpperCase();
const lesson52 = json("json/aplus-core1/field-manual/5.2.json");
const bank52Path = path.join(root, "json/aplus-core1/world5/5.2-hatchling.json");
const bank52 = JSON.parse(fs.readFileSync(bank52Path, "utf8"));
const bank52Hash = crypto.createHash("sha256").update(fs.readFileSync(bank52Path)).digest("hex").toUpperCase();
const lesson53 = json("json/aplus-core1/field-manual/5.3.json");
const bank53Path = path.join(root, "json/aplus-core1/world5/5.3-hatchling.json");
const bank53 = JSON.parse(fs.readFileSync(bank53Path, "utf8"));
const bank53Hash = crypto.createHash("sha256").update(fs.readFileSync(bank53Path)).digest("hex").toUpperCase();
const lesson54 = json("json/aplus-core1/field-manual/5.4.json");
const bank54Path = path.join(root, "json/aplus-core1/world5/5.4-hatchling.json");
const bank54 = JSON.parse(fs.readFileSync(bank54Path, "utf8"));
const bank54Hash = crypto.createHash("sha256").update(fs.readFileSync(bank54Path)).digest("hex").toUpperCase();
const lesson55 = json("json/aplus-core1/field-manual/5.5.json");
const bank55Path = path.join(root, "json/aplus-core1/world5/5.5-hatchling.json");
const bank55 = JSON.parse(fs.readFileSync(bank55Path, "utf8"));
const bank55Hash = crypto.createHash("sha256").update(fs.readFileSync(bank55Path)).digest("hex").toUpperCase();
const lesson56 = json("json/aplus-core1/field-manual/5.6.json");
const bank56Path = path.join(root, "json/aplus-core1/world5/5.6-hatchling.json");
const bank56 = JSON.parse(fs.readFileSync(bank56Path, "utf8"));
const bank56Hash = crypto.createHash("sha256").update(fs.readFileSync(bank56Path)).digest("hex").toUpperCase();
const hub = read("aplus-core1-world1-objectives.html");
const hub2 = read("aplus-core1-world2-objectives.html");
const hub3 = read("aplus-core1-world3-objectives.html");
const hub4 = read("aplus-core1-world4-objectives.html");
const hub5 = read("aplus-core1-world5-objectives.html");
const campaign = read("aplus-core1-campaign.html");
const manualPage = read("aplus-core1-field-manual.html");
const manualScript = read("aplus-core1-field-manual.js");
const hubScript = read("aplus-core1-objective-hub.js");
const quizScript = read("aplus-core1-quiz.js");

requireValue(lesson.schemaVersion === 1, "Objective 1.1 schemaVersion must be 1.");
requireValue(lesson.certification === "aplus-core1", "Objective 1.1 certification must be aplus-core1.");
requireValue(lesson.examCode === "220-1201", "Objective 1.1 exam code must be 220-1201.");
requireValue(lesson.world === "1" && lesson.objective === "1.1", "Objective 1.1 route metadata must match World 1.");
requireValue(lesson.miniCheckSource === "objective-sweep-bank", "Objective 1.1 must use the GSA-owned Mini Check source.");
requireValue(!Object.prototype.hasOwnProperty.call(lesson, "miniCheck"), "Objective 1.1 lesson data must not author a Mini Check question.");

const expectedSections = [
  "what-you-are-learning", "maestro-focus", "battery", "battery-replacement", "keyboard-and-keys",
  "random-access-memory", "hdd-and-ssd", "storage-replacement", "wireless-cards", "wi-fi-antenna",
  "physical-privacy-and-security", "camera-and-webcam", "microphone", "camera-vs-microphone",
  "replacement-workflow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds = (lesson.sections || []).map(section => section.id);
requireValue(sectionIds.length === new Set(sectionIds).size, "Objective 1.1 section IDs must be unique.");
expectedSections.forEach(id => requireValue(sectionIds.includes(id), "Objective 1.1 is missing section: " + id));

const requiredTopics = [
  "Battery", "Keyboard/keys", "Random-access memory (RAM)", "Hard disk drive (HDD)", "solid-state drive (SSD)",
  "Wireless cards", "Physical privacy and security components", "Biometrics", "Near-Field Scanner Features",
  "Wi-Fi antenna connector/placement", "Camera/webcam", "Microphone"
];
const lessonText = JSON.stringify(lesson);
requiredTopics.forEach(topic => requireValue(lessonText.includes(topic), "Objective 1.1 is missing required topic: " + topic));

requireValue(Array.isArray(bank) && bank.length === 11, "Objective 1.1 protected Sweep bank must contain exactly 11 questions.");
requireValue(bank[0]?.id === "A1201-1.1-R01", "Objective 1.1 GSA Mini Check source must remain the existing first bank question.");
requireValue(bankHash === "CED5202569FC6BE240EDDD160ED6DEDC54A2684467CB8D3B38789C17A6D40869", "Objective 1.1 protected Sweep bank bytes changed.");

requireValue(lesson12.schemaVersion === 1, "Objective 1.2 schemaVersion must be 1.");
requireValue(lesson12.certification === "aplus-core1" && lesson12.examCode === "220-1201", "Objective 1.2 metadata must match A+ Core 1 220-1201.");
requireValue(lesson12.world === "1" && lesson12.objective === "1.2", "Objective 1.2 route metadata must match World 1.");
requireValue(lesson12.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson12, "miniCheck"), "Objective 1.2 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections12 = [
  "what-you-are-learning", "maestro-focus", "connection-methods", "usb-connectors", "lightning",
  "near-field-communication", "bluetooth", "nfc-vs-bluetooth", "tethering-and-hotspot",
  "mobile-device-accessories", "stylus", "headsets-and-speakers", "webcam",
  "docking-station-and-port-replicator", "pointing-and-drawing-devices", "recognition-cues",
  "exam-trap", "maestro-recognition-sheet"
];
const sectionIds12 = (lesson12.sections || []).map(section => section.id);
requireValue(sectionIds12.length === new Set(sectionIds12).size, "Objective 1.2 section IDs must be unique.");
expectedSections12.forEach(id => requireValue(sectionIds12.includes(id), "Objective 1.2 is missing section: " + id));
const requiredTopics12 = [
  "Connection methods", "Universal Serial Bus (USB)", "Lightning", "Near-field communication (NFC)",
  "Bluetooth", "Tethering/hotspot", "Accessories", "Stylus", "Headsets", "Speakers", "Webcam",
  "Docking station", "Port replicator", "Trackpad, Drawing Pad, and Track Point"
];
const lessonText12 = JSON.stringify(lesson12);
requiredTopics12.forEach(topic => requireValue(lessonText12.includes(topic), "Objective 1.2 is missing required topic: " + topic));
requireValue(Array.isArray(bank12) && bank12.length === 14, "Objective 1.2 protected Sweep bank must contain exactly 14 questions.");
requireValue(bank12[0]?.id === "A1201-1.2-R01", "Objective 1.2 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank12Hash === "5D4497BC3069E68875C9D35B8AD97C7EBF7FDFC9651BFF52591F51DA7E33C57B", "Objective 1.2 protected Sweep bank bytes changed.");

requireValue(lesson13.schemaVersion === 1, "Objective 1.3 schemaVersion must be 1.");
requireValue(lesson13.certification === "aplus-core1" && lesson13.examCode === "220-1201", "Objective 1.3 metadata must match A+ Core 1 220-1201.");
requireValue(lesson13.world === "1" && lesson13.objective === "1.3", "Objective 1.3 route metadata must match World 1.");
requireValue(lesson13.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson13, "miniCheck"), "Objective 1.3 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections13 = [
  "what-you-are-learning", "maestro-focus", "wireless-and-cellular-data", "cellular-generations",
  "wi-fi-and-hotspot", "sim-and-esim", "bluetooth", "bluetooth-pairing",
  "bluetooth-enabled-vs-pairing", "location-services", "mobile-device-management",
  "corporate-vs-byod", "policy-and-corporate-applications", "mobile-device-synchronization",
  "recognizing-data-caps", "calendar-and-contacts", "business-applications",
  "connectivity-vs-synchronization", "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds13 = (lesson13.sections || []).map(section => section.id);
requireValue(sectionIds13.length === new Set(sectionIds13).size, "Objective 1.3 section IDs must be unique.");
expectedSections13.forEach(id => requireValue(sectionIds13.includes(id), "Objective 1.3 is missing section: " + id));
const requiredTopics13 = [
  "Wireless/cellular data network", "3G, 4G, and 5G", "Hotspot", "Wi-Fi", "SIM and eSIM",
  "Bluetooth", "Enable Bluetooth", "Enable pairing", "Find the device", "personal identification number (PIN)",
  "Test connectivity", "Location Services", "GPS Services", "Cellular Location Services",
  "Mobile Device Management (MDM)", "device configurations", "Corporate", "Bring Your Own Device (BYOD)",
  "Policy Enforcement", "Corporate Applications", "Mobile Device Synchronization", "data cap",
  "Calendar", "Contacts", "Business Applications", "Mail", "Cloud Storage"
];
const lessonText13 = JSON.stringify(lesson13);
requiredTopics13.forEach(topic => requireValue(lessonText13.includes(topic), "Objective 1.3 is missing required topic: " + topic));
requireValue(Array.isArray(bank13) && bank13.length === 27, "Objective 1.3 protected Sweep bank must contain exactly 27 questions.");
requireValue(bank13[0]?.id === "A1201-1.3-R01", "Objective 1.3 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank13Hash === "B6F02A6536E67965BA7EE36F7A9777A3BC05489CF5DDD4EDD93CAE81A2656B1D", "Objective 1.3 protected Sweep bank bytes changed.");

requireValue(lesson21.schemaVersion === 1, "Objective 2.1 schemaVersion must be 1.");
requireValue(lesson21.certification === "aplus-core1" && lesson21.examCode === "220-1201", "Objective 2.1 metadata must match A+ Core 1 220-1201.");
requireValue(lesson21.world === "2" && lesson21.objective === "2.1", "Objective 2.1 route metadata must match World 2.");
requireValue(lesson21.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson21, "miniCheck"), "Objective 2.1 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections21 = [
  "what-you-are-learning", "maestro-focus", "ports-and-protocols", "ftp", "ssh-and-telnet",
  "smtp", "dns", "dhcp", "http-and-https", "pop3-and-imap", "netbios-netbt", "ldap",
  "smb-cifs", "netbios-vs-smb", "rdp", "ssh-vs-rdp", "tcp", "tcp-handshake", "udp",
  "tcp-vs-udp", "transport-recognition", "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds21 = (lesson21.sections || []).map(section => section.id);
requireValue(sectionIds21.length === new Set(sectionIds21).size, "Objective 2.1 section IDs must be unique.");
expectedSections21.forEach(id => requireValue(sectionIds21.includes(id), "Objective 2.1 is missing section: " + id));
const requiredTopics21 = [
  "Ports and Protocols", "File Transfer Protocol (FTP)", "Secure Shell (SSH)", "Telnet",
  "Simple Mail Transfer Protocol (SMTP)", "Domain Name System (DNS)", "Dynamic Host Configuration Protocol (DHCP)",
  "Hypertext Transfer Protocol (HTTP)", "Post Office Protocol 3 (POP3)", "Internet Mail Access Protocol (IMAP)",
  "Network Basic Input/Output System (NetBIOS)", "NetBIOS over TCP/IP (NetBT)", "Lightweight Directory Access Protocol (LDAP)",
  "Hypertext Transfer Protocol Secure (HTTPS)", "Server Message Block (SMB)", "Common Internet File System (CIFS)",
  "Remote Desktop Protocol (RDP)", "TCP vs. UDP"
];
const lessonText21 = JSON.stringify(lesson21);
requiredTopics21.forEach(topic => requireValue(lessonText21.includes(topic), "Objective 2.1 is missing required topic: " + topic));
[
  ["20-21", "FTP"], ["22", "SSH"], ["23", "Telnet"], ["25", "SMTP"], ["53", "DNS"],
  ["67/68", "DHCP"], ["80", "HTTP"], ["110", "POP3"], ["143", "IMAP"],
  ["137-139", "NetBIOS/NetBT"], ["389", "LDAP"], ["443", "HTTPS"], ["445", "SMB/CIFS"], ["3389", "RDP"]
].forEach(([port, protocol]) => requireValue(lessonText21.includes(port) && lessonText21.includes(protocol), "Objective 2.1 is missing the " + protocol + " port mapping."));
requireValue(Array.isArray(bank21) && bank21.length === 16, "Objective 2.1 protected Sweep bank must contain exactly 16 questions.");
requireValue(bank21[0]?.id === "A1201-2.1-R001", "Objective 2.1 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank21Hash === "ACBA96DBB2A7A1272B6B6799A58C70FBF78C4F10811F61C903C584F1F32FBAB2", "Objective 2.1 protected Sweep bank bytes changed.");

requireValue(lesson22.schemaVersion === 1, "Objective 2.2 schemaVersion must be 1.");
requireValue(lesson22.certification === "aplus-core1" && lesson22.examCode === "220-1201", "Objective 2.2 metadata must match A+ Core 1 220-1201.");
requireValue(lesson22.world === "2" && lesson22.objective === "2.2", "Objective 2.2 route metadata must match World 2.");
requireValue(lesson22.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson22, "miniCheck"), "Objective 2.2 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections22 = [
  "what-you-are-learning", "maestro-focus", "wi-fi-frequency-bands", "two-four-ghz", "five-ghz",
  "six-ghz", "band-comparison", "wireless-channels", "two-four-channels", "five-six-channels",
  "regulations", "channel-selection", "frequencies-bands-channels", "channel-width", "width-vs-number",
  "802-11-standards", "standard-frequency-map", "bluetooth", "bluetooth-vs-wi-fi", "nfc", "rfid",
  "active-vs-passive-rfid", "nfc-vs-rfid", "wireless-technology-map", "recognition-cues", "exam-trap",
  "maestro-recognition-sheet"
];
const sectionIds22 = (lesson22.sections || []).map(section => section.id);
requireValue(sectionIds22.length === new Set(sectionIds22).size, "Objective 2.2 section IDs must be unique.");
expectedSections22.forEach(id => requireValue(sectionIds22.includes(id), "Objective 2.2 is missing section: " + id));
const requiredTopics22 = [
  "Frequency", "2.4 GHz", "5 GHz", "6 GHz", "Wireless Channels", "Regulations", "Channel Selection",
  "Channel Width", "Frequencies, Bands, and Channels", "Bluetooth", "802.11 Standards",
  "Near-Field Communication (NFC)", "Radio-Frequency Identification (RFID)"
];
const lessonText22 = JSON.stringify(lesson22);
requiredTopics22.forEach(topic => requireValue(lessonText22.includes(topic), "Objective 2.2 is missing required topic: " + topic));
requireValue(Array.isArray(bank22) && bank22.length === 14, "Objective 2.2 protected Sweep bank must contain exactly 14 questions.");
requireValue(bank22[0]?.id === "A1201-2.2-R001", "Objective 2.2 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank22Hash === "638EFEB0024BD482E0BC3819A38C897C9390EA99A6A802129AE61DA1452475A5", "Objective 2.2 protected Sweep bank bytes changed.");

requireValue(lesson23.schemaVersion === 1, "Objective 2.3 schemaVersion must be 1.");
requireValue(lesson23.certification === "aplus-core1" && lesson23.examCode === "220-1201", "Objective 2.3 metadata must match A+ Core 1 220-1201.");
requireValue(lesson23.world === "2" && lesson23.objective === "2.3", "Objective 2.3 route metadata must match World 2.");
requireValue(lesson23.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson23, "miniCheck"), "Objective 2.3 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections23 = [
  "what-you-are-learning", "maestro-focus", "server-roles", "dns-server", "dhcp-server", "dns-vs-dhcp",
  "fileshare-server", "print-server", "file-vs-print", "mail-server", "syslog-server", "web-server", "aaa",
  "database-server", "file-vs-database", "ntp-server", "internet-appliances", "spam-gateway", "utm",
  "load-balancer", "proxy-server", "appliance-comparisons", "legacy-embedded-systems", "scada", "iot-devices",
  "scada-vs-iot", "server-role-map", "appliance-map", "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds23 = (lesson23.sections || []).map(section => section.id);
requireValue(sectionIds23.length === new Set(sectionIds23).size, "Objective 2.3 section IDs must be unique.");
expectedSections23.forEach(id => requireValue(sectionIds23.includes(id), "Objective 2.3 is missing section: " + id));
const requiredTopics23 = [
  "Server Roles", "Domain Name System (DNS)", "Dynamic Host Configuration Protocol (DHCP)", "Fileshare",
  "Print Server", "Mail Server", "Syslog Server", "Web Server", "Authentication, Authorization, and Accounting (AAA)",
  "Database Server", "Network Time Protocol (NTP)", "Internet Appliances", "Spam Gateway",
  "Unified Threat Management (UTM)", "Load Balancer", "Proxy Server", "Legacy and Embedded Systems",
  "Supervisory Control and Data Acquisition (SCADA)", "Internet of Things (IoT) Devices"
];
const lessonText23 = JSON.stringify(lesson23);
requiredTopics23.forEach(topic => requireValue(lessonText23.includes(topic), "Objective 2.3 is missing required topic: " + topic));
requireValue(Array.isArray(bank23) && bank23.length === 19, "Objective 2.3 protected Sweep bank must contain exactly 19 questions.");
requireValue(bank23[0]?.id === "A1201-2.3-R001", "Objective 2.3 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank23Hash === "004C9C72C7CB54E58EC343FB0D927E98E19E4FD65C5D1AA04C37DC06915DD7E0", "Objective 2.3 protected Sweep bank bytes changed.");

requireValue(lesson24.schemaVersion === 1, "Objective 2.4 schemaVersion must be 1.");
requireValue(lesson24.certification === "aplus-core1" && lesson24.examCode === "220-1201", "Objective 2.4 metadata must match A+ Core 1 220-1201.");
requireValue(lesson24.world === "2" && lesson24.objective === "2.4", "Objective 2.4 route metadata must match World 2.");
requireValue(lesson24.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson24, "miniCheck"), "Objective 2.4 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections24 = [
  "what-you-are-learning", "maestro-focus", "dns", "a-record", "aaaa-record", "a-vs-aaaa", "cname",
  "a-vs-cname", "mx-record", "txt-record", "dkim", "spf", "dmarc", "email-auth-comparison",
  "dns-record-map", "dhcp", "dhcp-lease", "dhcp-reservation", "dhcp-scope", "dhcp-exclusion",
  "dhcp-concept-map", "dhcp-example", "vlan", "vlan-purpose", "vlan-recognition", "vpn",
  "remote-access-vpn", "site-to-site-vpn", "vlan-vs-vpn", "configuration-map", "recognition-cues",
  "exam-trap", "maestro-recognition-sheet"
];
const sectionIds24 = (lesson24.sections || []).map(section => section.id);
requireValue(sectionIds24.length === new Set(sectionIds24).size, "Objective 2.4 section IDs must be unique.");
expectedSections24.forEach(id => requireValue(sectionIds24.includes(id), "Objective 2.4 is missing section: " + id));
const requiredTopics24 = [
  "Domain Name System (DNS)", "A Record", "AAAA Record", "Canonical Name (CNAME)", "Mail Exchanger (MX)",
  "Text (TXT) Record", "spam-management", "DomainKeys Identified Mail (DKIM)", "Sender Policy Framework (SPF)",
  "Domain-Based Message Authentication, Reporting, and Conformance (DMARC)", "Dynamic Host Configuration Protocol (DHCP)",
  "DHCP Lease", "DHCP Reservation", "DHCP Scope", "DHCP Exclusion", "Virtual LAN (VLAN)", "Virtual Private Network (VPN)"
];
const lessonText24 = JSON.stringify(lesson24);
requiredTopics24.forEach(topic => requireValue(lessonText24.includes(topic), "Objective 2.4 is missing required topic: " + topic));
requireValue(Array.isArray(bank24) && bank24.length === 17, "Objective 2.4 protected Sweep bank must contain exactly 17 questions.");
requireValue(bank24[0]?.id === "A1201-2.4-R001", "Objective 2.4 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank24Hash === "EF92A10A5231D40718166B3FB91207E5B2D1BE50745F0857FE60FE818326DCC6", "Objective 2.4 protected Sweep bank bytes changed.");

requireValue(lesson25.schemaVersion === 1, "Objective 2.5 schemaVersion must be 1.");
requireValue(lesson25.certification === "aplus-core1" && lesson25.examCode === "220-1201", "Objective 2.5 metadata must match A+ Core 1 220-1201.");
requireValue(lesson25.world === "2" && lesson25.objective === "2.5", "Objective 2.5 route metadata must match World 2.");
requireValue(lesson25.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson25, "miniCheck"), "Objective 2.5 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections25 = [
  "what-you-are-learning", "maestro-focus", "routers", "switches", "router-vs-switch", "managed-switch",
  "unmanaged-switch", "managed-vs-unmanaged", "access-points", "ap-vs-router", "patch-panel",
  "patch-panel-vs-switch", "firewall", "firewall-vs-router", "power-over-ethernet", "poe-injector",
  "poe-switch", "injector-vs-poe-switch", "poe-standards", "cable-modem", "dsl", "cable-vs-dsl",
  "ont", "isp-termination-map", "nic", "physical-mac-address", "mac-vs-ip", "nic-vs-mac",
  "hardware-map", "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds25 = (lesson25.sections || []).map(section => section.id);
requireValue(sectionIds25.length === new Set(sectionIds25).size, "Objective 2.5 section IDs must be unique.");
expectedSections25.forEach(id => requireValue(sectionIds25.includes(id), "Objective 2.5 is missing section: " + id));
const requiredTopics25 = [
  "Routers", "Switches", "Managed Switch", "Unmanaged Switch", "Access Points", "Patch Panel", "Firewall",
  "Power over Ethernet (PoE)", "PoE Injector", "PoE Switch", "PoE Standards", "Cable Modem",
  "Digital Subscriber Line (DSL)", "Optical Network Terminal (ONT)", "Network Interface Card (NIC)",
  "Physical Media Access Control (MAC) Address"
];
const lessonText25 = JSON.stringify(lesson25);
requiredTopics25.forEach(topic => requireValue(lessonText25.includes(topic), "Objective 2.5 is missing required topic: " + topic));
requireValue(Array.isArray(bank25) && bank25.length === 16, "Objective 2.5 protected Sweep bank must contain exactly 16 questions.");
requireValue(bank25[0]?.id === "A1201-2.5-R001", "Objective 2.5 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank25Hash === "96B3F532842E438065F7E8A83E7A2BD6EB08E9AE04806E539EF9F02E42DEE6AE", "Objective 2.5 protected Sweep bank bytes changed.");

requireValue(lesson26.schemaVersion === 1, "Objective 2.6 schemaVersion must be 1.");
requireValue(lesson26.certification === "aplus-core1" && lesson26.examCode === "220-1201", "Objective 2.6 metadata must match A+ Core 1 220-1201.");
requireValue(lesson26.world === "2" && lesson26.objective === "2.6", "Objective 2.6 route metadata must match World 2.");
requireValue(lesson26.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson26, "miniCheck"), "Objective 2.6 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections26 = [
  "what-you-are-learning", "maestro-focus", "ip-addressing", "ipv4", "private-ipv4", "public-ipv4",
  "private-vs-public", "ipv6", "ipv4-vs-ipv6", "apipa", "apipa-meaning", "apipa-limitations",
  "static-addressing", "dynamic-addressing", "static-vs-dynamic", "static-vs-reservation", "subnet-mask",
  "common-soho-mask", "mask-local-remote", "default-gateway", "gateway-vs-router", "address-mask-gateway",
  "soho-example", "misconfigured-ip", "ip-addressing-map", "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds26 = (lesson26.sections || []).map(section => section.id);
requireValue(sectionIds26.length === new Set(sectionIds26).size, "Objective 2.6 section IDs must be unique.");
expectedSections26.forEach(id => requireValue(sectionIds26.includes(id), "Objective 2.6 is missing section: " + id));
const requiredTopics26 = [
  "Internet Protocol (IP) Addressing", "IPv4", "Private IPv4 Addresses", "Public IPv4 Addresses", "IPv6",
  "Automatic Private IP Addressing (APIPA)", "Static Addressing", "Dynamic Addressing", "Subnet Mask", "Default Gateway"
];
const lessonText26 = JSON.stringify(lesson26);
requiredTopics26.forEach(topic => requireValue(lessonText26.includes(topic), "Objective 2.6 is missing required topic: " + topic));
requireValue(Array.isArray(bank26) && bank26.length === 10, "Objective 2.6 protected Sweep bank must contain exactly 10 questions.");
requireValue(bank26[0]?.id === "A1201-2.6-R001", "Objective 2.6 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank26Hash === "393B809C40925E1669D4308F50E9A094330335A888BC54DB950D6695E14BE8A5", "Objective 2.6 protected Sweep bank bytes changed.");

requireValue(lesson27.schemaVersion === 1, "Objective 2.7 schemaVersion must be 1.");
requireValue(lesson27.certification === "aplus-core1" && lesson27.examCode === "220-1201", "Objective 2.7 metadata must match A+ Core 1 220-1201.");
requireValue(lesson27.world === "2" && lesson27.objective === "2.7", "Objective 2.7 route metadata must match World 2.");
requireValue(lesson27.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson27, "miniCheck"), "Objective 2.7 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections27 = [
  "what-you-are-learning", "maestro-focus", "internet-connection-types", "satellite", "fiber", "cable", "dsl",
  "cable-vs-dsl", "wired-medium-map", "cellular", "wisp", "cellular-vs-wisp", "satellite-vs-wisp",
  "internet-recognition-map", "network-types", "lan", "wan", "lan-vs-wan", "pan", "pan-vs-lan", "man",
  "lan-man-wan", "san", "san-vs-lan", "wlan", "lan-vs-wlan", "pan-vs-wlan", "network-type-map",
  "connection-vs-network", "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds27 = (lesson27.sections || []).map(section => section.id);
requireValue(sectionIds27.length === new Set(sectionIds27).size, "Objective 2.7 section IDs must be unique.");
expectedSections27.forEach(id => requireValue(sectionIds27.includes(id), "Objective 2.7 is missing section: " + id));
const requiredTopics27 = [
  "Internet Connection Types", "Satellite", "Fiber", "Cable", "Digital Subscriber Line (DSL)", "Cellular Internet",
  "Wireless Internet Service Provider (WISP)", "Network Types", "Local Area Network (LAN)", "Wide Area Network (WAN)",
  "Personal Area Network (PAN)", "Metropolitan Area Network (MAN)", "Storage Area Network (SAN)",
  "Wireless Local Area Network (WLAN)"
];
const lessonText27 = JSON.stringify(lesson27);
requiredTopics27.forEach(topic => requireValue(lessonText27.includes(topic), "Objective 2.7 is missing required topic: " + topic));
requireValue(Array.isArray(bank27) && bank27.length === 14, "Objective 2.7 protected Sweep bank must contain exactly 14 questions.");
requireValue(bank27[0]?.id === "A1201-2.7-R001", "Objective 2.7 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank27Hash === "D872E140A3B2784BAE2AB84B5357EF7CAE9C03292B31B6BA91AD0F529F5B4B8C", "Objective 2.7 protected Sweep bank bytes changed.");

requireValue(lesson28.schemaVersion === 1, "Objective 2.8 schemaVersion must be 1.");
requireValue(lesson28.certification === "aplus-core1" && lesson28.examCode === "220-1201", "Objective 2.8 metadata must match A+ Core 1 220-1201.");
requireValue(lesson28.world === "2" && lesson28.objective === "2.8", "Objective 2.8 route metadata must match World 2.");
requireValue(lesson28.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson28, "miniCheck"), "Objective 2.8 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections28 = [
  "what-you-are-learning", "maestro-focus", "crimper", "cable-stripper", "crimper-vs-stripper",
  "wi-fi-analyzer", "analyzer-vs-tester", "toner-probe", "punchdown-tool", "crimper-vs-punchdown",
  "cable-tester", "open-circuit", "short-circuit", "miswire", "tester-vs-toner", "loopback-plug",
  "loopback-vs-tester", "network-tap", "tap-vs-switch", "tap-vs-analyzer", "tool-map",
  "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds28 = (lesson28.sections || []).map(section => section.id);
requireValue(sectionIds28.length === new Set(sectionIds28).size, "Objective 2.8 section IDs must be unique.");
expectedSections28.forEach(id => requireValue(sectionIds28.includes(id), "Objective 2.8 is missing section: " + id));
const requiredTopics28 = [
  "Crimper", "Cable Stripper", "Wi-Fi Analyzer", "Toner Probe", "Punchdown Tool", "Cable Tester", "Loopback Plug", "Network Tap"
];
const lessonText28 = JSON.stringify(lesson28);
requiredTopics28.forEach(topic => requireValue(lessonText28.includes(topic), "Objective 2.8 is missing required topic: " + topic));
requireValue(Array.isArray(bank28) && bank28.length === 8, "Objective 2.8 protected Sweep bank must contain exactly 8 questions.");
requireValue(bank28[0]?.id === "A1201-2.8-R001", "Objective 2.8 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank28Hash === "0971DDB559AEC272EAD58E1FF26113F347C470588DC4765D85F063A8A4A758C4", "Objective 2.8 protected Sweep bank bytes changed.");

requireValue(lesson31.schemaVersion === 1, "Objective 3.1 schemaVersion must be 1.");
requireValue(lesson31.certification === "aplus-core1" && lesson31.examCode === "220-1201", "Objective 3.1 metadata must match A+ Core 1 220-1201.");
requireValue(lesson31.world === "3" && lesson31.objective === "3.1", "Objective 3.1 route metadata must match World 3.");
requireValue(lesson31.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson31, "miniCheck"), "Objective 3.1 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections31 = [
  "what-you-are-learning", "maestro-focus", "display-types", "lcd", "ips", "tn", "va",
  "lcd-panel-comparison", "oled", "lcd-vs-oled", "mini-led", "oled-vs-mini-led",
  "touch-screen-digitizer", "display-panel-vs-digitizer", "inverter", "inverter-vs-display-panel",
  "display-attributes", "pixel-density", "refresh-rate", "refresh-rate-vs-resolution",
  "screen-resolution", "resolution-vs-density", "pixel-density-vs-refresh-rate", "color-gamut",
  "color-gamut-vs-color-accuracy", "display-technology-map", "display-attribute-map",
  "recognition-cues", "exam-trap", "maestro-recognition-sheet"
];
const sectionIds31 = (lesson31.sections || []).map(section => section.id);
requireValue(sectionIds31.length === new Set(sectionIds31).size, "Objective 3.1 section IDs must be unique.");
expectedSections31.forEach(id => requireValue(sectionIds31.includes(id), "Objective 3.1 is missing section: " + id));
const requiredTopics31 = [
  "Display Types", "Liquid Crystal Display (LCD)", "In-Plane Switching (IPS)", "Twisted Nematic (TN)",
  "Vertical Alignment (VA)", "Organic Light-Emitting Diode (OLED)", "Mini Light-Emitting Diode (Mini-LED)",
  "Touch Screen/Digitizer", "Inverter", "Display Attributes", "Pixel Density", "Refresh Rates",
  "Screen Resolution", "Color Gamut"
];
const lessonText31 = JSON.stringify(lesson31);
requiredTopics31.forEach(topic => requireValue(lessonText31.includes(topic), "Objective 3.1 is missing required topic: " + topic));
requireValue(Array.isArray(bank31) && bank31.length === 14, "Objective 3.1 protected Sweep bank must contain exactly 14 questions.");
requireValue(bank31[0]?.id === "A1201-3.1-R001", "Objective 3.1 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank31Hash === "62120D964AA91F9B08B690AD86B29D9A189687581BE21000F7373E5F3A6413DA", "Objective 3.1 protected Sweep bank bytes changed.");

requireValue(lesson32.schemaVersion === 1, "Objective 3.2 schemaVersion must be 1.");
requireValue(lesson32.certification === "aplus-core1" && lesson32.examCode === "220-1201", "Objective 3.2 metadata must match A+ Core 1 220-1201.");
requireValue(lesson32.world === "3" && lesson32.objective === "3.2", "Objective 3.2 route metadata must match World 3.");
requireValue(lesson32.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson32, "miniCheck"), "Objective 3.2 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections32 = [
  "what-you-are-learning", "maestro-focus", "network-cables", "copper-network-cabling",
  "twisted-pair-categories", "t568a-t568b", "straight-through-cabling", "stp", "utp", "stp-vs-utp",
  "direct-burial", "plenum-rated", "coaxial", "optical-fiber", "single-mode", "multimode",
  "single-vs-multimode", "peripheral-cables", "usb-2", "usb-3", "usb-2-vs-usb-3", "serial-cable",
  "thunderbolt", "video-cables", "hdmi", "displayport", "dvi", "vga", "usb-c-video",
  "video-comparison", "hard-drive-cables", "sata", "esata", "sata-vs-esata", "adapters",
  "connector-types", "rj11", "rj45", "rj11-vs-rj45", "f-type", "st", "sc", "lc",
  "fiber-connectors", "punchdown-block", "microusb", "miniusb", "usb-c-connector", "molex",
  "lightning", "db9", "cable-recognition-map", "connector-map", "recognition-cues", "exam-trap",
  "maestro-recognition-sheet"
];
const sectionIds32 = (lesson32.sections || []).map(section => section.id);
requireValue(sectionIds32.length === new Set(sectionIds32).size, "Objective 3.2 section IDs must be unique.");
expectedSections32.forEach(id => requireValue(sectionIds32.includes(id), "Objective 3.2 is missing section: " + id));
const requiredTopics32 = [
  "Network Cables", "Copper Network Cabling", "Cable Categories", "T568A/T568B Standards", "Coaxial",
  "Shielded Twisted Pair", "Direct Burial Cable", "Unshielded Twisted Pair", "Plenum-Rated Cable",
  "Optical Cabling", "Single-Mode Fiber", "Multimode Fiber", "Peripheral Cables", "USB 2.0", "USB 3.0",
  "Serial Cable", "Thunderbolt", "Video Cables", "High-Definition Multimedia Interface", "DisplayPort",
  "Digital Visual Interface", "Video Graphics Array", "USB-C Video", "Hard Drive Cables",
  "Serial Advanced Technology Attachment", "External SATA", "Adapters", "Connector Types", "RJ11", "RJ45",
  "F-Type Connector", "Straight Tip", "Subscriber Connector", "Lucent Connector", "Punchdown Block",
  "MicroUSB", "MiniUSB", "USB-C Connector", "Molex", "Lightning Connector", "DB9"
];
const lessonText32 = JSON.stringify(lesson32);
requiredTopics32.forEach(topic => requireValue(lessonText32.includes(topic), "Objective 3.2 is missing required topic: " + topic));
requireValue(Array.isArray(bank32) && bank32.length === 41, "Objective 3.2 protected Sweep bank must contain exactly 41 questions.");
requireValue(bank32[0]?.id === "A1201-3.2-R001", "Objective 3.2 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank32Hash === "447BDD223C02A7C232CE340A09CABACFFA605328163EC39C76B110B98E0B4FF7", "Objective 3.2 protected Sweep bank bytes changed.");

requireValue(lesson33.schemaVersion === 1, "Objective 3.3 schemaVersion must be 1.");
requireValue(lesson33.certification === "aplus-core1" && lesson33.examCode === "220-1201", "Objective 3.3 metadata must match A+ Core 1 220-1201.");
requireValue(lesson33.world === "3" && lesson33.objective === "3.3", "Objective 3.3 route metadata must match World 3.");
requireValue(lesson33.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson33, "miniCheck"), "Objective 3.3 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections33 = [
  "what-you-are-learning", "maestro-focus", "random-access-memory", "ram-form-factors", "dimm", "sodimm",
  "dimm-vs-sodimm", "double-data-rate", "ddr-iterations", "ddr-physical-keying",
  "ddr-generation-vs-form-factor", "ecc-ram", "why-ecc-matters", "non-ecc-ram", "ecc-vs-non-ecc",
  "ecc-compatibility", "channel-configurations", "single-channel", "dual-channel", "matching-memory-modules",
  "memory-slot-placement", "channels-vs-modules", "capacity-vs-channels", "ram-recognition-map",
  "recognition-cues", "exam-trap", "ddr-compatibility-traps", "ecc-comparison-traps",
  "channel-configuration-traps", "maestro-recognition-sheet"
];
const sectionIds33 = (lesson33.sections || []).map(section => section.id);
requireValue(sectionIds33.length === new Set(sectionIds33).size, "Objective 3.3 section IDs must be unique.");
expectedSections33.forEach(id => requireValue(sectionIds33.includes(id), "Objective 3.3 is missing section: " + id));
const requiredTopics33 = [
  "RAM Form Factors", "Small Outline Dual In-line Memory Module (SODIMM)",
  "Dual In-line Memory Module (DIMM)", "DDR Iterations", "ECC vs. Non-ECC RAM", "Channel Configurations"
];
const lessonText33 = JSON.stringify(lesson33);
requiredTopics33.forEach(topic => requireValue(lessonText33.includes(topic), "Objective 3.3 is missing required topic: " + topic));
requireValue(Array.isArray(bank33) && bank33.length === 6, "Objective 3.3 protected Sweep bank must contain exactly 6 questions.");
requireValue(bank33[0]?.id === "A1201-3.3-R001", "Objective 3.3 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank33Hash === "FA0EC378647F89E8F2F92278C1AE149D0F3E61A59CA04500D2864B871DC8BE98", "Objective 3.3 protected Sweep bank bytes changed.");

requireValue(lesson34.schemaVersion === 1, "Objective 3.4 schemaVersion must be 1.");
requireValue(lesson34.certification === "aplus-core1" && lesson34.examCode === "220-1201", "Objective 3.4 metadata must match A+ Core 1 220-1201.");
requireValue(lesson34.world === "3" && lesson34.objective === "3.4", "Objective 3.4 route metadata must match World 3.");
requireValue(lesson34.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson34, "miniCheck"), "Objective 3.4 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections34 = [
  "what-you-are-learning", "maestro-focus", "hard-drives", "spindle-speeds", "hard-drive-form-factors",
  "two-five-inch-drive", "three-five-inch-drive", "two-five-vs-three-five", "solid-state-drives", "hdd-vs-ssd",
  "ssd-communication-interfaces", "sata-storage-interface", "pcie-storage-interface", "nvme", "nvme-vs-pcie",
  "sata-vs-nvme", "sas", "sata-vs-sas", "ssd-form-factors", "m2", "m2-vs-nvme", "msata",
  "m2-vs-msata", "drive-configurations", "raid-0", "raid-1", "raid-0-vs-raid-1", "raid-5", "raid-6",
  "raid-5-vs-raid-6", "raid-10", "raid-10-fault-tolerance", "raid-comparison", "raid-is-not-backup",
  "removable-storage", "flash-drives", "memory-cards", "flash-drive-vs-memory-card", "optical-drives",
  "optical-vs-magnetic-vs-flash", "storage-map", "recognition-cues", "exam-trap", "scenario-workflow",
  "maestro-recognition-sheet"
];
const sectionIds34 = (lesson34.sections || []).map(section => section.id);
requireValue(sectionIds34.length === new Set(sectionIds34).size, "Objective 3.4 section IDs must be unique.");
expectedSections34.forEach(id => requireValue(sectionIds34.includes(id), "Objective 3.4 is missing section: " + id));
const requiredTopics34 = [
  "Hard Drives", "Spindle Speeds", "Hard-Drive Form Factors", "2.5-Inch Drive", "3.5-Inch Drive",
  "Solid-State Drives", "SSD Communication Interfaces", "Non-Volatile Memory Express (NVMe)",
  "SATA Storage Interface", "PCIe Storage Interface", "Serial Attached SCSI (SAS)", "SSD Form Factors",
  "M.2", "Mini-Serial Advanced Technology Attachment (mSATA)", "Drive Configurations", "RAID 0", "RAID 1",
  "RAID 5", "RAID 6", "RAID 10", "Removable Storage", "Flash Drives", "Memory Cards", "Optical Drives"
];
const lessonText34 = JSON.stringify(lesson34);
requiredTopics34.forEach(topic => requireValue(lessonText34.includes(topic), "Objective 3.4 is missing required topic: " + topic));
requireValue(Array.isArray(bank34) && bank34.length === 24, "Objective 3.4 protected Sweep bank must contain exactly 24 questions.");
requireValue(bank34[0]?.id === "A1201-3.4-R001", "Objective 3.4 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank34Hash === "A26162035E9B46431C3822B5B08EEADDCA01D18A4E4B0AA67F3FA60305AC5A35", "Objective 3.4 protected Sweep bank bytes changed.");

requireValue(lesson35.schemaVersion === 1, "Objective 3.5 schemaVersion must be 1.");
requireValue(lesson35.certification === "aplus-core1" && lesson35.examCode === "220-1201", "Objective 3.5 metadata must match A+ Core 1 220-1201.");
requireValue(lesson35.world === "3" && lesson35.objective === "3.5", "Objective 3.5 route metadata must match World 3.");
requireValue(lesson35.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson35, "miniCheck"), "Objective 3.5 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections35 = [
  "what-you-are-learning", "maestro-focus", "motherboard-form-factors", "atx", "microatx", "itx",
  "motherboard-form-factor-comparison", "motherboard-connector-types", "pci", "pcie-expansion", "pci-vs-pcie",
  "power-connectors", "sata-motherboard-connector", "esata-motherboard-connector", "headers",
  "m2-motherboard-connector", "motherboard-compatibility", "cpu-socket-types", "amd-intel-socket-compatibility",
  "multisocket-motherboards", "multisocket-vs-multicore", "bios-uefi-settings", "boot-options", "usb-permissions",
  "tpm-security-features", "fan-considerations", "secure-boot", "tpm-vs-secure-boot", "firmware-passwords",
  "temperature-monitoring", "virtualization-support", "hardware-encryption", "tpm", "hsm", "tpm-vs-hsm",
  "cpu-architecture", "x86-x64", "arm", "x86-x64-vs-arm", "core-configurations", "core-count-vs-clock-speed",
  "expansion-cards", "sound-card", "video-card", "capture-card", "video-card-vs-capture-card",
  "network-interface-card", "cooling", "fans", "heat-sink", "thermal-paste-pads",
  "heat-sink-vs-thermal-material", "liquid-cooling", "air-vs-liquid-cooling", "cpu-cooling-installation",
  "recognition-maps", "recognition-cues", "exam-trap", "scenario-workflow", "maestro-recognition-sheet"
];
const sectionIds35 = (lesson35.sections || []).map(section => section.id);
requireValue(sectionIds35.length === new Set(sectionIds35).size, "Objective 3.5 section IDs must be unique.");
expectedSections35.forEach(id => requireValue(sectionIds35.includes(id), "Objective 3.5 is missing section: " + id));
const requiredTopics35 = [
  "Motherboard Form Factors", "Advanced Technology Extended (ATX)", "microATX", "Information Technology eXtended (ITX)",
  "Motherboard Connector Types", "Peripheral Component Interconnect (PCI)", "PCIe Expansion", "Power Connectors",
  "SATA Motherboard Connector", "eSATA Motherboard Connector", "Headers", "M.2 Motherboard Connector",
  "Motherboard Compatibility", "CPU Socket Types", "AMD Socket Compatibility", "Intel Socket Compatibility",
  "Multisocket Motherboards", "BIOS/UEFI Settings", "Boot Options", "USB Permissions", "TPM Security Features",
  "Fan Considerations", "Secure Boot", "Boot Password", "BIOS Password", "Temperature Monitoring",
  "Virtualization Support", "Hardware Encryption", "Trusted Platform Module (TPM)", "Hardware Security Module (HSM)",
  "CPU Architecture", "x86/x64", "Advanced RISC Machine (ARM)", "Core Configurations", "Expansion Cards",
  "Sound Card", "Video Card", "Capture Card", "Network Interface Card", "Cooling", "Fans", "Heat Sink",
  "Thermal Paste/Pads", "Liquid Cooling"
];
const lessonText35 = JSON.stringify(lesson35);
requiredTopics35.forEach(topic => requireValue(lessonText35.includes(topic), "Objective 3.5 is missing required topic: " + topic));
requireValue(Array.isArray(bank35) && bank35.length === 44, "Objective 3.5 protected Sweep bank must contain exactly 44 questions.");
requireValue(bank35[0]?.id === "A1201-3.5-R001", "Objective 3.5 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank35Hash === "C51EA57CCB6BAC261EE328EA4DD5396079CF4836AD757B0C00AA778F5E6962B2", "Objective 3.5 protected Sweep bank bytes changed.");

requireValue(lesson36.schemaVersion === 1, "Objective 3.6 schemaVersion must be 1.");
requireValue(lesson36.certification === "aplus-core1" && lesson36.examCode === "220-1201", "Objective 3.6 metadata must match A+ Core 1 220-1201.");
requireValue(lesson36.world === "3" && lesson36.objective === "3.6", "Objective 3.6 route metadata must match World 3.");
requireValue(lesson36.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson36, "miniCheck"), "Objective 3.6 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections36 = [
  "what-you-are-learning", "maestro-focus", "what-a-power-supply-does", "input-voltage", "110-120-vac",
  "220-240-vac", "input-voltage-comparison", "automatic-voltage-selection", "output-voltages", "3-3v-output",
  "5v-output", "12v-output", "input-vs-output-voltage", "20-plus-4-pin-connector",
  "motherboard-vs-cpu-power", "redundant-power-supply", "how-redundancy-works",
  "redundant-vs-higher-wattage", "modular-power-supply", "modular-vs-non-modular", "modular-cable-safety",
  "wattage-rating", "selecting-wattage", "undersized-power-supply", "wattage-vs-wall-voltage",
  "energy-efficiency", "higher-efficiency", "efficiency-vs-wattage", "efficiency-example",
  "installation-workflow", "psu-recognition-map", "recognition-cues", "exam-trap", "scenario-decision-path",
  "maestro-recognition-sheet"
];
const sectionIds36 = (lesson36.sections || []).map(section => section.id);
requireValue(sectionIds36.length === new Set(sectionIds36).size, "Objective 3.6 section IDs must be unique.");
expectedSections36.forEach(id => requireValue(sectionIds36.includes(id), "Objective 3.6 is missing section: " + id));
const requiredTopics36 = [
  "Input Voltage", "110-120 VAC", "220-240 VAC", "Output 3.3V vs. 5V vs. 12V",
  "20+4 Pin Motherboard Connector", "Redundant Power Supply", "Modular Power Supply",
  "Wattage Rating", "Energy Efficiency"
];
const lessonText36 = JSON.stringify(lesson36);
requiredTopics36.forEach(topic => requireValue(lessonText36.includes(topic), "Objective 3.6 is missing required topic: " + topic));
requireValue(Array.isArray(bank36) && bank36.length === 7, "Objective 3.6 protected Sweep bank must contain exactly 7 questions.");
requireValue(bank36[0]?.id === "A1201-3.6-R001", "Objective 3.6 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank36Hash === "6919D9D816C4C7261009442CD063FA11523FFBF55E933CE8462FCF682A2A7C27", "Objective 3.6 protected Sweep bank bytes changed.");

requireValue(lesson37.schemaVersion === 1, "Objective 3.7 schemaVersion must be 1.");
requireValue(lesson37.certification === "aplus-core1" && lesson37.examCode === "220-1201", "Objective 3.7 metadata must match A+ Core 1 220-1201.");
requireValue(lesson37.world === "3" && lesson37.objective === "3.7", "Objective 3.7 route metadata must match World 3.");
requireValue(lesson37.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson37, "miniCheck"), "Objective 3.7 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections37 = [
  "what-you-are-learning", "maestro-focus", "unboxing", "setup-location", "operating-system-printer-drivers",
  "pcl", "postscript", "pcl-vs-postscript", "printer-firmware", "device-connectivity",
  "usb-printer-connectivity", "ethernet-printer-connectivity", "wireless-printer-connectivity",
  "connectivity-comparison", "public-shared-devices", "printer-share", "print-server", "share-vs-server",
  "configuration-settings", "duplex-printing", "page-orientation", "tray-settings", "print-quality",
  "printer-security", "user-authentication", "badging", "audit-logs", "secured-prints",
  "authentication-vs-secured-print", "network-scan-services", "scan-to-email", "scan-to-smb",
  "scan-to-cloud-services", "scan-destination-comparison", "automatic-document-feeder", "flatbed-scanner",
  "adf-flatbed-scanner", "recognition-cues", "exam-trap", "deployment-workflow", "maestro-recognition-sheet"
];
const sectionIds37 = (lesson37.sections || []).map(section => section.id);
requireValue(sectionIds37.length === new Set(sectionIds37).size, "Objective 3.7 section IDs must be unique.");
expectedSections37.forEach(id => requireValue(sectionIds37.includes(id), "Objective 3.7 is missing section: " + id));
const requiredTopics37 = [
  "Properly Unboxing the Device", "Choosing the Setup Location", "Operating-System Printer Drivers",
  "PCL vs. PostScript", "Printer Firmware", "Device Connectivity", "USB Printer Connectivity",
  "Ethernet Printer Connectivity", "Wireless Printer Connectivity", "Public/Shared Devices", "Printer Share",
  "Print Server", "Configuration Settings", "Duplex Printing", "Page Orientation", "Tray Settings",
  "Print Quality", "Printer Security", "User Authentication", "Badging", "Audit Logs", "Secured Prints",
  "Network Scan Services", "Scan to Email", "Scan to SMB", "Scan to Cloud Services", "ADF/Flatbed Scanner"
];
const lessonText37 = JSON.stringify(lesson37);
requiredTopics37.forEach(topic => requireValue(lessonText37.includes(topic), "Objective 3.7 is missing required topic: " + topic));
requireValue(Array.isArray(bank37) && bank37.length === 26, "Objective 3.7 protected Sweep bank must contain exactly 26 questions.");
requireValue(bank37[0]?.id === "A1201-3.7-R001", "Objective 3.7 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank37Hash === "B4244E7716C385784AB3F6F97ABF4CDFEBE35CADEF12BEBDC5F4CF8E6BFE791A", "Objective 3.7 protected Sweep bank bytes changed.");

requireValue(lesson38.schemaVersion === 1, "Objective 3.8 schemaVersion must be 1.");
requireValue(lesson38.certification === "aplus-core1" && lesson38.examCode === "220-1201", "Objective 3.8 metadata must match A+ Core 1 220-1201.");
requireValue(lesson38.world === "3" && lesson38.objective === "3.8", "Objective 3.8 route metadata must match World 3.");
requireValue(lesson38.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson38, "miniCheck"), "Objective 3.8 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections38 = [
  "what-you-are-learning", "maestro-focus", "laser-printers", "replacing-toner", "laser-maintenance-kit",
  "laser-calibration", "laser-cleaning", "laser-maintenance", "inkjet-printers", "ink-cartridge",
  "inkjet-printhead", "cleaning-printheads", "roller-and-feeder", "replacing-ink-cartridges",
  "inkjet-calibration", "clearing-inkjet-jams", "inkjet-maintenance", "thermal-printers", "feed-assembly",
  "special-thermal-paper", "replacing-thermal-paper", "heating-element", "thermal-debris", "thermal-maintenance",
  "impact-printers", "multipart-paper", "impact-ribbon", "impact-printhead", "impact-paper", "impact-maintenance",
  "printer-technology-comparison", "recognition-cues", "exam-trap", "maintenance-workflow",
  "maestro-recognition-sheet"
];
const sectionIds38 = (lesson38.sections || []).map(section => section.id);
requireValue(sectionIds38.length === new Set(sectionIds38).size, "Objective 3.8 section IDs must be unique.");
expectedSections38.forEach(id => requireValue(sectionIds38.includes(id), "Objective 3.8 is missing section: " + id));
const requiredTopics38 = [
  "Laser Printers", "Laser Maintenance", "Inkjet Printers", "Ink Cartridge", "Inkjet Printhead",
  "Inkjet Roller and Feeder", "Inkjet Maintenance", "Thermal Printers", "Feed Assembly",
  "Special Thermal Paper", "Thermal Maintenance", "Impact Printers", "Multipart Paper", "Impact Maintenance"
];
const lessonText38 = JSON.stringify(lesson38);
requiredTopics38.forEach(topic => requireValue(lessonText38.includes(topic), "Objective 3.8 is missing required topic: " + topic));
requireValue(Array.isArray(bank38) && bank38.length === 12, "Objective 3.8 protected Sweep bank must contain exactly 12 questions.");
requireValue(bank38[0]?.id === "A1201-3.8-R001", "Objective 3.8 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank38Hash === "DECDDD52701DF0A987DA1025F8534F93493DB195438D7EE887DEB50DD46A987E", "Objective 3.8 protected Sweep bank bytes changed.");

requireValue(lesson41.schemaVersion === 1, "Objective 4.1 schemaVersion must be 1.");
requireValue(lesson41.certification === "aplus-core1" && lesson41.examCode === "220-1201", "Objective 4.1 metadata must match A+ Core 1 220-1201.");
requireValue(lesson41.world === "4" && lesson41.objective === "4.1", "Objective 4.1 route metadata must match World 4.");
requireValue(lesson41.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson41, "miniCheck"), "Objective 4.1 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections41 = [
  "what-you-are-learning", "maestro-focus", "virtual-machines", "purpose-of-virtual-machines", "sandbox",
  "sandbox-vs-production", "test-development", "vm-testing-benefits", "application-virtualization",
  "legacy-software-os", "cross-platform-virtualization", "legacy-vs-cross-platform",
  "virtual-machine-requirements", "security-requirements", "isolation-and-security", "network-requirements",
  "storage-requirements", "resource-planning", "desktop-virtualization", "vdi", "vdi-vs-local-desktop",
  "containers", "containers-vs-vms", "container-use-cases", "hypervisors", "type-1-hypervisor",
  "type-2-hypervisor", "type-1-vs-type-2", "host-guest-hypervisor", "virtualization-map",
  "recognition-cues", "exam-trap", "virtualization-decision-path", "maestro-recognition-sheet"
];
const sectionIds41 = (lesson41.sections || []).map(section => section.id);
requireValue(sectionIds41.length === new Set(sectionIds41).size, "Objective 4.1 section IDs must be unique.");
expectedSections41.forEach(id => requireValue(sectionIds41.includes(id), "Objective 4.1 is missing section: " + id));
const requiredTopics41 = [
  "Purpose of Virtual Machines", "Sandbox", "Test Development", "Application Virtualization", "Legacy Software/OS",
  "Cross-Platform Virtualization", "Virtual-Machine Requirements", "Security Requirements", "Network Requirements",
  "Storage Requirements", "Desktop Virtualization", "Virtual Desktop Infrastructure (VDI)", "Containers", "Hypervisors",
  "Type 1 Hypervisor", "Type 2 Hypervisor"
];
const lessonText41 = JSON.stringify(lesson41);
requiredTopics41.forEach(topic => requireValue(lessonText41.includes(topic), "Objective 4.1 is missing required topic: " + topic));
requireValue(Array.isArray(bank41) && bank41.length === 16, "Objective 4.1 protected Sweep bank must contain exactly 16 questions.");
requireValue(bank41[0]?.id === "A1201-4.1-R001", "Objective 4.1 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank41Hash === "EF2826A243FC1C60966F139DAA79197EBFC1D625128A3EE79D91C77DCD8F85F6", "Objective 4.1 protected Sweep bank bytes changed.");

requireValue(lesson42.schemaVersion === 1, "Objective 4.2 schemaVersion must be 1.");
requireValue(lesson42.certification === "aplus-core1" && lesson42.examCode === "220-1201", "Objective 4.2 metadata must match A+ Core 1 220-1201.");
requireValue(lesson42.world === "4" && lesson42.objective === "4.2", "Objective 4.2 route metadata must match World 4.");
requireValue(lesson42.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson42, "miniCheck"), "Objective 4.2 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections42 = [
  "what-you-are-learning", "maestro-focus", "common-cloud-models", "private-cloud", "public-cloud",
  "private-vs-public", "hybrid-cloud", "community-cloud", "deployment-model-recognition", "cloud-service-models",
  "iaas", "saas", "paas", "service-model-comparison", "cloud-characteristics", "shared-resources",
  "dedicated-resources", "shared-vs-dedicated", "metered-utilization", "ingress", "egress", "ingress-vs-egress",
  "elasticity", "elasticity-vs-scalability", "availability", "availability-vs-performance", "file-synchronization",
  "synchronization-vs-backup", "multitenancy", "multitenancy-vs-shared-resources",
  "multitenancy-vs-public-cloud", "cloud-maps", "recognition-cues", "exam-trap", "cloud-decision-path",
  "maestro-recognition-sheet"
];
const sectionIds42 = (lesson42.sections || []).map(section => section.id);
requireValue(sectionIds42.length === new Set(sectionIds42).size, "Objective 4.2 section IDs must be unique.");
expectedSections42.forEach(id => requireValue(sectionIds42.includes(id), "Objective 4.2 is missing section: " + id));
const requiredTopics42 = [
  "Common Cloud Models", "Private Cloud", "Public Cloud", "Hybrid Cloud", "Community Cloud",
  "Infrastructure as a Service (IaaS)", "Software as a Service (SaaS)", "Platform as a Service (PaaS)",
  "Cloud Characteristics", "Shared vs. Dedicated Resources", "Metered Utilization", "Ingress/Egress",
  "Elasticity", "Availability", "File Synchronization", "Multitenancy"
];
const lessonText42 = JSON.stringify(lesson42);
requiredTopics42.forEach(topic => requireValue(lessonText42.includes(topic), "Objective 4.2 is missing required topic: " + topic));
requireValue(Array.isArray(bank42) && bank42.length === 16, "Objective 4.2 protected Sweep bank must contain exactly 16 questions.");
requireValue(bank42[0]?.id === "A1201-4.2-R001", "Objective 4.2 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank42Hash === "D54B7B78E66A4FA497AE76D5012F3A20F30F2935A1CB9C804572F5DD0966B393", "Objective 4.2 protected Sweep bank bytes changed.");

requireValue(lesson51.schemaVersion === 1, "Objective 5.1 schemaVersion must be 1.");
requireValue(lesson51.certification === "aplus-core1" && lesson51.examCode === "220-1201", "Objective 5.1 metadata must match A+ Core 1 220-1201.");
requireValue(lesson51.world === "5" && lesson51.objective === "5.1", "Objective 5.1 route metadata must match World 5.");
requireValue(lesson51.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson51, "miniCheck"), "Objective 5.1 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections51 = [
  "what-you-are-learning", "maestro-focus", "common-symptoms", "troubleshooting-by-symptom", "post",
  "post-beeps", "post-vs-os-errors", "proprietary-crash-screens", "blank-screen", "ram-and-blank-screen",
  "no-power", "no-power-vs-blank-screen", "sluggish-performance", "insufficient-ram", "overheating",
  "common-causes-overheating", "burning-smell", "random-shutdown", "shutdown-vs-restart",
  "application-crashes", "ram-and-application-crashes", "unusual-noise", "fan-noise", "capacitor-swelling",
  "inaccurate-system-date-time", "date-time-vs-network", "symptom-map", "recognition-cues", "exam-trap",
  "troubleshooting-workflow", "maestro-recognition-sheet"
];
const sectionIds51 = (lesson51.sections || []).map(section => section.id);
requireValue(sectionIds51.length === new Set(sectionIds51).size, "Objective 5.1 section IDs must be unique.");
expectedSections51.forEach(id => requireValue(sectionIds51.includes(id), "Objective 5.1 is missing section: " + id));
const requiredTopics51 = [
  "Common Motherboard, RAM, CPU, and Power Symptoms", "POST Beeps", "Proprietary Crash Screens",
  "Blank Screen", "No Power", "Sluggish Performance", "Overheating", "Burning Smell", "Random Shutdown",
  "Application Crashes", "Unusual Noise", "Capacitor Swelling", "Inaccurate System Date/Time"
];
const lessonText51 = JSON.stringify(lesson51);
requiredTopics51.forEach(topic => requireValue(lessonText51.includes(topic), "Objective 5.1 is missing required topic: " + topic));
requireValue(Array.isArray(bank51) && bank51.length === 13, "Objective 5.1 protected Sweep bank must contain exactly 13 questions.");
requireValue(bank51[0]?.id === "A1201-5.1-R001", "Objective 5.1 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank51Hash === "3FDDB0D248FA9E7BEB683EEFAC4D5F6A6D737932CC620B8700169C204BD48F67", "Objective 5.1 protected Sweep bank bytes changed.");

requireValue(lesson52.schemaVersion === 1, "Objective 5.2 schemaVersion must be 1.");
requireValue(lesson52.certification === "aplus-core1" && lesson52.examCode === "220-1201", "Objective 5.2 metadata must match A+ Core 1 220-1201.");
requireValue(lesson52.world === "5" && lesson52.objective === "5.2", "Objective 5.2 route metadata must match World 5.");
requireValue(lesson52.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson52, "miniCheck"), "Objective 5.2 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections52 = [
  "what-you-are-learning", "maestro-focus", "common-symptoms", "led-status-indicators", "grinding-noises",
  "clicking-sounds", "grinding-vs-clicking", "bootable-device-not-found", "boot-device-flow",
  "data-loss-corruption", "raid-failure", "raid-0-failure", "raid-1-failure", "raid-5-failure",
  "raid-6-failure", "raid-10-failure", "raid-comparison", "smart", "smart-failure",
  "extended-read-write-times", "low-performance-iops", "read-write-vs-iops", "missing-drives-os",
  "firmware-vs-os-detection", "array-missing", "missing-drive-vs-array", "audible-alarms",
  "alarm-vs-drive-noise", "storage-troubleshooting-flow", "recognition-cues", "exam-trap",
  "maestro-recognition-sheet"
];
const sectionIds52 = (lesson52.sections || []).map(section => section.id);
requireValue(sectionIds52.length === new Set(sectionIds52).size, "Objective 5.2 section IDs must be unique.");
expectedSections52.forEach(id => requireValue(sectionIds52.includes(id), "Objective 5.2 is missing section: " + id));
const requiredTopics52 = [
  "Common Drive and RAID Symptoms", "LED Status Indicators", "Grinding Noises", "Clicking Sounds",
  "Bootable Device Not Found", "Data Loss/Corruption", "RAID Failure", "S.M.A.R.T. Failure",
  "Extended Read/Write Times", "Low Performance Input/Output Operations Per Second (IOPS)",
  "Missing Drives in the OS", "Array Missing", "Audible Alarms"
];
const lessonText52 = JSON.stringify(lesson52);
requiredTopics52.forEach(topic => requireValue(lessonText52.includes(topic), "Objective 5.2 is missing required topic: " + topic));
requireValue(Array.isArray(bank52) && bank52.length === 13, "Objective 5.2 protected Sweep bank must contain exactly 13 questions.");
requireValue(bank52[0]?.id === "A1201-5.2-R001", "Objective 5.2 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank52Hash === "73766D42FCF5FFF975703FC4B9A1335D3DF3C3F70A98C72A715296ACF120D944", "Objective 5.2 protected Sweep bank bytes changed.");

requireValue(lesson53.schemaVersion === 1, "Objective 5.3 schemaVersion must be 1.");
requireValue(lesson53.certification === "aplus-core1" && lesson53.examCode === "220-1201", "Objective 5.3 metadata must match A+ Core 1 220-1201.");
requireValue(lesson53.world === "5" && lesson53.objective === "5.3", "Objective 5.3 route metadata must match World 5.");
requireValue(lesson53.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson53, "miniCheck"), "Objective 5.3 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections53 = [
  "what-you-are-learning", "maestro-focus", "common-symptoms", "signal-path", "incorrect-input-source",
  "input-vs-cable", "physical-cabling-issues", "intermittent-cable-problems", "burnt-out-bulb",
  "fuzzy-image", "native-resolution", "display-burn-in", "burn-in-vs-retention", "dead-pixels",
  "dead-pixel-vs-burn-in", "flashing-screen", "flashing-vs-intermittent-blank", "incorrect-color-display",
  "color-settings", "audio-issues", "audio-output-device", "dim-image", "dim-monitor-vs-projector",
  "intermittent-projector-shutdown", "projector-thermal-protection", "sizing-issues", "resolution-scaling",
  "distorted-image", "keystone-distortion", "sizing-vs-distortion", "display-category-map",
  "recognition-cues", "exam-trap", "display-troubleshooting-workflow", "maestro-recognition-sheet"
];
const sectionIds53 = (lesson53.sections || []).map(section => section.id);
requireValue(sectionIds53.length === new Set(sectionIds53).size, "Objective 5.3 section IDs must be unique.");
expectedSections53.forEach(id => requireValue(sectionIds53.includes(id), "Objective 5.3 is missing section: " + id));
const requiredTopics53 = [
  "Common Video, Projector, and Display Symptoms", "Incorrect Input Source", "Physical Cabling Issues",
  "Burnt-Out Bulb", "Fuzzy Image", "Display Burn-In", "Dead Pixels", "Flashing Screen",
  "Incorrect Color Display", "Audio Issues", "Dim Image", "Intermittent Projector Shutdown",
  "Sizing Issues", "Distorted Image"
];
const lessonText53 = JSON.stringify(lesson53);
requiredTopics53.forEach(topic => requireValue(lessonText53.includes(topic), "Objective 5.3 is missing required topic: " + topic));
requireValue(Array.isArray(bank53) && bank53.length === 14, "Objective 5.3 protected Sweep bank must contain exactly 14 questions.");
requireValue(bank53[0]?.id === "A1201-5.3-R001", "Objective 5.3 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank53Hash === "09461007F7537363EBC31747854E103F2BD9FEEA0F9772F05E806118AB04522B", "Objective 5.3 protected Sweep bank bytes changed.");

requireValue(lesson54.schemaVersion === 1, "Objective 5.4 schemaVersion must be 1.");
requireValue(lesson54.certification === "aplus-core1" && lesson54.examCode === "220-1201", "Objective 5.4 metadata must match A+ Core 1 220-1201.");
requireValue(lesson54.world === "5" && lesson54.objective === "5.4", "Objective 5.4 route metadata must match World 5.");
requireValue(lesson54.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson54, "miniCheck"), "Objective 5.4 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections54 = [
  "what-you-are-learning", "maestro-focus", "common-symptoms", "poor-battery-health",
  "battery-health-vs-usage", "swollen-battery", "battery-health-vs-swelling", "broken-screen",
  "display-vs-digitizer", "improper-charging", "physically-damaged-ports", "poor-no-connectivity",
  "wifi-cellular-bluetooth", "liquid-damage", "overheating", "overheating-performance",
  "digitizer-issues", "cursor-drift-calibration", "digitizer-vs-calibration", "malware",
  "unable-install-apps", "stylus-does-not-work", "degraded-performance", "recognition-cues",
  "exam-trap", "mobile-troubleshooting-workflow", "maestro-recognition-sheet"
];
const sectionIds54 = (lesson54.sections || []).map(section => section.id);
requireValue(sectionIds54.length === new Set(sectionIds54).size, "Objective 5.4 section IDs must be unique.");
expectedSections54.forEach(id => requireValue(sectionIds54.includes(id), "Objective 5.4 is missing section: " + id));
const requiredTopics54 = [
  "Common Mobile-Device Symptoms", "Poor Battery Health", "Swollen Battery", "Broken Screen", "Improper Charging",
  "Poor/No Connectivity", "Liquid Damage", "Overheating", "Digitizer Issues", "Physically Damaged Ports",
  "Malware", "Cursor Drift/Touch Calibration", "Unable to Install New Applications", "Stylus Does Not Work",
  "Degraded Performance"
];
const lessonText54 = JSON.stringify(lesson54);
requiredTopics54.forEach(topic => requireValue(lessonText54.includes(topic), "Objective 5.4 is missing required topic: " + topic));
requireValue(Array.isArray(bank54) && bank54.length === 15, "Objective 5.4 protected Sweep bank must contain exactly 15 questions.");
requireValue(bank54[0]?.id === "A1201-5.4-R001", "Objective 5.4 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank54Hash === "337D02A67DF88F176C800A7219D2E1DC8947938EA57A28AB4380B5D0D1FDC8A2", "Objective 5.4 protected Sweep bank bytes changed.");

requireValue(lesson55.schemaVersion === 1, "Objective 5.5 schemaVersion must be 1.");
requireValue(lesson55.certification === "aplus-core1" && lesson55.examCode === "220-1201", "Objective 5.5 metadata must match A+ Core 1 220-1201.");
requireValue(lesson55.world === "5" && lesson55.objective === "5.5", "Objective 5.5 route metadata must match World 5.");
requireValue(lesson55.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson55, "miniCheck"), "Objective 5.5 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections55 = [
  "what-you-are-learning", "maestro-focus", "common-symptoms", "intermittent-wireless",
  "wireless-distance", "slow-network-speeds", "speed-vs-latency", "limited-connectivity",
  "limited-vs-none", "jitter", "high-latency", "jitter-vs-latency", "poor-voip-quality",
  "voip-jitter", "voip-latency", "port-flapping", "port-flapping-vs-internet",
  "external-interference", "interference-vs-weak-signal", "authentication-failures",
  "authentication-vs-connectivity", "intermittent-internet", "local-vs-internet",
  "network-symptom-map", "recognition-cues", "exam-trap", "network-troubleshooting-workflow",
  "maestro-recognition-sheet"
];
const sectionIds55 = (lesson55.sections || []).map(section => section.id);
requireValue(sectionIds55.length === new Set(sectionIds55).size, "Objective 5.5 section IDs must be unique.");
expectedSections55.forEach(id => requireValue(sectionIds55.includes(id), "Objective 5.5 is missing section: " + id));
const requiredTopics55 = [
  "Common Network Symptoms", "Intermittent Wireless Connectivity", "Slow Network Speeds", "Limited Connectivity",
  "Jitter", "Poor VoIP Quality", "Port Flapping", "High Latency", "External Interference",
  "Authentication Failures", "Intermittent Internet Connectivity"
];
const lessonText55 = JSON.stringify(lesson55);
requiredTopics55.forEach(topic => requireValue(lessonText55.includes(topic), "Objective 5.5 is missing required topic: " + topic));
requireValue(Array.isArray(bank55) && bank55.length === 11, "Objective 5.5 protected Sweep bank must contain exactly 11 questions.");
requireValue(bank55[0]?.id === "A1201-5.5-R001", "Objective 5.5 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank55Hash === "8B5F0075E30001DDEB8425FBEAD0F90ED9C557F1BB1803689427495AA73FF945", "Objective 5.5 protected Sweep bank bytes changed.");

requireValue(lesson56.schemaVersion === 1, "Objective 5.6 schemaVersion must be 1.");
requireValue(lesson56.certification === "aplus-core1" && lesson56.examCode === "220-1201", "Objective 5.6 metadata must match A+ Core 1 220-1201.");
requireValue(lesson56.world === "5" && lesson56.objective === "5.6", "Objective 5.6 route metadata must match World 5.");
requireValue(lesson56.miniCheckSource === "objective-sweep-bank" && !Object.prototype.hasOwnProperty.call(lesson56, "miniCheck"), "Objective 5.6 must use the GSA-owned Mini Check source without authoring a question.");
const expectedSections56 = [
  "what-you-are-learning", "maestro-focus", "lines-down-pages", "repeating-defects", "garbled-print",
  "printer-languages", "paper-jams", "faded-prints", "paper-not-feeding", "multipage-misfeed",
  "no-feed-vs-misfeed", "multiple-prints-pending", "print-queue", "speckling",
  "speckling-vs-lines", "double-echo-images", "echo-vs-speckling", "grinding-noise",
  "grinding-vs-normal", "finishing-issues", "staple-jams", "hole-punch", "engine-vs-finisher",
  "incorrect-orientation", "tray-not-recognized", "tray-detection-vs-settings", "connectivity-issues",
  "local-vs-network-connectivity", "frozen-print-queue", "frozen-queue-vs-hardware",
  "printer-troubleshooting-map", "recognition-cues", "exam-trap", "printer-troubleshooting-workflow",
  "maestro-recognition-sheet"
];
const sectionIds56 = (lesson56.sections || []).map(section => section.id);
requireValue(sectionIds56.length === new Set(sectionIds56).size, "Objective 5.6 section IDs must be unique.");
expectedSections56.forEach(id => requireValue(sectionIds56.includes(id), "Objective 5.6 is missing section: " + id));
const requiredTopics56 = [
  "Lines Down Printed Pages", "Garbled Print", "Paper Jams", "Faded Prints", "Paper Not Feeding",
  "Multipage Misfeed", "Multiple Prints Pending in Queue", "Speckling on Printed Pages",
  "Double/Echo Images", "Grinding Noise", "Finishing Issues", "Staple Jams", "Hole Punch",
  "Incorrect Page Orientation", "Tray Not Recognized", "Connectivity Issues", "Frozen Print Queue"
];
const lessonText56 = JSON.stringify(lesson56);
requiredTopics56.forEach(topic => requireValue(lessonText56.includes(topic), "Objective 5.6 is missing required topic: " + topic));
requireValue(Array.isArray(bank56) && bank56.length === 17, "Objective 5.6 protected Sweep bank must contain exactly 17 questions.");
requireValue(bank56[0]?.id === "A1201-5.6-R001", "Objective 5.6 GSA Mini Check source must remain the existing first bank question.");
requireValue(bank56Hash === "B1DCE2A60EE74EBA416C9AC3C0D5B92A60160148B5A5BD4C8F87357B22F4DE31", "Objective 5.6 protected Sweep bank bytes changed.");

requireValue(campaign.includes('href="aplus-core1-world1-objectives.html" class="world world1 unlocked"'), "A+ Core 1 Campaign Map World 1 must route to its Objective Hub.");
requireValue(campaign.includes('href="aplus-core1-world2-objectives.html" class="world world2 unlocked"'), "A+ Core 1 Campaign Map World 2 must route to its Objective Hub.");
requireValue(campaign.includes('href="aplus-core1-world3-objectives.html" class="world world3 unlocked"'), "A+ Core 1 Campaign Map World 3 must route to its Objective Hub.");
requireValue(campaign.includes('href="aplus-core1-world4-objectives.html" class="world world4 unlocked"'), "A+ Core 1 Campaign Map World 4 must route to its Objective Hub.");
requireValue(campaign.includes('href="aplus-core1-world5-objectives.html" class="world world5 unlocked"'), "A+ Core 1 Campaign Map World 5 must route to its Objective Hub.");
requireValue(hub.includes("aplus-core1-field-manual.html?world=1&amp;objective=1.1"), "World 1 Objective Hub is missing the Objective 1.1 Field Manual action.");
requireValue(hub.includes("aplus-core1-quiz.html?world=1&amp;objective=1.1"), "World 1 Objective Hub is missing the direct Objective 1.1 Sweep action.");
requireValue(hub.includes("aplus-core1-field-manual.html?world=1&amp;objective=1.2"), "World 1 Objective Hub is missing the Objective 1.2 Field Manual action.");
requireValue(hub.includes('href="aplus-core1-quiz.html?world=1&amp;objective=1.2"'), "Objective 1.2 Sweep route changed unexpectedly.");
requireValue(hub.includes("aplus-core1-field-manual.html?world=1&amp;objective=1.3"), "World 1 Objective Hub is missing the Objective 1.3 Field Manual action.");
requireValue(hub.includes('href="aplus-core1-quiz.html?world=1&amp;objective=1.3"'), "Objective 1.3 Sweep route changed unexpectedly.");
requireValue(hub.includes('href="aplus-core1-campaign.html" class="back-link">← Return to Campaign Map</a>'), "World 1 Objective Hub must return to the A+ Core 1 Campaign Map.");
requireValue(hub2.includes("aplus-core1-field-manual.html?world=2&amp;objective=2.1"), "World 2 Objective Hub is missing the Objective 2.1 Field Manual action.");
requireValue(hub2.includes('href="aplus-core1-quiz.html?world=2&amp;objective=2.1"'), "Objective 2.1 Sweep route changed unexpectedly.");
requireValue(hub2.includes("aplus-core1-field-manual.html?world=2&amp;objective=2.2"), "World 2 Objective Hub is missing the Objective 2.2 Field Manual action.");
requireValue(hub2.includes('href="aplus-core1-quiz.html?world=2&amp;objective=2.2"'), "Objective 2.2 Sweep route changed unexpectedly.");
requireValue(hub2.includes("aplus-core1-field-manual.html?world=2&amp;objective=2.3"), "World 2 Objective Hub is missing the Objective 2.3 Field Manual action.");
requireValue(hub2.includes('href="aplus-core1-quiz.html?world=2&amp;objective=2.3"'), "Objective 2.3 Sweep route changed unexpectedly.");
requireValue(hub2.includes("aplus-core1-field-manual.html?world=2&amp;objective=2.4"), "World 2 Objective Hub is missing the Objective 2.4 Field Manual action.");
requireValue(hub2.includes('href="aplus-core1-quiz.html?world=2&amp;objective=2.4"'), "Objective 2.4 Sweep route changed unexpectedly.");
requireValue(hub2.includes("aplus-core1-field-manual.html?world=2&amp;objective=2.5"), "World 2 Objective Hub is missing the Objective 2.5 Field Manual action.");
requireValue(hub2.includes('href="aplus-core1-quiz.html?world=2&amp;objective=2.5"'), "Objective 2.5 Sweep route changed unexpectedly.");
requireValue(hub2.includes("aplus-core1-field-manual.html?world=2&amp;objective=2.6"), "World 2 Objective Hub is missing the Objective 2.6 Field Manual action.");
requireValue(hub2.includes('href="aplus-core1-quiz.html?world=2&amp;objective=2.6"'), "Objective 2.6 Sweep route changed unexpectedly.");
requireValue(hub2.includes("aplus-core1-field-manual.html?world=2&amp;objective=2.7"), "World 2 Objective Hub is missing the Objective 2.7 Field Manual action.");
requireValue(hub2.includes('href="aplus-core1-quiz.html?world=2&amp;objective=2.7"'), "Objective 2.7 Sweep route changed unexpectedly.");
requireValue(hub2.includes("aplus-core1-field-manual.html?world=2&amp;objective=2.8"), "World 2 Objective Hub is missing the Objective 2.8 Field Manual action.");
requireValue(hub2.includes('href="aplus-core1-quiz.html?world=2&amp;objective=2.8"'), "Objective 2.8 Sweep route changed unexpectedly.");
requireValue(hub2.includes('href="aplus-core1-campaign.html" class="back-link">← Return to Campaign Map</a>'), "World 2 Objective Hub must return to the A+ Core 1 Campaign Map.");
requireValue(hub3.includes("aplus-core1-field-manual.html?world=3&amp;objective=3.1"), "World 3 Objective Hub is missing the Objective 3.1 Field Manual action.");
requireValue(hub3.includes('href="aplus-core1-quiz.html?world=3&amp;objective=3.1"'), "Objective 3.1 Sweep route changed unexpectedly.");
requireValue(hub3.includes("aplus-core1-field-manual.html?world=3&amp;objective=3.2"), "World 3 Objective Hub is missing the Objective 3.2 Field Manual action.");
requireValue(hub3.includes('href="aplus-core1-quiz.html?world=3&amp;objective=3.2"'), "Objective 3.2 Sweep route changed unexpectedly.");
requireValue(hub3.includes("aplus-core1-field-manual.html?world=3&amp;objective=3.3"), "World 3 Objective Hub is missing the Objective 3.3 Field Manual action.");
requireValue(hub3.includes('href="aplus-core1-quiz.html?world=3&amp;objective=3.3"'), "Objective 3.3 Sweep route changed unexpectedly.");
requireValue(hub3.includes("aplus-core1-field-manual.html?world=3&amp;objective=3.4"), "World 3 Objective Hub is missing the Objective 3.4 Field Manual action.");
requireValue(hub3.includes('href="aplus-core1-quiz.html?world=3&amp;objective=3.4"'), "Objective 3.4 Sweep route changed unexpectedly.");
requireValue(hub3.includes("aplus-core1-field-manual.html?world=3&amp;objective=3.5"), "World 3 Objective Hub is missing the Objective 3.5 Field Manual action.");
requireValue(hub3.includes('href="aplus-core1-quiz.html?world=3&amp;objective=3.5"'), "Objective 3.5 Sweep route changed unexpectedly.");
requireValue(hub3.includes("aplus-core1-field-manual.html?world=3&amp;objective=3.6"), "World 3 Objective Hub is missing the Objective 3.6 Field Manual action.");
requireValue(hub3.includes('href="aplus-core1-quiz.html?world=3&amp;objective=3.6"'), "Objective 3.6 Sweep route changed unexpectedly.");
requireValue(hub3.includes("aplus-core1-field-manual.html?world=3&amp;objective=3.7"), "World 3 Objective Hub is missing the Objective 3.7 Field Manual action.");
requireValue(hub3.includes('href="aplus-core1-quiz.html?world=3&amp;objective=3.7"'), "Objective 3.7 Sweep route changed unexpectedly.");
requireValue(hub3.includes("aplus-core1-field-manual.html?world=3&amp;objective=3.8"), "World 3 Objective Hub is missing the Objective 3.8 Field Manual action.");
requireValue(hub3.includes('href="aplus-core1-quiz.html?world=3&amp;objective=3.8"'), "Objective 3.8 Sweep route changed unexpectedly.");
requireValue(hub3.includes('href="aplus-core1-campaign.html" class="back-link">← Return to Campaign Map</a>'), "World 3 Objective Hub must return to the A+ Core 1 Campaign Map.");
requireValue(hub4.includes('href="security-plus-field-manual.css"') && hub4.includes('src="aplus-core1-objective-hub.js"'), "World 4 Objective Hub must use the established Field Manual card presentation and status engine.");
requireValue(hub4.includes("aplus-core1-field-manual.html?world=4&amp;objective=4.1"), "World 4 Objective Hub is missing the Objective 4.1 Field Manual action.");
requireValue(hub4.includes('href="aplus-core1-quiz.html?world=4&amp;objective=4.1"'), "Objective 4.1 Sweep route changed unexpectedly.");
requireValue(hub4.includes("aplus-core1-field-manual.html?world=4&amp;objective=4.2"), "World 4 Objective Hub is missing the Objective 4.2 Field Manual action.");
requireValue(hub4.includes('href="aplus-core1-quiz.html?world=4&amp;objective=4.2"'), "Objective 4.2 Sweep route changed unexpectedly.");
requireValue(hub4.includes('href="aplus-core1-campaign.html" class="back-link">← Return to Campaign Map</a>'), "World 4 Objective Hub must return to the A+ Core 1 Campaign Map.");
requireValue(hub5.includes('href="security-plus-field-manual.css"') && hub5.includes('src="aplus-core1-objective-hub.js"'), "World 5 Objective Hub must use the established Field Manual card presentation and status engine.");
requireValue(hub5.includes("aplus-core1-field-manual.html?world=5&amp;objective=5.1"), "World 5 Objective Hub is missing the Objective 5.1 Field Manual action.");
requireValue(hub5.includes('href="aplus-core1-quiz.html?world=5&amp;objective=5.1"'), "Objective 5.1 Sweep route changed unexpectedly.");
requireValue(hub5.includes("aplus-core1-field-manual.html?world=5&amp;objective=5.2"), "World 5 Objective Hub is missing the Objective 5.2 Field Manual action.");
requireValue(hub5.includes('href="aplus-core1-quiz.html?world=5&amp;objective=5.2"'), "Objective 5.2 Sweep route changed unexpectedly.");
requireValue(hub5.includes("aplus-core1-field-manual.html?world=5&amp;objective=5.3"), "World 5 Objective Hub is missing the Objective 5.3 Field Manual action.");
requireValue(hub5.includes('href="aplus-core1-quiz.html?world=5&amp;objective=5.3"'), "Objective 5.3 Sweep route changed unexpectedly.");
requireValue(hub5.includes("aplus-core1-field-manual.html?world=5&amp;objective=5.4"), "World 5 Objective Hub is missing the Objective 5.4 Field Manual action.");
requireValue(hub5.includes('href="aplus-core1-quiz.html?world=5&amp;objective=5.4"'), "Objective 5.4 Sweep route changed unexpectedly.");
requireValue(hub5.includes("aplus-core1-field-manual.html?world=5&amp;objective=5.5"), "World 5 Objective Hub is missing the Objective 5.5 Field Manual action.");
requireValue(hub5.includes('href="aplus-core1-quiz.html?world=5&amp;objective=5.5"'), "Objective 5.5 Sweep route changed unexpectedly.");
requireValue(hub5.includes("aplus-core1-field-manual.html?world=5&amp;objective=5.6"), "World 5 Objective Hub is missing the Objective 5.6 Field Manual action.");
requireValue(hub5.includes('href="aplus-core1-quiz.html?world=5&amp;objective=5.6"'), "Objective 5.6 Sweep route changed unexpectedly.");
requireValue(hub5.includes('href="aplus-core1-campaign.html" class="back-link">← Return to Campaign Map</a>'), "World 5 Objective Hub must return to the A+ Core 1 Campaign Map.");
requireValue(manualPage.includes('id="aplusManualNavigation"') && manualScript.includes("function renderNavigation()"), "A+ Core 1 Field Manual is missing lesson navigation.");
requireValue(manualScript.includes('const MANUAL_KEY = "hydra-aplus-core1-field-manual-v1"'), "A+ Core 1 Field Manual completion storage must remain isolated.");
requireValue(hubScript.includes('const PROGRESS_KEY = "hydra-aplus-core1-progress-v1"'), "A+ Core 1 Objective Hub must read the existing Sweep progress key.");
requireValue(hubScript.includes('["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "4.1", "4.2", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6"]'), "A+ Core 1 Objective Hub must show independent status through Objective 5.6.");
requireValue(manualScript.includes('"json/aplus-core1/world" + world + "/" + objective + "-hatchling.json"'), "A+ Core 1 Mini Check must use the existing GSA bank at runtime.");
requireValue(manualScript.includes('window.location.assign("aplus-core1-quiz.html?world="'), "A+ Core 1 Field Manual must continue to the existing Objective Sweep.");
requireValue(manualScript.includes('elements.returnLink.href = "aplus-core1-world" + world + "-objectives.html";'), "A+ Core 1 Field Manual must return to its Objective Hub.");
requireValue(quizScript.includes('return { href: `aplus-core1-world${world}-objectives.html`, label: `Return to World ${world}` };'), "A+ Core 1 Objective Sweep must continue returning to its Objective Hub.");

if (errors.length) {
  console.error("A+ Core 1 Field Manual validation: FAIL");
  errors.forEach(error => console.error("- " + error));
  process.exitCode = 1;
} else {
  console.log("A+ Core 1 Field Manual validation: PASS");
  console.log("- Objective 1.1 official mappings: 11 of 11 (100%)");
  console.log(`- Objective 1.1 lesson architecture and ${expectedSections.length}-section navigator: PASS`);
  console.log("- GSA-owned Mini Check source; no new question authored: PASS");
  console.log("- Manual completion and Objective Sweep mastery remain separate: PASS");
  console.log("- Protected Objective 1.1 Sweep bank remains 11 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 1.2 official mappings: 14 of 14 (100%)");
  console.log(`- Objective 1.2 lesson architecture and ${expectedSections12.length}-section navigator: PASS`);
  console.log("- Protected Objective 1.2 Sweep bank remains 14 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 1.3 official mappings: 27 of 27 (100%)");
  console.log(`- Objective 1.3 lesson architecture and ${expectedSections13.length}-section navigator: PASS`);
  console.log("- Protected Objective 1.3 Sweep bank remains 27 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 2.1 official mappings: 16 of 16 (100%)");
  console.log(`- Objective 2.1 lesson architecture and ${expectedSections21.length}-section navigator: PASS`);
  console.log("- Protected Objective 2.1 Sweep bank remains 16 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 2.2 official mappings: 14 of 14 (100%)");
  console.log(`- Objective 2.2 lesson architecture and ${expectedSections22.length}-section navigator: PASS`);
  console.log("- Protected Objective 2.2 Sweep bank remains 14 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 2.3 official mappings: 19 of 19 (100%)");
  console.log(`- Objective 2.3 lesson architecture and ${expectedSections23.length}-section navigator: PASS`);
  console.log("- Protected Objective 2.3 Sweep bank remains 19 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 2.4 official mappings: 17 of 17 (100%)");
  console.log(`- Objective 2.4 lesson architecture and ${expectedSections24.length}-section navigator: PASS`);
  console.log("- Protected Objective 2.4 Sweep bank remains 17 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 2.5 official mappings: 16 of 16 (100%)");
  console.log(`- Objective 2.5 lesson architecture and ${expectedSections25.length}-section navigator: PASS`);
  console.log("- Protected Objective 2.5 Sweep bank remains 16 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 2.6 official mappings: 10 of 10 (100%)");
  console.log(`- Objective 2.6 lesson architecture and ${expectedSections26.length}-section navigator: PASS`);
  console.log("- Protected Objective 2.6 Sweep bank remains 10 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 2.7 official mappings: 14 of 14 (100%)");
  console.log(`- Objective 2.7 lesson architecture and ${expectedSections27.length}-section navigator: PASS`);
  console.log("- Protected Objective 2.7 Sweep bank remains 14 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 2.8 official mappings: 8 of 8 (100%)");
  console.log(`- Objective 2.8 lesson architecture and ${expectedSections28.length}-section navigator: PASS`);
  console.log("- Protected Objective 2.8 Sweep bank remains 8 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 3.1 official mappings: 14 of 14 (100%)");
  console.log(`- Objective 3.1 lesson architecture and ${expectedSections31.length}-section navigator: PASS`);
  console.log("- Protected Objective 3.1 Sweep bank remains 14 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 3.2 official mappings: 41 of 41 (100%)");
  console.log(`- Objective 3.2 lesson architecture and ${expectedSections32.length}-section navigator: PASS`);
  console.log("- Protected Objective 3.2 Sweep bank remains 41 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 3.3 official mappings: 6 of 6 (100%)");
  console.log(`- Objective 3.3 lesson architecture and ${expectedSections33.length}-section navigator: PASS`);
  console.log("- Protected Objective 3.3 Sweep bank remains 6 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 3.4 official mappings: 24 of 24 (100%)");
  console.log(`- Objective 3.4 lesson architecture and ${expectedSections34.length}-section navigator: PASS`);
  console.log("- Protected Objective 3.4 Sweep bank remains 24 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 3.5 official mappings: 44 of 44 (100%)");
  console.log(`- Objective 3.5 lesson architecture and ${expectedSections35.length}-section navigator: PASS`);
  console.log("- Protected Objective 3.5 Sweep bank remains 44 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 3.6 official mappings: 7 of 7 (100%)");
  console.log(`- Objective 3.6 lesson architecture and ${expectedSections36.length}-section navigator: PASS`);
  console.log("- Protected Objective 3.6 Sweep bank remains 7 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 3.7 official mappings: 26 of 26 (100%)");
  console.log(`- Objective 3.7 lesson architecture and ${expectedSections37.length}-section navigator: PASS`);
  console.log("- Protected Objective 3.7 Sweep bank remains 26 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 3.8 official mappings: 12 of 12 (100%)");
  console.log(`- Objective 3.8 lesson architecture and ${expectedSections38.length}-section navigator: PASS`);
  console.log("- Protected Objective 3.8 Sweep bank remains 12 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 4.1 official mappings: 16 of 16 (100%)");
  console.log(`- Objective 4.1 lesson architecture and ${expectedSections41.length}-section navigator: PASS`);
  console.log("- Protected Objective 4.1 Sweep bank remains 16 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 4.2 official mappings: 16 of 16 (100%)");
  console.log(`- Objective 4.2 lesson architecture and ${expectedSections42.length}-section navigator: PASS`);
  console.log("- Protected Objective 4.2 Sweep bank remains 16 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 5.1 official mappings: 13 of 13 (100%)");
  console.log(`- Objective 5.1 lesson architecture and ${expectedSections51.length}-section navigator: PASS`);
  console.log("- Protected Objective 5.1 Sweep bank remains 13 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 5.2 official mappings: 13 of 13 (100%)");
  console.log(`- Objective 5.2 lesson architecture and ${expectedSections52.length}-section navigator: PASS`);
  console.log("- Protected Objective 5.2 Sweep bank remains 13 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 5.3 official mappings: 14 of 14 (100%)");
  console.log(`- Objective 5.3 lesson architecture and ${expectedSections53.length}-section navigator: PASS`);
  console.log("- Protected Objective 5.3 Sweep bank remains 14 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 5.4 official mappings: 15 of 15 (100%)");
  console.log(`- Objective 5.4 lesson architecture and ${expectedSections54.length}-section navigator: PASS`);
  console.log("- Protected Objective 5.4 Sweep bank remains 15 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 5.5 official mappings: 11 of 11 (100%)");
  console.log(`- Objective 5.5 lesson architecture and ${expectedSections55.length}-section navigator: PASS`);
  console.log("- Protected Objective 5.5 Sweep bank remains 11 questions and byte-for-byte unchanged: PASS");
  console.log("- Objective 5.6 official mappings: 17 of 17 (100%)");
  console.log(`- Objective 5.6 lesson architecture and ${expectedSections56.length}-section navigator: PASS`);
  console.log("- Protected Objective 5.6 Sweep bank remains 17 questions and byte-for-byte unchanged: PASS");
}
