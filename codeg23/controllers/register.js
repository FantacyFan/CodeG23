var express = require('express');
var router = express.Router();

/* Get profile page */
router.get('/', function(req, res) {
	res.render('register',{
		message: req.flash('message')
	});
});

/* Handle Registration POST */
router.post('/', passport.authenticate('register', {
	successRedirect: '/home',
	failureRedirect: '/',
	failureFlash : true  
}));

module.exports = router;