const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    major: {
        type: String,
    },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
