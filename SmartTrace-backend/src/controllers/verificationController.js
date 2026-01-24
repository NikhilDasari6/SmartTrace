const db = require("../config/db");

/**
 * Verify a scanned label
 */
exports.verify = async (req, res) => {
  try {
    const { serial_number, scan_location, latitude, longitude } = req.body;

    /* ---------- 1. Input validation ---------- */
    if (!serial_number || typeof serial_number !== "string") {
      return res.status(400).json({
        error: "Invalid input: serial_number is required"
      });
    }

    if (!scan_location || typeof scan_location !== "string") {
      return res.status(400).json({
        error: "Invalid input: scan_location is required"
      });
    }

    /* ---------- 2. Fetch label ---------- */
    const [[label]] = await db.query(
      `SELECT label_id, serial_number, product_id, status
       FROM labels
       WHERE serial_number = ?`,
      [serial_number]
    );

    if (!label) {
      return res.status(404).json({
        error: "Serial number not found"
      });
    }

    /* ---------- 3. Decommission check ---------- */
    if (label.status === "DECOMMISSIONED") {
      await db.query(
        `INSERT INTO verification_logs
         (label_id, scan_result, reason)
         VALUES (?, ?, ?)`,
        [label.label_id, "SUSPECT", "DECOMMISSIONED_LABEL"]
      );

      return res.status(409).json({
        status: "SUSPECT",
        reason: "DECOMMISSIONED_LABEL"
      });
    }

    /* ---------- 4. Log verification ---------- */
    await db.query(
      `INSERT INTO verification_logs
       (label_id, scan_latitude, scan_longitude, scan_result, reason)
       VALUES (?, ?, ?, ?, ?)`,
      [
        label.label_id,
        latitude || null,
        longitude || null,
        "VALID",
        scan_location
      ]
    );

    /* ---------- 5. Success response ---------- */
    return res.json({
      status: "VALID",
      serial_number: label.serial_number,
      product_id: label.product_id
    });

  } catch (err) {
    console.error("Verification error:", err);

    return res.status(500).json({
      error: "Internal verification error"
    });
  }
};

