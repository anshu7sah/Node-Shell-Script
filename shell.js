var readline = require("readline");
let path = require("path");
let fs = require("fs");

var userCommand = readline.createInterface(process.stdin, process.stdout);
const { spawn, fork } = require("child_process");

let home = path.join(process.env.HOME);
process.chdir(home);
userCommand.on("line", (command) => {
  if (command == "exit") {
    userCommand.close();
  }
  // if (!command.indexOf("cd")) {
  //   let newPath = command.split(" ");
  //   fs.writeFileSync(
  //     path.join(newPath[1], "child.js"),
  //     fs.readFileSync(path.join(__dirname, "shellScripting2.js"))
  //   );
  //   process.fork(path.join(newPath[1], "child.js"));

  //   process.chdir(newPath[1]);
  // }

  const child = spawn(`${command}`, {
    shell: true,
    stdio: "inherit",
  });
  child.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
  child.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
  child.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});
userCommand.on("SIGINT", () => {
  userCommand.question("Exit (y or n)? ", (input) => {
    if (input.match(/^y(es)?$/i)) {
      userCommand.pause();
    }
  });
});
// userCommand.on("SIGTSTP", () => {
//   console.log(`SIGTSTP event is invoked. pid=${process.pid}`);
// });

userCommand.on("SIGCONT", () => {
  userCommand.prompt();
});
