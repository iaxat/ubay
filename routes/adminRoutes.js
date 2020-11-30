"use strict";

const router = require("express").Router(),
  adminController = require("../controllers/adminController");

router.get("/bidding", adminController.bidding, adminController.biddingView);
router.get("/shopping", adminController.shopping, adminController.shoppingView);
router.get("/:id/approve", adminController.approve,adminController.redirectView);
router.get("/:id/disapprove",adminController.disapprove,adminController.redirectView);

module.exports = router;