var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  axios = require("axios").default,
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");
  //Campground.remove({}, function(err){});//restart campgrounds data
//requiring routs
var commentRouts = require("./routs/comments"),
    campgroundRouts = require("./routs/campgrounds"),
    authRouts = require("./routs/index");


// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('__dirname + "/public"')); //__dirname = current path
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();// seed the database

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "It can be anything. it helps to encode the password",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//send the current user information to every rout/template
app.use(function(req, res, next){
  res.locals.currentUser = req.user;//it will be empty if no one has signed in
  res.locals.error = req.flash("error");//it will pass error message to every template 
  res.locals.success = req.flash("success");//it will success pass message to every template 
  next();
});

app.use(authRouts);
app.use(campgroundRouts);
app.use(commentRouts);

//==================================

app.listen(3000, () => {
  console.log("yelp camp running on port 3000");
});
