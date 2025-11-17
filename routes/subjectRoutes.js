const express = require("express");
const router = express.Router();
const {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

// GET /subjects
router.get("/", getAllSubjects);

// POST /subjects
router.post("/", createSubject);

// PUT /subjects/:id
router.put("/:id", updateSubject);

// DELETE /subjects/:id
router.delete("/:id", deleteSubject);

module.exports = router;
