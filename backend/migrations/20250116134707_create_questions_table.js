const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sessionManager = require('./sessions/sessionManager');

app.use(bodyParser.json());

// Validation du code de session et du pseudo
app.post('/api/join', (req, res) => {
  const { sessionCode, pseudo } = req.body;

  if (!sessionCode || !pseudo) {
    return res.status(400).json({ success: false, message: 'Code de session et pseudo requis.' });
  }

  const session = sessionManager.getSession(sessionCode);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Session introuvable.' });
  }

  // Ajouter le joueur à la session
  session.players.push(pseudo);

  return res.json({ success: true, message: 'Rejoint la session.', session });
});

// lancement de serveur 
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend actif sur http://localhost:${PORT}`);
});
