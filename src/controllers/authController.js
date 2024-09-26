const passport = require("../services/authService");
const Customer = require("../database/models/customerModel");
const Address = require("../database/models/addressModel");
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
        let existingCustomer = await Customer.findOne({
          where: { email: user.email },
        });

        if (existingCustomer) {
          if (existingCustomer.accountStatus === "Suspended") {
            return res.redirect("http://localhost:3000/account-suspended");
          }

          existingCustomer.username = user.username;
          existingCustomer.googleId = user.googleId;
          await existingCustomer.save();
        } else {
          existingCustomer = await Customer.create({
            username: user.username,
            email: user.email,
            googleId: user.googleId,
          });
        }

        const defaultAddress = await Address.findOne({
          where: {
            customerId: existingCustomer.id,
            isSetDefaultAddress: true,
          },
        });

        const defaultAddressId = defaultAddress ? defaultAddress.id : null;

        const token = createTokenWithExpiration(
          {
            id: existingCustomer.id,
            username: existingCustomer.username,
            email: existingCustomer.email,
            defaultAddressId,
          },
          "1h"
        );

        req.logIn(existingCustomer, (err) => {
          if (err) {
            console.error("Error during user login:", err);
            return res.redirect("/login");
          }

          return res.redirect(
            `http://localhost:3000/customer-login?token=${token}`
          );
        });
      } catch (err) {
        console.error("Error handling customer record:", err);
        return res.redirect("/login");
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
