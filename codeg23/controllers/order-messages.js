var OrderSchema = require('../models/order');
var MenuSchema = require('../models/menu');
var MessageSchema = require('../models/message');
var moment = require('moment');

module.exports = function(io){
	io.on('connection', function(socket){
		socket.on('order-message', function(msg){
			var now = moment();
			var pieces = msg.split('_');
			var orderid = pieces[0];
			var userid = pieces[1];
			var message = pieces[2];
			record = new MessageSchema({
				user_id : userid,
				timestamp : now,
				order_id : orderid,
				content : message
			})
			record.save(function(err){
				if(err){
					console.log(err);
				}
				io.emit('order-message-'+pieces[0],pieces[2]);
			});
  		});
	});
}