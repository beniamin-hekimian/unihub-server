const express = require("express");
const router = express.Router();
const { signin, me, signout } = require("../controllers/authController");

// POST /auth/signin
router.post("/signin", signin);

// GET /auth/me
router.get("/me", me);

// POST /auth/signout
router.post("/signout", signout);

module.exports = router;
