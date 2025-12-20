const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies["my-token-cookie"];
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { requireAuth };
