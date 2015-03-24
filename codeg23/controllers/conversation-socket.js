var OrderSchema = require('../models/order');
var MenuSchema = require('../models/menu');
var MessageSchema = require('../models/message');
var moment = require('moment');

module.exports = function(io){
	io.on('connection', function(socket){
		socket.on('conversation', function(msg){
			var now = moment();
			var pieces = msg.split('_');
			var conversationid = pieces[0];
			var userid = pieces[1];
			var message = pieces[2];
			record = new MessageSchema({
				user_id : userid,
				timestamp : now,
				conversation_id : conversationid,
				content : message
			})
			record.save(function(err){
				if(err){
					console.log(err);
				}
				io.emit('conversation-'+pieces[0],pieces[2]);
			});
  		});
	});
}