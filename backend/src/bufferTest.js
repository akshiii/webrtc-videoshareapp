const http = require("http");
const url = require("url");
const { Buffer } = require("node:buffer");

const buf = Buffer.from("hello world");
// http
//   .createServer((request, res) => {
//     console.log("url: ", request.url);
//     let urlObj = url.parse(request.url, true);
//     console.log("Akshita url obj is: ", urlObj.query);
console.log("To hex", buf.toString("hex"));
//   })
//   .listen(4000);
