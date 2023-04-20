const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "thai",
  password: "04112001",
  database: "shop",
});

module.exports = pool;