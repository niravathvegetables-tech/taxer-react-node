const db = require("./db");

function createTaxerTaxTable(){
  const query = `
    CREATE TABLE IF NOT EXISTS taxer_taxes (
      tax_id INT AUTO_INCREMENT PRIMARY KEY,
      tax_name VARCHAR(255) NOT NULL,
      tax_percent VARCHAR(255)
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table taxer_taxes is ready.");
    }
  });
}


function createTaxerTransactionTable(){
  const query = `
    CREATE TABLE IF NOT EXISTS taxer_transaction (
      transaction_id   INT AUTO_INCREMENT PRIMARY KEY,
       company_id INT NOT NULL,
      transactionamount VARCHAR(255) NOT NULL,
      tax VARCHAR(255) NOT NULL,
       Total VARCHAR(255) NOT NULL,
       date DATE NOT NULL
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table taxer_transaction is ready.");
    }
  });
}


function createTaxerSalesTable(){
  const query = `
    CREATE TABLE IF NOT EXISTS taxer_sales (
      sales_id    INT AUTO_INCREMENT PRIMARY KEY,
       transaction_id INT NOT NULL,
        stocks_id INT NOT NULL,
      sales_amount VARCHAR(255) NOT NULL,
      sales_count VARCHAR(255) NOT NULL,
       sales_item_type VARCHAR(255) NOT NULL,
        sales_total VARCHAR(255) NOT NULL,
       date DATE NOT NULL
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table taxer_sales is ready.");
    }
  });
}


function createTaxerPurchaseTable(){
  const query = `
    CREATE TABLE IF NOT EXISTS taxer_purchase (
      purchase_id   INT AUTO_INCREMENT PRIMARY KEY,
       transaction_id INT NOT NULL,
        stocks_id INT NOT NULL,
      purchase_amount VARCHAR(255) NOT NULL,
      purchase_count VARCHAR(255) NOT NULL,
       purchase_item_type VARCHAR(255) NOT NULL,
        purchase_total VARCHAR(255) NOT NULL,
       date DATE NOT NULL
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table taxer_purchase is ready.");
    }
  });
}



function createTaxerReceiptTable(){
  const query = `
    CREATE TABLE IF NOT EXISTS taxer_receipt (
      receipt_id  INT AUTO_INCREMENT PRIMARY KEY,
       company_id INT NOT NULL,
      receipt_name VARCHAR(255) NOT NULL,
      receipt_amount VARCHAR(255) NOT NULL,
       receipt_date DATE NOT NULL
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table taxer_receipt is ready.");
    }
  });
}

function createTaxerPaymentTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS taxer_payment (
      payment_id  INT AUTO_INCREMENT PRIMARY KEY,
        company_id INT NOT NULL,
        payment_name VARCHAR(255) NOT NULL,
      payment_amount VARCHAR(255) NOT NULL,
       payment_date DATE NOT NULL
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table taxer_payment is ready.");
    }
  });
}


function createTaxerCompanyTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS taxer_company (
      company_id INT AUTO_INCREMENT PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      company_address VARCHAR(255),
      company_trn VARCHAR(50),
      company_data VARCHAR(50),
      tax_id INT,
      company_amount DECIMAL(15,2)
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table taxer_company is ready.");
    }
  });
}


function createTaxerContraTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS taxer_contra (
      contra_id INT AUTO_INCREMENT PRIMARY KEY,
      company_id INT NOT NULL,
      contra_name VARCHAR(255) NOT NULL,
      contra_amount DECIMAL(15,2) NOT NULL,
      contra_date DATE NOT NULL
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table taxer_contra is ready.");
    }
  });
}



function createTaxerStockTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS taxer_stocks (
      stocks_id INT AUTO_INCREMENT PRIMARY KEY,
      company_id INT NOT NULL,
      stocks_name VARCHAR(255) NOT NULL,
      stocks_price VARCHAR(255) NOT NULL,
      stocks_total VARCHAR(255) NOT NULL,
      stocks_image VARCHAR(255) NOT NULL,
      stocks_unit VARCHAR(255) NOT NULL
       
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table taxer_stock is ready.");
    }
  });
}


module.exports = { createTaxerCompanyTable,
  createTaxerContraTable,createTaxerSalesTable,createTaxerTaxTable,createTaxerStockTable,createTaxerPaymentTable,createTaxerReceiptTable,createTaxerPurchaseTable,createTaxerTransactionTable };
