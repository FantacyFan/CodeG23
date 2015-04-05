var express = require('express');
var router = express.Router();
var OrderSchema = require('../models/order');
var MenuSchema = require('../models/menu');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;
var ReviewSchema = require('../models/review');

router.post('/add/', function(req, res){
	var _text = req.body.text;
	var _rate = req.body.rate;
	var _menuId = req.body.menuId;
	var _orderId = req.body.orderId;
	var _receiverId = req.body.receiverId;
	var _now = moment();
	var _review = ReviewSchema({
				reviewer_id : req.user._id,
				receiver_id : _receiverId,
				menu_id : _menuId,
				order_id : _orderId,
				text : _text,
				timestamp : _now,
				rate : _rate
			});
	//save the new menu
	_review.save(function(err){
		if(err) throw err;
		//get all menus
		OrderSchema.findOne({_id:_orderId}, function(err,order){
			if(err) throw err;
			MenuSchema.findOne({_id:_menuId},function(err, menu){
				ReviewSchema.findOne({order_id:_orderId},function(err,review){
					res.render('order',{
						'user' : req.user,
						'menu' : menu,
						'order': order,
						'review' : review
					});
				});
			});
		});
	});
})

module.exports = router;