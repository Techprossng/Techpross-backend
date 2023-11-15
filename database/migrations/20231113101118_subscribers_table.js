/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('subscribers', function (table) {
            table.bigIncrements('id').primary().notNullable();
            table.string('email', 128).unique().notNullable();
            table.index('id');
            table.index('email');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('subscribers');
};
