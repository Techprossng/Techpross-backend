//@ts-check

const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const { Util } = require("../utils");

/**
 * @typedef {object} UInstructorUpdate
 * @property {string?} name
 * @property {string?} phone
 * @prop {number?} courseId
 *
 *
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

class InstructorController {
  /**
   * create a new instructor
   * @type {Handler}
   */
  static async createInstructor(request, response) {
    const { name, email, courseId, phone } = request.body;

    const instructorData = { name, email, courseId, phone };

    try {
      const instructor = await Instructor.createNewInstructor(instructorData);

      const returnInstructorData = { message: "success", ...instructor };
      return response.status(201).json(returnInstructorData);

    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * retrieves an instructor by email
   * @type {Handler}
   */
  static async getInstructorByEmail(request, response) {
    const { email } = request.params;

    try {
      const instructor = await Instructor.getInstructorByEmail(email);

      if (!instructor) {
        return response.status(404).json({ error: "Instructor not found" });
      }
      return response.status(200).json({ message: "success", ...instructor });

    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * retrieves an instructor by id
   * @type {Handler}
   */
  static async getInstructorById(request, response) {
    const { id } = request.params;

    const instructorId = parseInt(id, 10);

    try {
      const instructor = await Instructor.getInstructorById(instructorId);
      if (!instructor) {
        return response.status(404).json({ error: "Instructor not found" });
      }

      return response.status(500).json({ message: "success", ...instructor });
    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * retrieves the instructors by page
   * @type {Handler}
   *
   */
  static async getAllInstructors(request, response) {
    let pageNum;

    // get the page number
    const { page } = request.query;

    // parse page number
    if (!page || !Util.checkDigit(page)) {
      pageNum = 1;
    } else {
      // page number must be greater than 0
      pageNum = parseInt(page, 10) <= 0 ? 1 : parseInt(page, 10);
    }

    try {
      // get instructors by page
      const { instructors, nextPageNum } = await Instructor.getAllInstructors(
        pageNum
      );
      const toReturn = { instructors, current: pageNum, next: nextPageNum };

      return response.status(200).json({ message: "success", ...toReturn });
    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Update instructor
   * @type {Handler}
   */
  static async updateInstructor(request, response) {
    const { id } = request.params;
    const { name, phone } = request.body;

    const instructorId = parseInt(id, 10);


    if (!instructorId) {
      return response.status(404).json({ error: "Missing instructorId" });
    }

    /** @type {UInstructorUpdate} */
    const instructorDataToUpdate = { name, phone };

    try {

      const updatedInstructorData = await Instructor.updateInstructor(
        instructorDataToUpdate,
        instructorId
      );

      const updatedInstructor = {
        message: "success",
        ...updatedInstructorData,
      };

      return response.status(200).json(updatedInstructor);
    } catch (error) {
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  /**
     * updates a course's instructorId: reassign course to new instructor
     * or no instructor
     * @type {Handler}
     */
  static async updateInstructorCourse(request, response) {
    const { id, courseId } = request.params;
    // objects from middleware
    const { course, instructor } = response.locals.updateObject;

    /** @type {number} */
    let courseIdNum;
    /** @type {number} */
    let instructorId;

    instructorId = parseInt(id, 10);
    courseIdNum = parseInt(courseId, 10);

    try {
      // check course, and update only for ids > 0
      if (course && courseIdNum) {
        // update course id with new instructor
        await Course.updateCourse(courseIdNum, { instructorId });
        // update instructor id of course, if present
        await Instructor.updateInstructor({ courseId: courseIdNum }, instructorId);

        return response.status(200).json({
          message: 'success', instructorId,
          courseId: courseIdNum
        });
      }

      // assign course to unassigned instructor
      if (!instructor.courseId && courseIdNum) {
        await Promise.all([
          Instructor.updateInstructor({ courseIdNum }, instructorId),
          Course.updateCourse(courseIdNum, { instructorId })
        ]);
        return response.status(200).json({
          message: 'success', instructorId,
          courseId: courseIdNum
        })
      }

      // update instructor for reassignment to no-course
      // This is to ensure consistency between data in tables
      if (instructor.courseId && courseIdNum === 0) {
        await Promise.all([
          Instructor.updateInstructor({ courseId: null }, instructorId),
          Course.updateCourse(instructor.courseId, { instructorId: null })
        ]);
        return response.status(200).json({
          message: 'success', instructorId,
          courseId: null
        });
      }

      // no assignment to course or instructor
      if (!instructor.courseId && courseIdNum === 0) {
        return response.status(204).json({});
      }

    } catch (error) {
      return response.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * deletes an instructor with the given id
   * @type {Handler}
   */
  static async deleteInstructor(request, response) {
    const { id } = request.params;

    const instructorId = parseInt(id, 10);

    try {
      const isDeleted = await Instructor.deleteInstructorById(instructorId);
      if (!isDeleted) {
        throw new Error("Could not delete");
      }
      const toReturn = { message: "success", id };
      return response.status(204).json(toReturn);
    } catch (error) {
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = InstructorController;
