const app = require("./app");
const port = process.env.PORT || 3002;
const { initializeWebSocket } = require("./websocket");
const http = require("http");

const server = http.createServer(app);
initializeWebSocket(server);

const Admin = require("./database/models/adminModel");
const bcrypt = require("bcrypt");

const createAdminAccount = async ({ email, password }) => {
  try {
    if (!email || !password) {
      console.error("Email and password are required.");
      return;
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      console.log(`An admin with email ${email} already exists.`);
      return;
    }

    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    console.log(`Admin account for ${email} created successfully.`);
    console.log("Admin details:", {
      id: newAdmin.id,
      email: newAdmin.email,
      createdAt: newAdmin.createdAt,
    });
  } catch (error) {
    console.error("Error in createAdminAccount service:", error);
  }
};

// Create two admin accounts with different email addresses and passwords
createAdminAccount({ email: "admin2@gmail.com", password: "admin123" });
createAdminAccount({ email: "admin3@gmail.com", password: "admin123" });

// Start the server after creating the admin accounts
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
