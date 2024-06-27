const mongoose = require("mongoose");

cartSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "users",
    },

    product: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart",cartSchema)