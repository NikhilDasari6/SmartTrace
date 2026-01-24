const axios = require("axios");
const BASE = "http://localhost:3000/api";
const PROD_DATE = "2026-01-24";

async function ensureProduct() {
  // Create product if missing (idempotent)
  await axios.post(`${BASE}/products/create`, {
    product_code: "PRD001",
    product_name: "Auto Test Product"
  }).catch(() => {});

  // Fetch productId
  const res = await axios.get(`${BASE}/products/by-code/PRD001`);
  return res.data.product_id;
}

async function generate(level, productId) {
  const res = await axios.post(`${BASE}/labels/generate`, {
    packagingLevel: level,
    productId,
    productionDate: PROD_DATE
  });
  return res.data.serial_number;
}

(async () => {
  try {
    const productId = await ensureProduct();
    console.log("Using productId:", productId);

    console.log("\n--- GENERATING PALLET (TERTIARY) ---");
    const pallet = await generate("TERTIARY", productId);
    console.log("Pallet:", pallet);

    console.log("\n--- GENERATING CARTON ---");
    const carton = await generate("SECONDARY", productId);
    console.log("Carton:", carton);

    console.log("\n--- GENERATING UNIT ---");
    const unit = await generate("PRIMARY", productId);
    console.log("Unit:", unit);

    console.log("\n✅ TEST FLOW SUCCESSFUL");
  } catch (err) {
    console.error("\n❌ ERROR");
    console.error(err.response?.data || err.message);
  }
})();

