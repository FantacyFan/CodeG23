var express = require('express');
var router = express.Router();

/* Get profile page */
router.get('/', function(req, res) {
	res.render('order',{

	})
});

module.exports = router;