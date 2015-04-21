var express = require('express');
var router = express.Router();
var RequestSchema = require('../models/request');
var UserSchema = require('../models/user');
var OrderSchema = require('../models/order');
var NotificationSchema = require('../models/notification');
var MenuSchema = require('../models/menu');
var moment = require('moment');


/*  pendingreqs.ejs */
// router.get('/pending/:id', function(req, res) {
// 	RequestSchema.find({menu_id:req.params.id},function(err,requests){
// 		//for each request, create reqInfo json, return
// 		var reqInfos = [];
// 		for(var i = 0; i < requests.length; i ++){

// 			var reqInfo = {};
// 			reqInfo['req_id'] = requests[i]['_id'];
// 			reqInfo['owner_id'] = requests[i]['owner_id'];
// 			reqInfo['customer_id'] = requests[i]['customer_id'];
// 			reqInfo['text'] = requests[i]['text'];

// 			UserSchema.findOne({_id: requests[i]['customer_id']}, function(err,customer){
// 				reqInfo['customer_name'] = customer.fullname;
// 				reqInfos.push(reqInfo);

// 			})
// 		}
// 		res.render('pendingreqs',{
// 			reqInfos : reqInfos,
// 			'user' : req.user
// 		})
// 	})
// })

/*  pendingreqs.ejs */
router.get('/pending/:id', function(req, res) {
	var _menuId = req.params.id;
	RequestSchema.find({menu_id : _menuId},function(err,requests){
		//for each request, create reqInfo json, return
		var reqInfos = [];
		for(var i = 0; i < requests.length; i++){

			var reqInfo = {};
			reqInfo['_id'] = requests[i]['_id'];
			reqInfo['menu_id'] = _menuId;
			reqInfo['owner_id'] = requests[i]['owner_id'];
			reqInfo['customer_id'] = requests[i]['customer_id'];
			reqInfo['status'] = requests[i]['status'];
			reqInfo['text'] = requests[i]['text'];
			if(requests[i]['text'] == ''){
				reqInfo['text'] = 'Empty Message';
			}
			reqInfos.push(reqInfo);

		}
		res.render('pendingreqs',{
			reqInfos : reqInfos,
			'user' : req.user
		})
	})
})


router.post('/approve', function(req, res){
	//create new order
	var _owner_id			= req.body.owner_id;
	var _customer_id 		= req.body.customer_id;
	var _menu_id 			= req.body.menu_id; 
	var _request_id 		= req.body.request_id;
	var _now				= moment();

	MenuSchema.findOne({_id: _menu_id},function(err, menu){

		var _order = OrderSchema({
			owner_id : _owner_id,
			customer_id : _customer_id,
			menu_id : _menu_id,
			request_id : _request_id,
			timestamp : _now,
			menu_host_time : menu["host_time"],
			menu_meal: menu["meal"],
			menu_title: menu["title"],
			menu_type: menu["type"],
			menu_quantity: menu["quantity"]
		});

		_order.save(function(err){
			if(err) throw err;
		});

		//create new notification
		var _noti = NotificationSchema({
			user_id : _customer_id,
			sender_id: _owner_id,
			type : 'approved',
			status : 'unread',
			timestamp : _now,
			content : 'your request has been approved!'
		});

		_noti.save(function(err){
			if(err) throw err;
		});

		//change request status to approved
		RequestSchema.findOne({_id: _request_id}, function(err,request){
			request['status'] = 'approved';
			request.save(function(err){
				if(err) throw err;
				res.redirect('/request/pending/' + _menu_id);
			});
		});
	});
});

router.post('/decline', function(req, res){
	//create new notification
	var _owner_id = req.body.owner_id;
	var _customer_id = req.body.customer_id;
	var _menu_id 			= req.body.menu_id; 
	var _request_id 		= req.body.request_id;
	var _now = moment();

	var _noti = NotificationSchema({
		user_id : _customer_id,
		sender_id: _owner_id,
		type : 'rejected',
		status : 'unread',
		timestamp : _now,
		content : 'your request has been rejected!'
	});

	_noti.save(function(err){
		if(err) throw err;
	});

	//change request status to approved
	RequestSchema.findOne({_id: _request_id}, function(err,request){
		request['status'] = 'rejected';
		request.save(function(err){
			if(err) throw err;
			res.redirect('/request/pending/' + _menu_id);
		});
	});
})

router.get('/history', function(req, res){
	RequestSchema.find({customer_id:req.user._id},function(err,requests){
		res.render("requests", {
			requests : requests,
			user : req.user
		})
	})
})

router.post('/history', function(req, res){
	var reqId = req.body.reqid;
	console.log(reqId);
	RequestSchema.remove({_id:reqId}, function(err){
		if(err){
			console.log(err);
		}
		res.redirect('/profile/requests');
	})
})

module.exports = router;