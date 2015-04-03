var express = require('express');
var router = express.Router();
var MenuSchema = require('../models/menu')
var moment = require('moment');
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
	//var tomorrow = moment(today).add(1,'days');
	console.log(university);
	console.log(today.isValid());
	if(!(typeof university === undefined || university==="")&&today.isValid()){
		console.log("All");
		MenuSchema.find({university:university, host_time:today.toDate()}, function(err,menus){
			if(err) throw err;
			//console.log(menus);
			res.render('menus',{
				'user' : req.user,
				'menus': menus
			});
		});
	} else if(!((typeof university === undefined)||(university===""))){
		console.log("Uni");
		MenuSchema.find({university:university}, function(err,menus){
			if(err) throw err;
			console.log(menus);
			res.render('menus',{
				'user' : req.user,
				'menus': menus
			});
		});
	} else if(today.isValid()){
		console.log("Date");
		MenuSchema.find({host_time:today.toDate()}, function(err,menus){
			if(err) throw err;
			console.log(menus);
			res.render('menus',{
				'user' : req.user,
				'menus': menus
			});
		});
	} else {
		console.log("Else");
		MenuSchema.find({}, function(err,menus){
			if(err) throw err;
			//console.log(menus);
			res.render('menus',{
				'user' : req.user,
				'menus': menus
			});
		});
	}
})

module.exports = router;