
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 50 },
    college: { type: String, required: true, trim: true, maxLength: 100 },
    gender: { type: String, trim: true, maxLength: 50 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minLength: 6 },

    role: {
      type: String,
      enum: ["student", "admin", "vendor", "mentor"],
      default: "student",
      required: true,
    },

    department: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      trim: true,
    },

    year: {
      type: Number,
      required: function () {
        return this.role === "student";
      },
      min: 1,
      max: 4,
    },

    phone: { type: String, required: true, trim: true },

    profileImage: {
      url: {
        type: String,
        default: "https://via.placeholder.com/150", // fallback default URL
      },
      public_id: {
        type: String,
        default: null, // no public_id if default image is used
      },
    },

    // Login management
    isLogin: { type: Boolean, default: false },
    loginExpiry: { type: Date, default: null },

    // Profile references
    mentorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      default: null,
    },
    // Books: allow multiple
    booksProfile: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        default: [],
      },
    ],

    // Premium status
    isPremium: {
      type: Boolean,
      default: false,
    },
    interviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
