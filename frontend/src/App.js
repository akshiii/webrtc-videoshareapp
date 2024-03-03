import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Home";
import { SocketProvider } from "./providers/Socket";
import RoomPage from "./pages/RoomPage";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
