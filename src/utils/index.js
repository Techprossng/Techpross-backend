/** @module Utils */

const { hashPassword, verifyPassword } = require('./password');


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
 * ### helper utilities
 */
exports.Util = {
    hashPassword,
    verifyPassword,
    checkDigit: (digit) => /^[0-9]+$/.test(digit),
    checkIsEmail,
    getOffset
}