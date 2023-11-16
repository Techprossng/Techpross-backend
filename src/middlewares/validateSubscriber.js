// @ts-check

const Subscriber = require('../models/Subscriber');
const { Util } = require('../utils');

// DEFINED TYPES
/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */

/**
 * ## validates email from subscriber for POST requests
 * @type {Handler}
 */
async function validateSubscriberBody(request, response, next) {
    const { email } = request.body;

    if (!email) {
        return response.status(400).json({ error: 'Missing email' })
    }

    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' });
    }

    // check resource/subscriber's existence
    const subscriber = await Subscriber.getSubscriberByEmail(email);
    if (subscriber) {
        return response.status(400).json({ error: 'Email already exists' });
    }
    next();
}

/**
 * ## validates email from subscriber for GET and DELETE requests
 * @type {Handler}
 */
async function validateSubscriberParam(request, response, next) {
    const { email } = request.params;

    if (!email || typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' })
    }

    // check resource/subscriber's existence
    const subscriber = await Subscriber.getSubscriberByEmail(email);

    // check HTTP method for DELETE
    if (request.method === 'DELETE') {
        // enforce idempotency
        if (!subscriber) {
            return response.status(404).json({});
        }
        return next();
    }
    next();
}

module.exports = { validateSubscriberBody, validateSubscriberParam };