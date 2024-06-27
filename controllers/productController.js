const mongoose = require("mongoose");
const product = require("../models/productModel");
const UploadImageToFireBase = require("../utils/firebaseUpload");
module.exports = {
  getAllProducts: async (req, res) => {
    try {
      let result = await product.find();

      res.status(200).send({ message: "all products", data: result });
    } catch (error) {
      res.status(500).send({ message: "server error" });
    }
  },
  insertData: async (req, res) => {
    console.log(req.body);

    if (!req.file) {
      return res.status(406).send({ message: "No image uploaded" });
    }

    let {
      brand,
      name,
      category,
      year_of_make,
      price,
      stock,
      screen_size,
      resolution,
      processor,
      RAM,
      storage,
      graphics,
      battery,
    } = req.body;

    try {
      result = await product.findOne({ brand, name });
      if (result) {
        res.status(409).json({ message: "product already exist" });
      } else {
        const imageurl = await UploadImageToFireBase(req.file, req.body.name);
        const productData = {
          brand,
          name,
          image: imageurl,
          category,
          year_of_make,
          price,
          stock,
          specifications: {
            screen_size,
            resolution,
            processor,
            RAM,
            storage,
            graphics,
            battery,
          },
        };
        console.log(imageurl);
        // if(imageurl){
        //   throw '';
        // }

        await product.create(productData);
        res.status(200).json({ message: "product added successfully" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  },
  deleteSingleProductById: async (req, res) => {
    try {
      result = await product.findByIdAndDelete(req.params.id);
      if (result) {
        await product.findByIdAndDelete(req.params.id);

        console.log(result);
        res.json({ message: "data deleted successfully" });
      } else {
        res.status(404).send({ message: "data not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
    }
  },
  updateAnyFieldOfProduct: async (req, res) => {
    try {
      const updateFields = {};

      // Handle image update if there's a file
      if (req.file) {
        const imageurl = await UploadImageToFireBase(req.file, req.body.name);
        updateFields.image = imageurl;
      }

      // Update specific fields based on request body
      if (req.body.brand) updateFields.brand = req.body.brand;
      if (req.body.name) updateFields.name = req.body.name;
      if (req.body.category) updateFields.category = req.body.category;
      if (req.body.year_of_make)
        updateFields.year_of_make = req.body.year_of_make;
      if (req.body.price) updateFields.price = req.body.price;
      if (req.body.stock) updateFields.stock = req.body.stock;
      if (req.body.screen_size)
        updateFields["specifications.screen_size"] = req.body.screen_size;
      if (req.body.resolution)
        updateFields["specifications.resolution"] = req.body.resolution;
      if (req.body.processor)
        updateFields["specifications.processor"] = req.body.processor;
      if (req.body.RAM) updateFields["specifications.RAM"] = req.body.RAM;
      if (req.body.storage)
        updateFields["specifications.storage"] = req.body.storage;
      if (req.body.graphics)
        updateFields["specifications.graphics"] = req.body.graphics;
      if (req.body.battery)
        updateFields["specifications.battery"] = req.body.battery;

      // Update the document with only the specified fields
      const result = await product.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true } // Return the updated document
      );

      if (result) {
        res.status(200).send({ message: "updated", data: result });
      } else {
        res.status(404).send({ message: "product does not exist" });
      }
    } catch (error) {
      res.status(500).send({ message: "server error", error });
    }
  },
  findProductPriceGreaterThan: async (req, res) => {
   
    let lowPrice = parseInt(req.query.low_price);
    let highPrice = parseInt(req.query.high_price);

    try {
      let result = await product.find({
        price: { $gt: lowPrice, $lt: highPrice },
      });

      return res
        .status(200)
        .send({ message: "results are......", data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error" });
    }
  },
  getProductByCategory: async (req, res) => {
    try {
      let result = await product.aggregate([
        { $match: { category: req.params.category } },
      ]);
   
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "server error" });
    }
  },
  stockOfSpecificBrands: async (req, res) => {
    try {
      let result = await product.aggregate([
        { $match: { brand: req.params.brand } },
        { $group: { _id: "$name", totalStock: { $sum: "$stock" } } },
      ]);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error" });
    }
  },
  sortByAnything: async (req, res) => {
    try {
      let result = await product.aggregate([
        { $match: { [`specifications.${req.query.spec}`]: req.query.value } },
        {
          $project: {
            brand: 1,
            name: 1,
            category: 1,
            specifications: 1,
            price: 1,
            stock: 1,
          },
        },
        //result.length for counting documents
        // {$group: { _id: "$brand", totalStock: { $sum: '$stock' } } },
      ]);
      res.status(200).send({ count: result.length, data: result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
    }
  },
};
