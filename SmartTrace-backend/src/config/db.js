
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "smarttrace_admin",
  password: "batman",
  database: "smarttrace",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
