var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);//this adding some methods to the User
module.exports = mongoose.model("User", userSchema);