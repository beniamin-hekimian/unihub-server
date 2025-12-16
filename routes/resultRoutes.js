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

// GET /results/professor?professorId=...
router.get("/professor", getResultsByProfessor);

// GET /results/exam/:examId
router.get("/exam/:examId", getResultsByExam);

// GET /results/student?studentId=...
router.get("/student", getResultsByStudent);

// POST /results
router.post("/", createResult);

// PUT /results/:id
router.put("/:id", updateResult);

// DELETE /results/:id
router.delete("/:id", deleteResult);

module.exports = router;
