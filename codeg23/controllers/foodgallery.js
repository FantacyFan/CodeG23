var express = require('express');
var router = express.Router();
var OrderSchema = require('../models/order');
var MenuSchema = require('../models/menu');
var ReviewSchema = require('../models/review');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;


/* Get profile page */
router.get('/viewall/:id', function(req, res) {
	var user = req.user;
	console.log(user);
	res.render('foodgallery',{
		user : req.user
	});
});

module.exports = router;
