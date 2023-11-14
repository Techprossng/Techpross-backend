// @ts-check
const { body } = require('express-validator');
const { Util } = require('../utils/index');

// DEFINE VALIDATION CHAINS

// check for non empty fields
const validateSignUp = [
    // email
    body('email').notEmpty().withMessage('Missing email'),
    //password
    body('password').notEmpty().withMessage('Missing password'),
    body('password').isString().withMessage('Invalid password'),
    body('password').isLength({ min: 8 })
        .withMessage('password must have a minimum of 8 characters'),
    // Names
    body('firstName').notEmpty().withMessage('Missing first name'),
    body('lastName').notEmpty().withMessage('Missing last name')
];

// END VALIDATION CHAINS

/**
 * Throughly checks the parameters from the signup body
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
    validateSignUp,
    validateSignupInput
};
