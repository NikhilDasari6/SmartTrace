const express = require("express");
const labelRoutes = require("./routes/labelRoutes");

const app = express();

app.use(express.json());
app.use("/api/labels", labelRoutes);

module.exports = app;
