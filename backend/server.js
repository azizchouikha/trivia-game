const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import de Knex

const app = express();
app.use(cors());
app.use(express.json());

// Stockage des sessions en mémoire
const sessions = {};

// Fonction pour générer un code unique
const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

// Route de test
app.get('/', (req, res) => {
    res.send('Trivia Game Backend is running!');
});

// Récupérer toutes les questions
app.get('/questions', async (req, res) => {
    try {
        const questions = await db('questions').select('*');
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch questions' });
    }
});

// Créer une session
app.post('/sessions', (req, res) => {
    const { num_questions } = req.body;

    if (!num_questions || num_questions <= 0) {
        return res.status(400).json({ message: 'Number of questions must be provided and greater than 0' });
    }

    // Générer un code unique pour la session
    let code;
    do {
        code = generateCode();
    } while (sessions[code]); // Vérifier que le code est unique

    // Enregistrer la session en mémoire
    sessions[code] = {
        code,
        num_questions,
        players: [], // Liste des joueurs
        is_active: true, // État de la session
    };

    res.status(201).json({ message: 'Session created', code, session: sessions[code] });
});

// Rejoindre une session
app.post('/sessions/:code/join', (req, res) => {
    const { code } = req.params;
    const { player_name } = req.body;

    if (!player_name) {
        return res.status(400).json({ message: 'Player name is required' });
    }

    const session = sessions[code];
    if (!session) {
        return res.status(404).json({ message: 'Session not found' });
    }

    // Vérifier que le joueur n'existe pas déjà
    if (session.players.includes(player_name)) {
        return res.status(400).json({ message: 'Player already joined' });
    }

    // Ajouter le joueur à la session
    session.players.push(player_name);
    res.status(200).json({ message: 'Player joined', session });
});

// Récupérer une session
app.get('/sessions/:code', (req, res) => {
    const { code } = req.params;
    const session = sessions[code];

    if (!session) {
        return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
