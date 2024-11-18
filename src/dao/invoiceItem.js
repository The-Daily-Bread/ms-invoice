const mysql = require('mysql');
const { v4: uuid } = require('uuid');
const { InvoiceItem } = require('../model/invoiceItem');

class InvoiceItemDao {
  /** @type {mysql.Connection} */
  connection = null;

  constructor(connection) {
    this.connection = connection;
  }

  /**
   * 
   * @param {InvoiceItem} invoiceItem
   * @param {string} invoiceId
   */
  async put(invoiceItem, invoiceId) {
    const sql = `
      INSERT INTO invoice_item
      (id, description, quantity, rate, invoice_id)
      VALUES
      (?, ?, ?, ?, ?)
    `;

    const values = [
      uuid(),
      invoiceItem.description,
      invoiceItem.quantity,
      invoiceItem.rate,
      invoiceId
    ];

    await new Promise((resolve, reject) => {
      this.connection.query(sql, values, (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results);
      });
    });

    return invoiceItem;
  }
}

module.exports = {
  InvoiceItemDao
};