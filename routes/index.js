"use strict";

const router = require("express").Router(),
biddingRoutes = require("./biddingRoutes"),
shoppingRoutes = require("./shoppingRoutes");

router.use("/bidding", biddingRoutes);
router.use("/shopping", shoppingRoutes);

module.exports = router;