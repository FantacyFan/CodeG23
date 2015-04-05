var express = require('express');
var router = express.Router();
var NotificationSchema = require('../models/notification')
var moment = require('moment');
/* Get profile page */
router.get('/', function(req, res) {
	NotificationSchema.find({user_id: req.user._id}, function(err,notis){
		if(err) throw err;
		res.render('notifications',{
			'user' : req.user,
			'notis': notis
		});
	});
});

module.exports = router;