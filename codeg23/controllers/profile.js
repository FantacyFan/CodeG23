var express = require('express');
var router = express.Router();
var UserSchema = require('../models/user');
var MenuSchema = require('../models/menu');
var RequestSchema = require('../models/request');
var OrderSchema = require('../models/order');

/* Get profile page */
router.get('/:id', function(req, res) {
	// var record = new UserSchema({
	// 	fullname: "Long",
	// 	email: "lm675@cornell.edu",
	// 	address: "Collegetown Terrace",
	// 	bio: "Long Long story.",
	// 	customer_rate: 5,
	// 	owner_rate: 5
	// });
	// console.log(record);
	// record.save(function(err){
	// 	if(err){
	// 		console.log(err);
	// 		res.status(500).json({status:'failure'})
	// 	}
	// 	console.log(123);
	// });
	var idString = req.params.id;
	UserSchema.findOne({_id:idString},function(err,user){
		OrderSchema.find({onwer_id:user._id}, function(err, ordersold){
			OrderSchema.find({customer_id:user._id}, function(err, orderbought){
				MenuSchema.find({},function(err,posts){
					RequestSchema.find({},function(err,requests){
						console.log(user);
						if(err) throw err;
						res.render('profile',{
							user : user,
							ordersold : ordersold,
							orderbought : orderbought,
							posts : posts,
							requests : requests
						})	
					})
				})
			});
		});
	})
});

module.exports = router;