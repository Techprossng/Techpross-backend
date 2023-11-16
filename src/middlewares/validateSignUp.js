// @ts-check
const { Util } = require('../utils/index');

/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */


// END VALIDATION CHAINS

/**
 * Throughly checks the parameters from the signup body
 * @type {Handler}
 */
function validateSignupInput(request, response, next) {
    const { email, password, firstName, lastName } = request.body;

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
    // validate names
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
    next();
}


// exported to routes
module.exports = {
    validateSignupInput
};
