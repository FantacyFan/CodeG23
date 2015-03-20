var express = require('express');
var router = express.Router();
var MenuSchema = require('../models/menu')
/* Get profile page */
router.get('/', function(req, res) {
	res.render('Login',{

	})
});

/* Get profile page */
router.get('/:id', function(req, res) {
	//get  menus
	MenuSchema.find({_id: req.params.id}, function(err,menu){
		if(err) throw err;
		console.log(menu);
		res.render('menu',{
			'menu': menu
		});
	});
});


module.exports = router;