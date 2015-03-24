var express = require('express');
var router = express.Router();
var MenuSchema = require('../models/menu');
var ConversationSchema = require('../models/conversation');
/* Get profile page */
router.get('/', function(req, res) {
	res.render('Login',{

	})
});

/* Get profile page */
router.get('/:id', function(req, res) {
	//get  menus
	MenuSchema.findOne({_id: req.params.id}, function(err,menu){
		ConversationSchema.findOne({menu_id:menu, customer_id:req.user._id}, function(err, conversation){
			if(err) throw err;
			//console.log(menu);
			if(conversation==null){
				console.log("Null Conversation");
				var record = new ConversationSchema({
					owner_id : menu.user_id,
					customer_id : req.user._id,
					menu_id : menu._id
				});
				record.save(function(err){
					if(err){
						console.log(err);
						res.status(500).json({status:'failure'})
					}
					ConversationSchema.findOne({menu_id:menu._id, customer_id:req.user._id}, function(err, conversation){
						console.log(req.user);
						res.render('menu',{
							'user' : req.user,
							'conversation' : conversation,
							'menu': menu
						});
					});
				});
			} else {
				console.log(req.user);
				res.render('menu',{
					'user' : req.user,
					'conversation' : conversation,
					'menu': menu
				});
			}
		})
	});
});


module.exports = router;