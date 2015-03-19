var express = require('express');
var router = express.Router();

/* GET Home Page */
router.get('/', isAuthenticated, function(req, res){
	res.render('home', { user: req.user });
});


module.exports = router;