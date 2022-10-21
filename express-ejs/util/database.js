const mysql = require("mysql2");

const poll = mysql.createPool({
  host: "locallhost",
  user: "root",
  database: "node-complete",
  password: "123456789",
});

module.exports = pool.promise();