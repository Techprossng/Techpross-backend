//@ts-check
const { Router } = require("express");
const router = Router();

//middlewares
const {
  validateInstructorBody, validateInstructorEmailParam,
  validateInstructorIdParam, validateUpdateBody, validateUpdateIds
} = require("../middlewares/validateInstructor");

//controllers
const Instructor = require("../controllers/Instructor.controller");

//POST /instructors
router.post(
  "/instructors",
  validateInstructorBody,
  Instructor.createInstructor
);

// GET /instructors/:id
router.get(
  "/instructors/:id",
  validateInstructorIdParam,
  Instructor.getInstructorById
);

//GET /instructors/emails/:email
router.get(
  "/instructors/emails/:email",
  validateInstructorEmailParam,
  Instructor.getInstructorByEmail
);

//GET /instructors
router.get("/instructors", Instructor.getAllInstructors);

//PUT /instructors/:id
router.put(
  "/instructors/:id",
  validateInstructorIdParam, validateUpdateBody,
  Instructor.updateInstructor
);

// PUT /instructors/:id/courses/:id
router.put(
  "/instructors/:id/courses/:courseId",
  validateUpdateIds,
  Instructor.updateInstructorCourse
);

//DELETE /instructors/:id
router.delete(
  "/instructors/:id",
  validateInstructorIdParam,
  Instructor.deleteInstructor
);

module.exports = router;
