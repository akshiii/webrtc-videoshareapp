const http = require("http");
const sum = require("./mymodule");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  res.write("<h1>I am executing the response</h1>");
  res.write("<button> I am a butn</button>");
  res.end("end bye bye");
});

let a = sum(2, 3);
console.log("Sum is:", a);

server.listen(4000, () => {
  console.log("Akshita server is running");
});
