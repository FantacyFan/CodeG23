// app/models/order.js
// app/models/order.js
// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our order model
var orderSchema = mongoose.Schema({
	owner_id : String,
	customer_id : String,
	menu_id : String,
	timestamp : Date,
	menu_host_time: Date,
	menu_meal: String,
	menu_title: String,
	menu_type: String,
	menu_quantity: String,
	status : String
});




// create the model for users and expose it to our app
module.exports = mongoose.model('Order', orderSchema);