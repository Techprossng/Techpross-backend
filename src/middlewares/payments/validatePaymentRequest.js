// @ts-check
const Payer = require('../../models/Payer');

/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */


/**
 * ### Validates `Authorization` header
 * @type {Handler}
 */
async function validateAuthorization(request, response, next) {
    // check authorization header params
    const authHeader = request.get("Authorization");

    if (!authHeader) {
        return response.status(401).json({ error: 'Not Authorized' });
    }

    // The user's email must be encoded in base64
    const encodedPayerEmail = authHeader.split(" ")[1];
    if (!encodedPayerEmail) {
        return response.status(401).json({ error: 'Not Authorized' });
    }

    const decodedPayerEmail = Buffer.from(encodedPayerEmail, 'base64').toString('utf-8');

    // validate user email
    const payer = await Payer.getPayerByEmail(decodedPayerEmail);

    if (!payer) {
        return response.status(401).json({ error: 'Not Authorized' });
    }

    response.locals.payer = payer;
    next();
}

module.exports = {
    validateAuthorization
}