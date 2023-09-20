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

    queueHandle(channel, 'Kitchen 1', exchange, ['Italian']);
    queueHandle(channel, 'Kitchen 2', exchange, ['Japanese', 'Chinese']);
    queueHandle(channel, 'Kitchen 3', exchange, ['Japanese', 'Thai', 'Indian']);
    queueHandle(channel, 'Kitchen 4', exchange, ['Italian', 'Japanese', 'Chinese', 'Thai', 'Indian']);

  });
});  

function queueHandle(channel, qname, exchange, routingKeys) {
  channel.assertQueue(qname, {
    exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
    console.log(' [*]' + qname + ': Waiting for order. To exit press CTRL+C');

    routingKeys.forEach(routingKey => {
      channel.bindQueue(q.queue, exchange, routingKey);
    });

    channel.consume(q.queue, function(msg) {
      console.log(" [x] %s receives %s: '%s'", qname, msg.fields.routingKey, msg.content.toString());
    }, {
      noAck: true
    });
  });
}