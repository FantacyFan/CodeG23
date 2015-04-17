var express = require('express');
var router = express.Router();
var MessageSchema = require('../models/message');
var ConversationSchema = require('../models/conversation');
var MenuSchema = require('../models/menu');
var UserSchema = require('../models/user');

router.get('/:id', function(req, res) {
	var conversation_id = req.params.id;
	ConversationSchema.findOne({_id:conversation_id}, function(err, conversation){
		MessageSchema.find({conversation_id:conversation_id},function(err, messages){
			MenuSchema.findOne({_id:conversation.menu_id}, function(err, menu){
				UserSchema.findOne({_id:conversation.customer_id}, function(err, guest){
					UserSchema.findOne({_id:conversation.owner_id}, function(err, host){
						res.render('conversation',{
							user : req.user,
							menu : menu,
							host : host,
							guest : guest,
							conversation : conversation,
							messages : messages
						});
					});
				});
			});
		});
	});
});

module.exports = router;