const crypto = require("crypto");

exports.generateHashes = (serial, date, productCode, salt) => {
  const full = crypto
    .createHash("sha256")
    .update(serial + date + productCode + salt)
    .digest("hex");

  return {
    fullHash: full,
    shortHash: full.substring(0, 8)
  };
};

