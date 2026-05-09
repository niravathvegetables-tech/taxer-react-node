const db = require("./db");
 const path = require("path");




function getRecieptdetailsid(res) {
  db.query("SELECT * FROM taxer_receipt", (err, rows) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Error fetching data" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(rows));
  });
}


function insertReciept(data, callback) {
  const query = `
    INSERT INTO taxer_receipt 
    (company_id, receipt_name,	receipt_amount,	receipt_date)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [
    data.company_id,
    data.receipt_name,
     data.receipt_amount,
      data.receipt_date
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });

 

}



 
function updateReciept(data, callback) {
  const query = `
    UPDATE taxer_receipt SET
      company_id = ?,
      receipt_name = ?,
      receipt_amount = ?,
      receipt_date = ?
    WHERE 	receipt_id  = ?
  `;

  db.query(
    query,
    [data.company_id, data.receipt_name,data.receipt_amount,data.receipt_date, data.receipt_id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
}





function handleRecieptRequest(req, res) {


  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);

      if (data.receipt_id && data.receipt_id !== "") {
        updateReciept(data, (err, result) => {
          if (err) {
            console.error("DB Update Error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Error updating data" }));
            return;
          }
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, updated: true, id: data.receipt_id }));
        });
      } else {
        insertReciept(data, (err, result) => {
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


function getRecieptdetails(res) {
  const query = `
    SELECT receipt_id, company_id, receipt_name, receipt_amount,
    DATE_FORMAT(receipt_date, '%Y-%m-%d') as receipt_date 
    FROM taxer_receipt
  `;
  db.query(query, (err, rows) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Error fetching data" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(rows));
  });
}


function DeleteRecieptRequest(req, res){



   let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);


       const query = "DELETE FROM taxer_receipt WHERE receipt_id = ?";
    db.query(query, [data.receipt_id], (err, result) => {
      if (err) return reject(err);

         console.log("Deltete Data data:", data);


         res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: true, affectedRows: result.affectedRows }));
      
    });



       } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }

      });


}

module.exports = { handleRecieptRequest,getRecieptdetailsid,getRecieptdetails,DeleteRecieptRequest };
