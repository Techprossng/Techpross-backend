const knex = require('knex');
const { db, TABLES } = require('../db');
const { hashPassword } = require('../utils/password');


/**
 * User class is defined here. It contains the actions that can be
 * performed on a row in the database `users` table
 */

class User {
    static async createUser(userData) {
        // get user data and hash password
        const { firstName, lastName, password, email } = userData;

        try {
            const hash = await hashPassword(password);
            const data = {
                first_name: firstName,
                last_name: lastName,
                password: hash,
                email
            };
            // insert the user data and returns defined data
            const [returnedData] = await db(TABLES.USERS)
                .insert({ ...data })
                .returning(['id', 'first_name', 'last_name', 'email']);

            console.log(returnedData);
            return returnedData;

        } catch (error) {
            throw error;
        }
    }

    /** 
     * get a user by email
     */
    static async getUserByEmail(userEmail) {
        const selectFields = [
            'id', 'first_name', 'last_name', 'email', 'bio',
            'country', 'phone_number'
        ]
        try {
            const user = await db(TABLES.USERS)
                .select(...selectFields)
                .where({ email: userEmail }).first();

            return user;

        } catch (error) {
            throw error;
        }
    }

    /** 
     * get a user by id
     */
    static async getUserById(userId) {
        const selectFields = [
            'id', 'first_name', 'last_name', 'email', 'bio',
            'country', 'phone_number'
        ]
        try {
            const user = await db(TABLES.USERS)
                .select(...selectFields)
                .where({ id: userId }).first();

            return user;

        } catch (error) {
            throw new Error('Could not find user');
        }
    }
}

module.exports = User;