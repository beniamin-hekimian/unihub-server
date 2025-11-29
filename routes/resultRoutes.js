const express = require("express");
const router = express.Router();
const {
    getAllResults,
    createResult,
    updateResult,
    deleteResult,
} = require("../controllers/resultController");
// GET all results
router.get("/", getAllResults);

// POST create result
router.post("/", createResult);

// PUT update result
router.put("/:id", updateResult);

// DELETE delete result
router.delete("/:id", deleteResult);

module.exports = router;