const { validationResult } = require('express-validator');

/**
 * ### General Middleware
 * - This middleware checks for any error in the middlewares called before it.
 * - It is the last middleware before the final function/route handler
 */
function checkValidationResult(req, res) {
    // check for errors
    const errorsResult = validationResult(req)
    // This is an array of { msg: "error msg", path: 'field' }
    // field can be email, password, firstName etc...
    if (errorsResult) {
        return res.status(400).json({ error: errorsResult.array() })
    }
    return next();
}

module.exports = { checkValidationResult };