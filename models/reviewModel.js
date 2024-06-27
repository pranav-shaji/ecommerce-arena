const mongoose = require("mongoose");

let reviewSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  reviews: [
    {
      username:{
        type:String,
        required:true

      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      reviewText: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required:null,
      },
    },{timestamps:true}
  ],
});

module.exports = mongoose.model("review", reviewSchema);
