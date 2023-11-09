require('dotenv').config;
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

/**
 * creates a json web token for the login route. Token gets
 * saved to the cookie response
 * @param: userEmail - user's email
 */
function createAccessToken(userEmail) {

    return new Promise((resolve, reject) => {
        const options = {
            expiresIn: '5 days',
            audience: userEmail
        }
        jwt.sign({ userEmail }, secretKey, options, (error, token) => {
            if (error) {
                reject(new Error('Token creation unsuccessful'));
            }
            resolve(token);
        });
    })
}

module.exports = {
    createAccessToken,
    secretKey
}
