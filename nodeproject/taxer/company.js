const db = require("./db");

function insertCompany(data, callback) {
  const query = `
    INSERT INTO taxer_company 
    (company_name, company_address, company_trn, company_data, tax_id, company_amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [
    data.companyName,
    data.companyAddress,
    data.companyTrn,
    data.companyData || "no",
    data.taxId || 0,
    data.companyAmount
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

function updateCompany(data, callback) {
  const query = `
    UPDATE taxer_company SET
      company_name    = ?,
      company_address = ?,
      company_trn     = ?,
      company_amount  = ?
    WHERE company_id = ?
  `;
  db.query(query, [
    data.companyName,
    data.companyAddress,
    data.companyTrn,
    data.companyAmount,
    data.companyID        // ✅ WHERE clause
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

function getcompanydetails(res) { // ✅ receives res
  db.query("SELECT * FROM taxer_company", (err, rows) => {
    if (err) {
      res.statusCode = 500;
      res.end("Error fetching data");
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(rows));
  });
}

function handleCompanyRequest(req, res) {
  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      data.companyData = data.companyData || "no";
      data.taxId = data.taxId || 0;
      console.log("Received data:", data);

       if (data.companyID && data.companyID !== "") {


         updateCompany(data, (err, result) => {
          if (err) {
            console.error("DB Update Error:", err);
            res.statusCode = 500;
            res.end("Error updating data: " + err.message);
            return;
          }
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, updated: true, id: data.companyID }));
        });



       }else{

      insertCompany(data, (err, result) => {
        if (err) {
          console.error("DB Error:", err);
          res.statusCode = 500;
          res.end("Error inserting data: " + err.message);
          return;
        }
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: true, id: result.insertId }));
      });

    }




    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      res.statusCode = 400;
      res.end("Invalid JSON");
    }
  });
}

module.exports = { handleCompanyRequest, getcompanydetails }; // ✅ export both