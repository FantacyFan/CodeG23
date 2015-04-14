var express = require('express');
var router = express.Router();
var UserSchema = require('../models/user');

/* GET users listing. */
router.get('/detail/:id', function(req, res) {
	var userId = req.params.id;
	UserSchema.findOne({_id : userId},function(err, target){
		res.render('users',{
			user : req.user,
			target : target
		});
	})
 });

module.exports = router;
