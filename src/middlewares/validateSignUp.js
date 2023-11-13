const { body } = require('express-validator');


// DEFINE VALIDATION CHAINS

// check for non empty fields
const validateSignUp = [
    // email
    body('email').notEmpty().withMessage('Missing email'),
    //password
    body('password').notEmpty().withMessage('Missing password'),
    // Names
    body('firstName').notEmpty().withMessage('Missing first name'),
    body('lastName').notEmpty().withMessage('Missing last name')
];

// END VALIDATION CHAINS


// exported to routes
module.exports = {
    validateSignUp
};
