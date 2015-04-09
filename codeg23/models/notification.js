// app/models/notification.js
// load the things we need
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// define the schema for our order model
//type: message, request, approved, rejected, system
//status: read, unread
var notificationSchema = mongoose.Schema({
	user_id : ObjectId,
	sender_id: ObjectId,
	type : String,
	status : String,
	timestamp : Date,
	content : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Notification', notificationSchema);