const express = require("express");
const router = express.Router();
const {
    getAllExams,
    createExam,
    updateExam,
    deleteExam,
} = require("../controllers/examController");
// GET all exams
router.get("/", getAllExams);

// POST create exam
router.post("/", createExam);

// PUT update exam
router.put("/:id", updateExam);

// DELETE delete exam
router.delete("/:id", deleteExam);

module.exports = router;