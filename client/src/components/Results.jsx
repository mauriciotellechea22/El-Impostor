export default function Results({ room, navigate }) {
    const winner = room.winner;
    const impostorPlayer = room.players.find(p => p.id === room.impostorId);

    return (
        <div className="text-center">
            <h1 className="glitch mb-3">
                {winner === 'impostor' ? '¡EL IMPOSTOR GANÓ!' : '¡LOS INOCENTES GANARON!'}
            </h1>

            <div className="card mb-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 className="mb-2">El impostor era...</h2>
                <div style={{
                    fontSize: '3rem',
                    color: 'var(--danger-red)',
                    textShadow: '0 0 20px var(--danger-glow)',
                    marginTop: '1rem'
                }}>
                    {impostorPlayer?.name || 'Desconocido'}
                </div>
            </div>

            <div className="card mb-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 className="mb-2">El tema era:</h3>
                <p style={{ fontSize: '2rem', color: 'var(--neon-green)' }}>
                    {room.theme?.name || 'Desconocido'}
                </p>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Categoría: {room.theme?.category?.toUpperCase() || 'N/A'}
                </p>
            </div>

            <div className="card mb-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 className="mb-2">Todas las Pistas</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {room.allClues?.map((clueItem, index) => (
                        <div
                            key={index}
                            className="clue"
                            style={clueItem.playerId === room.impostorId ? {
                                borderColor: 'var(--danger-red)'
                            } : {}}
                        >
                            <strong>
                                {clueItem.playerName}
                                {clueItem.playerId === room.impostorId && (
                                    <span style={{ color: 'var(--danger-red)', marginLeft: '0.5rem' }}>
                                        (IMPOSTOR)
                                    </span>
                                )}:
                            </strong> {clueItem.clue}
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="btn"
                onClick={() => navigate('/')}
            >
                Volver al Menú
            </button>
        </div>
    );
}
