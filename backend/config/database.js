const mongoose = require("mongoose");

require("dotenv").config();

exports.dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => {
            console.log("✅ Database Connected Successfully");
        }).
        catch((err) => {
            console.log("❌ Database Connection Failed");
            console.error(err.message);
            process.exit(1);
        })
}