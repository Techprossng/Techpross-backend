// users_courses_table.js

const users = require('./20231109103234_users_table');
const courses = require('./20231109103424_courses_table');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users_courses', function (table) {
      table.bigInteger('userId').notNullable();
      table.bigInteger('courseId').notNullable();
      table.datetime('dateEnrolled').notNullable().defaultTo(knex.fn.now());
      table.primary(['userId', 'courseId']);
      table.foreign('userId').references('users.id').onDelete('CASCADE');
      table.foreign('courseId').references('courses.id').onDelete('CASCADE');

      // Indexes
      table.index('userId', 'userId_index');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users_courses');
};

