const express = require("express");

const labelRoutes = require("./routes/labelRoutes");
const hierarchyRoutes = require("./routes/hierarchyRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const productRoutes = require("./routes/productRoutes");
const bulkRoutes = require("./routes/bulkRoutes");

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());

/* ---------- Routes ---------- */
app.use("/api/labels", labelRoutes);
app.use("/api/hierarchy", hierarchyRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bulk", bulkRoutes);

/* ---------- Health Check ---------- */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "SmartTrace backend running" });
});

/* ---------- Global Error Handler ---------- */
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;

