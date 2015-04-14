var express = require('express');
var router = express.Router();
var OrderSchema = require('../models/order');
var MenuSchema = require('../models/menu');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;
var ReviewSchema = require('../models/review');
var UserSchema = require('../models/review');

/*********************************
Method: 	Get
Page: 		reviews.ejs
Function: 	Just used to render the reviews Page          
*********************************/
router.get('/', function(req, res){
	ReviewSchema.find({reviewer_id:req.user._id}, function(err,reviewGiven){
		ReviewSchema.find({receiver_id:req.user._id}, function(err,reviewReceived){
			res.render("reviews", {
				user : req.user,
				reviewGiven:reviewGiven,
				reviewReceived:reviewReceived 
			})
		})
	})
})

/*********************************
Method: 	Post
Page: 		order.ejs
Function: 	Handle the adding new reviewrequest.
			Create a new review and calculate the rating.           
*********************************/
router.post('/add/', function(req, res){
	var _text = req.body.text;
	var _rate = req.body.rating;
	var _menuId = req.body.menuId;
	var _orderId = req.body.orderId;
	var _receiverId = req.body.receiverId;
	var _now = moment();
	console.log(_rate);
	console.log(_text);
	console.log(_receiverId);
	// res.redirect("/review/");
	/* Calculate the rating */
	UserSchema.findOne({_id:_receiverId}, function(err, user){
		if(user != null) {
			if(typeof user.rate_overall != "undefined" && user.rate_overall != null){
				var prevRate = user.rate_overall;
			} else {
				var prevRate = 0;
			}
			if(typeof user.reviews_received !="undefined" && user.reviews_received != null){
				var prevRateTimes = user.reviews_received;
			} else {
				var prevRateTimes = 0;
			}
			var totalRate = prevRate * prevRateTimes + Number(_rate);
			user["reviews_received"] = prevRateTimes + 1;
			user["rate_overall"] = totalRate / (prevRateTimes + 1);
			user.save(function(err){
				if(err){
					console.log(err);
				}
			})
			/* Generate new review */
			var _review = ReviewSchema({
						reviewer_id : req.user._id,
						receiver_id : _receiverId,
						menu_id : _menuId,
						order_id : _orderId,
						text : _text,
						timestamp : _now,
						rate : _rate
					});
			/* Save the new record to db */
			_review.save(function(err){
				if(err) throw err;
				res.redirect("/review/");
			});
		} else {
			res.redirect("/review/");
		}
	});
})

module.exports = router;