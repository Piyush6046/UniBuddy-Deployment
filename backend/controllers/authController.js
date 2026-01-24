const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const User = require("../models/User");
const generateUniqueOTP = require("../utils/otpGenerator");
const mailSender = require("../utils/mailSender");




exports.Signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      year,
      phone,
      gender,
      college
    } = req.body;



    // 1. Check if user already exists
    const existuser = await User.findOne({ email });
    if (existuser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please use a new email.",
      });
    }

    // 2. Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error while hashing password",
      });
    }

    // 3. Create new user
    const newUser = await User.create({
      name,
      college,
      gender,
      email,
      password: hashedPassword,
      role,
      department: role === "student" ? department : undefined,
      year: role === "student" ? year : undefined,
      phone,
      isLogin: true,
      loginExpiry: Date.now() + 2 * 60 * 60 * 1000, // 2 hours

    });

    // 4. Create payload for JWT
    const payload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      department: newUser.department,
      year: newUser.year,
      college: newUser.college,
      gender: newUser.gender,
    };

    // 5. Sign JWT token
    const token = jwt.sign(payload, "LASTCHANSE", { expiresIn: "2d" });
    payload.token = token;

    // 6. Cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "None", // Allow cross-origin
      secure: true,     // Must be HTTPS in production
    };

    // 7. Send response with cookie
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      payload,
      message: "User signup and login successful",
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during signup",
    });
  }
};





exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill  all the details carefully ",
      })
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email is not exist plase signup first "
      })
    }

    // if user exist check password if password match create token
    // 3. Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid password",
      });
    }
    if (user.isLogin && user.loginExpiry < Date.now()) {
      user.isLogin = false;
      await user.save();
    }



    // ✅ Nuclear Fix: Always override session on password match
    // This kills the "active session" error forever.
    user.isLogin = true;
    user.loginExpiry = Date.now() + (2 * 60 * 60 * 1000); // 2 hours
    await user.save();

    console.log("Session refreshed for:", user.email);

    // 4. Create payload
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      department: user.department,
      year: user.year,
      college: user.college,
    };

    const token = jwt.sign(payload, "LASTCHANSE", { expiresIn: "2d" });

    // Cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'None',
      secure: true
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      payload,
      message: "Login successful",
    });

  } catch (err) {
    console.error("CRITICAL LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
}

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = req.cookies?.token || authHeader?.replace("Bearer ", "");

    console.log("--- START LOGOUT PROCESS ---");

    if (token) {
      try {
        // Decode even if expired
        const decoded = jwt.verify(token, "LASTCHANSE", { ignoreExpiration: true });
        if (decoded && decoded.id) {
          console.log("Logout: Clearing session for User ID:", decoded.id);
          await User.findByIdAndUpdate(decoded.id, {
            $set: { isLogin: false, loginExpiry: null }
          });
        }
      } catch (jwtErr) {
        console.warn("Logout: Token decode failed, but proceeding with cookie clear.");
      }
    }

    // Always clear cookies
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    console.log("--- LOGOUT COMPLETE ---");

    return res.status(200).json({
      success: true,
      message: "Logged out",
    });

  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    // Still return success to allow frontend to continue
    return res.status(200).json({ success: true, message: "Logged out locally" });
  }
};




exports.sendOtp = async (req, res) => {
  console.log(req.body, "Requesting OTP");
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Use Login or try another Email.",
      });
    }

    // Generate REAL Unique OTP
    const otp = await generateUniqueOTP();

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });

    // Send Real Email
    try {
      await mailSender(
        email,
        "Verify your Email - Student Guide",
        `Your OTP is ${otp}. It is valid for 5 minutes. Please do not share this with anyone.`
      );
      console.log(`✅ OTP sent to ${email}`);
    } catch (mailError) {
      console.error("❌ Failed to send email:", mailError.message);
      // We still return success as we can debug via console if mail fails, 
      // but ideally we should fail. For now, let's allow it but log error.
      // Or actually, if mail fails, client can't verify. So maybe return error?
      // Let's stick to standard flow: if mail fails, user can't verify.
      return res.status(500).json({
        success: false,
        message: "Could not send OTP email. Please check your email configuration."
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email."
    });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// @desc    Verify the OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    await Otp.deleteOne({ _id: record._id });
    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};







// @desc    Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
