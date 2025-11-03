const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/signin
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
      },
    });
  } catch (error) {
    console.error("AuthController Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { signin };
