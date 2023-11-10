const { body, param } = require('express-validator');

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


// END VALIDATION CHAINS


// exported to routes
module.exports = {
    validateLogin,
    validateLogout
};
