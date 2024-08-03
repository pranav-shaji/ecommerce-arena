const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp:{
      type:String,
      required:null,

    },
    admin: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Boolean,
      default: true,
    },
    profile: {
      address: {
        type: String,
        default:null
      },
      phone: {
        type: String,
        default:null
      },
      district: {
        type: String,
        default:null

      },
      housename: {
        type: String,
        default:null
      },
      landmark: {
        type: String,
        default:null
      },
      pincode: {
        type: String,
        default:null
      },
      image:{
        type:String,
        default:null
      }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
