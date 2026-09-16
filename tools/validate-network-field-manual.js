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
    count: 7,
    hash: "E442BA03BA540CD23125C6B96E8CF44BF1F92C69B3386C47287815AEB4E80903",
    firstId: 1,
    sections: ["what-you-are-learning", "maestro-focus", "layers-one-through-four", "layers-five-through-seven", "layer-comparison", "encapsulation", "troubleshooting", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Layer 1 - Physical", "Layer 2 - Data Link", "Layer 3 - Network", "Layer 4 - Transport", "Layer 5 - Session", "Layer 6 - Presentation", "Layer 7 - Application"]
  },
  "1.2": {
    count: 16,
    hash: "359AF7CC8F34444B1BD67DBC8C2FAABB2958C1722AC25422CA8D7C0A451215EB",
    firstId: 112001,
    sections: ["what-you-are-learning", "maestro-focus", "physical-and-virtual", "forwarding-and-security", "delivery-and-intermediation", "storage", "wireless", "network-functions", "comparison-map", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Physical and Virtual Appliances", "Router", "Switch", "Firewall", "Intrusion Detection System (IDS)", "Intrusion Prevention System (IPS)", "Load Balancer", "Proxy", "Network-Attached Storage (NAS)", "Storage Area Network (SAN)", "Access Point (AP)", "Wireless Controller", "Content Delivery Network (CDN)", "Virtual Private Network (VPN)", "Quality of Service (QoS)", "Time to Live (TTL)"]
  },
  "1.3": {
    count: 17,
    hash: "FB13F7CB9A1B2D568C4773D513D3841931AA3E3930D39188C995A31493B5F182",
    firstId: 113001,
    sections: ["what-you-are-learning", "maestro-focus", "virtual-networking", "cloud-security-controls", "cloud-gateways", "cloud-connectivity", "deployment-models", "service-models", "cloud-characteristics", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Network Functions Virtualization (NFV)", "Virtual Private Cloud (VPC)", "Network Security Group", "Network Security List", "Internet Gateway", "Network Address Translation (NAT) Gateway", "Virtual Private Network (VPN)", "Direct Connect", "Public Cloud", "Private Cloud", "Hybrid Cloud", "Software as a Service (SaaS)", "Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Scalability", "Elasticity", "Multitenancy"]
  },
  "1.4": {
    count: 32,
    hash: "EE20C77122A52017353EE9C0298F17144890C5A8B2112B7FDF2F607DB47C8358",
    firstId: 114001,
    sections: ["what-you-are-learning", "maestro-focus", "core-ports", "file-and-remote-services", "infrastructure-services", "application-services", "ip-types", "ipsec-components", "traffic-types", "port-memory-ladder", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["File Transfer Protocol (FTP)", "Secure File Transfer Protocol (SFTP)", "Secure Shell (SSH)", "Telnet", "Simple Mail Transfer Protocol (SMTP)", "Domain Name System (DNS)", "Dynamic Host Configuration Protocol (DHCP)", "Trivial File Transfer Protocol (TFTP)", "Hypertext Transfer Protocol (HTTP)", "Network Time Protocol (NTP)", "Simple Network Management Protocol (SNMP)", "Lightweight Directory Access Protocol (LDAP)", "Hypertext Transfer Protocol Secure (HTTPS)", "Server Message Block (SMB)", "Syslog", "Simple Mail Transfer Protocol Secure (SMTPS)", "Lightweight Directory Access Protocol over SSL (LDAPS)", "Structured Query Language (SQL) Server", "Remote Desktop Protocol (RDP)", "Session Initiation Protocol (SIP)", "Internet Control Message Protocol (ICMP)", "Transmission Control Protocol (TCP)", "User Datagram Protocol (UDP)", "Generic Routing Encapsulation (GRE)", "Internet Protocol Security (IPSec)", "Authentication Header (AH)", "Encapsulating Security Payload (ESP)", "Internet Key Exchange (IKE)", "Unicast", "Multicast", "Anycast", "Broadcast"]
  },
  "1.5": {
    count: 24,
    hash: "607ABBD0D00065EDF9F3426C7AA9187337751CF2457A30D0EBB9F2338C29CBDB",
    firstId: 115001,
    sections: ["what-you-are-learning", "maestro-focus", "wireless-media", "wired-media", "cable-selection", "transceivers", "connector-types", "media-comparison", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["802.11 Standards", "Cellular", "Satellite", "802.3 Standards", "Single-Mode Fiber", "Multimode Fiber", "Direct Attach Copper (DAC) Cable", "Twinaxial Cable", "Coaxial Cable", "Cable Speeds", "Plenum vs. Non-Plenum Cable", "Ethernet", "Fibre Channel (FC)", "Small Form-Factor Pluggable (SFP)", "Quad Small Form-Factor Pluggable (QSFP)", "Subscriber Connector (SC)", "Local Connector (LC)", "Straight Tip (ST)", "Multi-Fiber Push On (MPO)", "RJ11", "RJ45", "F-type", "Bayonet Neill-Concelman (BNC)"]
  },
  "1.6": {
    count: 12,
    hash: "63D257A6A1F4E09AB6A4FBC36CA5E87641F5D4406B0BA11C96DA915AFD30ED3F",
    firstId: 116001,
    sections: ["what-you-are-learning", "maestro-focus", "mesh-and-hybrid", "star-and-point-to-point", "spine-and-leaf", "three-tier", "collapsed-core", "traffic-flows", "architecture-comparison", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Mesh", "Hybrid", "Star/Hub and Spoke", "Spine and Leaf", "Point to Point", "Three-Tier Hierarchical Model", "Core", "Distribution", "Access", "Collapsed Core", "North-South", "East-West"]
  },
  "1.7": {
    count: 12,
    hash: "CAA5A5A56EBAFC10428598BDCFCD85D7D359E00C7820AB614316C35C6946CB7F",
    firstId: 117001,
    sections: ["what-you-are-learning", "maestro-focus", "ipv4-basics", "public-and-private", "special-addresses", "subnetting-and-cidr", "cidr-example", "vlsm", "ipv4-classes", "address-examples", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Public vs. Private", "Automatic Private IP Addressing (APIPA)", "RFC1918", "Loopback/Localhost", "Subnetting", "Variable Length Subnet Mask (VLSM)", "Classless Inter-Domain Routing (CIDR)", "Class A", "Class B", "Class C", "Class D", "Class E"]
  },
  "1.8": {
    count: 26,
    hash: "D0FE4332DD841FB6CFF4CC7DF57D2D5E8D2709F47C77CA80CE77977FB8CC6E20",
    firstId: 118001,
    sections: ["what-you-are-learning", "maestro-focus", "sdn-and-sdwan", "sdwan-capabilities", "vxlan-and-dci", "zero-trust", "sase-and-sse", "infrastructure-as-code", "source-control", "ipv6-addressing", "ipv6-compatibility", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Software-Defined Networking (SDN)", "Software-Defined Wide Area Network (SD-WAN)", "Application Aware", "Zero-Touch Provisioning", "Transport Agnostic", "Central Policy Management", "Virtual Extensible Local Area Network (VXLAN)", "Data Center Interconnect (DCI)", "Layer 2 Encapsulation", "Zero Trust Architecture (ZTA)", "Policy-Based Authentication", "Authorization", "Least Privilege Access", "Secure Access Service Edge (SASE)", "Security Service Edge (SSE)", "Infrastructure as Code (IaC)", "Playbooks", "Templates", "Reusable Tasks", "Configuration Drift", "Compliance", "Upgrades", "Dynamic Inventories", "Source Control", "Version Control", "Central Repository", "Conflict Identification", "Branching", "IPv6 Addressing", "Mitigates IPv4 Address Exhaustion", "Tunneling", "Dual Stack", "NAT64"],
    teaching: ["Plug it in and it configures itself", "Authentication = who; authorization = what", "SASE security without the WAN piece", "Expected state ≠ actual state", "Who changed what and when", "IPv4 uses 32-bit addressing", "IPv6 uses 128-bit addressing", "Zero-Touch Provisioning vs. Central Policy Management", "ZTA vs. Least Privilege", "Configuration Drift vs. Version Control", "Repository vs. Branch"]
  },
  "2.1": {
    count: 14,
    hash: "981FB71F8E9FE8E41B77A241C6D90A1FD4D4630677DAE386A85A783CDBEBF8B2",
    firstId: "2.1-01",
    sections: ["what-you-are-learning", "maestro-focus", "static-and-dynamic-routing", "dynamic-routing-protocols", "route-selection", "address-translation", "gateway-redundancy", "subinterfaces", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Static Routing", "Dynamic Routing", "Border Gateway Protocol (BGP)", "Enhanced Interior Gateway Routing Protocol (EIGRP)", "Open Shortest Path First (OSPF)", "Administrative Distance", "Prefix Length", "Metric", "Network Address Translation (NAT)", "Port Address Translation (PAT)", "First Hop Redundancy Protocol (FHRP)", "Virtual IP (VIP)", "Subinterfaces"]
  },
  "2.2": {
    count: 13,
    hash: "E0E04AC2D18442E5678BA34BFAF6895505DE5A17D0A85CC01F9D04DF71E468AD",
    firstId: 122001,
    sections: ["what-you-are-learning", "maestro-focus", "vlans-and-svis", "trunk-and-voice-configuration", "link-aggregation", "speed-and-duplex", "spanning-tree", "mtu-and-jumbo-frames", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Virtual Local Area Network (VLAN)", "VLAN Database", "Switch Virtual Interface (SVI)", "Native VLAN", "Voice VLAN", "802.1Q Tagging", "Link Aggregation", "Speed", "Duplex", "Spanning Tree", "Maximum Transmission Unit (MTU)", "Jumbo Frames"]
  },
  "2.3": {
    count: 26,
    hash: "A5A03059F8746E7143C79A1F25B80D4A1F9744F362C814E08032219C6C1A8A1F",
    firstId: "2.3-01",
    sections: ["what-you-are-learning", "maestro-focus", "channels-and-regulation", "frequency-options", "service-set-identifiers", "wireless-network-types", "wireless-encryption", "guest-access-and-authentication", "antennas", "access-point-management", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Channel Width", "Non-Overlapping Channels", "Regulatory Impacts", "802.11h", "2.4 GHz", "5 GHz", "6 GHz", "Band Steering", "Service Set Identifier (SSID)", "Basic Service Set Identifier (BSSID)", "Extended Service Set Identifier (ESSID)", "Mesh Networks", "Ad Hoc", "Point-to-Point", "Infrastructure", "Wi-Fi Protected Access 2 (WPA2)", "WPA3", "Guest Networks", "Captive Portals", "Pre-Shared Key (PSK)", "Enterprise Authentication", "Omnidirectional", "Directional", "Autonomous AP", "Lightweight AP"]
  },
  "2.4": {
    count: 4,
    hash: "47BFFDADBE2E29DC80F7DCE9C70C760C6CEF7099F36F1E964746087E48806D1A",
    firstId: "2.4-01",
    sections: ["what-you-are-learning", "maestro-focus", "installation-locations", "racks-and-airflow", "cabling-distribution", "physical-security", "power", "environmental-factors", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Intermediate Distribution Frame (IDF)", "Main Distribution Frame (MDF)", "Rack Size", "Port-Side Exhaust/Intake", "Patch Panel", "Fiber Distribution Panel", "Lockable", "Uninterruptible Power Supply (UPS)", "Power Distribution Unit (PDU)", "Power Load", "Voltage", "Humidity", "Fire Suppression", "Temperature"]
  },
  "3.1": {
    count: 29,
    hash: "722AE0036C62C4E6F17F0E26C5EFB028002E18FD7BE06488B1C12FBC7DCC5557",
    firstId: "3.1-01",
    sections: ["what-you-are-learning", "maestro-focus", "documentation", "physical-logical-and-rack-diagrams", "cable-and-network-diagrams", "asset-inventory", "ipam-sla-and-wireless-survey", "life-cycle-management", "software-management", "change-management", "configuration-management", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Physical Diagram", "Logical Diagram", "Rack Diagram", "Cable Maps", "Layer 1 Diagram", "Layer 2 Diagram", "Layer 3 Diagram", "Hardware", "Software", "Licensing", "Warranty Support", "IP Address Management (IPAM)", "Service-Level Agreement (SLA)", "Wireless Survey", "Heat Map", "End-of-Life (EOL)", "End-of-Support (EOS)", "Patches and Bug Fixes", "Operating System (OS)", "Firmware", "Decommissioning", "Change Management", "Request Process Tracking", "Service Request", "Production Configuration", "Backup Configuration", "Baseline/Golden Configuration"]
  },
  "3.2": {
    count: 26,
    hash: "3FCE0E622AB3A8399D862471FB98660ED7EF2F0C10EEE94A53849C14ADAC3214",
    firstId: "3.2-01",
    sections: ["what-you-are-learning", "maestro-focus", "snmp", "snmp-versions", "flow-and-packet-capture", "baselines-and-anomalies", "logs-and-siem", "api-and-port-mirroring", "network-discovery", "monitoring-solutions", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Simple Network Management Protocol (SNMP)", "SNMP Traps", "Management Information Base (MIB)", "SNMP v2c", "SNMP v3", "Community Strings", "Authentication", "Flow Data", "Packet Capture", "Baseline Metrics", "Anomaly Alerting/Notification", "Log Aggregation", "Syslog Collector", "Security Information and Event Management (SIEM)", "Application Programming Interface (API) Integration", "Port Mirroring", "Network Discovery", "Ad Hoc Discovery", "Scheduled Discovery", "Traffic Analysis", "Performance Monitoring", "Availability Monitoring", "Configuration Monitoring"]
  },
  "3.3": {
    count: 14,
    hash: "0918B22A05D0C9B4A8FBAA4600EC37E0837C38246F7C90D930081E36E0427E23",
    firstId: 133001,
    sections: ["what-you-are-learning", "maestro-focus", "dr-metrics", "dr-sites", "high-availability", "dr-testing", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Recovery Point Objective (RPO)", "Recovery Time Objective (RTO)", "Mean Time to Repair (MTTR)", "Mean Time Between Failures (MTBF)", "Cold Site", "Warm Site", "Hot Site", "Active-Active", "Active-Passive", "Tabletop Exercise", "Validation Test"]
  },
  "3.4": {
    count: 30,
    hash: "DFBBCEA222953A8528855C532A298E87A7E526154A46CCF657770DCD303EB3D6",
    firstId: "3.4-01",
    sections: ["what-you-are-learning", "maestro-focus", "dhcp", "slaac", "dns-security", "dns-records", "dns-zones-and-answers", "hosts-file", "time-protocols", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Dynamic Host Configuration Protocol (DHCP)", "Scope", "Reservation", "Lease Time", "Options", "Relay/IP Helper", "Exclusions", "Stateless Address Autoconfiguration (SLAAC)", "Domain Name System (DNS)", "Domain Name System Security Extensions (DNSSEC)", "DNS over HTTPS (DoH)", "DNS over TLS (DoT)", "Address (A)", "AAAA", "Canonical Name (CNAME)", "Mail Exchange (MX)", "Text (TXT)", "Nameserver (NS)", "Pointer (PTR)", "Forward", "Reverse", "Authoritative", "Non-Authoritative", "Primary", "Secondary", "Recursive", "Hosts File", "Network Time Protocol (NTP)", "Precision Time Protocol (PTP)", "Network Time Security (NTS)"]
  },
  "3.5": {
    count: 12,
    hash: "F64335DCF19533F9A97E9EB934CB269DE189D2DCE2A34590FCA55A3454C758E7",
    firstId: "3.5-01",
    sections: ["what-you-are-learning", "maestro-focus", "vpn-types", "split-and-full-tunnels", "connection-methods", "jump-box", "in-band-and-out-of-band", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Site-to-Site VPN", "Client-to-Site VPN", "Clientless VPN", "Split Tunnel", "Full Tunnel", "Secure Shell (SSH)", "Graphical User Interface (GUI)", "Application Programming Interface (API)", "Console", "Jump Box", "In-Band Management", "Out-of-Band Management"]
  },
  "4.1": {
    count: 38,
    hash: "409A30E027C1A269A29F83656AB2D4B468A146067B587DA45BB47DF8E4746C89",
    firstId: "4.1-01",
    sections: ["what-you-are-learning", "maestro-focus", "encryption-and-certificates", "identity-and-access-management", "aaa-and-federation", "authorization-controls", "physical-and-deception-security", "security-terminology", "cia-triad", "compliance", "network-segmentation", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Encryption", "Data in Transit", "Data at Rest", "Digital Certificate", "Public Key Infrastructure (PKI)", "Self-Signed Certificate", "Identity and Access Management (IAM)", "Authentication", "Multifactor Authentication (MFA)", "Single Sign-On (SSO)", "RADIUS", "LDAP", "SAML", "TACACS+", "Time-Based Authentication", "Authorization", "Least Privilege", "Role-Based Access Control (RBAC)", "Geofencing", "Cameras", "Locks", "Honeypot", "Honeynet", "Risk", "Vulnerability", "Exploit", "Threat", "Confidentiality", "Integrity", "Availability", "Data Locality", "PCI DSS", "GDPR", "Network Segmentation", "IoT", "IIoT", "SCADA", "ICS", "OT", "Guest", "BYOD"]
  },
  "4.2": {
    count: 18,
    hash: "CB28242AC2A93FAD8425548F2650DB775B99E73A4E89B2D4E21262A24EE85E0F",
    firstId: "4.2-01",
    sections: ["what-you-are-learning", "maestro-focus", "denial-of-service", "switching-attacks", "arp-attacks", "dns-attacks", "rogue-and-wireless-attacks", "social-engineering", "malware", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Denial-of-Service (DoS)", "Distributed Denial-of-Service (DDoS)", "VLAN Hopping", "Media Access Control (MAC) Flooding", "ARP Poisoning", "ARP Spoofing", "DNS Poisoning", "DNS Spoofing", "Rogue DHCP", "Rogue AP", "Evil Twin", "On-Path Attack", "Phishing", "Dumpster Diving", "Shoulder Surfing", "Tailgating", "Malware"]
  },
  "4.3": {
    count: 13,
    hash: "2535504C1E327BF3AC20F00A1DC55ADB248700B711511D8797745748E623CF50",
    firstId: "4.3-01",
    sections: ["what-you-are-learning", "maestro-focus", "device-hardening", "network-access-control", "key-management", "security-rules", "security-zones", "defense-in-depth", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Device Hardening", "Disable Unused Ports and Services", "Change Default Passwords", "Network Access Control (NAC)", "Port Security", "802.1X", "MAC Filtering", "Key Management", "Access Control List (ACL)", "URL Filtering", "Content Filtering", "Trusted Zone", "Untrusted Zone", "Screened Subnet"]
  },
  "5.1": {
    count: 20,
    hash: "46D282F6946E7EFF51040034DBCECD2411016AEA49BCFD08F1E6FEDA0F00E99C",
    firstId: "5.1-01",
    sections: ["what-you-are-learning", "maestro-focus", "identify-problem", "establish-theory", "test-theory", "plan-and-implement", "verify-and-prevent", "document", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Gather information", "Question users", "Identify symptoms", "Determine whether anything changed", "Duplicate the problem", "Approach multiple problems individually", "Question the obvious", "Top-to-Bottom OSI", "Bottom-to-Top OSI", "Divide and Conquer", "Test the Theory", "Establish a Plan of Action", "Implement or Escalate", "Verify Full System Functionality", "preventive measures", "Document Throughout the Process"]
  },
  "5.2": {
    count: 24,
    hash: "B64ED7B8B4B441D72BFBBC5B16A43B28B074D4B8D5190FA407CD9E349C6C6DCF",
    firstId: "5.2-01",
    sections: ["what-you-are-learning", "maestro-focus", "cable-selection", "signal-degradation", "termination-and-polarity", "interface-counters", "port-status", "poe", "transceivers", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Single-Mode", "Multimode", "Category 5/6/7/8", "STP vs. UTP", "Crosstalk", "Interference", "Attenuation", "Improper Termination", "TX/RX Transposed", "Cyclic Redundancy Check (CRC)", "Runts", "Giants", "Drops", "Error Disabled", "Administratively Down", "Suspended", "Power Budget Exceeded", "Incorrect Standard", "Transceiver", "Signal Strength"]
  },
  "5.3": {
    count: 14,
    hash: "A30E994B683973CF74BAA50C7529F3321F513BCC57FCE5ECAFF6E1FCEEEEF1C0",
    firstId: "5.3-01",
    sections: ["what-you-are-learning", "maestro-focus", "stp", "vlan-and-acl", "route-selection", "addressing", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Network Loops", "Root Bridge Selection", "Port Roles", "Port States", "Incorrect VLAN Assignment", "Access Control List (ACL)", "Routing Table", "Default Route", "Address Pool Exhaustion", "Incorrect Default Gateway", "Incorrect IP Address", "Duplicate IP Address", "Incorrect Subnet Mask"]
  },
  "5.4": {
    count: 13,
    hash: "04168D99027CA363313070C2B4235000672CA252C7504DD598D43F77ADFB48AE",
    firstId: "5.4-01",
    sections: ["what-you-are-learning", "maestro-focus", "capacity", "latency-loss-and-jitter", "wireless-performance", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Congestion", "Contention", "Bottleneck", "Bandwidth", "Throughput Capacity", "Latency", "Packet Loss", "Jitter", "Interference", "Channel Overlap", "Signal Degradation or Loss", "Insufficient Wireless Coverage", "Client Disassociation", "Roaming Misconfiguration"]
  },
  "5.5": {
    count: 13,
    hash: "D8B4BAFAE8479A1F72DF967A4C3E59AA663AA2A792B11D43C54783CD14367139",
    firstId: "5.5-01",
    sections: ["what-you-are-learning", "maestro-focus", "protocol-analyzer", "command-line-tools", "discovery-and-speed", "hardware-tools", "device-commands", "tool-selection", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Protocol Analyzer", "ping", "traceroute / tracert", "nslookup", "tcpdump", "dig", "netstat", "ip / ifconfig / ipconfig", "arp", "Nmap", "LLDP / CDP", "Speed Tester", "Toner", "Cable Tester", "Network Tap", "Wi-Fi Analyzer", "Visual Fault Locator", "show mac-address-table", "show route", "show interface", "show config", "show arp", "show vlan", "show power"]
  }
};

for (const [objective, expected] of Object.entries(objectives)) {
  const lesson = json(`json/network-plus/field-manual/${objective}.json`);
  const expectedWorld = objective.split(".")[0];
  const bankPath = path.join(root, `json/world${expectedWorld}/${objective}-hatchling.json`);
  const bankBytes = fs.readFileSync(bankPath);
  const bank = JSON.parse(bankBytes.toString("utf8"));
  const hash = crypto.createHash("sha256").update(bankBytes).digest("hex").toUpperCase();
  const sectionIds = (lesson.sections || []).map(section => section.id);
  const lessonText = JSON.stringify(lesson);

  requireValue(lesson.schemaVersion === 1, `${objective} schemaVersion must be 1.`);
  requireValue(lesson.certification === "network-plus" && lesson.examCode === "N10-009", `${objective} metadata must match Network+ N10-009.`);
  requireValue(lesson.world === expectedWorld && lesson.objective === objective, `${objective} route metadata must match World ${expectedWorld}.`);
  requireValue(lesson.miniCheckSource === "objective-sweep-bank", `${objective} must use the GSA-owned Mini Check source.`);
  requireValue(!Object.prototype.hasOwnProperty.call(lesson, "miniCheck"), `${objective} lesson data must not author a Mini Check question.`);
  requireValue(sectionIds.length === new Set(sectionIds).size, `${objective} section IDs must be unique.`);
  expected.sections.forEach(id => requireValue(sectionIds.includes(id), `${objective} is missing section: ${id}`));
  expected.topics.forEach(topic => requireValue(lessonText.toLowerCase().includes(topic.toLowerCase()), `${objective} is missing required topic: ${topic}`));
  (expected.teaching || []).forEach(cue => requireValue(lessonText.toLowerCase().includes(cue.toLowerCase()), `${objective} is missing authoritative GSA teaching content: ${cue}`));
  requireValue(Array.isArray(bank) && bank.length === expected.count, `${objective} protected Sweep bank must contain exactly ${expected.count} questions.`);
  requireValue(bank[0]?.id === expected.firstId, `${objective} Mini Check source must remain the first protected bank question.`);
  requireValue(hash === expected.hash, `${objective} protected Sweep bank bytes changed.`);
}

const hubs = {
  "1": read("network-world1-objectives.html"),
  "2": read("network-world2-objectives.html"),
  "3": read("network-world3-objectives.html"),
  "4": read("network-world4-objectives.html"),
  "5": read("network-world5-objectives.html")
};
const campaign = read("network-campaign.html");
const manualPage = read("network-field-manual.html");
const manualScript = read("network-field-manual.js");
const hubScript = read("network-objective-hub.js");
const quizScript = read("quiz.js");

requireValue(campaign.includes('href="network-world1-objectives.html"'), "Campaign World 1 must route to its Objective Hub.");
requireValue(campaign.includes('href="network-world2-objectives.html"'), "Campaign World 2 must route to its Objective Hub.");
requireValue(campaign.includes('href="network-world3-objectives.html"'), "Campaign World 3 must route to its Objective Hub.");
requireValue(campaign.includes('href="network-world4-objectives.html"'), "Campaign World 4 must route to its Objective Hub.");
requireValue(campaign.includes('href="network-world5-objectives.html"'), "Campaign World 5 must route to its Objective Hub.");
for (const objective of Object.keys(objectives)) {
  const world = objective.split(".")[0];
  const hub = hubs[world];
  requireValue(hub.includes(`network-field-manual.html?world=${world}&amp;objective=${objective}`), `World ${world} Hub is missing the ${objective} Field Manual action.`);
  requireValue(hub.includes(`hydra-quiz.html?world=${world}&amp;objective=${objective}`), `${objective} Sweep route changed unexpectedly.`);
  requireValue(hub.includes(`id="objective${objective.replace(".", "")}ManualStatus"`) && hub.includes(`id="objective${objective.replace(".", "")}SweepStatus"`), `${objective} Manual and Sweep statuses must remain separate.`);
}
for (const [world, hub] of Object.entries(hubs)) {
  requireValue(hub.includes('href="security-plus-field-manual.css"') && hub.includes('src="network-objective-hub.js"'), `World ${world} Hub must use the established Field Manual card presentation and status engine.`);
  requireValue(hub.includes('href="network-campaign.html" class="back-link">← Return to Campaign Map</a>'), `World ${world} Hub must return to the Network+ Campaign Map.`);
}
requireValue(manualPage.includes('id="networkManualNavigation"') && manualScript.includes("function renderNavigation()"), "The Field Manual is missing lesson navigation.");
requireValue(manualScript.includes('const MANUAL_KEY = "hydra-network-plus-field-manual-v1"'), "Manual completion storage must remain isolated.");
requireValue(hubScript.includes('const PROGRESS_KEY = "hydra-network-plus-progress-v1"'), "The Objective Hub must read the existing Sweep progress key.");
requireValue(manualScript.includes('"json/world" + world + "/" + objective + "-hatchling.json"'), "Mini Check must load the existing Sweep bank at runtime.");
requireValue(manualScript.includes('window.location.assign("hydra-quiz.html?world="'), "Completing a manual must continue to the existing Objective Sweep.");
requireValue(manualScript.includes('elements.returnLink.href = "network-world" + world + "-objectives.html"'), "Field Manuals must return to their Objective Hub.");
requireValue(manualScript.includes('(world === "2" && /^2\\.[1-4]$/.test(objective))'), "The Field Manual route gate must include only published World 2 objectives 2.1-2.4.");
requireValue(manualScript.includes('(world === "3" && /^3\\.[1-5]$/.test(objective))'), "The Field Manual route gate must include published World 3 objectives 3.1-3.5.");
requireValue(manualScript.includes('(world === "4" && /^4\\.[1-3]$/.test(objective))'), "The Field Manual route gate must include only published World 4 objectives 4.1-4.3.");
requireValue(manualScript.includes('(world === "5" && /^5\\.[1-5]$/.test(objective))'), "The Field Manual route gate must include published World 5 objectives 5.1-5.5.");
requireValue(quizScript.includes("returnLink.href = getWorldMenuFile(world)"), "Objective Sweeps must continue returning to their Objective Hub.");

if (errors.length) {
  console.error("Network+ Field Manual validation: FAIL");
  errors.forEach(error => console.error("- " + error));
  process.exitCode = 1;
} else {
  console.log("Network+ Field Manual validation: PASS");
  for (const [objective, expected] of Object.entries(objectives)) {
    console.log(`- Objective ${objective} official mappings: ${expected.count} of ${expected.count} (100%)`);
    console.log(`- Objective ${objective} lesson architecture and ${expected.sections.length}-section navigator: PASS`);
    console.log(`- Protected Objective ${objective} Sweep bank remains ${expected.count} questions and byte-for-byte unchanged: PASS`);
  }
  console.log("- GSA-owned Mini Checks; no new questions authored: PASS");
  console.log("- Manual completion and Sweep mastery remain separate: PASS");
  console.log("- Campaign, Objective Hub, Field Manual, and Sweep navigation: PASS");
}
