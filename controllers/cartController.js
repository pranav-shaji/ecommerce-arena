const cart = require("../models/cartModel");
const mongoose = require("mongoose");

module.exports = {
  getCart: async (req, res) => {
    try {
      const userId = req.params.userId;
      result = await cart.aggregate([
        {
          $match: { userId: userId },
        },

        {
          $lookup: {
            from: "products",
            localField: "product.product_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $project: { cartList: "$productDetails" } },
      ]);

      if (result.length == 0) {
        res.status(200).json({ message: "No cart found" });
      } else {
        res
          .status(200)
          .send({ message: "cart are as follows", data: result[0].cartList });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
    }
  },

  addToCart: async (req, res) => {
    try {
      let { userId, productId, quantity } = req.body;
      let cartExist = await cart.findOne({ userId });
      if (!cartExist) {
        await cart.create({
          userId,
          product: [{ product_id: productId, quantity }],
        });
        res.status(200).send({ message: "cart created" });
      } else {
        // let productExist = cartExist.product.some((obj) => {
        //   return obj.product_id.toString() == productId;
        // });
        let productExist = await cart.findOne({
          userId: userId,
          product: { $elemMatch: { product_id: productId } },
        });

        if (productExist) {
          let result = await cart.updateOne(
            { userId: userId, "product.product_id": productId },
            {
              $inc: { "product.$.quantity": quantity },
            }
          );
        
          res.status(200).send({ message: "product incremented" });
        } else {
          await cart.updateOne(
            { userId: userId },
            {
              $addToSet: { product: { product_id: productId, quantity: 1 } },
            }
          );
          res.status(200).send({ message: "product added to cart" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
    }
  },


};
