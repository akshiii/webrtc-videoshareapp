import http from "http";
import express from "express";
import ws, { WebSocketServer } from "ws";
import { createClient } from "redis";

// const redisClient = createClient();
const redisClient = createClient(6380, "127.0.0.1", {
  auth_pass: "password",
});
const app = express();

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
wss.on("connection", async (client, req) => {
  console.log("Someone Connected");
  client.on("message", (message) => {
    console.log("Recieved mess ==", message);
    saveInRedis(message);
    broadcast(client, message);
  });
});

let i = 0;
async function saveInRedis(message) {
  await redisClient.set("message" + i, message);
  i++;
}

async function broadcast(msgFrom, newMsg) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN && msgFrom != client) {
      client.send(`${newMsg}`);
    }
  }
}

//REDIS
redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();

// await redisClient.set("falana", "mera naam");
const value = await redisClient.get("name");
console.log("Getting value from Redis = ", value);

// app.set("view engine", "ejs");
// Middleware to parse form data
// app.use(bodyParser.urlencoded({ extended: true }));
// Define a route to render the input tag
// app.get("/", (req, res) => {
// res.render("./views/index", { title: "Input Tag Example" });
// });
// app.post("/submit", (req, res) => {
// console.log("Req.body == ", req.body);
// res.send(`You name = ${req.body.name} and company = ${req.body.company} `);
// });

server.listen(8082, () => {
  console.log(`Server running on ws://localhost:8082`);
});
