// Campground route
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if (err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", 
            {
                campgrounds: campgrounds,
                currentUser: req.user
            });
        }
    });
});

// NEW route. render "new" page
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");    
});

// CREATE route. add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

// SHOW route. show more info about one campground
router.get("/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log(err);
        }
        else{
            // render to show template
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    // Find campground by ID
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update current campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
        if (err){
            res.redirect("/campgrounds");
        }
        // redirect to show page of this campground
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;