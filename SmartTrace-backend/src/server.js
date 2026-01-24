const app = require("./app");
const { bootstrapTestProduct } = require("./utils/bootstrapTestData");

const PORT = 3000;

(async () => {
  try {
    await bootstrapTestProduct();
    app.listen(PORT, () => {
      console.log(`SmartTrace backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();

