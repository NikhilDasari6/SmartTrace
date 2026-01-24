const labelService = require("../services/labelService");

exports.generateSerial = (req, res) => {
  const { level } = req.body;

  try {
    const serial = labelService.generateSerial(level);
    res.status(200).json({ serial });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
