var express = require('express');
var router = express.Router();
var FoodSchema = require('../models/food');
var FoodgallerySchema = require('../models/foodgallery');
var moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;


/* Get profile page */
router.get('/viewall', function(req, res) {
	//find food by gallery id
	FoodgallerySchema.findOne({user_id : req.user._id},function(err, gallery){
		FoodSchema.find({foodgallery_id : gallery._id},function(err, _foods){
			res.render('foodgallery',{
				user : req.user,
				foods : _foods
			});
        });
	});	
});

router.get('/addfood', function(req, res) {
	var user = req.user;
	console.log(user);
	res.render('addfood',{
		user : req.user
	});
});

router.post('/addfood', function(req, res) {

	var _name = req.body.name;
	var _type = req.body.type;
	var _description = req.body.description;
	var _img = req.files;
	var _user_id = req.user._id;

	//find the gallery(one) for current user
	FoodgallerySchema.findOne({user_id : _user_id},function(err, gallery){
		var _food = new FoodSchema();
		_food.user_id = _user_id;
		_food.name = _name;
		_food.type = _type;
		_food.description = _description;
		_food.foodgallery_id = gallery._id;
		_food.imgpath = '/uploads/' + req.files.foodimg.name;
		_food.create_time = moment().format();
		//safe food
		_food.save(function(err) {
            if (err){   
                throw err;  
           	}
			res.render('addfood',{
				user : req.user
			});
        });
	});	
});

module.exports = router;
