var express = require('express');
var router = express.Router();
var UserSchema = require('../models/user');
var MenuSchema = require('../models/menu')

/* Get profile page */
router.get('/:id', function(req, res) {
	// var record = new UserSchema({
	// 	fullname: "Long",
	// 	email: "lm675@cornell.edu",
	// 	address: "Collegetown Terrace",
	// 	bio: "Long Long story.",
	// 	customer_rate: 5,
	// 	owner_rate: 5
	// });
	// console.log(record);
	// record.save(function(err){
	// 	if(err){
	// 		console.log(err);
	// 		res.status(500).json({status:'failure'})
	// 	}
	// 	console.log(123);
	// });
	var idString = req.params.id;
	UserSchema.find({_id:idString},function(err,user){
		console.log(user);
		if(err) throw err;
		res.render('profile',{
			user : user
		})	
	})
});

module.exports = router;