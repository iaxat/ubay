"use strict";

const router = require("express").Router(),
  userController = require("../controllers/userController");

//router.get("/", userController.index);
router.get("/login", userController.login);
router.get("/signup", userController.signup);
router.post("/login",userController.authenticate);
router.get("/new", userController.new);
router.post("/create",
userController.validate,
userController.create,
userController.redirectView
); 

module.exports = router;