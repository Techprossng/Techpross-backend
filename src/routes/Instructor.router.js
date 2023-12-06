//@ts-check
const { Router } = require("express");
const router = Router();

//middlewares
const {
  validateInstructorBody,
  validateInstructorEmailParam,
  validateInstructorIdParam,
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
  validateInstructorIdParam,
  Instructor.updateInstructor
);

//DELETE /instructors/:id
router.delete(
  "/instructors/:id",
  validateInstructorIdParam,
  Instructor.deleteInstructor
);

module.exports = router;
