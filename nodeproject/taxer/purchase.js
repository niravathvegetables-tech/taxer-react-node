const db = require("./db");
 const path = require("path");


function getpurchase(res){



}




function handleUpdatePurchaseRequest(req, res) {



}


function insertPurchase(data, callback) {
  // const query = `
  //   INSERT INTO : taxer_purchase 
  //   (transaction_id, stocks_id,	purchase_amount,purchase_count,purchase_item_type,purchase_total,date)
  //   VALUES (?, ?, ?, ?)
  // `;
  // db.query(query, [
  //   data.company_id,
  //   data.receipt_name,
  //    data.receipt_amount,
  //     data.receipt_date
  // ], (err, result) => {
  //   if (err) return callback(err);
  //   callback(null, result);
  // });

 

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
      }
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  });





}


function handleDeletePurchaseRequest(req, res) {



}


module.exports = { handleDeletePurchaseRequest,handleInsertPurchaseRequest,handleUpdatePurchaseRequest,getpurchase };
