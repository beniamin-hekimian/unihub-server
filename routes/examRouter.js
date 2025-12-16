const express = require("express");
const router = express.Router();
const {
  getExamsByProfessor,
  getExamsByStudent,
  createExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

// GET /exams/professor?professorId=...
router.get("/professor", getExamsByProfessor);

// GET /exams/student?studentId=...
router.get("/student", getExamsByStudent);

// POST create exam
router.post("/", createExam);

// PUT update exam
router.put("/:id", updateExam);

// DELETE delete exam
router.delete("/:id", deleteExam);

module.exports = router;
