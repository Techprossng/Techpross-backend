// @ts-check
require('dotenv').config;
const jwt = require('jsonwebtoken');

/**
 * ### create and decode jwt
 */
class Token {
    /** @private */
    /** @type {import('jsonwebtoken').Secret | string} */
    static secretKey = process.env.JWT_SECRET ?? 'secret';

    /**
     * creates a json web token for the login route. Token gets
     * saved to the cookie response
     * @param {string} userEmail user's email
     */
    static createAccessToken(userEmail) {
        return new Promise((resolve, reject) => {
            const options = {
                expiresIn: '5 days',
                audience: userEmail
            }
            jwt.sign({ userEmail }, this.secretKey, options, (error, token) => {
                if (error) {
                    reject(new Error('Token creation unsuccessful'));
                }
                resolve(token);
            });
        })
    }

    /**
    * ### decodes the access token with jwt
    * @param {string} accessToken access token to be decoded
    * @returns {Promise<string | jwt.JwtPayload | undefined>} a promise with token
    * @throws {Error} access token is unable to be verified 
    */
    static decodeToken(accessToken) {
        return new Promise((resolve, reject) => {
            jwt.verify(accessToken, this.secretKey, (error, decodedToken) => {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        return resolve('TokenExpired');
                    }
                    reject(new Error('Unauthorized'));
                }
                resolve(decodedToken);
            });
        });
    }

}



module.exports = Token;
