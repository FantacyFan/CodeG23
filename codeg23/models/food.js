// app/models/food.js
// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our order model
var foodSchema = mongoose.Schema({
	user_id : String,
	foodgallery_id: String,
	name: String,
	type: String,
	description: String,
	imgpath: String,
//	host_times: Date,
	create_time: Date
});

// create the model for food and expose it to our app
module.exports = mongoose.model('Food', foodSchema);

