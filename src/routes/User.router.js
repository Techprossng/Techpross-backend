//EXPRESS ROUTER
const express = require("express");
const router = express.Router();

//MIDDLEWARES
const {
  checkValidationResult,
} = require("../middlewares/checkValidationResult");
const { validateLoginLogout } = require("../middlewares/validateLoginLogout");
const { validateSignUp } = require("../middlewares/validateSignUp");
const { verifyToken } = require("../middlewares/verifyToken");

//CONTROLLERS
const UserController = require("../controllers/User.controller");

router.post(
  "/auth/users/signUp",
  validateSignUp,
  checkValidationResult,
  UserController.register
);

module.exports = router;
