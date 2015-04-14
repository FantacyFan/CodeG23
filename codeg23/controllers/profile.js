var express = require('express');
var router = express.Router();
var UserSchema = require('../models/user');
var MenuSchema = require('../models/menu');
var RequestSchema = require('../models/request');
var OrderSchema = require('../models/order');
var ReviewSchema = require('../models/review');
var nodemailer = require('nodemailer');

var fs = require('fs');


var transporter = nodemailer.createTransport({
	service:'gmail',
	auth: {
		user:'cornell.codeg23@gmail.com',
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
	res.redirect('/profile/posts');
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
	console.log(req.body);
	/* Demographic */
	var _firstname = req.body.firstname;
	var _lastname = req.body.lastname;
	var _gender = req.body.gender;
	var _birth_month = req.body.month;
	var _bitrh_day = req.body.day;
	var _birth_year = req.body.year;
	var _languages = req.body.languages;
	var _nationality = req.body.nationality;

	//check user portrait
	var _img = req.body.portrait;

	//console.log(JSON.stringify(req.files));
	console.log(req.files);
	if(_img != null){
		//console.log(_img);
		
		//if defult img, create new folder, save the file
		
		//else, clear prevous one, save new one

		//update user img path
	}

	/* Contact */
	var _phone = req.body.phone;
	var _address = req.body.address;
	var _city = req.body.city;
	var _state = req.body.state;
	var _country = req.body.country;
	var _wechat = req.body.wechat;
	var _linkedin = req.body.linkedin;

	/* Work and Education */
	var _company = req.body.company;
	var _school = req.body.school;
	/* Interests and Bio */
	var _interests = req.body.interests;
	var _bio = req.body.bio;

	UserSchema.findOne({_id : req.user._id},function(err, doc){
		doc.firstname = _firstname;
		doc.lastname = _lastname;
		doc.gender = _gender;
		doc.birth_month = _birth_month;
		doc.birth_day = _bitrh_day;
		doc.birth_year  = _birth_year;
		doc.languages = _languages;
		doc.nationality = _nationality;

		/* Contact */
		doc.phone = _phone;
		doc.address = _address;
		doc.city = _city;
		doc.state = _state;
		doc.country = _country;
		doc.wechat = _wechat;
		doc.linkedin = _linkedin;

		/* Work and Education */
		doc.company = _company;
		doc.school = _school;

		/* Interests and Bio */
		doc.interests = _interests;
		doc.bio = _bio;
		doc.save();

		res.redirect('/profile/detail');

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
router.get('/detail', function(req, res) {
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
	var idString = req.user._id;
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
				user : req.user,
			})	

		}
	})
});

module.exports = router;