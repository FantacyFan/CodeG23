// app/models/conversation.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our order model
var conversationSchema = mongoose.Schema({
	owner_id : String,
	customer_id : String,
	menu_id : String
});

// create the model for menu and expose it to our app
module.exports = mongoose.model('Conversation', conversationSchema);