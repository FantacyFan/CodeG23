// app/models/order.js
// app/models/order.js
// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our order model
var orderSchema = mongoose.Schema({
	owner_id : ObjectId,
	customer_id : ObjectId,
	menu_id : ObjectId,
	request_id : ObjectId,
	timestamp : Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Order', orderSchema);