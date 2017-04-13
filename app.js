var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
    {name: "Salon Creek", image:"https://static1.squarespace.com/static/54dcbae8e4b0c102e31daee7/t/55a02222e4b08940d3af555a/1439848167831/8+Salmon+Creek+Greenway%2C+Vancouver%2C+WA+%40+Mike+Houck.jpg?format=1500w"}, 
    {name: "Lake Powell Wahweap", image:"https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"},
    {name: "Grand Laua", image:"https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg"}
];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});

app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {locations:campgrounds});
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");    
});

app.post("/campgrounds", function(req, res){
    var photoName = req.body.name;
    var img = req.body.image;
    campgrounds.push({name: photoName, image: img});
    res.redirect("campgrounds");
}
);