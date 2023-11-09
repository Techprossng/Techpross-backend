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
        throw error;
    }
}

module.exports = {
    hashPassword
}