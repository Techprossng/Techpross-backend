// @ts-check
//EXPRESS ROUTER
const express = require("express");
const router = express.Router();

// MIDDLEWARES
const {
  validateLoginInput, validateLogoutParam
} = require("../middlewares/validateLoginLogout");
const { validateSignupInput } = require("../middlewares/validateSignUp");
const { verifyToken } = require("../middlewares/verifyToken");

// CONTROLLERS
const UserController = require("../controllers/User.controller");

// USER AUTH
router.post(
  "/auth/users/signUp", validateSignupInput, UserController.register
);


module.exports = router;
