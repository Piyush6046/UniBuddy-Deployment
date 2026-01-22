const cloudinary = require("cloudinary").v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// ⚠️ IF NO KEYS: use dummy values so app doesn't crash on startup
// File uploads WILL FAIL, but the rest of the app will work.
cloudinary.config({
  cloud_name: cloudName || "dummy_cloud",
  api_key: apiKey || "123456789012345",
  api_secret: apiSecret || "dummy_secret",
});

module.exports = cloudinary;
