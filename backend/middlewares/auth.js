

const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  let token = null;

  // From cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // From header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "LASTCHANSE"); // Same secret as signup/login
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};








exports.isAdmin = (req, res, next) => {
  try {
    console.log("Checking Admin Role for:", req.user?.email, "Role:", req.user?.role);

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: `Access Denied: You are '${req.user.role}', but 'admin' access is required.`,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role verification failed",
    });
  }
}