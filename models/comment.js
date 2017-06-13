// Module file for Comment

var mongoose = require("mongoose");

// Create Schema
var commentSchema = mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("Comment", commentSchema);