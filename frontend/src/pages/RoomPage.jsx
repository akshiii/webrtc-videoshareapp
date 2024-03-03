import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/Socket";
// import { ReactPlayer } from "react-player";
import peer from "../service/peer";

const RoomPage = () => {
  const { socket } = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const videoRef = useRef();
  const remoteVideoRef = useRef();
  // const [localAudioTrack, setLocalAudioTrack] = useState(null);
  // const [localVideoTrack, setlocalVideoTrack] = useState(null);

  const handleCallUser = useCallback(async () => {
    //swicth on video stream
    const stream = await navigator.mediaDevices.getUserMedia({
      // audio: true,
      video: true,
    });
    setMyStream(stream);
    startVideo(stream, videoRef);
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  function startVideo(myStream, refToVideo) {
    // const audioTrack = myStream.getAudioTracks()[0];
    const videoTrack = myStream.getVideoTracks()[0];
    var isPlaying =
      refToVideo.current.currentTime > 0 &&
      !refToVideo.current.paused &&
      !refToVideo.current.ended &&
      refToVideo.current.readyState > refToVideo.current.HAVE_CURRENT_DATA;
    console.log("isPlaying ? = ", isPlaying);

    refToVideo.current.srcObject = new MediaStream([videoTrack]);
    refToVideo.current.play();
  }

  const handleUserJoined = useCallback(({ emailId, id }) => {
    console.log("SOMEONE ELSE joined = ", emailId, id);
    setRemoteSocketId(id);
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log("incoming call: =", from, offer);
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        // audio: true,
        video: true,
      });
      setMyStream(stream);
      startVideo(stream, videoRef);

      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, answer });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, answer }) => {
      console.log("Call Accepted");
      peer.setLocalDescription(answer);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const answer = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, answer });
    },
    [socket]
  );

  const handleNegotiationFinal = useCallback(async ({ from, answer }) => {
    await peer.setLocalDescription(answer);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      console.log("Got TRACKS!");
      setRemoteStream(ev.streams[0]);
      startVideo(ev.streams[0], remoteVideoRef);
    });
  });

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegotiationFinal);

    return () => {
      //deregister the handlers
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegotiationFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegotiationFinal,
  ]);

  return (
    <div className="room-page-container">
      RoomPage
      <h4>{remoteSocketId ? "Connected" : "Noone in room"}</h4>
      {remoteSocketId && <button onClick={sendStreams}>Send STREAM</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {/* {myStream && <ReactPlayer playing muted height="100px" width="100px" url={myStream} />} */}
      {/* <video autoPlay ref={videoRef}></video> */}
      {remoteSocketId && (
        <>
          <div>My Stream</div>
          <video ref={videoRef} width="300px" height="300px" controls autoPlay muted></video>
        </>
      )}
      {remoteSocketId && (
        <>
          <div>Remote Stream</div>
          <video ref={remoteVideoRef} width="300px" height="300px" controls autoPlay muted></video>
        </>
      )}
    </div>
  );
};

export default RoomPage;
