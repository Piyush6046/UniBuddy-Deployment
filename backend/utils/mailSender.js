const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter once and reuse it
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465, // Use 465 for SSL (More reliable on Render)
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailSender = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: `"Student Guide" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    if (html) {
      mailOptions.html = html;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email successfully sent to ${to}`);
    return info;
  } catch (error) {
    console.error("❌ Error sending mail:", error.message);
    throw error;
  }
};

module.exports = mailSender;
