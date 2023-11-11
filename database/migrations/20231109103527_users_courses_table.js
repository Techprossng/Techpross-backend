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
      table.bigint('user_id').notNullable();
      table.bigint('course_id').notNullable();
      table.datetime('date_enrolled').notNullable().defaultTo(knex.fn.now());
      table.primary(['user_id', 'course_id']);
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.foreign('course_id').references('courses.id').onDelete('CASCADE');
      table.index('user_id', 'user_id_index');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users_courses');
};

