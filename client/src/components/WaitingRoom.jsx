import { useState } from 'react';

export default function WaitingRoom({ socket, room, roomId }) {
    const [totalRounds, setTotalRounds] = useState(5);

    const handleStartGame = () => {
        socket.emit('startGame', { roomId, totalRounds });
    };

    return (
        <div className="text-center">
            <h1 className="glitch mb-3">Sala: {roomId}</h1>

            <div className="card mb-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="mb-2">Jugadores ({room.players.length}/6)</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {room.players.map((player, index) => (
                        <div key={player.id} className="player-card">
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--neon-green)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--dark-bg)',
                                fontWeight: 'bold',
                                fontSize: '1.2rem'
                            }}>
                                {index + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                                    {player.name}
                                    {room.isHost && index === 0 && (
                                        <span style={{
                                            marginLeft: '0.5rem',
                                            fontSize: '0.9rem',
                                            color: 'var(--neon-green)'
                                        }}>
                                            (HOST)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {room.players.length < 3 && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                    Esperando más jugadores... (mínimo 3)
                </p>
            )}

            {room.isHost ? (
                <>
                    <div className="card mb-2" style={{ maxWidth: '400px', margin: '0 auto' }}>
                        <label style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'block' }}>
                            Número de Rondas
                        </label>
                        <select
                            className="input"
                            value={totalRounds}
                            onChange={(e) => setTotalRounds(Number(e.target.value))}
                            style={{ fontSize: '1.2rem', textAlign: 'center' }}
                        >
                            {[5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>{n} rondas</option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="btn"
                        onClick={handleStartGame}
                        disabled={room.players.length < 3}
                    >
                        Comenzar Juego
                    </button>
                </>
            ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Esperando que el host inicie el juego...
                </p>
            )}
        </div>
    );
}
