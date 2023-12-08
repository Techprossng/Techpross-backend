// users_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.bigIncrements('id').primary().notNullable();
      table.datetime('createdAt').defaultTo(knex.fn.now());
      table.datetime('updatedAt').defaultTo(knex.fn.now());
      table.string('firstName', 100).notNullable();
      table.string('lastName', 100).notNullable();
      table.string('email', 128).unique().notNullable();
      table.string('password', 256).notNullable();
      table.string('phoneNumber', 50);
      table.string('bio', 256);
      table.boolean('isVerified').defaultTo(false);
      table.boolean('isAdmin').defaultTo(false);
      table.string('country', 50);

      // Indexes
      table.index('email');
      table.index('id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users');
};
