const express = require("express");
const router = express.Router();
const hierarchyController = require("../controllers/hierarchyController");

// Aggregate child → parent
router.post("/aggregate", hierarchyController.aggregate);

// Trace Red Thread
router.get("/trace/:serial", hierarchyController.trace);

module.exports = router;

