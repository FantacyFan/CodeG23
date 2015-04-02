// app/models/review.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our order model
var reviewSchema = mongoose.Schema({
	reviewer_id : String,
	receiver_id : String,
	menu_id : String,
	order_id : String,
	text : String,
	timestamp : Date,
	rate : String
});

// create the model for menu and expose it to our app
module.exports = mongoose.model('Review', reviewSchema);