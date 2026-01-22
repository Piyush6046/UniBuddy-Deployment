const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (to, subject, text, html = null) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false, // use false for STARTTLS; true for 465
    });

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
