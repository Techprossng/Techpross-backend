/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable("users", function(table) {
      table.bigint("id").primary().notNullable();
      table.string("first_name", 100).notNullable();
      table.string("last_name", 100).notNullable();
      table.string("email", 128).unique().notNullable();
      table.string("password", 256).notNullable();
      table.string("phone_number", 50);
      table.string("bio", 256);
      table.string("country", 50);
    })
    .createTable("courses", function(table) {
      table.bigint("id").primary().notNullable();
      table.string("name", 100).notNullable();
      table.string("description", 256).notNullable();
      table.enum("course_level", ["Beginner", "Advanced"]).notNullable();
      table.bigint("instructor_id");
      table.integer("price");
      table.foreign("instructor_id").references("instructors.id").onDelete("CASCADE");
    })
    .createTable("modules", function(table) {
      table.bigint("id").primary().notNullable();
      table.string("name", 100).notNullable();
      table.string("description", 256).notNullable();
      table.bigint("course_id").unique();
      table.foreign("course_id").references("courses.id").onDelete("CASCADE");
    })
    .createTable("users_courses", function(table) {
      table.bigint("user_id").notNullable();
      table.bigint("course_id").notNullable();
      table.date("date_enrolled").notNullable().defaultTo(knex.fn.now());
      table.primary(["user_id", "course_id"]);
      table.foreign("user_id").references("users.id").onDelete("CASCADE");
      table.foreign("course_id").references("courses.id").onDelete("CASCADE");
    })
    .createTable("instructors", function(table) {
      table.bigint("id").primary().notNullable();
      table.string("name", 256).notNullable();
      table.string("email", 128).unique().notNullable();
    });  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("users_courses")
    .dropTableIfExists("modules")
    .dropTableIfExists("courses")
    .dropTableIfExists("instructors")
    .dropTableIfExists("users");
};
