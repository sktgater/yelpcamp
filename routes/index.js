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
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    // If error, show error message
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
    req.flash("success", "Logged Out");
    res.redirect("/campgrounds");
});

module.exports = router;