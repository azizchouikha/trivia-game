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
    }
  ]);
};
