const Result = require("../models/Result");
const Enrolment = require("../models/Enrolment");
const Exam = require("../models/Exam");

const getAllResults = async (req, res) => {
    try {
        const filter = {};
        if (req.studentId) {
            filter.studentId = req.studentId;
        }
        if (req.examId) {
            filter.examId = req.studentId;
        }
        const results = await Result.find(filter)
            .populate({
                path: "studentId",
                select: "name email gender",
            })
            .populate({
                path: "examId",
                select: "name date duration subjectId",
            });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createResult = async (req, res) => {
    try {
        const { studentId, examId, score } = req.body;
        if (!studentId || !examId || !score) {
            return res
                .status(400)
                .json({ error: "studentId, examId and score are required" });
        }
        const enrolment = await Enrolment.findOne({ studentId, examId });
        if (!enrolment) {
            return res.status(404).json({ error: "Enrolment not found" });
        }
        const tmpResult = await Result.find({ studentId, examId });
        if (tmpResult) {
            return res
                .status(400)
                .json({ message: "This enrolment already exists" });
        }
        const result = await Result.create({ studentId, examId, score });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId, examId, score } = req.body;
        const { oldStudentId, oldExamId, oldScore } = await Result.findById(id);
        if (!studentId) studentId = oldStudentId;
        if (!examId) examId = oldExamId;
        if (score == null) score = oldScore;
        else {
            const { subjectId } = Exam.findById(examId);
            if (score >= 60) {
                Enrolment.findOneAndUpdate(
                    { studentId, subjectId },
                    { studentId, subjectId, passed: true },
                    { new: true, runValidators: true }
                );
            } else {
                Enrolment.findOneAndUpdate(
                    { studentId, subjectId },
                    { studentId, subjectId, passed: false },
                    { new: true, runValidators: true }
                );
            }
        }
        const result = await Result.findByIdAndUpdate(
            id,
            {
                studentId,
                examId,
                score,
            },
            { new: true, runValidators: true }
        );
        if (!result) {
            return res.status(404).json({ error: "Result not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteResult = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Result.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: "Result not found" });
        }
        res.status(200).json({ message: "Result deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllResults,
    createResult,
    updateResult,
    deleteResult,
};
