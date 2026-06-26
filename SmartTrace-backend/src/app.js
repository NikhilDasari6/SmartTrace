const express = require("express");
const cors = require("cors");

const labelRoutes = require("./routes/labelRoutes");
const hierarchyRoutes = require("./routes/hierarchyRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const productRoutes = require("./routes/productRoutes");
const bulkRoutes = require("./routes/bulkRoutes");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use("/api/labels", labelRoutes);
app.use("/api/hierarchy", hierarchyRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bulk", bulkRoutes);

app.get("/", (req, res) => {
  res.json({ 
    message: "SmartTrace API is running",
    documentation: "Use /api/labels, /api/verify, etc.",
    frontend: "Visit port 8080 for the UI"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "SmartTrace backend running" });
});


module.exports = app;

