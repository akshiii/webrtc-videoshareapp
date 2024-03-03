import express from "express";
import { Server } from "socket.io";
import bodyParser from "body-parser";
// import {} from 'socket.io-'

const io = new Server({
  cors: true,
});
// const app = express();
//middleware
// app.use(bodyParser.json());

const socketToEmailMapping = new Map();
const emailIdToSocketIdMap = new Map();

io.on("connection", (socket) => {
  // listen to the event
  console.log("Someone new connected");
  socket.on("room:join", (data) => {
    const { roomId, emailId } = data;
    console.log("User joined = ", roomId, emailId);
    emailIdToSocketIdMap.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    io.to(roomId).emit("user:joined", { emailId, id: socket.id });
    socket.join(roomId);
    io.to(socket.id).emit("room:join", data);
    // socket.join(roomId);
    // socket.emit("joined-room", { roomId });
    // socket.broadcast.to(roomId).emit("user-joined", emailId); // socket.emit = emit an event to the socket
    // console.log("emailIdToSocketIdMap = ", emailIdToSocketIdMap);
  });
  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, answer }) => {
    io.to(to).emit("call:accepted", { from: socket.id, answer });
  });

  socket.on("peer:nego:needed", ({ offer, to }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, answer }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, answer });
  });
});

// app.listen(8000, () => console.log("HTTP Server running at port 8000"));
io.listen(8001);
