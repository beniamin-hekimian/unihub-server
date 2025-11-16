const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// GET /students
router.get("/", getAllStudents);

// POST /students
router.post("/", createStudent);

// PUT /students/:id
router.put("/:id", updateStudent);

// DELETE /students/:id
router.delete("/:id", deleteStudent);

module.exports = router;
