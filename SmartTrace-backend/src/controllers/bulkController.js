const bulkService = require("../services/bulkService");

exports.generateBulk = async (req, res) => {
  const start = Date.now();
  const { productId, units } = req.body;

  try {
    const result = await bulkService.generate(productId, units);
    const end = Date.now();

    res.status(201).json({
      ...result,
      execution_time_ms: end - start
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

