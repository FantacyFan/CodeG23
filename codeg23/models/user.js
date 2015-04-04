// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
	id: String,
	username: String,
	password: String,
	fullname: String,
	firstname: String,
	lastname: String,
	email: String,
	address: String,
	bio: String,
	customer_rate: Number,
	owner_rate: Number,
	edu_verified: String,
	edu_email: String,
	edu_key: String,
	gender: String,
	facebook_id: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);