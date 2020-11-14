"use strict";

const router = require("express").Router(),
  shoppingController = require("../controllers/shoppingController");

router.get("/", shoppingController.index, shoppingController.indexView);
router.get("/sell", shoppingController.sell);
router.post("/create", shoppingController.create, shoppingController.redirectView);




module.exports = router;
