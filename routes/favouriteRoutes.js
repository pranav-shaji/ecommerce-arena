const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const{getFavourite,addToFavourite}=require('../controllers/favouriteController')



router.get("/get-favourites/:userId",getFavourite );

router.post("/add-to-favourites", addToFavourite);

module.exports = router;
