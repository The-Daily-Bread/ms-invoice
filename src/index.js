const amqp = require('amqplib/callback_api');
const { createInvoice } = require('./service/service');

const QUEUE_NAME = 'tdb-invoice-queue';

amqp.connect('amqps://ipyybbdy:jvZm9ATl2A0Q-Fdei2l8vP0rFkWjKfFU@prawn.rmq.cloudamqp.com/ipyybbdy', function(connectionError, connection) {
  if (connectionError) {
    throw connectionError;
  }

  connection.createChannel(function(createChannelError, channel) {
    if (createChannelError) 
      throw createChannelError;
    
    channel.assertQueue(QUEUE_NAME, {
      durable: true
    });

    channel.prefetch(1);

    console.info(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE_NAME);

    channel.consume(QUEUE_NAME, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;

      console.info(" [x] Received %s", msg.content.toString());

      try {
        const parsedJson = JSON.parse(msg.content.toString());

        createInvoice(parsedJson)
          .then(() => {
            console.info(" [x] Done");
            channel.ack(msg);
          })
          .catch(() => {
            console.error(" [x] Error");
            channel.nack(msg);
          });
      } catch (error) {
        channel.nack(msg);
      }
      
      setTimeout(function() {
        console.info(" [x] Done");
        channel.ack(msg);
      }, secs * 1000);
    }, {
      noAck: false
    });
  });
});