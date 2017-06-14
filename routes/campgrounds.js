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
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");    
});

// CREATE route. add new campground to DB
router.post("/", isLoggedIn, function(req, res){
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
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    // Find campground by ID
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE route
router.put("/:id", checkCampgroundOwnership, function(req, res){
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
router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
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

// Middleware check campground ownership
function checkCampgroundOwnership(req, res, next){
    if (req.isAuthenticated()){
        // Find campground by ID
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err){
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
                    res.redirect("back");
                }
            }
        });
    }
    else{
        // redirect back to previous page
        res.redirect("back");
    }
}

module.exports = router;