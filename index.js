const amqp = require('amqplib/callback_api');

amqp.connect('amqps://ipyybbdy:jvZm9ATl2A0Q-Fdei2l8vP0rFkWjKfFU@prawn.rmq.cloudamqp.com/ipyybbdy', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'tdb-invoice-queue';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg);
      }, secs * 1000);
    }, {
      // manual acknowledgment mode,
      // see /docs/confirms for details
      noAck: false
    });
  });
  // setTimeout(function() {
  //   connection.close();
  //   process.exit(0)
  // }, 1000);
});