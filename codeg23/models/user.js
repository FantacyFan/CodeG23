// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

	/* Demographic */
	fullname: String,
	firstname: String,
	lastname: String,
	gender: String,
	birth_month: String,
	birth_day: String,
	birth_year: String,
	languages: String,
	nationality: String,

	/* Contact */
	email: String,
	phone: String,
	address: String,
	city: String,
	state: String,
	country: String,
	wechat: String,
	linkedin: String,

	/* Work and Education */
	company: String,
	school: String,

	/* Interests and Bio */
	interests: String,
	bio: String,

	/* Verification */
	id: String,
	username: String,
	password: String,
	customer_rate: Number,
	owner_rate: Number,
	edu_verified: String,
	edu_email: String,
	edu_key: String,
	facebook_id: String,

	/* Stats */
	reviews_received: Number,
	rate_overall: Number

});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);