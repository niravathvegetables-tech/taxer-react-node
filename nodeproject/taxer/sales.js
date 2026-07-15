const db = require("./db");
 const path = require("path");

  const { updateamountadd,updateamountreduce } = require("./company");

   const { externalupdate } = require("./stock");

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


// const querytr = `
//     INSERT INTO taxer_transaction 
//     (company_id, transactionamount, tax, Total, date)
//     VALUES (?, ?, ?, ?, ?)
//   `;
  
// db.query(
//     querytr,
//     [data.companyid,data.stocks_price, data.stocks_total,data.stocks_image,data.stocks_unit,data.stocks_id],
//     (err, result) => {
//       if (err) return callback(err);
//       callback(null, result);
//     }
//   );

  const query = `
    INSERT INTO taxer_sales 
    (transaction_id, stocks_id, sales_amount, sales_count, sales_item_type, sales_total, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // ✅ Filter out incomplete rows (like row 1 with null stocks_id)
  const validRows = data.sales.filter(row => row.stocks_id !== null && row.stocks_id !== undefined);

  if (validRows.length === 0) {
    return callback(new Error("No valid sales rows to insert"));
  }

  let completed = 0;
  let hasError = false;

  validRows.forEach(row => {

     

    db.query(query, [
      data.companyid,         // ✅ transaction_id
      row.stocks_id,          // ✅ was data.sales.stocks_id
      row.sales_amount,       // ✅ was data.sales.sales_amount
      row.sales_count,        // ✅ was data.sales.sales_count
      row.sales_item_type,    // ✅ was data.sales.sales_item_type
      row.sales_total,        // ✅ was data.sales.sales_total
      data.date               // ✅
    ], (err, result) => {
      if (hasError) return;
      if (err) {
        hasError = true;
        return callback(err);
      }
      completed++;
      if (completed === validRows.length) {  // ✅ was data.rows.length
        updateamountadd(row.sales_total, data.companyid);  // ✅ was data.company_id

          externalupdate(row);
          
        callback(null, { insertId: result.insertId });


        
      }
    });

    console.log("row-stock-idee"+row.stocks_id);

    

  });
}


function handleDeletesalesRequest(req, res) {



}


module.exports = { handleDeletesalesRequest,handleInsertsalesRequest,handleUpdatesalesRequest,getsales };