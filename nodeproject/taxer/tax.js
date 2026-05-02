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



 
function updateTax(data, callback) {
  const query = `
    UPDATE taxer_taxes SET
      tax_name = ?,
      tax_percent = ?
    WHERE tax_id = ?
  `;

  db.query(
    query,
    [data.tax_name, data.tax_percent, data.tax_id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
}





function handleTaxRequest(req, res) {


  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);

      if (data.tax_id && data.tax_id !== "") {
        updateTax(data, (err, result) => {
          if (err) {
            console.error("DB Update Error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Error updating data" }));
            return;
          }
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, updated: true, id: data.tax_id }));
        });
      } else {
        insertTax(data, (err, result) => {
          if (err) {
            console.error("DB Insert Error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Error inserting data" }));
            return;
          }
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, id: result.insertId }));
        });
      }
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
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


function DeletetaxRequest(req, res){



   let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);


       const query = "DELETE FROM taxer_taxes WHERE tax_id = ?";
    db.query(query, [data.tax_id], (err, result) => {
      if (err) return reject(err);
      
    });



       } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }

      });


}

module.exports = { handleTaxRequest, gettaxdetails,DeletetaxRequest };