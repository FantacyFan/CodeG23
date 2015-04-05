// app/models/request.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our order model
var requestSchema = mongoose.Schema({
	owner_id : String,
	customer_id : String,
	menu_id : String,
	timestamp : Date,
	status: String,
	text : String
});

// create the model for menu and expose it to our app
module.exports = mongoose.model('Request', requestSchema);