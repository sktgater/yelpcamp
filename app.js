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

// Import all routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

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

// Use all routes. Take routes and append prefix routes if defined
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});
