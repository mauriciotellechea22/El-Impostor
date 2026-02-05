import { useState, useEffect } from 'react';

export default function GameBoard({ socket, room, roomId, isImpostor, theme }) {
    const [clue, setClue] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isMyTurn, setIsMyTurn] = useState(false);

    const alivePlayers = room.players.filter(p => p.isAlive);
    const currentPlayer = alivePlayers[room.currentTurnIndex];

    useEffect(() => {
        setIsMyTurn(currentPlayer?.id === socket.id);
    }, [currentPlayer, socket.id]);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [room.currentTurnIndex]);

    const handleSubmitClue = () => {
        const words = clue.trim().split(/\s+/);

        if (words.length === 0 || words.length > 2) {
            alert('Debes dar 1 o 2 palabras como pista');
            return;
        }

        socket.emit('submitClue', { roomId, clue: clue.trim() });
        setClue('');
        setTimeLeft(60);
    };

    return (
        <div>
            {/* Header */}
            <div className="text-center mb-3">
                <h2>Ronda {room.currentRound}</h2>

                {isImpostor && (
                    <div className="card mt-2" style={{
                        background: 'var(--danger-red)',
                        maxWidth: '600px',
                        margin: '1rem auto',
                        padding: '1rem'
                    }}>
                        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>¡ERES EL IMPOSTOR!</h2>
                        <p style={{ fontSize: '1rem', margin: 0 }}>
                            Intenta mezclarte con tus pistas.
                        </p>
                    </div>
                )}

                <div className="card mt-2" style={{ maxWidth: '600px', margin: '1rem auto' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Tema:</h3>
                    <p style={{ fontSize: '2rem', color: 'var(--neon-green)' }}>
                        {theme.name}
                    </p>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Categoría: {theme.category.toUpperCase()}
                    </p>
                </div>
            </div>

            {/* Main Game Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Jugadores */}
                <div>
                    <h3 className="mb-2">Jugadores</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {alivePlayers.map((player, index) => (
                            <div
                                key={player.id}
                                className={`player-card ${index === room.currentTurnIndex ? 'impostor' : ''}`}
                                style={index === room.currentTurnIndex ? {
                                    borderColor: 'var(--neon-green)',
                                    boxShadow: '0 0 20px var(--neon-green-glow)'
                                } : {}}
                            >
                                <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                                    {player.name}
                                    {index === room.currentTurnIndex && (
                                        <span style={{ marginLeft: '0.5rem', color: 'var(--neon-green)' }}>
                                            ← TURNO
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pistas */}
                <div>
                    <h3 className="mb-2">Pistas Dadas</h3>

                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        marginBottom: '2rem'
                    }}>
                        {room.clues.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>
                                No hay pistas aún...
                            </p>
                        ) : (
                            room.clues.map((clueItem, index) => (
                                <div key={index} className="clue">
                                    <strong>{clueItem.playerName}:</strong> {clueItem.clue}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input de pista */}
                    {isMyTurn && (
                        <div className="card">
                            <div className={`timer ${timeLeft < 10 ? 'warning' : ''}`}>
                                {timeLeft}s
                            </div>

                            <input
                                type="text"
                                className="input mt-2"
                                placeholder="Escribe tu pista (1-2 palabras)"
                                value={clue}
                                onChange={(e) => setClue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitClue()}
                                autoFocus
                            />

                            <button
                                className="btn mt-1"
                                style={{ width: '100%' }}
                                onClick={handleSubmitClue}
                                disabled={!clue.trim()}
                            >
                                Enviar Pista
                            </button>
                        </div>
                    )}

                    {!isMyTurn && (
                        <div className="card text-center">
                            <p style={{ fontSize: '1.2rem' }}>
                                Esperando a <strong style={{ color: 'var(--neon-green)' }}>
                                    {currentPlayer?.name}
                                </strong>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
