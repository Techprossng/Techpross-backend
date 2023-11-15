// @ts-check
const { db, TABLES } = require('../db');
const { Util } = require('../utils');


/* DEFINED DATA TYPES. Hover on the declaration to see the types */
/**
 * @typedef {object} IUser
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} password
 * @property {string} email
 *
 * @typedef {object} IUserUpdate
 * @property {string?} firstName
 * @property {string?} lastName
 * @property {string?} bio 
 * @property {string?} phoneNumber
 */


/**
 * User class is defined here. It contains the actions that can be
 * performed on a row in the database `users` table
 */

class User {

    static selectFields = [
        'id', 'firstName', 'lastName', 'email', 'bio',
        'country', 'phoneNumber'
    ];
    /** @private */
    static pageLimit = 20;

    /**
     * @async
     * @param {IUser} userData
     * @returns {Promise<object>}
     * @throws {Error} when there is an error in insertion 
     */
    static async createUser(userData) {
        // get user data and hash password
        const { firstName, lastName, password, email } = userData;

        try {
            /** @see Util for implementation details */
            const hash = await Util.hashPassword(password);

            /** @type {object} */
            // type declared to allow password deletion before return
            const data = {
                firstName, lastName,
                password: hash,
                email
            };
            // insert the user data and returns defined data
            const [userId] = await db(TABLES.USERS)
                .insert({ ...data })

            delete data.password;
            return { userId, ...data };

        } catch (error) {
            throw new Error('Unable to get user');
        }
    }

    /**
     * @async
     * get a user by email
     * @param {string} userEmail 
     */
    static async getUserByEmail(userEmail) {
        try {
            const user = await db(TABLES.USERS)
                .select(...this.selectFields)
                .where({ email: userEmail }).first();
            if (!user) {
                return null;
            }
            // user object is of type ResultFormat
            // assignment makes it more presentable
            delete user.password;
            return Object.assign({}, user);

        } catch (error) {
            throw new Error('Unable to get user');
        }
    }

    /**
     * @async
     * get a user by id
     * @param {string} userId 
     */
    static async getUserById(userId) {

        try {
            const user = await db(TABLES.USERS)
                .select(...this.selectFields)
                .where({ id: userId }).first();
            if (!user) {
                return null;
            }
            // delete password from object
            delete user.password
            return Object.assign({}, user);

        } catch (error) {
            throw new Error('Could not find user');
        }
    }

    /**
     * @async
     * ### returns all users. also supports pagination
     * @param {number} [pageNum=0]
     * @returns {Promise<Array.<object>>}
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
            throw new Error('Unable to get users');
        }
    }


    /**
     * updates a user info on the database
     * @param {IUserUpdate} userData 
     * @param {string} userId 
     * @returns {Promise<object>}
     */
    static async updateUser(userData, userId) {
        // define expected keys
        const expectedKeys = [
            'firstName', 'lastName', 'bio', 'phoneNumber'
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

            return { userId: id, ...dataToUpdate }

        } catch (error) {
            throw new Error('Unable to update');
        }
    }

    /**
     * deletes a user from the database
     * @param {string} userId 
     * @returns {Promise<boolean>}
     */
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
            throw new Error('Unable to delete');
        }
    }
}
module.exports = User;