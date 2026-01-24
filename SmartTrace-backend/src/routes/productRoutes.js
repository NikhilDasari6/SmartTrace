const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/create", productController.create);
router.get("/by-code/:code", productController.getByCode);

module.exports = router;

