require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (email, pin) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification Code",
    html: `<p>Your verification code is: <strong>${pin}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Unable to send email.");
  }
};

module.exports = { sendEmail };
