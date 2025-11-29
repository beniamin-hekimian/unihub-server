const express = require("express");
const router = express.Router();
const {
    getAllProfessors,
    createProfessor,
    updateProfessor,
    deleteProfessor,
} = require("../controllers/professorController");

// GET /professors
router.get("/", getAllProfessors);

// POST /professors
router.post("/", createProfessor);

// PUT /professors/:id
router.put("/:id", updateProfessor);

// DELETE /professors/:id
router.delete("/:id", deleteProfessor);

module.exports = router;
