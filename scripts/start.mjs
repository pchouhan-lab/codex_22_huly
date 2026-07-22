import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

function cleanEnvironment() {
  const env = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (key.toLowerCase() === "path") {
      env.Path = value;
      continue;
    }

    env[key] = value;
  }

  return env;
}

const port = process.env.PORT || "3000";
const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const server = spawn(process.execPath, [nextBin, "start", "-H", "0.0.0.0", "-p", port], {
  cwd: process.cwd(),
  env: cleanEnvironment(),
  stdio: "inherit"
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
