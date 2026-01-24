const express = require("express");
const router = express.Router();
const verificationController = require("../controllers/verificationController");

// Verify a scanned label
router.post("/verify", verificationController.verify);

module.exports = router;

