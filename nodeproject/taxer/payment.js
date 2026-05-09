const db = require("./db");
 const path = require("path");

 

function getpaymentdetailsid(res) {
  db.query("SELECT * FROM taxer_payment", (err, rows) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Error fetching data" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(rows));
  });
}


function insertPayment(data, callback) {
  const query = `
    INSERT INTO taxer_payment 
    (company_id, payment_name,	payment_amount,	payment_date)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [
    data.company_id,
    data.payment_name,
     data.payment_amount,
      data.payment_date
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });

 

}



 
function updatePayment(data, callback) {
  const query = `
    UPDATE taxer_payment SET
      company_id = ?,
      payment_name = ?,
      payment_amount = ?,
      payment_date = ?
    WHERE payment_id  = ?
  `;

  db.query(
    query,
    [data.company_id, data.payment_name,data.payment_amount,data.payment_date, data.payment_id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
}





function handlePayemntRequest(req, res) {


  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);

      if (data.payment_id && data.payment_id !== "") {
        updatePayment(data, (err, result) => {
          if (err) {
            console.error("DB Update Error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Error updating data" }));
            return;
          }
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, updated: true, id: data.payment_id }));
        });
      } else {
        insertPayment(data, (err, result) => {
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


function getpaymentdetails(res) {
  const query = `
    SELECT payment_id, company_id, payment_name, payment_amount,
    DATE_FORMAT(payment_date, '%Y-%m-%d') as payment_date 
    FROM taxer_payment
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


function DeletePayemntRequest(req, res){



   let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);


       const query = "DELETE FROM taxer_payment WHERE payment_id = ?";
    db.query(query, [data.payment_id], (err, result) => {
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

module.exports = { handlePayemntRequest,getpaymentdetails,getpaymentdetailsid ,DeletePayemntRequest };
