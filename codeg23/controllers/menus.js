var express = require('express');
var router = express.Router();
var MenuSchema = require('../models/menu')
var moment = require('moment');
/* Get profile page */
router.get('/', function(req, res) {
	MenuSchema.find({}, function(err,menus){
		if(err) throw err;
		console.log(menus);
		res.render('menus',{
			'user' : req.user,
			'menus': menus
		});
	});
});

router.get('/add',function(req, res){
	res.render('addmenu',{
		'user' : req.user
	})
})

router.post('/add', function(req, res){
	var action = req.body.action;
	//console.log("add post");
	switch(action){
		case "Add":
			console.log("Add Menu");
			var _title 				= req.body.title;
			var _detail 			= req.body.detail;
			var _type 				= req.body.type; 
			var _location 			= req.body.location;
			var _quantity			= req.body.quantity; 
			var _price 				= req.body.price;
			var _now				= moment();
			//create a new menu
			var _menu = MenuSchema({
				user_id: req.user._id,
				title: _title,
				type: _type,
				quantity: _quantity,
				detail: _detail,
				price: _price,
				order_time: _now,
				location: _location,
				other: 'none'
			});
			//save the new menu
			_menu.save(function(err){
				if(err) throw err;
				//get all menus
				MenuSchema.find({}, function(err,menus){
					if(err) throw err;
					console.log(menus);
					res.render('menus',{
						'user' : req.user,
						'menus': menus
					});
				});
			});
			res.redirect('/menus');
			break;
		default:
			console.log("default");
			res.redirect('/menus');
			break;
	}
})

module.exports = router;