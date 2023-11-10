const { createAccessToken } = require('../middlewares/token');
const User = require('../models/User');
const { Util } = require('../utils');

/**
 * ### controller for user. Handles login, logout, signup
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
            const accessToken = await createAccessToken(email);

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
        if (!userId) {
            return response.status(400).json({ error: 'Missing userId' });
        }
        // check for valid id
        if (!Util.checkDigit.test(userId)) {
            return response.status(400).json({ error: 'Invalid userId' });
        }
        try {
            // validate user existence
            const user = await User.getUserById(userId);
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }
            // clear cookie in response object
            response.clearCookie(rememberUserTechPros);

            return response.status(200).json({ message: 'Logout successful' });

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    static async update(request, response) {
        const { userId } = request.params;
        const { first_name, last_name, bio } = request.body;
        if (!userId) {
            return response.status(400).json({ error: 'Missing userId' });
        }
        // check for valid id
        if (!Util.checkDigit.test(userId)) {
            return response.status(400).json({ error: 'Invalid userId' });
        }

        try {
            const updatedData = await User.updateUser({ first_name, last_name, bio });

            const returnData = { message: 'Update successful', ...updatedData };
            return response.status(200).json(returnData);

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UserController;