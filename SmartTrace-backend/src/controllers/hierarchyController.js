const hierarchyService = require("../services/hierarchyService");

exports.aggregate = async (req, res) => {
  const { childSerial, parentSerial } = req.body;

  try {
    await hierarchyService.aggregate(childSerial, parentSerial);

    res.status(201).json({
      message: "Aggregation successful",
      child: childSerial,
      parent: parentSerial
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

exports.trace = async (req, res) => {
  const { serial } = req.params;

  try {
    const path = await hierarchyService.getHierarchyPath(serial);

    res.status(200).json({
      serial,
      hierarchy_path: path
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

