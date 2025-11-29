const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
});

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
