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
            "commands.txt": file("pwd\nls\ncd\nmkdir\ntouch\n")
          }),
          "readme.txt": file("Explore, learn, and practice. No command leaves your browser.\n")
        })
      }),
      tmp: directory({}),
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
      const handlers = {
        pwd: () => this.commandPwd(tokens),
        ls: () => this.commandLs(tokens),
        cd: () => this.commandCd(tokens),
        mkdir: () => this.commandMkdir(tokens),
        touch: () => this.commandTouch(tokens),
        clear: () => ({ output: "", ok: true, clear: true }),
        help: () => this.commandHelp()
      };

      let result;
      if (handlers[command]) {
        try {
          result = handlers[command]();
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

    commandPwd(args) {
      if (args.length) return { output: "pwd: this lesson uses pwd without additional options.", ok: false };
      return { output: this.cwd, ok: true };
    }

    commandLs(args) {
      const options = args.filter(item => item.startsWith("-"));
      const paths = args.filter(item => !item.startsWith("-"));
      if (options.some(option => !/^-[al]+$/.test(option))) {
        return { output: "ls: supported lesson options are -a and -l.", ok: false };
      }
      if (paths.length > 1) return { output: "ls: use one location at a time in this lesson.", ok: false };
      const targetPath = paths[0] || ".";
      const node = this.getNode(targetPath);
      if (!node) return { output: `ls: cannot access '${targetPath}': No such file or directory`, ok: false };
      if (node.type === FILE) return { output: targetPath.split("/").pop(), ok: true };

      const showHidden = options.some(option => option.includes("a"));
      const long = options.some(option => option.includes("l"));
      const names = Object.keys(node.children)
        .filter(name => showHidden || !name.startsWith("."))
        .sort((a, b) => a.localeCompare(b));
      if (showHidden) names.unshift(".", "..");
      if (!names.length) return { output: "", ok: true };
      const output = long
        ? names.map(name => {
          if (name === "." || name === "..") return `drwxr-xr-x  ${name}`;
          const child = node.children[name];
          return `${child.type === DIRECTORY ? "d" : "-"}rwxr-xr-x  ${name}`;
        }).join("\n")
        : names.join("  ");
      return { output, ok: true };
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
