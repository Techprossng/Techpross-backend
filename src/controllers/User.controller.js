const { createAccessToken } = require('../middlewares/token/createToken');
const User = require('../models/User');

/**
 * ### controller for user. Handles login, logout, signup
 */
class UserController {
    // registration
    static async register(request, response) {
        const { email, password, firstName, lastName } = request.body;

        // save user to database
        const userData = {
            email, password, firstName, lastName
        }
        try {
            const user = await User.createUser(userData);
            return response.status(201).json({ message: 'Registration successful', ...user });
            //  send email for verification
            // code here
        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /* Login */
    static async login(request, response) {
        const { email, password } = request.body;
        // verify data
        const user = await User.getUserByEmail(email);
        if (!user) {
            return response.status(400).json({ error: 'User Not found' })
        }
        // verify password
        try {
            const isMatch = await verifyPassword(password, user.password);
            if (!isMatch) {
                return response.status(400).json({ error: 'Wrong password' });
            }
            // create token
            const accessToken = await createAccessToken(email);

            // set access token in cookies; maxAge is 5 days
            // cookie name is `rememberUser`, value is `accessToken`
            // rememberUser will be used for verification of protected routes
            const options = { httpOnly: true, maxAge: 432000 * 1000 }
            response.cookie('rememberUser', accessToken, options);

            return response.status(200).json({ message: 'Login successful', ...user });
        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UserController;