// instructors_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('instructors', function (table) {
      table.bigIncrements('id').primary().notNullable();
      table.datetime('createdAt').defaultTo(knex.fn.now());
      table.datetime('updatedAt').defaultTo(knex.fn.now());
      table.string('name', 256).notNullable();
      table.string('email', 128).unique().notNullable();
      table.bigInteger('courseId').unsigned().unique().notNullable();

    // Indexes
    table.index("courseId", "courseId_index");
    table.index("id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("instructors");
};
