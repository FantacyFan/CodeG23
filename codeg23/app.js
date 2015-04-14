var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var routes = require('./controllers/index');
var users = require('./controllers/users');
var passport = require('passport');
var session      = require('express-session');
var conversationSocket = require('./controllers/conversation-socket');
//var multer  = require('multer');

var busboy = require('connect-busboy');



var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//Connect database
mongoose.connect('localhost:27017/codeg23');

require('./middlewares/passport')(passport); // pass passport for configuration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy()); 

//Socket Io Controller for messages
conversationSocket(io);
http.listen(3000, function(){
  console.log('listening on *:3000');
});

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'amxogy9e7rygxm2978yg!@yg20789fd&89)daytx,g870927?v9p9(vh)fwmpvw97ihfdmpv'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var routes = require('./controllers/index')(passport);
app.use('/', routes);



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


module.exports = app;
