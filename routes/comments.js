// COMMENTS routes
var express = require("express");
var router = express.Router({mergeParams: true});   // merge parameters
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments New
router.get("/new", isLoggedIn, function(req, res){
    //   find campground by ID
    Campground.findById(req.params.id, function(err, campground){
        if (err){console.log(err);}
        else{
            res.render("comments/new", {campground:campground});
        }
    });
});

// Comments Create
router.post("/", isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
       if (err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       else{
           // create new comment
           Comment.create(req.body.comment, function(err, comment){
                if (err){console.log(err)}
                else{
                    // add username and id to comment
                    comment.author.id = req.params._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground showpage
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    // if logged in, call next function
    if (req.isAuthenticated()){
        return next();
    }
    // not logged in, redirect login page
    res.redirect("/login");
}

module.exports = router;