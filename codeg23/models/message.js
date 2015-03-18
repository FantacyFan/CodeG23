// app/models/message.js
// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our message model
var orderSchema = mongoose.Schema({
	user_id : String,
	timestamp : Date,
	order_id : String,
	content : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', orderSchema);