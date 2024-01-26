const { Util } = require('../../utils');
const Payment = require('../../remitaPayments/Payer.database');

/**
 * @function Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */


/**
 * ### Validates Payee's details
 * @type {Handler}
 */
async function validateAddPayee(request, response, next) {

    const { firstName, lastName, email, course } = request.body;

    if (!email) {
        return response.status(400).json({ error: 'Missing email' });
    }
    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' });
    }

    // validate payee non-existence
    const payee = await Payment.getPayeeByEmail(email);
    if (payee) {
        return response.status(400).json({ error: 'Payee already exists' });
    }

    if (!firstName) {
        return response.status(400).json({ error: 'Missing firstName' });
    }
    if (typeof firstName !== 'string' || !Util.checkString(firstName)) {
        return response.status(400).json({ error: 'Invalid firstName' });
    }
    if (!lastName) {
        return response.status(400).json({ error: 'Missing lastName' });
    }
    if (typeof lastName !== 'string' || !Util.checkString(lastName)) {
        return response.status(400).json({ error: 'Invalid lastName' });
    }

    if (!course) {
        return response.status(400).json({ error: 'Missing lastName' });
    }
    if (typeof course !== 'string' || !Util.checkString(course)) {
        return response.status(400).json({ error: 'Invalid course' });
    }

    return next();
}

module.exports = {
    validateAddPayee
}