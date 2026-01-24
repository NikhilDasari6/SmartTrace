const db = require("../config/db");
const { calculateCheckDigit } = require("../utils/checkDigitUtil");
const { generateHashes } = require("../utils/hashUtil");

exports.generateLabel = async (level, productId, productionDate) => {
  const prefixMap = {
    PRIMARY: "PRD1",
    SECONDARY: "CRT",
    TERTIARY: "SSCC"
  };

  const [[product]] = await db.query(
    "SELECT product_code FROM products WHERE product_id=?",
    [productId]
  );

 if (!product) {
    throw new Error(`Product not found for productId=${productId}`);
  }

  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

  const [[seqRow]] = await db.query(
    "SELECT COALESCE(MAX(label_id),0)+1 AS seq FROM labels"
  );

  const raw = prefixMap[level] + timestamp + String(seqRow.seq).padStart(6, "0");
  const cd = calculateCheckDigit(raw);
  const serial = raw + cd;

  const { fullHash, shortHash } = generateHashes(
    serial,
    productionDate,
    product.product_code,
    "SECRET_SALT_V1"
  );

  await db.query(
    `INSERT INTO labels
     (serial_number, packaging_level, product_id, production_date,
      full_hash, short_hash)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [serial, level, productId, productionDate, fullHash, shortHash]
  );

  return serial;
};


