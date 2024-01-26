// @ts-check
//EXPRESS ROUTER
const express = require("express");
const router = express.Router();

// MIDDLEWARES
const {
  validateUserBody, validateUserSession, validateLoginInput,
  validateLogoutParam, validateIdParam, validateUpdateBody
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

// User GET
router.get("/users/:userId", validateIdParam, validateUserSession, UserController.getUser);
// User update (PUT)
router.put("/users/:userId",
  validateIdParam, validateUserSession,
  validateUpdateBody, UserController.update
);


module.exports = router;
