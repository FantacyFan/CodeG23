var express = require('express');
// var app = express();
var router = express.Router();

///
var MenuSchema = require('../models/menu')
///

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){
	/* Format for router */
	/* router.use('/your_controller',require('./your_controller_filename')) */

	/* GET Home Page */
	router.get('/index', isAuthenticated, function(req, res){
		res.render('index', { user: req.user });
	});

	/* Login controller */
	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/index',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* Register controller */
	/* GET Registration Page */
	router.get('/register', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/register', passport.authenticate('register', {
		successRedirect: '/index',
		failureRedirect: '/register',
		failureFlash : true  
	}));

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/* Add Menu Page */
	router.get('/addmenu', function(req, res) {
		res.render('addmenu',{

		})
	});

	/* add menu. */
	router.post('/menu/add', function(req, res) {
		var _title 				= req.body.title;
		var _detail 			= req.body.detail;
		var _type 				= req.body.type; 
		var _location 			= req.body.location;
		var _quantity			= req.body.quantity; 
		var _price 				= req.body.price;

		//create a new menu
		var _menu = MenuSchema({
			user_id: '000000',
			title: _title,
			type: _type,
			quantity: _quantity,
			detail: _detail,
			price: _price,
			order_time: '000000',
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
					'menus': menus
				});
			});
		});
	});

	/* Profile controller */
	router.use('/profile', isAuthenticated, require('./profile'));

	/* Order controller */
	router.use('/order', isAuthenticated, require('./order'));

	/* Menus controller */
	router.use('/menus', require('./menus'));

	/* Menu controller */
	router.use('/menu', require('./menu'));


	return router;
}

