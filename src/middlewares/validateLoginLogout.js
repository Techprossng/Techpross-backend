const { body, param } = require('express-validator');
const { Util } = require('../utils/index');

const validateLogin = [
    // email
    body('email').notEmpty().withMessage('Missing email'),
    body('email').isEmail().withMessage('Invalid email'),
    //password
    body('password').notEmpty().withMessage('Missing password'),
];

const validateLogout = [
    // email
    param('userId').notEmpty().withMessage('Missing userId'),
    param('userId').isString().withMessage('Invalid userId')
];

/**
 * Revalidate the login request body
 * @param {Request} request 
 * @param {Response} response 
 * @param {NextFunction} next
 * @returns {Response|NextFunction}
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
 * @param {Request} request 
 * @param {Response} response 
 * @param {NextFunction} next
 * @returns {Response|NextFunction}
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
    validateLogin,
    validateLoginInput,
    validateLogout,
    validateLogoutParam
};
