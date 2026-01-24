const express = require("express");
const router = express.Router();
const hierarchyController = require("../controllers/hierarchyController");

// Create parent–child link
router.post("/aggregate", hierarchyController.aggregate);

// Trace full hierarchy path
router.get("/trace/:serial", hierarchyController.trace);

module.exports = router;

