const express = require("express");
const router = express.Router();
const {
    getAllProfessors,
    createProfessor,
    updateProfessor,
    deleteProfessor,
} = require("../controllers/professorController");
const { requireRole } = require("../middlewares/role");

// GET /professors
router.get("/", requireRole(["admin"]), getAllProfessors);

// POST /professors
router.post("/", requireRole(["admin"]), createProfessor);

// PUT /professors/:id
router.put("/:id", requireRole(["admin"]), updateProfessor);

// DELETE /professors/:id
router.delete("/:id", requireRole(["admin"]), deleteProfessor);

module.exports = router;
