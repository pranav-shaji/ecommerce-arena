const mongoose = require("mongoose");
//let
productSchema = mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
   
    },
    image:{
      type:String,
      default:null
    },
    category: {
      type: String,
      required: true,
    },
    year_of_make: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    specifications: {
      screen_size: {
        type: String,
        required: true,
      },
      resolution: {
        type: String,
        required: true,
      },
      processor: {
        type: String,
        required: true,
      },
      RAM: {
        type: String,
        required: true,
      },
      storage: {
        type: String,
        required: true,
      },
      graphics: {
        type: String,
        required: true,
      },
      battery: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products",productSchema)
