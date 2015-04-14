var express = require('express');
// var app = express();
var url = require('url');
var router = express.Router();

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

	router.get('/auth/facebook', passport.authenticate('facebook'));

	router.get('/auth/facebook/callback',
		passport.authenticate('facebook',{
			successRedirect: '/',
			failureRedirect: '/'
		}));

	/* GET Home Page */
	router.get('/', function(req, res){
		//console.log(req.headers);
		//console.log(req.headers.range);
		//console.log(url.parse(req.url).pathname);
		res.render('index', { user: req.user });
	});

	/* GET Home Page Video */
	router.use('/video', require('./video'));

	/* Login controller */
	/* GET login page. */
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/',
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
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash : true  
	}));
	// router.post('/register', function(){
	// 	console.log("Enter");
	// });

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/* Profile controller */
	router.use('/profile', isAuthenticated, require('./profile'));

	/* Order controller */
	router.use('/order', isAuthenticated, require('./order'));

	/* Menus controller */
	/* Including add new menu */
	router.use('/menus', require('./menus'));

	/* Menu detail controller */
	router.use('/menu', isAuthenticated, require('./menu'));

	/* Conversation controller */
	router.use('/conversation', isAuthenticated, require('./conversation'));

	/* Notification controller */
	router.use('/notification', isAuthenticated, require('./notification'));

	/* Request controller */
	router.use('/request', isAuthenticated, require('./request'));

	/* Review controller */
	router.use('/review', isAuthenticated, require('./review'));

	/* foodgallery controller */
	router.use('/foodgallery', isAuthenticated, require('./foodgallery'));

	router.get('/help', function(res, req){
		req.render('help',{
			user: res.user
		});
	});

	/* User */
	router.use('/users', require('./users'));


	return router;
}

