const db = require("../config/db");

exports.create = async (req, res) => {
  const { product_code, product_name } = req.body;

  await db.query(
    "INSERT IGNORE INTO products (product_code, product_name) VALUES (?, ?)",
    [product_code, product_name]
  );

  res.status(201).json({ message: "Product ensured" });
};

exports.getByCode = async (req, res) => {
  const [[product]] = await db.query(
    "SELECT product_id FROM products WHERE product_code = ?",
    [req.params.code]
  );

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
};

