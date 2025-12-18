const Result = require("../models/Result");
const Subject = require("../models/Subject");
const Enrolment = require("../models/Enrolment");
const Exam = require("../models/Exam");

// GET /results/professor?professorId=...
async function getResultsByProfessor(req, res) {
  try {
    const { professorId } = req.query;

    if (!professorId) {
      return res.status(400).json({ message: "Professor ID is required" });
    }

    // 1. Get subjects taught by this professor
    const subjects = await Subject.find({ professorId }).select("_id");
    const subjectIds = subjects.map((s) => s._id);

    if (subjectIds.length === 0) return res.status(200).json({ exams: [] });

    // 2. Get exams for those subjects
    const exams = await Exam.find({ subjectId: { $in: subjectIds } })
      .populate("subjectId", "name year department")
      .sort({ date: 1 });

    // 3. Attach result stats to each exam
    const examsWithResults = await Promise.all(
      exams.map(async (exam) => {
        const results = await Result.find({ examId: exam._id });
        const totalStudents = await Enrolment.countDocuments({ subjectId: exam.subjectId._id });

        return {
          _id: exam._id,
          subject: exam.subjectId,
          date: exam.date,
          totalResults: results.length,
          totalStudents,
          published:
            results.length > 0 ? results.every((r) => r.published) : false,
        };
      })
    );

    res.status(200).json({ exams: examsWithResults });
  } catch (error) {
    console.error("getResultsByProfessor error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /results/exam/:examId
async function getResultsByExam(req, res) {
  try {
    const { examId } = req.params;

    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required" });
    }

    // 1. Get exam + subject
    const exam = await Exam.findById(examId).populate(
      "subjectId",
      "name year department"
    );

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // 2. Get enrolled students for this subject
    const enrolments = await Enrolment.find({
      subjectId: exam.subjectId._id,
    }).populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    // 3. Get existing results for this exam
    const results = await Result.find({ examId });

    // 4. Merge students + results
    const students = enrolments.map((e) => {
      const existingResult = results.find(
        (r) => r.studentId.toString() === e.studentId._id.toString()
      );

      return {
        studentId: e.studentId._id,
        name: e.studentId.userId.name,
        email: e.studentId.userId.email,
        mark: existingResult?.mark ?? null,
        published: existingResult?.published ?? false,
        resultId: existingResult?._id ?? null,
      };
    });

    res.status(200).json({
      exam: {
        id: exam._id,
        date: exam.date,
        subject: exam.subjectId,
      },
      students,
    });
  } catch (error) {
    console.error("getResultsByExam error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /results/student?studentId=...
async function getResultsByStudent(req, res) {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    const results = await Result.find({
      studentId,
      published: true,
    })
      .populate({
        path: "examId",
        select: "date subjectId",
        populate: {
          path: "subjectId",
          select: "name year department",
        },
      })
      .sort({ "examId.date": -1 });

    const enrolments = await Enrolment.find({ studentId });

    const resultsWithStatus = results.map((r) => {
      const enrolment = enrolments.find(
        (e) => e.subjectId.toString() === r.examId.subjectId._id.toString()
      );

      return {
        ...r.toObject(),
        passed: enrolment?.passed ?? false,
      };
    });

    res.status(200).json({ results: resultsWithStatus });
  } catch (error) {
    console.error("getResultsByStudent error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /results
async function createResult(req, res) {
  try {
    const { studentId, examId, mark, published } = req.body;

    if (!studentId || !examId || mark === undefined) {
      return res.status(400).json({
        message: "studentId, examId and mark are required",
      });
    }

    // Prevent duplicate result for same student + exam
    const existingResult = await Result.findOne({
      studentId,
      examId,
    });

    if (existingResult) {
      return res.status(409).json({
        message: "Result already exists. Use update instead.",
      });
    }

    const result = await Result.create({
      studentId,
      examId,
      mark,
      published: published ?? false, // default draft
    });

    res.status(201).json({
      message: "Result created successfully",
      result,
    });
  } catch (error) {
    console.error("createResult error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /results/:id
async function updateResult(req, res) {
  try {
    const { id } = req.params;
    const { mark, published } = req.body;

    const result = await Result.findById(id);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    if (mark !== undefined) {
      result.mark = mark;
    }

    if (published !== undefined) {
      result.published = published;
    }

    await result.save();

    // PASS / FAIL LOGIC (only when published)
    if (result.published && result.mark >= 60) {
      // 1. Get exam to know subject
      const exam = await Exam.findById(result.examId).select("subjectId");

      if (exam) {
        // 2. Update enrolment
        await Enrolment.findOneAndUpdate(
          {
            studentId: result.studentId,
            subjectId: exam.subjectId,
          },
          { passed: true }
        );
      }
    }

    res.status(200).json({
      message: "Result updated successfully",
      result,
    });
  } catch (error) {
    console.error("updateResult error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /results/:id
async function deleteResult(req, res) {
  try {
    const { id } = req.params;

    const result = await Result.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    if (result.published) {
      return res.status(400).json({
        message: "Cannot delete a published result",
      });
    }

    await result.deleteOne();

    res.status(200).json({
      message: "Result deleted successfully",
    });
  } catch (error) {
    console.error("deleteResult error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getResultsByProfessor,
  getResultsByExam,
  getResultsByStudent,
  createResult,
  updateResult,
  deleteResult,
};
