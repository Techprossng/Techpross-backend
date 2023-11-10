const { hashPassword, verifyPassword } = require('./password');

/**
 * ### helper utilities
 */
exports.Util = {
    hashPassword: hashPassword,
    verifyPassword: verifyPassword,
    checkDigit: /^[0-9]+$/
}