// @ts-check
const Token = require('../middlewares/token/index');
const User = require('../models/User');
const { Util } = require('../utils');
const UserSession = require('../utils/userSession');

// DEFINED TYPES. Hover on types defined with `typedef` to view.
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
 * 
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */


/**
 * @class
 * @classdesc ### controller for user.
 * - Handles login, logout, signup, and users defined actions.
 */
class UserController {
    /**
     * ### registration function
     * @type {Handler}
     */
    static async register(request, response) {
        const { email, password, firstName, lastName } = request.body;

        const userData = {
            email, password, firstName, lastName
        }

        try {
            const user = await User.createUser(userData);
            // create session for user
            const isCreated = await UserSession.createSession(request);

            if (isCreated) {
                delete user.password;
                const returnData = { message: 'success', ...user }
                return response.status(201).json(returnData);

            }
            return response.status(500).json({ error: 'Internal Server Error' });

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * ### Login function
     * @type {Handler}
     */
    static async login(request, response) {
        // get user data from previous middleware
        /**@type {IUser}} */
        const user = response.locals.user;

        try {
            // create session for user
            const isCreated = await UserSession.createSession(request);

            if (isCreated) {
                delete user.password;
                const returnData = { message: 'success', ...user }
                return response.status(201).json(returnData);
            }
        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    // Google auth
    static async loginWithGoogle() { }

    /**
     * Logout handler
     * @type {Handler}
     */
    static async logout(request, response) {
        try {

            // remove user's session
            const isRemoved = await UserSession.removeSession(request);
            if (isRemoved) {
                // clear session cookie
                response.clearCookie('session_TP');
                return response.status(200).json({ message: 'Logout successful' });
            }

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * gets a user information
     * @type {Handler}
     */
    static async getUser(request, response) {
        // get user from previous middleware
        const user = response.locals.user;

        try {
            const returnData = { message: 'success', ...user };
            return response.status(200).json(returnData);

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Update handler
     * @type {Handler}
     */
    static async update(request, response) {
        const { userId } = request.params;
        const { firstName, lastName, bio, phoneNumber } = request.body;
        if (!userId) {
            return response.status(400).json({ error: 'Missing userId' });
        }

        /** @see Util for implemtation details */
        // check for valid id
        if (!Util.checkDigit(userId)) {
            return response.status(400).json({ error: 'Invalid userId' });
        }

        /** @type {IUserUpdate} */
        const dataToUpdate = {
            firstName, lastName, bio, phoneNumber
        }

        try {
            const updatedData = await User.updateUser(dataToUpdate, userId);

            const returnData = { message: 'Update successful', ...updatedData };
            return response.status(200).json(returnData);

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UserController;