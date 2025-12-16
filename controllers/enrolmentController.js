const Enrolment = require("../models/Enrolment");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
// GET enrolments by subject
async function getStudentsBySubject(req, res) {
    try {
        const { subjectId } = req.params;
        const students = await Enrolment.find({ subjectId })
            .populate("studentId", "name email gender");
        return res.json({
            message: "Fetched students for subject",
            students,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch students for subject",
            error: err.message,
        });
    }
}

// Get enrolments by student
async function getSubjectsByStudent(req, res) {
    try {
        const { studentId } = req.params;
        const subjects = await Enrolment.find({ studentId })
            .populate("subjectId", "name year department");
        return res.json({
            message: "Fetched subjects for student",
            subjects,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch subjects for student",
            error: err.message,
        });
    }
}

// Delete all enrolments of a subject
async function deleteBySubject(req, res) {
    try {
        const { subjectId } = req.params;
        const result = await Enrolment.deleteMany({ subjectId });
        return res.json({
            message: "Deleted enrolments for subject",
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to delete enrolments of a subject",
            error: err.message,
        });
    }
}

// Delete all enrolments of a student
async function deleteByStudent(req, res) {
    try {
        const { studentId } = req.params;
        const result = await Enrolment.deleteMany({ studentId });
        return res.json({
            message: "Deleted enrolments for student",
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to delete enrolments of a student",
            error: err.message,
        });
    }
}

// Update an enrolment
async function updateEnrolment(req, res) {
    try {
        const { studentId, subjectId } = req.body;
        const enrolment = await Enrolment.findOneAndUpdate(
            { studentId, subjectId },
            { passed: req.body.passed },
            {
                new: true,
                runValidators: true,
            }
        );
        return res.json({
            message: "Updated enrolment",
            enrolment,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to update enrolment",
            error: err.message,
        });
    }
}

// Create an enrolment
async function createEnrolment(req, res) {
    try {
        const { studentId, subjectId } = req.body;
        // Validate body
        if (!studentId || !subjectId) {
            return res
                .status(400)
                .json({ message: "studentId and subjectId are required" });
        }
        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // Check if subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        // Prevent duplicate enrolments
        const alreadyExists = await Enrolment.findOne({ studentId, subjectId });
        if (alreadyExists) {
            return res
                .status(400)
                .json({ message: "This enrolment already exists" });
        }
        // Create the enrolment
        const enrolment = await Enrolment.create({ studentId, subjectId });
        return res.status(201).json({
            message: "Enrolment created successfully",
            enrolment,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Failed to create a new enrolment",
            error: err.message,
        });
    }
}
module.exports = {
    getStudentsBySubject,
    getSubjectsByStudent,
    deleteBySubject,
    deleteByStudent,
    createEnrolment,
    updateEnrolment,
};
