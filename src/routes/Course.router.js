// @ts-check
const { Router } = require('express');
const router = Router();

// MIDDLEWARES
const {
    validateIdParam, validateBody, validateUpdateBody
} = require('../middlewares/validateCourse');

// CONTROLLERS
const Course = require('../controllers/Course.controller');

// POST /courses
router.post('/courses', validateBody, Course.createCourse);
// GET /courses/:id
router.get('/courses/:id', validateIdParam, Course.getCourseById)
// GET /courses
router.get('/courses', Course.getAllCourses);
// PUT /courses/:id
router.put('/courses/:id', validateIdParam, validateUpdateBody, Course.updateCourse);
// DELETE /courses/:id
router.delete('/courses/:id', validateIdParam, Course.deleteCourse);


module.exports = router;