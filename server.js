require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const passport = require("passport");
const session = require("express-session");

const passportSetup = require("./utils/passport");

const dbconnection = require("./configs/databaseConfig");
dbconnection();

// Configure session middleware
app.use(
  session({
    secret: "123456787654321",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const firebaseRoutes = require("./utils/firebaseUpload");
const googleRoutes = require("./routes/googleRoutes");
const phonePayRoutes = require("./routes/phonePayRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");

//collectionnames
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/review", reviewRoutes);
app.use("/cart", cartRoutes);
app.use("/image", firebaseRoutes);
app.use("/auth", googleRoutes);
app.use("/payment", phonePayRoutes);
app.use("/favourite", favouriteRoutes);

app.get("/*", (req, res) => {
  res.status(404).json({ message: "Page note found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
