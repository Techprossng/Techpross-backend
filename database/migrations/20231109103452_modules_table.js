// modules_table.js

const courses = require('./20231109103424_courses_table');

/**
 * @pram { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('modules', function (table) {
      table.bigIncrements('id').primary().notNullable();
      table.datetime('createdAt').defaultTo(knex.fn.now());
      table.datetime('updatedAt').defaultTo(knex.fn.now());
      table.string('name', 100).notNullable();
      table.string('description', 256).notNullable();
      table.bigInteger('courseId').notNullable().unsigned();
      table.foreign('courseId').references('courses.id').onDelete('CASCADE');

      // Indexes
      table.index('id');
      table.index('courseId');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('modules');
};

