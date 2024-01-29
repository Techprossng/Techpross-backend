// @ts-check
/** db.js exposes a connection pool to manage database interactions.
 * This is to improve maintainability and debugging. Instead of initializing
 * the knex module in every file, a singular unit is defined here
*/
const knex = require('knex');
const knexConfig = require('../knexfile');

// define database export
let configExport = knexConfig.production;
const ENV = process.env.NODE_ENV;
let dropStatement = `DROP TABLE IF EXISTS users, courses, users_courses,
 instructors, modules, subscribers, contacts,
  knex_migrations, knex_migrations_lock`;

if (ENV === 'test') {
    configExport = knexConfig.test;
    // drop all database tables for test
    knex(configExport)
        .raw(dropStatement)
        .then(() => { return; })
} else if (ENV === 'development') {
    configExport === knexConfig.development;
}


exports.db = knex(configExport);

// single management of database tables reference
exports.TABLES = {
    USERS: 'users',
    COURSES: 'courses',
    INSTRUCTORS: 'instructors',
    SUBSCRIBERS: 'subscribers',
    CONTACTS: 'contacts',
    PAYERS: 'payers'
};