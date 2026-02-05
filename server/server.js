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

// CORS configuration
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    credentials: true
};

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['*']
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true
});

const gameManager = new GameManager();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from React build
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// REST API Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'El Impostor Server Running',
        uptime: process.uptime(),
        cors: allowedOrigin
    });
});

app.get('/api/test-cors', (req, res) => {
    res.json({
        message: 'CORS is working!',
        origin: req.headers.origin,
        allowedOrigin: allowedOrigin
    });
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

// TEMPORARY: Setup database (visit this URL once to initialize)
app.get('/api/setup-db', async (req, res) => {
    try {
        const { pool } = await import('./database/db.js');
        const client = await pool.connect();

        // First create tables
        const schemaSQL = `
CREATE TABLE IF NOT EXISTS themes (
    id SERIAL PRIMARY KEY,
    category VARCHAR(20) NOT NULL CHECK (category IN ('jugador', 'club', 'estadio', 'partido', 'dt')),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
    hints JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    theme_id INTEGER REFERENCES themes(id),
    players JSONB NOT NULL,
    impostor_player VARCHAR(50),
    winner VARCHAR(20) CHECK (winner IN ('impostor', 'innocents')),
    rounds INTEGER DEFAULT 1,
    clues JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_themes_category ON themes(category);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);
        `;

        // Then insert data
        const seedSQL = `
INSERT INTO themes (category, name, description, difficulty, hints) VALUES
('jugador', 'Lionel Messi', 'Considerado uno de los mejores jugadores de la historia', 1, '["Argentina", "Barcelona", "8 Balones de Oro", "Qatar 2022", "PSG"]'),
('jugador', 'Diego Maradona', 'Leyenda argentina del fútbol mundial', 1, '["Argentina", "Napoli", "Mano de Dios", "México 86", "10"]'),
('jugador', 'Cristiano Ronaldo', 'Máximo goleador de la Champions League', 1, '["Portugal", "Real Madrid", "5 Champions", "CR7", "Manchester"]'),
('club', 'Real Madrid', 'Club más ganador de Europa', 1, '["España", "15 Champions", "Blanco", "Bernabéu", "Galácticos"]'),
('club', 'FC Barcelona', 'Más que un club', 1, '["España", "Camp Nou", "Azulgrana", "Messi", "Cataluña"]'),
('club', 'Boca Juniors', 'Pasión argentina', 1, '["Argentina", "Bombonera", "Azul y Oro", "Maradona", "Libertadores"]'),
('estadio', 'Camp Nou', 'Estadio más grande de Europa', 1, '["Barcelona", "99.000", "Azulgrana", "Messi", "España"]'),
('estadio', 'La Bombonera', 'La cancha que tiembla', 1, '["Buenos Aires", "Boca", "Verticalidad", "Argentina", "54.000"]'),
('partido', 'Argentina 3-3 Francia (Mundial 2022)', 'Final más épica del mundo', 1, '["Qatar", "Messi", "Mbappé", "Penales", "Lusail"]'),
('dt', 'Pep Guardiola', 'Maestro del tiki-taka', 2, '["Barcelona", "Bayern", "City", "Tiki-taka", "Calvo"]');
        `;

        try {
            await client.query(schemaSQL);
            await client.query(seedSQL);
            const result = await client.query('SELECT COUNT(*) FROM themes');

            res.json({
                success: true,
                message: `✅ Database ready with ${result.rows[0].count} themes!`,
                count: parseInt(result.rows[0].count)
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Setup error:', error);
        res.json({
            success: false,
            error: error.message,
            stack: error.stack
        });
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

            // Send personalized room data to each player
            room.players.forEach((player) => {
                const playerSocket = io.sockets.sockets.get(player.id);
                if (playerSocket) {
                    playerSocket.emit('playerJoined', {
                        player: { id: socket.id, name: playerName },
                        room: sanitizeRoom(room, player.id)
                    });
                }
            });

            console.log(`👤 ${playerName} joined room ${roomId}`);
        } catch (error) {
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    // Start game
    socket.on('startGame', async ({ roomId, totalRounds = 5 }) => {
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
            const startedRoom = gameManager.startGame(roomId, theme, totalRounds);

            if (!startedRoom) {
                socket.emit('error', { message: 'Failed to start game' });
                return;
            }

            // Send data to all players (impostor also sees theme now)
            startedRoom.players.forEach((player) => {
                const playerSocket = io.sockets.sockets.get(player.id);
                if (playerSocket) {
                    playerSocket.emit('gameStarted', {
                        room: sanitizeRoom(startedRoom, player.id),
                        isImpostor: player.id === startedRoom.impostorId,
                        theme: theme // Everyone sees the theme
                    });
                }
            });

            console.log(`🎲 Game started in room ${roomId} - Theme: ${theme.name} - ${totalRounds} rounds`);
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
                // Send vote result with gameOver flag to all players
                room.players.forEach((player) => {
                    const playerSocket = io.sockets.sockets.get(player.id);
                    if (playerSocket) {
                        playerSocket.emit('voteResult', {
                            ...voteResult,
                            room: sanitizeRoom(room, player.id),
                            gameOver: gameOver
                        });
                    }
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
                }
                // If not gameOver, wait for host to continue (no auto-continue)
            }
        } catch (error) {
            console.error('Vote error:', error);
            socket.emit('error', { message: 'Failed to submit vote' });
        }
    });

    // Continue to next round (host only)
    socket.on('continueToNextRound', async ({ roomId }) => {
        try {
            const room = gameManager.getRoom(roomId);

            if (!room || room.host !== socket.id) {
                socket.emit('error', { message: 'Only host can continue to next round' });
                return;
            }

            // Get new random theme for next round
            const newTheme = await getRandomTheme();
            room.theme = newTheme;

            const currentPlayer = gameManager.getCurrentPlayer(room);

            // Send new theme to all players
            room.players.forEach((player) => {
                const playerSocket = io.sockets.sockets.get(player.id);
                if (playerSocket) {
                    playerSocket.emit('nextRound', {
                        room: sanitizeRoom(room, player.id),
                        currentPlayer,
                        theme: newTheme // Everyone sees new theme
                    });
                }
            });

            console.log(`🔄 Round ${room.currentRound} in room ${roomId} - New theme: ${newTheme.name}`);
        } catch (error) {
            console.error('Continue round error:', error);
            socket.emit('error', { message: 'Failed to continue to next round' });
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

// Catch-all route - serve React app for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
    console.log(`📁 Serving frontend from: ${path.join(__dirname, '../client/dist')}`);
});
