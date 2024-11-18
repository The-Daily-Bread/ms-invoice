class InvoiceItem {
  /** @type {string} */
  id;
  /** @type {string} */
  description;
  /** @type {number} */
  quantity;
  /** @type {number} */
  rate;

  /**
   * 
   * @param {string} id 
   * @param {string} description 
   * @param {number} quantity 
   * @param {number} rate 
   */
  constructor(id, description, quantity, rate) {
    this.id = id;
    this.description = description;
    this.quantity = quantity;
    this.rate = rate;
  }

  toResponse() {
    return {
      id: this.id,
      description: this.description,
      quantity: this.quantity,
      rate: this.rate
    }
  }

  /**
   * 
   * @param {InvoiceItem} invoice 
   */
  static checkFields(invoice) {
    if (!invoice.description) {
      throw new Error('description is required');
    }

    if (!invoice.quantity) {
      throw new Error('quantity is required');
    }

    if (!invoice.rate) {
      throw new Error('rate is required');
    }
  }
}

module.exports = {
  InvoiceItem
};