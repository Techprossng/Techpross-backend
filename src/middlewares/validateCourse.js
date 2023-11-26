// @ts-check
const Course = require('../models/Course');
const { Util } = require('../utils');

/**
 * @callback HandlerMiddleware
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */

/**
 * ### validates the request body for post requests
 * @type {HandlerMiddleware}
 */
async function validateBody(request, response, next) {
    const { name, description, price, instructorId } = request.body;

    // validate name
    if (!name) {
        return response.status(400).json({ error: 'Missing course name' });
    }
    if (typeof name !== 'string') {
        return response.status(400).json({ error: 'Invalid course name' });
    }
    // validate description
    if (!description) {
        return response.status(400).json({ error: 'Missing description' });
    }
    if (typeof description !== 'string') {
        return response.status(400).json({ error: 'Invalid description' });
    }
    // validate price
    if (!price) {
        return response.status(400).json({ error: 'Missing price' });
    }
    const priceNum = parseInt(price, 10);
    if (!Util.checkDigit(price) || typeof priceNum !== 'number' || isNaN(priceNum)) {
        return response.status(400).json({ error: 'Invalid price' });
    }
    // validate instructor
    if (instructorId) {
        const instructorIdNum = parseInt(instructorId, 10);
        // check if id is a number or matches number pattern
        if (
            !Util.checkDigit(instructorId) ||
            typeof instructorIdNum !== 'number' ||
            isNaN(instructorIdNum)
        ) {
            return response.status(400).json({ error: 'Invalid instructorId' });
        }
        // check if instructor exists
        // if instructor does not exists, return a 400 error
        // if instructor exists, check if ac courseId is attached to it
        // if so, return a 400 error with message: 'instructor already assigned'
    }
    next();
}


/**
 * ### validates the `id` parameter for `DELETE`, `GET`, and `PUT` requests
 * @type {HandlerMiddleware} 
 */
async function validateIdParam(request, response, next) {
    const { id } = request.params;
    // request method
    const requestMethod = request.method;

    const courseId = parseInt(id, 10);

    /** @see Util for implemtation details */
    if (!Util.checkDigit(id) || isNaN(courseId) || typeof courseId !== 'number') {
        return response.status(400).json({ error: 'Invalid id' });
    }
    const course = await Course.getCourseById(courseId);

    // handle DELETE request
    if (requestMethod === 'DELETE') {
        // check course existence
        if (!course) {
            return response.status(404).json({});
        }
        return next();
    }

    // check course existence for GET and PUT requests
    if (!course) {
        return response.status(404).json({ error: 'Not found' });
    }
    // pass to next handler
    next();
}

module.exports = {
    validateIdParam, validateBody
}
