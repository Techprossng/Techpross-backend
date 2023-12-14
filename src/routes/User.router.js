// @ts-check
//EXPRESS ROUTER
const express = require("express");
const router = express.Router();

// MIDDLEWARES
const {
  validateUserBody, validateUserSession, validateLoginInput, validateLogoutParam, validateIdParam
} = require('../middlewares/validateUser');


// CONTROLLERS
const UserController = require("../controllers/User.controller");

// USER AUTH
router.post(
  "/auth/users/register", validateUserBody, UserController.register
);

router.post("/auth/users/login", validateLoginInput, UserController.login);
router.post(
  "/auth/users/:userId/logout", validateLogoutParam,
  validateUserSession, UserController.logout
);
router.get("/users/:userId", validateIdParam, validateUserSession, UserController.getUser)
router.put("/users/:userId", validateIdParam, validateUserSession, UserController.update);


module.exports = router;
