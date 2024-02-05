const usernameArgIndex = process.argv.indexOf("--username");
const username =
  usernameArgIndex !== -1 ? process.argv[usernameArgIndex + 1] : "Guest";

console.log(`Welcome to the File Manager, ${username}!`);
