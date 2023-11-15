// @ts-check

const Subscriber = require('../models/Subscriber');
const { Util } = require('../utils');

// DEFINED TYPES
/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 * @returns {import('express').Response | void}
 */

/**
 * ## validates email from subscriber
 * @type {Handler}
 */
function validateSubscriber(request, response, next) {
    const { email } = request.body;

    if (!email || typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' })
    }
    // check HTTP method for DELETE
    if (request.method === 'DELETE') {
        next();
    }
    // check resource/subscriber's existence
    const subscriber = Subscriber.getSubscriberByEmail(email);
    if (subscriber) {
        return response.status(400).json({ error: 'Email already exists' });
    }
    next();
}

module.exports = validateSubscriber;