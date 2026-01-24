const db = require("../config/db");

exports.aggregate = async (childSerial, parentSerial) => {
  const [[child]] = await db.query(
    "SELECT label_id, packaging_level FROM labels WHERE serial_number=?",
    [childSerial]
  );
  const [[parent]] = await db.query(
    "SELECT label_id, packaging_level FROM labels WHERE serial_number=?",
    [parentSerial]
  );

  if (!child || !parent) throw new Error("Invalid serial");

  if (
    (child.packaging_level === "PRIMARY" && parent.packaging_level !== "SECONDARY") ||
    (child.packaging_level === "SECONDARY" && parent.packaging_level !== "TERTIARY")
  ) {
    throw new Error("Invalid hierarchy");
  }

  await db.query(
    "INSERT INTO aggregation (parent_label_id, child_label_id) VALUES (?,?)",
    [parent.label_id, child.label_id]
  );
};

