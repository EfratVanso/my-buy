var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    imageProfile: String,
    imageId: String,
    likedItems: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Item"
        }
     ]
});

userSchema.plugin(passportLocalMongoose);//this adding some methods to the User
module.exports = mongoose.model("User", userSchema);