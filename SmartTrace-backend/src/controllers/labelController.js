const labelService = require("../services/labelService");

exports.generateLabel = async (req, res) => {
  const { packagingLevel, productId, productionDate } = req.body;

  try {
    const serial = await labelService.generateLabel(
      packagingLevel,
      productId,
      productionDate
    );

    res.status(201).json({
      message: "Label generated successfully",
      serial_number: serial
    });
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

