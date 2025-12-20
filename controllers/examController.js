const Exam = require("../models/Exam");
const Subject = require("../models/Subject");
const Enrolment = require("../models/Enrolment");
const Result = require("../models/Result");

// Get exams for the professor
async function getExamsByProfessor(req, res) {
  try {
    const { professorId } = req.query;

    if (!professorId) {
      return res.status(400).json({ message: "Professor ID is required" });
    }

    // Find subjects assigned to this professor
    const subjects = await Subject.find({ professorId }).select("_id");

    const subjectIds = subjects.map((s) => s._id);

    if (subjectIds.length === 0) {
      return res.status(200).json({ exams: [] });
    }

    // Find exams for those subjects
    const exams = await Exam.find({
      subjectId: { $in: subjectIds },
    })
      .populate("subjectId", "name year department")
      .sort({ date: 1 });

    res.status(200).json({ exams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get exams for the student
async function getExamsByStudent(req, res) {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // 1. Get subjectIds from enrolments of this student
    const enrolments = await Enrolment.find({
      studentId,
      passed: false,
    }).select("subjectId");
    const subjectIds = enrolments.map((e) => e.subjectId);

    if (subjectIds.length === 0) {
      return res.status(200).json({ exams: [] });
    }

    // 2. Get exams for those subjects
    const exams = await Exam.find({
      subjectId: { $in: subjectIds },
    })
      .populate("subjectId", "name year department")
      .sort({ date: 1 });

    res.status(200).json({ exams });
  } catch (error) {
    console.error("getExamsByStudent error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Create a new exam by the professor
async function createExam(req, res) {
  try {
    const { subjectId, date, duration, location } = req.body;

    if (!subjectId || !date) {
      return res.status(400).json({ message: "subjectId & date are required" });
    }

    const exam = await Exam.create({
      subjectId,
      date,
      duration,
      location,
    });

    const populatedExam = await Exam.findById(exam._id).populate({
      path: "subjectId",
    });

    res.status(201).json({
      message: "Exam created successfully",
      exam: populatedExam,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update an existing exam
async function updateExam(req, res) {
  try {
    const { id } = req.params;
    const { subjectId, date, duration, location } = req.body;
    const exam = await Exam.findByIdAndUpdate(
      id,
      { subjectId, date, duration, location },
      { new: true } // return the updated document
    ).populate("subjectId", "name year department");

    res.status(200).json({
      message: "Exam updated successfully",
      exam,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete an existing exam
async function deleteExam(req, res) {
  try {
    const { id } = req.params;

    // 1. Delete all results for this exam
    await Result.deleteMany({ examId: id });

    // 2. Delete the exam itself
    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({
      message: "Exam and related results deleted successfully",
      exam,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getExamsByProfessor,
  getExamsByStudent,
  createExam,
  updateExam,
  deleteExam,
};
