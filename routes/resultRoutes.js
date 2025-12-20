const express = require("express");
const router = express.Router();
const {
  getResultsByProfessor,
  getResultsByExam,
  getResultsByStudent,
  createResult,
  updateResult,
  deleteResult,
} = require("../controllers/resultController");
const { requireRole } = require("../middlewares/role");

// GET /results/professor?professorId=...
router.get("/professor", requireRole(["professor"]), getResultsByProfessor);

// GET /results/exam/:examId
router.get("/exam/:examId", requireRole(["professor"]), getResultsByExam);

// GET /results/student?studentId=...
router.get("/student", requireRole(["student"]), getResultsByStudent);

// POST /results
router.post("/", requireRole(["professor"]), createResult);

// PUT /results/:id
router.put("/:id", requireRole(["professor"]), updateResult);

// DELETE /results/:id
router.delete("/:id", requireRole(["professor"]), deleteResult);

module.exports = router;
