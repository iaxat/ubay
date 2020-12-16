"use strict";

const router = require("express").Router(),
    homeRoutes = require("./homeRoutes"),
    shoppingRoutes = require("./shoppingRoutes"),
    biddingRoutes = require("./biddingRoutes"),
    userRoutes = require("./userRoutes"),
    errorRoutes = require("./errorRoutes"),
    adminRoutes = require("./adminRoutes"),
    apiRoutes = require("./apiRoutes");


router.use("/bidding", biddingRoutes);
router.use("/shopping", shoppingRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;