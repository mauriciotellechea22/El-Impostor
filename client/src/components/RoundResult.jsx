export default function RoundResult({ socket, room, roomId, voteResult }) {
    const handleNextRound = () => {
        socket.emit('continueToNextRound', { roomId });
    };

    const eliminatedPlayer = room.players.find(p => p.id === voteResult.eliminatedId);

    return (
        <div className="text-center">
            <h1 className="glitch mb-3">RESULTADO DE RONDA {room.currentRound - 1}</h1>

            <div className="card mb-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="mb-2">Jugador Eliminado:</h2>
                <div style={{
                    fontSize: '3rem',
                    color: voteResult.wasImpostor ? 'var(--neon-green)' : 'var(--danger-red)',
                    textShadow: `0 0 20px ${voteResult.wasImpostor ? 'var(--neon-green-glow)' : 'var(--danger-glow)'}`,
                    marginTop: '1rem'
                }}>
                    {voteResult.eliminatedName}
                </div>
                <p style={{ fontSize: '1.5rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    {voteResult.wasImpostor ? '¡ERA EL IMPOSTOR! 🎉' : 'Era inocente 😢'}
                </p>
            </div>

            <div className="card mb-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 className="mb-2">Votación:</h3>
                <div>
                    {Object.entries(voteResult.voteCounts).map(([playerId, count]) => {
                        const player = room.players.find(p => p.id === playerId);
                        return (
                            <div key={playerId} style={{
                                padding: '0.5rem',
                                borderBottom: '1px solid var(--card-border)',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <span>{player?.name || 'Desconocido'}</span>
                                <span style={{ color: 'var(--neon-green)' }}>{count} votos</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {room.isHost ? (
                <button
                    className="btn"
                    onClick={handleNextRound}
                >
                    Continuar a Ronda {room.currentRound}
                </button>
            ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Esperando que el host continue...
                </p>
            )}
        </div>
    );
}
