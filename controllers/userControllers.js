const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const otpGenerator = require("../utils/otp");
const nodemailer = require("nodemailer");
const validate = require("../middlewares/validate");
const UploadImageToFireBase = require("../utils/firebaseUpload");

const transporter = require("../utils/nodemailer");

module.exports = {
  signUp: async (req, res) => {
    
    let { username, email, password, admin, user, profile } = req.body;
    let { address, phone, district, housename, landmark, pincode } = profile;
    if (!username || !email || !password) {
      return res.status(405).send({ message: "please fill all the fields" });
    }

    try {
      let result = await User.findOne({ username, email });
      if (!result) {
        hashedpassword = await bcrypt.hash(password, 10);
        await User.create({
          username: username,
          email: email,
          password: hashedpassword,
          admin: admin,
          user: user,
          profile: {
            address: address,
            phone: phone,
            district: district,
            housename: housename,
            landmark: landmark,
            pincode: pincode,
          },
        });
        return res.status(200).send({ message: "user created" });
      } else {
        return res.status(403).send({ message: "user already exist" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
    }
  },

  logIn: async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "please fill all the fields" });
    }
    try {
      let result = await User.findOne({ email });
      if (!result) {
        return res.status(404).send({ message: "this email does not exist" });
      } else {
        let compare = await bcrypt.compare(password, result.password);

        if (compare) {
          let { username, email, profile, _id } = result;
          let obj = {
            _id,
            username,
            email,
            profile,
          };

          let token = jwt.sign(obj, "123", {
            expiresIn: 1000 * 60 * 60 * 24,
          });

          return res.status(200).send({
            message: "loggedin successful",
            token: token,
            userData: obj,
          });
        } else {
          res.status(404).send({ message: "password incorrect" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "server error" });
    }
  },

  sendOtp: async (req, res) => {
    console.log("fbwhjj");
    try {
      let otpgGenerated = otpGenerator();
      console.log(otpgGenerated);

      let result = await User.updateOne(
        { email: req.body.email },
        { $set: { otp: otpgGenerated } }
      );
      console.log(result);
      if (result.acknowledged && result.modifiedCount == 1) {
        const mailOption = {
          from: "pranavshaji2244@gmail.com",
          to: req.body.email,
          subject: "otp for verification",
          text: otpgGenerated,
        };
        transporter.sendMail(mailOption, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("email sent" + info.response);
            res.status(200).send({ message: "otp sent" });
          }
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      console.log("hguf");
      let result = await User.findOne({ email: req.body.email });
      console.log(result);
      if (!result) {
        return res.status(404).send({ message: "user not found" });
      } else {
        if (result.otp == req.body.otp) {
          res.status(200).send({ message: "otp verified" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
    }
  },
  editUser: async (req, res) => {
    try {
      let updateField = {};

     
      if (req.file) {
        const imageurl = await UploadImageToFireBase(req.file, req.body.name);
        updateField["profile.image"] = imageurl;
      }
      let {
        username,
        admin,
        user,
        address,
        phone,
        district,
        housename,
        landmark,
        pincode,
      } = req.body;

      if (username) updateField.username = username;
      if (admin) updateField.admin = admin;
      if (user) updateField.user = user;
      if (address) updateField["profile.address"] = address;
      if (phone) updateField["profile.phone"] = phone;
      if (district) updateField["profile.district"] = district;
      if (housename) updateField["profile.housename"] = housename;
      if (landmark) updateField["profile.landmark"] = landmark;
      if (pincode) updateField["profile.pincode"] = pincode;

      let result = await User.updateOne(
        {
          _id: req.params.id,
        },
        {
          $set: updateField,
        },
        { new: true }
      );
      res.status(200).json({ message: "user updated", data: result });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "server error" });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      console.log("jfweb");
      let result = await User.find();
      res
        .status(200)
        .json({ message: "list of users are as follows!", data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "server error" });
    }
  },
  getUserDetails:async(req,res)=>{
    try {
      const userId = req.params.id;
      console.log(userId);
      result = await User.findById(userId)
      if (result) {
        res.status(200).send({result:result})
        
      }else{
        res.status(404).send({message:"user not found"})
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).send({message:"server error"})
      
    }
  
  },
  

  welcome: (req, res) => {
    res.status(200).send({ message: "welcome to Laptop Arena" });
  },
};
