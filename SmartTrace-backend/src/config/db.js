const mysql = require("mysql2/promise");

module.exports = mysql.createPool({
  host: "localhost",
  user: "smarttrace_admin,
  password: "batman",
  database: "smarttrace",
  waitForConnections: true,
  connectionLimit: 10
});

