const Payer = require('../../models/Payer');

const { Util } = require('../../utils');
const Payment = require('../../remitaPayments/Payer.database');

/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */


/**
 * ### Validates Payee's details
 * @type {Handler}
 */
async function validatePayerBody(request, response, next) {

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

    // Add payerObject to request body
    response.locals.payer = { firstName, lastName, email, course };

    return next();
}

/**
 * ### Verifies the email and payer's existence for GET and DELETE requests
 * @type {Handler}
 */
async function validatePayerEmail(request, response, next) {
    const { email } = request.params;

    // request method
    const requestMethod = request.method;

    if (!email) {
        return response.status(400).json({ error: 'Missing email' });
    }

    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' })
    }

    // check resource/User's existence
    const payer = await Payer.getPayerByEmail(email);

    // check HTTP method for DELETE
    if (requestMethod === 'DELETE') {
        // enforce idempotency
        if (!payer) {
            return response.status(404).json({});
        }
        return next();
    }

    // check course existence for GET requests
    if (requestMethod === 'GET' && !payer) {
        return response.status(404).json({ error: 'Payer Not found' });
    }

    // save payer object in response object for next middleware
    response.locals.payer = payer;
    next();
}

/**
 * ### Verifies the id and payer's existence for GET and DELETE requests
 * @type {Handler}
 */
async function validatePayerId(request, response, next) {
    const { id } = request.params;

    // request method
    const requestMethod = request.method;

    if (!id) {
        return response.status(400).json({ error: "Missing id" });
    }

    const payerId = parseInt(id, 10);

    /** @see Util for implentation details */
    if (
        !Util.checkDigit(id) ||
        typeof payerId !== "number" ||
        isNaN(payerId)
    ) {
        return response.status(400).json({ error: "Invalid Payer Id" });
    }

    // check resource/User's existence
    const payer = await Payer.getPayerById(payerId);

    // check HTTP method for DELETE
    if (requestMethod === 'DELETE') {
        // enforce idempotency
        if (!payer) {
            return response.status(404).json({});
        }
        return next();
    }

    // check course existence for GET and PUT requests
    if (requestMethod === 'GET' && !payer) {
        return response.status(404).json({ error: 'Payer Not found' });
    }

    // save payer object in response object for next middleware
    response.locals.payer = payer;
    next();
}


/**
 * ### validate parameters and body in update request
 * @type {Handler}
 */
async function validateUpdate(request, response, next) {
    const { id } = request.params;
    const { RRR } = request.body;

    if (!id) {
        return response.status(400).json({ error: "Missing id" });
    }

    if (!RRR) {
        return response.status(400).json({ error: "Missing Remita Retrieval Reference" });
    }

    const payerId = parseInt(id, 10);

    /** @see Util for implentation details */
    if (
        !Util.checkDigit(id) ||
        typeof payerId !== "number" ||
        isNaN(payerId)
    ) {
        return response.status(400).json({ error: "Invalid Payer Id" });
    }

    const payer = await Payer.getPayerById(payerId);

    if (!payer) {
        return response.status(404).json({ error: 'Payer Not found' });
    }

    next();
}



module.exports = {
    validatePayerBody, validatePayerEmail, validatePayerId,
    validateUpdate
}