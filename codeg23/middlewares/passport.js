// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../controllers//config');

// load up the user model
var User            = require('../models/user');
var Foodgallery = require('../models/foodgallery');

var bCrypt = require('bcrypt-nodejs');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use(new FacebookStrategy({
        clientID: config.facebook_api_key,
        clientSecret:config.facebook_api_secret ,
        callbackURL: config.callback_url 
    }, function(accessToken, refreshToken, profile, done){
        console.log("Req: ");
        User.findOne({'facebook_id':profile.id}, function(err, user){
            if(user==null){
               var newUser = new User();
                console.log("Facebook user not exist");
                // set the user's local credentials
                newUser.firstname = profile._json.first_name;
                newUser.lastname = profile._json.last_name;
                newUser.gender = profile.gender;
                newUser.facebook_id = profile.id;
                // save the user
                newUser.save(function(err) {
                    if (err){
                        console.log('Error in Saving user: '+err);  
                        throw err;  
                    }
                    console.log('User Registration succesful');   
                    var newFoodgallery = new Foodgallery();
                    newFoodgallery.user_id = newUser._id;
                    newFoodgallery.save(function(err) {
                        if (err){
                            console.log('Error in Saving fdgallery: '+err);  
                            throw err;  
                        }
                        console.log('User Registration succesful');    
                        return done(null, newUser);
                    }); 
                });
            } else {
                done(null, user)
            }
        })
    }))

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
            // check in mongo if a user with username exists or not
            User.findOne({ 'email' :  email }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with Email '+email);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );

        })
    );


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }


    passport.use('register', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'email' :  email }, function(err, user) {
                    // In case of any error, return using the done method
                    console.log("Start to check email");
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with email: '+email);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        console.log("User not exist");
                        // set the user's local credentials
                        newUser.email = email;
                        newUser.password = createHash(password);
                        newUser.firstname = req.param('firstname');
                        newUser.lastname = req.param('lastname');
                        newUser.portrait_path = '/image/sample-portrait.jpg';
                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            //create default gallery
                            var newFoodgallery = new Foodgallery();
                            newFoodgallery.user_id = newUser._id;
                            newFoodgallery.save(function(err) {
                                if (err){
                                    console.log('Error in Saving fdgallery: '+err);  
                                    throw err;  
                                }
                                console.log('User Registration succesful');    
                                return done(null, newUser);
                            });
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            console.log("enter process");
            process.nextTick(findOrCreateUser);
            console.log("Finish process");
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

};