const mongoose = require("mongoose");
const Subject = require("../models/Subject");
const Student = require("../models/Student");
const Enrolment = require("../models/Enrolment");
const Exam = require("../models/Exam");

// GET /subjects (admin)
async function getAllSubjects(_, res) {
  try {
    const subjects = await Subject.find().populate({
      path: "professorId",
      populate: { path: "userId", select: "name email gender" },
    });

    res.status(200).json({
      message: "Subjects fetched successfully",
      subjects,
    });
  } catch (error) {
    console.error("getAllSubjects Error:", error);
    res.status(500).json({
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
}

// GET /subjects/professors/:professorId (professor)
async function getSubjectsByProfessor(req, res) {
  try {
    const { professorId } = req.params;

    const subjects = await Subject.aggregate([
      {
        $match: {
          professorId: new mongoose.Types.ObjectId(professorId),
        },
      },
      {
        $lookup: {
          from: "enrolments",
          localField: "_id",
          foreignField: "subjectId",
          as: "enrolments",
        },
      },
      {
        $addFields: {
          enrolmentCount: { $size: "$enrolments" },
        },
      },
      {
        $project: {
          enrolments: 0,
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    res.status(200).json({
      message: "Professor subjects fetched successfully",
      subjects,
    });
  } catch (error) {
    console.error("getSubjectsByProfessor Error:", error);
    res.status(500).json({
      message: "Failed to fetch professor subjects",
      error: error.message,
    });
  }
}

// POST /subjects
async function createSubject(req, res) {
  try {
    // Create the subject
    const subject = await Subject.create(req.body);

    // Find all students in the same year as the new subject
    const students = await Student.find({ year: subject.year });

    // Prepare enrolment documents
    const enrolments = students.map(student => ({
      studentId: student._id,
      subjectId: subject._id
    }));

    // Insert all enrolments at once
    if (enrolments.length > 0) {
      await Enrolment.insertMany(enrolments);
    }

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create subject",
      error: error.message,
    });
  }
}

// PUT /subjects/:id
async function updateSubject(req, res) {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update subject",
      error: error.message,
    });
  }
}

// DELETE /subjects/:id
async function deleteSubject(req, res) {
  try {
    const { id } = req.params;

    // 1. Check if subject exists
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // 2. Check if exams exist for this subject
    const hasExams = await Exam.exists({ subjectId: id });

    if (hasExams) {
      return res.status(400).json({
        message: "Cannot delete subject. Delete related exams first.",
      });
    }

    // 3. Safe to delete
    await Subject.findByIdAndDelete(id);

    res.status(200).json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete subject",
      error: error.message,
    });
  }
}

module.exports = {
  getAllSubjects,
  getSubjectsByProfessor,
  createSubject,
  updateSubject,
  deleteSubject,
};
