function requireRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.user; // set by requireAuth
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
}

module.exports = { requireRole };
