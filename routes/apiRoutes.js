"use strict";

const router = require("express").Router(),
  apiController = require("../controllers/apiController");


router.get("/products",apiController.verifyToken, apiController.getProduct,apiController.respondJSON);
router.get("/token", apiController.getToken);
router.get("/external", apiController.externalApi);

module.exports = router;