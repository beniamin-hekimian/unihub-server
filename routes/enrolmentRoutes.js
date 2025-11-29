const express = require("express");
const router = express.Router();

const {
    getSubjectsByStudent,
    getStudentsBySubject,
    deleteBySubject,
    deleteByStudent,
    createEnrolment,
    updateEnrolment,
} = require("../controllers/enrolmentController");

//Get all subjects of a student
router.get("/student/:studentId", getSubjectsByStudent);

//Get all students of a subject
router.get("/subject/:subjectId", getStudentsBySubject);

//Delete all enrolments for a subject
router.delete("/subject/:subjectId", deleteBySubject);

//Delete all enrolments for a student
router.delete("/student/:studentId", deleteByStudent);

//Create an enrolment 
router.post("/", createEnrolment);

// update an enrolment
router.put("/", updateEnrolment);

module.exports = router;
