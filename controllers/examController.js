const Exam = require("../models/Exam");
const Enrolment = require("../models/Enrolment");
const Result = require("../models/Result");

// GET all exams
const getAllExams = async (req, res) => {
    try {
        const { studentId, examId } = req.query;
        const filter = {};
        if (studentId) {
            filter.studentId = studentId;
        }
        if (examId) {
            filter.examId = examId;
        }
        const exams = await Exam.find(filter)
            .populate({
                path: "studentId",
            })
            .populate({
                path: "examId",
            });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createExam = async (req, res) => {
    try {
        const { name, date, duration, subjectId } = req.body;

        const exam = await Exam.create({
            name,
            date,
            duration,
            subjectId,
        });

        const populatedExam = await Exam.findById(exam._id).populate({
            path: "subjectId",
        });

        const filter = {subjectId, passed: false};
        const enrolments = Enrolment.find(filter);
        for (const enrolment of enrolments) {
            const result = await Result.create({
                studentId: enrolment.studentId,
                examId: populatedExam._id,
            });
        }
        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, duration, subjectId } = req.body;
        const exam = await Exam.findByIdAndUpdate(id, {
            name,
            date,
            duration,
            subjectId,
        });
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await Exam.findByIdAndDelete(id);
        const filter = {examId: id};
        const results = await Result.deleteMany(filter);
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllExams,
    createExam,
    updateExam,
    deleteExam,
};
