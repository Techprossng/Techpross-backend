//users_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.bigint('id').primary().notNullable();
      table.string('first_name', 100).notNullable();
      table.string('last_name', 100).notNullable();
      table.string('email', 128).unique().notNullable();
      table.string('password', 256).notNullable();
      table.string('phone_number', 50);
      table.string('bio', 256);
      table.string('country', 50);
      table.index('email');
      table.index('id');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users');
};
