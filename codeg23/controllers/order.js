var express = require('express');
var router = express.Router();
var OrderSchema = require('../models/order');
var MenuSchema = require('../models/menu');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;


/* Get profile page */
router.get('/:id', function(req, res) {
	// var record = new OrderSchema({
	// 	owner_id : new ObjectId("550b4a832e468b54676ea7fc"),
	// 	customer_id : new ObjectId("550b47198cf6f6a56463380f"),
	// 	menu_id : new ObjectId("550b66994449831b096679ee"),
	// 	timestamp : "2013-05-26T05:00:00.000Z",
	// 	status : "Pending"
	// });
	// record.save(function(err){
	// 	if(err){
	// 		console.log(err);
	// 		res.status(500).json({status:'failure'})
	// 	}
	// });
	// var record = new MenuSchema({
	// 	title : "Nothing",
	// 	detail : "Important"
	// });
	// record.save(function(err){
	// 	if(err){
	// 		console.log(err);
	// 		res.status(500).json({status:'failure'})
	// 	}
	// });

	var order_id = req.params.id;
	OrderSchema.findOne({_id:order_id},function(err,order){
		var menu_id = order.menu_id;
		MenuSchema.findOne({_id:menu_id},function(err, menu){
			res.render('order',{
				user : req.user,
				order : order,
				menu  : menu
			});
		});	
	});
});

router.post('/:id',function(req,res){
	var order_id = req.params.id;
	var message = req.body.message;
	var now = moment();
	//console.log(now.format('YYYY-MM-DD HH:mm:ss Z'));
	record = new MessageSchema({
		user_id : "N/A",
		timestamp : now,
		order_id : order_id,
		content : message
	})
	record.save(function(err){
		if(err){
			res.status(500).json({status:'failure'})
		}
	});
	OrderSchema.findOne({_id:order_id},function(err,order){
		var menu_id = order.menu_id;
		MenuSchema.findOne({_id:menu_id},function(err, menu){
			MessageSchema.find({order_id:order_id},function(err, messages){
				res.render('order',{
					user : req.user,
					messages : messages,
					order : order,
					menu  : menu
				});
			})
		});	
	});

})

module.exports = router;