const { InvoiceItem } = require("./invoiceItem");

class Invoice {
  /** @type {string} */
  id;
  /** @type {string} */
  invoiceNumber;
  /** @type {string} */
  invoiceDate;
  /** @type {string} */
  dueDate;
  /** @type {string} */
  vendorId;
  /** @type {InvoiceItem[]} */
  items;

  /**
   * 
   * @param {string} id 
   * @param {string} invoiceNumber 
   * @param {string} invoiceDate 
   * @param {string} dueDate 
   * @param {string} vendorId 
   * @param {InvoiceItem[]} items 
   */
  constructor(id, invoiceNumber, invoiceDate, dueDate, vendorId, items) {
    this.id = id;
    this.invoiceNumber = invoiceNumber;
    this.invoiceDate = invoiceDate;
    this.dueDate = dueDate;
    this.vendorId = vendorId;
    this.items = items;
  }

  toResponse() {
    return {
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      invoiceDate: this.invoiceDate,
      dueDate: this.dueDate,
      vendorId: this.vendorId,
      items: this.items.map(item => item.toResponse())
    }
  }

  /**
   * @param {Invoice} invoice 
   */
  static checkFields(invoice) {
    if (!invoice.id) {
      throw new Error('id is required');
    }

    if (!invoice.invoiceNumber) {
      throw new Error('invoiceNumber is required');
    }

    if (!invoice.invoiceDate) {
      throw new Error('invoiceDate is required');
    }

    if (!invoice.dueDate) {
      throw new Error('dueDate is required');
    }

    if (!invoice.vendorId) {
      throw new Error('vendorId is required');
    }

    if (!invoice.items) {
      throw new Error('items is required');
    }

    invoice.items.forEach(item => {
      InvoiceItem.checkFields(item);
    });
  }
}

module.exports = {
  Invoice
};