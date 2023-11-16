// contacts_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('contacts', function (table) {
      table.bigIncrements('id').primary().notNullable();
      table.datetime('createdAt').defaultTo(knex.fn.now());
      table.datetime('updatedAt').defaultTo(knex.fn.now());
      table.string('firstName', 100).notNullable();
      table.string('lastName', 100).notNullable();
      table.string('email', 50).notNullable().unique();
      table.string('description', 255).notNullable();

      // Indexes
      table.index('id');
      table.index('email');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('contacts');
};
