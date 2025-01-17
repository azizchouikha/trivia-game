const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const db = require('./db');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());

// Stockage des sessions de jeu
const gameSessions = new Map();

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
    console.log('Un client s\'est connecté');

    // Création d'une session
    socket.on('createSession', ({ sessionCode, playerName }) => {
        const session = {
            code: sessionCode,
            host: socket.id,
            players: [{
                id: socket.id,
                name: playerName,
                isHost: true
            }],
            isPlaying: false
        };
        gameSessions.set(sessionCode, session);
        socket.join(sessionCode);
        io.to(sessionCode).emit('updatePlayers', session.players);
    });

    // Rejoindre une session
    socket.on('joinSession', ({ sessionCode, playerName }) => {
        const session = gameSessions.get(sessionCode);
        if (session && !session.isPlaying) {
            const newPlayer = {
                id: socket.id,
                name: playerName,
                isHost: false
            };
            session.players.push(newPlayer);
            socket.join(sessionCode);
            io.to(sessionCode).emit('updatePlayers', session.players);
        } else {
            socket.emit('error', 'Session non trouvée ou partie en cours');
        }
    });

    // Démarrer la partie
    socket.on('startGame', (sessionCode) => {
        const session = gameSessions.get(sessionCode);
        console.log('Starting game for session:', sessionCode); // Debug log
        console.log('Session found:', session); // Debug log
        console.log('Socket ID:', socket.id); // Debug log
        console.log('Host ID:', session?.host); // Debug log

        if (session && socket.id === session.host) {
            session.isPlaying = true;
            
            const gameQuestions = [
                {
                    id: 1,
                    question: "Quelle est la capitale de la France ?",
                    options: ["Londres", "Paris", "Berlin", "Madrid"],
                    correctAnswer: "Paris"
                },
                // ... autres questions ...
            ];

            session.questions = gameQuestions;
            
            // S'assurer que tous les clients dans la room reçoivent l'événement
            const roomClients = io.sockets.adapter.rooms.get(sessionCode);
            console.log('Clients in room:', roomClients); // Debug log

            io.in(sessionCode).emit('gameStarted', {
                questions: gameQuestions
            });
            
            console.log('Game started signal sent to room:', sessionCode);
        } else {
            console.log('Failed to start game - invalid session or not host');
        }
    });

    // Déconnexion
    socket.on('disconnect', () => {
        gameSessions.forEach((session, code) => {
            const playerIndex = session.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                session.players.splice(playerIndex, 1);
                if (session.players.length === 0) {
                    gameSessions.delete(code);
                } else if (socket.id === session.host) {
                    // Si l'hôte se déconnecte, le prochain joueur devient l'hôte
                    session.host = session.players[0].id;
                    session.players[0].isHost = true;
                }
                io.to(code).emit('updatePlayers', session.players);
            }
        });
    });
});

// Routes existantes
app.get('/', (req, res) => {
    res.send('Trivia Game Backend is running!');
});

app.get('/questions', async (req, res) => {
    try {
        const questions = await db('questions').select('*');
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch questions' });
    }
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
