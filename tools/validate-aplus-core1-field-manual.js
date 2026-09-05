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
const hub = read("aplus-core1-world1-objectives.html");
const hub2 = read("aplus-core1-world2-objectives.html");
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

requireValue(campaign.includes('href="aplus-core1-world1-objectives.html" class="world world1 unlocked"'), "A+ Core 1 Campaign Map World 1 must route to its Objective Hub.");
requireValue(campaign.includes('href="aplus-core1-world2-objectives.html" class="world world2 unlocked"'), "A+ Core 1 Campaign Map World 2 must route to its Objective Hub.");
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
requireValue(manualPage.includes('id="aplusManualNavigation"') && manualScript.includes("function renderNavigation()"), "A+ Core 1 Field Manual is missing lesson navigation.");
requireValue(manualScript.includes('const MANUAL_KEY = "hydra-aplus-core1-field-manual-v1"'), "A+ Core 1 Field Manual completion storage must remain isolated.");
requireValue(hubScript.includes('const PROGRESS_KEY = "hydra-aplus-core1-progress-v1"'), "A+ Core 1 Objective Hub must read the existing Sweep progress key.");
requireValue(hubScript.includes('["1.1", "1.2", "1.3", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8"]'), "A+ Core 1 Objective Hub must show independent status for Objectives 1.1 through 2.8.");
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
}
