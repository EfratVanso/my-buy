var express = require("express"),
  router = express.Router(),
  Item = require("../models/item"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

// upload images code:=================================
var multer = require("multer");

//creating custom name for the uploaded file:
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
//check the extension of the file
var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

//cloudinary configuration (need to use ENV variables to keep them secure)
var cloudinary = require("cloudinary");
cloudinary.config({
  //personal config details from my account in cloudinary
  cloud_name: "efivanso",
  api_key: 322655568553446, //process.env.CLOUDINARY_API_KEY,
  api_secret: "RyZ1zi3qLmTm8CyKjY46ry5G_GQ", // process.env.CLOUDINARY_API_SECRET
});
//==================================
//  COMMENTS ROUTES
//==================================
//open new comment form
router.get("/items/:id/comments/new", middleware.isLoggedIn, function (
  req,
  res
) {
  //find the item with provided id
  Item.findById(req.params.id, function (err, foundItem) {
    if (err) {
      console.log(err);
    } else {
      //console.log(req.params.id);
      res.render("comments/new", { item: foundItem });
    }
  });
});

//handle adding new comment
router.post(
  "/items/:id/comments",
  middleware.isLoggedIn,
  upload.single("image"),
  function (req, res) {
    Item.findById(req.params.id, function (err, item) {
      if (err) {
        console.log(err);
        res.redirect("/items/");
      } else {
        if (req.file) {
          cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
          //cloudinary.uploader.upload(req.file.path, function (result) {
            req.body.comment.imageComment = result.secure_url;
            req.body.comment.imageId = result.public_id;
            
            createNewComment(req, res, item);
          });
        } else {
          createNewComment(req, res, item);
        }
      }
    });
  }
);
function createNewComment(req, res, item) {
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
// //handle adding new comment -    WORK ONLY WITH PIC
// router.post(  "/items/:id/comments",  middleware.isLoggedIn,  upload.single('image'),  function (req, res) {
//     Item.findById(req.params.id, function (err, item) {
//       if (err) { console.log(err);   res.redirect("/items/");
//       } else {
//         cloudinary.uploader.upload(req.file.path, function (result) {
//           req.body.comment.imageComment = result.secure_url;

//           Comment.create(req.body.comment, function (err, comment) {
//             if (err) {
//               req.flash("error", "Something went wrong");
//               console.log(err);
//             } else {
//               //add username and id to comment
//               comment.author.id = req.user._id;
//               comment.author.username = req.user.username;
//               //save the comment
//               comment.save();

//               item.comments.push(comment);
//               item.save();
//               console.log(comment);
//               req.flash("success", "Successfully added comment");
//               res.redirect("/items/" + item._id);
//             }
//           });
//         });
//       }
//     });
//   }
// );

// //handle adding new comment -NO PIC
// router.post("/items/:id/comments", middleware.isLoggedIn, function (req, res) {
//   Item.findById(req.params.id, function (err, item) {
//     if (err) {
//       console.log(err);
//       res.redirect("/items/");
//     } else {
//       Comment.create(req.body.comment, function (err, comment) {
//         if (err) {
//           req.flash("error", "Something went wrong");
//           console.log(err);
//         } else {
//           //add username and id to comment
//           comment.author.id = req.user._id;
//           comment.author.username = req.user.username;
//           //save the comment
//           comment.save();

//           item.comments.push(comment);
//           item.save();
//           console.log(comment);
//           req.flash("success", "Successfully added comment");
//           res.redirect("/items/" + item._id);
//         }
//       });
//     }
//   });
// });

//comments edit rout
router.get(
  "/items/:id/comments/:comment_id/edit",  middleware.checkCommentOwnership,upload.single('image'), function (req, res) {
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
  }
);

//comments edit rout
router.put(  "/items/:id/comments/:comment_id",  middleware.checkCommentOwnership,  function (req, res) {
  if(req.file){
    cloudinary.v2.uploader.destroy(req.body.comment.imageComment)
  }  

  Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      function (err, updatedComment) {
        if (err) {
          res.redirect("back");
        } else {
          res.redirect("/items/" + req.params.id);
        }
      }
    );
  }
);

//comments destroy rout
router.delete(
  "/items/:id/comments/:comment_id",
  middleware.checkCommentOwnership,
  function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Comment deleted");
        res.redirect("/items/" + req.params.id);
      }
    });
  }
);

module.exports = router;
