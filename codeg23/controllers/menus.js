var express = require('express');
var router = express.Router();
var MenuSchema = require('../models/menu')
var moment = require('moment');
var extra = {
	apiKey : null,
	formatter : null
}
var geocoder = require('node-geocoder')('google','http',extra);

/* Get profile page */
router.get('/', function(req, res) {
	MenuSchema.find({}, function(err,menus){
		if(err) throw err;
		//console.log(menus);
		res.render('menus',{
			'user' : req.user,
			'menus': menus
		});
	});
});

router.post('/',function(req, res) {
	var university = req.body.university;
	var today = moment(req.body.date);
	var isFlexible = req.body.flexible;
	var guest = req.body.guest;
	var category = req.body.category;
	//var tomorrow = moment(today).add(1,'days');
	console.log(university);
	console.log(today.isValid());
	console.log(guest);
	console.log(category);
	var query = {};
	if(!(typeof university === "undefined" || university==="")
		&& today.isValid()
		&& !(typeof guest === "undefined" || guest==="")
		&& !(typeof category === "undefined" || category==="")){
		console.log("All");
		query = {
			university:new RegExp(university),
			host_time:today.toDate(),
			type: category,
			quantity: guest
		}
	} else if(!(typeof university === "undefined" || university==="")
		&& today.isValid()
		&& !(typeof guest === "undefined" || guest==="")){
		console.log("Uni Dat Gus");
		query = {
			university:new RegExp(university),
			host_time:today.toDate(),
			quantity: guest
		}
	} else if(!(typeof university === "undefined" || university==="")
		&& today.isValid()
		&& !(typeof category === "undefined" || category==="")){
		console.log("Uni Dat Cat");
		query = {
			university:new RegExp(university),
			host_time:today.toDate(),
			type: category
		}
	} else if(!(typeof university === "undefined" || university==="")
		&& !(typeof guest === "undefined" || guest==="")
		&& !(typeof category === "undefined" || category==="")){
		console.log("Uni Gus Cat");
		query = {
			university:new RegExp(university),
			type: category,
			quantity: guest
		}
	} else if(!(typeof university === "undefined" || university==="")
		&& today.isValid()){
		console.log("Uni Dat");
		query = {
			university:new RegExp(university),
			host_time:today.toDate()
		}
	} else if(!(typeof university === "undefined" || university==="")
		&& !(typeof guest === "undefined" || guest==="")){
		console.log("Uni Gus");
		query = {
			university:new RegExp(university),
			quantity: guest
		}
	} else if(!(typeof university === "undefined" || university==="")
		&& !(typeof category === "undefined" || category==="")){
		console.log("Uni Cat");
		query = {
			university:new RegExp(university),
			type: category
		}
	} else if(!((typeof university === "undefined")||(university===""))){
		console.log("Uni");
		query = {
			university:new RegExp(university)
		}
	} else {
		university = "Cornell university";
		console.log("Else");
		query= {};
	}
	var geoinfo = geocoder.geocode(university, function(err, geo){
		MenuSchema.find(query, function(err,menus){
			if(err) throw err;
			console.log(geo);
			res.render('menus',{
				'geo' : geo,
				'user' : req.user,
				'menus': menus
			});
		});
	});
})

module.exports = router;