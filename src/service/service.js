const { Invoice } = require("../model/invoice");

async function createInvoice(invoice) {
  try {
    Invoice.checkFields(invoice);
  } catch (error) {
    throw new Error('Invalid invoice: ' + error.message);
  }

  // Save invoice to database

  return invoice;
}

module.exports = {
  createInvoice
};