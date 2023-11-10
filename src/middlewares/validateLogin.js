const { db, TABLES } = require('../db');
const { body } = require('express-validator');
const { verifyPassword } = require('../utils/password');

const validateLogin = [
    // email
    body('email').notEmpty().withMessage('Missing email'),
    body('email').isEmail().withMessage('Invalid email'),
    //password
    body('password').notEmpty().withMessage('Missing password'),
];

// END VALIDATION CHAINS


// exported to routes
module.exports = {
    validateLogin
};
