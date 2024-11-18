const mysql = require('mysql');
const { v4: uuid } = require('uuid');
const { Invoice } = require('../model/invoice');

class InvoiceDao {
  /** @type {mysql.Connection} */
  connection = null;

  constructor(connection) {
    this.connection = connection;
  }

  /**
   * 
   * @param {Invoice} invoice 
   */
  async put(invoice) {
    const sql = `
      INSERT INTO invoice
      (id, invoice_number, invoice_date, due_date, vendor, customer)
      VALUES
      (?, ?, ?, ?, ?, ?)
    `;

    const newId = uuid();
    const values = [
      newId,
      invoice.invoiceNumber,
      invoice.invoiceDate,
      invoice.dueDate,
      invoice.vendor,
      invoice.customer
    ];

    await new Promise((resolve, reject) => {
      this.connection.query(sql, values, (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results);
      });
    });

    return {
      ...invoice,
      id: newId
    };
  }
}

module.exports = {
  InvoiceDao
};