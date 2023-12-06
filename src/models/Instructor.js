// @ts-check
const { db, TABLES } = require("../db");
const { Util } = require("../utils");

/* DEFINED DATA TYPES */

/**
 * @typedef {object} UInstructor
 * @property {string} name
 * @property {string} email
 * @property {string?} phone
 * @property {number?} courseId
 *
 * @typedef {object} UInstructorUpdate
 * @property {string?} name
 * @property {string?} phone
 * @property {number?} courseId
 */

/**
 * Instructor class is defined here. It contains the actions that can be
 * performed on a row in the database `instructors` table
 */

class Instructor {
  static selectFields = ["id", "name", "email", "courseId", "phone"];

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
    // compute pagination
    const offset = Util.getOffset(pageNum, this.pageLimit);

    try {
      const [allInstructors] = await db.raw(
        `SELECT ins.id, ins.name, ins.email, ins.phone,
        c.name as courseName, c.id as courseId,
        c.description AS courseDescription
        FROM instructors ins
        LEFT JOIN courses c
        ON ins.courseId = c.id
        LIMIT ?, ?
        `, [offset, this.pageLimit]
      );

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
    const expectedKeys = ["name", "courseId", "phone"];

    //get columns/keys to update
    const keysToUpdate = expectedKeys.filter((key) => {
      if (key === 'courseId') {
        return 'courseId'
      }
      return instructorData[key] !== undefined
    }
    );

    //create object for update
    const instructorDataToUpdate = {};
    for (const [key, value] of Object.entries(instructorData)) {
      // check courseId
      if (key === 'courseId' && !value) {
        instructorDataToUpdate[key] = null;
        continue;
      }
      if (keysToUpdate.indexOf(key) !== -1) {
        instructorDataToUpdate[key] = value;
      }
    }

    try {
      // the update() method returns the id of the updated column.
      const idOfCoulumn = await db(TABLES.INSTRUCTORS)
        .where({ id: instructorId })
        .update({ ...instructorDataToUpdate });

      return { id: idOfCoulumn, ...instructorDataToUpdate };
    } catch (error) {
      console.error(error);
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
