var express = require('express');
var router = express.Router();
var OrderSchema = require('../models/order');
var MenuSchema = require('../models/menu');
var ReviewSchema = require('../models/review');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;


/* Get profile page */
router.get('/detail/:id', function(req, res) {
	var order_id = req.params.id;
	OrderSchema.findOne({_id:order_id},function(err,order){
		var menu_id = order.menu_id;
		MenuSchema.findOne({_id:menu_id},function(err, menu){
			ReviewSchema.findOne({order_id:order_id},function(err,review){
				res.render('order',{
					user : req.user,
					order : order,
					review : review,
					menu  : menu
				});
			});
		});	
	});
});

module.exports = router;
