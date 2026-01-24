const labelService = require("../services/labelService");

exports.generateLabel = async (req, res) => {
  try {
    const label = await labelService.generate(req.body);
    res.status(201).json(label);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyLabel = async (req, res) => {
  try {
    const result = await labelService.verify(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
