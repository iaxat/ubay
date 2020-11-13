"use strict";

const router = require("express").Router(),
  biddingController = require("../controllers/biddingController");

router.get("/", biddingController.index, biddingController.indexView);
router.get("/sell",biddingController.sell);
router.post("/create",biddingController.create, biddingController.redirectView);


module.exports = router;