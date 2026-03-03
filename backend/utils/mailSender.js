const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter lazily so dotenv values are always loaded first
const getTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,        // 587 with STARTTLS is the most reliable for Gmail App Passwords
    secure: false,   // false = STARTTLS (upgrades connection after connect)
    requireTLS: true, // force TLS upgrade
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // helps on some hosting environments
    },
  });
};

const mailSender = async (to, subject, text, html = null) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPass) {
    console.error("❌ Email env vars missing: EMAIL_USER or EMAIL_PASSWORD not set.");
    throw new Error("Email configuration missing.");
  }

  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Student Guide" <${emailUser}>`,
      to,
      subject,
      text,
    };

    if (html) {
      mailOptions.html = html;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email successfully sent to ${to} | MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Error sending mail to", to);
    console.error("   Code:", error.code);
    console.error("   Message:", error.message);
    throw error;
  }
};

module.exports = mailSender;
