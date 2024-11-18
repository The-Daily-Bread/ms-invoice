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
  vendor;
  /** @type {string} */
  customer;
  /** @type {InvoiceItem[]} */
  items;

  /**
   * 
   * @param {string} id 
   * @param {string} invoiceNumber 
   * @param {string} invoiceDate 
   * @param {string} dueDate 
   * @param {string} vendor
   * @param {string} customer
   * @param {InvoiceItem[]} items 
   */
  constructor(id, invoiceNumber, invoiceDate, dueDate, vendor, customer, items) {
    this.id = id;
    this.invoiceNumber = invoiceNumber;
    this.invoiceDate = invoiceDate;
    this.dueDate = dueDate;
    this.vendor = vendor;
    this.customer = customer;
    this.items = items;
  }

  toResponse() {
    return {
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      invoiceDate: this.invoiceDate,
      dueDate: this.dueDate,
      vendor: this.vendor,
      customer: this.customer,
      items: this.items.map(item => item.toResponse())
    }
  }

  /**
   * @param {Invoice} invoice 
   */
  static checkFields(invoice) {
    if (!invoice.invoiceNumber) {
      throw new Error('invoiceNumber is required');
    }

    if (!invoice.invoiceDate) {
      throw new Error('invoiceDate is required');
    }

    if (!invoice.dueDate) {
      throw new Error('dueDate is required');
    }

    if (!invoice.vendor) {
      throw new Error('vendor is required');
    }

    if (!invoice.customer) {
      throw new Error('customer is required');
    }

    if (!invoice.items || !invoice.items.length) {
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