const crypto = require("crypto");

exports.generateHash = (serial, date, productCode) => {
  const secretSalt = "SMARTTRACE_SECRET";
  return crypto
    .createHash("sha256")
    .update(serial + date + productCode + secretSalt)
    .digest("hex");
};
