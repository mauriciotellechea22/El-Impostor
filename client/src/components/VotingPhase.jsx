import { useState } from 'react';

export default function VotingPhase({ socket, room, roomId }) {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    const alivePlayers = room.players.filter(p => p.isAlive);

    const handleVote = () => {
        if (!selectedPlayer) {
            alert('Selecciona un jugador para votar');
            return;
        }

        socket.emit('submitVote', { roomId, targetId: selectedPlayer });
        setHasVoted(true);
    };

    return (
        <div className="text-center">
            <h1 className="glitch mb-3">FASE DE VOTACIÓN</h1>

            <div className="card mb-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 className="mb-2">¿Quién es el impostor?</h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '2rem'
                }}>
                    {alivePlayers
                        .filter(player => player.id !== socket.id) // Can't vote for yourself
                        .map((player) => (
                            <button
                                key={player.id}
                                className={`player-card ${selectedPlayer === player.id ? 'impostor' : ''}`}
                                onClick={() => !hasVoted && setSelectedPlayer(player.id)}
                                disabled={hasVoted}
                                style={{
                                    cursor: hasVoted ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    ...(selectedPlayer === player.id && {
                                        borderColor: 'var(--danger-red)',
                                        transform: 'scale(1.05)'
                                    })
                                }}
                            >
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                                    {player.name}
                                </div>
                            </button>
                        ))}
                </div>

                {!hasVoted && (
                    <button
                        className="btn btn-danger mt-3"
                        onClick={handleVote}
                        disabled={!selectedPlayer}
                        style={{ width: '100%' }}
                    >
                        Confirmar Voto
                    </button>
                )}

                {hasVoted && (
                    <p className="mt-2" style={{ fontSize: '1.3rem', color: 'var(--neon-green)' }}>
                        ✓ Voto enviado. Esperando otros jugadores...
                    </p>
                )}
            </div>

            {/* Recap de pistas */}
            <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
                <h3 className="mb-2">Pistas de esta ronda</h3>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {room.clues
                        .filter(c => c.round === room.currentRound)
                        .map((clueItem, index) => (
                            <div key={index} className="clue">
                                <strong>{clueItem.playerName}:</strong> {clueItem.clue}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
