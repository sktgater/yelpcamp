// Campground route
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

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
router.get("/new", function(req, res){
    res.render("campgrounds/new");    
});

// CREATE route. add new campground to DB
router.post("/", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
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

module.exports = router;