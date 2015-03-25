var express = require('express');
var router = express.Router();
var MessageSchema = require('../models/message');
var ConversationSchema = require('../models/conversation');
var MenuSchema = require('../models/menu');

router.get('/:id', function(req, res) {
	var conversation_id = req.params.id;
	ConversationSchema.findOne({_id:conversation_id}, function(err, conversation){
		MessageSchema.find({conversation_id:conversation_id},function(err, messages){
			MenuSchema.findOne({_id:conversation.menu_id}, function(err, menu){
				console.log(messages);
				res.render('conversation',{
					user : req.user,
					menu : menu,
					conversation : conversation,
					messages : messages
				});
			});
		});
	});
});

module.exports = router;