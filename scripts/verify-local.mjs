import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import net from "node:net";

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

function canConnect(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.setTimeout(250, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function findPort(start = 3000) {
  let port = start;

  while (await canConnect(port)) {
    port += 1;
  }

  return port;
}

async function waitForServer(port, server) {
  const deadline = Date.now() + 45_000;
  let lastError = "";

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Server exited early with code ${server.exitCode}. ${lastError}`);
    }

    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) {
        return;
      }

      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }

    await new Promise((resolve) => setTimeout(resolve, 750));
  }

  throw new Error(`Server did not become ready on port ${port}. ${lastError}`);
}

function stopServer(server) {
  return new Promise((resolve) => {
    server.stdout?.destroy();
    server.stderr?.destroy();

    if (!server.pid || server.exitCode !== null) {
      resolve();
      return;
    }

    const timer = setTimeout(resolve, 3000);
    server.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
    server.kill("SIGTERM");
  });
}

const port = await findPort();
const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
  cwd: process.cwd(),
  env: cleanEnvironment(),
  stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

try {
  await waitForServer(port, server);

  const [home, login] = await Promise.all([
    fetch(`http://127.0.0.1:${port}/`),
    fetch(`http://127.0.0.1:${port}/admin/login`)
  ]);

  const contact = await fetch(`http://127.0.0.1:${port}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Runtime Test",
      email: "runtime@example.com",
      phone: "515-555-0199",
      message: "Local runtime verification message.",
      company: ""
    })
  });
  const contactPayload = await contact.json();

  if (!home.ok || !login.ok || contact.status !== 201) {
    throw new Error(
      JSON.stringify({
        home: home.status,
        login: login.status,
        contact: contact.status,
        contactPayload
      })
    );
  }

  console.log(
    JSON.stringify(
      {
        localUrl: `http://127.0.0.1:${port}`,
        homeStatus: home.status,
        loginStatus: login.status,
        contactStatus: contact.status,
        contactMessage: contactPayload.message
      },
      null,
      2
    )
  );
} catch (error) {
  console.error(output);
  throw error;
} finally {
  await stopServer(server);
}
