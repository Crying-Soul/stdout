const { exec } = require("child_process");
const DigitalLib = require("./lib");
const sh =  require('shelljs');

let config = {};
let dl = new DigitalLib();
const { stdout, stderr, code } = sh.exec('docker ps -a', { silent: true })

// exec("docker ps -a", (error, stdout, stderr) => {
//   if (error) {
//     console.log(`error: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.log(`stderr: ${stderr}`);
//     return;
//   }
  //   console.log(`stdout: ${stdout}`);

  let stdArr = stdout.replace(/\s\s+/g, " ").split("\n");
  console.log(stdArr);
  //   dockerName = stdArr.slice(5, stdArr.length);

  let names = [];
  for (let i = 1; i < stdArr.length; i++) {
    if (stdArr[i] !== '') names.push(stdArr[i].slice(0,12));

  }

  names.forEach((name) => {
    // console.log(name);
    let data = sh.exec(`docker inspect ${name}`, { silent: true }).stdout
    
      config[name] = JSON.parse(data);

    //   console.log(data);
    
  });
// });

console.log(config);

