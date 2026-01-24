const { generateCheckDigit } = require("../utils/checkDigitUtil");

// TEMP counters (DB sequences later)
let primaryCounter = 0;
let secondaryCounter = 0;
let ssccCounter = 0;

exports.generateSerial = (level) => {
  switch (level) {
    case "PRIMARY":
      return generatePrimarySerial();
    case "SECONDARY":
      return generateSecondarySerial();
    case "TERTIARY":
      return generateSSCC();
    default:
      throw new Error("Invalid level");
  }
};

/* ========= PRIMARY =========
   Prefix + Time + Seq + CD
   Fixed length: 25
*/
function generatePrimarySerial() {
  const prefix = "PRD1";
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);

  primaryCounter++;
  const seq = String(primaryCounter).padStart(6, "0");

  const raw = prefix + timestamp + seq;
  const cd = generateCheckDigit(raw);

  return raw + cd;
}

/* ========= SECONDARY =========
   Hybrid Secure Serial
   Fixed length: 20
*/
function generateSecondarySerial() {
  const prefix = "CRT";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  secondaryCounter++;
  const seq = String(secondaryCounter).padStart(4, "0");
  const random = generateRandom(4);

  const raw = prefix + date + seq + random;
  const cd = generateCheckDigit(raw);

  return raw + cd;
}

/* ========= TERTIARY =========
   SSCC – 18 digits
*/
function generateSSCC() {
  const extensionDigit = "3";
  const companyPrefix = "8901234";

  ssccCounter++;
  const serialRef = String(ssccCounter)
    .padStart(17 - companyPrefix.length - 1, "0");

  const raw = extensionDigit + companyPrefix + serialRef;
  const cd = generateCheckDigit(raw);

  return raw + cd;
}

function generateRandom(len) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

