var express = require('express');
var router = express.Router();
var MenuSchema = require('../models/menu');
var ConversationSchema = require('../models/conversation');
var RequestSchema = require('../models/request');
var moment = require('moment');
var extra = {
	apiKey : null,
	formatter : null
}
var geocoder = require('node-geocoder')('google','http',extra);

/*********************************
Method: 	Get
Page: 		addmenu.ejs
Function: 	Just used to render the adding menu Page          
*********************************/
router.get('/add',function(req, res){
	res.render('addmenu',{
		'user' : req.user
	})
})

/*********************************
Method: 	Post
Page: 		menus.ejs
Function: 	Handle the form from adding menu page. 
			Redirect to menus page in the end.          
*********************************/
router.post('/add', function(req, res){
	var action = req.body.action;
	//console.log("add post");
	switch(action){
		case "Add":
			console.log("Add Menu");
			var _title 				= req.body.title;
			var _detail 			= req.body.detail;
			var _type 				= req.body.type; 
			var _address 			= req.body.address;
			var _city				= req.body.city;
			var _quantity			= req.body.quantity; 
			var _price 				= req.body.price;
			var _university			= req.body.university;
			var _now				= moment().format();
			var _date				= moment(req.body.date).format();
			var geoinfo = geocoder.geocode(_address+" "+_city, function(err, geo){
				console.log(geo);
				//create a new menu
				var _menu = MenuSchema({
					user_id: req.user._id,
					title: _title,
					type: _type,
					quantity: _quantity,
					detail: _detail,
					price: _price,
					create_time: _now,
					address: _address,
					city: _city,
					host_time: _date,
					university: _university,
					lat: geo[0].latitude,
					lng: geo[0].longitude,
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
			});
		break;

		default:
			console.log("default");
			res.redirect('/menus');
			break;
	}
})

/*********************************
Method: 	Get
Page: 		editmenu.ejs
Function: 	Just used to render the edit menu Page          
*********************************/
router.get('/edit/:id',function(req, res){
	MenuSchema.findOne({_id: req.params.id}, function(err,menu){
		// authenticate request first
		if(menu==null || menu.user_id!=req.user._id){
			var err = new Error('Not Found');
    		err.status = 404;
			res.render({
				user : req.user,
				error : err
			});
		} else {
			res.render('editmenu',{
				'user' : req.user,
				'menu': menu
			});
		}
	});
});

/*********************************
Method: 	Post
Page: 		menu.ejs
Function: 	Handle the form from edit menu page.         
*********************************/
router.post('/edit/:id', function(req, res){
	MenuSchema.findOne({_id: req.params.id}, function(err,menu){
		if(menu.user_id!=req.user._id){
			var err = new Error('Not Found');
    		err.status = 404;
			res.render({
				user : req.user,
				error : err
			});
		} else {
			var title = req.body.title;
			var detail = req.body.detail;
			var location = req.body.location;
			var quantity = req.body.quantity;
			var price = req.body.price;
			var university = req.body.university;
			MenuSchema.update({_id: req.params.id},{
				title:title,
				detail:detail,
				location:location,
				quantity:quantity,
				price:price,
				university:university
			},function(err){
				res.redirect('/menu/detail/'+req.params.id);
			});
		}
	});
})

/* Get menu detail page */
router.get('/detail/:id', function(req, res) {
	//get  menus
	MenuSchema.findOne({_id: req.params.id}, function(err,menu){
		if(menu==null){
			var err = new Error('Not Found');
    		err.status = 404;
			res.render({
				user : req.user,
				error : err
			});
		} else {
			RequestSchema.findOne({owner_id:menu.user_id, customer_id:req.user._id, menu_id:menu._id}, function(err,request){
				//console.log("Menu page user info: "+req.user);
				//console.log(request);
				if(request==null){
					request = undefined;
				}
				res.render('menu',{
					'request' : request,
					'user' : req.user,
					'menu': menu
				});
			});
		}
	});
});

/* Handle post actions from menu page */
router.post("/detail/:id", function(req, res){
	var _menuId = req.params.id;
	var action = req.body.action;
	console.log("Action is:"+action);
	switch(action){
		/* When user click the contact button, redirect them to conversation page */
		case "Contact":
			MenuSchema.findOne({_id: _menuId}, function(err,menu){
				ConversationSchema.findOne({menu_id:_menuId, customer_id:req.user._id}, function(err, conversation){
					if(err) throw err;
					console.log("Menu is:"+menu);
					/* If it is the first time of conversation, intialize a new conversation */
					if(conversation==null){
						console.log("Null Conversation");
						var record = new ConversationSchema({
							owner_id : menu.user_id,
							customer_id : req.user._id,
							menu_id : menu._id
						});
						record.save(function(err){
							if(err){
								console.log(err);
								res.status(500).json({status:'failure'})
							}
							ConversationSchema.findOne({menu_id:_menuId, customer_id:req.user._id}, function(err, conversation){
								res.redirect("/conversation/"+conversation._id);
							});
						});
					/* Else redirect to the existing conversation page */
					} else {
						res.redirect("/conversation/"+conversation._id);
					}
				});
			});
			break;
		/* When user click the apply button, make a request for them */
		case "Apply":
			MenuSchema.findOne({_id: _menuId}, function(err,menu){
				RequestSchema.findOne({menu_id:_menuId, customer_id:req.user._id}, function(err, request){
					/* If the it is the first time of request, initialize a new request */
					if(request==null){
						var text = req.body.text;
						var now = moment();
						var record = new RequestSchema({
							owner_id : menu.user_id,
							customer_id : req.user._id,
							menu_id : _menuId,
							timestamp : now,
							status : 'pending',
							text : text,
						});
						record.save(function(err){
							if(err){
								console.log(err);
								res.status(500).json({status:'failure'})
							}
							res.redirect("/menu/detail/"+_menuId);
						});
					/* If the user has applied before, just redirect to menu page */
					} else {
						res.redirect("/menu/detail/"+_menuId);
					}
				});
			});
			break;
		default:
			res.redirect("/menu/detail/"+_menuId);
			break;
	}
})


module.exports = router;