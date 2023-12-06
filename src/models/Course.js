//@ts-check
const { db, TABLES } = require('../db');
const { Util } = require('../utils/index');

/**
 * @typedef {object} ICourse
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number?} instructorId
 */

/**
 * Course class is defined here. It contains the actions that can be
 * performed on a row in the database `courses` table.
 */

class Course {
    static selectFields = [
        'id', 'name', 'description', 'price', 'instructorId'
    ];

    /** @private */
    static pageLimit = 20;

    /**
     * @async
     * @param {ICourse} courseInfo 
     */
    static async createNewCourse(courseInfo) {
        // get the information needed to create a new course
        try {

            const [courseId] = await db(TABLES.COURSES).insert({ ...courseInfo })

            return { id: courseId, ...courseInfo };
        } catch (error) {
            throw new Error("Course Creation Failed!")
        }
    }

    /**
     * @async
     * get a course by id
     * @param {number} courseId 
     */
    static async getCourseById(courseId) {

        try {
            // JOIN query to get instructor's name with course data
            // an array of array is returned, hence destructured to
            // give the course data array
            const [course] = await db.raw(
                `SELECT c.id, c.name, c.description, c.price,
                ins.name as instructorName, ins.id as instructorId,
                ins.email AS instructorEmail
                FROM courses c
                LEFT JOIN instructors ins
                ON c.instructorId = ins.id
                WHERE c.id = ?
                `, [courseId]
            );

            // The first argument is an array that contains the course data
            // of object type RowDataPacket: [ RowDataPacket {} ]
            if (course.length === 0) {
                return null;
            }

            // course data is the first item in the array
            // a new assignment is given because knex returns
            // RowDataPacket object
            const courseData = Object.assign({}, course[0]);
            return courseData;

        } catch (error) {
            throw new Error(`Error in query: ${error.message}`);
        }
    }

    /**
    * ### returns all courses. also supports pagination
    * @param {number} [pageNum=1]
    * @returns {Promise<object>}
    */
    static async getAllCourses(pageNum = 1) {
        // compute pagination
        const offset = Util.getOffset(pageNum, this.pageLimit);

        try {
            // JOIN query to get instructor's name with course data
            // an array of array is returned, hence destructured to
            // give the course data array
            const [allCourses] = await db.raw(
                `SELECT c.id, c.name, c.description, c.price,
                ins.name as instructorName, ins.id as instructorId,
                ins.email AS instructorEmail
                FROM courses c
                LEFT JOIN instructors ins
                ON c.instructorId = ins.id
                LIMIT ?, ?
                `, [offset, this.pageLimit]
            );

            // set new offset and get next page number
            const newOffset = this.pageLimit + offset;
            const nextPageNum = await Util.
                getNextPage(newOffset, this.pageLimit, TABLES.COURSES);

            /**
             * cleanup object. knex returns object of type RowDataPacket {},
             * set to javascript object: {}
             */
            const courses = allCourses.map(course => {
                const courseObj = Object.assign({}, course);
                return courseObj;
            });

            return { courses, nextPageNum };

        } catch (error) {
            throw new Error('Unable to get users');
        }
    }


    /**
     * updates a course info
     * @param {number} courseId 
     * @param {object} courseData 
     */
    static async updateCourse(courseId, courseData) {
        // expected keys to update
        const expectedKeys = [
            'name', 'description', 'price', 'instructorId'
        ];
        // undefined keys are filtered out
        const keysToUpdate = expectedKeys.filter((key) => {
            return courseData[key] !== undefined
        });

        // create object for update
        const dataToUpdate = {};
        for (const [key, value] of Object.entries(courseData)) {
            // check courseId
            if (key === 'instructorId' && !value) {
                dataToUpdate[key] = null;
                continue;
            }
            if (keysToUpdate.indexOf(key) !== -1) {
                dataToUpdate[key] = value;
            }
        }


        try {
            const id = await db(TABLES.COURSES)
                .where({ id: courseId })
                .update({ ...dataToUpdate });

            return { id, ...dataToUpdate }
        } catch (error) {
            console.log(error);
            throw new Error(`Error in update query: ${error.message}`);
        }
    }

    /**
     * deletes a course from the database
     * @param {number} courseId 
     */
    static async deleteCourse(courseId) {
        try {
            // search for the course
            const course = await this.getCourseById(courseId);
            // course already deleted
            if (!course) {
                return true;
            }
            // delete course
            await db(TABLES.COURSES).where({ id: courseId }).del()
            return true;
        } catch (error) {
            throw new Error('Unable To Delete Course')
        }
    }
}

module.exports = Course;