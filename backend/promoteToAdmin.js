const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

// Usage: node promoteToAdmin.js <email>
// Example: node promoteToAdmin.js myemail@example.com

const targetEmail = process.argv[2] || "instructoplus@gmail.com"; // Default to your mailer email

const promote = async () => {
    try {
        // 1. Connect
        // Check .env DATABASE_URL
        const dbUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/UniBuddy";
        await mongoose.connect(dbUrl);
        console.log("✅ Connected to DB");

        // 2. Find and Update
        const user = await User.findOne({ email: targetEmail });
        if (!user) {
            console.log(`❌ User not found: ${targetEmail}`);
            console.log("   Please sign up first or provide correct email argument.");
        } else {
            user.role = "admin";
            await user.save();
            console.log(`🎉 Success! User '${user.name}' (${user.email}) is now an ADMIN.`);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
};

promote();
