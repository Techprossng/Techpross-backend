/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('payers', (table) => {
            table.bigIncrements('id').primary().notNullable();
            table.datetime('createdAt').defaultTo(knex.fn.now());
            table.datetime('updatedAt').defaultTo(knex.fn.now());
            table.string('firstName', 100).notNullable();
            table.string('lastName', 100).notNullable();
            table.string('email', 128).unique().notNullable();
            table.string('course', 128).notNullable();
            table.boolean('isPaid').defaultTo(false);
            table.string('payerRRR', 128).nullable();

            // Indexes
            table.index('email');
            table.index('id');
        });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('payers');
};
