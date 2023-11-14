// @ts-check
/** @module Utils */

const { hashPassword, verifyPassword } = require('./password');

/**
 * This module contains utlity functions that are used throughout
 * the application.
 * - Any function that is defined must follow the JSDoc type pattern
 * as seen in `checkIsEmail` function; parameters and return values
 * must be typed.
 * - functions that take more than 3 lines should be defined separately
 * in a file and imported here to be used.
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
 * computes the number of items to skip for pagination
 * @param {number} pageNum 
 * @param {number} limit 
 * @returns {number}
 */
const getOffset = (pageNum, limit) => {
    return pageNum > 0 ? (pageNum - 1) * limit : 0;
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
const checkString = (strValue) => /^[A-Za-z]+$/.test(strValue);

/**
 * ### helper utilities
 */
exports.Util = {
    hashPassword,
    verifyPassword,
    checkDigit,
    checkString,
    checkIsEmail,
    getOffset
}