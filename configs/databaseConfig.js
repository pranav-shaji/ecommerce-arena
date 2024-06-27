const express = require("express");
const mongoose = require("mongoose");

dbconnect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to database");
  } catch (error) {
    console.log("database not connected", error);
  }
};

module.exports = dbconnect;
