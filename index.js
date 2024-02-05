const args = process.argv.slice(2);
const readline = require("readline");
const path = require("path");
const fs = require("fs");

// Function to extract the value of a CLI argument
const getArgValue = (argName) => {
  const argIndex = args.findIndex((arg) => arg.startsWith(`--${argName}`));
  return argIndex !== -1 ? args[argIndex].split("=")[1] : null;
};

// Get the value of the --username argument
const username = getArgValue("username");

// Function to print the current working directory
const printCurrentDirectory = () => {
  const currentDirectory = process.cwd();
  console.log("\x1b[33m%s\x1b[0m", `You are currently in ${currentDirectory}`);
};

// Display the starting working directory
const startingDirectory =
  process.env.HOME || process.env.USERPROFILE || process.cwd();
console.log(
  "\x1b[34m%s\x1b[0m",
  `Starting working directory is ${startingDirectory}`
);

// Display the welcome message and current working directory
printCurrentDirectory();
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
  console.log(
    "\x1b[31m%s\x1b[0m",
    "Operation failed. Please enter another command."
  );
  rl.prompt();
});

// Function to handle invalid input
const handleInvalidInput = () => {
  console.log(
    "\x1b[31m%s\x1b[0m",
    "Invalid input. Please enter a valid command."
  );
  rl.prompt();
};

// Function to handle operation failure
const handleOperationFailure = (errorMessage) => {
  console.log("\x1b[31m%s\x1b[0m", `Operation failed: ${errorMessage}`);
  rl.prompt();
};

// Function to validate and execute commands
const executeCommand = (command, args) => {
  switch (command.toLowerCase()) {
    case "cd":
      const targetPath = args[0];
      if (targetPath) {
        const newPath = path.resolve(process.cwd(), targetPath);
        if (fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
          process.chdir(newPath);
          printCurrentDirectory();
        } else {
          handleOperationFailure(`Directory "${targetPath}" does not exist.`);
        }
      } else {
        handleInvalidInput();
      }
      break;
    // Add more commands as needed
    default:
      handleInvalidInput();
  }
};

// Listen for user input
rl.on("line", (input) => {
  const [command, ...commandArgs] = input.trim().split(" ");
  executeCommand(command, commandArgs);
});
