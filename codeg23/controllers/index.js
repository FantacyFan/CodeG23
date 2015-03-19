var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Format for router */
/* router.use('/your_controller',require('./your_controller_filename')) */

/* Home Page */
router.use('/home', require('./home'));

/* Profile controller */
router.use('/profile', require('./profile'));

/* Order controller */
router.use('/order', require('./order'));

/* Menus controller */
router.use('/menus', require('./menus'));

/* Menu controller */
router.use('/menu', require('./menu'));

/* Login controller */
router.use('/login', require('./login'));

/* Register controller */
router.use('/register', require('./register'));

/* Signout controller */
router.use('/signout', require('./signout'));

module.exports = router;
