const bcrypt = require('bcrypt');
const { promisify } = require('util');

/**
 * hashes a user password
 */
async function hashPassword(password) {

    try {
        const salt = await bcrypt.genSalt(saltRounds);
        // promisify the synchronous hashing function
        const hash = await promisify(bcrypt.hash).bind(bcrypt)(password, salt);
        return hash;
    } catch (error) {
        throw new Error('Could not generate hash');
    }
}

/**
 * returns a boolean for hash comparison
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
    hashPassword,
    verifyPassword
}