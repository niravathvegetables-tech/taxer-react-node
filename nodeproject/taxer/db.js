const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "db.fr-pari1.bengt.wasmernet.com",
//   user: "82703f9270c580001276041e65bc",
//   password: "069b8270-3f92-71d7-8000-c190145b200e",
//   database: "dbYxy8VbuUDQmdA53q6Vhac8"
// });

const db = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12828730",
  password: "AMnpCaxEMU",
  database: "sql12828730"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;
