const db = require("../config/db");
const { calculateCheckDigit } = require("../utils/checkDigitUtil");
const { generateHashes } = require("../utils/hashUtil");

async function getNextSequence(count) {
  const values = Array.from({ length: count }, () => []);
  const [result] = await db.query(
    "INSERT INTO serial_sequence VALUES ?",
    [values]
  );

  const start = result.insertId;
  return Array.from({ length: count }, (_, i) => start + i);
}

function buildSerial(prefix, seq) {
  const raw = prefix + String(seq).padStart(12, "0");
  return raw + calculateCheckDigit(raw);
}

exports.generate = async (productId, totalUnits) => {
  if (totalUnits % 10 !== 0) {
    throw new Error("Units must be multiple of 10");
  }

  const productionDate = new Date().toISOString().slice(0, 10);
  const cartonsNeeded = totalUnits / 10;

  const [[product]] = await db.query(
    "SELECT product_code FROM products WHERE product_id=?",
    [productId]
  );

  if (!product) throw new Error("Product not found");

  const totalSerials = 1 + cartonsNeeded + totalUnits;
  const sequences = await getNextSequence(totalSerials);
  let idx = 0;

  const labels = [];
  const aggregations = [];

  const palletSerial = buildSerial("SSCC", sequences[idx++]);
  labels.push(palletSerial);

  const cartonSerials = [];
  for (let i = 0; i < cartonsNeeded; i++) {
    const serial = buildSerial("CRT", sequences[idx++]);
    cartonSerials.push(serial);
    labels.push(serial);
  }

  const unitSerials = [];
  for (let i = 0; i < totalUnits; i++) {
    const serial = buildSerial("PRD1", sequences[idx++]);
    unitSerials.push(serial);
    labels.push(serial);
  }

  const labelValues = labels.map(serial => {
    const { fullHash, shortHash } = generateHashes(
      serial,
      productionDate,
      product.product_code,
      "SECRET_SALT_V1"
    );

    return [
      serial,
      serial.startsWith("SSCC")
        ? "TERTIARY"
        : serial.startsWith("CRT")
        ? "SECONDARY"
        : "PRIMARY",
      productId,
      productionDate,
      fullHash,
      shortHash
    ];
  });

  await db.query(
    `INSERT INTO labels
     (serial_number, packaging_level, product_id, production_date, full_hash, short_hash)
     VALUES ?`,
    [labelValues]
  );

  const [rows] = await db.query(
    `SELECT label_id, serial_number FROM labels
     WHERE serial_number IN (?)`,
    [labels]
  );

  const idMap = {};
  rows.forEach(r => {
    idMap[r.serial_number] = r.label_id;
  });

  cartonSerials.forEach(carton => {
    aggregations.push([idMap[palletSerial], idMap[carton]]);
  });

  for (let i = 0; i < cartonSerials.length; i++) {
    for (let j = 0; j < 10; j++) {
      const unit = unitSerials[i * 10 + j];
      aggregations.push([idMap[cartonSerials[i]], idMap[unit]]);
    }
  }

  await db.query(
    `INSERT INTO aggregation (parent_label_id, child_label_id)
     VALUES ?`,
    [aggregations]
  );

  return {
    units_generated: totalUnits,
    cartons_generated: cartonsNeeded,
    pallet_generated: 1
  };
};

