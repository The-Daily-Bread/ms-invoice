const Factory = require("../dao/factory");
const { InvoiceDao } = require("../dao/invoice");
const { InvoiceItemDao } = require("../dao/invoiceItem");
const { LogDao } = require("../dao/log");
const { Invoice } = require("../model/invoice");

/**
 * 
 * @param {Invoice} invoice 
 * @returns 
 */
async function createInvoice(invoice) {
  const factory = new Factory();
  const connection = factory.getConnection();
  const logDao = new LogDao(connection);

  try {
    Invoice.checkFields(invoice);
  } catch (error) {
    await logDao.put({
      timestamp: Date.now(),
      message: error.message,
      content: JSON.stringify(invoice)
    });

    throw new Error('Invalid invoice: ' + error.message);
  }


  try {
    const invoiceDao = new InvoiceDao(connection);
    const invoiceItemDao = new InvoiceItemDao(connection);

    const { id } = await invoiceDao.put(invoice);

    for (const item of invoice.items) {
      await invoiceItemDao.put(item, id);
    }
  } catch (error) {
    await logDao.put({
      timestamp: Date.now(),
      message: error.message,
      content: JSON.stringify(invoice)
    });

    throw new Error('Error creating invoice');
  } finally {
    factory.close();
  }

  return invoice;
}

module.exports = {
  createInvoice
};