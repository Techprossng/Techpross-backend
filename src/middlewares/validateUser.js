// @ts-check
const User = require('../models/User');
const { Util } = require('../utils');
const UserSession = require('../utils/userSession');

// DEFINED TYPES
/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */

/**
 * validate body of request for signup
 * @type {Handler}
 */
async function validateUserBody(request, response, next) {
    const {
        email, firstName, lastName,
        password
    } = request.body;

    // email validation
    if (!email) {
        return response.status(400).json({ error: 'Missing email' });
    }
    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' });
    }
    // validate user existence
    const user = await User.getUserByEmail(email);
    if (user) {
        return response.status(400).json({ error: 'User already exists' });
    }
    // names validations
    if (!firstName) {
        return response.status(400).json({ error: 'Missing firstName' });
    }
    if (typeof firstName !== 'string' || !Util.checkString(firstName)) {
        return response.status(400).json({ error: 'Invalid firstName' });
    }
    if (!lastName) {
        return response.status(400).json({ error: 'Missing lastName' });
    }
    if (typeof lastName !== 'string' || !Util.checkString(lastName)) {
        return response.status(400).json({ error: 'Invalid lastName' });
    }

    // validate password
    if (!password) {
        return response.status(400).json({ error: 'Missing password' });
    }

    if (password.length < 8) {
        return response.status(400).json({ error: 'Password too short' });
    }

    return next();
}

/**
 * validate the login request body
 * @type {Handler}
 */
async function validateLoginInput(request, response, next) {
    const { email, password } = request.body

    // validate email
    if (!email) {
        return response.status(400).json({ error: 'Missing email' });
    }
    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' });
    }

    // validate user existence
    const user = await User.getUserByEmail(email);
    if (!user) {
        return response.status(404).json({ error: 'User Not Found' });
    }
    // validate password
    if (!password) {
        return response.status(400).json({ error: 'Missing password' });
    }
    if (typeof password !== 'string') {
        return response.status(400).json({ error: 'Invalid password' });
    }
    const isMatch = await Util.verifyPassword(password, user.password);
    if (!isMatch) {
        return response.status(400).json({ error: 'Invalid password' });
    }
    delete user.password;
    response.locals.user = user;
    next();
}

/**
 * validate the logout request id param
 * @type {Handler}
 */
async function validateLogoutParam(request, response, next) {
    const { userId } = request.params;

    if (!userId) {
        return response.status(400).json({ error: 'Missing userId' });
    }
    // check for valid id
    if (!Util.checkDigit(userId)) {
        return response.status(400).json({ error: 'Invalid userId' });
    }
    const userIdNum = parseInt(userId, 10);
    const user = await User.getUserById(userIdNum);
    if (!user) {
        return response.status(404).json({ error: 'User Not Found' });
    }
    next();
}



/**
 * @type {Handler}
 */
async function validateUserSession(request, response, next) {

    try {
        const isValid = await UserSession.validateSession(request);
        if (!isValid) {
            return response.status(401).json({ error: 'Unauthorized Access' });
        }
        return next();

    } catch (error) {
        console.log(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}



/**
 * ## validates email from User for GET and DELETE requests
 * @type {Handler}
 */
async function validateEmailParam(request, response, next) {
    const { email } = request.params;

    if (!email) {
        return response.status(400).json({ error: 'Missing email' });
    }

    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' })
    }

    // check resource/User's existence
    const user = await User.getUserByEmail(email);

    // check HTTP method for DELETE
    if (request.method === 'DELETE') {
        // enforce idempotency
        if (!user) {
            return response.status(404).json({});
        }
        return next();
    }
    next();
}

/**
 * ## validates id from User for GET and DELETE requests
 * @type {Handler}
 */
async function validateIdParam(request, response, next) {
    const { userId } = request.params;

    if (!userId) {
        return response.status(400).json({ error: 'Missing id' });
    }

    const userIdNum = parseInt(userId, 10);

    if (!Util.checkDigit(userId) || typeof userIdNum !== 'number' || isNaN(userIdNum)) {
        return response.status(400).json({ error: 'Invalid id' })
    }

    // check resource/User's existence
    const user = await User.getUserById(userIdNum);

    // check HTTP method for DELETE
    if (request.method === 'DELETE') {
        // enforce idempotency
        if (!user) {
            return response.status(404).json({});
        }
        return next();
    }
    //handle GET and PUT requests
    if (request.method === "GET" || request.method === "PUT") {
        if (!user) {
            return response.status(404).json({ error: "User Not Found" });
        }
    }
    // pass user object to next middleware
    delete user.password;
    response.locals.user = user;
    next();
}

/**
 * ### validates the body properties for `PUT` request
 * @type {Handler} 
 */
async function validateUpdateBody(request, response, next) {
    const { firstName, lastName, phoneNumber, bio } = request.body;

    // update object
    const updateBody = { firstName, lastName, phoneNumber, bio };

    const updateBodyValues = Object.values(updateBody).filter(
        (value) => value !== null || value !== undefined
    );

    // check empty body
    if (updateBodyValues.length === 0) {
        return response.status(204).json({})
    }

    // names
    if (
        firstName &&
        (typeof firstName !== 'string' || !/^[A-Za-z].+$/.test(firstName))
    ) {
        return response.status(400).json({ error: 'Invalid firstName' });
    }

    if (
        lastName &&
        (typeof lastName !== 'string' || !/^[A-Za-z].+$/.test(lastName))
    ) {
        return response.status(400).json({ error: 'Invalid lastName' });
    }

    if (
        phoneNumber &&
        (typeof phoneNumber !== 'string' || !Util.checkPhone(phoneNumber))
    ) {
        return response.status(400).json({ error: 'Invalid phone' });
    }

    if (
        bio &&
        (typeof bio !== 'string' || !/^[A-Za-z].+$/.test(bio))
    ) {
        return response.status(400).json({ error: 'Invalid bio' });
    }
    // pass update body to next handler
    response.locals.updateBody = updateBody;
    return next();
}

module.exports = {
    validateUserBody,
    validateEmailParam, validateIdParam,
    validateUserSession,
    validateLoginInput, validateLogoutParam,
    validateUpdateBody
};
