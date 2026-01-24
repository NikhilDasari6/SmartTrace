const express = require("express");
const router = express.Router();
const labelController = require("../controllers/labelController");

router.post("/generate", labelController.generateLabel);
router.post("/verify", labelController.verifyLabel);

module.exports = router;
