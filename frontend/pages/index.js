import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';

export default function Home() {
  const [mode, setMode] = useState('menu'); // menu, create, join, game
  const [sessionCode, setSessionCode] = useState('');
  const [username, setUsername] = useState('');
  const socket = useSocket();

  const createGame = (numberOfQuestions) => {
    socket.emit('createSession', { numberOfQuestions });
    socket.once('sessionCreated', ({ sessionCode }) => {
      setSessionCode(sessionCode);
      setMode('lobby');
    });
  };

  const joinGame = () => {
    socket.emit('joinSession', { sessionCode, username });
    socket.once('playerJoined', () => {
      setMode('lobby');
    });
  };

  return (
    <div className="container mx-auto p-4">
      {mode === 'menu' && (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setMode('create')}
            className="btn btn-primary"
          >
            Créer une partie
          </button>
          <button
            onClick={() => setMode('join')}
            className="btn btn-secondary"
          >
            Rejoindre une partie
          </button>
        </div>
      )}

      {mode === 'create' && (
        <div className="flex flex-col gap-4">
          <h2>Créer une nouvelle partie</h2>
          <select
            onChange={(e) => createGame(parseInt(e.target.value))}
            className="select"
          >
            <option value="5">5 questions</option>
            <option value="10">10 questions</option>
            <option value="15">15 questions</option>
          </select>
        </div>
      )}

      {mode === 'join' && (
        <div className="flex flex-col gap-4">
          <h2>Rejoindre une partie</h2>
          <input
            type="text"
            placeholder="Code de session"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Pseudo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
          <button onClick={joinGame} className="btn btn-primary">
            Rejoindre
          </button>
        </div>
      )}
    </div>
  );
} 