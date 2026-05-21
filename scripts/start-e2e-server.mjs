import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const root = process.cwd();
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runBuild() {
  const command = process.env.npm_execpath ? process.execPath : npmCommand;
  const args = process.env.npm_execpath ? [process.env.npm_execpath, "run", "build"] : ["run", "build"];
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    shell: !process.env.npm_execpath && process.platform === "win32"
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function copyDirectory(source, destination) {
  if (!existsSync(source)) {
    return;
  }

  mkdirSync(path.dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true, force: true });
}

runBuild();

copyDirectory(path.join(root, ".next", "static"), path.join(root, ".next", "standalone", ".next", "static"));
copyDirectory(path.join(root, "public"), path.join(root, ".next", "standalone", "public"));

const server = spawn(process.execPath, [path.join(root, ".next", "standalone", "server.js")], {
  cwd: root,
  stdio: "inherit",
  env: process.env
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.kill(signal);
  });
}
