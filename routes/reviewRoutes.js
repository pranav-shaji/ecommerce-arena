const express = require("express");
const router = express.Router();
const path = require("path");
const { ObjectId } = require("mongoose");

const mongoose = require("mongoose");

const upload = require("../middlewares/multer");
const { write } = require("fs");

const{writeReview,deleteReview,deleteReviewFromArray,updateReview,getReviewOfProductById}=require('../controllers/reviewController');

router.post("/write-a-review", upload.single("image"),writeReview );

router.delete("/delete-review/:productId", deleteReview);

//delete a review in the reviewfield(array) by username
router.delete("/delete-review-from-array",deleteReviewFromArray );

router.patch("/update-review/:id/:it",updateReview);

router.get("/get-product-review/:productId",getReviewOfProductById );

module.exports = router;
