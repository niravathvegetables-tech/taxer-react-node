const db = require("./db");
 const path = require("path");
 const { updateamountadd,updateamountreduce } = require("./company");





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
        // Step 1: Fetch old receipt
        db.query("SELECT receipt_amount FROM taxer_receipt WHERE receipt_id = ?", [data.receipt_id], (err, rows) => {
          if (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: "Error fetching old receipt" }));
          }
          if (rows.length === 0) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Receipt not found" }));
          }

          const oldAmount = parseFloat(rows[0].receipt_amount);
          const newAmount = parseFloat(data.receipt_amount);

          if (isNaN(oldAmount) || isNaN(newAmount)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: "Invalid numeric values" }));
          }

          // Step 2: Compare difference
          const difference = newAmount - oldAmount;
          if (difference > 0) {
            
            updateamountadd(Math.abs(difference), data.company_id);
          } else if (difference < 0) {
              updateamountreduce(Math.abs(difference), data.company_id);
          }

          // Step 3: Update receipt
          updateReciept(data, (err, result) => {
            if (err) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: "Error updating receipt" }));
            }

            // Step 4: Single response
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true, updated: true, id: data.receipt_id }));
          });
        });



      } else {
        // Insert new receipt
        insertReciept(data, (err, result) => {
          if (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: "Error inserting receipt" }));
          }

          updateamountadd(parseFloat(data.receipt_amount), data.company_id);

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, id: result.insertId }));
        });
      }
    } catch (parseErr) {
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

       updateamountreduce(data.receipt_amount,data.company_id);

       } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }

      });


}

module.exports = { handleRecieptRequest,getRecieptdetailsid,getRecieptdetails,DeleteRecieptRequest };
