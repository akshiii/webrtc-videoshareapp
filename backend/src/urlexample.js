const http = require("http");
const url = require("url");

//url.parse()
http
  .createServer((request, res) => {
    console.log("url: ", request.url);
    let urlObj = url.parse(request.url, true);
    console.log("Akshita url obj is: ", urlObj.query);
  })
  .listen(4000);
