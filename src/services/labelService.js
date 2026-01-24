const db = require("../config/db");
const { generateHash } = require("../utils/hashUtil");
const { generateCheckDigit } = require("../utils/checkDigitUtil");

exports.generate = async ({ productCode, productionDate }) => {
  const serialBase = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const checkDigit = generateCheckDigit(serialBase);
  const serialNumber = serialBase + checkDigit;

  const hash = generateHash(serialNumber, productionDate, productCode);

  await db.execute(
    `INSERT INTO labels 
     (serial_number, product_code, production_date, check_digit, hash)
     VALUES (?, ?, ?, ?, ?)`,
    [serialNumber, productCode, productionDate, checkDigit, hash]
  );

  return { serialNumber, verificationCode: hash.slice(0, 8) };
};

exports.verify = async ({ serialNumber }) => {
  const [rows] = await db.execute(
    "SELECT * FROM labels WHERE serial_number = ?",
    [serialNumber]
  );

  if (rows.length === 0) {
    return { status: "INVALID" };
  }

  return { status: "VALID" };
};
