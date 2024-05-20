const express = require("express");
const router = express.Router();
const { dashboardController } = require("../imports/controllers.import");

// Dashboard route
router.get("/counts", dashboardController.getDashboardCounts);

module.exports = router;
