// This is YelpCamp Web Server

// Load express, mongoose, body-parser
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    seedDB = require("./seeds"),
    // Load Model Modules
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    //User = require("./models/user");


mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
seedDB();

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});

app.get("/", function(req, res){
   res.render("landing"); 
});

// INDEX route. show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if (err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// NEW route. render "new" page
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");    
});

// CREATE route. add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
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
app.get("/campgrounds/:id", function(req, res){
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

// ===========================
// COMMENTS routes
// ===========================
app.get("/campgrounds/:id/comments/new", function(req, res){
    //   find campground by ID
    Campground.findById(req.params.id, function(err, campground){
        if (err){console.log(err);}
        else{
            res.render("comments/new", {campground:campground});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
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
                  // connect new comment to campground
                  campground.comments.push(comment);
                  campground.save();
                  // redirect to campground showpage
                  res.redirect("/campgrounds/" + campground._id);
              }
           });
        }
    });
})