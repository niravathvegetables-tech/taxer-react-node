const db = require("./db");
 const path = require("path");

  const { updateamountadd,updateamountreduce } = require("./company");

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


          db.query("SELECT payment_amount FROM taxer_payment WHERE  payment_id  = ?", [data.payment_id ], (err, rows) => {



             if (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: "Error fetching old payment" }));
          }
          if (rows.length === 0) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: "Payment not found" }));
          }

          const oldAmount = parseFloat(rows[0].payment_amount);
          const newAmount = parseFloat(data.payment_amount);

          if (isNaN(oldAmount) || isNaN(newAmount)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: "Invalid numeric values" }));
          }

          // Step 2: Compare difference
          const difference = newAmount - oldAmount;
          if (difference > 0) {
             updateamountreduce(Math.abs(difference), data.company_id);
           
          } else if (difference < 0) {
              updateamountadd(Math.abs(difference), data.company_id);
          }






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






      });


      } else {
        insertPayment(data, (err, result) => {
          if (err) {
            console.error("DB Insert Error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Error inserting data" }));
            return;
          }

          updateamountreduce(parseFloat(data.payment_amount), data.company_id);



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

          updateamountadd(parseFloat(data.payment_amount), data.company_id);

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
