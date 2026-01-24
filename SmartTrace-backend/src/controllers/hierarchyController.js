const hierarchyService = require("../services/hierarchyService");

exports.aggregate = (req, res) => {
  const { childSerial, childLevel, parentSerial, parentLevel } = req.body;

  try {
    const result = hierarchyService.linkChildToParent(
      childSerial,
      childLevel,
      parentSerial,
      parentLevel
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.trace = (req, res) => {
  const { serial } = req.params;
  const path = hierarchyService.getHierarchyPath(serial);
  res.status(200).json({ path });
};

