// @ts-check
const session = require('express-session'); // session handler
// knex session store
const KnexSessionStore = require('connect-session-knex')(session);
// knex database config
const { db } = require('./db');
const { v4: uuidv4 } = require('uuid');
require('dotenv/config');


/**
 * ### SessionAuth class
 * This class is responsible for managing sessions for
 * user's access in login and logout endpoints. The `response.cookie`
 * method is a good solution for tracking user's sessions but provides
 * and unsafe exposure of cookie data to the client.
 */
class SessionAuth {

    // environment and secret
    static ENV = process.env.NODE_ENV || 'production';
    static #SESSION_SECRET = process.env.SESSION_SECRET || 'prod_secret';

    /**
     * @static
     * This is a private static method
     * The session store uses the knex instance from `knexfile.js`
     * and automatically creates a `sessions` table for the app.
     * The table contains the columns:
     * - `sid`: unique session id for a user session, VARCHAR(255) 
     * - `sess`: The session object. JSON
     * - `expires`: The expiry date of the session: DATETIME
     */
    static #sessionStore() {
        const store = new KnexSessionStore({
            knex: db, // the knex database config instance
            tablename: 'sessions'
        });
        return store;
    }

    /**
     * set up the session object and return for the app to use
     */
    static getSessionInstance() {
        const sessionObj = session({
            name: 'session_TP',
            secret: this.ENV === 'production' ? // secret key
                SessionAuth.#SESSION_SECRET :
                'test_secret',
            // session store
            store: SessionAuth.#sessionStore(),
            // uninitialized: new and unmodified sessions
            saveUninitialized: false,
            resave: true,
            cookie: {
                httpOnly: true,
                secure: this.ENV === 'production' ? true : undefined,
                maxAge: 600 * 1000 // 10 minutes
            },
            // generate unique session ids
            genid: (req) => `${uuidv4().toString()}`

        });
        return sessionObj;
    }
    /**
     * destroys a session or removes a session from the store
     * @param {session.Session} session
     * @returns {Promise<boolean>}
     */
    static async destroySession(session) {
        return new Promise((resolve, reject) => {
            session.destroy((error) => {
                if (error) {
                    reject(false);
                }
                resolve(true);
            });
        });
    }

    /**
     * gets a session from the store database
     * @param {string} sessionId 
     * @returns {Promise<>}
     */
    static async getSession(sessionId) {
        return new Promise((resolve, reject) => {
            SessionAuth.#sessionStore().get(sessionId, (error, session) => {
                if (error) {
                    reject(new Error('Error getting session'));
                }
                if (!session) {
                    return resolve(false)
                }
                return resolve(session);
            })
        })
    }

    /**
     * sets a session in the store database
     * @param {string} sessionId 
     * @param {session.SessionData} session 
     * @returns {Promise<boolean>}
     * @throws {Error} if an error was encountered
     */
    static async setSession(sessionId, session) {
        return new Promise((resolve, reject) => {
            SessionAuth.#sessionStore().set(sessionId, session, (error) => {
                if (error) {
                    reject(new Error('Error setting session'));
                }
                return resolve(true);
            });
        });
    }

    /**
     * saves a session in the store database 
     * @param {session.Session} session 
     * @returns {Promise<boolean>}
     * @throws {Error} if an error was encountered
     */
    static async saveSession(session) {
        return new Promise((resolve, reject) => {
            session.save((error) => {
                if (error) {
                    reject(new Error('Error saving session'));
                }
                return resolve(true);
            });
        });
    }

    /**
     * updates a session data in the store database by resetting
     * the idle timer
     * @param {string} sessionId 
     * @param {session.SessionData} session 
     * @returns {Promise<boolean>}
     * @throws {Error} if an error was encountered
     */
    static async touchSession(sessionId, session) {
        return new Promise((resolve, reject) => {
            SessionAuth.#sessionStore().touch?.(sessionId, session, (error) => {
                if (error) {
                    reject(new Error('Error setting session'));
                }
                return resolve(true);
            })
        })
    }
}

// const sessionAuth = new SessionAuth();
module.exports = SessionAuth;