const db = require("../config/db");

/**
 * Creates a test product if database is empty.
 * Safe to run multiple times.
 */
exports.bootstrapTestProduct = async () => {
  const [[count]] = await db.query(
    "SELECT COUNT(*) AS c FROM products"
  );

  if (count.c === 0) {
    await db.query(
      `INSERT INTO products (product_code, product_name)
       VALUES ('TEST_PRD', 'Test Product (Auto)')`
    );
    console.log("🧪 Test product created");
  }
};
