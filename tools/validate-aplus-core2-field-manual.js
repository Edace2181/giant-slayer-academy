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
  },
  "1.9": {
    count: 45,
    hash: "C70AC36DFC4AC3A8F7672C9A8D11A437FF9B0E5BB7F2E13A0DF36B262D738F8E",
    firstId: "A1202-1.9-R001",
    sections: ["what-you-are-learning", "maestro-focus", "file-management", "filesystem-management", "administrative", "package-management", "network", "informational", "text-editors", "common-configuration-files", "os-components", "root-account", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["File Management", "ls", "pwd", "mv", "cp", "rm", "chmod", "chown", "grep", "find", "Filesystem Management", "fsck", "mount", "Administrative", "su", "sudo", "Package Management", "apt", "dnf", "Network", "ip", "ping", "curl", "dig", "traceroute", "Informational", "man", "cat", "top", "ps", "du", "df", "Text Editors", "nano", "Common Configuration Files", "/etc/passwd", "/etc/shadow", "/etc/hosts", "/etc/fstab", "/etc/resolv.conf", "OS Components", "systemd", "Kernel", "Bootloader", "Root Account"]
  },
  "1.10": {
    count: 18,
    hash: "3B44E9AF36F12B4CC0F4E9E17A8B927102B1297D76B3890A0D0C1755B99ADB85",
    firstId: "A1202-1.10-R001",
    sections: ["what-you-are-learning", "maestro-focus", "system-requirements", "architecture-requirements", "graphics-requirements", "hardware-requirements", "application-os-compatibility", "distribution-methods", "impact-considerations", "installation-workflow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["System Requirements for Applications", "32-bit vs. 64-bit Dependent Application Requirements", "Dedicated vs. Integrated Graphics Card", "Video Random-Access Memory (VRAM) Requirements", "RAM Requirements", "Central Processing Unit (CPU) Requirements", "External Hardware Tokens", "Storage Requirements", "Application-to-OS Compatibility", "Distribution Methods", "Physical Media vs. Mountable ISO File", "Downloadable Package", "Image Deployment", "Impact Considerations for New Applications", "Device", "Network", "Operation", "Business"]
  },
  "1.11": {
    count: 11,
    hash: "C55B4B6F8A0F93B928D2B60A66C6A19B091C1B25FEE63ED63865D62B68484258",
    firstId: "A1202-1.11-R001",
    sections: ["what-you-are-learning", "maestro-focus", "cloud-productivity", "email-systems", "storage", "sync-folder-settings", "collaboration-tools", "collaboration-recognition-map", "identity-synchronization", "licensing-assignment", "setup-workflow", "scenario-troubleshooting", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Email Systems", "Storage", "Sync/Folder Settings", "Collaboration Tools", "Spreadsheets", "Videoconferencing", "Presentation Tools", "Word Processing Tools", "Instant Messaging", "Identity Synchronization", "Licensing Assignment"]
  },
  "2.1": {
    count: 44,
    hash: "605096D04E69F21C4190757F783D5D4199BA986AB1ED85A3233C40D45126A0B8",
    firstId: "A1202-2.1-R001",
    sections: ["what-you-are-learning", "maestro-focus", "physical-security", "physical-access-security", "biometrics", "lighting-and-magnetometers", "logical-security", "multifactor-authentication", "federation-and-single-sign-on", "privileged-access", "endpoint-data-and-identity-controls", "control-comparison-map", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Physical Security", "Bollards", "Access Control Vestibule", "Badge Reader", "Video Surveillance", "Alarm Systems", "Motion Sensors", "Door Locks", "Equipment Locks", "Security Guards", "Fences", "Physical Access Security", "Key Fobs", "Smart Cards", "Mobile Digital Key", "Keys", "Biometrics", "Retina Scanner", "Fingerprint Scanner", "Palm Print Scanner", "Facial Recognition Technology (FRT)", "Voice Recognition Technology", "Lighting", "Magnetometers", "Logical Security", "Principle of Least Privilege", "Zero Trust Model", "Access Control Lists (ACLs)", "Multifactor Authentication (MFA)", "Email", "Hardware Token", "Authenticator Application", "Short Message Service (SMS)", "Voice Call", "Time-Based One-Time Password (TOTP)", "One-Time Password/Passcode (OTP)", "Security Assertions Markup Language (SAML)", "Single Sign-On (SSO)", "Just-in-Time Access", "Privileged Access Management (PAM)", "Mobile Device Management (MDM)", "Data Loss Prevention (DLP)", "Identity Access Management (IAM)", "Directory Services"]
  },
  "2.2": {
    count: 36,
    hash: "2FD8ADAFC768B4188FDC02CBF4D349A6D90B299C80F60BE280580B7D9A43831B",
    firstId: "A1202-2.2-R001",
    sections: ["what-you-are-learning", "maestro-focus", "defender-antivirus", "windows-firewall", "users-and-groups", "login-os-options", "ntfs-and-share-permissions", "attributes-and-inheritance", "elevation-and-uac", "windows-encryption", "active-directory", "active-directory-comparisons", "security-configuration-workflow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Defender Antivirus", "Activate/Deactivate", "Update Definitions", "Firewall", "Port Security", "Application Security", "Users and Groups", "Local vs. Microsoft Account", "Standard Account", "Administrator", "Guest User", "Power User", "Log-In OS Options", "Username and Password", "Personal Identification Number (PIN)", "Fingerprint", "Facial Recognition", "Single Sign-On (SSO)", "Passwordless/Windows Hello", "NTFS vs. Share Permissions", "File and Folder Attributes", "Inheritance", "Run as Administrator vs. Standard User", "User Account Control (UAC)", "BitLocker", "BitLocker-To-Go", "Encrypting File System (EFS)", "Active Directory", "Joining a Domain", "Assigning Log-In Script", "Moving Objects Within Organizational Units", "Assigning Home Folders", "Applying Group Policy", "Selecting Security Groups", "Configuring Folder Redirection"]
  },
  "2.3": {
    count: 10,
    hash: "34F1D0D3D01E885F46974019677AA81FC8430A38DD3282C64839FD6A54B2240B",
    firstId: "A1202-2.3-R001",
    sections: ["what-you-are-learning", "maestro-focus", "protocols-and-encryption", "wpa2-vs-wpa3", "tkip-vs-aes", "authentication", "authentication-comparison", "security-decision-model", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Protocols and Encryption", "Wi-Fi Protected Access 2 (WPA2)", "WPA3", "Temporal Key Integrity Protocol (TKIP)", "Advanced Encryption Standard (AES)", "Authentication", "Remote Authentication Dial-In User Service (RADIUS)", "Terminal Access Controller Access-Control System Plus (TACACS+)", "Kerberos", "Multifactor Authentication"]
  },
  "2.4": {
    count: 25,
    hash: "0DA0711F61A113D6984EB6E193E0D70700182FABD675FC10C53C2B4995C8992C",
    firstId: "A1202-2.4-R001",
    sections: ["what-you-are-learning", "maestro-focus", "deception-and-stealth-malware", "infection-and-surveillance-malware", "disruption-and-resource-malware", "adware-and-pup", "malware-recognition-map", "recovery-console", "detection-and-response", "antivirus-and-antimalware", "preventive-controls", "os-reinstallation", "detection-removal-prevention", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Malware", "Trojan", "Rootkit", "Virus", "Spyware", "Ransomware", "Keylogger", "Boot Sector Virus", "Cryptominer", "Stalkerware", "Fileless Malware", "Adware", "Potentially Unwanted Program (PUP)", "Tools and Methods", "Recovery Console", "Endpoint Detection and Response (EDR)", "Managed Detection and Response (MDR)", "Extended Detection and Response (XDR)", "Antivirus", "Anti-Malware", "Email Security Gateway", "Software Firewalls", "User Education Regarding Common Threats", "Antiphishing Training", "OS Reinstallation"]
  },
  "2.5": {
    count: 31,
    hash: "EB8432998B193DDE836D870E9FE3054438AD36576FC72CF3C44386BD653EE689",
    firstId: "A1202-2.5-R001",
    sections: ["what-you-are-learning", "maestro-focus", "social-engineering", "targeted-phishing", "physical-social-engineering", "availability-and-wireless-threats", "identity-and-interception-threats", "credential-attacks", "insider-and-web-threats", "business-and-supply-chain-threats", "vulnerabilities", "vulnerability-comparison", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Social Engineering", "Phishing", "Vishing", "Smishing", "QR Code Phishing", "Spear Phishing", "Whaling", "Shoulder Surfing", "Tailgating", "Impersonation", "Dumpster Diving", "Threats", "Denial of Service (DoS)", "Distributed Denial of Service (DDoS)", "Evil Twin", "Zero-Day Attack", "Spoofing", "On-Path Attack", "Brute-Force Attack", "Dictionary Attack", "Insider Threat", "Structured Query Language (SQL) Injection", "Cross-Site Scripting (XSS)", "Business Email Compromise (BEC)", "Supply Chain/Pipeline Attack", "Vulnerabilities", "Non-Compliant Systems", "Unpatched Systems", "Unprotected Systems", "End-of-Life (EOL)", "Bring Your Own Device (BYOD)"]
  },
  "2.6": {
    count: 10,
    hash: "EE6B40DC19BEAFCB7C0602A190731A5291C4DF6862C2E15ADB7C4C9A97D7FE6A",
    firstId: "A1202-2.6-R001",
    sections: ["what-you-are-learning", "maestro-focus", "investigate-and-verify", "quarantine", "disable-system-restore", "remediate", "update-antimalware", "scan-and-removal-techniques", "reimage-or-reinstall", "schedule-scans-and-updates", "restore-protection", "educate-end-user", "malware-removal-sequence", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Investigate and Verify Malware Symptoms", "Quarantine the Infected System", "Disable System Restore in Windows Home", "Remediate Infected Systems", "Update Anti-Malware Software", "Scan and Removal Techniques", "Safe Mode", "Preinstallation Environment", "Reimage/Reinstall", "Schedule Scans and Run Updates", "Enable System Restore and Create a Restore Point in Windows Home", "Educate the End User"]
  },
  "2.7": {
    count: 24,
    hash: "C8FC2B4D19CDF34D6F5500F7F68A3097F6943791965BF09EA55A66974975E3F5",
    firstId: "A1202-2.7-R001",
    sections: ["what-you-are-learning", "maestro-focus", "data-at-rest-encryption", "password-considerations", "password-managers", "bios-uefi-passwords", "end-user-best-practices", "account-management", "account-control-comparisons", "default-administrator", "disable-autorun", "disable-unused-services", "hardening-workflow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Data-at-Rest Encryption", "Password Considerations", "Length", "Character Types", "Uniqueness", "Complexity", "Expiration", "BIOS/UEFI Passwords", "End-User Best Practices", "Screensaver Locks", "Log Off When Not in Use", "Secure/Protect Critical Hardware", "Personally Identifiable Information (PII)", "Passwords", "Password Managers", "Account Management", "Restrict User Permissions", "Restrict Log-In Times", "Disable Guest Account", "Failed Attempts Lockout", "Timeout/Screen Lock", "Account Expiration Dates", "Change Default Administrator's User Account/Password", "Disable AutoRun", "Disable Unused Services"]
  },
  "2.8": {
    count: 24,
    hash: "4FEC12485215719E4B4C69465FFC545775D0B2D0423E99AEB522946DE1FB443D",
    firstId: "A1202-2.8-R001",
    sections: ["what-you-are-learning", "maestro-focus", "hardening-techniques", "screen-locks", "screen-lock-comparison", "configuration-profiles-and-mdm", "patch-management", "endpoint-security-software", "locator-and-remote-wipe", "remote-backup", "failed-login-restrictions", "policies-and-procedures", "compliance", "mobile-security-workflow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Hardening Techniques", "Device Encryption", "Screen Locks", "Facial Recognition", "PIN Codes", "Fingerprint", "Pattern", "Swipe", "Configuration Profiles", "Patch Management", "OS Updates", "Application Updates", "Endpoint Security Software", "Antivirus", "Anti-Malware", "Content Filtering", "Locator Applications", "Remote Wipes", "Remote Backup Applications", "Failed Log-In Attempts Restrictions", "Policies and Procedures", "Mobile Device Management (MDM)", "BYOD vs. Corporate-Owned Devices", "Profile Security Requirements"]
  },
  "2.9": {
    count: 13,
    hash: "A4A96416CE5523C236D58018480840CE692D92EBBB353B9B949A9A6FA28E387D",
    firstId: "A1202-2.9-R001",
    sections: ["what-you-are-learning", "maestro-focus", "physical-destruction", "destruction-comparison", "recycling-and-repurposing", "format-vs-wipe", "physical-vs-logical-disposal", "outsourcing-concepts", "chain-of-responsibility", "regulatory-and-environmental", "disposal-decision-model", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Physical Destruction of Hard Drives", "Drilling", "Shredding", "Degaussing", "Incineration", "Recycling or Repurposing Best Practices", "Erasing/Wiping", "Low-Level Formatting", "Standard Formatting", "Outsourcing Concepts", "Third-Party Vendor", "Certification of Destruction/Recycling", "Regulatory and Environmental Requirements"]
  },
  "2.10": {
    count: 17,
    hash: "083DF2AF49DA9EDC32E3E245104A59A20BF580FA64227660083C072E61FF1442",
    firstId: "A1202-2.10-R001",
    sections: ["what-you-are-learning", "maestro-focus", "router-credentials-and-filtering", "firmware-and-physical-security", "upnp", "screened-subnet", "secure-management-access", "wireless-specific", "ssid-and-encryption-comparison", "firewall-settings", "network-control-comparisons", "soho-hardening-workflow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Router Settings", "Change Default Passwords", "IP Filtering", "Firmware Updates", "Content Filtering", "Physical Placement/Secure Locations", "Universal Plug and Play (UPnP)", "Screened Subnet", "Configure Secure Management Access", "Wireless-Specific Security", "Service Set Identifier (SSID)", "Disabling SSID Broadcast", "Encryption Settings", "Configuring Guest Access", "Firewall Settings", "Disabling Unused Ports", "Port Forwarding/Mapping"]
  },
  "2.11": {
    count: 24,
    hash: "7504F66E05504648D9112B47909BE2164508F7DEADA5B2FC8471C6387DA52D65",
    firstId: "A1202-2.11-R001",
    sections: ["what-you-are-learning", "maestro-focus", "browser-downloads", "browser-patching", "extensions-and-plugins", "password-managers", "secure-connections", "privacy-and-stored-data", "browser-data-synchronization", "ad-blockers", "proxy-and-secure-dns", "browser-feature-management", "browser-hardening-workflow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Browser Download/Installation", "Trusted Sources", "Hashing", "Untrusted Sources", "Browser Patching", "Extensions and Plug-Ins", "Password Managers", "Secure Connections/Sites", "Valid Certificates", "Pop-Up Blocker", "Clearing Browsing Data", "Clearing Cache", "Private-Browsing Mode", "Sign-In/Browser Data Synchronization", "Ad Blockers", "Proxy", "Secure DNS", "Browser Feature Management", "Enable or Disable", "Plug-Ins", "Extensions", "Features"]
  },
  "3.1": {
    count: 12,
    hash: "0041DEFAEE8D5223B9CC4C0CDBDFA0622519C0CE3539895FD4DDD97D3C0DFACD",
    firstId: "A1202-3.1-R001",
    sections: ["what-you-are-learning", "maestro-focus", "bsod", "degraded-performance", "boot-issues", "frequent-shutdowns", "services-not-starting", "applications-crashing", "memory-and-usb-resources", "system-instability", "no-os-found", "slow-profile-load", "time-drift", "symptom-comparison", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Blue Screen of Death (BSOD)", "Degraded Performance", "Boot Issues", "Frequent Shutdowns", "Services Not Starting", "Applications Crashing", "Low Memory Warnings", "USB Controller Resource Warnings", "System Instability", "No OS Found", "Slow Profile Load", "Time Drift"]
  },
  "3.2": {
    count: 13,
    hash: "4356051A4F084741EA3C2ED7411B1E945313219513726FF1D1F165051342D41A",
    firstId: "A1202-3.2-R001",
    sections: ["what-you-are-learning", "maestro-focus", "application-launch", "application-crashes", "application-update", "application-install", "slow-response", "os-update", "battery-life", "random-reboots", "connectivity-issues", "bluetooth", "wifi", "nfc", "autorotation", "troubleshooting-flow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Application Fails to Launch", "Application Fails to Close or Crashes", "Application Fails to Update", "Application Fails to Install", "Slow to Respond", "OS Fails to Update", "Battery Life Issues", "Random Reboots", "Connectivity Issues", "Bluetooth", "Wi-Fi", "Near-Field Communication (NFC)", "Screen Does Not Autorotate"]
  },
  "3.3": {
    count: 16,
    hash: "F34397FD6C97DD128DFCF41C9D0B67B2856A597770663574044519BD3B64F048",
    firstId: "A1202-3.3-R001",
    sections: ["what-you-are-learning", "maestro-focus", "security-concerns", "unofficial-stores", "developer-mode", "root-jailbreak", "malicious-applications", "application-spoofing", "common-symptoms", "traffic-and-response", "data-usage", "internet-connectivity", "ads-and-warnings", "unexpected-behavior", "leaked-data", "symptom-map", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Security Concerns", "Unofficial Application Stores", "Developer Mode", "Root Access", "Jailbreak", "Unauthorized and Malicious Applications", "Application Spoofing", "Common Symptoms", "High Network Traffic", "Degraded Response Time", "Data-Usage Limit Notification", "Limited Internet Connectivity", "No Internet Connectivity", "High Number of Ads", "Fake Security Warnings", "Unexpected Application Behavior", "Leaked Personal Files and Data"]
  },
  "3.4": {
    count: 14,
    hash: "0DAFE43C1F60DC787B9EE665B8AAC6FA9D4D0E1D6D5988A00606B6F7B8A81B33",
    firstId: "A1202-3.4-R001",
    sections: ["what-you-are-learning", "maestro-focus", "common-symptoms", "network-access", "desktop-alerts", "false-antivirus", "altered-files", "missing-inaccessible-files", "unwanted-notifications", "os-update-failures", "browser-symptoms", "popups", "certificate-warnings", "redirection", "browser-performance", "symptom-clustering", "troubleshooting-flow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Common Symptoms", "Unable to Access the Network", "Desktop Alerts", "False Alerts Regarding Antivirus Protection", "Altered System or Personal Files", "Missing or Renamed Files", "Inability to Access Files", "Unwanted Notifications Within the OS", "OS Updates Failures", "Browser-Related Symptoms", "Random and Frequent Pop-Ups", "Certificate Warnings", "Redirection", "Degraded Browser Performance"]
  },
  "4.1": {
    count: 28,
    hash: "8C60D1F64E8C9BD9A78208FE99CA104D2DCDFAA527F961453366A59C49A3C82A",
    firstId: "A1202-4.1-R001",
    sections: ["what-you-are-learning", "maestro-focus", "ticketing-systems", "ticket-details", "severity-escalation", "written-communication", "asset-management", "inventory-cmdb", "asset-tags", "procurement-life-cycle", "warranty-licensing", "assigned-users", "types-of-documents", "incident-reports", "sops", "onboarding-offboarding", "slas", "knowledge-base", "documentation-flow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Ticketing Systems", "User Information", "Device Information", "Description of Issues", "Categories", "Severity", "Escalation Levels", "Clear, Concise Written Communication", "Issue Description", "Progress Notes", "Issue Resolution", "Asset Management", "Inventory Lists", "Configuration Management Database (CMDB)", "Asset Tags and IDs", "Procurement Life Cycle", "Warranty and Licensing", "Assigned Users", "Types of Documents", "Incident Reports", "Standard Operating Procedures (SOPs)", "Software Package Custom Installation Procedure", "New User/Onboarding Setup Checklist", "User Off-Boarding Checklist", "Service-Level Agreements (SLAs)", "Internal", "External/Third-Party", "Knowledge Base and Articles"]
  },
  "4.2": {
    count: 23,
    hash: "436E5DD43ABE30FD0149F63AE59AFE9605BC054C586EAC7B51396A0400A4F904",
    firstId: "A1202-4.2-R001",
    sections: ["what-you-are-learning", "maestro-focus", "documented-processes", "rollback-backup", "sandbox-testing", "responsible-staff", "change-management", "request-forms", "purpose-scope", "change-types", "scheduling", "impact-risk", "change-board", "implementation", "peer-user-validation", "change-flow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Documented Business Processes", "Rollback Plan", "Backup Plan", "Sandbox Testing", "Responsible Staff Members", "Change Management", "Request Forms", "Purpose of the Change", "Scope of the Change", "Change Type", "Standard Change", "Normal Change", "Emergency Change", "Date and Time of Change", "Change Freeze", "Maintenance Windows", "Affected Systems/Impact", "Risk Analysis", "Risk Level", "Change Board Approvals", "Implementation", "Peer Review", "End-User Acceptance"]
  },
  "4.3": {
    count: 14,
    hash: "3442B6EB6F885EE0C9BAB44C4E2EBC4388C03CA76B0E9CE8D350C2D6BDF37B21",
    firstId: "A1202-4.3-R001",
    sections: ["what-you-are-learning", "maestro-focus", "backup-purpose", "full-backup", "incremental", "differential", "backup-comparison", "synthetic-full", "recovery", "recovery-locations", "backup-testing", "frequency", "rotation-schemes", "onsite-offsite", "gfs", "three-two-one", "gfs-vs-three-two-one", "strategy-example", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Backup", "Full Backup", "Incremental Backup", "Differential Backup", "Synthetic Full Backup", "Recovery", "In-Place/Overwrite", "Alternative Location", "Backup Testing", "Frequency", "Backup Rotation Schemes", "Onsite vs. Offsite", "Grandfather-Father-Son (GFS)", "3-2-1 Backup Rule"]
  },
  "4.4": {
    count: 14,
    hash: "522395087864B64AF5755BC760898D82A0E516C93E197E789B74AD671F6F52CD",
    firstId: "A1202-4.4-R001",
    sections: ["what-you-are-learning", "maestro-focus", "esd", "esd-straps-mats", "electrical-safety", "grounding-vs-esd", "component-handling", "cable-management", "antistatic-bags", "government-regulations", "personal-safety", "disconnect-power", "lifting", "fire-safety", "goggles-masks", "safety-sequence", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Electrostatic Discharge (ESD) Straps", "ESD Mats", "Electrical Safety", "Equipment Grounding", "Proper Component Handling and Storage", "Cable Management", "Antistatic Bags", "Compliance with Government Regulations", "Personal Safety", "Disconnect Power Before Repairing a PC", "Lifting Techniques", "Fire Safety", "Safety Goggles", "Air Filter Mask"]
  },
  "4.5": {
    count: 11, hash: "D78324C7BA5A61A46191DFBA630734571A738E69BBABB895E3FFD610FC4E4C24", firstId: "A1202-4.5-R001",
    sections: ["what-you-are-learning", "maestro-focus", "msds", "battery-toner-disposal", "device-disposal", "temperature-humidity", "ventilation-placement", "dust-cleanup", "air-vacuums", "power-problems", "ups", "surge-suppressor", "environment-workflow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Material Safety Data Sheet (MSDS)", "Proper Battery Disposal", "Proper Toner Disposal", "Proper Disposal of Other Devices and Assets", "Temperature and Humidity-Level Awareness", "Proper Ventilation", "Location/Equipment Placement", "Dust Cleanup", "Compressed Air", "Vacuums", "Power Surges", "Brownouts", "Blackouts", "Uninterruptible Power Supply (UPS)", "Surge Suppressor"]
  },
  "4.6": {
    world: "5", count: 21, hash: "C3F1669A0A3CC3DA8927BE2338E91F33C10CF04FBC5E2725D9B0D29792CAAC41", firstId: "A1202-4.6-R001",
    sections: ["what-you-are-learning", "maestro-focus", "incident-response", "custody-escalation", "drive-preservation", "incident-documentation", "volatility", "licensing", "license-types", "nda-mnda", "regulated-data", "retention", "aup-prohibited", "compliance-splash", "response-flow", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Incident Response", "Chain of Custody", "Informing Management/Law Enforcement as Necessary", "Copy of Drive", "Data Integrity and Preservation", "Incident Documentation", "Order of Volatility", "Digital Rights Management (DRM)", "End-User License Agreement (EULA)", "Valid Licenses", "Perpetual License Agreement", "Personal-Use", "Corporate-Use", "Open-Source Licenses", "Non-Disclosure Agreement (NDA)", "Mutual NDA (MNDA)", "Regulated Data", "Credit Card Payment Information", "Personal Government-Issued Information", "PII", "Healthcare Data", "Data Retention Requirements", "Acceptable Use Policy (AUP)", "Regulatory and Business Compliance Requirements", "Splash Screens"]
  },
  "4.7": {
    world: "5", count: 26, hash: "2EA4B0306F3FC6FB8B4EDD7E678C23B7EFB30DCB062AB4BD2201F86D4A585B22", firstId: "A1202-4.7-R001",
    sections: ["what-you-are-learning", "maestro-focus", "appearance-attire", "proper-language", "attitude-confidence", "active-listening", "cultural-sensitivity", "timeliness-distractions", "difficult-customers", "clarification", "discretion", "expectations-status", "options-documentation", "follow-up", "confidential-materials", "support-conversation", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Professional Appearance", "Appropriate Attire", "Formal", "Business-Casual", "Proper Language", "Jargon", "Acronyms", "Slang", "Positive Attitude", "Confidence", "Active Listening", "Avoid Interrupting", "Cultural Sensitivity", "Professional Titles", "Be on Time", "Avoid Distractions", "Personal Calls", "Texting", "Social Media", "Personal Interruptions", "Difficult Customers", "Do Not Argue", "Avoid Dismissing", "Avoid Being Judgmental", "Open-Ended Questions", "Restate", "Discretion", "Set and Meet Expectations", "Communicate Status", "Repair/Replacement Options", "Documentation", "Follow Up", "Confidential and Private Materials"]
  },
  "4.8": {
    world: "5", count: 19, hash: "F8320EBEDE50A48C333FA3DE385D2DAE980327D81AD38989D1C7BBAE819FC21D", firstId: "A1202-4.8-R001",
    sections: ["what-you-are-learning", "maestro-focus", "file-types", "windows-scripts", "portable-scripts", "use-cases", "basic-automation", "restart-remap", "install-backup", "gather-update", "risks", "malware-risk", "settings-risk", "resource-risk", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Script File Types", ".bat", ".ps1", ".vbs", ".sh", ".js", ".py", "Use Cases for Scripting", "Basic Automation", "Restarting Machines", "Remapping Network Drives", "Application Installation", "Automated Backups", "Gathering Information/Data", "Initiating Updates", "Other Considerations When Using Scripts", "Unintentionally Introducing Malware", "Inadvertently Changing System Settings", "Browser or System Crashes"]
  },
  "4.9": {
    world: "5", count: 14, hash: "9B197E80A8EFA3EBED34B7B87DF49A4E0314BC1AFBD0DEA35AF32CCB1FECB4E7", firstId: "A1202-4.9-R001",
    sections: ["what-you-are-learning", "maestro-focus", "rdp-vpn", "vnc", "ssh", "rmm", "spice", "winrm", "third-party-tools", "sharing-conference", "transfer-management", "security", "decision-map", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["RDP", "VPN", "Virtual Network Computer (VNC)", "Secure Shell (SSH)", "Remote Monitoring and Management (RMM)", "Simple Protocol for Independent Computing Environments (SPICE)", "Windows Remote Management (WinRM)", "Third-Party Tools", "Screen-Sharing", "Videoconferencing", "File Transfer", "Desktop Management", "Security Considerations"]
  },
  "4.10": {
    world: "5", count: 12, hash: "0CC8E164B41223E56ECA01EB226E565565B701AA9126FF593165390F231B7644", firstId: "A1202-4.10-R001",
    sections: ["what-you-are-learning", "maestro-focus", "application-integration", "policy", "appropriate-use", "plagiarism", "limitations", "bias", "hallucinations", "accuracy", "private-public", "data-security", "data-source", "data-privacy", "verification-flow", "it-scenario", "recognition-cues", "exam-trap", "maestro-recognition-sheet"],
    topics: ["Application Integration", "Policy", "Appropriate Use", "Plagiarism", "Limitations", "Bias", "Hallucinations", "Accuracy", "Private vs. Public AI", "Data Security", "Data Source", "Data Privacy"]
  }
};

for (const [objective, expected] of Object.entries(objectives)) {
  const world = expected.world || objective.split(".")[0];
  const lesson = json(`json/aplus-core2/field-manual/${objective}.json`);
  const bankPath = path.join(root, `json/aplus-core2/world${world}/${objective}-hatchling.json`);
  const bankBytes = fs.readFileSync(bankPath);
  const bank = JSON.parse(bankBytes.toString("utf8"));
  const hash = crypto.createHash("sha256").update(bankBytes).digest("hex").toUpperCase();
  const sectionIds = (lesson.sections || []).map(section => section.id);
  const lessonText = JSON.stringify(lesson);

  requireValue(lesson.schemaVersion === 1, `${objective} schemaVersion must be 1.`);
  requireValue(lesson.certification === "aplus-core2" && lesson.examCode === "220-1202", `${objective} metadata must match A+ Core 2 220-1202.`);
  requireValue(lesson.world === world && lesson.objective === objective, `${objective} route metadata must match World ${world}.`);
  requireValue(lesson.miniCheckSource === "objective-sweep-bank", `${objective} must use the GSA-owned Mini Check source.`);
  requireValue(!Object.prototype.hasOwnProperty.call(lesson, "miniCheck"), `${objective} lesson data must not author a Mini Check question.`);
  requireValue(sectionIds.length === new Set(sectionIds).size, `${objective} section IDs must be unique.`);
  expected.sections.forEach(id => requireValue(sectionIds.includes(id), `${objective} is missing section: ${id}`));
  expected.topics.forEach(topic => requireValue(lessonText.toLowerCase().includes(topic.toLowerCase()), `${objective} is missing required topic: ${topic}`));
  requireValue(Array.isArray(bank) && bank.length === expected.count, `${objective} protected Sweep bank must contain exactly ${expected.count} questions.`);
  requireValue(bank[0]?.id === expected.firstId, `${objective} Mini Check source must remain the first protected bank question.`);
  requireValue(hash === expected.hash, `${objective} protected Sweep bank bytes changed.`);
}

const hubs = {
  "1": read("aplus-core2-world1-objectives.html"),
  "2": read("aplus-core2-world2-objectives.html"),
  "3": read("aplus-core2-world3-objectives.html"),
  "4": read("aplus-core2-world4-objectives.html"),
  "5": read("aplus-core2-world5-objectives.html")
};
const campaign = read("aplus-core2-campaign.html");
const manualPage = read("aplus-core2-field-manual.html");
const manualScript = read("aplus-core2-field-manual.js");
const hubScript = read("aplus-core2-objective-hub.js");
const quizScript = read("aplus-core2-quiz.js");

requireValue(campaign.includes('href="aplus-core2-world1-objectives.html" class="world world1 unlocked"'), "Campaign World 1 must route to its Objective Hub.");
requireValue(campaign.includes('href="aplus-core2-world2-objectives.html"'), "Campaign World 2 must route to its Objective Hub.");
requireValue(campaign.includes('href="aplus-core2-world3-objectives.html"'), "Campaign World 3 must route to its Objective Hub.");
requireValue(campaign.includes('href="aplus-core2-world4-objectives.html"'), "Campaign World 4 must route to its Objective Hub.");
requireValue(campaign.includes('href="aplus-core2-world5-objectives.html"'), "Campaign World 5 must route to its Objective Hub.");
for (const objective of Object.keys(objectives)) {
  const world = objectives[objective].world || objective.split(".")[0];
  const hub = hubs[world];
  requireValue(hub.includes(`aplus-core2-field-manual.html?world=${world}&amp;objective=${objective}`), `World ${world} Hub is missing the ${objective} Field Manual action.`);
  requireValue(hub.includes(`aplus-core2-quiz.html?world=${world}&amp;objective=${objective}`), `${objective} Sweep route changed unexpectedly.`);
}
for (const [world, hub] of Object.entries(hubs)) {
  requireValue(hub.includes('href="security-plus-field-manual.css"') && hub.includes('src="aplus-core2-objective-hub.js"'), `World ${world} Hub must use the established Field Manual card presentation and status engine.`);
  requireValue(hub.includes('href="aplus-core2-campaign.html" class="back-link">← Return to Campaign Map</a>'), `World ${world} Hub must return to the A+ Core 2 Campaign Map.`);
}
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
