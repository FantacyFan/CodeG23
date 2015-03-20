// app/models/order.js
// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our order model
var menuSchema = mongoose.Schema({
	user_id : String,
	menu_id: String,
	title: String,
	type: String,
	quantity: String,
	detail: String,
	price: Number,
	order_time: Date,
	location: String,
	other: String
});

// create the model for menu and expose it to our app
module.exports = mongoose.model('Menu', menuSchema);

