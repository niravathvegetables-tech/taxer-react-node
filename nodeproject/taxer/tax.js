const db = require("./db");

function insertTax(data, callback) {
  const query = `
    INSERT INTO taxer_taxes 
    (tax_name, tax_percent)
    VALUES (?, ?)
  `;
  db.query(query, [
    data.tax_name,
    data.tax_percent
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });

 

}



function gettaxdetails(res) {
  db.query("SELECT * FROM taxer_taxes", (err, rows) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Error fetching data" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(rows));
  });
}


module.exports = { insertTax, gettaxdetails };