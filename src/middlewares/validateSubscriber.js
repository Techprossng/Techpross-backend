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
async function validateEmailParam(request, response, next) {
    const { email } = request.params;

    if (!email) {
        return response.status(400).json({ error: 'Missing email' });
    }

    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
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

/**
 * ## validates id from subscriber for GET and DELETE requests
 * @type {Handler}
 */
async function validateIdParam(request, response, next) {
    const { id } = request.params;
    // request method
    const requestMethod = request.method;

    if (!id) {
        return response.status(400).json({ error: 'Missing id' });
    }

    // parse id
    const subscriberId = parseInt(id, 10);

    if (!Util.checkDigit(id) || typeof subscriberId !== 'number' || isNaN(subscriberId)) {
        return response.status(400).json({ error: 'Invalid id' })
    }

    // check resource/subscriber's existence
    const subscriber = await Subscriber.getSubscriberById(subscriberId);

    // check HTTP method for DELETE
    if (requestMethod === 'DELETE') {
        // enforce idempotency
        if (!subscriber) {
            return response.status(404).json({});
        }
        return next();
    }
    // handle GET AND PUT requests
    if (requestMethod === 'GET' || requestMethod === 'PUT') {
        if (!subscriber) {
            return response.status(404).json({ error: 'Not found' });
        }
    }
    next();
}

module.exports = {
    validateSubscriberBody,
    validateEmailParam, validateIdParam
};