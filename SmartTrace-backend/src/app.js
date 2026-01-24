const express = require("express");

const labelRoutes = require("./routes/labelRoutes");
const hierarchyRoutes = require("./routes/hierarchyRoutes");

const app = express();

app.use(express.json());

app.use("/api/labels", labelRoutes);
app.use("/api/hierarchy", hierarchyRoutes);

module.exports = app;

