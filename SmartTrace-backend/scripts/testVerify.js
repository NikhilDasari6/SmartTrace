const axios = require("axios");
const BASE = "http://localhost:3000/api";

async function testVerification() {
  try {
    // 1. Generate a unit
    console.log("Generating a unit for verification test...");
    const genRes = await axios.post(`${BASE}/labels/generate`, {
      packagingLevel: "PRIMARY",
      productId: 2,
      productionDate: "2026-06-25"
    });
    const serial = genRes.data.serial_number;
    console.log("Generated Serial:", serial);

    // 2. Verify the unit
    console.log("Verifying unit...");
    const verifyRes = await axios.post(`${BASE}/verify`, {
      serial_number: serial,
      scan_location: "Warehouse A"
    });
    
    console.log("Verification Response:", verifyRes.data);
    
    if (verifyRes.data.status === "VALID") {
      console.log("✅ VERIFICATION SUCCESSFUL");
    } else {
      console.log("❌ VERIFICATION FAILED");
    }
  } catch (err) {
    console.error("❌ ERROR");
    console.error(err.response?.data || err.message);
  }
}

testVerification();
