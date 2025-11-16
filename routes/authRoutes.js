const express = require("express");
const router = express.Router();
const { signin, me } = require("../controllers/authController");

// POST /auth/signin
router.post("/signin", signin);

// GET /auth/me
router.get("/me", me);

module.exports = router;
