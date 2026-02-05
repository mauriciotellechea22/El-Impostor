import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameManager } from './game/GameManager.js';
import { getRandomTheme, getCategories, saveGame } from './database/db.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

const gameManager = new GameManager();

// Middleware
app.use(cors());
app.use(express.json());

// REST API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'El Impostor Server Running' });
});

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await getCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Socket.IO Events
io.on('connection', (socket) => {
    console.log(`✅ Player connected: ${socket.id}`);

    // Create room
    socket.on('createRoom', ({ playerName, roomId }) => {
        try {
            const room = gameManager.createRoom(roomId, socket.id, playerName);
            socket.join(roomId);

            socket.emit('roomCreated', {
                roomId,
                room: sanitizeRoom(room, socket.id)
            });

            console.log(`🎮 Room created: ${roomId} by ${playerName}`);
        } catch (error) {
            socket.emit('error', { message: 'Failed to create room' });
        }
    });

    // Join room
    socket.on('joinRoom', ({ playerName, roomId }) => {
        try {
            const room = gameManager.joinRoom(roomId, socket.id, playerName);

            if (!room) {
                socket.emit('error', { message: 'Room not found or game already started' });
                return;
            }

            socket.join(roomId);

            // Notify all players in room
            io.to(roomId).emit('playerJoined', {
                player: { id: socket.id, name: playerName },
                room: sanitizeRoom(room, socket.id)
            });

            console.log(`👤 ${playerName} joined room ${roomId}`);
        } catch (error) {
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    // Start game
    socket.on('startGame', async ({ roomId }) => {
        try {
            const room = gameManager.getRoom(roomId);

            if (!room || room.host !== socket.id) {
                socket.emit('error', { message: 'Only host can start game' });
                return;
            }

            if (room.players.length < 3) {
                socket.emit('error', { message: 'Need at least 3 players' });
                return;
            }

            // Get random theme
            const theme = await getRandomTheme();
            const startedRoom = gameManager.startGame(roomId, theme);

            if (!startedRoom) {
                socket.emit('error', { message: 'Failed to start game' });
                return;
            }

            // Send different data to impostor vs others
            startedRoom.players.forEach((player) => {
                const playerSocket = io.sockets.sockets.get(player.id);
                if (playerSocket) {
                    playerSocket.emit('gameStarted', {
                        room: sanitizeRoom(startedRoom, player.id),
                        isImpostor: player.id === startedRoom.impostorId,
                        theme: player.id === startedRoom.impostorId ? null : theme
                    });
                }
            });

            console.log(`🎲 Game started in room ${roomId} - Theme: ${theme.name}`);
        } catch (error) {
            console.error('Start game error:', error);
            socket.emit('error', { message: 'Failed to start game' });
        }
    });

    // Submit clue
    socket.on('submitClue', ({ roomId, clue }) => {
        try {
            const room = gameManager.addClue(roomId, socket.id, clue);

            if (!room) {
                socket.emit('error', { message: 'Invalid turn or game state' });
                return;
            }

            // Broadcast new clue to all players
            io.to(roomId).emit('clueAdded', {
                clue: room.clues[room.clues.length - 1],
                room: sanitizeRoomForAll(room)
            });

            // Check if voting phase
            if (room.status === 'voting') {
                io.to(roomId).emit('votingPhase', {
                    room: sanitizeRoomForAll(room),
                    alivePlayers: gameManager.getAlivePlayers(room)
                });
            }
        } catch (error) {
            socket.emit('error', { message: 'Failed to submit clue' });
        }
    });

    // Submit vote
    socket.on('submitVote', ({ roomId, targetId }) => {
        try {
            const result = gameManager.submitVote(roomId, socket.id, targetId);

            if (!result) {
                socket.emit('error', { message: 'Invalid vote' });
                return;
            }

            const { room, voteResult, winner, gameOver } = result;

            // If voting complete
            if (voteResult) {
                io.to(roomId).emit('voteResult', {
                    ...voteResult,
                    room: sanitizeRoomForAll(room)
                });

                if (gameOver) {
                    // Reveal impostor and theme
                    io.to(roomId).emit('gameOver', {
                        winner,
                        impostorId: room.impostorId,
                        theme: room.theme,
                        clues: room.clues
                    });

                    // Save game to database
                    saveGame({
                        theme_id: room.theme.id,
                        players: room.players.map(p => p.name),
                        impostor_player: room.players.find(p => p.id === room.impostorId)?.name,
                        winner,
                        rounds: room.currentRound,
                        clues: room.clues
                    });

                    console.log(`🏆 Game over in room ${roomId} - Winner: ${winner}`);
                } else {
                    // Continue to next round
                    setTimeout(() => {
                        const currentPlayer = gameManager.getCurrentPlayer(room);
                        io.to(roomId).emit('nextRound', {
                            room: sanitizeRoomForAll(room),
                            currentPlayer
                        });
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('Vote error:', error);
            socket.emit('error', { message: 'Failed to submit vote' });
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`❌ Player disconnected: ${socket.id}`);

        // Find and update rooms
        gameManager.rooms.forEach((room, roomId) => {
            const updatedRoom = gameManager.removePlayer(roomId, socket.id);
            if (updatedRoom) {
                io.to(roomId).emit('playerLeft', {
                    playerId: socket.id,
                    room: sanitizeRoomForAll(updatedRoom)
                });
            }
        });
    });
});

// Helper function to sanitize room data for client
function sanitizeRoom(room, playerId) {
    return {
        id: room.id,
        players: room.players,
        status: room.status,
        isHost: room.host === playerId,
        currentRound: room.currentRound,
        currentTurnIndex: room.currentTurnIndex,
        clues: room.clues,
        theme: room.theme,
        amIImpostor: room.impostorId === playerId
    };
}

function sanitizeRoomForAll(room) {
    return {
        id: room.id,
        players: room.players,
        status: room.status,
        currentRound: room.currentRound,
        currentTurnIndex: room.currentTurnIndex,
        clues: room.clues
    };
}

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
