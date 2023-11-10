require('dotenv').config;
const jwt = require('jsonwebtoken');

/**
 * ### create and decode jwt
 */
class Token {
    #secretKey = process.env.JWT_SECRET;
    /**
     * creates a json web token for the login route. Token gets
     * saved to the cookie response
     * @param - user's email
     */
    createAccessToken(userEmail) {
        return new Promise((resolve, reject) => {
            const options = {
                expiresIn: '10 days',
                audience: userEmail
            }
            jwt.sign({ userEmail }, this.#secretKey, options, (error, token) => {
                if (error) {
                    reject(new Error('Token creation unsuccessful'));
                }
                resolve(token);
            });
        })
    }


    /**
    * ### decodes the access token with jwt
    * @param accessToken access token to be decoded
    * @returns a promise with token, otherwise rejects with an error
    */
    decodeToken(accessToken) {
        return new Promise((resolve, reject) => {
            jwt.verify(accessToken, this.#secretKey, (error, decodedToken) => {
                if (error) {
                    reject(new Error('Unauthorized'));
                }
                resolve(decodedToken);
            });
        });
    }

}


module.exports = Token;
