const express = require("express");
const router = express.Router();
const {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} = require("../controllers/studentController");
const { requireRole } = require("../middlewares/role");

// GET /students
router.get("/", requireRole(["admin"]), getAllStudents);

// POST /students
router.post("/", requireRole(["admin"]), createStudent);

// PUT /students/:id
router.put("/:id", requireRole(["admin"]), updateStudent);

// DELETE /students/:id
router.delete("/:id", requireRole(["admin"]), deleteStudent);

module.exports = router;
