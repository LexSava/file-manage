const args = process.argv.slice(2);
const readline = require("readline");

// Function to extract the value of a CLI argument
const getArgValue = (argName) => {
  const argIndex = args.findIndex((arg) => arg.startsWith(`--${argName}`));
  return argIndex !== -1 ? args[argIndex].split("=")[1] : null;
};

// Get the value of the --username argument
const username = getArgValue("username");

// Display the welcome message
console.log(
  "\x1b[32m%s\x1b[0m",
  `Welcome to the File Manager, ${username || "Guest"}!`
);

// Create interface for reading from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Handle Ctrl+C interrupt
rl.on("SIGINT", () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Thank you for using File Manager, ${username || "Guest"}, goodbye!`
  );
  process.exit();
});

// Handle program close
rl.on("close", () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Thank you for using File Manager, ${username || "Guest"}, goodbye!`
  );
  process.exit();
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});
