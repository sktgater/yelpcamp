// Seeds file. Want to run this file before app.js

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
      name: "Hoosier National Forest",
      image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5253636.jpg",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  },
  {
      name: "Shenandoah National Park",
      image: "https://www.nps.gov/shen/planyourvisit/images/Campgrounds_1.jpg",
      description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32."
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