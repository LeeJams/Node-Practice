// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-complete",
//   password: "123456789",
// });

// module.exports = pool.promise();

const { Sequelize } = require("sequelize");

const dbSquelize = new Sequelize("node-complete", "root", "123456789", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = dbSquelize;