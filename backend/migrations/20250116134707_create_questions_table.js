/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('questions', (table) => {
      table.increments('id').primary(); // ID auto-incrémenté
      table.text('question').notNullable(); // Question
      table.string('reponse1').notNullable(); // Réponse 1
      table.string('reponse2').notNullable(); // Réponse 2
      table.string('reponse3').notNullable(); // Réponse 3
      table.string('reponse4').notNullable(); // Réponse 4
      table.integer('bonne_reponse').notNullable(); // Numéro de la bonne réponse (1 à 4)
    });
  };
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('questions');
  };
  

