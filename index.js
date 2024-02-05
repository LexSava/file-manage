const readline = require("readline");
const path = require("path");
const fs = require("fs").promises;
const os = require("os");
const crypto = require("crypto");
const zlib = require("zlib");

const args = process.argv.slice(2);

const getArgValue = function (argName) {
  const argIndex = args.findIndex(function (arg) {
    return arg.startsWith("--" + argName);
  });
  return argIndex !== -1 ? args[argIndex].split("=")[1] : null;
};

const username = getArgValue("username");

const printCurrentDirectory = function () {
  const currentDirectory = process.cwd();
  console.log("\x1b[33m%s\x1b[0m", `You are currently in ${currentDirectory}`);
};

const startingDirectory =
  process.env.HOME || process.env.USERPROFILE || process.cwd();
console.log(
  "\x1b[34m%s\x1b[0m",
  `Starting working directory is ${startingDirectory}`
);

printCurrentDirectory();
console.log(
  "\x1b[32m%s\x1b[0m",
  `Welcome to the File Manager, ${username || "Guest"}!`
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const listDirectoryContents = async function () {
  try {
    const currentDirectory = process.cwd();
    const contents = await fs.readdir(currentDirectory);
    const folders = [];
    const files = [];

    for (const item of contents) {
      const fullPath = path.join(currentDirectory, item);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        folders.push(item);
      } else {
        files.push(item);
      }
    }

    console.log(
      "\x1b[36m%s\x1b[0m",
      "List of files and folders in the current directory:"
    );
    folders.forEach(function (folder) {
      console.log("\x1b[34m%s\x1b[0m", `[DIR] ${folder}`);
    });
    files.forEach(function (file) {
      console.log("\x1b[33m%s\x1b[0m", `[FILE] ${file}`);
    });
  } catch (error) {
    handleOperationFailure(error.message);
  }

  rl.prompt();
};

const handleInvalidInput = function () {
  console.log(
    "\x1b[31m%s\x1b[0m",
    "Invalid input. Please enter a valid command."
  );
  rl.prompt();
};

const handleOperationFailure = function (errorMessage) {
  console.log("\x1b[31m%s\x1b[0m", `Operation failed: ${errorMessage}`);
  rl.prompt();
};

const handleFileOperation = async function (operation, args) {
  const filePath = args[0];

  try {
    switch (operation.toLowerCase()) {
      case "cat":
        if (filePath) {
          const fileContent = await fs.readFile(filePath, "utf8");
          console.log(fileContent);
        } else {
          handleInvalidInput();
        }
        break;
      case "add":
        if (filePath) {
          try {
            await fs.access(filePath);
            handleOperationFailure(`File "${filePath}" already exists.`);
          } catch {
            await fs.writeFile(filePath, "");
            console.log(`File "${filePath}" created.`);
          }
        } else {
          handleInvalidInput();
        }
        break;
      case "rn":
        const newFilename = args[1];
        if (filePath && newFilename) {
          try {
            await fs.access(filePath);
            await fs.rename(filePath, newFilename);
            console.log(`File "${filePath}" renamed to "${newFilename}".`);
          } catch {
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
            await fs.rename(filePath, newDestinationPath);
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
          await fs.unlink(filePath);
          console.log(`File "${filePath}" deleted.`);
        } else {
          handleInvalidInput();
        }
        break;
      case "hash":
        if (filePath) {
          const hash = crypto.createHash("sha256");
          const fileContent = await fs.readFile(filePath);
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
          const writeStream = fs.createWriteStream(
            destinationPathForCompression
          );
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
  } catch (error) {
    handleOperationFailure(error.message);
  }

  rl.prompt();
};

const handleOsOperation = function (operation) {
  try {
    switch (operation.toLowerCase()) {
      case "--eol":
        console.log(`End-Of-Line (EOL) character for this system: "${os.EOL}"`);
        break;
      case "--cpus":
        console.log("CPU Information:");
        const cpus = os.cpus();
        cpus.forEach(function (cpu, index) {
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
  } catch (error) {
    handleOperationFailure(error.message);
  }

  rl.prompt();
};

const executeCommand = async function (input) {
  const [command, ...args] = input.trim().split(" ");

  try {
    switch (command.toLowerCase()) {
      case "up":
        const currentDirectory = process.cwd();
        const rootDirectory = path.parse(currentDirectory).root;
        if (currentDirectory !== rootDirectory) {
          await process.chdir("..");
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
          const stats = await fs.stat(newPath);
          if (stats.isDirectory()) {
            await process.chdir(newPath);
            printCurrentDirectory();
          } else {
            handleOperationFailure(`Directory "${args[0]}" does not exist.`);
          }
        } else {
          handleInvalidInput();
        }
        break;
      case "ls":
        await listDirectoryContents();
        break;
      case "nwd":
        printCurrentDirectory();
        break;
      case "os":
        handleOsOperation(args[0]);
        break;
      case "add":
        await handleFileOperation(command.toLowerCase(), args);
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
          await handleFileOperation(command.toLowerCase(), args);
        } else {
          handleInvalidInput();
        }
    }
  } catch (error) {
    handleOperationFailure(error.message);
  }
};

rl.on("line", async function (input) {
  if (input.trim() === ".exit") {
    rl.close();
    return;
  }

  await executeCommand(input);
});

rl.on("SIGINT", function () {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Thank you for using File Manager, ${username || "Guest"}, goodbye!`
  );
  process.exit();
});

rl.on("close", function () {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `Thank you for using File Manager, ${username || "Guest"}, goodbye!`
  );
  process.exit();
});
