var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  axios = require("axios").default,
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Item = require("./models/item"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");
  //Item.remove({}, function(err){});//restart items data
//requiring routs
var commentRouts = require("./routs/comments"),
    itemRouts = require("./routs/items"),
    authRouts = require("./routs/index");

// mongoose.connect("mongodb://localhost/my-buy", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect("mongodb+srv://efi:Efi681@cluster0.zc9hp.mongodb.net/Cluster0?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(()=>{
  console.log("connected to Mongo DB!");
}).catch(err =>{
    console.log("ERROR connect to Mongo DB")
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
app.use(itemRouts);
app.use(commentRouts);

//==================================
var port = process.env.PORT || 8080;

app.listen(port, process.env.IP, function(){
  console.log("MyBuy Server has started on port 8080!")
});
