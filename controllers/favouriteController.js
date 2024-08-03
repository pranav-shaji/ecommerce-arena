const mongoose = require("mongoose");
const favourite = require("../models/favouriteModel");

module.exports = {
  getFavourite: async (req, res) => {
    console.log(req.params.userId);
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    try {
      let result = await favourite.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.productId",
            foreignField: "_id",
            as: "favouriteProducts",
          },
        },
        {
          $project: { favList: "$favouriteProducts" }, // Deconstruct the array field
        },
      ]);
      console.log(result[0], "jfhrufh");
      res
        .status(200)
        .send({
          message: "displaying favourite products",
          data: result[0].favList,
        });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "An error occurred while fetching favourite products",
        error: error.message,
      });
    }
  },
  addToFavourite: async (req, res) => {
    console.log("hfwfbh");
    try {
      let { userId, productId } = req.body;

      console.log(userId, productId);
      let favExist = await favourite.findOne({ userId });
      if (!favExist) {
        await favourite.create({
          userId,
          products: [
            {
              productId,
            },
          ],
        });
        res.status(200).send({ message: "favourite created" });
      }
      else {
        // Check if the product already exists in the user's favourites
        const productExists = favExist.products.some(
          (product) => product.productId.toString() === productId.toString()
        );
      
        if (productExists) {
          res.status(200).send({ message: "Product already in favourites" });
        } else {
          await favourite.updateOne(
            { userId },
            { $addToSet: { products: { productId } } }
          );
          res.status(200).send({ message: "Product added to favourites" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};``