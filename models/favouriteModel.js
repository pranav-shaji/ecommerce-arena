const mongoose = require("mongoose");

let pro = mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId },
  },
  { _id: false }
);

const favouriteSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: [pro],
  },
  { timestaps: true }
);

module.exports = mongoose.model("favourite", favouriteSchema);

// const mongoose = require("mongoose")

// favouriteSchema = mongoose.Schema({
//     productId :{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Products',

//     },
//     name:{
//         type:String,
//         required:true
//     }

// },{Timestamp:true})

// module.exports=mongoose.model("favourite",favouriteSchema)
