const Subject = require("../models/Subject");
const Student = require("../models/Student");
const Enrolment = require("../models/Enrolment");

// GET all subjects
async function getAllSubjects(req, res) {
    try {
        const { professorId } = req.query;

        // Build filter object dynamically
        const filter = {};
        if (professorId) {
            filter.professorId = professorId;
        }

        // Fetch subjects with optional filtering
        const subjects = await Subject.find(filter).populate({
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

// Create a new subject
async function createSubject(req, res) {
    try {
        const { name, year, department, professorId } = req.body;

        // 1️⃣ Create the subject
        const subject = await Subject.create({
            name,
            year,
            department,
            professorId: professorId || null,
        });

        // 2️⃣ Populate professorId so frontend gets data immediately
        const populatedSubject = await Subject.findById(subject._id).populate({
            path: "professorId",
            populate: { path: "userId", select: "name email gender" },
        });

        const students = await Student.find({year: subject.year});
        for (let student of students) {
            await Enrolment.create({
                studentId: student._id,
                subjectId: subject._id
            });
        }

        res.status(201).json({
            message: "Subject created successfully",
            subject: populatedSubject,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create subject",
            error: error.message,
        });
    }
}

// Update a subject
async function updateSubject(req, res) {
    try {
        const { id } = req.params;
        const { name, year, department, professorId } = req.body;

        // 1️⃣ Find the subject by ID
        const subject = await Subject.findById(id);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        const oldYear = subject.year;

        // 2️⃣ Update basic fields
        if (name) subject.name = name;
        if (department) subject.department = department;
        subject.professorId = professorId || null;

        // 3️⃣ If year changed → resync enrolments
        if (year && year !== oldYear) {
            subject.year = year;

            // Remove old enrolments
            await Enrolment.deleteMany({ subjectId: subject._id });

            // Enrol new year students
            const students = await Student.find({ year });

            const enrolments = students.map((student) => ({
                studentId: student._id,
                subjectId: subject._id,
            }));

            if (enrolments.length) {
                await Enrolment.insertMany(enrolments);
            }
        }

        await subject.save();

        // 4️⃣ Populate professorId for frontend
        const populatedSubject = await Subject.findById(subject._id).populate({
            path: "professorId",
            populate: { path: "userId", select: "name email gender" },
        });

        res.status(200).json({
            message: "Subject updated successfully",
            subject: populatedSubject,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update subject",
            error: error.message,
        });
    }
}

// Delete a subject
async function deleteSubject(req, res) {
    const subjectId = req.params.id;

    try {
        // 1️⃣ Find the subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // 2️⃣ Delete that subject
        await Subject.findByIdAndDelete(subjectId);

        // 3️⃣ Delete all the enrolments of that subject
        await Enrolment.deleteMany({ subjectId });

        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete subject",
            error: error.message,
        });
    }
}

module.exports = {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
};
