"use strict";

const router = require("express").Router(),
  homeController = require("../controllers/homeController");

router.get("/", homeController.index);
router.get("/category/:id", homeController.category, homeController.categoryView);


module.exports = router;
