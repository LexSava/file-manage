const args = process.argv.slice(2);
const readline = require("readline");
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const zlib = require("zlib");

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

// Function to print the list of files and folders in the current directory
const listDirectoryContents = () => {
  const currentDirectory = process.cwd();
  const contents = fs.readdirSync(currentDirectory).sort();
  const folders = [];
  const files = [];

  contents.forEach((item) => {
    const fullPath = path.join(currentDirectory, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      folders.push(item);
    } else {
      files.push(item);
    }
  });

  console.log(
    "\x1b[36m%s\x1b[0m",
    "List of files and folders in the current directory:"
  );
  folders.forEach((folder) =>
    console.log("\x1b[34m%s\x1b[0m", `[DIR] ${folder}`)
  );
  files.forEach((file) => console.log("\x1b[33m%s\x1b[0m", `[FILE] ${file}`));

  rl.prompt();
};

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

// Function to handle file operations
const handleFileOperation = (operation, args) => {
  const filePath = args[0];

  switch (operation.toLowerCase()) {
    case "cat":
      if (filePath) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        console.log(fileContent);
      } else {
        handleInvalidInput();
      }
      break;
    case "add":
      if (filePath) {
        if (fs.existsSync(filePath)) {
          handleOperationFailure(`File "${filePath}" already exists.`);
        } else {
          fs.writeFileSync(filePath, "");
          console.log(`File "${filePath}" created.`);
        }
      } else {
        handleInvalidInput();
      }
      break;
    case "rn":
      const newFilename = args[1];
      if (filePath && newFilename) {
        if (fs.existsSync(filePath)) {
          fs.renameSync(filePath, newFilename);
          console.log(`File "${filePath}" renamed to "${newFilename}".`);
        } else {
          handleOperationFailure(`File "${filePath}" does not exist.`);
        }
      } else {
        handleInvalidInput();
      }
      break;
    case "cp":
      const destinationPath = args[1];
      if (filePath && destinationPath) {
        const readStream = fs.createReadStream(filePath);
        const writeStream = fs.createWriteStream(destinationPath);

        readStream.pipe(writeStream);
        console.log(`File "${filePath}" copied to "${destinationPath}".`);
      } else {
        handleInvalidInput();
      }
      break;
    case "mv":
      const newDestinationPath = args[1];
      if (filePath && newDestinationPath) {
        try {
          fs.renameSync(filePath, newDestinationPath);
          console.log(`File "${filePath}" moved to "${newDestinationPath}".`);
        } catch (error) {
          handleOperationFailure(`Error moving file: ${error.message}`);
        }
      } else {
        handleInvalidInput();
      }
      break;
    case "rm":
      if (filePath) {
        fs.unlinkSync(filePath);
        console.log(`File "${filePath}" deleted.`);
      } else {
        handleInvalidInput();
      }
      break;
    case "hash":
      if (filePath) {
        const hash = crypto.createHash("sha256");
        const fileContent = fs.readFileSync(filePath);
        hash.update(fileContent);
        console.log(`Hash for file "${filePath}": ${hash.digest("hex")}`);
      } else {
        handleInvalidInput();
      }
      break;
    case "compress":
      const destinationPathForCompression = args[1];
      if (filePath && destinationPathForCompression) {
        const readStream = fs.createReadStream(filePath);
        const writeStream = fs.createWriteStream(destinationPathForCompression);
        const gzip = zlib.createBrotliCompress();

        readStream.pipe(gzip).pipe(writeStream);

        console.log(
          `File "${filePath}" compressed to "${destinationPathForCompression}".`
        );
      } else {
        handleInvalidInput();
      }
      break;
    case "decompress":
      const destinationPathForDecompression = args[1];
      if (filePath && destinationPathForDecompression) {
        const readStream = fs.createReadStream(filePath);
        const writeStream = fs.createWriteStream(
          destinationPathForDecompression
        );
        const gunzip = zlib.createBrotliDecompress();

        readStream.pipe(gunzip).pipe(writeStream);

        console.log(
          `File "${filePath}" decompressed to "${destinationPathForDecompression}".`
        );
      } else {
        handleInvalidInput();
      }
      break;
    default:
      handleInvalidInput();
  }

  rl.prompt();
};

// Function to handle os-related operations
const handleOsOperation = (operation) => {
  switch (operation.toLowerCase()) {
    case "--eol":
      console.log(`End-Of-Line (EOL) character for this system: "${os.EOL}"`);
      break;
    case "--cpus":
      console.log("CPU Information:");
      const cpus = os.cpus();
      cpus.forEach((cpu, index) => {
        console.log(`CPU ${index + 1}: ${cpu.model} @ ${cpu.speed} GHz`);
      });
      break;
    case "--homedir":
      console.log(`Home directory for this user: "${os.homedir()}"`);
      break;
    case "--username":
      console.log(`Current system user name: "${os.userInfo().username}"`);
      break;
    case "--architecture":
      console.log(`CPU architecture for Node.js binary: "${process.arch}"`);
      break;
    default:
      handleInvalidInput();
  }

  rl.prompt();
};

// Function to validate and execute commands
const executeCommand = (input) => {
  const [command, ...args] = input.trim().split(" ");

  switch (command.toLowerCase()) {
    case "up":
      const currentDirectory = process.cwd();
      const rootDirectory = path.parse(currentDirectory).root;
      if (currentDirectory !== rootDirectory) {
        process.chdir("..");
        printCurrentDirectory();
      } else {
        console.log(
          "\x1b[31m%s\x1b[0m",
          "Cannot go upper than the root directory."
        );
      }
      break;
    case "cd":
      if (args.length > 0) {
        const newPath = path.resolve(process.cwd(), args[0]);
        if (fs.existsSync(newPath) && fs.statSync(newPath).isDirectory()) {
          process.chdir(newPath);
          printCurrentDirectory();
        } else {
          handleOperationFailure(`Directory "${args[0]}" does not exist.`);
        }
      } else {
        handleInvalidInput();
      }
      break;
    case "ls":
      listDirectoryContents();
      break;
    case "nwd":
      printCurrentDirectory();
      break;
    case "os":
      handleOsOperation(args[0]);
      break;
    case "add":
      handleFileOperation(command.toLowerCase(), args);
      break;
    default:
      if (
        [
          "cat",
          "add",
          "rn",
          "cp",
          "mv",
          "rm",
          "hash",
          "compress",
          "decompress",
        ].includes(command.toLowerCase())
      ) {
        handleFileOperation(command.toLowerCase(), args);
      } else {
        handleInvalidInput();
      }
  }
};

// Listen for user input
rl.on("line", (input) => {
  // Check if the user entered the .exit command
  if (input.trim() === ".exit") {
    rl.close();
    return;
  }

  executeCommand(input);
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
