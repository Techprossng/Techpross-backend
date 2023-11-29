//@ts-check
const { db, TABLES } = require("../db");
const { Util } = require("../utils");

/* DEFINED DATA TYPES */

/**
 * @typedef {object} UInstructor
 * @property {string} name
 * @property {string} email
 * @property {number?} courseId
 *
 * @typedef {object} UInstructorUpdate
 * @property {string} name
 * @property {string} email
 * @property {number?} courseId
 */

/**
 * Instructor class is defined here. It contains the actions that can be
 * performed on a row in the database `instructors` table
 */

class Instructor {
  static selectFields = ["id", "name", "email", "courseId"];

  /** @private */
  static pageLimit = 20;

  /**
   * @async
   * add an instructor to the database
   * @param {UInstructor} instructorData
   */

  static async createNewInstructor(instructorData) {
    try {
      const [instructorId] = await db(TABLES.INSTRUCTORS).insert({
        ...instructorData,
      });
      return { id: instructorId, ...instructorData };
    } catch (error) {
      throw new Error("Failed To Create Instructor!");
    }
  }

  /**
   * @async
   * get an instructor by email
   * @param {string} instructorEmail
   */

  static async getInstructorByEmail(instructorEmail) {
    try {
      const instructor = await db(TABLES.INSTRUCTORS)
        .select(...this.selectFields)
        .where({ email: instructorEmail })
        .first();
      if (!instructor) {
        return null;
      }
      return Object.assign({}, instructor);
    } catch (error) {
      throw new Error("Unable to get instructor");
    }
  }

  /**
   * @async
   * get an instructor by id
   * @param {number} instructorId
   */

  static async getInstructorById(instructorId) {
    try {
      const instructor = await db(TABLES.INSTRUCTORS)
        .select(...this.selectFields)
        .where({ id: instructorId })
        .first();
      if (!instructor) {
        return null;
      }
      return Object.assign({}, instructor);
    } catch (error) {
      throw new Error("Unable to get instructor");
    }
  }

  /**
   * @async
   * returns all the instructors, and supports pagination
   * @param {number} [pageNum=1]
   * @returns {Promise<object>}
   */

  static async getAllInstructors(pageNum = 1) {
    //compute pagination
    const offset = Util.getOffset(pageNum, this.pageLimit);

    try {
      const allInstructors = await db(TABLES.INSTRUCTORS)
        .select(...this.selectFields)
        .limit(this.pageLimit) // No prepared value
        .offset(offset);

      //set new offset and get next page number
      const newOffset = this.pageLimit + offset;
      const nextPageNum = await Util.getNextPage(
        newOffset,
        this.pageLimit,
        TABLES.INSTRUCTORS
      );

      //cleanup object. Knex returns RowData {}, set to pure object
      const instructors = allInstructors.map((instructor) => {
        const instructorObj = Object.assign({}, instructor);
        return instructorObj;
      });

      return { instructors, nextPageNum };
    } catch (error) {
      throw new Error("Unable to get instructors");
    }
  }

  /**
   * updates an instructors info on the database
   * @param {UInstructorUpdate} instructorData
   * @param {number} instructorId
   */
  static async updateInstructor(instructorData, instructorId) {
    //define the expected keys
    const expectedKeys = ["name", "email", "courseId"];

    //get columns/keys to update
    const keysToUpdate = expectedKeys.filter(
      (key) => instructorData[key] !== undefined
    );

    //create object for update
    const InstructorDataToUpdate = {};
    for (const [key, value] of Object.entries(instructorData)) {
      if (keysToUpdate.indexOf(key) !== -1) {
        InstructorDataToUpdate[key] = value;
      }
    }

    try {
      //the .update() method returns the number of records changed. This number is saved in a variable (numberOfChanges)
      //so we can confirm how many records were changed to the client.
      const numberOfChanges = await db(TABLES.INSTRUCTORS)
        .where({ id: instructorId })
        .update({ ...InstructorDataToUpdate });

      return { instructorId, numberOfChanges, ...InstructorDataToUpdate };
    } catch (error) {
      throw new Error("Unable to update");
    }
  }

  /**
   * deletes an instructor from the database
   * @param {number} instructorId
   */
  static async deleteInstructorById(instructorId) {
    //get instructor
    try {
      const instructor = await this.getInstructorById(instructorId);
      if (!instructor) {
        throw new Error("Instructor not found");
      }
      //delete instructor
      await db(TABLES.INSTRUCTORS).where({ id: instructorId }).del();
      return true;
    } catch (error) {
      throw new Error("Unable to delete");
    }
  }
}

module.exports = Instructor;
