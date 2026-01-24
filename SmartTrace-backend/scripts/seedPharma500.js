/**
 * Seed Pharmaceutical Product with 500 Units
 * Hierarchy:
 * PRIMARY (units) -> SECONDARY (cartons) -> TERTIARY (pallets)
 */

const db = require("../src/config/db");

// ---------- CONFIG ----------
const TOTAL_UNITS = 500;
const BATCH_ID = "PHARMA_BATCH_500";

// ---------- HELPERS ----------
function today() {
  return new Date().toISOString().slice(0, 10);
}

function randomAlphaNum(len) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

// ---------- PRODUCT ----------
async function insertPharmaProduct() {
  const [existing] = await db.query(
    "SELECT product_id, units_per_carton, cartons_per_pallet FROM products WHERE product_code='PHARMA500'"
  );

  if (existing.length) return existing[0];

  const [res] = await db.query(
    `INSERT INTO products 
     (product_code, product_name, units_per_carton, cartons_per_pallet)
     VALUES ('PHARMA500','Paracetamol 500mg Tablets',10,5)`
  );

  return {
    product_id: res.insertId,
    units_per_carton: 10,
    cartons_per_pallet: 5
  };
}

// ---------- LABEL ----------
async function insertLabel(serial, level, productId) {
  const [res] = await db.query(
    `INSERT INTO labels
     (serial_number, batch_id, packaging_level, product_id,
      production_date, check_digit, hash, verification_code)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      serial,
      BATCH_ID,
      level,
      productId,
      today(),
      serial.slice(-1),
      "HASH_PLACEHOLDER",
      "VERIFY01"
    ]
  );
  return res.insertId;
}

// ---------- AGGREGATION ----------
async function aggregate(parentId, childId) {
  await db.query(
    "INSERT INTO aggregation (parent_label_id, child_label_id) VALUES (?, ?)",
    [parentId, childId]
  );
}

// ---------- MAIN ----------
async function seed() {
  try {
    console.log("💊 Seeding Pharmaceutical Product (500 Units)");

    const product = await insertPharmaProduct();
    const { product_id, units_per_carton, cartons_per_pallet } = product;

    const cartonsNeeded = Math.ceil(TOTAL_UNITS / units_per_carton);
    const palletsNeeded = Math.ceil(cartonsNeeded / cartons_per_pallet);

    console.log(`Units: ${TOTAL_UNITS}`);
    console.log(`Cartons: ${cartonsNeeded}`);
    console.log(`Pallets: ${palletsNeeded}\n`);

    // ----- CREATE PALLETS -----
    const palletIds = [];
    for (let i = 1; i <= palletsNeeded; i++) {
      const sscc = `38901234000000${String(i).padStart(4, "0")}`;
      palletIds.push(await insertLabel(sscc, "TERTIARY", product_id));
    }

    // ----- CREATE CARTONS -----
    const cartonIds = [];
    for (let i = 1; i <= cartonsNeeded; i++) {
      const serial = `CRT${today().replace(/-/g, "")}${String(i).padStart(4, "0")}${randomAlphaNum(4)}${i % 10}`;
      cartonIds.push(await insertLabel(serial, "SECONDARY", product_id));
    }

    // Aggregate cartons → pallets
    let palletIndex = 0;
    cartonIds.forEach((cartonId, idx) => {
      aggregate(palletIds[palletIndex], cartonId);
      if ((idx + 1) % cartons_per_pallet === 0) palletIndex++;
    });

    // ----- CREATE UNITS -----
    let cartonCursor = 0;
    for (let i = 1; i <= TOTAL_UNITS; i++) {
      const serial = `PRD1${today().replace(/-/g, "")}${String(i).padStart(6, "0")}${i % 10}`;
      const unitId = await insertLabel(serial, "PRIMARY", product_id);

      await aggregate(cartonIds[cartonCursor], unitId);

      if (i % units_per_carton === 0) cartonCursor++;
    }

    console.log("✅ Pharmaceutical hierarchy seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding pharma data:", err.message);
    process.exit(1);
  }
}

seed();
