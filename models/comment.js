var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    imageComment: String,
    imageId: String //for edit and delete
});
 
module.exports = mongoose.model("Comment", commentSchema);
