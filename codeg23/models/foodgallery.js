// app/models/foodgallery.js
// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our order model
var foodgallerySchema = mongoose.Schema({
	user_id : String
//	name: String,
//	type: String,
//	imgpath: String,
//	create_time: Date
});

// create the model for food gallery and expose it to our app
module.exports = mongoose.model('Foodgallery', foodgallerySchema);

