const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /auth/signin
async function signin(req, res) {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    // 2️⃣ Compare password
    if (password !== user.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // 3️⃣ Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4️⃣ Set token in HTTP-only cookie
    res.cookie("my-token-cookie", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    });

    // 5️⃣ Return minimal user info
    res.json({
      message: "Signed in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("AuthController Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /auth/me
async function me(req, res) {
  try {
    const token = req.cookies["my-token-cookie"]; // match cookie name
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("MeController Error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
}

// POST /auth/signout
function signout(_, res) {
  try {
    res.clearCookie("my-token-cookie", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Signout Error:", error.message);
    res.status(500).json({ message: "Server error during logout" });
  }
}

module.exports = { signin, me, signout };
