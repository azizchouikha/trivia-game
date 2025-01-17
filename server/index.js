const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { generateSessionCode } = require('./utils');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Stockage des sessions en mémoire
const gameSessions = new Map();

io.on('connection', (socket) => {
  // Créer une nouvelle session
  socket.on('createSession', async ({ numberOfQuestions }) => {
    const sessionCode = generateSessionCode();
    const questions = await getRandomQuestions(numberOfQuestions);
    
    gameSessions.set(sessionCode, {
      host: socket.id,
      players: [],
      questions,
      currentQuestion: 0,
      scores: {},
      status: 'waiting'
    });

    socket.join(sessionCode);
    socket.emit('sessionCreated', { sessionCode });
  });

  // Rejoindre une session
  socket.on('joinSession', ({ sessionCode, username }) => {
    const session = gameSessions.get(sessionCode);
    if (!session) {
      socket.emit('error', { message: 'Session introuvable' });
      return;
    }

    session.players.push({
      id: socket.id,
      username,
      score: 0
    });

    socket.join(sessionCode);
    io.to(sessionCode).emit('playerJoined', { players: session.players });
  });

  // Démarrer le jeu
  socket.on('startGame', ({ sessionCode }) => {
    const session = gameSessions.get(sessionCode);
    if (session && session.host === socket.id) {
      session.status = 'playing';
      sendNextQuestion(sessionCode);
    }
  });

  // Réception d'une réponse
  socket.on('submitAnswer', ({ sessionCode, answer, timestamp }) => {
    handleAnswer(sessionCode, socket.id, answer, timestamp);
  });
});

function calculateScore(timeElapsed) {
  if (timeElapsed <= 5000) return 10;
  if (timeElapsed <= 10000) return 5;
  return 2;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 