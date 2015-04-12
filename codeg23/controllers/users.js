var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/detail/:id', function(req, res) {
  res.render('users',{
  	user:req.user
  });
 });

module.exports = router;
