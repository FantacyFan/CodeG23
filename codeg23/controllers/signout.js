var express = require('express');
var router = express.Router();

/* Handle Logout */
router.get('/', function(req, res) {
	req.logout();
	res.redirect('/');
});


module.exports = router;