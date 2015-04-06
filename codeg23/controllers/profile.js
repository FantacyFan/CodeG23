var express = require('express');
var router = express.Router();
var UserSchema = require('../models/user');
var MenuSchema = require('../models/menu');
var RequestSchema = require('../models/request');
var OrderSchema = require('../models/order');
var ReviewSchema = require('../models/review');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service:'yahoo',
	auth: {
		user:'cornell.gatesg23@yahoo.com',
		pass:'2015codeg23'
	}
});
var transporter2 = nodemailer.createTransport({
	service:'gmail',
	auth: {
		user:'yl2493@cornell.edu',
		pass:''
	}
});


router.get('/verify', function(req, res){
	res.render('verify',{
		user: req.user
	})
})

router.post('/verify', function(req, res){
	var eduemail = req.body.eduemail;
	if(eduemail.match(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*edu/i)){
		var S4 = function() { 
        	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	    }
		var delim = "-";
	    var key = (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
		transporter.sendMail({
			from: 'cornell.gatesg23@yahoo.com',
			to: eduemail,
			subject: 'Verification',
			text: 'Hi '+req.user.fullname+', we are a team from Cornell Information Science. Please click this link to finish the verification: http://localhost:3000/profile/verify/'+key
		});
		UserSchema.update({_id: req.user._id},{
			edu_verified:"Pending",
		 	edu_email:eduemail,
		 	edu_key:key
		},function(err){
			res.redirect('/profile/verify');
		});
	} else {
		res.render('verify',{
			user: req.user,
			message: {
				content : "Please provide a valid edu email address"
			}
		})
	}
})

router.get('/verify/:key', function(req, res){
	var key = req.params.key;
	UserSchema.update({edu_key:key},{
		edu_verified : "Verified"
	},function(err){
		res.redirect('/profile/verify');
	});
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