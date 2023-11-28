//@ts-check

const Instructor = require("../models/Instructor");
const { Util } = require("../utils");

//DEFINED TYPES
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

async function validateInstructorBody(request, response, next) {
  const { name, email } = request.body;

  //email validation
  if (!email) {
    return response.status(400).json({ error: "Missing email" });
  }
  if (typeof email !== "string" || !Util.checkIsEmail(email)) {
    return response.status(400).json({ error: "Invalid email" });
  }
  //name validation
  if (!name) {
    return response.status(400).json({ error: "Missing name" });
  }
  if (typeof name !== "string" || !Util.checkString(name)) {
    return response.status(400).json({ error: "Missing name" });
  }

  return next();
}

/**
 * validate emails from instructor for GET request
 * @type {Handler}
 */
async function validateInstructorEmailParam(request, response, next) {
  const { email } = request.params;

  if (!email) {
    return response.status(400).json({ error: "Missing error" });
  }

  if (typeof email !== "string" || Util.checkIsEmail(email)) {
    return response.status(400).json({ error: "Invalid email" });
  }
  next();
}

/**
 * validates id for GET, PUT and DELETE requests
 * @type {Handler}
 */
async function validateInstructorIdParam(request, response, next) {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({ error: "Missing id" });
  }

  const instructorId = parseInt(id, 10);

  if (
    !Util.checkDigit(id) ||
    typeof instructorId !== "number" ||
    isNaN(instructorId)
  ) {
    //check if instructor exists
    const instructor = await Instructor.getInstructorById(instructorId);

    //check HTTP method for DELETE
    if (request.method === "DELETE") {
      //enforce idempotency
      if (!instructor) {
        return response.status(404).json({});
      }
      return next();
    }
    //handle GET and PUT requests
    if (request.method === "GET" || request.method === "PUT") {
      if (!instructor) {
        return response.status(404).json({ error: "Instructor not found" });
      }
    }
    next();
  }
}

module.exports = {
  validateInstructorBody,
  validateInstructorEmailParam,
  validateInstructorIdParam,
};
