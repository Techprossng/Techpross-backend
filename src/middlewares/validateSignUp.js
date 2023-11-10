const { db, TABLES } = require('../db');
const { body } = require('express-validator');

// DEFINE CUSTOM VALIDATORS HERE

const checkEmailExists = async (email) => {
    // check if user exists
    const user = db(TABLES.USERS).where({ email: email }).first();
    if (user) {
        throw new Error('Email already exists');
    }
}

// END OF CUSTOM VALIDATORS


// DEFINE VALIDATION CHAINS

const validateSignUp = [
    // email
    body('email').notEmpty().withMessage('Missing email'),
    body('email').isEmail().withMessage('Invalid email'),
    body('email').custom(checkEmailExists).withMessage('Email already exists'),
    //password
    body('password').notEmpty().withMessage('Missing password'),
    body('password').isLength({ min: 8 }).withMessage('Password must be 8 characters or more'),
    // Names
    body('firstName').notEmpty().withMessage('Missing first name'),
    body('lastName').notEmpty().withMessage('Missing last name')
];

// END VALIDATION CHAINS


// exported to routes
module.exports = {
    validateSignUp
};
