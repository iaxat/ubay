"use strict";

const router = require("express").Router(),
  biddingController = require("../controllers/biddingController");

router.get("/", biddingController.index);

module.exports = router;