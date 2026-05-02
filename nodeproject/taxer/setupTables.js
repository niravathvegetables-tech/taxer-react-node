const db = require("./db");

function createTaxerTaxTable() {
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


module.exports = { createTaxerCompanyTable,
  createTaxerContraTable,createTaxerTaxTable };
