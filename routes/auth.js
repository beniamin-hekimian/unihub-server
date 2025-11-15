const express = require("express");
const router = express.Router();
const { signin, me } = require("../controllers/authController");

// POST /api/auth/signin
router.post("/signin", signin);

// GET /api/auth/me
router.get("/me", me);

module.exports = router;
