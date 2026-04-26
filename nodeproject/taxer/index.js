const http = require("http");
const db = require("./db");
const { createTaxerCompanyTable } = require("./setupTables");
const { handleCompanyRequest, getcompanydetails } = require("./company");

createTaxerCompanyTable();

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
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
  
});

server.listen(3001, () => {
  console.log("Server running at http://localhost:3001/");
});