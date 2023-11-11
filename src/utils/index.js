const { hashPassword, verifyPassword } = require('./password');

/**
 * ### helper utilities
 */
exports.Util = {
    hashPassword: hashPassword,
    verifyPassword: verifyPassword,
    checkDigit: /^[0-9]+$/,
    getOffset: (pageNum, limit) => pageNum > 0 ? (pageNum - 1) * limit : 0
}