const mongoose = require("mongoose");
const Subject = require("../models/Subject");

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
    const subject = await Subject.create(req.body);
    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
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
