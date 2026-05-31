const http = require("http");
const fs = require("fs");
const path = require("path");

// existing imports...
const db = require("./db");
const { createTaxerCompanyTable, createTaxerContraTable,createTaxerSalesTable,createTaxerTaxTable,createTaxerStockTable,createTaxerPaymentTable,createTaxerReceiptTable,createTaxerPurchaseTable,createTaxerTransactionTable } = require("./setupTables");
const { handleCompanyRequest, getcompanydetails } = require("./company");
const { handleContraRequest, getcontradetails, deleteContraRequest } = require("./contra");
const { handleTaxRequest, gettaxdetails, DeletetaxRequest } = require("./tax");
const { handleStockRequest,getstockdetailsid,DeleteStockRequest } = require("./stock");

const { handlePayemntRequest,getpaymentdetailsid,getpaymentdetails,DeletePayemntRequest } = require("./payment");

const { handleRecieptRequest,getRecieptdetailsid,getRecieptdetails,DeleteRecieptRequest } = require("./receipt");


const { handleDeletePurchaseRequest,handleUpdatePurchaseRequest,handleInsertPurchaseRequest,getpurchase } = require("./purchase");


const { getsales,handleUpdatesalesRequest,handleInsertsalesRequest,handleDeletesalesRequest } = require("./sales");

createTaxerCompanyTable();
createTaxerTaxTable();
createTaxerContraTable();
createTaxerStockTable();

createTaxerReceiptTable();
createTaxerPaymentTable();

createTaxerPurchaseTable();
createTaxerTransactionTable();
createTaxerSalesTable();


const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  // ✅ Serve index.html
  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Error loading HTML file");
      } else {
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      }
    });
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/uploads/")) {
    const fileName = req.url.replace("/uploads/", "");
    const filePath = path.join(__dirname, "uploads", fileName);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("Image not found");
      } else {
        const ext = path.extname(fileName).toLowerCase();
        const mimeTypes = {
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".gif": "image/gif",
          ".webp": "image/webp"
        };
        res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
        res.end(data);
      }
    });
    return; // ✅ important — stop here
  }

  // ✅ Serve static files (CSS/JS)
  if (req.method === "GET" && (req.url.startsWith("/css") || req.url.startsWith("/js"))) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("File not found");
      } else {
        if (req.url.endsWith(".css")) res.setHeader("Content-Type", "text/css");
        else if (req.url.endsWith(".js")) res.setHeader("Content-Type", "application/javascript");
        else res.setHeader("Content-Type", "application/octet-stream");

        res.end(data);
      }
    });
    return;
  }

  // ✅ Your API routes
  if (req.method === "GET" && req.url === "/getcompany") {

    getcompanydetails(res);

  } else if (req.method === "POST" && req.url === "/company") {

    handleCompanyRequest(req, res);

  } else if (req.method === "GET" && req.url === "/getcontra") {

    getcontradetails(res);

  } else if (req.method === "POST" && req.url === "/contra") {

    handleContraRequest(req, res);

  } else if (req.method === "POST" && req.url === "/deletecontra") {

    deleteContraRequest(req, res);

  } else if (req.method === "POST" && req.url === "/tax") {

    handleTaxRequest(req, res);

  } else if (req.method === "POST" && req.url === "/updatetax") {

    handleTaxRequest(req, res);

  } else if (req.method === "POST" && req.url === "/deletetax") {

    DeletetaxRequest(req, res);

  } else if (req.method === "GET" && req.url === "/gettax") {

    gettaxdetails(res);

  } else if (req.method === "POST" && req.url === "/stock") {

     handleStockRequest(req, res);

       } else if (req.method === "POST" && req.url === "/deletestock") {

    DeleteStockRequest(req, res);


      } else if (req.method === "GET" && req.url === "/getstock") {

        getstockdetailsid(res);

      } else if (req.method === "POST" && req.url === "/paymentinsert") {

     handlePayemntRequest(req, res);

     } else if (req.method === "POST" && req.url === "/updatepayment") {

     handlePayemntRequest(req, res);
     

      } else if (req.method === "GET" && req.url === "/getpayment") {

        getpaymentdetails(res);


         } else if (req.method === "POST" && req.url === "/deletepayment") {

    DeletePayemntRequest(req, res);



     } else if (req.method === "POST" && req.url === "/recieptinsert") {

     handleRecieptRequest(req, res);

     } else if (req.method === "POST" && req.url === "/updatereciept") {

     handleRecieptRequest(req, res);
     

      } else if (req.method === "GET" && req.url === "/getreciept") {

        getRecieptdetails(res);


         } else if (req.method === "POST" && req.url === "/deletereciept") {

    DeleteRecieptRequest(req, res);


     } else if (req.method === "GET" && req.url === "/getpurchase") {

       getpurchase(res);


    } else if (req.method === "POST" && req.url === "/insertpurchase") {


       handleInsertPurchaseRequest(req, res);

    } else if (req.method === "POST" && req.url === "/updatepurchase") {

      handleUpdatePurchaseRequest(req, res);

    } else if (req.method === "POST" && req.url === "/deletepurchase") {

      handleDeletePurchaseRequest(req, res);

       } else if (req.method === "GET" && req.url === "/getsales") {

       getsales(res);


    } else if (req.method === "POST" && req.url === "/updatepurchase") {


       handleUpdatesalesRequest(req, res);

    } else if (req.method === "POST" && req.url === "/insertsales") {

      handleInsertsalesRequest(req, res);

    } else if (req.method === "POST" && req.url === "/deletesales") {

      handleDeletesalesRequest(req, res);

  } else {

    res.statusCode = 404;
    res.end("Not Found");

  }


});

server.listen(3001, () => {
  console.log("Server running at http://localhost:3001/");
});


 