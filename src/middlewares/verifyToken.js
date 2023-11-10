const Token = require('./token');

/**
 * ### Verification middleware for protected routes
 */
async function verifyToken(request, response, next) {
    // get access token from request cookie
    const accessToken = request.cookies.rememberUserTechPros;
    if (!accessToken) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decodedToken = await Token.decodeToken(accessToken);
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

module.exports = { verifyToken };