// @ts-check
const Course = require('../models/Course');
const Instructor = require('../models/Instructor');
const { Util } = require('../utils/index');

/**
 * @callback Handler
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

class CourseController {

    /**
     * create a new course
     * @type {Handler}
     */
    static async createCourse(request, response) {
        const { name, description, price, instructorId } = request.body;

        const courseData = { name, description, price, instructorId }

        try {
            // create a new course
            const course = await Course.createNewCourse(courseData)

            const returnData = { message: "success", ...course };

            return response.status(201).json(returnData);

        } catch (error) {
            return response.status(500).json({ error: "Internal Server Error" })
        }
    }

    /**
     * retrieves a course by the id
     * @type {Handler}
     */
    static async getCourseById(request, response) {
        const { id } = request.params;

        const courseId = parseInt(id, 10);

        try {
            // check if course exists
            const course = await Course.getCourseById(courseId)
            if (!course) {
                return response.status(404).json({ error: "Course Not Found" })
            }

            return response.status(200).json({ message: "success", ...course })
        } catch (error) {
            return response.status(500).json({ error: "Internal Server Error" })
        }
    }

    /**
     * removes a course from the database by it's id
     * @type {Handler}
     */
    static async deleteCourse(request, response) {
        const { id } = request.params;

        const courseId = parseInt(id, 10)
        try {
            // check if the course exists
            const courseExists = await Course.getCourseById(courseId);

            if (!courseExists) {
                return response.status(404).json({ error: "Course Not Found" });
            }
            // delete course
            const courseIsDeleted = await Course.deleteCourse(courseId);

            if (!courseIsDeleted) {
                throw new Error("Could Not Delete Course");
            }
            const toReturn = { message: "success", id: courseId };

            return response.status(204).json(toReturn);

        } catch (error) {
            return response.status(500).json({ error: "Internal Server Error" });
        }
    }

    /**
     * Update course
     * @type {Handler}
     */
    static async updateCourse(request, response) {
        const { id } = request.params;
        const { name, price, description, instructorId } = request.body;

        if (!id) {
            return response.status(400).json({ error: 'Missing id' });
        }

        // define update parameters
        const dataToUpdate = {
            name, price, description, instructorId
        }
        const courseId = parseInt(id, 10);

        try {
            // get instructor assigned to course, if any and update
            const course = await Course.getCourseById(courseId);

            // update instructor for reassignment to no course
            // This is to ensure consistency between data in tables
            if (course.instructorId && (instructorId === 0 || !instructorId)) {
                await Instructor.updateInstructor({ courseId: null }, course.instructorId)
            }
            // update instructor id of course, if present
            if (instructorId) {
                await Instructor.updateInstructor({ courseId }, instructorId)
            }
            const updatedData = await Course.updateCourse(courseId, dataToUpdate);

            const returnData = { message: 'success', ...updatedData };

            return response.status(200).json(returnData);

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
   * retrieves subscribers by page
   * @type {Handler}
   */
    static async getAllCourses(request, response) {
        let pageNum;

        // get page number
        const { page } = request.query;

        // parse page number
        if (!page || !Util.checkDigit(page)) {
            pageNum = 1;
        } else {
            // page number must be greater than 0
            pageNum = parseInt(page, 10) <= 0 ? 1 : parseInt(page, 10);
        }

        try {
            // get courses by page
            const { courses, nextPageNum } = await Course.getAllCourses(pageNum);

            const toReturn = { courses, current: pageNum, next: nextPageNum }

            return response.status(200).json({ message: 'success', ...toReturn });

        } catch (error) {
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
}


module.exports = CourseController