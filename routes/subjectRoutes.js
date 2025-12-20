const express = require("express");
const router = express.Router();
const {
  getAllSubjects,
  getSubjectsByProfessor,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");
const { requireRole } = require("../middlewares/role");

// GET /subjects
router.get("/", requireRole(["admin"]), getAllSubjects);

// GET /subjects/professor/:professorId
router.get(
  "/professors/:professorId",
  requireRole(["professor"]),
  getSubjectsByProfessor
);

// POST /subjects
router.post("/", requireRole(["admin"]), createSubject);

// PUT /subjects/:id
router.put("/:id", requireRole(["admin"]), updateSubject);

// DELETE /subjects/:id
router.delete("/:id", requireRole(["admin"]), deleteSubject);

module.exports = router;
