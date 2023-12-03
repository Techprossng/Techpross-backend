// @ts-check
/** @module Utils */

const { hashPassword, verifyPassword } = require('./password');
const { getNextPage, getOffset } = require('./pagination');

/**
 * This module contains utlity functions that are used throughout
 * the application.
 * - Any function that is defined must follow the JSDoc type pattern
 * as seen in `checkIsEmail` function; parameters and return values
 * must be typed.
 * - functions that take more than 5 lines should be defined separately
 * in a file in the utils folder, and imported here to be used.
 * - Use arrow functions
 */

/**
 * Uses a regex pattern to validate the email
 * @param {string} email 
 * @returns {boolean}
 */
const checkIsEmail = (email) => {
    return /^[0-9a-zA-Z_+.%]+@[A-Za-z0-9.-_]+\.[A-Za-z.]{2,4}$/.test(email);
}



/**
 * Test that the string contains only digits
 * @param {string} digit 
 * @returns {boolean}
 */
const checkDigit = (digit) => /^[0-9]+$/.test(digit);

/**
 * Test that the contains only alphabetical characters
 * @param {string} strValue 
 * @returns {boolean}
 */
const checkString = (strValue) => /^[A-Za-z\s-]+$/.test(strValue);

/**
 * tests for a valid phone number
 * @param {string} phoneNum 
 * @returns {boolean}
 */
const checkPhone = (phoneNum) => {
    return /^\+[0-9]{2,3}[0-9]+$|^[0-9][0-9]+$/.test(phoneNum)
};


/**
 * ### helper utilities
 */
exports.Util = {
    hashPassword,
    verifyPassword,
    checkDigit,
    checkString,
    checkIsEmail,
    getOffset,
    getNextPage,
    checkPhone
}