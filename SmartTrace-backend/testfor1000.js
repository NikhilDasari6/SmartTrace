/**
 * FINAL SmartTrace Bulk Test
 * - Works even if DB is empty
 * - Uses backend Level-3 bulk generation
 * - Prints ONLY execution time
 */

const axios = require("axios");

const BASE = "http://localhost:3000/api";
const TEST_PRODUCT_CODE = "TEST_PRD";
const UNITS = 10000;

/* ---------- Fetch test productId ---------- */
async function getProductId() {
  const res = await axios.get(
    `${BASE}/products/by-code/${TEST_PRODUCT_CODE}`
  );
  return res.data.product_id;
}

/* ---------- Run bulk test ---------- */
(async () => {
  try {
    const productId = await getProductId();

    const start = Date.now();

    await axios.post(`${BASE}/bulk/generate`, {
      productId,
      units: UNITS
    });

    const end = Date.now();

    console.log(`Execution Time: ${(end - start) / 1000} seconds`);
  } catch (err) {
    console.error(
      "ERROR:",
      err.response?.data || err.message
    );
  }
})();

