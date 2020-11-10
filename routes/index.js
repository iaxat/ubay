"use strict";

const router = require("express").Router(),
homeRoutes = require("./homeRoutes"),
shoppingRoutes = require("./shoppingRoutes"),
biddingRoutes = require("./biddingRoutes"),
userRoutes = require("./userRoutes"),
errorRoutes = require("./errorRoutes");


router.use("/bidding", biddingRoutes);
router.use("/shopping", shoppingRoutes);
router.use("/user", userRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;