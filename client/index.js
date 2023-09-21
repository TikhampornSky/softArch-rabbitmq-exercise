const client = require("./client");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("views",path.join(__dirname,"views"));
app.set("view engine","hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    client.getAllMenu(null,(err,data)=>{
        if(!err){
            res.render("menu",{
                results: data.menu
            });
        }
    });
});

var amqp = require('amqplib/callback_api');

app.post("/placeorder", (req, res) => {
	//const updateMenuItem = {
    var orderItem = {
		id: req.body.id,
		name: req.body.name,
		quantity: req.body.quantity,
	};

    // Send the order msg to RabbitMQ 
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            
            var exchange = 'menu_exchange';
            var msg = JSON.stringify(orderItem);
            var key = ['Italian', 'Japanese', 'Chinese', 'Thai', 'Indian'];
            var routing_key = key[orderItem.quantity%5];
        
            channel.assertExchange(exchange, 'direct', {
              durable: true
            });
            channel.publish(exchange, routing_key, Buffer.from(msg));
            console.log(" [x] Sent Food %s: '%s'", routing_key, msg);

            res.status(200).send('Success');
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Server running at port %d",PORT);
});