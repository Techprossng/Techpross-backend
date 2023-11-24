// courses_table.js


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('courses', function (table) {
      table.bigIncrements('id').primary().notNullable();
      table.string('name', 100).notNullable();
      table.string('description', 256).notNullable();
      table.integer('price').notNullable();
      table.bigInteger('instructorId').unsigned().unique().nullable();

      // Indexes
      table.index('id');
      table.index('instructorId', 'instructorId_index');
    })
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('courses')
};
