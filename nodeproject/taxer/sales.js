const db = require("./db");
 const path = require("path");

  const { updateamountadd,updateamountreduce } = require("./company");

function getsales(res){

db.query("SELECT * FROM taxer_sales", (err, rows) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Error fetching data" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(rows));
  });

}




function handleUpdatesalesRequest(req, res) {



}


function handleInsertsalesRequest(req, res) {


 let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);

      insertSeles(data, (err, result) => {
        if (err) {
          console.error("DB Insert Error:", err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Error inserting data" }));
          return;
        }
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: true, id: result.insertId }));
      });

    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  });

}



function insertSeles(data, callback) {
  const query = `
    INSERT INTO taxer_sales 
    (transaction_id, stocks_id, sales_amount, sales_count, sales_item_type, sales_total, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  let completed = 0;
  let hasError = false;

  data.rows.forEach(row => {
    db.query(query, [
      data.company_id,   // assuming company_id maps to transaction_id
      row.stocks_id,
      row.sales_amount,
      row.sales_count,
      row.sales_item_type,
      row.sales_total,
      data.date
    ], (err, result) => {
      if (hasError) return; // stop if already failed
      if (err) {
        hasError = true;
        return callback(err);
      }
      completed++;
      if (completed === data.rows.length) {

         updateamountadd(row.sales_total, data.company_id);
        
        callback(null, { insertId: result.insertId });
      }
    });
  });
}


function handleDeletesalesRequest(req, res) {



}


module.exports = { handleDeletesalesRequest,handleInsertsalesRequest,handleUpdatesalesRequest,getsales };