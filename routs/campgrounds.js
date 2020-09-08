var express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  middleware = require('../middleware');

//==================================
//  CAMPGROUNDS ROUTES
//==================================
//INDEX - show all campground
router.get("/campgrounds", function (req, res) {
  //get all campground from db
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});
//NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//CREATE - add new data to db
router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
  //get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author,
    price:price
  };
  //create new campground and save to db
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //console.log(newlyCreated);
      //redirect back to campground page
      res.redirect("/campgrounds"); // the default is to GET rout
    }
  });
});

//SHOw - show more info about campground
router.get("/campgrounds/:id", function (req, res) {
  //find the campground with provided id
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(req.params.id);
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});
//EDIT campground rout
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.render("campgrounds/edit", { campground: foundCampground });
    }
  });
});
//UPDATE campground rout
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res) {
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});
//DESTROY campground rout
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        res.redirect("/campgrounds");
    });
});



module.exports = router;
