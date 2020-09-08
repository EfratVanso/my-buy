var express = require("express"),
  router = express.Router(),
  Item = require("../models/item"),
  middleware = require('../middleware');

//==================================
//  CAMPGROUNDS ROUTES
//==================================
//INDEX - show all item
router.get("/items", function (req, res) {
  //get all item from db
  Item.find({}, function (err, allItems) {
    if (err) {
      console.log(err);
    } else {
      res.render("items/index", { items: allItems });
    }
  });
});
//NEW - show form to create new item
router.get("/items/new", middleware.isLoggedIn, function (req, res) {
  res.render("items/new");
});

//CREATE - add new data to db
router.post("/items", middleware.isLoggedIn, function (req, res) {
  //get data from form and add to items array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newItem = {
    name: name,
    image: image,
    description: desc,
    author: author,
    price:price
  };
  //create new item and save to db
  Item.create(newItem, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //console.log(newlyCreated);
      //redirect back to item page
      res.redirect("/items"); // the default is to GET rout
    }
  });
});

//SHOw - show more info about item
router.get("/items/:id", function (req, res) {
  //find the item with provided id
  Item.findById(req.params.id)
    .populate("comments")
    .exec(function (err, foundItem) {
      if (err) {
        console.log(err);
      } else {
        console.log(req.params.id);
        res.render("items/show", { item: foundItem });
      }
    });
});
//EDIT item rout
router.get("/items/:id/edit", middleware.checkItemOwnership, function (req, res) {
  Item.findById(req.params.id, function (err, foundItem) {
    if (err) {
      res.redirect("/items");
    } else {
      res.render("items/edit", { item: foundItem });
    }
  });
});
//UPDATE item rout
router.put("/items/:id", middleware.checkItemOwnership, function (req, res) {
  //find and update the correct item
  Item.findByIdAndUpdate(req.params.id, req.body.item, function (
    err,
    updatedItem
  ) {
    if (err) {
      res.redirect("/items");
    } else {
      res.redirect("/items/" + req.params.id);
    }
  });
});
//DESTROY item rout
router.delete("/items/:id", middleware.checkItemOwnership, function(req,res){
    Item.findByIdAndRemove(req.params.id,function(err){
        res.redirect("/items");
    });
});



module.exports = router;
