const Student = require("../models/Student");
const User = require("../models/User");

// GET all students
async function getAllStudents(_, res) {
  try {
    // populate the user info
    const students = await Student.find().populate(
      "userId",
      "name email gender"
    );

    res.status(200).json({
      message: "Students fetched successfully",
      students,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: error.message });
  }
}

// Create a new student (and linked user)
async function createStudent(req, res) {
  try {
    const { name, email, password, role, gender, year, major } = req.body;

    // 1️⃣ Create the user first
    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      gender,
    });

    // 2️⃣ Create the student linked to the user
    const student = await Student.create({
      userId: user._id,
      year,
      major: major || null,
    });

    // 3️⃣ Populate userId so frontend gets name, email, gender immediately
    const populatedStudent = await Student.findById(student._id).populate(
      "userId"
    );

    res.status(201).json({
      message: "Student created successfully",
      student: populatedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create student",
      error: error.message,
    });
  }
}

// Update a student (and linked user)
async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password, gender, year, major } = req.body;

    // 1️⃣ Find the student by ID
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Update the linked user
    const user = await User.findById(student.userId);
    if (!user) {
      return res.status(404).json({ message: "Linked user not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Hash if using bcrypt
    if (gender) user.gender = gender;

    await user.save();

    // 3️⃣ Update student-specific fields
    if (year) student.year = year;
    if (major) student.major = major;

    await student.save();

    // 4️⃣ Populate userId for frontend
    const populatedStudent = await Student.findById(student._id).populate(
      "userId"
    );

    res.status(200).json({
      message: "Student updated successfully",
      student: populatedStudent,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update student", error: error.message });
  }
}

// Delete a student and its linked user
async function deleteStudent(req, res) {
  const studentId = req.params.id;

  try {
    // 1️⃣ Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2️⃣ Delete the linked user
    await User.findByIdAndDelete(student.userId);

    // 3️⃣ Delete the student
    await Student.findByIdAndDelete(studentId);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete student", error: error.message });
  }
}

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};
