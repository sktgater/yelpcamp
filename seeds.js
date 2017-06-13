// Seeds file. Want to run this file before app.js

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
      name: "Hoosier National Forest",
      image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5253636.jpg",
      description: ""
  },
  {
      name: "Shenandoah National Park",
      image: "https://www.nps.gov/shen/planyourvisit/images/Campgrounds_1.jpg",
      description: ""
  }
];
function seedDB(){
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if (err){
            console.log(err);
        }
        else{
            // add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if (err){console.log(err)}
                    else{
                        console.log("add a campground");
                        // create a comment
                        Comment.create(
                            {
                                text: "This place is great, but will be great if having internet :)",
                                author: "Homer"
                            }, function(err, comment){
                                if (err){console.log(err)}
                                campground.comments.push(comment);
                                campground.save();
                            }
                        );
                    }
                }) 
            });
        }
    });
    
}

module.exports = seedDB;