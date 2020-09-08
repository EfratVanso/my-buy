var express = require("express"),
  router = express.Router(),
  Item = require("../models/item"),
  Comment = require("../models/comment"),
  middleware = require('../middleware');

//==================================
//  COMMENTS ROUTES
//==================================
//open new comment form
router.get("/items/:id/comments/new", middleware.isLoggedIn, function (req, res) {
  //find the item with provided id
  Item.findById(req.params.id, function (err, foundItem) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.params.id);
      res.render("comments/new", { item: foundItem });
    }
  });
});

//handle adding new comment
router.post("/items/:id/comments", middleware.isLoggedIn, function (req, res) {
  Item.findById(req.params.id, function (err, item) {
    if (err) {
      console.log(err);
      res.redirect("/items/");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save the comment
          comment.save();

          item.comments.push(comment);
          item.save();
          console.log(comment);
          req.flash("success", "Successfully added comment");
          res.redirect("/items/" + item._id);
        }
      });
    }
  });
});

//comments edit rout
router.get("/items/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        item_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

//comments edit rout
router.put("/items/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/items/" + req.params.id);
    }
  });
});

//comments destroy rout
router.delete("/items/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/items/" + req.params.id);
    }
  });
});


module.exports = router;
