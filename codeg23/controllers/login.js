var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res) {
	// Display the Login page with any flash message, if any
	res.render('index', { 
		message: req.flash('message') 
	});
});

/* Handle Login POST */
router.post('/', function(req, res) {
	res.render('login',{
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	})
});

module.exports = router;