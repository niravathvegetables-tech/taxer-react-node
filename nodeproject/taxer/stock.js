const db = require("./db");
const multer = require("multer");
const path = require("path");

 

function getstockdetailsid(res) {
  db.query("SELECT * FROM taxer_stocks", (err, rows) => {
    if (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Error fetching data" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(rows));
  });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

function handleStockRequest(req, res) {
  upload.single("stocks_image")(req, res, function (err) {
    if (err) {
      console.error("Upload error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "File upload failed" }));
      return;
    }

    const data = req.body;
    const file = req.file;

    if (data.stocks_id && data.stocks_id !== "") {
      updateStock({ ...data, stocks_image: file?.filename }, (err, result) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Error updating stock" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, updated: true }));
      });
    } else {
      insertStock({ ...data, stocks_image: file?.filename }, (err, result) => {
        if (err) {
          console.error("DB Insert Error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Error inserting data" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, id: result.insertId }));
      });
    }
  });
}


 
function updateStock(data, callback) {


  if(data.stocks_image){

  const query = `
    UPDATE taxer_stocks SET
      stocks_name = ?,
      stocks_price = ?,
      stocks_total= ?,
       stocks_image= ?,
        stocks_unit= ?
    WHERE stocks_id = ?
  `;

  db.query(
    query,
    [data.stocks_name,data.stocks_price, data.stocks_total,data.stocks_image,data.stocks_unit,data.stocks_id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );

}else{


  const query = `
    UPDATE taxer_stocks SET
      stocks_name = ?,
      stocks_price = ?,
      stocks_total= ?,
       
        stocks_unit= ?
    WHERE stocks_id = ?
  `;

  db.query(
    query,
    [data.stocks_name,data.stocks_price, data.stocks_total,data.stocks_unit,data.stocks_id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );



}




}


function insertStock(data, callback) {
  const query = `
    INSERT INTO taxer_stocks 
    (company_id, stocks_name, stocks_price, stocks_total, stocks_image, stocks_unit)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      data.company_id,
      data.stocks_name,
      data.stocks_price,
      data.stocks_total,
      data.stocks_image,   // filename from multer
      data.stocks_unit
    ],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
}



function DeleteStockRequest(req, res){

 let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Received data:", data);


       const query = "DELETE FROM taxer_stocks WHERE stocks_id = ?";
    db.query(query, [data.stocks_id], (err, result) => {
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

module.exports = { handleStockRequest,getstockdetailsid,DeleteStockRequest };
