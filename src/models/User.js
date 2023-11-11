const { db, TABLES } = require('../db');
const { Util } = require('../utils');


/**
 * User class is defined here. It contains the actions that can be
 * performed on a row in the database `users` table
 */

class User {

    static selectFields = [
        'id', 'firstName', 'lastName', 'email', 'bio',
        'country', 'phoneNumber'
    ];
    static pageLimit = 20;

    static async createUser(userData) {
        // get user data and hash password
        const { firstName, lastName, password, email } = userData;

        try {
            const hash = await Util.hashPassword(password);
            const data = {
                firstName: firstName,
                lastName: lastName,
                password: hash,
                email
            };
            // insert the user data and returns defined data
            const [userId] = await db(TABLES.USERS)
                .insert({ ...data })

            delete data.password;
            return { userId, ...data };

        } catch (error) {
            throw error;
        }
    }

    /** 
     * get a user by email
     */
    static async getUserByEmail(userEmail) {
        try {
            const user = await db(TABLES.USERS)
                .select(...this.selectFields)
                .where({ email: userEmail }).first();
            return Object.assign({}, user);

        } catch (error) {
            throw error;
        }
    }

    /** 
     * get a user by id
     */
    static async getUserById(userId) {

        try {
            const user = await db(TABLES.USERS)
                .select(...this.selectFields)
                .where({ id: userId }).first();

            return Object.assign({}, user);

        } catch (error) {
            throw new Error('Could not find user');
        }
    }

    /**
     * ### returns all users. also supports pagination
     */
    static async getAllUsers(pageNum = 0) {
        // compute pagination
        const offset = Util.getOffset(pageNum, this.pageLimit);


        try {
            const allUsers = await db(TABLES.USERS)
                .select(...this.selectFields)
                .limit(this.pageLimit) // No prepared value
                .offset(offset)

            const toReturn = allUsers.map(user => {
                const userObj = Object.assign({}, user);
                return userObj;
            });
            return toReturn;
        } catch (error) {
            throw error;
        }
    }

    static async updateUser(userData, userId) {
        // define expected keys
        const expectedKeys = [
            'firstName', 'lastName', 'bio',
        ]
        // get columns/keys to update
        const keysToUpdate = expectedKeys.filter((key) => userData[key] !== undefined);

        // create object for update
        const dataToUpdate = {};
        for (const [key, value] of Object.entries(userData)) {
            if (keysToUpdate.indexOf(key) !== -1) {
                dataToUpdate[key] = value
            }
        }

        try {
            const id = await db(TABLES.USERS)
                .where({ id: userId })
                .update({ ...dataToUpdate })

            return { id, ...dataToUpdate }

        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(userId) {
        // get user
        try {
            const user = await this.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // delete user
            await db(TABLES.USERS)
                .where({ id: userId })
                .del()
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;