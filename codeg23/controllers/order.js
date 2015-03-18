var express = require('express');
var router = express.Router();
var OrderSchema = require('../models/order');
var MenuSchema = require('../models/menu');
var MessageSchema = require('../models/message');
var ObjectId = require('mongoose').Types.ObjectId;

/* Get profile page */
router.get('/:id', function(req, res) {
	// var record = new OrderSchema({
	// 	owner_id : new ObjectId("550892752aad4c5006efdae4"),
	// 	customer_id : new ObjectId("5508bf29ae8609da07cbb058"),
	// 	menu_id : new ObjectId("5508c327104b6ae607d1f456"),
	// 	timestamp : "2013-05-26T05:00:00.000Z",
	// 	status : "Pending"
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
			MessageSchema.find({order_id:order_id},function(err, messages){
				res.render('order',{
					messages : messages,
					order : order,
					menu  : menu
				});
			})
		});	
	});
});

router.post('/',function(req,res){
	
})

module.exports = router;