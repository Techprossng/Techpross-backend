//@ts-check
const Course = require("../models/Course");
const Instructor = require('../models/Instructor');
const { Util } = require("../utils");

//DEFINED TYPES
/**
 * @callback HandlerMiddleware
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */

/**
 * validate body of request
 * @type {HandlerMiddleware}
 */

async function validateInstructorBody(request, response, next) {
  const { name, email, phone } = request.body;

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

  // phone validation
  if (phone) {
    if (typeof phone !== 'string' || !Util.checkPhone(phone)) {
      return response.status(400).json({ error: "Invalid phone" });
    }
  }

  return next();
}

/**
 * validate emails from instructor for GET request
 * @type {HandlerMiddleware}
 */
async function validateInstructorEmailParam(request, response, next) {
  const { email } = request.params;

  if (!email) {
    return response.status(400).json({ error: "Missing error" });
  }

  // Util.checkIsEmail(email) function is causing the request to fail. Please check.
  if (typeof email !== "string") {
    return response.status(400).json({ error: "Invalid email" });
  }

  //check if the instructor exists
  const instructor = await Instructor.getInstructorByEmail(email);

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

/**
 * validates id for GET, PUT and DELETE requests
 * @type {HandlerMiddleware}
 */
async function validateInstructorIdParam(request, response, next) {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({ error: "Missing id" });
  }

  const instructorId = parseInt(id, 10);

  /** @see Util for implentation details */
  if (
    !Util.checkDigit(id) ||
    typeof instructorId !== "number" ||
    isNaN(instructorId)
  ) {
    return response.status(400).json({ error: "Invalid instructor id" });
  }

  //check if instructor exists
  const instructor = await Instructor.getInstructorById(instructorId);

  //check HTTP method for DELETE
  if (request.method === "DELETE") {
    // enforce idempotency
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

/**
 * ### validates the body properties for `PUT` request
 * @type {HandlerMiddleware} 
 */
async function validateUpdateBody(request, response, next) {
  const { name, courseId, phone } = request.body;
  /** @type {number} */
  let courseIdNum;

  // update object
  const updateBody = {
    name, phone,
    courseIdNum: courseId ? parseInt(courseId, 10) : 0
  }

  // get defined body values in PUT requests
  const updateBodyValues = Object.values(updateBody).filter((value) => {
    if (value) {
      return value;
    }
  });

  // check empty body
  if (updateBodyValues.length === 0) {
    return response.status(204).json({})
  }

  // name
  if (
    name &&
    (typeof name !== 'string' || !/^[A-Za-z].+$/.test(name))
  ) {
    return response.status(400).json({ error: 'Invalid name' });
  }

  if (
    phone &&
    (typeof phone !== 'string' || !Util.checkPhone(phone))
  ) {
    return response.status(400).json({ error: 'Invalid phone' });
  }

  // courseId
  if (courseId) {
    courseIdNum = parseInt(courseId, 10);
    if (
      !Util.checkDigit(courseId) ||
      typeof courseId !== 'number' ||
      isNaN(courseIdNum)
    ) {
      return response.status(400).json({ error: 'Invalid courseId' });
    }
    // get instructor
    const course = await Course.getCourseById(courseIdNum);

    // Non-existing course cannot be updated with instructor
    if (!course) {
      return response.status(400).json({ error: 'Course Not Found' });
    }

    // assigned course cannot be used for update
    if (course.instructorId) {
      return response.status(400).json({ error: 'Course already assigned' });
    }
  }

  return next();
}


module.exports = {
  validateInstructorBody,
  validateInstructorEmailParam,
  validateInstructorIdParam,
  validateUpdateBody
};
