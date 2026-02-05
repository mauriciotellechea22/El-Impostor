import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WaitingRoom from './WaitingRoom';
import GameBoard from './GameBoard';
import VotingPhase from './VotingPhase';
import RoundResult from './RoundResult';
import Results from './Results';

export default function Room({ socket }) {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [isImpostor, setIsImpostor] = useState(false);
    const [theme, setTheme] = useState(null);
    const [voteResult, setVoteResult] = useState(null);
    const [gamePhase, setGamePhase] = useState('waiting'); // waiting, playing, voting, roundResult, results

    useEffect(() => {
        if (!socket) return;

        // Listen for game events
        socket.on('playerJoined', ({ room }) => {
            setRoom(room);
        });

        socket.on('playerLeft', ({ room }) => {
            setRoom(room);
        });

        socket.on('gameStarted', ({ room, isImpostor, theme }) => {
            setRoom(room);
            setIsImpostor(isImpostor);
            setTheme(theme);
            setGamePhase('playing');
        });

        socket.on('clueAdded', ({ room }) => {
            setRoom(room);
        });

        socket.on('votingPhase', ({ room }) => {
            setRoom(room);
            setGamePhase('voting');
        });

        socket.on('voteResult', ({ eliminatedId, eliminatedName, wasImpostor, voteCounts, room, gameOver }) => {
            setVoteResult({ eliminatedId, eliminatedName, wasImpostor, voteCounts });
            setRoom(room);
            if (gameOver) {
                // Game over - don't change phase yet, wait for gameOver event
            } else {
                setGamePhase('roundResult'); // Intermediate result
            }
        });

        socket.on('nextRound', ({ room, theme: newTheme }) => {
            setRoom(room);
            setTheme(newTheme);
            setGamePhase('playing');
        });

        socket.on('gameOver', ({ winner, impostorId, theme: revealedTheme, clues }) => {
            setGamePhase('results');
            setTheme(revealedTheme);
            setRoom(prev => ({
                ...prev,
                winner,
                impostorId,
                theme: revealedTheme,
                allClues: clues
            }));
        });

        socket.on('error', ({ message }) => {
            alert(message);
        });

        return () => {
            socket.off('playerJoined');
            socket.off('playerLeft');
            socket.off('gameStarted');
            socket.off('clueAdded');
            socket.off('votingPhase');
            socket.off('voteResult');
            socket.off('nextRound');
            socket.off('gameOver');
            socket.off('error');
        };
    }, [socket]);

    if (!socket || !room) {
        return (
            <div className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
                <h2>Conectando a la sala {roomId}...</h2>
            </div>
        );
    }

    return (
        <div className="container" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
            {gamePhase === 'waiting' && (
                <WaitingRoom socket={socket} room={room} roomId={roomId} />
            )}

            {gamePhase === 'playing' && (
                <GameBoard
                    socket={socket}
                    room={room}
                    roomId={roomId}
                    isImpostor={isImpostor}
                    theme={theme}
                />
            )}

            {gamePhase === 'voting' && (
                <VotingPhase
                    socket={socket}
                    room={room}
                    roomId={roomId}
                />
            )}

            {gamePhase === 'roundResult' && voteResult && (
                <RoundResult
                    socket={socket}
                    room={room}
                    roomId={roomId}
                    voteResult={voteResult}
                />
            )}

            {gamePhase === 'results' && (
                <Results
                    socket={socket}
                    room={room}
                    navigate={navigate}
                />
            )}
        </div>
    );
}
