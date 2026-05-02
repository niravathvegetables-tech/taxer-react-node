const http = require("http");
const db = require("./db");
const { createTaxerCompanyTable,createTaxerContraTable,createTaxerTaxTable } = require("./setupTables");
const { handleCompanyRequest, getcompanydetails } = require("./company");


const { handleContraRequest, getcontradetails ,deleteContraRequest  } = require("./contra");

const { insertTax, gettaxdetails  } = require("./tax");



createTaxerCompanyTable();

createTaxerTaxTable();

createTaxerContraTable();

const server = http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/getcompany") {

    getcompanydetails(res); // ✅ pass res
    
  } else if (req.method === "POST" && req.url === "/company") {

    handleCompanyRequest(req, res);

  }else if (req.method === "GET" && req.url === "/getcontra") { 

 getcontradetails(res);

 } else if (req.method === "POST" && req.url === "/contra") {

 handleContraRequest(req, res);

} else if (req.method === "POST" && req.url === "/deletecontra") {

  deleteContraRequest(req, res);


  } else if (req.method === "POST" && req.url === "/tax") {

     insertTax(req, res);


   }else if (req.method === "GET" && req.url === "/gettax") { 

    gettaxdetails(res);

  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
  
});

server.listen(3001, () => {
  console.log("Server running at http://localhost:3001/");
});