const db = require("./db");
const { updateamountadd,updateamountreduce } = require("./company");

function insertContra(data, callback) {
  const query = `
    INSERT INTO taxer_contra 
    (company_id, contra_name, contra_amount, contra_date)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [
    data.company_id,
    data.contra_name,
    data.contra_amount,
    data.contra_date
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });

updateamountadd(data.contra_amount,data.company_id);

}



function getcontradetailsid(id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM taxer_contra WHERE contra_id = ?";
    db.query(query, [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function deleteContraRequest(req, res) {
  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", async () => {
    try {
      const data = JSON.parse(body);

      if (data.contra_id && data.contra_id !== "") {
        const rows = await getcontradetailsid(data.contra_id);

        // ✅ Now you can use rows for operations
        console.log("Contra details:", rows);

        const currentAmount = parseFloat(rows[0].contra_amount);

        updateamountreduce(currentAmount,rows[0].company_id);

         const query = "DELETE FROM taxer_contra WHERE contra_id = ?";
    db.query(query, [rows[0].contra_id], (err, result) => {
      if (err) return reject(err);
      
    });
        
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: true, contra: rows, currentAmount }));
      } else {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "contra_id required" }));
      }
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}





function updateContra(data, callback) {
  const query = `
    UPDATE taxer_contra SET
      company_id    = ?,
      contra_name   = ?,
      contra_amount = ?,
      contra_date   = ?
    WHERE contra_id = ?
  `;
  db.query(query, [
    data.company_id,
    data.contra_name,
    data.contra_amount,
    data.contra_date,
    data.contra_id
  ], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

function getcontradetails(res) {
  db.query("SELECT * FROM taxer_contra", (err, rows) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Error fetching data" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(rows));
  });
}

function handleContraRequest(req, res) {
  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);

      if (data.contra_id && data.contra_id !== "") {
        updateContra(data, (err, result) => {
          if (err) {
            console.error("DB Update Error:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Error updating data" }));
            return;
          }
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, updated: true, id: data.contra_id }));
        });
      } else {
        insertContra(data, (err, result) => {
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

module.exports = { handleContraRequest, getcontradetails , deleteContraRequest};
