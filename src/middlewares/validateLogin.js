const { db, TABLES } = require('../db');
const { body } = require('express-validator');
const { verifyPassword } = require('../utils/password');

// DEFINE CUSTOM VALIDATORS HERE

const checkEmailNotExists = async (email) => {
    // check if user exists
    const user = await db(TABLES.USERS).where({ email: email }).first();
    if (!user) {
        throw new Error('User does not exist');
    }
}

const checkPasswordMatch = async (password) => {
    const user = db(TABLES.USERS).where({ email: email }).first();
    if (!user) {
        throw new Error('User does not exist');
    }
    try {
        const value = await verifyPassword(password, user.password);
        // returns boolean
        return value;
    } catch (error) {
        throw new Error(error.message);
    }
}
// END OF CUSTOM VALIDATORS


// DEFINE VALIDATION CHAINS

const validateLogin = [
    // email
    body('email').notEmpty().withMessage('Missing email'),
    body('email').isEmail().withMessage('Invalid email'),
    body('email').custom(checkEmailNotExists).withMessage('User does not exist'),
    //password
    body('password').notEmpty().withMessage('Missing password'),
    body('password').custom(checkPasswordMatch).withMessage('Wrong password')
];

// END VALIDATION CHAINS


// exported to routes
module.exports = {
    validateLogin
};
