const Professor = require("../models/Professor");
const User = require("../models/User");

// GET all professors
async function getAllProfessors(req, res) {
    try {
        const { department } = req.query;

        const filter = department ? { department } : {};

        const professors = await Professor.find(filter).populate({
            path: "userId",
            select: "name email gender",
        });

        res.status(200).json({ professors });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch professors" });
    }
}

// Create a new professor (and linked user)
async function createProfessor(req, res) {
    try {
        const { name, email, password, role, gender, phone, department } =
            req.body;

        // 1️⃣ Create the user first
        const user = await User.create({
            name,
            email,
            password,
            role: role || "professor",
            gender,
        });

        // 2️⃣ Create the professor linked to the user
        const professor = await Professor.create({
            userId: user._id,
            phone,
            department: department || null,
        });

        // 3️⃣ Populate userId so frontend gets name, email, gender immediately
        const populatedProfessor = await Professor.findById(
            professor._id
        ).populate("userId");

        res.status(201).json({
            message: "Professor created successfully",
            professor: populatedProfessor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create professor",
            error: error.message,
        });
    }
}

// Update a professor (and linked user)
async function updateProfessor(req, res) {
    try {
        const { id } = req.params;
        const { name, email, password, gender, phone, department } = req.body;

        // 1️⃣ Find the professor by ID
        const professor = await Professor.findById(id);
        if (!professor) {
            return res.status(404).json({ message: "Professor not found" });
        }

        // 2️⃣ Update the linked user
        const user = await User.findById(professor.userId);
        if (!user) {
            return res.status(404).json({ message: "Linked user not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // Hash if using bcrypt
        if (gender) user.gender = gender;

        await user.save();

        // 3️⃣ Update professor-specific fields
        if (phone) professor.phone = phone;
        if (department) professor.department = department;

        await professor.save();

        // 4️⃣ Populate userId for frontend
        const populatedProfessor = await Professor.findById(
            professor._id
        ).populate("userId");

        res.status(200).json({
            message: "Professor updated successfully",
            professor: populatedProfessor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update professor",
            error: error.message,
        });
    }
}

// Delete a professor and its linked user
async function deleteProfessor(req, res) {
    const professorId = req.params.id;

    try {
        // 1️⃣ Find the professor
        const professor = await Professor.findById(professorId);
        if (!professor) {
            return res.status(404).json({ message: "Professor not found" });
        }

        // 2️⃣ Delete the linked user
        await User.findByIdAndDelete(professor.userId);

        // 3️⃣ Delete the professor
        await Professor.findByIdAndDelete(professorId);

        res.status(200).json({ message: "Professor deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to delete professor",
            error: error.message,
        });
    }
}

module.exports = {
    getAllProfessors,
    createProfessor,
    updateProfessor,
    deleteProfessor,
};
