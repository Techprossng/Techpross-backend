// courses_table.js

const instructors = require('./20231109103300_instructors_table');


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('courses', function(table) {
      table.bigint('id').primary().notNullable();
      table.string('name', 100).notNullable();
      table.string('description', 256).notNullable();
      table.enum('course_level', ['Beginner', 'Advanced']).notNullable();
      table.bigint('instructor_id');
      table.integer('price');
      table.foreign('instructor_id').references('instructors.id').onDelete('CASCADE');
      table.index('id');
      table.index('instructor_id', 'instructor_id_index');
    })
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('courses')
};
