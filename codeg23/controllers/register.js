var express = require('express');
var router = express.Router();

/* Get profile page */
router.get('/', function(req, res) {
	res.render('register',{

	})
});

module.exports = router;