const router = require("express").Router();
const passport = require("passport");

console.log(process.env.CLIENT_URL);

router.get(
  "/google",
  (req, res, next) => {
    console.log("asdsad");
    next();
  },
  passport.authenticate("google", ["profile", "email"])
);

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("hellooooo");
    next();
  },
  passport.authenticate("google", {
    successRedirect: "/auth/login/success",
    failureRedirect: "/auth/login/failed",
  })
);

router.get("/login/success", async (req, res) => {
  console.log(req.user.emails[0].value);

  console.log("google login successfull....");
  try {
    if (req.user) {
      res.status(200).json({
        error: false,
        message: "successfully loged in",
        user: req.user,
      });
    } else {
      res.sendStatus(403).json({ error: true, message: "not Authorized" });
    }
  } catch (error) {
    res.json({ message: "server error" });
  }
});

router.get("/login/failed", (req, res) => {
  console.log("google login failed....");
  try {
    res.status(401).json({ error: true, message: "log in failure" });
  } catch (error) {
    console.log(error);
    res.json({ message: "server error" });
  }
});

router.get("/logout", (req, res) => {
  console.log("jbkjbj");
  req.logout(() => {
    res.json("logout successful");
  });
});

module.exports = router;
