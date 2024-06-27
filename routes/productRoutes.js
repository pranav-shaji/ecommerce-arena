const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const product = require("../models/productModel");

const path = require("path");
const upload = require("../middlewares/multer");
const {
  getAllProducts,
  insertData,
  deleteSingleProductById,
  updateAnyFieldOfProduct,
  findProductPriceGreaterThan,
  getProductByCategory,
  stockOfSpecificBrands,
  sortByAnything,
} = require("../controllers/productController");

router.get("/get-all-products", getAllProducts);

router.post("/insertdata", upload.single("image"), insertData);

router.delete("/delete-single-data/:id", deleteSingleProductById);

router.patch(
  "/updatedata/:id",
  upload.single("image"),
  updateAnyFieldOfProduct
);

router.get("/get-product-by-price", findProductPriceGreaterThan); //error*****************

router.get("/get-products-by-category/:category", getProductByCategory);

router.get("/get-stock-of-specific-brands/:brand", stockOfSpecificBrands);

router.get("/sort-by-anything/", sortByAnything);

//insert single data
// router.post("/insertdata", async (req, res) => {
//   let { brand, name } = req.body;
//   try {
//     result = await product.findOne({ brand, name });
//     if (result) {
//       res.json({ message: "product already exist" });
//     } else {
//       await product.create(req.body);
//       res.status(200).send({ message: "product added successfully" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "server error" })
//   }
// });

//delete whole fields

// router.patch("/updatedata/:id", upload.single("image"), async (req, res) => {
//   try {
//     const updateFields = { ...req.body };

//     // If there is an image file, process and upload it
//     if (req.file) {
//       const imageurl = await UploadImageToFireBase(req.file, req.body.name);
//       updateFields.image = imageurl;
//     }

//     // Update the document with only the specified fields
//     const result = await product.findByIdAndUpdate(
//       req.params.id,
//       { $set: updateFields },
//       { new: true } // Return the updated document
//     );

//     if (result) {
//       res.json({ message: "updated", data: result });
//     } else {
//       res.json({ message: "product does not exist" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "server error", error });
//   }
// });

//match product by price greater than

//match product by category
// router.get("/get-products-by-category/", async (req, res) => {
//   try {
//     let category = await product.aggregate([
//        { $match: { "specifications.screen_size": `${req.query.sz} inches` } },
//       {
//         $group: {
//           _id: `$${req.query.filter}`,
//           // total: { $sum: "$stock" },
//           totalNumber: { $sum: 1 },
//         },
//       },
//       // {$project:{brand:1,name:1}}
//     ]);
//     res.json(category);
//   } catch (error) {
//     console.log(error);
//     res.json({ message: "server error" });
//   }
// });

//total stock of specific brands

//add products to favourites

module.exports = router;
