// @ts-check
const Course = require('../models/Course');
const Instructor = require('../models/Instructor');
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
        const instructor = await Instructor.getInstructorById(instructorIdNum);
        // if instructor does not exists, return a 400 error
        if (!instructor) {
            return response.status(400).json({ error: 'Instructor Not Found' });
        }
        // check course assignement to instructor
        // Handle 'instructor already assigned' error
        if (instructor.courseId) {
            return response.status(400).json({ error: 'Instructor already assigned' });
        }
    }
    next();
}


/**
 * ### validates the `id` parameter for `DELETE`, `GET`, and `PUT` requests
 * @type {HandlerMiddleware} 
 */
async function validateIdParam(request, response, next) {
    const { id } = request.params;
    const { name, price, description, instructorId } = request.body;
    /**@type {number} */
    let instructorIdNum;
    let instructor;

    // request method
    const requestMethod = request.method;

    // parse id
    const courseId = parseInt(id, 10);

    // validate id for course
    /** @see Util for implemtation details */
    if (!Util.checkDigit(id) || isNaN(courseId) || typeof courseId !== 'number') {
        return response.status(400).json({ error: 'Invalid id' });
    }

    // get course data
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
    if ((requestMethod === 'GET' || requestMethod === 'PUT') && !course) {
        return response.status(404).json({ error: 'Not found' });
    }

    // validate instructor id for PUT requests, if passed
    if (instructorId) {
        instructorIdNum = parseInt(instructorId, 10);
        if (
            !Util.checkDigit(instructorId) ||
            typeof instructorIdNum !== 'number' ||
            isNaN(instructorIdNum)
        ) {
            return response.status(400).json({ error: 'Invalid instructorId' });
        }
        // get instructor
        instructor = await Instructor.getInstructorById(instructorIdNum);

        // Non-existing instructor cannot be updated with course
        if (requestMethod === 'PUT' && !instructor) {
            return response.status(400).json({ error: 'Instructor Not Found' });
        }

        // assigned instructor cannot be used for update
        if (instructor.courseId) {
            return response.status(400).json({ error: 'Instructor already assigned' });
        }
    }

    // update object
    const updateBody = {
        name, price, description,
        instructorIdNum: instructorId ? parseInt(instructorId, 10) : 0
    }

    // get defined body values in PUT requests
    const updateBodyValues = Object.values(updateBody).filter((value) => {
        if (value) {
            return value;
        }
    });

    // empty update body returns an empty response
    if (requestMethod === 'PUT' && updateBodyValues.length === 0) {
        return response.status(204).json({})
    }

    // pass to next handler
    next();
}

module.exports = {
    validateIdParam, validateBody
}
