/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('questions').del();

  // Inserts seed entries
  await knex('questions').insert([
    {
      question: 'What is the capital of France?',
      reponse1: 'Berlin',
      reponse2: 'Madrid',
      reponse3: 'Paris',
      reponse4: 'Rome',
      bonne_reponse: 3
    },
    {
      question: 'What is 2 + 2?',
      reponse1: '3',
      reponse2: '4',
      reponse3: '5',
      reponse4: '6',
      bonne_reponse: 2
    },
    {
      question: 'Which planet is known as the Red Planet?',
      reponse1: 'Earth',
      reponse2: 'Mars',
      reponse3: 'Jupiter',
      reponse4: 'Saturn',
      bonne_reponse: 2
    },
    {
      question: 'Who wrote "To Kill a Mockingbird"?',
      reponse1: 'Harper Lee',
      reponse2: 'Mark Twain',
      reponse3: 'Ernest Hemingway',
      reponse4: 'F. Scott Fitzgerald',
      bonne_reponse: 1
    },
    {
      question: 'What is the boiling point of water at sea level?',
      reponse1: '90°C',
      reponse2: '100°C',
      reponse3: '110°C',
      reponse4: '120°C',
      bonne_reponse: 2
    },
    {
      question: 'Which gas do plants absorb from the atmosphere?',
      reponse1: 'Oxygen',
      reponse2: 'Carbon Dioxide',
      reponse3: 'Nitrogen',
      reponse4: 'Hydrogen',
      bonne_reponse: 2
    },
    {
      question: 'Which element has the chemical symbol O?',
      reponse1: 'Gold',
      reponse2: 'Oxygen',
      reponse3: 'Osmium',
      reponse4: 'Oganesson',
      bonne_reponse: 2
    },
    {
      question: 'What is the largest mammal in the world?',
      reponse1: 'Elephant',
      reponse2: 'Blue Whale',
      reponse3: 'Giraffe',
      reponse4: 'Great White Shark',
      bonne_reponse: 2
    },
    {
      question: 'What is the square root of 64?',
      reponse1: '6',
      reponse2: '7',
      reponse3: '8',
      reponse4: '9',
      bonne_reponse: 3
    },
    {
      question: 'Who painted the Mona Lisa?',
      reponse1: 'Michelangelo',
      reponse2: 'Leonardo da Vinci',
      reponse3: 'Raphael',
      reponse4: 'Donatello',
      bonne_reponse: 2
    },
    {
      question: 'What is the hardest natural substance on Earth?',
      reponse1: 'Gold',
      reponse2: 'Iron',
      reponse3: 'Diamond',
      reponse4: 'Quartz',
      bonne_reponse: 3
    },
    {
      question: 'Which country is known as the Land of the Rising Sun?',
      reponse1: 'China',
      reponse2: 'Japan',
      reponse3: 'South Korea',
      reponse4: 'Thailand',
      bonne_reponse: 2
    },
    {
      question: 'What is the chemical formula for water?',
      reponse1: 'H2O',
      reponse2: 'O2',
      reponse3: 'CO2',
      reponse4: 'H2O2',
      bonne_reponse: 1
    },
    {
      question: 'How many continents are there on Earth?',
      reponse1: '5',
      reponse2: '6',
      reponse3: '7',
      reponse4: '8',
      bonne_reponse: 3
    },
    {
      question: 'Who developed the theory of relativity?',
      reponse1: 'Isaac Newton',
      reponse2: 'Albert Einstein',
      reponse3: 'Galileo Galilei',
      reponse4: 'Marie Curie',
      bonne_reponse: 2
    },
    {
      question: 'Which planet is the hottest in the solar system?',
      reponse1: 'Venus',
      reponse2: 'Mercury',
      reponse3: 'Mars',
      reponse4: 'Jupiter',
      bonne_reponse: 1
    },
    {
      question: 'What is the largest ocean on Earth?',
      reponse1: 'Atlantic Ocean',
      reponse2: 'Indian Ocean',
      reponse3: 'Pacific Ocean',
      reponse4: 'Arctic Ocean',
      bonne_reponse: 3
    },
    {
      question: 'Which organ in the human body is responsible for pumping blood?',
      reponse1: 'Brain',
      reponse2: 'Lungs',
      reponse3: 'Heart',
      reponse4: 'Liver',
      bonne_reponse: 3
    },
    {
      question: 'What is the smallest unit of life?',
      reponse1: 'Tissue',
      reponse2: 'Organ',
      reponse3: 'Cell',
      reponse4: 'Atom',
      bonne_reponse: 3
    },
    {
      question: 'How many legs does a spider have?',
      reponse1: '6',
      reponse2: '8',
      reponse3: '10',
      reponse4: '12',
      bonne_reponse: 2
    },
    {
      question: 'Which planet has rings around it?',
      reponse1: 'Earth',
      reponse2: 'Mars',
      reponse3: 'Saturn',
      reponse4: 'Venus',
      bonne_reponse: 3
    },
    {
      question: 'Who wrote "Romeo and Juliet"?',
      reponse1: 'Charles Dickens',
      reponse2: 'William Shakespeare',
      reponse3: 'Jane Austen',
      reponse4: 'Mark Twain',
      bonne_reponse: 2
    },
    {
      question: 'What is the largest internal organ in the human body?',
      reponse1: 'Heart',
      reponse2: 'Liver',
      reponse3: 'Lungs',
      reponse4: 'Kidney',
      bonne_reponse: 2
    },
    {
      question: 'Which animal is known as the King of the Jungle?',
      reponse1: 'Tiger',
      reponse2: 'Lion',
      reponse3: 'Elephant',
      reponse4: 'Bear',
      bonne_reponse: 2
    },
    {
      question: 'Which gas do humans exhale?',
      reponse1: 'Oxygen',
      reponse2: 'Nitrogen',
      reponse3: 'Carbon Dioxide',
      reponse4: 'Helium',
      bonne_reponse: 3
    },
    {
      question: 'Which country is famous for the Eiffel Tower?',
      reponse1: 'Germany',
      reponse2: 'Italy',
      reponse3: 'France',
      reponse4: 'Spain',
      bonne_reponse: 3
    },
    {
      question: 'Which instrument is known as the King of Instruments?',
      reponse1: 'Piano',
      reponse2: 'Violin',
      reponse3: 'Organ',
      reponse4: 'Guitar',
      bonne_reponse: 3
    },
    {
      question: 'What is the chemical symbol for gold?',
      reponse1: 'Ag',
      reponse2: 'Au',
      reponse3: 'Fe',
      reponse4: 'Pb',
      bonne_reponse: 2
    },
    {
      question: 'Which country invented pizza?',
      reponse1: 'France',
      reponse2: 'Greece',
      reponse3: 'Italy',
      reponse4: 'Spain',
      bonne_reponse: 3
    },
    {
      question: 'What is the capital of Japan?',
      reponse1: 'Beijing',
      reponse2: 'Seoul',
      reponse3: 'Bangkok',
      reponse4: 'Tokyo',
      bonne_reponse: 4
    }
  ]);
};
