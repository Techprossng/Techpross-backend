// instructors_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("instructors", function (table) {
    table.bigIncrements("id").primary().notNullable();
    table.string("name", 256).notNullable();
    table.string("email", 128).unique().notNullable();
    table.string("phone", 12).unique().nullable();
    table.bigInteger("courseId").unsigned().unique().nullable();

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
