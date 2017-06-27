// middleware files

// Link Campground and Comment models
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {
    
};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // Middleware check campground ownership
    if (req.isAuthenticated()){
        // Find campground by ID
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            // test if campground.author.id matches current user
            // foundCampground.author.id has type Object, not string
            // use .equals() to evaluate
            else{
                if (foundCampground.author.id.equals(req.user._id)){
                    next();     // proceed to next()
                }
                else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        // redirect back to previous page
        req.flash("error", "Please Login First");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // Middleware check campground ownership
    if (req.isAuthenticated()){
        // Find comment by ID
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                res.redirect("back");
            }
            // test if comment.author.id matches current user
            // foundComment.author.id has type Object, not string
            // use .equals() to evaluate
            else{
                if (foundComment.author.id.equals(req.user._id)){
                    next();     // proceed to next()
                }
                else{
                    req.flash("error", "You Don't Have Permission To Do That");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        // redirect back to previous page
        req.flash("error", "Please Login First");
        res.redirect("back");
    }
};

// Middleware isLogged in
middlewareObj.isLoggedIn =  function(req, res, next){
    // if logged in, call next function
    if (req.isAuthenticated()){
        return next();
    }
    // not logged in, redirect login page, show flash page
    req.flash("error", "Please Login First");
    res.redirect("/login");
};

module.exports = middlewareObj;