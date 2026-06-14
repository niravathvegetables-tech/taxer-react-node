const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "taxer-react-node"
});

// const db = mysql.createConnection({
//   host: "sql12.freesqldatabase.com",
//   user: "sql12828730",
//   password: "AMnpCaxEMU",
//   database: "sql12828730"
// });

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

module.exports = db;
