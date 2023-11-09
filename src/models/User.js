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
            // insert the user data
            const [returnedData] = await db(TABLES.USERS)
                .returning(['id', 'first_name', 'last_name', 'email'])
                .insert({ ...data });
            console.log(returnedData);
            return returnedData;
        } catch (error) {
            throw new Error('User could not be created');
        }
    }
}