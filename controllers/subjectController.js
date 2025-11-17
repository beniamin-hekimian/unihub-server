const Subject = require("../models/Subject");

// GET all subjects
async function getAllSubjects(_, res) {
  try {
    // populate the professor info
    const subjects = await Subject.find().populate({
      path: "professorId",
      populate: { path: "userId", select: "name email gender" },
    });

    res.status(200).json({
      message: "Subjects fetched successfully",
      subjects,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch subjects", error: error.message });
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

    // 2️⃣ Update subject-specific fields
    if (name) subject.name = name;
    if (year) subject.year = year;
    if (department) subject.department = department;
    subject.professorId = professorId || null;

    await subject.save();

    // 3️⃣ Populate professorId for frontend
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
    res
      .status(500)
      .json({ message: "Failed to update subject", error: error.message });
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

    // 2️⃣ Delete the subject
    await Subject.findByIdAndDelete(subjectId);

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete subject", error: error.message });
  }
}

module.exports = {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};
