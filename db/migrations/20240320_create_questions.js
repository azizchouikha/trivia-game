exports.up = function(knex) {
  return knex.schema.createTable('questions', (table) => {
    table.increments('id').primary();
    table.text('question').notNullable();
    table.string('reponse1').notNullable();
    table.string('reponse2').notNullable();
    table.string('reponse3').notNullable();
    table.string('reponse4').notNullable();
    table.integer('bonne_reponse').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('questions');
}; 