// scripts/start-app.js

const { spawn } = require("child_process");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
const isWindows = process.platform === "win32";

const run = (command, args, options = {}) => {
  const proc = spawn(
    isWindows ? "cmd" : command,
    isWindows ? ["/c", command, ...args] : args,
    { stdio: "inherit", ...options }
  );

  proc.on("exit", (code) => {
    if (code !== 0) {
      console.error(`❌ Process exited with code ${code}`);
      process.exit(code);
    }
  });

  proc.on("error", (err) => {
    console.error(`🔥 Failed to start process: ${err.message}`);
    process.exit(1);
  });
};

const runApp = () => {
  if (isProduction) {
    console.log("🚀 Starting server in production mode...");
    run("node", [path.join(__dirname, "../server/server.js")]);
  } else {
    console.log("🧪 Starting client in development mode...");
    run("yarn", ["craco", "start"]);
  }
};

runApp();
