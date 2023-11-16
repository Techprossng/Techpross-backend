// @ts-check
const { validationResult } = require('express-validator');

/**
 * ### General Middleware
 * - This middleware checks for any error in the middlewares called before it.
 * - It is the last middleware in the express-validator
 */
function checkValidationResult(request, response, next) {
    // check for errors
    const formattedValidation = validationResult.withDefaults({
        formatter: error => error.msg,
    })

    const errorsResult = formattedValidation(request);

    // errorsResult is an array of error messages from validation chain
    if (errorsResult) {
        // returns the first field that does not pass
        return response.status(400).json({ error: errorsResult.array()[0] });
    }
    return next();
}

module.exports = checkValidationResult;