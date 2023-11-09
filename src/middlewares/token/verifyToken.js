const jwt = require('jsonwebtoken');
const { secretKey } = require('./createToken');
const User = require('../../models/User');


/**
* ### decodes the access token with jwt
* @param accessToken access token to be decoded
* @returns a promise object
*/
function decodeAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(accessToken, secretKey, async (error, decodedToken) => {
            if (error) {
                reject(new Error('Unauthorized'));
            }
            resolve(decodedToken);
        });
    });
}

/**
 * ### Verification middleware for protected routes
 */
async function verifyAccessToken(request, response, next) {
    let userEmail;

    // get access token from request cookie
    const accessToken = request.cookies.rememberUser;
    if (!accessToken) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decodedToken = await decodeAccessToken(accessToken);
        if (!decodedToken || typeof decodedToken !== 'string') {
            return response.status(401).json({ error: 'Unauthorized' });
        }
        // get email from decoded token and save in request object for next middleware
        request.userEmail = decodedToken.userEmail;
        next();
    } catch (error) {
        return response.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = verifyAccessToken;