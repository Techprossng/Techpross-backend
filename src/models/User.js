const { db, TABLES } = require('../db');
const { Util } = require('../utils');


/**
 * User class is defined here. It contains the actions that can be
 * performed on a row in the database `users` table
 */

class User {
    static async createUser(userData) {
        // get user data and hash password
        const { firstName, lastName, password, email } = userData;
        const returnFields = ['id', 'first_name', 'last_name', 'email'];

        try {
            const hash = await Util.hashPassword(password);
            const data = {
                first_name: firstName,
                last_name: lastName,
                password: hash,
                email
            };
            // insert the user data and returns defined data
            const [returnedData] = await db(TABLES.USERS)
                .insert({ ...data }, returnFields)
            // .returning(['id', 'first_name', 'last_name', 'email']);

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
            console.log(user);
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

    static async updateUser(userData, userId) {
        // define expected keys
        const expectedKeys = [
            'first_name', 'last_name', 'bio',
        ]
        const keysToUpdate = expectedKeys.filter((key) => userData[key] !== undefined);
        const dataToUpdate = {};
        for (const [key, value] of Object.entries(userData)) {
            if (keysToUpdate.indexOf(key) !== -1) {
                dataToUpdate.key = value
            }
        }
        try {
            const [updatedData] = await db(TABLES.USERS)
                .where({ id: userId })
                .update({ ...dataToUpdate })
                .returning(['id', ...keysToUpdate]);

            return updatedData;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;