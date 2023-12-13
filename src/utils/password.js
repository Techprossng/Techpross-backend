const bcrypt = require('bcrypt');


/**
 * hashes a user password
 * @param {string} password
 * @returns {Promise<string>} the hashed/encrypted password
 */
async function hashPassword(password) {

    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);

        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error(error);
        throw new Error('Could not generate hash');
    }
}

/**
 * returns a boolean for hash comparison
 * @param {string} password user's password
 * @param {string} hash hashed password in database
 * @returns {Promise<boolean>}
 */
async function verifyPassword(password, hash) {

    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        throw new Error('could not verify password');
    }
}

module.exports = {
    hashPassword, verifyPassword
}
