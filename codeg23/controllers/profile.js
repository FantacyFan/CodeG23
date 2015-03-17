var express = require('express');
var router = express.Router();
var UserSchema = require('../models/user');

/* Get profile page */
router.get('/:id', function(req, res) {
	var idString = req.params.id;
	UserSchema.find({},function(err,user){
		UserSchema.find({},function(err, user){
			console.log(user);
			if(err) throw err;
			res.render('profile',{
				user : user
			})	
		})
	})
});

module.exports = router;