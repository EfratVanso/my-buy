var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user");

var imgUpload = require("./../uploadImagesConfig"),
  upload = imgUpload.upload,
  cloudinary = imgUpload.cloudinary;

//root rout
router.get("/", function (req, res) {
  res.render("landing");
});

//==================================
//  AUTH ROUTES
//==================================

//show register form
router.get("/register", function (req, res) {
  res.render("register");
});

//handle sign up logic
router.post("/register", upload.single("image"), function (req, res) {

  if (req.file) {//if there is an image
    //upload the img to my account at cloudinary and return img url + img id
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      req.body.imageProfile = result.secure_url;
      req.body.imageId = result.public_id;
      createNewUser(req, res);//continue saving user
    });
  } else {
    createNewUser(req, res);//continue saving user
  }
});
function createNewUser(req, res){
  var newUser = new User({ 
    username: req.body.username,
    email: req.body.email,
    avatar:  req.body.image,
    imageProfile: req.body.imageProfile,
    imageId: req.body.imageId 
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err.message);
      req.flash("error", err.message);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to My-Buy "+user.username);
      res.redirect("/items");
    });
  });
}

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});

//handle login logic
router.post(
  "/login",
  passport.authenticate("local", {
    // middleware that check automatically if the user and password are correct
    successRedirect: "/items",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

//handle logout
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success","Logged you out")
  res.redirect("/items");
});

module.exports = router;
