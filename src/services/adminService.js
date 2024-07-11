const bcrypt = require("bcrypt");
const { createTokenWithExpiration } = require("../utils/tokenUtils");
const { adminUsername, adminPassword } = require("../utils/passwordUtils");

const adminLogIn = async ({ email, password }) => {
  try {
    if (email !== adminUsername) {
      throw {
        status: 404,
        data: { message: "Admin email is incorrect." },
      };
    }
    const saltRounds = 10;
    const adminHashedPassword = await bcrypt.hash(adminPassword, saltRounds);
    const isPasswordMatch = await bcrypt.compare(password, adminHashedPassword);

    if (isPasswordMatch) {
      const token = createTokenWithExpiration(
        { email: adminUsername, role: "admin" },
        "30m"
      );

      return {
        status: 200,
        message: "Successful log in",
        token: token,
      };
    } else {
      throw {
        status: 401,
        data: { message: "Incorrect password" },
      };
    }
  } catch (error) {
    console.error("Error in admin log in:", error);
    throw error;
  }
};

module.exports = { adminLogIn };
