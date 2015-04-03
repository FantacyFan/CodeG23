var express = require('express');
var router = express.Router();
var UserSchema = require('../models/user');
var MenuSchema = require('../models/menu');
var RequestSchema = require('../models/request');
var OrderSchema = require('../models/order');
var ReviewSchema = require('../models/review');


/* Review Page */
router.get('/reviews', function(req, res){
	ReviewSchema.find({reviewer_id:req.user._id}, function(err,reviewGiven){
		ReviewSchema.find({receiver_id:req.user._id}, function(err,reviewReceived){
			res.render("reviews", {
				reviewGiven:reviewGiven,
				reviewReceived:reviewReceived 
			})
		})
	})
})

/* Requests page */
router.get('/requests', function(req, res){
	RequestSchema.find({customer_id:req.user._id},function(err,requests){
		res.render("requests", {
			requests : requests,
			user : req.user
		})
	})
})

/* Requests page */
router.post('/requests', function(req, res){
	var reqId = req.body.reqid;
	console.log(reqId);
	RequestSchema.remove({_id:reqId}, function(err){
		if(err){
			console.log(err);
		}
		res.redirect('/profile/requests');
	})
})

/* Requests page */
router.get('/posts', function(req, res){
	MenuSchema.find({user_id:req.user._id},function(err,posts){
		res.render("posts", {
			posts : posts,
			user : req.user
		})
	})
})

/* Requests page */
router.post('/posts', function(req, res){
	var menuId = req.body.menuid;
	console.log(menuId);
	res.redirect('/profile/posts')
})

/* Requests page */
router.get('/sold', function(req, res){
	OrderSchema.find({onwer_id:req.user._id}, function(err, ordersold){
		res.render("sold", {
			sold : ordersold,
			user : req.user
		})
	})
})

/* Get the menu edit page */
router.get('/edit',function(req, res){
	res.render('editprofile',{
		'user' : req.user
	});
});

/* Handle edit page post */
router.post('/edit', function(req, res){
	var bio = req.body.bio;
	var address = req.body.address;
	UserSchema.update({_id: req.user._id},{bio:bio,address:address},function(err){
		res.redirect('/profile/detail/'+req.user._id);
	});
})


/* Requests page */
router.get('/bought', function(req, res){
	OrderSchema.find({customer_id:req.user._id}, function(err, orderbought){
		res.render("bought", {
			bought : orderbought,
			user : req.user
		})
	})
})

/* Get profile page */
router.get('/detail/:id', function(req, res) {
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
	//console.log(idString);
	UserSchema.findOne({_id:idString},function(err,user){
		if(user==null){
			var err = new Error('Not Found');
    		err.status = 404;
			res.render({
				user : req.user,
				error : err
			});
		} else {
			//console.log("found");
			//console.log(user);
			res.render('profile',{
				target_user : user,
				user : req.user,
			})	

		}
	})
});

module.exports = router;