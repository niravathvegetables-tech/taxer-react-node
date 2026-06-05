const db = require("./db");
 const path = require("path");


function getpurchase(res){



}




function handleUpdatePurchaseRequest(req, res) {



}


function handleInsertPurchaseRequest(req, res) {
  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);

      insertPurchase(data, (err, result) => {
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

function insertPurchase(data, callback) {
  // Loop through rows and insert each purchase
  const query = `
    INSERT INTO taxer_purchase 
    (transaction_id, stocks_id, purchase_amount, purchase_count, purchase_item_type, purchase_total, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // If you want to insert multiple rows, run multiple queries
  data.rows.forEach(row => {
    db.query(query, [
      data.company_id,          // transaction_id (assuming company_id maps here)
      row.stocks_id,
      row.purchase_amount,
      row.purchase_count,
      row.purchase_item_type,
      row.purchase_total,
      data.date
    ], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  });
}




function handleDeletePurchaseRequest(req, res) {



}


module.exports = { handleDeletePurchaseRequest,handleInsertPurchaseRequest,handleUpdatePurchaseRequest,getpurchase };
