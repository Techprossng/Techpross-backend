//@ts-check

const Instructor = require("../models/Instructor");
const { Util } = require("../utils");

/**
 * @typedef {object} UInstructorUpdate
 * @property {string} name
 * @property {string} email
 * @property {number?} courseId
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
    const { name, email, courseId } = request.body;

    const instructorData = { name, email, courseId };

    try {
      //create a new instructor
      const instructor = await Instructor.createNewInstructor(instructorData);

      const returnData = { message: "success", ...instructor };

      return response.status(201).json(returnData);
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

    //get the page number
    const { page } = request.query;

    //Exit if 'page is anything other than a string
    if (typeof page !== "string") return;

    //parse page number
    if (!page || !Util.checkDigit(page)) {
      pageNum = 1;
    } else {
      //page number must be greater than 0
      pageNum = parseInt(page, 10) <= 0 ? 1 : parseInt(page, 10);
    }

    try {
      //get instructors by page
      const { data, nextPageNum } = await Instructor.getAllInstructors(pageNum);

      const toReturn = { data, current: pageNum, next: nextPageNum };

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
    const { instructorId } = request.params;
    const { name, email, courseId } = request.body;
    if (!instructorId) {
      return response.status(404).json({ error: "Missing instructorId" });
    }
    /** @see Util for implentation details */
    // check for valid id
    if (!Util.checkDigit(instructorId)) {
      return response.status(400).json({ error: "Invalid instructorId" });
    }

    /** @type {UInstructorUpdate} */
    const dataToUpdate = { name, email, courseId };

    try {
      const updatedData = await Instructor.updateInstructor(
        dataToUpdate,
        instructorId
      );

      const returnData = { message: "Update successful", ...updatedData };

      return response.status(200).json(returnData);
    } catch (error) {
      return response.status(500).json({ error: "Internal server error" });
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
      return response.status(200).json(toReturn);
    } catch (error) {
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = InstructorController;
