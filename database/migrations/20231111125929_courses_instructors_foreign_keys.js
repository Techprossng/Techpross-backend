// courses_instructors_foreign_keys.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('courses', function (table) {
        table.foreign('instructorId').references('instructors.id').onDelete('CASCADE');
    }).then(() => {
        return knex.schema.table('instructors', function (table) {
            table.foreign('courseId').references('courses.id').onDelete('CASCADE');
        });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table('courses', function (table) {
        table.dropForeign('instructorId');
    }).then(() => {
        return knex.schema.table('instructors', function (table) {
            table.dropForeign('courseId');
        });
    });
};
