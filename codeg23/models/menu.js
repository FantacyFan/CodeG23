// app/models/order.js
// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our order model
var menuSchema = mongoose.Schema({
	title : String,
	detail : String
});

// create the model for menu and expose it to our app
module.exports = mongoose.model('Menu', menuSchema);