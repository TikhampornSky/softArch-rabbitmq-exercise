#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var args = ['Italian', 'Japanese', 'Chinese', 'Thai', 'Indian'];

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    console.log(" [x] Awaiting RPC requests");
    if (error1) {
      throw error1;
    }

    var exchange = 'menu_exchange';

    channel.assertExchange(exchange, 'direct', {
      durable: true
    });

    channel.assertQueue('', {
      exclusive: true
      }, function(error2, q) {
        if (error2) {
          throw error2;
        }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      args.forEach(function(pattern) {
        channel.bindQueue(q.queue, exchange, pattern);
      });

      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });
    });
    
  });
});  
