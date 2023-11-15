// @ts-check
const Token = require('../middlewares/token/index');
const User = require('../models/User');
const { Util } = require('../utils');

// DEFINED TYPES. Hover on types defined with `typedef` to view.
/**
 * @typedef {object} IUserUpdate
 * @property {string?} firstName
 * @property {string?} lastName
 * @property {string?} bio 
 * @property {string?} phoneNumber
 */


/**
 * @class
 * @classdesc ### controller for user. Handles login, logout, signup, and
 * ### users defined actions.
 */
class UserController {
    /**
     * ### registration function 
     */
    static async register(request, response) {
        const { email, password, firstName, lastName } = request.body;

        // save user to database
        const userData = {
            email, password, firstName, lastName
        }

        try {
            const emailExists = await User.getUserByEmail(email);
            if (emailExists) {
                return response.status(400).json({ error: 'Email already exists' });
            }

            const user = await User.createUser(userData);

            const returnData = { message: 'Registration successful', ...user }
            return response.status(201).json(returnData);

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * ### Login function
     */
    static async login(request, response) {
        const { email, password } = request.body;
        // verify data
        const user = await User.getUserByEmail(email);
        if (!user) {
            return response.status(400).json({ error: 'User Not found' })
        }
        // verify password
        try {
            const isMatch = await Util.verifyPassword(password, user.password);
            if (!isMatch) {
                return response.status(400).json({ error: 'Wrong password' });
            }
            // create token
            const accessToken = await Token.createAccessToken(email);

            // set access token in cookies; maxAge is 5 days
            // cookie name is `rememberUser`, value is `accessToken`
            // rememberUser will be used for verification of access to protected routes
            const options = { httpOnly: true, maxAge: 432000 * 1000 }
            response.cookie('rememberUserTechPros', accessToken, options);

            return response.status(200).json({ message: 'Login successful', ...user });
        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async loginWithGoogle() { }

    static async logout(request, response) {
        const { userId } = request.params;

        try {
            // validate user existence
            const user = await User.getUserById(userId);
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }
            // clear cookie in response object
            response.clearCookie('rememberUserTechPros');

            return response.status(200).json({ message: 'Logout successful' });

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Updates a user
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