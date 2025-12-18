const express = require("express");
const router = express.Router();
const {
    getAllSubjects,
    getSubjectsByProfessor,
    createSubject,
    updateSubject,
    deleteSubject,
} = require("../controllers/subjectController");

// GET /subjects
router.get("/", getAllSubjects);

// GET /subjects/professor/:professorId
router.get("/professors/:professorId", getSubjectsByProfessor);

// POST /subjects
router.post("/", createSubject);

// PUT /subjects/:id
router.put("/:id", updateSubject);

// DELETE /subjects/:id
router.delete("/:id", deleteSubject);

module.exports = router;
