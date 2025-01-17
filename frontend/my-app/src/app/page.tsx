"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

type GameMode =
  | "menu"
  | "create"
  | "createSession"
  | "join"
  | "waiting"
  | "playing"
  | "finished";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Player {
  id: string;
  name: string;
  isHost: boolean;
}

let socket: Socket;

export default function Home() {
  const [gameMode, setGameMode] = useState<GameMode>("menu");
  const [sessionCode, setSessionCode] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "Quelle est la capitale de la France ?",
      options: ["Londres", "Paris", "Berlin", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      id: 2,
      question: "Quel est le plus grand océan du monde ?",
      options: ["Atlantique", "Indien", "Pacifique", "Arctique"],
      correctAnswer: "Pacifique",
    },
    {
      id: 3,
      question: "Qui a peint la Joconde ?",
      options: ["Van Gogh", "Michel-Ange", "Léonard de Vinci", "Picasso"],
      correctAnswer: "Léonard de Vinci",
    },
    {
      id: 4,
      question: "Quelle est la planète la plus proche du soleil ?",
      options: ["Venus", "Mars", "Mercure", "Jupiter"],
      correctAnswer: "Mercure",
    },
    {
      id: 5,
      question: "En quelle année a eu lieu la Révolution française ?",
      options: ["1789", "1792", "1799", "1801"],
      correctAnswer: "1789",
    },
    {
      id: 6,
      question: "Quel est l'élément chimique le plus abondant dans l'univers ?",
      options: ["Oxygène", "Carbone", "Hydrogène", "Hélium"],
      correctAnswer: "Hydrogène",
    },
    {
      id: 7,
      question: "Qui a écrit 'Les Misérables' ?",
      options: [
        "Émile Zola",
        "Victor Hugo",
        "Gustave Flaubert",
        "Albert Camus",
      ],
      correctAnswer: "Victor Hugo",
    },
    {
      id: 8,
      question: "Quelle est la plus haute montagne du monde ?",
      options: ["K2", "Mont Blanc", "Kilimandjaro", "Mont Everest"],
      correctAnswer: "Mont Everest",
    },
    {
      id: 9,
      question: "Quel est le plus grand pays du monde en superficie ?",
      options: ["États-Unis", "Chine", "Canada", "Russie"],
      correctAnswer: "Russie",
    },
    {
      id: 10,
      question: "Qui a découvert la pénicilline ?",
      options: [
        "Louis Pasteur",
        "Alexander Fleming",
        "Marie Curie",
        "Robert Koch",
      ],
      correctAnswer: "Alexander Fleming",
    },
    {
      id: 11,
      question: "Quel est l'organe le plus grand du corps humain ?",
      options: ["Le foie", "Les poumons", "La peau", "L'intestin"],
      correctAnswer: "La peau",
    },
    {
      id: 12,
      question: "Dans quelle ville se trouve la Tour Eiffel ?",
      options: ["Lyon", "Marseille", "Paris", "Toulouse"],
      correctAnswer: "Paris",
    },
    {
      id: 13,
      question: "Quel est le symbole chimique de l'or ?",
      options: ["Ag", "Fe", "Au", "Cu"],
      correctAnswer: "Au",
    },
    {
      id: 14,
      question: "Combien de continents y a-t-il sur Terre ?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
    },
    {
      id: 15,
      question: "Qui est l'auteur de 'Romeo et Juliette' ?",
      options: [
        "Charles Dickens",
        "William Shakespeare",
        "Jane Austen",
        "Mark Twain",
      ],
      correctAnswer: "William Shakespeare",
    },
  ]);
  const [generatedSessionCode, setGeneratedSessionCode] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);

  useEffect(() => {
    // Initialiser la connexion socket
    socket = io('http://localhost:4000');

    // Écouter les mises à jour des joueurs
    socket.on('updatePlayers', (updatedPlayers) => {
      console.log('Players updated:', updatedPlayers); // Debug log
      setPlayers(updatedPlayers);
      const isHostPlayer = updatedPlayers.find((p: Player) => p.id === socket.id)?.isHost;
      setIsHost(!!isHostPlayer);
    });

    // Écouter le démarrage du jeu
    socket.on('gameStarted', ({ questions: gameQuestions }) => {
      console.log('Game started event received'); // Debug log
      console.log('Received questions:', gameQuestions); // Debug log
      setQuestions(gameQuestions);
      setGameMode('playing');
      setTimeLeft(10);
      setCurrentQuestionIndex(0);
      setScore(0);
    });

    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id); // Debug log
    });

    // Écouter les erreurs
    socket.on('error', (message) => {
      console.error('Socket error:', message); // Debug log
      alert(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameMode === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameMode === "playing") {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(10);
      } else {
        setGameMode("finished");
      }
    }
    return () => clearInterval(timer);
  }, [gameMode, timeLeft, currentQuestionIndex, questions.length]);

  const handleAnswer = (selected: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = selected === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(10);
        setIsCorrect(null);
      } else {
        setGameMode("finished");
      }
    }, 1500);
  };

  const getButtonColor = (option: string) => {
    if (!selectedAnswer) {
      return "bg-white hover:bg-blue-50 border-2 border-blue-500 text-blue-500";
    }

    if (option === selectedAnswer) {
      if (option === questions[currentQuestionIndex].correctAnswer) {
        return "bg-green-500 text-white border-2 border-green-500";
      }
      return "bg-red-500 text-white border-2 border-red-500";
    }

    return "bg-white border-2 border-gray-300 text-gray-500";
  };

  const generateSessionCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedSessionCode(code);
    setSessionCode(code);
    setGameMode("createSession");
  };

  const createSession = async () => {
    socket.emit('createSession', {
      sessionCode: sessionCode,
      playerName: playerName
    });
    setGameMode("waiting");
  };

  const joinSession = async () => {
    socket.emit('joinSession', {
      sessionCode: sessionCode,
      playerName: playerName
    });
    setGameMode("waiting");
  };

  const startGame = () => {
    if (isHost) {
      console.log('Host starting game for session:', sessionCode); // Debug log
      socket.emit('startGame', sessionCode);
    }
  };

  const renderContent = () => {
    switch (gameMode) {
      case "menu":
        return (
          <div className="space-y-4 text-center">
            <button
              onClick={generateSessionCode}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Créer une partie
            </button>
            <button
              onClick={() => setGameMode("join")}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Rejoindre une partie
            </button>
          </div>
        );

      case "createSession":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Code de session:</h2>
              <p className="text-3xl font-mono bg-gray-100 p-4 rounded">
                {generatedSessionCode}
              </p>
            </div>
            <input
              type="text"
              placeholder="Votre pseudo"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center space-x-4">
              <label>Nombre de questions:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-24 p-2 border rounded"
              />
            </div>
            <button
              onClick={createSession}
              disabled={!playerName}
              className={`w-full font-bold py-2 px-4 rounded ${
                playerName
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
              }`}
            >
              Créer la session
            </button>
          </div>
        );

      case "join":
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Votre pseudo"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Code de session"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={joinSession}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Rejoindre la partie
            </button>
          </div>
        );

      case "waiting":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Code de session: {sessionCode}</h2>
              <p className="text-gray-600 mb-4">Partagez ce code avec vos amis pour qu'ils puissent rejoindre la partie</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-bold mb-2">Joueurs connectés:</h3>
              <div className="space-y-2">
                {players.map((player) => (
                  <div 
                    key={player.id} 
                    className="flex items-center justify-between bg-white p-3 rounded"
                  >
                    <span>{player.name}</span>
                    {player.isHost && (
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Hôte
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {isHost ? (
              <button
                onClick={() => setGameMode("playing")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Démarrer la partie
              </button>
            ) : (
              <div className="text-center text-gray-600 p-4 bg-gray-50 rounded">
                En attente que l'hôte démarre la partie...
              </div>
            )}
          </div>
        );

      case "playing":
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">Score: {score}</div>
              <div className="text-lg font-bold">Temps: {timeLeft}s</div>
              <div className="text-lg font-bold">
                Question {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                {currentQuestion.question}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => isCorrect === null && handleAnswer(option)}
                    disabled={isCorrect !== null}
                    className="w-full bg-white hover:bg-blue-50 border-2 border-blue-500 text-blue-500 font-bold py-3 px-6 rounded-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>

              {isCorrect !== null && (
                <div
                  className={`mt-4 p-3 rounded-lg text-center font-bold ${
                    isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isCorrect ? "Bonne réponse !" : "Mauvaise réponse !"}
                </div>
              )}
            </div>
          </div>
        );

      case "finished":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Partie terminée !</h2>
            <p className="text-xl">
              Score final : {score}/{questions.length}
            </p>
            <button
              onClick={() => {
                setGameMode("menu");
                setScore(0);
                setCurrentQuestionIndex(0);
                setTimeLeft(10);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Retour à l'accueil
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Trivia Game</h1>
        {renderContent()}
      </div>
    </main>
  );
}
