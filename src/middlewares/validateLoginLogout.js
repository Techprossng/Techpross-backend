// @ts-check
const { Util } = require('../utils/index');


/**
 * @callback Handler
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 * @param {import('express').NextFunction} next
 */

/**
 * validate the login request body
 * @type {Handler}
 */
function validateLoginInput(request, response, next) {
    const { email, password } = request.body

    // validate email
    if (!email) {
        return response.status(400).json({ error: 'Missing email' });
    }
    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' });
    }
    // validate password
    if (!password) {
        return response.status(400).json({ error: 'Missing password' });
    }
    if (typeof password !== 'string') {
        return response.status(400).json({ error: 'Invalid password' });
    }
    next();
}

/**
 * Revalidate the login request body
 * @type {Handler}
 */
function validateLogoutParam(request, response, next) {
    const { userId } = request.params;

    if (!userId) {
        return response.status(400).json({ error: 'Missing userId' });
    }
    // check for valid id
    if (!Util.checkDigit(userId)) {
        return response.status(400).json({ error: 'Invalid userId' });
    }
    next();
}

// END VALIDATION CHAINS


// exported to routes
module.exports = {
    validateLoginInput,
    validateLogoutParam
};
