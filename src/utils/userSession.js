// @ts-check
const Token = require('../middlewares/token/index');
const SessionAuth = require('../session');

class UserSession {

    /**
     * 
     * @param {import('express').Request} request 
     * @returns 
     */
    static async createSession(request) {
        // get access tokens
        // get user email
        const { email } = request.body;
        const { session } = request;

        try {
            // create a session for the user
            const accessToken = await Token.createAccessToken(email);
            // save access token and email to session data
            [session.email, session.accessToken] = [email, accessToken];
            // save the session
            const isSaved = await SessionAuth.saveSession(session)

            return isSaved;
        } catch (error) {
            throw new Error('Could not create session');
        }
    }

    /**
     * 
     * @param {import('express').Request} request 
     * @returns {Promise<boolean>}
     */
    static async validateSession(request) {
        const { cookies, session } = request;

        // check cookie
        if (!cookies.session_TP) {
            return false;
        }
        const sessionId = cookies.session_TP.split(':')[1].split('.')[0];

        try {
            const sessionData = await SessionAuth.getSession(sessionId);
            if (!sessionData) {
                return false;
            }
            const { accessToken } = sessionData;
            // validate access token
            const decodedToken = await Token.decodeToken(accessToken);

            // destroy session data on access token expiration
            if (decodedToken === 'TokenExpired') {
                await SessionAuth.destroySession(session);
                return false;
            }
            return true;
        } catch (error) {
            throw new Error('Could not validate');
        }
    }

    /**
     * 
     * @param {import('express').Request} request 
     * @returns {Promise<boolean>}
     */
    static async removeSession(request) {
        const { cookies, session } = request;
        let isRemoved = false;

        // check cookie
        if (!cookies.session_TP) {
            return false;
        }
        const sessionId = cookies.session_TP.split(':')[1].split('.')[0];
        try {
            const sessionData = await SessionAuth.getSession(sessionId);
            console.log(sessionData);
            if (!sessionData) {
                return true;
            }

            isRemoved = await SessionAuth.destroySession(session);
            return isRemoved;

        } catch (error) {
            throw new Error('Could not remove session');
        }
    }
}

module.exports = UserSession;