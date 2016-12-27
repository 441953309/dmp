var ip = require("./ip")

ip.load();

let add = ip.findSync("192.168.1.1");
console.log(add);