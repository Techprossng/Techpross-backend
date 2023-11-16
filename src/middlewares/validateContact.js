// @ts-check

const Contact = require('../models/Contact');
const { Util } = require('../utils');

// DEFINED TYPES
/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */

/**
 * validate body of request
 * @type {Handler}
 */
async function validateContactBody(request, response, next) {
    const {
        email, firstName, lastName,
        website, description
    } = request.body;

    // email validation
    if (!email) {
        return response.status(400).json({ error: 'Missing email' });
    }
    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' });
    }
    const contact = await Contact.getContactByEmail(email);
    if (contact) {
        return response.status(400).json({ error: 'Contact already exists' });
    }
    // names validations
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
    // website can be nullable
    // check if webiste is not in an IP address format
    const anIpAddress = /^[0-9]{3}\.[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}$/;
    if (website && (typeof website !== 'string' || anIpAddress.test(website))) {
        return response.status(400).json({ error: 'Invalid website' });
    }
    // validate description
    if (!description) {
        return response.status(400).json({ error: 'Missing description' });
    }
    if (typeof description !== 'string') {
        return response.status(400).json({ error: 'Invalid description' });
    }

    return next();
}

/**
 * ## validates email from contact for GET and DELETE requests
 * @type {Handler}
 */
async function validateContactParam(request, response, next) {
    const { email } = request.params;

    if (!email) {
        return response.status(400).json({ error: 'Missing email' });
    }

    if (typeof email !== 'string' || !Util.checkIsEmail(email)) {
        return response.status(400).json({ error: 'Invalid email' })
    }

    // check resource/contact's existence
    const contact = await Contact.getContactByEmail(email);

    // check HTTP method for DELETE
    if (request.method === 'DELETE') {
        // enforce idempotency
        if (!contact) {
            return response.status(404).json({});
        }
        return next();
    }
    next();
}

module.exports = { validateContactBody, validateContactParam };