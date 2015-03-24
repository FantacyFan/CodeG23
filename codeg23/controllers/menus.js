var express = require('express');
var router = express.Router();
var MenuSchema = require('../models/menu')
/* Get profile page */
router.get('/', function(req, res) {
	MenuSchema.find({}, function(err,menus){
		if(err) throw err;
		console.log(menus);
		res.render('menus',{
			'user' : req.user,
			'menus': menus
		});
	});
});

module.exports = router;