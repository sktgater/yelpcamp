// COMMENTS routes
var express = require("express");
var router = express.Router({mergeParams: true});   // merge parameters
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    //   find campground by ID
    Campground.findById(req.params.id, function(err, campground){
        if (err){console.log(err);}
        else{
            res.render("comments/new", {campground:campground});
        }
    });
});

// Comments CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
       if (err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       else{
           // create new comment
           Comment.create(req.body.comment, function(err, comment){
                if (err){
                    req.flash("error", "Something went wrong with the data");
                    console.log(err);
                }
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
                    req.flash("success", "Adding Comment Successful");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comment EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
            res.redirect('back');
        }
        // Pass in campground Id and located comment
        else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// Comment UPDATE route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated){
       if (err){
           res.redirect("back");
       }
       else{
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

// Comment DELETE route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // find by Id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment Successfully Deleted");
            res.redirect("/campgrounds/" + req.params.id);     
        }
    });
});

module.exports = router;