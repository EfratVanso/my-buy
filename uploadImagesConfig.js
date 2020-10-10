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

exports.upload = upload;
exports.cloudinary = cloudinary;

//how to use:
    // var imgUpload = require("./../uploadImagesConfig"),
    //     upload = imgUpload.upload;
    //     cloudinary = imgUpload.cloudinary;