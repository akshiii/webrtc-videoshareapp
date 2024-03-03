// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";

const Homepage = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const enterRoom = useCallback(
    (e) => {
      e.preventDefault();
      if (socket.connected) {
        console.log("Joining room");
        socket.emit("room:join", { roomId: roomCode, emailId: email });
      }
    },
    [email, roomCode, socket]
  );

  const handleRoomJoin = useCallback(
    (data) => {
      const { roomId } = data;
      console.log("Getting room : join back", data);
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleRoomJoin);
    return () => {
      socket.off("room:join", handleRoomJoin);
    };
  }, [socket]);

  return (
    <div className="homepage-container">
      <h1>Welcome to Video call app</h1>
      <form onSubmit={enterRoom}>
        <div className="form-container">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email here"
          />
          <br />
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            type="text"
            placeholder="Enter room Code"
          />
          <br />
          <button>Enter Room</button>
        </div>
      </form>
    </div>
  );
};

export default Homepage;
