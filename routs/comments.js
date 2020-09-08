var express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require('../middleware');

//==================================
//  COMMENTS ROUTES
//==================================
//open new comment form
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function (req, res) {
  //find the campground with provided id
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.params.id);
      res.render("comments/new", { campground: foundCampground });
    }
  });
});

//handle adding new comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds/");
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

          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          req.flash("success", "Successfully added comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//comments edit rout
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        campground_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

//comments edit rout
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//comments destroy rout
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


module.exports = router;
