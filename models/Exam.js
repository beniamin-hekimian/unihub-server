const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, //minutes
    },
    location: {
        type: String,
    },
});

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
