// Module file for Comment

var mongoose = require("mongoose");

// Create Schema
var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"     // refers to the model User
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);