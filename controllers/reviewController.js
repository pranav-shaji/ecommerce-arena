const mongoose = require('mongoose');
const Review = require("../models/reviewModel");
const UploadImageToFireBase = require("../utils/firebaseUpload");

module.exports={
    writeReview:async (req, res) => {
        let { productId, username, userId, reviewText, rating } = req.body;
        const image = req.file ? req.file.path : null;
        const imageurl = await UploadImageToFireBase(
          req.file,
          req.body.name,
          "review"
        );
        console.log(req.file);
      
        try {
          const existingReview = await Review.findOne({ productId });
      
          console.log(existingReview);
      
          if (existingReview) {
            // let usId = new mongoose.Types.ObjectId(userId);
      
            const reviewExistsForUser = existingReview.reviews.some((obj) => {
              return obj.userId.toString() === userId;
            });
            console.log(reviewExistsForUser);
      
            if (reviewExistsForUser) {
              return res
                .status(406)
                .send({ message: "User has already reviewed this product" });
            }
      
            const updatedata = await Review.updateOne(
              { productId: existingReview.productId },
              {
                $push: {
                  reviews: {
                    username,
                    userId,
                    rating,
                    reviewText,
                    image: imageurl,
                  },
                },
              }
            );
            res.status(200).json({ message: updatedata });
          } else {
            await Review.create({
              productId,
              reviews: [
                {
                  username,
                  userId,
                  rating,
                  reviewText,
                  image: imageurl,
                },
              ],
            });
            res.status(200).send({ message: "review created successfully" });
          }
        } catch (error) {
          console.log(error);
          res.status(500).sent({ message: "server error" });
        }
      },
      deleteReview:async (req, res) => {
        try {
          let deleteid = await Review.findByIdAndDelete(req.params.productId);
          if (deleteid) {
            console.log(deleteid);
            res.status(200).send({ message: "review deleted sucessfully" });
          } else {
            res.status(404).send({ message: "review not found" });
          }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "server error" });
        }
      },

      deleteReviewFromArray:async (req, res) => {
        try {
          console.log("bhfewhj");
          const { productId, userId } = req.query;
          if (!productId || !userId) {
            return res
              .status(400)
              .json({ message: "both productId and userId are required" });
          }
          //update operation
          const result = await Review.updateOne(
            { productId: productId },
            { $pull: { reviews: { userId: userId } } }
          );
      
          if (result.nModified === 0) {
            return res.status(404).json({ message: "Review not found" });
          }
          res.json({ message: "review deleted sucessfully" });
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "server error" });
        }
      },
      updateReview: async (req, res) => {
        console.log("gfdfcf");
        try {
          let updateid = await Review.updateOne(
            { "reviews.userId": req.params.id, productId: req.params.it },
            {
              "reviews.$.reviewText": req.body.reviewText,
              "reviews.$.rating": req.body.rating,
            }
          );
          console.log(updateid);
      
          if (updateid) {
            res.status(200).send({ message: "review updated sucessfully" });
          } else {
            res.status(404).send({ message: "review not found" });
          }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "server error" });
        }
      },
      getReviewOfProductById:async (req, res) => {
        let { productId } = req.params;
        productId = new mongoose.Types.ObjectId(req.params.productId);
        try {
          const data = await Review.aggregate([
            { $match: { productId: productId } },
            // { $match: { "review.$.userId": req.params.userId } },
          ]);
          console.log(data);
          res.status(200).send({ message: "result are......", data: data });
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "server error" });
        }
      }
}