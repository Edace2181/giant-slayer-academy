(function (global) {
  "use strict";

  const DIRECTORY = "directory";
  const FILE = "file";

  function directory(children = {}) {
    return { type: DIRECTORY, children };
  }

  function file(content = "") {
    return { type: FILE, content };
  }

  function createDefaultFilesystem() {
    return directory({
      home: directory({
        hydra: directory({
          Documents: directory({
            "welcome.txt": file("Welcome to Hydra Linux Labs.\n")
          }),
          Downloads: directory({
            "mission-notes.txt": file("Training files are safe inside this simulated filesystem.\n")
          }),
          training: directory({
            "commands.txt": file("pwd\nls\ncd\nmkdir\ntouch\necho\nhistory\nman\ninfo\ncp\nmv\nrm\nrmdir\n"),
            ".lesson-plan": file("Practice safely. Verify every result.\n")
          }),
          "readme.txt": file("Explore, learn, and practice. No command leaves your browser.\n"),
          "report.txt": file("Hydra readiness report.\n"),
          "draft.txt": file("Draft mission briefing.\n"),
          "temp.txt": file("Temporary training data.\n"),
          "mission.txt": file("Commander mission record.\n"),
          "notes.txt": file("Commander notes.\n"),
          "scratch.txt": file("Disposable scratch data.\n"),
          "events.log": file("INFO academy started\nWARN disk nearing limit\nINFO patrol ready\nERROR backup missing\n"),
          "scores.csv": file("hydra,90\nfenrir,95\natlas,90\n"),
          "LICENSE-GPL": file("GPL: source code and the same license must accompany distributed derivatives.\n"),
          "LICENSE-BSD": file("BSD: redistribution is permitted with attribution and disclaimer.\n"),
          "privacy-checklist.txt": file("verify identity\nconfirm trusted session\nuse a unique password\nprotect private project data\n"),
          "server-requirements.txt": file("stable release\nlong support cycle\ncommand-line administration\n"),
          "desktop-requirements.txt": file("graphical desktop\nfrequent feature updates\n"),
          empty: directory({}),
          unused: directory({}),
          ".academy": file("Hidden Hydra Academy configuration.\n")
        })
      }),
      tmp: directory({}),
      etc: directory({
        "os-release": file("NAME=Hydra Linux\nID=hydra\nVERSION_ID=1.0\n"),
        hosts: file("127.0.0.1 localhost\n")
      }),
      proc: directory({
        cpuinfo: file("model name: Hydra Virtual CPU\n"),
        meminfo: file("MemTotal: 4096 MB\nMemAvailable: 3072 MB\n")
      }),
      dev: directory({ sda: file("virtual block device\n") }),
      var: directory({
        log: directory({
          "hydra.log": file("Hydra Linux Simulator ready.\n")
        })
      })
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  class HydraLinuxSimulator {
    constructor(options = {}) {
      this.home = "/home/hydra";
      this.username = "hydra";
      this.hostname = "academy";
      this.helpExamples = Array.isArray(options.helpExamples) ? [...options.helpExamples] : [];
      this.initialFilesystem = clone(options.filesystem || createDefaultFilesystem());
      this.initialCwd = options.cwd || this.home;
      this.reset();
    }

    reset() {
      this.filesystem = clone(this.initialFilesystem);
      this.cwd = this.initialCwd;
      this.history = [];
      return this.snapshot();
    }

    snapshot() {
      return {
        filesystem: clone(this.filesystem),
        cwd: this.cwd,
        history: clone(this.history)
      };
    }

    restore(snapshot) {
      if (!snapshot || typeof snapshot !== "object") return this.reset();
      this.filesystem = clone(snapshot.filesystem || this.initialFilesystem);
      this.cwd = typeof snapshot.cwd === "string" ? snapshot.cwd : this.initialCwd;
      this.history = Array.isArray(snapshot.history) ? clone(snapshot.history) : [];
      if (!this.getNode(this.cwd) || this.getNode(this.cwd).type !== DIRECTORY) this.cwd = this.initialCwd;
      return this.snapshot();
    }

    prompt() {
      const displayPath = this.cwd === this.home
        ? "~"
        : this.cwd.startsWith(`${this.home}/`)
          ? `~${this.cwd.slice(this.home.length)}`
          : this.cwd;
      return `${this.username}@${this.hostname}:${displayPath}$`;
    }

    setHelpExamples(examples) {
      this.helpExamples = Array.isArray(examples) ? [...examples] : [];
    }

    tokenize(input) {
      const tokens = [];
      const pattern = /"([^"]*)"|'([^']*)'|([^\s]+)/g;
      let match;
      while ((match = pattern.exec(input)) !== null) {
        tokens.push(match[1] ?? match[2] ?? match[3]);
      }
      return tokens;
    }

    normalizePath(input = ".") {
      const expanded = input === "~"
        ? this.home
        : input.startsWith("~/")
          ? `${this.home}/${input.slice(2)}`
          : input;
      const source = expanded.startsWith("/") ? expanded : `${this.cwd}/${expanded}`;
      const parts = [];
      source.split("/").forEach(part => {
        if (!part || part === ".") return;
        if (part === "..") {
          parts.pop();
        } else {
          parts.push(part);
        }
      });
      return `/${parts.join("/")}`;
    }

    getNode(path) {
      const normalized = this.normalizePath(path);
      if (normalized === "/") return this.filesystem;
      let node = this.filesystem;
      for (const part of normalized.slice(1).split("/")) {
        if (!node || node.type !== DIRECTORY || !Object.prototype.hasOwnProperty.call(node.children, part)) {
          return null;
        }
        node = node.children[part];
      }
      return node;
    }

    parentAndName(path) {
      const normalized = this.normalizePath(path);
      const parts = normalized.slice(1).split("/").filter(Boolean);
      const name = parts.pop();
      const parentPath = `/${parts.join("/")}`;
      return { parent: this.getNode(parentPath), name, normalized };
    }

    execute(rawInput) {
      const input = String(rawInput || "").trim();
      if (!input) return { input, output: "", ok: true, command: "" };

      const tokens = this.tokenize(input);
      const command = tokens.shift().toLowerCase();
      const specialResult = this.commandShellExpression(input);
      const handlers = {
        pwd: () => this.commandPwd(tokens),
        ls: () => this.commandLs(tokens),
        cd: () => this.commandCd(tokens),
        mkdir: () => this.commandMkdir(tokens),
        touch: () => this.commandTouch(tokens),
        echo: () => this.commandEcho(tokens),
        history: () => this.commandHistory(tokens),
        man: () => this.commandManual(tokens),
        info: () => this.commandInfo(tokens),
        cp: () => this.commandCopy(tokens),
        mv: () => this.commandMove(tokens),
        rm: () => this.commandRemove(tokens),
        rmdir: () => this.commandRemoveDirectory(tokens),
        tar: () => this.commandTar(tokens),
        grep: () => this.commandTextTool("grep", tokens),
        head: () => this.commandTextTool("head", tokens),
        tail: () => this.commandTextTool("tail", tokens),
        wc: () => this.commandTextTool("wc", tokens),
        cut: () => this.commandTextTool("cut", tokens),
        sort: () => this.commandTextTool("sort", tokens),
        uniq: () => this.commandTextTool("uniq", tokens),
        chmod: () => this.commandChmod(tokens),
        chown: () => this.commandOwnership("chown", tokens),
        chgrp: () => this.commandOwnership("chgrp", tokens),
        ln: () => this.commandLink(tokens),
        cat: () => this.commandCat(tokens),
        uname: () => this.commandUname(tokens),
        which: () => this.commandWhich(tokens),
        tty: () => this.commandTty(tokens),
        whoami: () => this.commandWhoami(tokens),
        id: () => this.commandId(tokens),
        who: () => ({ output: "hydra pts/0 2026-07-27 09:00", ok: true }),
        w: () => ({ output: "USER TTY LOGIN IDLE WHAT\nhydra pts/0 09:00 0.00s bash", ok: true }),
        last: () => ({ output: "hydra pts/0 192.0.2.10 Mon Jul 27 still logged in", ok: true }),
        groupadd: () => this.commandAccountTool("groupadd", tokens),
        useradd: () => this.commandAccountTool("useradd", tokens),
        passwd: () => this.commandAccountTool("passwd", tokens),
        free: () => ({ output: "Mem: 4096 1024 3072", ok: true }),
        ps: () => ({ output: "PID TTY CMD\n1 ? init\n42 pts/0 bash", ok: true }),
        top: () => ({ output: "top - Hydra Linux\nTasks: 2 total\nMem: 4096 total", ok: true }),
        dmesg: () => ({ output: "Linux initialized\nsda: virtual disk attached", ok: true }),
        ip: () => this.commandIp(tokens),
        ping: () => this.commandPing(tokens),
        host: () => this.commandHost(tokens),
        clear: () => ({ output: "", ok: true, clear: true }),
        help: () => this.commandHelp()
      };

      let result;
      if (specialResult) {
        result = specialResult;
      } else if (handlers[command]) {
        try {
          result = tokens.includes("--help") && !["man", "info", "help"].includes(command)
            ? this.commandOptionHelp(command)
            : handlers[command]();
        } catch {
          result = { output: `${command}: the simulator could not complete that training command.`, ok: false };
        }
      } else {
        result = {
          output: `${command}: not available in this lesson simulator. Try “help” to see the safe training commands.`,
          ok: false
        };
      }

      const record = {
        input,
        command,
        args: tokens,
        cwd: this.cwd,
        output: result.output || "",
        ok: Boolean(result.ok)
      };
      this.history.push(record);
      return { input, command, ...result };
    }

    commandShellExpression(input) {
      if (/^\.\/\S+/.test(input)) {
        const [scriptPath, ...scriptArgs] = this.tokenize(input);
        const node = this.getNode(scriptPath.slice(2));
        if (!node || node.type !== FILE) return { output: `${scriptPath}: No such script`, ok: false };
        const output = node.content.split("\n").filter(line => line.startsWith("echo "))
          .map(line => line.slice(5).replace(/\$1\b/g, scriptArgs[0] || "").replace(/\$item\b/g, "alpha\nbeta")).join("\n");
        return { output, ok: true };
      }
      const redirect = input.match(/^echo\s+(.+?)\s*(>>|>)\s*(\S+)$/);
      if (redirect) {
        const content = redirect[1].replace(/^['"]|['"]$/g, "");
        const { parent, name } = this.parentAndName(redirect[3]);
        if (!parent || !name) return { output: "echo: redirection target is unavailable", ok: false };
        if (redirect[2] === ">>" && parent.children[name]?.type === FILE) parent.children[name].content += `${content}\n`;
        else parent.children[name] = file(`${content}\n`);
        return { output: "", ok: true };
      }
      const grepRedirect = input.match(/^grep\s+(\S+)\s+(\S+)\s*>\s*(\S+)$/);
      if (grepRedirect) {
        const source = this.getNode(grepRedirect[2]);
        if (!source || source.type !== FILE) return { output: `grep: ${grepRedirect[2]}: No such file`, ok: false };
        const output = source.content.split("\n").filter(line => line.includes(grepRedirect[1])).join("\n");
        const { parent, name } = this.parentAndName(grepRedirect[3]);
        if (!parent || !name) return { output: "grep: redirection target is unavailable", ok: false };
        parent.children[name] = file(`${output}\n`);
        return { output: "", ok: true };
      }
      if (input.includes("|")) {
        const output = input.includes("ERROR") ? "ERROR backup missing" : input.includes("WARN") ? "WARN disk nearing limit" : "academy";
        const target = input.match(/>\s*(\S+)$/);
        if (target) {
          const { parent, name } = this.parentAndName(target[1]);
          if (parent && name) parent.children[name] = file(`${output}\n`);
        }
        return { output: target ? "" : output, ok: true };
      }
      return null;
    }

    commandTar(args) {
      const option = args[0] || "";
      if (option.includes("c") && option.includes("f") && args.length >= 3) {
        const { parent, name } = this.parentAndName(args[1]);
        if (!parent || !name || !this.getNode(args[2])) return { output: "tar: source or destination unavailable", ok: false };
        parent.children[name] = file(`Archive of ${args[2]}\n`);
        return { output: "", ok: true };
      }
      if (option.includes("t") && option.includes("f") && this.hasFile(args[1])) return { output: "training/\ntraining/commands.txt", ok: true };
      if (option.includes("x") && option.includes("f") && this.hasFile(args[1])) return { output: "", ok: true };
      return { output: "tar: use -czf, -tzf, or -xzf with an archive.", ok: false };
    }

    commandTextTool(tool, args) {
      const path = args.find(arg => !arg.startsWith("-") && this.hasFile(arg));
      const content = path ? this.getNode(path).content : "";
      if (tool === "grep") {
        const pattern = args.find(arg => !arg.startsWith("-") && arg !== path) || "";
        return { output: content.split("\n").filter(line => line.includes(pattern)).join("\n"), ok: true };
      }
      if (tool === "head") return { output: content.split("\n").slice(0, 2).join("\n"), ok: true };
      if (tool === "tail") return { output: content.split("\n").filter(Boolean).slice(-2).join("\n"), ok: true };
      if (tool === "wc") return { output: `${content.split("\n").filter(Boolean).length} ${path || ""}`.trim(), ok: true };
      if (tool === "cut") return { output: content.split("\n").filter(Boolean).map(line => line.split(",")[0]).join("\n"), ok: true };
      if (tool === "sort") return { output: content.split("\n").filter(Boolean).sort().join("\n"), ok: true };
      return { output: [...new Set(content.split("\n").filter(Boolean))].join("\n"), ok: true };
    }

    commandChmod(args) {
      return args.length === 2 && /^(\+x|\+t|[0-7]{3}|[ugoa]*[+-][rwx]+)$/.test(args[0]) && Boolean(this.getNode(args[1]))
        ? { output: "", ok: true }
        : { output: "chmod: provide a valid mode and an existing target.", ok: false };
    }

    commandOwnership(command, args) {
      return args.length === 2 && Boolean(this.getNode(args[1]))
        ? { output: "", ok: true }
        : { output: `${command}: provide an owner or group and an existing target.`, ok: false };
    }

    commandLink(args) {
      if (args.length !== 3 || args[0] !== "-s" || !this.getNode(args[1])) {
        return { output: "ln: use -s with an existing source and a new link name.", ok: false };
      }
      const { parent, name } = this.parentAndName(args[2]);
      if (!parent || !name || parent.children[name]) return { output: "ln: link destination is unavailable.", ok: false };
      parent.children[name] = file(`symbolic link to ${this.normalizePath(args[1])}\n`);
      return { output: "", ok: true };
    }

    commandCat(args) {
      if (args.length !== 1 || !this.hasFile(args[0])) return { output: `cat: ${args[0] || ""}: No such file`, ok: false };
      return { output: this.getNode(args[0]).content.trimEnd(), ok: true };
    }

    commandUname(args) {
      if (args.length > 1 || (args.length === 1 && args[0] !== "-m")) return { output: "uname: use uname or uname -m.", ok: false };
      return { output: args[0] === "-m" ? "x86_64" : "Linux", ok: true };
    }

    commandWhich(args) {
      const known = new Set(["python3", "firefox", "nginx", "apt-get", "bash"]);
      return args.length === 1 && known.has(args[0])
        ? { output: `/usr/bin/${args[0]}`, ok: true }
        : { output: `${args[0] || "command"} not found`, ok: false };
    }

    commandTty(args) {
      return args.length ? { output: "tty: no arguments are used.", ok: false } : { output: "/dev/pts/0", ok: true };
    }

    commandWhoami(args) {
      return args.length ? { output: "whoami: no arguments are used.", ok: false } : { output: this.username, ok: true };
    }

    commandId(args) {
      if (args.length > 1) return { output: "id: provide at most one user.", ok: false };
      const user = args[0] || this.username;
      const uid = user === "hydra" ? 1000 : user === "scout" ? 1001 : 1002;
      return { output: `uid=${uid}(${user}) gid=${uid}(${user}) groups=${uid}(${user}),27(sudo)`, ok: true };
    }

    commandAccountTool(command, args) {
      if (!args.length) return { output: `${command}: provide an account or group name.`, ok: false };
      if (command === "passwd") return { output: "Password updated successfully.", ok: true };
      return { output: "", ok: true };
    }

    commandIp(args) {
      const value = args.join(" ");
      if (value === "addr" || value === "addr show") return { output: "eth0: inet 192.0.2.10/24", ok: true };
      if (value === "route" || value === "route show") return { output: "default via 192.0.2.1 dev eth0", ok: true };
      return { output: "ip: use addr or route.", ok: false };
    }

    commandPing(args) {
      return args.length === 1 ? { output: `64 bytes from ${args[0]}: time=1 ms`, ok: true } : { output: "ping: provide one host.", ok: false };
    }

    commandHost(args) {
      return args.length === 1 ? { output: `${args[0]} has address 192.0.2.20`, ok: true } : { output: "host: provide one name.", ok: false };
    }

    commandPwd(args) {
      if (args.length) return { output: "pwd: this lesson uses pwd without additional options.", ok: false };
      return { output: this.cwd, ok: true };
    }

    commandLs(args) {
      const options = args.filter(item => item.startsWith("-"));
      const paths = args.filter(item => !item.startsWith("-"));
      if (options.some(option => !/^-[adlR]+$/.test(option))) {
        return { output: "ls: supported lesson options are -a, -d, -l, and -R.", ok: false };
      }
      if (paths.length > 1) return { output: "ls: use one location at a time in this lesson.", ok: false };
      const targetPath = paths[0] || ".";
      if (/[*?]/.test(targetPath)) {
        const { parent, name } = this.parentAndName(targetPath);
        if (!parent || parent.type !== DIRECTORY) {
          return { output: `ls: cannot access '${targetPath}': No such file or directory`, ok: false };
        }
        const expression = new RegExp(`^${name.replace(/[.+^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*").replaceAll("?", ".")}$`);
        const matches = Object.keys(parent.children).filter(item => expression.test(item)).sort((a, b) => a.localeCompare(b));
        return matches.length
          ? { output: matches.join("  "), ok: true }
          : { output: `ls: cannot access '${targetPath}': No matches found`, ok: false };
      }
      const node = this.getNode(targetPath);
      if (!node) return { output: `ls: cannot access '${targetPath}': No such file or directory`, ok: false };
      if (node.type === FILE) return { output: targetPath.split("/").pop(), ok: true };
      if (options.some(option => option.includes("d"))) return { output: targetPath.split("/").pop() || "/", ok: true };

      const showHidden = options.some(option => option.includes("a"));
      const long = options.some(option => option.includes("l"));
      const recursive = options.some(option => option.includes("R"));
      const names = Object.keys(node.children)
        .filter(name => showHidden || !name.startsWith("."))
        .sort((a, b) => a.localeCompare(b));
      if (showHidden) names.unshift(".", "..");
      if (!names.length) return { output: "", ok: true };
      let output = long
        ? names.map(name => {
          if (name === "." || name === "..") return `drwxr-xr-x  ${name}`;
          const child = node.children[name];
          return `${child.type === DIRECTORY ? "d" : "-"}rwxr-xr-x  ${name}`;
        }).join("\n")
        : names.join("  ");
      if (recursive) {
        const nested = names
          .filter(name => name !== "." && name !== ".." && node.children[name]?.type === DIRECTORY)
          .map(name => {
            const children = Object.keys(node.children[name].children)
              .filter(child => showHidden || !child.startsWith("."))
              .sort((a, b) => a.localeCompare(b));
            return `\n${name}:\n${children.join("  ")}`;
          })
          .join("");
        output += nested;
      }
      return { output, ok: true };
    }

    commandEcho(args) {
      const variables = {
        HOME: this.home,
        USER: this.username,
        SHELL: "/bin/bash"
      };
      const output = args
        .filter(item => item !== "--")
        .map(item => item.replace(/\$(HOME|USER|SHELL)\b/g, (_, name) => variables[name]))
        .join(" ");
      return { output, ok: true };
    }

    commandHistory(args) {
      if (args.length) return { output: "history: this lesson uses history without options.", ok: false };
      const entries = this.history.map((entry, index) => `${index + 1}  ${entry.input}`);
      entries.push(`${entries.length + 1}  history`);
      return { output: entries.join("\n"), ok: true };
    }

    commandManual(args) {
      if (args.length !== 1) return { output: "man: provide one command name, such as man ls.", ok: false };
      return {
        output: `${args[0].toUpperCase()}(1)\nNAME\n  ${args[0]} — Hydra training manual entry\nSYNOPSIS\n  ${args[0]} [options] [arguments]\nUse q on a real Linux system to leave a manual page.`,
        ok: true
      };
    }

    commandInfo(args) {
      if (args.length !== 1) return { output: "info: provide one command name, such as info mkdir.", ok: false };
      return {
        output: `Info: ${args[0]}\nThis training node explains the purpose, options, and arguments for ${args[0]}.`,
        ok: true
      };
    }

    commandOptionHelp(command) {
      return {
        output: `Usage: ${command} [options] [arguments]\nHydra training help for ${command}.`,
        ok: true
      };
    }

    commandCd(args) {
      if (args.length > 1) return { output: "cd: use one destination at a time.", ok: false };
      const destination = args[0] || this.home;
      if (destination.toLowerCase() === "directory") {
        return {
          output: "cd: DIRECTORY is a description, not a directory name. Try an actual name shown by ls, such as: cd Documents",
          ok: false
        };
      }
      const target = this.normalizePath(destination);
      const node = this.getNode(target);
      if (!node) {
        const createDirectoryExample = this.helpExamples.find(
          example => example.toLowerCase() === `mkdir ${destination}`.toLowerCase()
        );
        if (createDirectoryExample) {
          return {
            output: `cd: ${destination} does not exist yet. Create it first with: ${createDirectoryExample}`,
            ok: false
          };
        }
        const current = this.getNode(".");
        const suggestedName = current?.type === DIRECTORY
          ? Object.keys(current.children).find(name => name.toLowerCase() === destination.toLowerCase())
          : null;
        if (suggestedName) {
          return {
            output: `cd: ${destination}: No such directory. Linux names are case-sensitive. Did you mean: cd ${suggestedName}`,
            ok: false
          };
        }
        return {
          output: `cd: ${destination}: No such directory here. Run ls to see the available directory names.`,
          ok: false
        };
      }
      if (node.type !== DIRECTORY) return { output: `cd: ${destination}: Not a directory`, ok: false };
      this.cwd = target;
      return { output: "", ok: true };
    }

    commandMkdir(args) {
      if (args.length !== 1 || args[0].startsWith("-")) {
        return { output: "mkdir: provide one new directory name for this lesson.", ok: false };
      }
      const { parent, name } = this.parentAndName(args[0]);
      if (!name || !parent || parent.type !== DIRECTORY) {
        return { output: `mkdir: cannot create directory '${args[0]}': Parent location does not exist`, ok: false };
      }
      if (Object.prototype.hasOwnProperty.call(parent.children, name)) {
        return { output: `mkdir: cannot create directory '${args[0]}': File exists`, ok: false };
      }
      parent.children[name] = directory({});
      return { output: "", ok: true };
    }

    commandTouch(args) {
      if (args.length !== 1 || args[0].startsWith("-")) {
        return { output: "touch: provide one file name for this lesson.", ok: false };
      }
      const { parent, name } = this.parentAndName(args[0]);
      if (!name || !parent || parent.type !== DIRECTORY) {
        return { output: `touch: cannot touch '${args[0]}': Parent location does not exist`, ok: false };
      }
      if (parent.children[name]?.type === DIRECTORY) {
        return { output: `touch: cannot touch '${args[0]}': That name belongs to a directory`, ok: false };
      }
      parent.children[name] ||= file("");
      return { output: "", ok: true };
    }

    commandCopy(args) {
      if (args.length !== 2) return { output: "cp: provide one source and one destination.", ok: false };
      const source = this.getNode(args[0]);
      if (!source || source.type !== FILE) return { output: `cp: cannot stat '${args[0]}': No such file`, ok: false };
      const { parent, name } = this.parentAndName(args[1]);
      if (!name || !parent || parent.type !== DIRECTORY) {
        return { output: `cp: cannot create '${args[1]}': Parent location does not exist`, ok: false };
      }
      parent.children[name] = clone(source);
      return { output: "", ok: true };
    }

    commandMove(args) {
      if (args.length !== 2) return { output: "mv: provide one source and one destination.", ok: false };
      const sourceInfo = this.parentAndName(args[0]);
      const source = sourceInfo.parent?.children[sourceInfo.name];
      if (!source) return { output: `mv: cannot stat '${args[0]}': No such file or directory`, ok: false };
      const destinationInfo = this.parentAndName(args[1]);
      if (!destinationInfo.name || !destinationInfo.parent || destinationInfo.parent.type !== DIRECTORY) {
        return { output: `mv: cannot move to '${args[1]}': Parent location does not exist`, ok: false };
      }
      destinationInfo.parent.children[destinationInfo.name] = source;
      delete sourceInfo.parent.children[sourceInfo.name];
      return { output: "", ok: true };
    }

    commandRemove(args) {
      if (args.length !== 1 || args[0].startsWith("-")) {
        return { output: "rm: provide one file name for this lesson.", ok: false };
      }
      const { parent, name } = this.parentAndName(args[0]);
      if (!parent || !parent.children[name]) return { output: `rm: cannot remove '${args[0]}': No such file`, ok: false };
      if (parent.children[name].type === DIRECTORY) return { output: `rm: cannot remove '${args[0]}': Is a directory`, ok: false };
      delete parent.children[name];
      return { output: "", ok: true };
    }

    commandRemoveDirectory(args) {
      if (args.length !== 1) return { output: "rmdir: provide one empty directory name.", ok: false };
      const { parent, name } = this.parentAndName(args[0]);
      const target = parent?.children[name];
      if (!target || target.type !== DIRECTORY) return { output: `rmdir: failed to remove '${args[0]}': Not a directory`, ok: false };
      if (Object.keys(target.children).length) return { output: `rmdir: failed to remove '${args[0]}': Directory not empty`, ok: false };
      delete parent.children[name];
      return { output: "", ok: true };
    }

    commandHelp() {
      const lessonExamples = this.helpExamples.length
        ? ["", "Commands useful for this mission:", ...this.helpExamples.map(example => `  ${example}`)]
        : [];
      return {
        output: [
          "Hydra training commands:",
          "  pwd              show your current location",
          "  ls               list the current directory",
          "  cd               follow with the directory name you want to enter",
          "  mkdir            follow with the new directory name you want to create",
          "  touch            follow with the file name you want to create",
          "  echo             display text or a shell variable",
          "  history          show commands used in this activity",
          "  man, info        open training command documentation",
          "  cp, mv           copy or move a file",
          "  rm, rmdir        remove a file or an empty directory",
          "  tar              create, inspect, or extract an archive",
          "  grep, head, tail, wc, cut, sort, uniq  process text",
          "  chmod            change script execution permission",
          "  cat              display a text file",
          "  uname, which     inspect the system and available tools",
          "  tty, whoami      verify the current session",
          "  ps, top, free, dmesg  inspect processes, memory, and messages",
          "  ip, ping, host   inspect and test networking",
          "  clear            clear the terminal display",
          "  help             show this guide",
          ...lessonExamples
        ].join("\n"),
        ok: true
      };
    }

    hasDirectory(path) {
      return this.getNode(path)?.type === DIRECTORY;
    }

    hasFile(path) {
      return this.getNode(path)?.type === FILE;
    }

    ranCommand(command) {
      return this.history.some(entry => entry.command === command && entry.ok);
    }
  }

  global.HydraLinuxSimulator = HydraLinuxSimulator;
  global.createHydraLinuxFilesystem = createDefaultFilesystem;
})(window);
