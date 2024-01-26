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

            return response.status(204).json({});

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
        const { name, price, description } = request.body;

        if (!id) {
            return response.status(400).json({ error: 'Missing id' });
        }

        // define update parameters
        const dataToUpdate = {
            name, price, description
        }
        const courseId = parseInt(id, 10);

        try {

            const updatedData = await Course.updateCourse(courseId, dataToUpdate);

            const returnData = { message: 'success', ...updatedData };

            return response.status(200).json(returnData);

        } catch (error) {
            return response.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * updates a course's instructorId: reassign course to new instructor
     * or no instructor
     * @type {Handler}
     */
    static async updateCourseInstructor(request, response) {
        const { id, instructorId } = request.params;
        // objects from middleware
        const { course, instructor } = response.locals.updateObject;

        /** @type {number} */
        let instructorIdNum;
        /** @type {number} */
        let courseId;

        courseId = parseInt(id, 10);
        instructorIdNum = parseInt(instructorId, 10);

        try {
            // check instructor, and update only for ids > 0
            if (instructor && instructorIdNum) {
                // update instructor with new course
                await Instructor.updateInstructor({ courseId }, instructorIdNum);
                // update course with new instructor Id
                await Course.updateCourse(courseId, { instructorId: instructorIdNum });

                return response.status(200).json({
                    message: 'success', courseId,
                    instructorId: instructorIdNum
                });
            }

            // assign instructor to unassigned course
            if (!course.instructorId && instructorIdNum) {
                await Promise.all([
                    Instructor.updateInstructor({ courseId }, instructorIdNum),
                    Course.updateCourse(courseId, { instructorId: instructorIdNum })
                ]);
                return response.status(200).json({
                    message: 'success', courseId,
                    instructorId: instructorIdNum
                })
            }

            // update instructor for reassignment to no course
            // This is to ensure consistency between data in tables
            if (course.instructorId && instructorIdNum === 0) {
                await Promise.all([
                    Instructor.updateInstructor({ courseId: null }, course.instructorId),
                    Course.updateCourse(courseId, { instructorId: null })
                ]);
                return response.status(200).json({
                    message: 'success', courseId,
                    instructorId: null
                });
            }

            // no assignment to course or instructor
            if (!course.instructorId && instructorIdNum === 0) {
                return response.status(204).json({});
            }



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