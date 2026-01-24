const express = require("express");
const router = express.Router();
const bulkController = require("../controllers/bulkController");

router.post("/generate", bulkController.generateBulk);

module.exports = router;

