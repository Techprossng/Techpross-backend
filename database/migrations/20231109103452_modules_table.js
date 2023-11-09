// modules_table.js

const courses = require('./courses_table');

/**
 * @pram { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('modules', function(table) {
      table.bigint('id').primary().notNullable();
      table.string('name', 100).notNullable();
      table.string('description', 256).notNullable();
      table.bigint('course_id');
      table.foreign('course_id').references('courses.id').onDelete('CASCADE');
      table.index('id');
      table.index('course_id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('modules');
};

