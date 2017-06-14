// Root route that will be used for every other route
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", function(req, res){
   res.render("landing"); 
});


//===================
// AUTH routes
//===================
// show register form
router.get("/register", function(req, res){
    res.render("register");
});

// handle signup functionalitity
router.post("/register", function(req, res){
    // has user object with username filled only
    var newUser = new User({username: req.body.username});
    // register() handles password logic
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// handle login functionalitity
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){}
);

// logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

// Middleware function to test if correct user logged in
function isLoggedIn(req, res, next){
    // if logged in, call next function
    if (req.isAuthenticated()){
        return next();
    }
    // not logged in, redirect login page
    res.redirect("/login");
}

module.exports = router;