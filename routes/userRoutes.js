const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/userModel");

const {
  signUp,
  logIn,
  sendOtp,
  verifyOtp,
  welcome,
  editUser,
  getAllUsers,
} = require("../controllers/userControllers");

const upload = require("../middlewares/multer");

router.get("/welcome", welcome);

router.post("/signup", signUp);

router.post("/login", logIn);

router.post("/send-otp", sendOtp);

router.get("/verify-otp", verifyOtp);

router.put("/edit-profile/:id", upload.single("image"), editUser);

router.get("/get-all-users", getAllUsers);

module.exports = router;
