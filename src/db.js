/** db.js exposes a connection pool to manage database interactions.
 * This is to improve maintainability and debugging. Instead of initializing
 * the knex module in every file, a singular unit is defined here
*/
const knex = require('knex');
const knexConfig = require('../knexfile');

// define database export
exports.db = knex(knexConfig.development);

// single management of database tables reference
exports.TABLES = {
    USERS: 'users',
    COURSES: 'courses',
    INSTRUCTORS: 'instructors'
};