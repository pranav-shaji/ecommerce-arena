const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

// Passport Google OAuth 2.0 strategy configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you can save the profile information to your database
      // For simplicity, we'll just pass the profile to the done function
      //   console.log(profile);
      done(null, profile);
    }
  )
);

console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID); // For debugging
console.log("CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET); // For debugging


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
