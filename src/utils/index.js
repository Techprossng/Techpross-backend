const { hashPassword, verifyPassword } = require('./password');

/**
 * ### helper utilities
 */
exports.Util = {
    hashPassword,
    verifyPassword,
    checkDigit: (digit) => /^[0-9]+$/.test(digit),
    checkIsEmail: (email) => {
        return /^[0-9a-zA-Z_+.%]+@[A-Za-z0-9.-_]+\.[A-Za-z.]{2,4}$/.test(email)
    },
    getOffset: (pageNum, limit) => pageNum > 0 ? (pageNum - 1) * limit : 0,
}