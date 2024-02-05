# File Manager

This is a simple File Manager application using Node.js APIs.

## Usage

To start the project, run the following command:

```bash
npm run start -- --username=USERNAME
```

Replace `USERNAME` with the desired username.

The project can be stopped by pressing (Ctrl + C) or sending the `.exit` command into the console.

## Examples

Let's go through examples of using different commands.

**Navigation & working directory (nwd)**

- **Command:** `nwd`
- **Result:** Prints the current working directory.

**Go upper from the current directory (up)**

- **Command:** `up`
- **Result:** If you are not in the root directory, you will move up one level from the current working directory.

**Go to a dedicated folder from the current directory (cd)**

- **Command:** `cd path_to_directory` (replace `path_to_directory` with the actual path)
- **Result:** If the directory exists, you will navigate to the specified directory.

**Print a list of all files and folders in the current directory (ls)**

- **Command:** `ls`
- **Result:** Prints a sorted list of files and folders in the current working directory.

**Read a file and print its content in the console (cat)**

- **Command:** `cat path_to_file` (replace `path_to_file` with the actual path)
- **Result:** Prints the content of the specified file.

**Create an empty file in the current working directory (add)**

- **Command:** `add new_file_name` (replace `new_file_name` with the desired file name)
- **Result:** Creates an empty file with the specified name in the current working directory.

**Rename a file (rn)**

- **Command:** `rn old_file_name new_file_name` (replace `old_file_name` and `new_file_name` with the actual file names)
- **Result:** Renames the specified file.

**Copy a file (cp)**

- **Command:** `cp path_to_file path_to_new_directory` (replace `path_to_file` and `path_to_new_directory` with the actual paths)
- **Result:** Copies the specified file to a new directory.

**Move a file (mv)**

- **Command:** `mv path_to_file path_to_new_directory` (replace `path_to_file` and `path_to_new_directory` with the actual paths)
- **Result:** Moves the specified file to a new directory.

**Delete a file (rm)**

- **Command:** `rm path_to_file` (replace `path_to_file` with the actual path)
- **Result:** Deletes the specified file.

**Get EOL (os --EOL)**

- **Command:** `os --EOL`
- **Result:** Prints the end-of-line character for the current system.

**Get host machine CPUs info (os --cpus)**

- **Command:** `os --cpus`
- **Result:** Prints information about the CPUs on the host machine.

**Get home directory (os --homedir)**

- **Command:** `os --homedir`
- **Result:** Prints the home directory of the current user.

**Get the current system username (os --username)**

- **Command:** `os --username`
- **Result:** Prints the username of the current system user.

**Get CPU architecture for the Node.js binary (os --architecture)**

- **Command:** `os --architecture`
- **Result:** Prints the CPU architecture on which the Node.js binary is running.

**Calculate a hash for a file (hash)**

- **Command:** `hash path_to_file` (replace `path_to_file` with the actual path)
- **Result:** Prints the hash of the specified file.

**Compress a file (compress)**

- **Command:** `compress path_to_file path_to_destination` (replace `path_to_file` and `path_to_destination` with the actual paths)
- **Result:** Compresses the specified file and saves it to the specified location.

**Decompress a file (decompress)**

- **Command:** `decompress path_to_file path_to_destination` (replace `path_to_file` and `path_to_destination` with the actual paths)
- **Result:** Decompresses the specified file and saves it to the specified location.

These are examples of commands with expected results. Make sure your commands adhere to the format described in the code.
