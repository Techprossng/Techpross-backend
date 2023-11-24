require('dotenv').config();

/**
 * CONFIGURATION FOR DATABASE ACCESS. DO NOT EDIT!!
 */

// define database config
const ENV = process.env.NODE_ENV;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: ENV === 'test' ? process.env.TEST_DB : process.env.DB_NAME
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  test: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      ...dbConfig
    },
    migrations: { directory: './database/migrations' }
  },

  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      ...dbConfig
    },
    migrations: { directory: './database/migrations' }
  },

  staging: {
    client: 'mysql',
    connection: {
      ...dbConfig
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'techpros_migrations',
      directory: './database/migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      ...dbConfig
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'techpros_migrations',
      directory: './database/migrations'
    }
  }

};
