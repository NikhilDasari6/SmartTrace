const db = require("../config/db");
const { calculateCheckDigit } = require("../utils/checkDigitUtil");
const { generateHashes } = require("../utils/hashUtil");

exports.verifyLabel = async ({
  serial,
  scannedShortHash,
  latitude,
  longitude,
  claimedParent
}) => {

  /* -------- Phase 1: Check Digit -------- */
  const payload = serial.slice(0, -1);
  const inputCD = serial.slice(-1);

  if (calculateCheckDigit(payload) != inputCD) {
    return logAndReturn(serial, "INVALID", "CHECK_DIGIT_MISMATCH");
  }

  /* -------- Phase 2: DB + Hash -------- */
  const [[label]] = await db.query(
    `SELECT l.*, p.product_code
     FROM labels l JOIN products p ON l.product_id=p.product_id
     WHERE l.serial_number=?`,
    [serial]
  );

  if (!label) {
    return logAndReturn(serial, "INVALID", "NOT_FOUND");
  }

  const { shortHash } = generateHashes(
    serial,
    label.production_date,
    label.product_code,
    "SECRET_SALT_V1"
  );

  if (shortHash !== scannedShortHash) {
    return logAndReturn(serial, "INVALID", "HASH_MISMATCH");
  }

  /* -------- Phase 3: Hierarchy -------- */
  if (claimedParent) {
    const [[row]] = await db.query(
      `SELECT l.serial_number
       FROM aggregation a
       JOIN labels l ON a.parent_label_id=l.label_id
       WHERE a.child_label_id=?`,
      [label.label_id]
    );

    if (!row || row.serial_number !== claimedParent) {
      return logAndReturn(serial, "SUSPECT", "HIERARCHY_MISMATCH");
    }
  }

  /* -------- Phase 4: Anomaly -------- */
  const [logs] = await db.query(
    "SELECT * FROM verification_logs WHERE label_id=? ORDER BY scan_time DESC",
    [label.label_id]
  );

  let result = "VALID";

  if (logs.length > 0) {
    result = "WARNING";
  }

  await db.query(
    `INSERT INTO verification_logs
     (label_id, scan_latitude, scan_longitude, scan_result)
     VALUES (?, ?, ?, ?)`,
    [label.label_id, latitude, longitude, result]
  );

  return { result };
};

async function logAndReturn(serial, result, reason) {
  const [[label]] = await db.query(
    "SELECT label_id FROM labels WHERE serial_number=?",
    [serial]
  );

  if (label) {
    await db.query(
      "INSERT INTO anomaly_logs (label_id, anomaly_type) VALUES (?,?)",
      [label.label_id, reason]
    );
  }
  return { result, reason };
}

