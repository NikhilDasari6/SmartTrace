const verificationService = require("../services/verificationService");

exports.verify = async (req, res) => {
  const {
    serial,
    shortHash,
    latitude,
    longitude,
    claimedParent
  } = req.body;

  try {
    const result = await verificationService.verifyLabel({
      serial,
      scannedShortHash: shortHash,
      latitude,
      longitude,
      claimedParent
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

