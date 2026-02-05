import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Lobby({ socket }) {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const generateRoomCode = () => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    };

    const handleCreateRoom = () => {
        if (!playerName.trim()) {
            setError('Ingresa tu nombre');
            return;
        }

        const newRoomId = generateRoomCode();
        socket.emit('createRoom', { playerName: playerName.trim(), roomId: newRoomId });

        socket.once('roomCreated', ({ roomId }) => {
            navigate(`/room/${roomId}`);
        });

        socket.once('error', ({ message }) => {
            setError(message);
        });
    };

    const handleJoinRoom = () => {
        if (!playerName.trim()) {
            setError('Ingresa tu nombre');
            return;
        }

        if (!roomId.trim() || roomId.length !== 4) {
            setError('Código de sala inválido');
            return;
        }

        socket.emit('joinRoom', { playerName: playerName.trim(), roomId: roomId.trim() });

        socket.once('playerJoined', () => {
            navigate(`/room/${roomId}`);
        });

        socket.once('error', ({ message }) => {
            setError(message);
        });
    };

    return (
        <div className="container flex flex-col items-center justify-center" style={{ minHeight: '100vh' }}>
            <div className="text-center mb-3">
                <h1 className="logo glitch">EL IMPOSTOR</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    Juego de Fútbol - Inspirado en 412
                </p>
            </div>

            <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 className="text-center mb-2">Unirse al Juego</h2>

                {error && (
                    <div style={{
                        background: 'var(--danger-red)',
                        padding: '1rem',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <div className="mb-2">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                        Tu Nombre
                    </label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Ingresa tu nombre"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                    />
                </div>

                <button
                    className="btn"
                    style={{ width: '100%', marginBottom: '1.5rem' }}
                    onClick={handleCreateRoom}
                    disabled={!socket}
                >
                    Crear Sala
                </button>

                <div style={{
                    borderTop: '1px solid var(--dark-tertiary)',
                    paddingTop: '1.5rem',
                    marginTop: '1.5rem'
                }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                        Código de Sala
                    </label>
                    <input
                        type="text"
                        className="input"
                        placeholder="1234"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value.slice(0, 4))}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                        maxLength={4}
                    />

                    <button
                        className="btn"
                        style={{ width: '100%', marginTop: '1rem' }}
                        onClick={handleJoinRoom}
                        disabled={!socket}
                    >
                        Unirse a Sala
                    </button>
                </div>
            </div>

            {!socket && (
                <p className="mt-2" style={{ color: 'var(--danger-red)' }}>
                    Conectando al servidor...
                </p>
            )}
        </div>
    );
}
