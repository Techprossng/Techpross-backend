// @ts-check
const Payer = require('../../models/Payer');
const { Util } = require('../../utils');

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
    /**@type {string} */
    // @ts-ignore
    const amount = request.query.amount;
    const authHeader = request.get("Authorization");

    if (!amount || !Util.checkDigit(amount)) {
        return response.status(400).json({ error: 'Invalid amount' });
    }

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