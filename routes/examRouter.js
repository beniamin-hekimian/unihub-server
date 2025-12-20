const express = require("express");
const router = express.Router();
const {
  getExamsByProfessor,
  getExamsByStudent,
  createExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");
const { requireRole } = require("../middlewares/role");

// GET /exams/professor?professorId=...
router.get("/professor",requireRole(["professor"]), getExamsByProfessor);

// GET /exams/student?studentId=...
router.get("/student", requireRole(["student"]), getExamsByStudent);

// POST create exam
router.post("/", requireRole(["professor"]), createExam);

// PUT update exam
router.put("/:id", requireRole(["professor"]), updateExam);

// DELETE delete exam
router.delete("/:id", requireRole(["professor"]), deleteExam);

module.exports = router;
