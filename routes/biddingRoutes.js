"use strict";

const router = require("express").Router(),
  biddingController = require("../controllers/biddingController");

router.get("/", biddingController.updateProduct,biddingController.index, biddingController.indexView);
router.get("/sell", biddingController.sell);
router.post("/create", biddingController.create, biddingController.redirectView);
router.get("/:id/:id2/placeBid", biddingController.placeBid, biddingController.redirectView);

module.exports = router;