const express = require("express");
const router = express.Router();
const labelController = require("../controllers/labelController");

// Generate a new label (PRIMARY / SECONDARY / TERTIARY)
router.post("/generate", labelController.generateLabel);

module.exports = router;

