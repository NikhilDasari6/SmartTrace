const express = require("express");
const router = express.Router();
const labelController = require("../controllers/labelController");

// Serial generation only
router.post("/generate", labelController.generateSerial);

module.exports = router;

