const multer = require("multer");
const path = require("path");

//multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (req.body.reviewText) {
//       cb(null, "images/review-images");
//     } else {
//       cb(null, "images/product-images");
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });




const upload = multer();

module.exports = upload;
