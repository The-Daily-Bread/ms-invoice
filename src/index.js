const amqp = require('amqplib/callback_api');
const { createInvoice } = require('./service/invoice');
const Factory = require('./dao/factory');
const { LogDao } = require('./dao/log');

const QUEUE_NAME = 'tdb-invoice-queue';
const DEAD_LETTER_QUEUE = 'tdb-invoice-dl';

const AMQP_URL = process.env.AMQP_URL || '';

amqp.connect(AMQP_URL, function(connectionError, connection) {
  if (connectionError) {
    throw connectionError;
  }

  connection.createChannel(function(createChannelError, channel) {
    if (createChannelError) 
      throw createChannelError;
    
    channel.assertQueue(QUEUE_NAME, {
      durable: true,
      deadLetterExchange: DEAD_LETTER_QUEUE,
    });

    channel.prefetch(1);

    console.info(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE_NAME);

    channel.consume(QUEUE_NAME, function(msg) {
      console.info(" [x] Received %s", msg.content.toString());

      const factory = new Factory();
      const connection = factory.getConnection();
      const logDao = new LogDao(connection);

      try {
        const parsedJson = JSON.parse(msg.content.toString());

        createInvoice(parsedJson)
          .then(() => {
            console.info('Invoice created successfully');
            channel.ack(msg, false);
          })
          .catch(error => {
            console.error('Error creating invoice:', error.message);
            channel.nack(msg, false, false);
            channel.publish(DEAD_LETTER_QUEUE, '', msg.content);
          });
      } catch (error) {
        logDao.put({
          timestamp: Date.now(),
          content: msg.content.toString(),
          message: error.message
        }).catch(err => {
          console.error('Error logging error:', err.message);
        });
        
        channel.nack(msg, false, false);
        channel.publish(DEAD_LETTER_QUEUE, '', msg.content);
      } finally {
        factory.close();
      }
    }, {
      noAck: false
    });
  });
});