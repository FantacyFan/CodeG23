var express = require('express');
// var app = express();
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

	return router;
}

