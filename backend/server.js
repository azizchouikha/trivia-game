const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import de Knex

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
