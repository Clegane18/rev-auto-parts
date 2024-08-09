const passport = require("../services/authService");
const Customer = require("../database/models/customerModel");
const { createTokenWithExpiration } = require("../utils/tokenUtils");

exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleCallback = (req, res) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    async (err, user, info) => {
      if (err) {
        console.error("Error during Google authentication:", err);
        return res.redirect("/login");
      }
      if (!user) {
        return res.redirect("/login");
      }

      try {
        const existingCustomer = await Customer.findOne({
          where: { email: user.email },
        });
        if (existingCustomer) {
          existingCustomer.username = user.username;
          existingCustomer.googleId = user.googleId;
          await existingCustomer.save();
        } else {
          await Customer.create({
            username: user.username,
            email: user.email,
            googleId: user.googleId,
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            console.error("Error during user login:", err);
            return res.redirect("/login");
          }

          const token = createTokenWithExpiration(
            { id: user.id, username: user.username, email: user.email },
            "1h"
          );

          return res.redirect(
            `http://localhost:3000/online-store?token=${token}`
          );
        });
      } catch (err) {
        console.error("Error handling customer record:", err);
        return res.redirect("http://localhost:3000/customer-login");
      }
    }
  )(req, res);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
