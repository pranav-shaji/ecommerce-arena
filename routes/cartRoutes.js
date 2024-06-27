const express = require("express");
const router = express.Router();
const path = require("path");
const mongoose = require("mongoose");
const cart = require("../models/cartModel");
const { getCart, addToCart } = require("../controllers/cartController");

//get the user cart(user can be choosen in params)
router.get("/get-cart/:userId", getCart);

//add the product to cart collection(mention userId,productId,quantity) in postman or frontend
router.put("/add-to-cart", addToCart);

module.exports = router;
