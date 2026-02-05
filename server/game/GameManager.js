// Game Manager - Core game logic for El Impostor

export class GameManager {
    constructor() {
        this.rooms = new Map(); // roomId -> GameRoom
    }

    createRoom(roomId, hostSocketId, hostName) {
        const room = {
            id: roomId,
            host: hostSocketId,
            players: [{ id: hostSocketId, name: hostName, isAlive: true, score: 0 }],
            status: 'waiting', // waiting, playing, voting, finished
            theme: null,
            impostorId: null,
            currentTurnIndex: 0,
            currentRound: 1,
            clues: [],
            votes: new Map(),
            eliminatedPlayers: [],
            startingPlayerIndex: 0,
        };

        this.rooms.set(roomId, room);
        return room;
    }

    joinRoom(roomId, socketId, playerName) {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        if (room.status !== 'waiting') return null;
        if (room.players.length >= 6) return null;

        room.players.push({
            id: socketId,
            name: playerName,
            isAlive: true,
            score: 0
        });

        return room;
    }

    startGame(roomId, theme, totalRounds = 5) {
        const room = this.rooms.get(roomId);
        if (!room || room.players.length < 3) return null;

        // Select random impostor
        const randomIndex = Math.floor(Math.random() * room.players.length);
        room.impostorId = room.players[randomIndex].id;

        room.theme = theme;
        room.status = 'playing';
        room.currentTurnIndex = 0; // Start from first player
        room.clues = [];
        room.totalRounds = totalRounds;
        room.maxRounds = totalRounds; // Store for win condition

        return room;
    }

    addClue(roomId, socketId, clue) {
        const room = this.rooms.get(roomId);
        if (!room || room.status !== 'playing') return null;

        const currentPlayer = this.getAlivePlayers(room)[room.currentTurnIndex];
        if (currentPlayer.id !== socketId) return null;

        room.clues.push({
            playerId: socketId,
            playerName: currentPlayer.name,
            clue: clue,
            round: room.currentRound
        });

        // Move to next turn
        this.nextTurn(room);

        return room;
    }

    nextTurn(room) {
        const alivePlayers = this.getAlivePlayers(room);
        room.currentTurnIndex++;

        // Check if round is complete
        if (room.currentTurnIndex >= alivePlayers.length) {
            room.currentTurnIndex = 0;
            room.status = 'voting';
        }
    }

    submitVote(roomId, voterId, targetId) {
        const room = this.rooms.get(roomId);
        if (!room || room.status !== 'voting') return null;

        room.votes.set(voterId, targetId);

        // Check if all alive players have voted
        const alivePlayers = this.getAlivePlayers(room);
        if (room.votes.size >= alivePlayers.length) {
            return this.processVotes(room);
        }

        return { room, votingComplete: false };
    }

    processVotes(room) {
        const voteCounts = new Map();

        // Count votes
        room.votes.forEach((targetId) => {
            voteCounts.set(targetId, (voteCounts.get(targetId) || 0) + 1);
        });

        // Find player with most votes
        let maxVotes = 0;
        let eliminatedId = null;

        voteCounts.forEach((count, playerId) => {
            if (count > maxVotes) {
                maxVotes = count;
                eliminatedId = playerId;
            }
        });

        // Eliminate player
        const player = room.players.find(p => p.id === eliminatedId);
        if (player) {
            player.isAlive = false;
            room.eliminatedPlayers.push(eliminatedId);
        }

        const voteResult = {
            eliminatedId,
            eliminatedName: player?.name,
            wasImpostor: eliminatedId === room.impostorId,
            voteCounts: Object.fromEntries(voteCounts)
        };

        // Check win conditions
        const winner = this.checkWinCondition(room);

        if (winner) {
            room.status = 'finished';
            return { room, voteResult, winner, gameOver: true };
        }

        // Continue to next round
        room.currentRound++;
        room.currentTurnIndex = 0;
        room.status = 'playing';
        room.votes.clear();

        return { room, voteResult, winner: null, gameOver: false };
    }

    checkWinCondition(room) {
        const alivePlayers = this.getAlivePlayers(room);

        // If impostor is eliminated, innocents win
        const impostorAlive = alivePlayers.some(p => p.id === room.impostorId);
        if (!impostorAlive) {
            return 'innocents';
        }

        // If max rounds reached and impostor is alive, impostor wins
        if (room.currentRound >= room.maxRounds) {
            return 'impostor';
        }

        // If only 2 players remain and impostor is alive, impostor wins
        if (alivePlayers.length <= 2) {
            return 'impostor';
        }

        return null;
    }

    getAlivePlayers(room) {
        return room.players.filter(p => p.isAlive);
    }

    getCurrentPlayer(room) {
        const alivePlayers = this.getAlivePlayers(room);
        return alivePlayers[room.currentTurnIndex];
    }

    getRoom(roomId) {
        return this.rooms.get(roomId);
    }

    removePlayer(roomId, socketId) {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        room.players = room.players.filter(p => p.id !== socketId);

        // If host left, assign new host
        if (room.host === socketId && room.players.length > 0) {
            room.host = room.players[0].id;
        }

        // Delete room if empty
        if (room.players.length === 0) {
            this.rooms.delete(roomId);
            return null;
        }

        return room;
    }

    deleteRoom(roomId) {
        this.rooms.delete(roomId);
    }
}
