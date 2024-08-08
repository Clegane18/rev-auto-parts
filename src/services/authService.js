require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Customer = require("../database/models/customerModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();
        const existingUser = await Customer.findOne({ where: { email } });

        if (existingUser) {
          // Link Google ID to existing user
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        // Create new user if no conflict
        const newUser = await Customer.create({
          username: profile.displayName,
          email,
          googleId: profile.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const customer = await Customer.findByPk(id);
    done(null, customer);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
