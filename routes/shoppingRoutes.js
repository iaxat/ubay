"use strict";

const router = require("express").Router(),
  shoppingController = require("../controllers/shoppingController");

router.get("/", shoppingController.index, shoppingController.indexView);
router.get("/sell", shoppingController.sell);
router.post("/create", shoppingController.create, shoppingController.redirectView);
router.get("/:id/addToCart",shoppingController.addToCart,shoppingController.redirectView);
router.get("/:id/buy",shoppingController.addToCart,shoppingController.redirectView);
router.get("/cart",shoppingController.showCart);

module.exports = router;
