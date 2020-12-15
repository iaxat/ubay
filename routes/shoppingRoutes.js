"use strict";

const router = require("express").Router(),
  shoppingController = require("../controllers/shoppingController");

router.get("/", shoppingController.index, shoppingController.indexView);
router.get("/sell", shoppingController.sell);
router.post("/create", shoppingController.create, shoppingController.redirectView);
router.get("/:id/addToCart",shoppingController.addToCart,shoppingController.redirectView);
router.get("/:id/cart",shoppingController.showCart,shoppingController.redirectView);

module.exports = router;
