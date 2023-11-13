const { validationResult } = require('express-validator');

/**
 * ### General Middleware
 * - This middleware checks for any error in the middlewares called before it.
 * - It is the last middleware before the final function/route handler
 */
function checkValidationResult(request, response, next) {
    // check for errors
    const formattedValidation = validationResult.withDefaults({
        formatter: error => error.msg,
    })
    const errorsResult = formattedValidation(request);
    /**
     * This is an array of: <error_msg>
     */
    // field can be email, password, firstName etc...
    // errors is an array of error messages from validation chain
    if (errorsResult.errors.length) {
        // returns the first field that does not pass
        return response.status(400).json({ error: errorsResult.array()[0] });
    }
    next();
}

module.exports = { checkValidationResult };