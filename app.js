// This is YelpCamp Web Server

// Load express, mongoose, body-parser
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    // Load Model Modules
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");


mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));     // specific current directory/public
seedDB();

// Passport Config
app.use(require("express-session")({
    secret: "Once again rusty wins",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware that sets currentUser on each route
// Called on every route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("campgrounds/index", 
            {
                campgrounds: campgrounds,
                currentUser: req.user
            });
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    //   find campground by ID
    Campground.findById(req.params.id, function(err, campground){
        if (err){console.log(err);}
        else{
            res.render("comments/new", {campground:campground});
        }
    })
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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
//===================
// AUTH routes
//===================
// show register form
app.get("/register", function(req, res){
    res.render("register");
})

// handle signup functionalitity
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
    res.render("login");
});

// handle login functionalitity
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){}
);

// logout route
app.get("/logout", function(req, res){
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