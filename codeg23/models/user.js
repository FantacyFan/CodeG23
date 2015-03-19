// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
	fullname: String,
	email: String,
	address: String,
	bio: String,
	customer_rate: Number,
	owner_rate: Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);