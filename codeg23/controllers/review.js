var express = require('express');
var router = express.Router();
var OrderSchema = require('../models/order');
var MenuSchema = require('../models/menu');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;
var ReviewSchema = require('../models/review');
var UserSchema = require('../models/user');

/*********************************
Method: 	Get
Page: 		reviews.ejs
Function: 	Render the reviews Page          
*********************************/

router.get('/', function(req, res){
	ReviewSchema.find({reviewer_id:req.user._id}, function(err,reviewGiven){
		ReviewSchema.find({receiver_id:req.user._id}, function(err,reviewReceived){
			//find pending reviews
			var reviewInfos = [];
			var menuIds = [];
			OrderSchema.find({$or:[{customer_id:req.user._id},
			{owner_id:req.user._id}]}, function(err, orders){
				// //get orders with order id -> menu.host_time <= now()
				// for(var i = 0; i < orders.length; i ++){
				// 	menuIds.push(orders[i]['menu_id']);
				// }
				// MenuSchema.find({_id: {$in: menuIds}},function(err, menus){
				for(var i = 0; i < orders.length; i ++){	
					//get passed event
					if(orders[i]["menu_host_time"].valueOf() < moment().valueOf()){
						var reviewInfo = {};
						reviewInfo["order"] = orders[i];
						//find is host or guest	
						if(orders[i]["owner_id"] == req.user._id){
							reviewInfo["identity"] = "host";
							reviewInfo["receiver_id"] = orders[i]["customer_id"];
							reviewInfo["reviewer_id"] = req.user._id;
							reviewInfo["order_id"] = orders[i]["_id"];
						}
						else{
							reviewInfo["identity"] = "guest";
							reviewInfo["receiver_id"] = orders[i]["owner_id"];
							reviewInfo["reviewer_id"] = req.user._id;
							reviewInfo["order_id"] = orders[i]["_id"];
						}					
						reviewInfos.push(reviewInfo);
					}																
				}
				//check if database already exist reviews
				var newInfos = [];
				var done = 0;
				for(var i = 0; i < reviewInfos.length; i ++){
					console.log("user is " + req.user._id);
					(function(i){ReviewSchema.findOne({receiver_id : reviewInfos[i]["receiver_id"],
						reviewer_id : req.user._id, order_id : reviewInfos[i]["order_id"]},
						function(err, review){
							if(review == null){
								console.log("not found " );
								newInfos.push(reviewInfos[i]);
							}else{
								console.log("found " + review["reviewer_id"]);
							}
							done ++;

							if(done == reviewInfos.length){
								ReviewSchema.find({},function(err, rs){
									console.log("All Infos")
									console.log(reviewInfos);
									console.log("All Reviews");
									console.log(rs);
									res.render("reviews", {
									user : req.user,
									reviewGiven:reviewGiven,
									reviewReceived:reviewReceived,
									reviewInfos: newInfos
									})	
								})
								
							}
					})})(i);
				}
				//})
			})
		})
	})
})

/*
router.get('/', function(req, res){
	ReviewSchema.find({reviewer_id:req.user._id}, function(err,reviewGiven){
		ReviewSchema.find({receiver_id:req.user._id}, function(err,reviewReceived){
			//find pending reviews
			var reviewInfos = [];
			var menuIds = [];
			OrderSchema.find({$or:[{customer_id:req.user._id},
			{owner_id:req.user._id}]}, function(err, orders){
				//get orders with order id -> menu.host_time <= now()
				for(var i = 0; i < orders.length; i ++){
					menuIds.push(orders[i]['menu_id']);
				}
				MenuSchema.find({_id: {$in: menuIds}},function(err, menus){
					for(var i = 0; i < menus.length; i ++){	
						//get passed event
						if(menus[i]["host_time"].valueOf() < moment().valueOf()){
							var reviewInfo = {};
							reviewInfo["menu"] = menus[i];
							//find is host or guest
							for(var j = 0; j < orders.length; j ++){
								if (orders[j]["owner_id"] == menus[i]["user_id"]) {
									if(orders[j]["owner_id"] == req.user._id){
										reviewInfo["identity"] = "host";
										reviewInfo["receiver_id"] = orders[j]["customer_id"];
										reviewInfo["reviewer_id"] = req.user._id;
										reviewInfo["order_id"] = orders[j]["_id"];
									}
									else{
										reviewInfo["identity"] = "guest";
										reviewInfo["receiver_id"] = orders[j]["owner_id"];
										reviewInfo["reviewer_id"] = req.user._id;
										reviewInfo["order_id"] = orders[j]["_id"];
										console.log(j);
									}
								}
							}
							reviewInfos.push(reviewInfo);
						}																
					}
					//check if database already exist reviews
					var newInfos = [];
					var done = 0;
					for(var i = 0; i < reviewInfos.length; i ++){
						console.log("user is " + req.user._id);
						(function(i){ReviewSchema.findOne({receiver_id : reviewInfos[i]["receiver_id"],
							reviewer_id : req.user._id, order_id : reviewInfos[i]["order_id"]},
							function(err, review){
								if(review == null){
									console.log("not found " );
									newInfos.push(reviewInfos[i]);
								}else{
									console.log("found " + review["reviewer_id"]);
								}
								done ++;

								if(done == reviewInfos.length){

									//console.log(newInfos);
									//console.log(reviewInfos);

									ReviewSchema.find({},function(err, rs){
										console.log("All Infos")
										console.log(reviewInfos);
										console.log("All Reviews");
										console.log(rs);
										res.render("reviews", {
										user : req.user,
										reviewGiven:reviewGiven,
										reviewReceived:reviewReceived,
										reviewInfos: newInfos
										})	
									})
									
								}
						})})(i);

					}
				})
			})
		})
	})
})

*/

/*********************************
Method: 	Get
Page: 		review.ejs
Function: 	render review add page           
*********************************/
router.get('/add/:receiver_id/:menu_id/:oredr_id/:type', function(req, res){	
	var receiver_id = req.params.receiver_id;
	var menu_id = req.params.menu_id;
	var order_id = req.params.oredr_id;
	var type = req.params.type;
	if(type == 'guest'){
		res.render("addreview", {
			user : req.user,
			receiver_id : receiver_id,
			menu_id : menu_id,
			order_id : order_id
		})
	}
	else{
		res.render("addreviewhost", {
			user : req.user,
			receiver_id : receiver_id,
			menu_id : menu_id,
			order_id : order_id
		})
	}
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
	var _menuId = req.body.receiver_id;
	var _orderId = req.body.order_id;
	var _receiverId = req.body.receiver_id;
	var _now = moment();
	var _img = req.files.reviewimg;
	var _imgpath = 'empty';
	if(typeof _img != "undefined"){
		_imgpath = '/uploads/' + req.files.reviewimg.name;
	}
	
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
						rate : _rate,
						imgpath : _imgpath
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