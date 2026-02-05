import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSocket } from './hooks/useSocket';
import Lobby from './components/Lobby';
import Room from './components/Room';
import './index.css';

function App() {
  const { socket } = useSocket();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby socket={socket} />} />
        <Route path="/room/:roomId" element={<Room socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
