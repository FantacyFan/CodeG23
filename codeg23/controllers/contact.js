var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var fs = require('fs');
var transporter = nodemailer.createTransport({
	service:'gmail',
	auth: {
		user:'cornell.codeg23@gmail.com',
		pass:'2015codeg23'
	}
});

/* GET users listing. */
router.get('/', function(req, res) {
	res.render('contact',{
		user : req.user,
		success: false
	});
 });

router.post('/', function(req, res) {
	var _name = req.body.contactName;
	var _email = req.body.contactEmail;
	var _msg = req.body.contactMessage;
	transporter.sendMail({
		from: 'cornell.gatesg23@gmail.com',
		to: 'yl2493@cornell.edu',
		subject: 'Contact Message From '+_name,
		text: 'Email: '+_email+'\n'+_msg
	});
	res.render('contact',{
		user : req.user,
		success: true
	});
})



module.exports = router;
