"use client";

import React, { useState } from "react";
import axios from "axios";

export default function Page() {
  const [numQuestions, setNumQuestions] = useState<number>(0);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<string[]>([]); // Liste des joueurs
  const [playerName, setPlayerName] = useState<string>(""); // Nom du joueur

  // Fonction pour créer une session
  const createSession = async () => {
    if (numQuestions <= 0) {
      alert("Please enter a valid number of questions.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/sessions", {
        num_questions: numQuestions,
      });

      setSessionCode(response.data.code); // Code de la session renvoyé par le backend
      setPlayers([]); // Réinitialise les joueurs pour la nouvelle session
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    }
  };

  // Fonction pour rejoindre une session
  const joinSession = async () => {
    if (!sessionCode || playerName.trim() === "") {
      alert("Please enter a valid session code and player name.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/sessions/${sessionCode}/join`,
        {
          player_name: playerName,
        }
      );

      setPlayers(response.data.session.players); // Met à jour la liste des joueurs
      setPlayerName(""); // Réinitialise le champ du nom du joueur
    } catch (error) {
      console.error("Error joining session:", error);
      alert("Failed to join session. Please try again.");
    }
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>Trivia Game</h1>

      {/* Formulaire pour créer une session */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Create a Session</h2>
        <label>
          Number of Questions:
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button
          onClick={createSession}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create Session
        </button>
      </div>

      {/* Affichage du code de session */}
      {sessionCode && (
        <div style={{ marginTop: "20px" }}>
          <h3>Session Created</h3>
          <p>
            Session Code: <strong>{sessionCode}</strong>
          </p>
          <p>Players in the session:</p>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Formulaire pour rejoindre une session */}
      {sessionCode && (
        <div style={{ marginTop: "20px" }}>
          <h3>Join the Session</h3>
          <label>
            Your Name:
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={{ marginLeft: "10px" }}
            />
          </label>
          <button
            onClick={joinSession}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Join Session
          </button>
        </div>
      )}
    </main>
  );
}
