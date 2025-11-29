const mongoose = require("mongoose");

const professorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
});

const Professor = mongoose.model("Professor", professorSchema);

module.exports = Professor;
